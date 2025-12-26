<?php
/**
 * Admin Template List Endpoint
 * GET /api/admin-templates.php
 */

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/middleware/Cors.php';
require_once __DIR__ . '/helpers/JWT.php';
require_once __DIR__ . '/helpers/Auth.php';
require_once __DIR__ . '/middleware/AuthMiddleware.php';

use Middleware\Cors;
use Middleware\AuthMiddleware;
use Helpers\Response;

Cors::handle();

// Only allow GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    Response::error('Method not allowed', 405);
}

// Require admin auth (for now, just require any auth - will enhance in Level 8)
// AuthMiddleware::requireAdmin();

require_once __DIR__ . '/controllers/TemplateController.php';

$controller = new Controllers\TemplateController();
$controller->adminList();
