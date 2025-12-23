<?php
/**
 * CORS Middleware
 * 
 * Handles Cross-Origin Resource Sharing headers.
 */

declare(strict_types=1);

namespace Middleware;

class Cors
{
    /**
     * Handle CORS headers
     */
    public static function handle(): void
    {
        $config = require __DIR__ . '/../config/cors.php';
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

        // Check allowed origins
        $allowedOrigin = self::getAllowedOrigin($origin, $config);

        if ($allowedOrigin !== null) {
            header("Access-Control-Allow-Origin: {$allowedOrigin}");
        }

        // Allow credentials
        if ($config['supports_credentials']) {
            header('Access-Control-Allow-Credentials: true');
        }

        // Exposed headers
        if (!empty($config['exposed_headers'])) {
            header('Access-Control-Expose-Headers: ' . implode(', ', $config['exposed_headers']));
        }

        // Handle preflight request
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            self::handlePreflight($config);
        }
    }

    /**
     * Determine allowed origin
     */
    private static function getAllowedOrigin(string $origin, array $config): ?string
    {
        // Allow all origins in development
        if ($config['allow_all_origins']) {
            return $origin ?: '*';
        }

        // Check if origin is in allowed list
        if (in_array('*', $config['allowed_origins'], true)) {
            return '*';
        }

        if (in_array($origin, $config['allowed_origins'], true)) {
            return $origin;
        }

        // Check for pattern matching (e.g., *.domain.com)
        foreach ($config['allowed_origins'] as $allowed) {
            if (strpos($allowed, '*') !== false) {
                $pattern = '/^' . str_replace('\*', '.*', preg_quote($allowed, '/')) . '$/';
                if (preg_match($pattern, $origin)) {
                    return $origin;
                }
            }
        }

        return null;
    }

    /**
     * Handle OPTIONS preflight request
     */
    private static function handlePreflight(array $config): void
    {
        // Allowed methods
        header('Access-Control-Allow-Methods: ' . implode(', ', $config['allowed_methods']));

        // Allowed headers
        header('Access-Control-Allow-Headers: ' . implode(', ', $config['allowed_headers']));

        // Cache preflight response
        header("Access-Control-Max-Age: {$config['max_age']}");

        // Return 204 No Content for preflight
        http_response_code(204);
        exit;
    }
}
