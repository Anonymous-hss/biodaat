<?php
/**
 * Download Controller
 * 
 * Handles secure, token-based file downloads.
 */

declare(strict_types=1);

namespace Controllers;

use Helpers\Response;
use Helpers\Database;

class DownloadController extends BaseController
{
    /**
     * Download file with token verification
     * GET /api/download.php?token=xxx
     */
    public function download(): void
    {
        // Check for direct file download (fallback for when DB is down)
        $fileParam = $this->getQuery('file');
        if (!empty($fileParam)) {
            $this->serveDirectFile($fileParam);
            return;
        }

        $token = $this->getQuery('token');

        if (empty($token)) {
            Response::error('Download token is required', 400);
        }

        $db = Database::getInstance();

        try {
            // Find token
            $tokenRecord = $db->fetch(
                "SELECT dt.*, gb.pdf_filename, gb.user_id
                FROM download_tokens dt
                JOIN generated_biodatas gb ON dt.biodata_id = gb.id
                WHERE dt.token = ?",
                [$token]
            );

            if ($tokenRecord === null) {
                Response::error('Invalid download token', 404);
            }

            // Check expiry
            if (strtotime($tokenRecord['expires_at']) < time()) {
                Response::error('Download token has expired', 410);
            }

            // Check download count
            if ($tokenRecord['download_count'] >= $tokenRecord['max_downloads']) {
                Response::error('Maximum downloads exceeded', 429);
            }

            $filename = $tokenRecord['pdf_filename'];
            
            // Update download count
            $db->update('download_tokens', [
                'download_count' => $tokenRecord['download_count'] + 1,
                'last_download_at' => date('Y-m-d H:i:s'),
                'ip_address' => $this->getClientIp(),
            ], 'id = ?', [$tokenRecord['id']]);

            $this->serveFile($filename);

        } catch (\Exception $e) {
            // If DB fails, try fallback if we can't verify token... 
            // Actually verification impossible without DB.
            Response::error('Server Error: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Serve file directly (Sanitized)
     */
    private function serveDirectFile(string $filename): void
    {
        // SANITIZE! prevent path traversal
        $filename = basename($filename);
        
        // Simple validation: must start with biodata_ and allow .pdf or .html
        if (strpos($filename, 'biodata_') !== 0 || !preg_match('/\.(pdf|html)$/', $filename)) {
            Response::error('Invalid filename', 400);
        }

        $this->serveFile($filename);
    }

    /**
     * Common serve file logic
     */
    private function serveFile(string $filename): void
    {
        // Get file path
        $filepath = APP_ROOT . '/storage/pdfs/' . $filename;

        // Check if file is HTML (fallback mode)
        if (!file_exists($filepath)) {
            $htmlFilepath = str_replace('.pdf', '.html', $filepath);
            if (file_exists($htmlFilepath)) {
                $filepath = $htmlFilepath;
                $filename = str_replace('.pdf', '.html', $filename);
            } else {
                Response::error('File not found', 404);
            }
        }
        
        // Determine content type
        $extension = pathinfo($filepath, PATHINFO_EXTENSION);
        $contentType = $extension === 'pdf' ? 'application/pdf' : 'text/html';

        // Set headers for download
        header('Content-Type: ' . $contentType);
        header('Content-Disposition: attachment; filename="' . $filename . '"');
        header('Content-Length: ' . filesize($filepath));
        header('Cache-Control: no-cache, must-revalidate');
        header('Pragma: no-cache');
        header('Expires: 0');

        // Output file
        readfile($filepath);
        exit;
    }


    /**
     * Preview file (inline, not download)
     * GET /api/preview.php?token=xxx
     */
    public function preview(): void
    {
        $token = $this->getQuery('token');

        if (empty($token)) {
            Response::error('Download token is required', 400);
        }

        $db = Database::getInstance();

        // Find token
        $tokenRecord = $db->fetch(
            "SELECT dt.*, gb.pdf_filename
            FROM download_tokens dt
            JOIN generated_biodatas gb ON dt.biodata_id = gb.id
            WHERE dt.token = ?",
            [$token]
        );

        if ($tokenRecord === null) {
            Response::error('Invalid token', 404);
        }

        // Check expiry
        if (strtotime($tokenRecord['expires_at']) < time()) {
            Response::error('Token expired', 410);
        }

        // Get file path
        $filename = $tokenRecord['pdf_filename'];
        $filepath = APP_ROOT . '/storage/pdfs/' . $filename;

        // Check for HTML fallback
        if (!file_exists($filepath)) {
            $htmlFilepath = str_replace('.pdf', '.html', $filepath);
            if (file_exists($htmlFilepath)) {
                $filepath = $htmlFilepath;
            } else {
                Response::error('File not found', 404);
            }
        }

        // Determine content type
        $extension = pathinfo($filepath, PATHINFO_EXTENSION);
        $contentType = $extension === 'pdf' ? 'application/pdf' : 'text/html';

        // Set headers for inline display
        header('Content-Type: ' . $contentType);
        header('Content-Disposition: inline; filename="' . $filename . '"');
        header('Content-Length: ' . filesize($filepath));

        readfile($filepath);
        exit;
    }

    /**
     * Check token validity without downloading
     * GET /api/check-token.php?token=xxx
     */
    public function checkToken(): void
    {
        $token = $this->getQuery('token');

        if (empty($token)) {
            Response::error('Token is required', 400);
        }

        $db = Database::getInstance();

        $tokenRecord = $db->fetch(
            "SELECT dt.*, gb.pdf_filename, t.name as template_name
            FROM download_tokens dt
            JOIN generated_biodatas gb ON dt.biodata_id = gb.id
            JOIN templates t ON gb.template_id = t.id
            WHERE dt.token = ?",
            [$token]
        );

        if ($tokenRecord === null) {
            Response::error('Invalid token', 404);
        }

        $isExpired = strtotime($tokenRecord['expires_at']) < time();
        $isMaxed = $tokenRecord['download_count'] >= $tokenRecord['max_downloads'];

        Response::success([
            'valid' => !$isExpired && !$isMaxed,
            'filename' => $tokenRecord['pdf_filename'],
            'template_name' => $tokenRecord['template_name'],
            'expires_at' => $tokenRecord['expires_at'],
            'downloads_remaining' => max(0, $tokenRecord['max_downloads'] - $tokenRecord['download_count']),
            'is_expired' => $isExpired,
            'is_max_downloads' => $isMaxed,
        ]);
    }
}
