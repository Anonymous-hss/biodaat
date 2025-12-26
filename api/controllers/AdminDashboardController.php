<?php
/**
 * Admin Dashboard Controller
 * 
 * Provides admin dashboard statistics and management APIs.
 */

declare(strict_types=1);

namespace Controllers;

use Helpers\Response;
use Helpers\Database;
use Helpers\JWT;

class AdminDashboardController extends BaseController
{
    /**
     * Get dashboard statistics
     * GET /api/admin-stats.php
     */
    public function stats(): void
    {
        $this->requireAdmin();

        $db = Database::getInstance();

        // Get counts
        $totalUsers = $db->count('users');
        $activeUsers = $db->count('users', 'is_active = 1');
        $totalTemplates = $db->count('templates');
        $activeTemplates = $db->count('templates', 'is_active = 1');
        $totalBiodatas = $db->count('generated_biodatas');
        $totalDownloads = $db->fetch(
            "SELECT COALESCE(SUM(download_count), 0) as total FROM download_tokens"
        )['total'] ?? 0;

        // Today's stats
        $today = date('Y-m-d');
        $todayUsers = $db->count('users', 'DATE(created_at) = ?', [$today]);
        $todayBiodatas = $db->count('generated_biodatas', 'DATE(created_at) = ?', [$today]);

        // This week's stats
        $weekAgo = date('Y-m-d', strtotime('-7 days'));
        $weekUsers = $db->count('users', 'DATE(created_at) >= ?', [$weekAgo]);
        $weekBiodatas = $db->count('generated_biodatas', 'DATE(created_at) >= ?', [$weekAgo]);

        // This month's stats
        $monthStart = date('Y-m-01');
        $monthUsers = $db->count('users', 'DATE(created_at) >= ?', [$monthStart]);
        $monthBiodatas = $db->count('generated_biodatas', 'DATE(created_at) >= ?', [$monthStart]);

        // Most popular templates
        $popularTemplates = $db->fetchAll(
            "SELECT id, name, slug, download_count 
            FROM templates 
            ORDER BY download_count DESC 
            LIMIT 5"
        );

        // Recent biodatas
        $recentBiodatas = $db->fetchAll(
            "SELECT gb.id, gb.created_at, u.phone, t.name as template_name
            FROM generated_biodatas gb
            JOIN users u ON gb.user_id = u.id
            JOIN templates t ON gb.template_id = t.id
            ORDER BY gb.created_at DESC
            LIMIT 10"
        );

        Response::success([
            'overview' => [
                'total_users' => (int) $totalUsers,
                'active_users' => (int) $activeUsers,
                'total_templates' => (int) $totalTemplates,
                'active_templates' => (int) $activeTemplates,
                'total_biodatas' => (int) $totalBiodatas,
                'total_downloads' => (int) $totalDownloads,
            ],
            'today' => [
                'new_users' => (int) $todayUsers,
                'biodatas_generated' => (int) $todayBiodatas,
            ],
            'this_week' => [
                'new_users' => (int) $weekUsers,
                'biodatas_generated' => (int) $weekBiodatas,
            ],
            'this_month' => [
                'new_users' => (int) $monthUsers,
                'biodatas_generated' => (int) $monthBiodatas,
            ],
            'popular_templates' => $popularTemplates,
            'recent_biodatas' => $recentBiodatas,
        ]);
    }

    /**
     * Get all users (paginated)
     * GET /api/admin-users.php
     */
    public function users(): void
    {
        $this->requireAdmin();

        $db = Database::getInstance();
        $pagination = $this->getPagination();
        $search = $this->getQuery('search');

        $where = '1=1';
        $params = [];

        if ($search) {
            $where .= ' AND (phone LIKE ? OR name LIKE ? OR email LIKE ?)';
            $searchTerm = '%' . $search . '%';
            $params = [$searchTerm, $searchTerm, $searchTerm];
        }

        $total = $db->count('users', $where, $params);

        $users = $db->fetchAll(
            "SELECT id, phone, name, email, is_active, created_at, last_login_at
            FROM users
            WHERE {$where}
            ORDER BY created_at DESC
            LIMIT ? OFFSET ?",
            array_merge($params, [$pagination['per_page'], $pagination['offset']])
        );

        // Add biodata count for each user
        foreach ($users as &$user) {
            $user['biodata_count'] = $db->count(
                'generated_biodatas',
                'user_id = ?',
                [$user['id']]
            );
        }

        Response::paginated($users, $pagination['page'], $pagination['per_page'], $total);
    }

    /**
     * Toggle user active status
     * POST /api/admin-user-toggle.php
     */
    public function toggleUser(): void
    {
        $this->requireAdmin();

        $data = $this->getJsonBody();

        if (empty($data['user_id'])) {
            Response::error('User ID is required', 400);
        }

        $db = Database::getInstance();

        $user = $db->fetch(
            "SELECT id, is_active FROM users WHERE id = ?",
            [(int) $data['user_id']]
        );

        if ($user === null) {
            Response::notFound('User not found');
        }

        $newStatus = $user['is_active'] ? 0 : 1;
        $db->update('users', ['is_active' => $newStatus], 'id = ?', [$user['id']]);

        Response::success([
            'user_id' => (int) $user['id'],
            'is_active' => (bool) $newStatus,
        ], $newStatus ? 'User activated' : 'User deactivated');
    }

    /**
     * Get all generated biodatas (admin view)
     * GET /api/admin-biodatas.php
     */
    public function biodatas(): void
    {
        $this->requireAdmin();

        $db = Database::getInstance();
        $pagination = $this->getPagination();
        $templateId = $this->getQuery('template_id');
        $userId = $this->getQuery('user_id');

        $where = '1=1';
        $params = [];

        if ($templateId) {
            $where .= ' AND gb.template_id = ?';
            $params[] = (int) $templateId;
        }

        if ($userId) {
            $where .= ' AND gb.user_id = ?';
            $params[] = (int) $userId;
        }

        $total = $db->fetch(
            "SELECT COUNT(*) as cnt FROM generated_biodatas gb WHERE {$where}",
            $params
        )['cnt'];

        $biodatas = $db->fetchAll(
            "SELECT gb.*, u.phone, u.name as user_name, t.name as template_name
            FROM generated_biodatas gb
            JOIN users u ON gb.user_id = u.id
            JOIN templates t ON gb.template_id = t.id
            WHERE {$where}
            ORDER BY gb.created_at DESC
            LIMIT ? OFFSET ?",
            array_merge($params, [$pagination['per_page'], $pagination['offset']])
        );

        Response::paginated($biodatas, $pagination['page'], $pagination['per_page'], (int) $total);
    }

    /**
     * Require admin authentication
     */
    private function requireAdmin(): void
    {
        $token = JWT::getTokenFromHeader();
        
        if ($token === null && isset($_COOKIE['admin_token'])) {
            $token = $_COOKIE['admin_token'];
        }

        if ($token === null) {
            Response::unauthorized('Admin authentication required');
        }

        $payload = JWT::decode($token);
        if ($payload === null || empty($payload['is_admin'])) {
            Response::unauthorized('Invalid admin token');
        }
    }
}
