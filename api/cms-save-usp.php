<?php
/**
 * CMS - Save USP
 */
require_once __DIR__ . '/bootstrap.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

session_start();
if (!isset($_SESSION['cms_admin_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

try {
    $input = json_decode(file_get_contents('php://input'), true);
    $db = Database::getInstance()->getConnection();
    
    if (isset($input['id']) && $input['id'] > 0) {
        // Update
        $stmt = $db->prepare("UPDATE cms_usps SET icon = ?, title = ?, description = ?, is_active = ? WHERE id = ?");
        $stmt->execute([$input['icon'], $input['title'], $input['description'], $input['is_active'] ?? 1, $input['id']]);
    } else {
        // Insert
        $stmt = $db->prepare("INSERT INTO cms_usps (icon, title, description, sort_order) VALUES (?, ?, ?, (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM cms_usps u))");
        $stmt->execute([$input['icon'], $input['title'], $input['description']]);
    }
    
    echo json_encode(['success' => true, 'message' => 'USP saved']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
