<?php
/**
 * Database Debug Script
 * Checks .env loading and connection details
 */
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>Database Debugger</h1>";

// 1. Check .env file
$envPath = __DIR__ . '/../.env';
echo "<h2>1. Environment File</h2>";
if (file_exists($envPath)) {
    echo "✅ .env file found at: " . $envPath . "<br>";
    $lines = file($envPath);
    echo "File has " . count($lines) . " lines.<br>";
} else {
    echo "❌ .env file NOT found at: " . $envPath . "<br>";
}

// 2. Load Bootstrap
echo "<h2>2. Bootstrap Loading</h2>";
try {
    require_once __DIR__ . '/bootstrap.php';
    echo "✅ Bootstrap loaded successfully.<br>";
} catch (Exception $e) {
    echo "❌ Bootstrap failed: " . $e->getMessage() . "<br>";
}

// 3. Inspect Config
echo "<h2>3. Loaded Configuration</h2>";
echo "<strong>APP_ENV:</strong> " . (defined('APP_ENV') ? APP_ENV : 'Not Valid') . "<br>";
echo "<strong>DB Config:</strong><br>";

// Show masked credentials
$dbHost = getenv('DB_HOST') ?: $_ENV['DB_HOST'] ?? 'Not Set';
$dbName = getenv('DB_NAME') ?: $_ENV['DB_NAME'] ?? 'Not Set';
$dbUser = getenv('DB_USER') ?: $_ENV['DB_USER'] ?? 'Not Set';
$dbPass = getenv('DB_PASS') ?: $_ENV['DB_PASS'] ?? 'Not Set';

echo "Host: " . $dbHost . "<br>";
echo "Database: " . $dbName . "<br>";
echo "User: " . $dbUser . "<br>";
echo "Password: " . (strlen($dbPass) > 0 ? str_repeat('*', strlen($dbPass)) . " (Length: " . strlen($dbPass) . ")" : 'Empty') . "<br>";

// 4. Test Connection
echo "<h2>4. Connection Test</h2>";
try {
    $dsn = "mysql:host=$dbHost;dbname=$dbName;charset=utf8mb4";
    echo "Attempting connection to: $dsn ...<br>";
    
    $pdo = new PDO($dsn, $dbUser, $dbPass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_TIMEOUT => 5
    ]);
    
    echo "✅ <strong>Connection Successful!</strong><br>";
    echo "Server Version: " . $pdo->getAttribute(PDO::ATTR_SERVER_VERSION) . "<br>";
    
} catch (PDOException $e) {
    echo "❌ <strong>Connection Failed:</strong> " . $e->getMessage() . "<br>";
    echo "<br><strong>Possible Causes:</strong><br>";
    echo "1. Incorrect Password (check .env)<br>";
    echo "2. Incorrect Username (check .env)<br>";
    echo "3. User does not have permission for this database<br>";
    echo "4. Database name does not exist<br>";
}
