<?php
/**
 * Database Installation Script
 * 
 * RUN THIS ONLY ONCE TO SETUP THE DATABASE.
 * 
 * Usage: Visit /api/install.php in your browser.
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);
set_time_limit(300); // 5 minutes max

echo "<h1>Database Installer</h1>";

// 1. Load Bootstrap to get DB config
try {
    require_once __DIR__ . '/bootstrap.php';
    echo "✅ Configuration loaded.<br>";
} catch (Exception $e) {
    die("❌ Failed to load bootstrap: " . $e->getMessage());
}

// 2. Connect to Database
try {
    $db = \Helpers\Database::getInstance();
    $pdo = $db->getConnection();
    echo "✅ Connected to Database.<br>";
} catch (Exception $e) {
    die("❌ <strong>Connection Failed:</strong> " . $e->getMessage() . "<br>Please check your .env file credentials first.");
}

// 3. Define SQL files to run
$files = [
    __DIR__ . '/../sql/schema.sql',
    __DIR__ . '/../sql/cms_schema.sql'
];

// 4. Run SQL Files
foreach ($files as $file) {
    $filename = basename($file);
    echo "<h2>Running $filename...</h2>";
    
    if (!file_exists($file)) {
        echo "❌ File not found: $file<br>";
        continue;
    }

    $sql = file_get_contents($file);
    
    // Simplistic SQL splitter
    // Note: detailed parsing might be needed for complex logic, but for schema it's usually fine
    $queries = explode(';', $sql);

    $successCount = 0;
    $errorCount = 0;

    foreach ($queries as $query) {
        $query = trim($query);
        if (empty($query)) continue;

        try {
            $pdo->exec($query);
            $successCount++;
        } catch (PDOException $e) {
            // Ignore "Table already exists" errors if using IF NOT EXISTS, 
            // but show others.
            if (strpos($e->getMessage(), 'already exists') !== false) {
                echo "⚠️ Table already exists (Skipped)<br>";
            } else {
                echo "❌ Error in query: " . htmlspecialchars(substr($query, 0, 100)) . "...<br>";
                echo "Message: " . $e->getMessage() . "<br>";
                $errorCount++;
            }
        }
    }

    echo "Finished $filename. ($successCount success, $errorCount errors)<br>";
}

echo "<h2>🎉 Installation Complete!</h2>";
echo "You can now use the application.<br>";
echo "<strong>Security Warning:</strong> Please delete this file (api/install.php) from your server.";
