<?php
/**
 * Response Helper
 * 
 * Standardized JSON response formatting.
 */

declare(strict_types=1);

namespace Helpers;

class Response
{
    /**
     * Send a success response
     */
    public static function success(mixed $data = null, string $message = 'Success', int $code = 200): void
    {
        self::send([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $code);
    }

    /**
     * Send an error response
     */
    public static function error(string $message, int $code = 400, mixed $errors = null): void
    {
        $response = [
            'success' => false,
            'message' => $message,
        ];

        if ($errors !== null) {
            $response['errors'] = $errors;
        }

        self::send($response, $code);
    }

    /**
     * Send a validation error response
     */
    public static function validationError(array $errors): void
    {
        self::send([
            'success' => false,
            'message' => 'Validation failed',
            'errors' => $errors,
        ], 422);
    }

    /**
     * Send unauthorized response
     */
    public static function unauthorized(string $message = 'Unauthorized'): void
    {
        self::error($message, 401);
    }

    /**
     * Send forbidden response
     */
    public static function forbidden(string $message = 'Forbidden'): void
    {
        self::error($message, 403);
    }

    /**
     * Send not found response
     */
    public static function notFound(string $message = 'Not Found'): void
    {
        self::error($message, 404);
    }

    /**
     * Send paginated response
     */
    public static function paginated(array $data, int $page, int $perPage, int $total): void
    {
        self::send([
            'success' => true,
            'data' => $data,
            'meta' => [
                'current_page' => $page,
                'per_page' => $perPage,
                'total' => $total,
                'total_pages' => (int) ceil($total / $perPage),
            ],
        ], 200);
    }

    /**
     * Internal method to send JSON response
     */
    private static function send(array $data, int $code): void
    {
        // Set response code
        http_response_code($code);

        // Set headers
        header('Content-Type: application/json; charset=utf-8');
        header('Cache-Control: no-cache, no-store, must-revalidate');
        header('Pragma: no-cache');
        header('Expires: 0');

        // Add request ID for tracking
        $requestId = self::generateRequestId();
        header("X-Request-Id: {$requestId}");

        // Add timestamp
        $data['timestamp'] = date('c');

        // Output JSON
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    /**
     * Generate unique request ID
     */
    private static function generateRequestId(): string
    {
        return substr(bin2hex(random_bytes(8)), 0, 16);
    }
}
