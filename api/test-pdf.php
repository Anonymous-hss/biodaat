<?php
/**
 * Diagnostic Endpoint
 * Tests if PDF generation dependencies are available
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

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

// Try to load and test PDFService
try {
    require_once $bootstrapPath;
    $results['checks']['bootstrap_loaded'] = true;
    $results['checks']['app_root'] = defined('APP_ROOT') ? APP_ROOT : 'NOT DEFINED';
    
    require_once __DIR__ . '/helpers/PDFService.php';
    $results['checks']['pdfservice_loaded'] = true;
    
    // Try creating PDFService instance
    $pdfService = new \Helpers\PDFService();
    $results['checks']['pdfservice_created'] = true;
    
    // Create test template and form data
    $template = [
        'id' => 1,
        'name' => 'Test Template',
        'slug' => 'test',
        'template_file' => 'test.html',
        'price' => 0
    ];
    
    $formData = [
        'full_name' => 'Test User',
        'date_of_birth' => '1990-01-01',
        'education' => 'B.Tech'
    ];
    
    // Try generating PDF
    $result = $pdfService->generate($template, $formData, 0);
    $results['checks']['pdf_generated'] = true;
    $results['checks']['pdf_filename'] = $result['filename'];
    $results['checks']['pdf_size'] = $result['size'];
    
} catch (Exception $e) {
    $results['checks']['error'] = $e->getMessage();
    $results['checks']['error_file'] = $e->getFile();
    $results['checks']['error_line'] = $e->getLine();
} catch (Error $e) {
    $results['checks']['fatal_error'] = $e->getMessage();
    $results['checks']['error_file'] = $e->getFile();
    $results['checks']['error_line'] = $e->getLine();
}

// Summary
$results['all_passed'] = isset($results['checks']['pdf_generated']) && $results['checks']['pdf_generated'];

echo json_encode($results, JSON_PRETTY_PRINT);
