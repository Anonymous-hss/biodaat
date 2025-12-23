<?php
/**
 * CORS Configuration
 * 
 * Cross-Origin Resource Sharing settings.
 */

declare(strict_types=1);

return [
    // Allowed origins (comma-separated in env)
    'allowed_origins' => array_filter(
        array_map('trim', explode(',', env('CORS_ALLOWED_ORIGINS', '*')))
    ),
    
    // Wildcard origin (for development)
    'allow_all_origins' => env('APP_ENV', 'production') === 'development',
    
    // Allowed HTTP methods
    'allowed_methods' => [
        'GET',
        'POST',
        'PUT',
        'PATCH',
        'DELETE',
        'OPTIONS',
    ],
    
    // Allowed headers
    'allowed_headers' => [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
        'X-CSRF-Token',
    ],
    
    // Exposed headers (accessible to JS)
    'exposed_headers' => [
        'X-Request-Id',
        'X-RateLimit-Limit',
        'X-RateLimit-Remaining',
    ],
    
    // Allow credentials (cookies, auth headers)
    'supports_credentials' => true,
    
    // Preflight cache duration (seconds)
    'max_age' => 86400, // 24 hours
];
