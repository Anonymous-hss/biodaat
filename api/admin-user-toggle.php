<?php
/**
 * Admin Toggle User Status Endpoint
 * POST /api/admin-user-toggle.php
 */

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/middleware/Cors.php';
require_once __DIR__ . '/helpers/JWT.php';

use Middleware\Cors;
use Helpers\Response;

Cors::handle();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error('Method not allowed', 405);
}

require_once __DIR__ . '/controllers/AdminDashboardController.php';

$controller = new Controllers\AdminDashboardController();
$controller->toggleUser();
