<?php
/**
 * Send OTP Endpoint
 * POST /api/auth-send-otp.php
 */

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/middleware/Cors.php';
require_once __DIR__ . '/helpers/JWT.php';
require_once __DIR__ . '/helpers/Auth.php';

use Middleware\Cors;
use Helpers\Response;

Cors::handle();

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error('Method not allowed', 405);
}

require_once __DIR__ . '/controllers/AuthController.php';

$controller = new Controllers\AuthController();
$controller->sendOTP();
