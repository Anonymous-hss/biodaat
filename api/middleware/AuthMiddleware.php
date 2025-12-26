<?php
/**
 * Auth Middleware
 * 
 * Validates JWT token and ensures user is authenticated.
 */

declare(strict_types=1);

namespace Middleware;

use Helpers\JWT;
use Helpers\Auth;
use Helpers\Response;

class AuthMiddleware
{
    /**
     * Require authentication
     * Terminates request with 401 if not authenticated
     */
    public static function require(): void
    {
        $token = JWT::getTokenFromHeader();

        if ($token === null) {
            // Try to get from cookie
            $token = $_COOKIE['auth_token'] ?? null;
        }

        if ($token === null) {
            Response::unauthorized('Authentication required');
        }

        $payload = JWT::decode($token);

        if ($payload === null) {
            Response::unauthorized('Invalid or expired token');
        }

        // Verify user exists and is active
        $user = Auth::user();

        if ($user === null) {
            Response::unauthorized('User not found or inactive');
        }
    }

    /**
     * Optional authentication
     * Sets user if token is valid, but doesn't require it
     */
    public static function optional(): void
    {
        $token = JWT::getTokenFromHeader();

        if ($token === null) {
            $token = $_COOKIE['auth_token'] ?? null;
        }

        if ($token !== null) {
            // Try to authenticate, but don't fail if invalid
            JWT::decode($token);
        }
    }

    /**
     * Require admin authentication
     */
    public static function requireAdmin(): void
    {
        // For admin, we use a separate table and different logic
        // This will be implemented in Level 8
        $token = JWT::getTokenFromHeader();

        if ($token === null) {
            Response::unauthorized('Admin authentication required');
        }

        $payload = JWT::decode($token);

        if ($payload === null || !isset($payload['is_admin']) || !$payload['is_admin']) {
            Response::forbidden('Admin access required');
        }
    }
}
