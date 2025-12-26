<?php
/**
 * JWT Helper
 * 
 * JSON Web Token encoding/decoding with HS256 algorithm.
 * Pure PHP implementation - no external libraries needed.
 */

declare(strict_types=1);

namespace Helpers;

class JWT
{
    private static ?array $config = null;

    /**
     * Get JWT configuration
     */
    private static function getConfig(): array
    {
        if (self::$config === null) {
            self::$config = [
                'secret' => env('JWT_SECRET', 'change-this-in-production'),
                'expiry' => (int) env('JWT_EXPIRY', 86400), // 24 hours default
                'algorithm' => 'HS256',
            ];
        }
        return self::$config;
    }

    /**
     * Encode payload to JWT token
     */
    public static function encode(array $payload): string
    {
        $config = self::getConfig();
        
        // Header
        $header = [
            'typ' => 'JWT',
            'alg' => $config['algorithm'],
        ];

        // Add timestamps to payload
        $now = time();
        $payload['iat'] = $now;
        $payload['exp'] = $now + $config['expiry'];

        // Encode parts
        $headerEncoded = self::base64UrlEncode(json_encode($header));
        $payloadEncoded = self::base64UrlEncode(json_encode($payload));

        // Create signature
        $signature = self::sign("{$headerEncoded}.{$payloadEncoded}", $config['secret']);
        $signatureEncoded = self::base64UrlEncode($signature);

        return "{$headerEncoded}.{$payloadEncoded}.{$signatureEncoded}";
    }

    /**
     * Decode JWT token and return payload
     * Returns null if token is invalid or expired
     */
    public static function decode(string $token): ?array
    {
        $config = self::getConfig();
        
        // Split token
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return null;
        }

        [$headerEncoded, $payloadEncoded, $signatureEncoded] = $parts;

        // Verify signature
        $expectedSignature = self::sign("{$headerEncoded}.{$payloadEncoded}", $config['secret']);
        $actualSignature = self::base64UrlDecode($signatureEncoded);

        if (!hash_equals($expectedSignature, $actualSignature)) {
            return null;
        }

        // Decode payload
        $payload = json_decode(self::base64UrlDecode($payloadEncoded), true);
        if ($payload === null) {
            return null;
        }

        // Check expiration
        if (isset($payload['exp']) && $payload['exp'] < time()) {
            return null;
        }

        return $payload;
    }

    /**
     * Validate token and return payload (alias for decode)
     */
    public static function validate(string $token): ?array
    {
        return self::decode($token);
    }

    /**
     * Create signature using HMAC SHA256
     */
    private static function sign(string $data, string $secret): string
    {
        return hash_hmac('sha256', $data, $secret, true);
    }

    /**
     * Base64 URL-safe encode
     */
    private static function base64UrlEncode(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    /**
     * Base64 URL-safe decode
     */
    private static function base64UrlDecode(string $data): string
    {
        $padding = strlen($data) % 4;
        if ($padding > 0) {
            $data .= str_repeat('=', 4 - $padding);
        }
        return base64_decode(strtr($data, '-_', '+/'));
    }

    /**
     * Get token expiry time in seconds
     */
    public static function getExpiry(): int
    {
        return self::getConfig()['expiry'];
    }

    /**
     * Extract token from Authorization header
     */
    public static function getTokenFromHeader(): ?string
    {
        $headers = self::getAuthorizationHeader();
        
        if ($headers === null) {
            return null;
        }

        // Check for Bearer token
        if (preg_match('/Bearer\s+(.+)$/i', $headers, $matches)) {
            return $matches[1];
        }

        return null;
    }

    /**
     * Get Authorization header value
     */
    private static function getAuthorizationHeader(): ?string
    {
        // Try different methods to get the header
        if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
            return $_SERVER['HTTP_AUTHORIZATION'];
        }

        if (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
            return $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
        }

        // Apache-specific
        if (function_exists('apache_request_headers')) {
            $headers = apache_request_headers();
            if (isset($headers['Authorization'])) {
                return $headers['Authorization'];
            }
            if (isset($headers['authorization'])) {
                return $headers['authorization'];
            }
        }

        return null;
    }
}
