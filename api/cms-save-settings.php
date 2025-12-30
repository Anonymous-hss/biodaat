<?php
/**
 * CMS Admin - Save settings
 */
require_once __DIR__ . '/bootstrap.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Check admin auth
session_start();
if (!isset($_SESSION['cms_admin_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

try {
    $input = json_decode(file_get_contents('php://input'), true);
    $db = Database::getInstance()->getConnection();
    
    if (!isset($input['settings']) || !is_array($input['settings'])) {
        throw new Exception('Invalid settings data');
    }
    
    $stmt = $db->prepare("UPDATE cms_settings SET setting_value = ? WHERE setting_key = ?");
    
    foreach ($input['settings'] as $key => $value) {
        if (is_array($value)) {
            $value = json_encode($value);
        }
        $stmt->execute([$value, $key]);
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Settings saved successfully'
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
