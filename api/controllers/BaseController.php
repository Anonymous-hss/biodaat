<?php
/**
 * Base Controller
 * 
 * Parent class for all controllers with common utilities.
 */

declare(strict_types=1);

namespace Controllers;

use Helpers\Response;
use Helpers\Validator;

abstract class BaseController
{
    /**
     * Get JSON request body
     */
    protected function getJsonBody(): array
    {
        $input = file_get_contents('php://input');
        
        if (empty($input)) {
            return [];
        }

        $data = json_decode($input, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            Response::error('Invalid JSON payload', 400);
        }

        return $data ?? [];
    }

    /**
     * Get request query parameters
     */
    protected function getQueryParams(): array
    {
        return $_GET;
    }

    /**
     * Get specific query parameter
     */
    protected function getQuery(string $key, mixed $default = null): mixed
    {
        return $_GET[$key] ?? $default;
    }

    /**
     * Get request method
     */
    protected function getMethod(): string
    {
        return $_SERVER['REQUEST_METHOD'];
    }

    /**
     * Get client IP address
     */
    protected function getClientIp(): string
    {
        $headers = [
            'HTTP_CF_CONNECTING_IP',     // Cloudflare
            'HTTP_X_FORWARDED_FOR',      // Standard proxy
            'HTTP_X_REAL_IP',            // Nginx
            'REMOTE_ADDR',               // Direct connection
        ];

        foreach ($headers as $header) {
            if (!empty($_SERVER[$header])) {
                $ip = $_SERVER[$header];
                // X-Forwarded-For can contain multiple IPs
                if (strpos($ip, ',') !== false) {
                    $ip = trim(explode(',', $ip)[0]);
                }
                if (filter_var($ip, FILTER_VALIDATE_IP)) {
                    return $ip;
                }
            }
        }

        return '0.0.0.0';
    }

    /**
     * Get user agent
     */
    protected function getUserAgent(): string
    {
        return $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';
    }

    /**
     * Validate request data
     */
    protected function validate(array $data, array $rules): Validator
    {
        $validator = Validator::make($data);

        foreach ($rules as $field => $rule) {
            // Parse rule string like "required|email|min:5"
            $parts = explode('|', $rule);
            
            foreach ($parts as $part) {
                if (strpos($part, ':') !== false) {
                    [$method, $param] = explode(':', $part, 2);
                    $validator->$method($field, (int) $param);
                } else {
                    $validator->$part($field);
                }
            }
        }

        if ($validator->fails()) {
            Response::validationError($validator->errors());
        }

        return $validator;
    }

    /**
     * Get pagination parameters
     */
    protected function getPagination(): array
    {
        $page = max(1, (int) ($this->getQuery('page', 1)));
        $perPage = min(100, max(1, (int) ($this->getQuery('per_page', 20))));
        $offset = ($page - 1) * $perPage;

        return [
            'page' => $page,
            'per_page' => $perPage,
            'offset' => $offset,
        ];
    }
}
