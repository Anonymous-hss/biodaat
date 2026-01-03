<?php
/**
 * Auth Helper
 * 
 * Authentication utilities for managing users, OTPs, and sessions.
 */

declare(strict_types=1);

namespace Helpers;

class Auth
{
    private static ?array $currentUser = null;

    /**
     * Get current authenticated user from JWT token
     * Checks both Authorization header and auth_token cookie
     */
    public static function user(): ?array
    {
        if (self::$currentUser !== null) {
            return self::$currentUser;
        }

        // First try Authorization header
        $token = JWT::getTokenFromHeader();
        
        // If no header, try cookie
        if ($token === null && isset($_COOKIE['auth_token'])) {
            $token = $_COOKIE['auth_token'];
        }
        
        if ($token === null) {
            return null;
        }

        $payload = JWT::decode($token);
        if ($payload === null) {
            return null;
        }

        // Fetch user from database
        try {
            $db = Database::getInstance();
            $user = $db->fetch(
                "SELECT id, phone, name, email, created_at FROM users WHERE id = ? AND is_active = 1",
                [$payload['user_id']]
            );
        } catch (\Exception $e) {
            // If DB fails, we can't verify user, so treat as guest
            error_log('Auth DB check failed: ' . $e->getMessage());
            return null;
        }

        if ($user === null) {
            return null;
        }

        self::$currentUser = $user;
        return $user;
    }

    /**
     * Check if user is authenticated
     */
    public static function check(): bool
    {
        return self::user() !== null;
    }

    /**
     * Get current user ID
     */
    public static function id(): ?int
    {
        $user = self::user();
        return $user ? (int) $user['id'] : null;
    }

    /**
     * Generate a random OTP
     */
    public static function generateOTP(int $length = 6): string
    {
        // In development mode, use static OTP for testing
        $appEnv = env('APP_ENV', 'production');
        $appDebug = env('APP_DEBUG', false);
        
        // Check if debug mode (handle both string "true" and boolean true)
        $isDebug = $appDebug === true || $appDebug === 'true' || $appDebug === '1';
        $isDev = $appEnv === 'development';
        
        if ($isDev || $isDebug) {
            return '123456';
        }

        return str_pad((string) random_int(0, pow(10, $length) - 1), $length, '0', STR_PAD_LEFT);
    }

    /**
     * Store OTP in database
     */
    public static function storeOTP(string $phone, string $otp, int $expiryMinutes = 5): bool
    {
        $db = Database::getInstance();

        // Delete any existing unused OTPs for this phone
        $db->delete('otp_tokens', 'phone = ? AND is_used = 0', [$phone]);

        // Insert new OTP
        $db->insert('otp_tokens', [
            'phone' => $phone,
            'otp' => $otp,
            'purpose' => 'login',
            'attempts' => 0,
            'is_used' => 0,
            'expires_at' => date('Y-m-d H:i:s', time() + ($expiryMinutes * 60)),
        ]);

        return true;
    }

    /**
     * Verify OTP
     * Returns: 'valid', 'invalid', 'expired', 'max_attempts', 'not_found'
     */
    public static function verifyOTP(string $phone, string $otp): string
    {
        $db = Database::getInstance();

        // Find OTP record
        $record = $db->fetch(
            "SELECT * FROM otp_tokens WHERE phone = ? AND is_used = 0 ORDER BY created_at DESC LIMIT 1",
            [$phone]
        );

        if ($record === null) {
            return 'not_found';
        }

        // Check expiry
        if (strtotime($record['expires_at']) < time()) {
            return 'expired';
        }

        // Check attempts
        if ($record['attempts'] >= 5) {
            return 'max_attempts';
        }

        // Verify OTP
        if ($record['otp'] !== $otp) {
            // Increment attempts
            $db->update('otp_tokens', 
                ['attempts' => $record['attempts'] + 1], 
                'id = ?', 
                [$record['id']]
            );
            return 'invalid';
        }

        // Mark as used
        $db->update('otp_tokens', ['is_used' => 1], 'id = ?', [$record['id']]);

        return 'valid';
    }

    /**
     * Get or create user by phone
     */
    public static function getOrCreateUser(string $phone): array
    {
        $db = Database::getInstance();

        // Try to find existing user
        $user = $db->fetch(
            "SELECT id, phone, name, email, created_at FROM users WHERE phone = ?",
            [$phone]
        );

        if ($user !== null) {
            // Update last login
            $db->update('users', ['last_login_at' => date('Y-m-d H:i:s')], 'id = ?', [$user['id']]);
            return $user;
        }

        // Create new user
        $userId = $db->insert('users', [
            'phone' => $phone,
            'is_active' => 1,
            'last_login_at' => date('Y-m-d H:i:s'),
        ]);

        return [
            'id' => $userId,
            'phone' => $phone,
            'name' => null,
            'email' => null,
            'created_at' => date('Y-m-d H:i:s'),
        ];
    }

    /**
     * Create tokens for user (access + refresh)
     */
    public static function createTokens(array $user): array
    {
        $db = Database::getInstance();

        // Create access token (JWT)
        $accessToken = JWT::encode([
            'user_id' => $user['id'],
            'phone' => $user['phone'],
        ]);

        // Create refresh token
        $refreshToken = bin2hex(random_bytes(32));
        $refreshTokenHash = hash('sha256', $refreshToken);

        // Store refresh token (expires in 30 days)
        $db->insert('refresh_tokens', [
            'user_id' => $user['id'],
            'token_hash' => $refreshTokenHash,
            'expires_at' => date('Y-m-d H:i:s', time() + (30 * 24 * 60 * 60)),
            'is_revoked' => 0,
            'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? null,
            'ip_address' => $_SERVER['REMOTE_ADDR'] ?? null,
        ]);

        return [
            'access_token' => $accessToken,
            'refresh_token' => $refreshToken,
            'expires_in' => JWT::getExpiry(),
        ];
    }

    /**
     * Revoke all refresh tokens for user
     */
    public static function revokeTokens(int $userId): void
    {
        $db = Database::getInstance();
        $db->update('refresh_tokens', ['is_revoked' => 1], 'user_id = ?', [$userId]);
    }

    /**
     * Check rate limit for OTP requests
     * Returns true if rate limited
     */
    public static function isRateLimited(string $phone, int $limitSeconds = 60): bool
    {
        $db = Database::getInstance();

        $recentOTP = $db->fetch(
            "SELECT created_at FROM otp_tokens WHERE phone = ? ORDER BY created_at DESC LIMIT 1",
            [$phone]
        );

        if ($recentOTP === null) {
            return false;
        }

        $timeSinceLastOTP = time() - strtotime($recentOTP['created_at']);
        return $timeSinceLastOTP < $limitSeconds;
    }

    /**
     * Set authentication cookie
     */
    public static function setAuthCookie(string $token, int $expiry = 0): void
    {
        $secure = env('APP_ENV') === 'production';
        
        setcookie('auth_token', $token, [
            'expires' => $expiry > 0 ? time() + $expiry : 0,
            'path' => '/',
            'domain' => '',
            'secure' => $secure,
            'httponly' => true,
            'samesite' => 'Lax',
        ]);
    }

    /**
     * Clear authentication cookie
     */
    public static function clearAuthCookie(): void
    {
        setcookie('auth_token', '', [
            'expires' => time() - 3600,
            'path' => '/',
            'domain' => '',
            'secure' => false,
            'httponly' => true,
            'samesite' => 'Lax',
        ]);
    }

    /**
     * Reset current user cache
     */
    public static function reset(): void
    {
        self::$currentUser = null;
    }
}
