<?php
/**
 * Check Token Validity Endpoint
 * GET /api/check-token.php?token=xxx
 */

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/middleware/Cors.php';

use Middleware\Cors;
use Helpers\Response;

Cors::handle();

// Only allow GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    Response::error('Method not allowed', 405);
}

require_once __DIR__ . '/controllers/DownloadController.php';

$controller = new Controllers\DownloadController();
$controller->checkToken();
