<?php
/**
 * Database Health Check - Direct access without URL rewriting
 * Access via: /api/health-db.php
 */

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/middleware/Cors.php';

use Helpers\Response;
use Middleware\Cors;

Cors::handle();

// Load and run health controller database check
require_once __DIR__ . '/controllers/HealthController.php';

$controller = new Controllers\HealthController();
$controller->database();
