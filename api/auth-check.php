<?php
/**
 * Check Auth Status Endpoint
 * GET /api/auth-check.php
 * 
 * Returns current auth status - useful for frontend to check if cookie session is valid
 */

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/middleware/Cors.php';
require_once __DIR__ . '/helpers/JWT.php';
require_once __DIR__ . '/helpers/Auth.php';

use Middleware\Cors;
use Helpers\Response;
use Helpers\Auth;

Cors::handle();

// Only allow GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    Response::error('Method not allowed', 405);
}

// Check if user is authenticated
$user = Auth::user();

if ($user === null) {
    Response::success([
        'authenticated' => false,
        'user' => null,
    ], 'Not authenticated');
} else {
    Response::success([
        'authenticated' => true,
        'user' => [
            'id' => (int) $user['id'],
            'phone' => $user['phone'],
            'name' => $user['name'],
            'email' => $user['email'],
        ],
    ], 'Authenticated');
}
