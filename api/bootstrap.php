<?php
/**
 * Biodaat API - Bootstrap File
 * 
 * Initializes the application:
 * - Loads environment variables
 * - Sets up error handling
 * - Configures autoloading
 * - Initializes database connection
 */

declare(strict_types=1);

// ============================================
// ERROR HANDLING
// ============================================
error_reporting(E_ALL);
ini_set('display_errors', '0'); // Never display errors in production
ini_set('log_errors', '1');
ini_set('error_log', __DIR__ . '/../storage/logs/php-errors.log');

// Set timezone
date_default_timezone_set('Asia/Kolkata');

// ============================================
// ENVIRONMENT LOADER
// ============================================

/**
 * Load environment variables from .env file
 */
function loadEnv(string $path): void
{
    if (!file_exists($path)) {
        throw new RuntimeException('.env file not found. Copy .env.example to .env and configure it.');
    }

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    
    foreach ($lines as $line) {
        // Skip comments
        if (strpos(trim($line), '#') === 0) {
            continue;
        }

        // Parse key=value
        if (strpos($line, '=') !== false) {
            list($key, $value) = explode('=', $line, 2);
            $key = trim($key);
            $value = trim($value);

            // Remove quotes from value
            if (preg_match('/^(["\']).*\1$/', $value)) {
                $value = substr($value, 1, -1);
            }

            // Set environment variable
            if (!array_key_exists($key, $_ENV)) {
                $_ENV[$key] = $value;
                putenv("{$key}={$value}");
            }
        }
    }
}

/**
 * Get environment variable with optional default
 */
function env(string $key, mixed $default = null): mixed
{
    $value = $_ENV[$key] ?? getenv($key);
    
    if ($value === false || $value === null) {
        return $default;
    }

    // Convert string booleans
    switch (strtolower($value)) {
        case 'true':
        case '(true)':
            return true;
        case 'false':
        case '(false)':
            return false;
        case 'null':
        case '(null)':
            return null;
    }

    return $value;
}

// Load environment variables
loadEnv(__DIR__ . '/../.env');

// ============================================
// CONSTANTS
// ============================================
define('APP_ROOT', dirname(__DIR__));
define('API_ROOT', __DIR__);
define('STORAGE_PATH', APP_ROOT . '/storage');
define('APP_DEBUG', env('APP_DEBUG', false));
define('APP_ENV', env('APP_ENV', 'production'));

// ============================================
// AUTOLOADER
// ============================================

// Load Composer autoloader
if (file_exists(APP_ROOT . '/vendor/autoload.php')) {
    require_once APP_ROOT . '/vendor/autoload.php';
}

/**
 * Simple PSR-4 style autoloader for our classes
 */
spl_autoload_register(function (string $class): void {
    // Map of namespaces to directories
    $prefixes = [
        'Controllers\\' => __DIR__ . '/controllers/',
        'Helpers\\' => __DIR__ . '/helpers/',
        'Middleware\\' => __DIR__ . '/middleware/',
    ];

    foreach ($prefixes as $prefix => $baseDir) {
        $len = strlen($prefix);
        if (strncmp($prefix, $class, $len) !== 0) {
            continue;
        }

        $relativeClass = substr($class, $len);
        $file = $baseDir . str_replace('\\', '/', $relativeClass) . '.php';

        if (file_exists($file)) {
            require $file;
            return;
        }
    }
});

// ============================================
// EXCEPTION HANDLER
// ============================================
set_exception_handler(function (Throwable $e): void {
    // Log the error
    error_log(sprintf(
        "[%s] %s in %s:%d\nStack trace:\n%s",
        date('Y-m-d H:i:s'),
        $e->getMessage(),
        $e->getFile(),
        $e->getLine(),
        $e->getTraceAsString()
    ));

    // Send JSON error response
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    
    $response = [
        'success' => false,
        'message' => 'Internal Server Error',
    ];

    // Include details in debug mode
    if (APP_DEBUG) {
        $response['debug'] = [
            'message' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
        ];
    }

    echo json_encode($response, JSON_UNESCAPED_UNICODE);
    exit;
});

// ============================================
// FATAL ERROR HANDLER
// ============================================
register_shutdown_function(function (): void {
    $error = error_get_last();
    
    if ($error !== null && in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR])) {
        error_log(sprintf(
            "[%s] Fatal Error: %s in %s:%d",
            date('Y-m-d H:i:s'),
            $error['message'],
            $error['file'],
            $error['line']
        ));

        if (!headers_sent()) {
            http_response_code(500);
            header('Content-Type: application/json; charset=utf-8');
            
            $response = [
                'success' => false,
                'message' => 'Internal Server Error',
            ];

            if (APP_DEBUG) {
                $response['debug'] = $error;
            }

            echo json_encode($response, JSON_UNESCAPED_UNICODE);
        }
    }
});

// ============================================
// LOAD CORE HELPERS
// ============================================
require_once __DIR__ . '/helpers/Response.php';
require_once __DIR__ . '/helpers/Database.php';
