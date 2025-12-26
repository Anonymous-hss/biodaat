<?php
/**
 * Update Profile Endpoint
 * PUT /api/auth-update.php
 */

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/middleware/Cors.php';
require_once __DIR__ . '/helpers/JWT.php';
require_once __DIR__ . '/helpers/Auth.php';

use Middleware\Cors;
use Helpers\Response;

Cors::handle();

// Allow PUT and POST (some clients don't support PUT)
if (!in_array($_SERVER['REQUEST_METHOD'], ['PUT', 'POST'])) {
    Response::error('Method not allowed', 405);
}

require_once __DIR__ . '/controllers/AuthController.php';

$controller = new Controllers\AuthController();
$controller->update();
