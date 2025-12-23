<?php
/**
 * Validator Helper
 * 
 * Input validation utilities.
 */

declare(strict_types=1);

namespace Helpers;

class Validator
{
    private array $errors = [];
    private array $data;

    public function __construct(array $data)
    {
        $this->data = $data;
    }

    /**
     * Create new validator instance
     */
    public static function make(array $data): self
    {
        return new self($data);
    }

    /**
     * Validate required field
     */
    public function required(string $field, string $label = null): self
    {
        $label = $label ?? $field;
        
        if (!isset($this->data[$field]) || trim((string) $this->data[$field]) === '') {
            $this->errors[$field] = "{$label} is required";
        }
        
        return $this;
    }

    /**
     * Validate email format
     */
    public function email(string $field, string $label = null): self
    {
        $label = $label ?? $field;
        
        if (isset($this->data[$field]) && !empty($this->data[$field])) {
            if (!filter_var($this->data[$field], FILTER_VALIDATE_EMAIL)) {
                $this->errors[$field] = "{$label} must be a valid email address";
            }
        }
        
        return $this;
    }

    /**
     * Validate phone number (Indian format)
     */
    public function phone(string $field, string $label = null): self
    {
        $label = $label ?? $field;
        
        if (isset($this->data[$field]) && !empty($this->data[$field])) {
            $phone = preg_replace('/[^0-9]/', '', $this->data[$field]);
            
            // Indian mobile: 10 digits starting with 6-9
            // Or with country code: 91 + 10 digits
            if (!preg_match('/^(91)?[6-9][0-9]{9}$/', $phone)) {
                $this->errors[$field] = "{$label} must be a valid Indian phone number";
            }
        }
        
        return $this;
    }

    /**
     * Validate minimum length
     */
    public function minLength(string $field, int $min, string $label = null): self
    {
        $label = $label ?? $field;
        
        if (isset($this->data[$field]) && strlen((string) $this->data[$field]) < $min) {
            $this->errors[$field] = "{$label} must be at least {$min} characters";
        }
        
        return $this;
    }

    /**
     * Validate maximum length
     */
    public function maxLength(string $field, int $max, string $label = null): self
    {
        $label = $label ?? $field;
        
        if (isset($this->data[$field]) && strlen((string) $this->data[$field]) > $max) {
            $this->errors[$field] = "{$label} must not exceed {$max} characters";
        }
        
        return $this;
    }

    /**
     * Validate numeric value
     */
    public function numeric(string $field, string $label = null): self
    {
        $label = $label ?? $field;
        
        if (isset($this->data[$field]) && !empty($this->data[$field])) {
            if (!is_numeric($this->data[$field])) {
                $this->errors[$field] = "{$label} must be a number";
            }
        }
        
        return $this;
    }

    /**
     * Validate integer value
     */
    public function integer(string $field, string $label = null): self
    {
        $label = $label ?? $field;
        
        if (isset($this->data[$field]) && !empty($this->data[$field])) {
            if (!filter_var($this->data[$field], FILTER_VALIDATE_INT)) {
                $this->errors[$field] = "{$label} must be an integer";
            }
        }
        
        return $this;
    }

    /**
     * Validate value is in array
     */
    public function in(string $field, array $allowed, string $label = null): self
    {
        $label = $label ?? $field;
        
        if (isset($this->data[$field]) && !empty($this->data[$field])) {
            if (!in_array($this->data[$field], $allowed, true)) {
                $this->errors[$field] = "{$label} must be one of: " . implode(', ', $allowed);
            }
        }
        
        return $this;
    }

    /**
     * Validate date format
     */
    public function date(string $field, string $format = 'Y-m-d', string $label = null): self
    {
        $label = $label ?? $field;
        
        if (isset($this->data[$field]) && !empty($this->data[$field])) {
            $date = \DateTime::createFromFormat($format, $this->data[$field]);
            if (!$date || $date->format($format) !== $this->data[$field]) {
                $this->errors[$field] = "{$label} must be a valid date";
            }
        }
        
        return $this;
    }

    /**
     * Validate regex pattern
     */
    public function regex(string $field, string $pattern, string $message): self
    {
        if (isset($this->data[$field]) && !empty($this->data[$field])) {
            if (!preg_match($pattern, $this->data[$field])) {
                $this->errors[$field] = $message;
            }
        }
        
        return $this;
    }

    /**
     * Custom validation callback
     */
    public function custom(string $field, callable $callback, string $message): self
    {
        if (isset($this->data[$field])) {
            if (!$callback($this->data[$field], $this->data)) {
                $this->errors[$field] = $message;
            }
        }
        
        return $this;
    }

    /**
     * Check if validation passed
     */
    public function passes(): bool
    {
        return empty($this->errors);
    }

    /**
     * Check if validation failed
     */
    public function fails(): bool
    {
        return !empty($this->errors);
    }

    /**
     * Get validation errors
     */
    public function errors(): array
    {
        return $this->errors;
    }

    /**
     * Get validated data
     */
    public function validated(): array
    {
        return $this->data;
    }

    /**
     * Sanitize string input
     */
    public static function sanitize(string $value): string
    {
        return htmlspecialchars(trim($value), ENT_QUOTES, 'UTF-8');
    }

    /**
     * Sanitize array of strings
     */
    public static function sanitizeArray(array $data): array
    {
        return array_map(function ($value) {
            return is_string($value) ? self::sanitize($value) : $value;
        }, $data);
    }
}
