<?php
/**
 * PDF Controller
 * 
 * Handles PDF generation requests.
 */

declare(strict_types=1);

namespace Controllers;

use Helpers\Response;
use Helpers\Database;
use Helpers\Auth;
use Helpers\PDFService;
use Helpers\Validator;

class PDFController extends BaseController
{
    /**
     * Generate biodata PDF
     * POST /api/generate-pdf.php
     * 
     * Authentication is OPTIONAL - guests can generate free templates
     */
    public function generate(): void
    {
        try {
            // Get user if authenticated (optional - guests allowed)
            $user = Auth::user();
            $userId = $user ? (int) $user['id'] : 0; // 0 = guest user

            $data = $this->getJsonBody();

            // Validate input
            $validator = Validator::make($data)
                ->required('template_id', 'Template ID')
                ->required('form_data', 'Form data');

            if ($validator->fails()) {
                Response::validationError($validator->errors());
                return;
            }

            $templateId = (int) $data['template_id'];
            $formData = $data['form_data'];

            if (!is_array($formData)) {
                Response::error('Form data must be an object', 400);
                return;
            }

            $db = Database::getInstance();
            $template = null;

            // Try to get template from DB, otherwise fall back to default
            try {
                $template = $db->fetch(
                    "SELECT * FROM templates WHERE id = ? AND is_active = 1",
                    [$templateId]
                );
            } catch (\Exception $e) {
                error_log('Database fetch failed (Template): ' . $e->getMessage());
            }

            // If no template found or DB failed, use default
            if ($template === null) {
                $template = [
                    'id' => 1,
                    'name' => 'Classic Template',
                    'slug' => 'classic',
                    'template_file' => 'classic.html',
                    'price' => 0
                ];
            }

            // Skip premium check for guests - only free templates allowed
            // Only check if we successfully connected to DB
            if ($userId > 0 && (float) $template['price'] > 0) {
                try {
                    $hasPurchased = $db->exists(
                        'orders',
                        'user_id = ? AND template_id = ? AND status IN (?, ?)',
                        [$userId, $templateId, 'paid', 'free']
                    );

                    if (!$hasPurchased) {
                        Response::error('Please purchase this template to generate PDF', 402, [
                            'requires_payment' => true,
                            'price' => (float) $template['price'],
                        ]);
                        return;
                    }
                } catch (\Exception $e) {
                    // If DB check fails, we might want to allow or block. 
                    // For now, let's allow it to avoid blocking user due to system error.
                    error_log('Database check failed (Orders): ' . $e->getMessage());
                }
            }

            // Generate PDF
            try {
                $pdfService = new PDFService();
                $result = $pdfService->generate($template, $formData, $userId);
            } catch (\Exception $e) {
                error_log('PDF Generation Error: ' . $e->getMessage());
                throw new \Exception('PDF generation failed: ' . $e->getMessage());
            }

            // Generate download token
        $expiresAt = date('Y-m-d H:i:s', time() + 3600);
        
        // Use a stateless token (signed payload) to allow download even if DB insert fails
        // Payload: filename | expiry
        $secret = $_ENV['APP_KEY'] ?? 'BioDataMaker_Fallback_Secret_2025';
        $payload = base64_encode(json_encode([
            'f' => $result['filename'],
            'e' => strtotime($expiresAt)
        ]));
        $signature = hash_hmac('sha256', $payload, $secret);
        $downloadToken = $payload . '.' . $signature;

            // Try to save to database (optional)
            $biodataId = 0;
            $dbInsertSuccess = false;
            try {
                $biodataId = $db->insert('generated_biodatas', [
                    'user_id' => $userId,
                    'template_id' => $templateId,
                    'form_data' => json_encode($formData),
                    'pdf_filename' => $result['filename'],
                    'pdf_size' => $result['size'],
                    'generated_at' => date('Y-m-d H:i:s'),
                ]);

                // Update template download count
                $db->query(
                    "UPDATE templates SET download_count = download_count + 1 WHERE id = ?",
                    [$templateId]
                );

                // Save download token
                $db->insert('download_tokens', [
                    'biodata_id' => $biodataId,
                    'token' => $downloadToken,
                    'expires_at' => $expiresAt,
                    'max_downloads' => 5,
                    'download_count' => 0,
                ]);
                $dbInsertSuccess = true;
            } catch (\Exception $e) {
                // Log but don't fail - database is optional for now
                error_log('Database insert failed: ' . $e->getMessage());
            }

            // Determine download URL
            $downloadUrl = '/api/download.php?token=' . $downloadToken;
            if (!$dbInsertSuccess) {
                // Fallback to file-based download if DB failed
                $downloadUrl = '/api/download.php?file=' . urlencode($result['filename']);
            }

            // Return success with download URL
            Response::success([
                'biodata_id' => $biodataId,
                'filename' => $result['filename'],
                'size' => $result['size'],
                'download_token' => $downloadToken,
                'download_url' => $downloadUrl,
                'file_path' => $result['filepath'] ?? '',
                'expires_at' => $expiresAt,
            ], 'PDF generated successfully');

        } catch (\Throwable $e) {
            error_log('Critical Error in PDFController: ' . $e->getMessage());
            Response::error('Server Error: ' . $e->getMessage(), 500, [
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
        }
    }

    /**
     * Get user's generated biodatas
     * GET /api/my-biodatas.php
     */
    public function myBiodatas(): void
    {
        $user = Auth::user();
        if ($user === null) {
            Response::unauthorized('Please login');
        }

        $db = Database::getInstance();
        $pagination = $this->getPagination();

        $total = $db->count('generated_biodatas', 'user_id = ?', [$user['id']]);

        $biodatas = $db->fetchAll(
            "SELECT gb.*, t.name as template_name, t.slug as template_slug
            FROM generated_biodatas gb
            JOIN templates t ON gb.template_id = t.id
            WHERE gb.user_id = ?
            ORDER BY gb.created_at DESC
            LIMIT ? OFFSET ?",
            [$user['id'], $pagination['per_page'], $pagination['offset']]
        );

        // Format response
        $formatted = array_map(function($biodata) {
            return [
                'id' => (int) $biodata['id'],
                'template_name' => $biodata['template_name'],
                'template_slug' => $biodata['template_slug'],
                'filename' => $biodata['pdf_filename'],
                'size' => (int) $biodata['pdf_size'],
                'generated_at' => $biodata['generated_at'],
                'created_at' => $biodata['created_at'],
            ];
        }, $biodatas);

        Response::paginated($formatted, $pagination['page'], $pagination['per_page'], $total);
    }

    /**
     * Regenerate download token for existing biodata
     * POST /api/regenerate-token.php
     */
    public function regenerateToken(): void
    {
        $user = Auth::user();
        if ($user === null) {
            Response::unauthorized('Please login');
        }

        $data = $this->getJsonBody();

        if (empty($data['biodata_id'])) {
            Response::error('Biodata ID is required', 400);
        }

        $db = Database::getInstance();

        // Verify ownership
        $biodata = $db->fetch(
            "SELECT * FROM generated_biodatas WHERE id = ? AND user_id = ?",
            [(int) $data['biodata_id'], $user['id']]
        );

        if ($biodata === null) {
            Response::notFound('Biodata not found');
        }

        // Generate new token
        $expiresAt = date('Y-m-d H:i:s', time() + 3600);
        // Use a stateless token (signed payload) to allow download even if DB insert fails
        // Payload: filename | expiry
        $secret = $_ENV['APP_KEY'] ?? 'BioDataMaker_Fallback_Secret_2025';
        $payload = base64_encode(json_encode([
            'f' => $biodata['pdf_filename'], // Use biodata's filename
            'e' => strtotime($expiresAt)
        ]));
        $signature = hash_hmac('sha256', $payload, $secret);
        $downloadToken = $payload . '.' . $signature; // Format: payload.signature

        $db->insert('download_tokens', [
            'biodata_id' => $biodata['id'],
            'token' => $downloadToken,
            'expires_at' => $expiresAt,
            'max_downloads' => 5,
            'download_count' => 0,
        ]);

        Response::success([
            'download_token' => $downloadToken,
            'download_url' => '/api/download.php?token=' . $downloadToken,
            'expires_at' => $expiresAt,
        ], 'New download token generated');
    }
}
