<?php
/**
 * App Configuration
 * 
 * Core application settings loaded from environment.
 */

declare(strict_types=1);

return [
    // Application
    'name' => env('APP_NAME', 'Biodaat'),
    'env' => env('APP_ENV', 'production'),
    'debug' => env('APP_DEBUG', false),
    'url' => env('APP_URL', 'http://localhost'),
    'timezone' => env('APP_TIMEZONE', 'Asia/Kolkata'),

    // Paths
    'paths' => [
        'storage' => APP_ROOT . '/storage',
        'pdfs' => APP_ROOT . '/storage/pdfs',
        'uploads' => APP_ROOT . '/storage/uploads',
        'logs' => APP_ROOT . '/storage/logs',
        'templates' => APP_ROOT . '/templates',
    ],

    // Security
    'jwt' => [
        'secret' => env('JWT_SECRET', 'change-this-in-production'),
        'expiry' => (int) env('JWT_EXPIRY', 86400), // 24 hours
        'algorithm' => 'HS256',
    ],

    // Downloads
    'downloads' => [
        'token_expiry' => (int) env('DOWNLOAD_TOKEN_EXPIRY', 3600), // 1 hour
        'max_per_token' => (int) env('MAX_DOWNLOADS_PER_TOKEN', 5),
    ],

    // Razorpay
    'razorpay' => [
        'key_id' => env('RAZORPAY_KEY_ID', ''),
        'key_secret' => env('RAZORPAY_KEY_SECRET', ''),
        'webhook_secret' => env('RAZORPAY_WEBHOOK_SECRET', ''),
    ],
];
