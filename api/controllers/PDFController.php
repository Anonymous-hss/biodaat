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
        }

        $templateId = (int) $data['template_id'];
        $formData = $data['form_data'];

        if (!is_array($formData)) {
            Response::error('Form data must be an object', 400);
        }

        $db = Database::getInstance();

        // Get template
        $template = $db->fetch(
            "SELECT * FROM templates WHERE id = ? AND is_active = 1",
            [$templateId]
        );

        // If no template found, use default (for demo)
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
        if ($userId > 0 && (float) $template['price'] > 0) {
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
            }
        }

        // Generate PDF
        try {
            $pdfService = new PDFService();
            $result = $pdfService->generate($template, $formData, $userId);

            // Save to database
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

            // Generate download token (Level 6 will implement secure downloads)
            $downloadToken = bin2hex(random_bytes(32));
            $expiresAt = date('Y-m-d H:i:s', time() + 3600); // 1 hour expiry

            $db->insert('download_tokens', [
                'biodata_id' => $biodataId,
                'token' => $downloadToken,
                'expires_at' => $expiresAt,
                'max_downloads' => 5,
                'download_count' => 0,
            ]);

            Response::success([
                'biodata_id' => $biodataId,
                'filename' => $result['filename'],
                'size' => $result['size'],
                'download_token' => $downloadToken,
                'download_url' => '/api/download.php?token=' . $downloadToken,
                'expires_at' => $expiresAt,
            ], 'PDF generated successfully');

        } catch (\Exception $e) {
            error_log('PDF Generation Error: ' . $e->getMessage());
            Response::error('Failed to generate PDF. Please try again.', 500);
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
        $downloadToken = bin2hex(random_bytes(32));
        $expiresAt = date('Y-m-d H:i:s', time() + 3600);

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
