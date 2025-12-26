<?php
/**
 * Alternative Health Check - Direct access without URL rewriting
 * Access via: /api/health.php
 */

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/middleware/Cors.php';

use Helpers\Response;
use Middleware\Cors;

Cors::handle();

// Load and run health controller
require_once __DIR__ . '/controllers/HealthController.php';

$controller = new Controllers\HealthController();
$controller->index();
