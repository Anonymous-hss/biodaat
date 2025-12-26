<?php
/**
 * Admin Auth Controller
 * 
 * Handles admin authentication with username/password login.
 */

declare(strict_types=1);

namespace Controllers;

use Helpers\Response;
use Helpers\Database;
use Helpers\JWT;
use Helpers\Validator;

class AdminAuthController extends BaseController
{
    /**
     * Admin login with username and password
     * POST /api/admin-login.php
     */
    public function login(): void
    {
        $data = $this->getJsonBody();

        // Validate input
        $validator = Validator::make($data)
            ->required('username', 'Username')
            ->required('password', 'Password');

        if ($validator->fails()) {
            Response::validationError($validator->errors());
        }

        $username = trim($data['username']);
        $password = $data['password'];

        $db = Database::getInstance();

        // Find admin user
        $admin = $db->fetch(
            "SELECT * FROM admin_users WHERE username = ? AND is_active = 1",
            [$username]
        );

        if ($admin === null) {
            Response::error('Invalid credentials', 401);
        }

        // Verify password
        if (!password_verify($password, $admin['password_hash'])) {
            Response::error('Invalid credentials', 401);
        }

        // Create admin JWT token with is_admin flag
        $token = JWT::encode([
            'user_id' => $admin['id'],
            'username' => $admin['username'],
            'role' => $admin['role'],
            'is_admin' => true,
        ]);

        // Update last login
        $db->update('admin_users', [
            'last_login_at' => date('Y-m-d H:i:s'),
        ], 'id = ?', [$admin['id']]);

        // Set admin auth cookie
        $this->setAdminCookie($token);

        Response::success([
            'admin' => [
                'id' => (int) $admin['id'],
                'username' => $admin['username'],
                'email' => $admin['email'],
                'role' => $admin['role'],
            ],
            'token' => $token,
            'expires_in' => JWT::getExpiry(),
        ], 'Admin login successful');
    }

    /**
     * Get current admin user
     * GET /api/admin-me.php
     */
    public function me(): void
    {
        $admin = $this->getAdmin();

        if ($admin === null) {
            Response::unauthorized('Admin authentication required');
        }

        Response::success([
            'admin' => [
                'id' => (int) $admin['id'],
                'username' => $admin['username'],
                'email' => $admin['email'],
                'role' => $admin['role'],
                'last_login_at' => $admin['last_login_at'],
            ],
        ]);
    }

    /**
     * Admin logout
     * POST /api/admin-logout.php
     */
    public function logout(): void
    {
        $this->clearAdminCookie();
        Response::success(null, 'Admin logged out');
    }

    /**
     * Change admin password
     * POST /api/admin-change-password.php
     */
    public function changePassword(): void
    {
        $admin = $this->getAdmin();

        if ($admin === null) {
            Response::unauthorized('Admin authentication required');
        }

        $data = $this->getJsonBody();

        $validator = Validator::make($data)
            ->required('current_password', 'Current password')
            ->required('new_password', 'New password')
            ->minLength('new_password', 8, 'New password');

        if ($validator->fails()) {
            Response::validationError($validator->errors());
        }

        // Verify current password
        if (!password_verify($data['current_password'], $admin['password_hash'])) {
            Response::error('Current password is incorrect', 400);
        }

        // Update password
        $db = Database::getInstance();
        $db->update('admin_users', [
            'password_hash' => password_hash($data['new_password'], PASSWORD_DEFAULT),
        ], 'id = ?', [$admin['id']]);

        Response::success(null, 'Password changed successfully');
    }

    /**
     * Get admin from token
     */
    private function getAdmin(): ?array
    {
        // Try header first
        $token = JWT::getTokenFromHeader();
        
        // Try cookie
        if ($token === null && isset($_COOKIE['admin_token'])) {
            $token = $_COOKIE['admin_token'];
        }

        if ($token === null) {
            return null;
        }

        $payload = JWT::decode($token);
        if ($payload === null || empty($payload['is_admin'])) {
            return null;
        }

        $db = Database::getInstance();
        return $db->fetch(
            "SELECT * FROM admin_users WHERE id = ? AND is_active = 1",
            [$payload['user_id']]
        );
    }

    /**
     * Set admin auth cookie
     */
    private function setAdminCookie(string $token): void
    {
        $secure = env('APP_ENV') === 'production';
        $expiry = time() + JWT::getExpiry();
        
        setcookie('admin_token', $token, [
            'expires' => $expiry,
            'path' => '/',
            'domain' => '',
            'secure' => $secure,
            'httponly' => true,
            'samesite' => 'Lax',
        ]);
    }

    /**
     * Clear admin auth cookie
     */
    private function clearAdminCookie(): void
    {
        setcookie('admin_token', '', [
            'expires' => time() - 3600,
            'path' => '/',
            'domain' => '',
            'secure' => false,
            'httponly' => true,
            'samesite' => 'Lax',
        ]);
    }
}
