<?php
/**
 * Template Controller
 * 
 * Handles template gallery and detail endpoints.
 */

declare(strict_types=1);

namespace Controllers;

use Helpers\Response;
use Helpers\Database;
use Helpers\Auth;

class TemplateController extends BaseController
{
    /**
     * List all active templates
     * GET /api/templates.php
     */
    public function list(): void
    {
        $db = Database::getInstance();
        
        // Get pagination
        $pagination = $this->getPagination();
        
        // Count total
        $total = $db->count('templates', 'is_active = 1');
        
        // Fetch templates
        $templates = $db->fetchAll(
            "SELECT 
                id, name, slug, description, preview_image, 
                price, is_premium, sort_order, download_count, created_at
            FROM templates 
            WHERE is_active = 1 
            ORDER BY sort_order ASC, created_at DESC
            LIMIT ? OFFSET ?",
            [$pagination['per_page'], $pagination['offset']]
        );

        // Format response
        $formattedTemplates = array_map(function($template) {
            return [
                'id' => (int) $template['id'],
                'name' => $template['name'],
                'slug' => $template['slug'],
                'description' => $template['description'],
                'preview_image' => $template['preview_image'],
                'price' => (float) $template['price'],
                'is_premium' => (bool) $template['is_premium'],
                'is_free' => (float) $template['price'] == 0,
                'download_count' => (int) $template['download_count'],
            ];
        }, $templates);

        Response::paginated(
            $formattedTemplates,
            $pagination['page'],
            $pagination['per_page'],
            $total
        );
    }

    /**
     * Get single template with full details
     * GET /api/template.php?slug=classic-elegance
     */
    public function detail(): void
    {
        $slug = $this->getQuery('slug');
        $id = $this->getQuery('id');

        if (empty($slug) && empty($id)) {
            Response::error('Template slug or id is required', 400);
        }

        $db = Database::getInstance();

        // Fetch template
        if (!empty($slug)) {
            $template = $db->fetch(
                "SELECT * FROM templates WHERE slug = ? AND is_active = 1",
                [$slug]
            );
        } else {
            $template = $db->fetch(
                "SELECT * FROM templates WHERE id = ? AND is_active = 1",
                [(int) $id]
            );
        }

        if ($template === null) {
            Response::notFound('Template not found');
        }

        // Parse field schema
        $fieldSchema = json_decode($template['field_schema'], true) ?? [];

        // Check if user has purchased (if premium)
        $hasPurchased = false;
        $user = Auth::user();
        
        if ($user !== null && (float) $template['price'] > 0) {
            $hasPurchased = $db->exists(
                'orders',
                'user_id = ? AND template_id = ? AND status IN (?, ?)',
                [$user['id'], $template['id'], 'paid', 'free']
            );
        }

        Response::success([
            'template' => [
                'id' => (int) $template['id'],
                'name' => $template['name'],
                'slug' => $template['slug'],
                'description' => $template['description'],
                'preview_image' => $template['preview_image'],
                'price' => (float) $template['price'],
                'is_premium' => (bool) $template['is_premium'],
                'is_free' => (float) $template['price'] == 0,
                'download_count' => (int) $template['download_count'],
                'has_purchased' => $hasPurchased,
                'field_schema' => $fieldSchema,
            ],
        ]);
    }

    /**
     * Get all templates (admin)
     * GET /api/admin/templates.php
     */
    public function adminList(): void
    {
        $db = Database::getInstance();
        
        $pagination = $this->getPagination();
        $status = $this->getQuery('status'); // all, active, inactive
        
        // Build where clause
        $where = '1=1';
        $params = [];
        
        if ($status === 'active') {
            $where .= ' AND is_active = 1';
        } elseif ($status === 'inactive') {
            $where .= ' AND is_active = 0';
        }
        
        $total = $db->count('templates', $where, $params);
        
        $templates = $db->fetchAll(
            "SELECT * FROM templates 
            WHERE {$where}
            ORDER BY sort_order ASC, created_at DESC
            LIMIT ? OFFSET ?",
            array_merge($params, [$pagination['per_page'], $pagination['offset']])
        );

        Response::paginated($templates, $pagination['page'], $pagination['per_page'], $total);
    }

    /**
     * Toggle template active status (admin)
     * POST /api/admin/template-toggle.php
     */
    public function toggle(): void
    {
        $data = $this->getJsonBody();

        if (empty($data['id'])) {
            Response::error('Template ID is required', 400);
        }

        $db = Database::getInstance();

        // Get current status
        $template = $db->fetch(
            "SELECT id, is_active FROM templates WHERE id = ?",
            [(int) $data['id']]
        );

        if ($template === null) {
            Response::notFound('Template not found');
        }

        // Toggle status
        $newStatus = $template['is_active'] ? 0 : 1;
        $db->update('templates', ['is_active' => $newStatus], 'id = ?', [$template['id']]);

        Response::success([
            'id' => (int) $template['id'],
            'is_active' => (bool) $newStatus,
        ], $newStatus ? 'Template activated' : 'Template deactivated');
    }

    /**
     * Update template sort order (admin)
     * POST /api/admin/template-sort.php
     */
    public function updateSort(): void
    {
        $data = $this->getJsonBody();

        if (empty($data['orders']) || !is_array($data['orders'])) {
            Response::error('Orders array is required', 400);
        }

        $db = Database::getInstance();
        $db->beginTransaction();

        try {
            foreach ($data['orders'] as $item) {
                if (isset($item['id']) && isset($item['sort_order'])) {
                    $db->update(
                        'templates',
                        ['sort_order' => (int) $item['sort_order']],
                        'id = ?',
                        [(int) $item['id']]
                    );
                }
            }
            $db->commit();
            Response::success(null, 'Sort order updated');
        } catch (\Exception $e) {
            $db->rollback();
            Response::error('Failed to update sort order', 500);
        }
    }
}
