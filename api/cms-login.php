<?php
/**
 * CMS Admin Login
 */
require_once __DIR__ . '/bootstrap.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

session_start();

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (empty($input['username']) || empty($input['password'])) {
        throw new Exception('Username and password required');
    }
    
    $db = Database::getInstance()->getConnection();
    $stmt = $db->prepare("SELECT id, username, password, name FROM cms_admins WHERE username = ? AND is_active = 1");
    $stmt->execute([$input['username']]);
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$admin || !password_verify($input['password'], $admin['password'])) {
        throw new Exception('Invalid credentials');
    }
    
    // Update last login
    $db->prepare("UPDATE cms_admins SET last_login = NOW() WHERE id = ?")->execute([$admin['id']]);
    
    // Set session
    $_SESSION['cms_admin_id'] = $admin['id'];
    $_SESSION['cms_admin_name'] = $admin['name'];
    
    echo json_encode([
        'success' => true,
        'message' => 'Login successful',
        'admin' => [
            'id' => $admin['id'],
            'name' => $admin['name']
        ]
    ]);
    
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
