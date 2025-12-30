<?php
/**
 * CMS Content API - Get all content for frontend
 */
require_once __DIR__ . '/bootstrap.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

try {
    $db = Database::getInstance()->getConnection();
    
    // Get all settings grouped
    $settings = [];
    $stmt = $db->query("SELECT setting_key, setting_value, setting_type, setting_group FROM cms_settings");
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $value = $row['setting_value'];
        if ($row['setting_type'] === 'json') {
            $value = json_decode($value, true);
        } elseif ($row['setting_type'] === 'boolean') {
            $value = (bool)$value;
        }
        $settings[$row['setting_key']] = $value;
    }
    
    // Get USPs
    $stmt = $db->query("SELECT id, icon, title, description FROM cms_usps WHERE is_active = 1 ORDER BY sort_order");
    $usps = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Get Templates
    $stmt = $db->query("SELECT id, name, icon, color, description FROM cms_templates WHERE is_active = 1 ORDER BY sort_order");
    $templates = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Get FAQs
    $stmt = $db->query("SELECT id, question, answer FROM cms_faqs WHERE is_active = 1 ORDER BY sort_order");
    $faqs = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'data' => [
            'settings' => $settings,
            'usps' => $usps,
            'templates' => $templates,
            'faqs' => $faqs
        ]
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to load content',
        'error' => $e->getMessage()
    ]);
}
