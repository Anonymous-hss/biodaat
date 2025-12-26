<?php
/**
 * Admin Login Endpoint
 * POST /api/admin-login.php
 */

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/middleware/Cors.php';
require_once __DIR__ . '/helpers/JWT.php';

use Middleware\Cors;
use Helpers\Response;

Cors::handle();

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error('Method not allowed', 405);
}

require_once __DIR__ . '/controllers/AdminAuthController.php';

$controller = new Controllers\AdminAuthController();
$controller->login();
