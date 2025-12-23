<?php
/**
 * Health Controller
 * 
 * API health check and status endpoints.
 */

declare(strict_types=1);

namespace Controllers;

use Helpers\Response;
use Helpers\Database;

class HealthController extends BaseController
{
    /**
     * Basic health check
     * GET /api/health
     */
    public function index(): void
    {
        Response::success([
            'status' => 'ok',
            'service' => 'Biodaat API',
            'version' => '1.0.0',
            'environment' => APP_ENV,
            'timestamp' => date('c'),
            'php_version' => PHP_VERSION,
        ], 'API is running');
    }

    /**
     * Database connectivity check
     * GET /api/health/db
     */
    public function database(): void
    {
        $db = Database::getInstance();
        $dbStatus = 'disconnected';
        $dbLatency = null;
        $tableCount = null;

        try {
            $start = microtime(true);
            
            if ($db->isConnected()) {
                $dbStatus = 'connected';
                $dbLatency = round((microtime(true) - $start) * 1000, 2);
                
                // Count tables as a simple query test
                $tableCount = $db->fetchColumn(
                    "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = ?",
                    [env('DB_NAME', 'biodaat_db')]
                );
            }
        } catch (\Exception $e) {
            $dbStatus = 'error';
            
            if (APP_DEBUG) {
                $dbStatus = 'error: ' . $e->getMessage();
            }
        }

        $isHealthy = $dbStatus === 'connected';

        $response = [
            'status' => $isHealthy ? 'healthy' : 'unhealthy',
            'checks' => [
                'api' => 'ok',
                'database' => $dbStatus,
            ],
            'metrics' => [
                'db_latency_ms' => $dbLatency,
                'table_count' => $tableCount,
                'memory_usage_mb' => round(memory_get_usage(true) / 1024 / 1024, 2),
            ],
            'timestamp' => date('c'),
        ];

        if ($isHealthy) {
            Response::success($response, 'All systems operational');
        } else {
            Response::error('Database connection failed', 503, $response);
        }
    }
}
