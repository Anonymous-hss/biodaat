<?php
/**
 * Diagnostic Endpoint
 * Tests if PDF generation dependencies are available
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$results = [
    'php_version' => PHP_VERSION,
    'checks' => []
];

// Check 1: Storage directories
$storagePath = __DIR__ . '/../storage/pdfs';
$tempPath = __DIR__ . '/../storage/temp';

$results['checks']['storage_pdfs_exists'] = is_dir($storagePath);
$results['checks']['storage_pdfs_writable'] = is_writable($storagePath);
$results['checks']['storage_temp_exists'] = is_dir($tempPath);
$results['checks']['storage_temp_writable'] = is_writable($tempPath);

// Check 2: Vendor autoload
$vendorPath = __DIR__ . '/../vendor/autoload.php';
$results['checks']['vendor_exists'] = file_exists($vendorPath);

// Check 3: mPDF class
if (file_exists($vendorPath)) {
    require_once $vendorPath;
    $results['checks']['mpdf_class_exists'] = class_exists('\\Mpdf\\Mpdf');
} else {
    $results['checks']['mpdf_class_exists'] = false;
}

// Check 4: Bootstrap
$bootstrapPath = __DIR__ . '/bootstrap.php';
$results['checks']['bootstrap_exists'] = file_exists($bootstrapPath);

// Check 5: PDFService
$pdfServicePath = __DIR__ . '/helpers/PDFService.php';
$results['checks']['pdfservice_exists'] = file_exists($pdfServicePath);

// Check 6: PDFController
$pdfControllerPath = __DIR__ . '/controllers/PDFController.php';
$results['checks']['pdfcontroller_exists'] = file_exists($pdfControllerPath);

// Check 7: Templates directory
$templatesPath = __DIR__ . '/../templates/html';
$results['checks']['templates_dir_exists'] = is_dir($templatesPath);

// Try to load bootstrap and test database
try {
    if (defined('APP_ROOT')) {
        $results['checks']['app_root_defined'] = true;
    }
    
    require_once $bootstrapPath;
    $results['checks']['bootstrap_loaded'] = true;
    
    // Test database connection
    require_once __DIR__ . '/helpers/Database.php';
    $db = \Helpers\Database::getInstance();
    $results['checks']['database_connected'] = true;
    
    // Check templates table
    $templateCount = $db->count('templates');
    $results['checks']['templates_count'] = $templateCount;
    
} catch (Exception $e) {
    $results['checks']['bootstrap_error'] = $e->getMessage();
}

// Summary
$allPassed = !in_array(false, $results['checks'], true);
$results['all_passed'] = $allPassed;

echo json_encode($results, JSON_PRETTY_PRINT);
