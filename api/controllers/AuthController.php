<?php
/**
 * Auth Controller
 * 
 * Handles authentication endpoints: send OTP, verify, logout, current user.
 */

declare(strict_types=1);

namespace Controllers;

use Helpers\Response;
use Helpers\Validator;
use Helpers\Auth;

class AuthController extends BaseController
{
    /**
     * Send OTP to phone number
     * POST /api/auth-send-otp.php
     */
    public function sendOTP(): void
    {
        $data = $this->getJsonBody();

        // Validate input
        $validator = Validator::make($data)
            ->required('phone', 'Phone number')
            ->phone('phone', 'Phone number');

        if ($validator->fails()) {
            Response::validationError($validator->errors());
        }

        $phone = preg_replace('/[^0-9]/', '', $data['phone']);
        
        // Normalize phone (remove country code if present)
        if (strlen($phone) === 12 && str_starts_with($phone, '91')) {
            $phone = substr($phone, 2);
        }

        // Check rate limiting
        if (Auth::isRateLimited($phone, 60)) {
            Response::error('Please wait before requesting another OTP', 429);
        }

        // Generate and store OTP
        $otp = Auth::generateOTP();
        Auth::storeOTP($phone, $otp);

        // In production, send SMS here
        // For now, we just return success
        // TODO: Integrate SMS gateway (MSG91, Twilio, etc.)

        $response = [
            'phone' => $phone,
            'expires_in' => 300, // 5 minutes
        ];

        // In development, include OTP in response for testing
        if (env('APP_DEBUG') === true || env('APP_ENV') === 'development') {
            $response['otp'] = $otp;
            $response['_dev_note'] = 'OTP included for development only';
        }

        Response::success($response, 'OTP sent successfully');
    }

    /**
     * Verify OTP and login
     * POST /api/auth-verify-otp.php
     */
    public function verifyOTP(): void
    {
        $data = $this->getJsonBody();

        // Validate input
        $validator = Validator::make($data)
            ->required('phone', 'Phone number')
            ->required('otp', 'OTP')
            ->phone('phone', 'Phone number');

        if ($validator->fails()) {
            Response::validationError($validator->errors());
        }

        $phone = preg_replace('/[^0-9]/', '', $data['phone']);
        $otp = trim($data['otp']);

        // Normalize phone
        if (strlen($phone) === 12 && str_starts_with($phone, '91')) {
            $phone = substr($phone, 2);
        }

        // Verify OTP
        $result = Auth::verifyOTP($phone, $otp);

        switch ($result) {
            case 'not_found':
                Response::error('No OTP found for this number. Please request a new OTP.', 400);
                break;
            case 'expired':
                Response::error('OTP has expired. Please request a new OTP.', 400);
                break;
            case 'max_attempts':
                Response::error('Too many failed attempts. Please request a new OTP.', 429);
                break;
            case 'invalid':
                Response::error('Invalid OTP. Please try again.', 400);
                break;
        }

        // OTP is valid - get or create user
        $user = Auth::getOrCreateUser($phone);

        // Create tokens
        $tokens = Auth::createTokens($user);

        // Set auth cookie
        Auth::setAuthCookie($tokens['access_token'], $tokens['expires_in']);

        Response::success([
            'user' => [
                'id' => $user['id'],
                'phone' => $user['phone'],
                'name' => $user['name'],
                'email' => $user['email'],
            ],
            'token' => $tokens['access_token'],
            'expires_in' => $tokens['expires_in'],
        ], 'Login successful');
    }

    /**
     * Get current authenticated user
     * GET /api/auth-me.php
     */
    public function me(): void
    {
        $user = Auth::user();

        if ($user === null) {
            Response::unauthorized('Not authenticated');
        }

        Response::success([
            'user' => [
                'id' => $user['id'],
                'phone' => $user['phone'],
                'name' => $user['name'],
                'email' => $user['email'],
                'created_at' => $user['created_at'],
            ],
        ], 'User retrieved');
    }

    /**
     * Logout current user
     * POST /api/auth-logout.php
     */
    public function logout(): void
    {
        $user = Auth::user();

        if ($user !== null) {
            // Revoke all refresh tokens
            Auth::revokeTokens((int) $user['id']);
        }

        // Clear auth cookie
        Auth::clearAuthCookie();

        // Reset auth state
        Auth::reset();

        Response::success(null, 'Logged out successfully');
    }

    /**
     * Update user profile
     * PUT /api/auth-update.php
     */
    public function update(): void
    {
        $user = Auth::user();

        if ($user === null) {
            Response::unauthorized('Not authenticated');
        }

        $data = $this->getJsonBody();

        // Validate input
        $validator = Validator::make($data);
        
        if (isset($data['name'])) {
            $validator->maxLength('name', 100, 'Name');
        }
        
        if (isset($data['email'])) {
            $validator->email('email', 'Email');
        }

        if ($validator->fails()) {
            Response::validationError($validator->errors());
        }

        // Build update data
        $updateData = [];
        
        if (isset($data['name'])) {
            $updateData['name'] = Validator::sanitize($data['name']);
        }
        
        if (isset($data['email'])) {
            $updateData['email'] = Validator::sanitize($data['email']);
        }

        if (empty($updateData)) {
            Response::error('No data to update', 400);
        }

        // Update user
        $db = \Helpers\Database::getInstance();
        $db->update('users', $updateData, 'id = ?', [$user['id']]);

        // Reset cached user
        Auth::reset();

        // Get updated user
        $updatedUser = Auth::user();

        Response::success([
            'user' => [
                'id' => $updatedUser['id'],
                'phone' => $updatedUser['phone'],
                'name' => $updatedUser['name'],
                'email' => $updatedUser['email'],
            ],
        ], 'Profile updated');
    }
}
