<?php
/**
 * Biodaat API - Main Entry Point
 * 
 * Single entry point router for all API requests.
 * Routes requests to appropriate controllers.
 */

declare(strict_types=1);

// Load bootstrap
require_once __DIR__ . '/bootstrap.php';

// Load middleware
require_once __DIR__ . '/middleware/Cors.php';

use Helpers\Response;
use Middleware\Cors;

// ============================================
// APPLY CORS
// ============================================
Cors::handle();

// ============================================
// REQUEST PARSING
// ============================================
$requestMethod = $_SERVER['REQUEST_METHOD'];
$requestUri = $_SERVER['REQUEST_URI'];

// Parse the URI to get the path
$path = parse_url($requestUri, PHP_URL_PATH);

// Auto-detect base path: find where /api/ is in the path
// This works for both /biodaat/api/health and /api/health
$apiPos = strpos($path, '/api/');
if ($apiPos !== false) {
    // Extract everything after /api/
    $path = substr($path, $apiPos + 5); // +5 to skip "/api/"
} elseif (preg_match('#/api$#', $path)) {
    // Handle case where path is exactly /api or /biodaat/api
    $path = '';
} else {
    // Fallback: just remove /api prefix if present
    $path = preg_replace('#^.*/api#', '', $path);
}

// Clean up path
$path = trim($path, '/');
$path = $path ?: 'index';

// Split path into segments
$segments = explode('/', $path);
$resource = $segments[0] ?? '';
$action = $segments[1] ?? 'index';
$id = $segments[2] ?? null;

// ============================================
// ROUTING
// ============================================

// Define routes as [method => [path => [controller, method]]]
$routes = [
    'GET' => [
        'health' => ['HealthController', 'index'],
        'health/db' => ['HealthController', 'database'],
    ],
    'POST' => [
        // Auth routes will be added in Level 2
    ],
    'PUT' => [],
    'DELETE' => [],
];

// Build route key
$routeKey = $resource;
if ($action !== 'index') {
    $routeKey .= '/' . $action;
}

// Find matching route
$handler = null;

if (isset($routes[$requestMethod][$routeKey])) {
    $handler = $routes[$requestMethod][$routeKey];
}

// Handle route
if ($handler !== null) {
    [$controllerName, $methodName] = $handler;
    
    // Load and instantiate controller
    $controllerClass = "Controllers\\{$controllerName}";
    require_once __DIR__ . "/controllers/{$controllerName}.php";
    
    $controller = new $controllerClass();
    
    // Call method
    if (method_exists($controller, $methodName)) {
        $controller->$methodName($id);
    } else {
        Response::error('Method not found', 404);
    }
} else {
    // 404 Not Found
    Response::error('Endpoint not found', 404, [
        'path' => $path,
        'method' => $requestMethod,
    ]);
}
