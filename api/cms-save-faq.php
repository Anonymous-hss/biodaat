<?php
/**
 * CMS - Save FAQ
 */
require_once __DIR__ . '/bootstrap.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, DELETE, OPTIONS');
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
    
    // Delete
    if ($_SERVER['REQUEST_METHOD'] === 'DELETE' || (isset($input['action']) && $input['action'] === 'delete')) {
        $stmt = $db->prepare("DELETE FROM cms_faqs WHERE id = ?");
        $stmt->execute([$input['id']]);
        echo json_encode(['success' => true, 'message' => 'FAQ deleted']);
        exit;
    }
    
    if (isset($input['id']) && $input['id'] > 0) {
        // Update
        $stmt = $db->prepare("UPDATE cms_faqs SET question = ?, answer = ?, is_active = ? WHERE id = ?");
        $stmt->execute([$input['question'], $input['answer'], $input['is_active'] ?? 1, $input['id']]);
    } else {
        // Insert
        $stmt = $db->prepare("INSERT INTO cms_faqs (question, answer, sort_order) VALUES (?, ?, (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM cms_faqs f))");
        $stmt->execute([$input['question'], $input['answer']]);
    }
    
    echo json_encode(['success' => true, 'message' => 'FAQ saved']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
