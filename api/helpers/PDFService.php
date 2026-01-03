<?php
/**
 * PDF Service
 * 
 * Handles PDF generation using mPDF library.
 * Requires: composer require mpdf/mpdf
 */

declare(strict_types=1);

namespace Helpers;

class PDFService
{
    private string $templatesPath;
    private string $outputPath;
    private string $fontsPath;

    public function __construct()
    {
        $this->templatesPath = APP_ROOT . '/templates/html';
        $this->outputPath = APP_ROOT . '/storage/pdfs';
        $this->fontsPath = APP_ROOT . '/storage/fonts';

        // Ensure directories exist
        if (!is_dir($this->outputPath)) {
            mkdir($this->outputPath, 0755, true);
        }
    }

    /**
     * Generate PDF from template and form data
     */
    public function generate(array $template, array $formData, int $userId): array
    {
        // Render HTML from template
        $html = $this->renderTemplate($template, $formData);

        // Generate unique filename
        $filename = $this->generateFilename($template['slug'], $userId);
        $filepath = $this->outputPath . '/' . $filename;

        // Check if mPDF is available
        if ($this->isMPDFAvailable()) {
            $this->generateWithMPDF($html, $filepath, $template);
        } else {
            // Fallback: Save as HTML (user can print to PDF)
            $this->generateHTMLFallback($html, $filepath);
            $filename = str_replace('.pdf', '.html', $filename);
        }

        return [
            'filename' => $filename,
            'filepath' => $filepath,
            'size' => filesize($filepath),
        ];
    }

    /**
     * Render HTML template with form data
     */
    private function renderTemplate(array $template, array $formData): string
    {
        $templateFile = $this->templatesPath . '/' . $template['template_file'];

        // If template file doesn't exist, use default template
        if (!file_exists($templateFile)) {
            return $this->renderDefaultTemplate($template, $formData);
        }

        // Load template HTML
        $html = file_get_contents($templateFile);

        // Replace placeholders with form data
        foreach ($formData as $key => $value) {
            $html = str_replace('{{' . $key . '}}', htmlspecialchars((string) $value), $html);
        }

        // Replace template metadata
        $html = str_replace('{{template_name}}', $template['name'], $html);
        $html = str_replace('{{generated_date}}', date('d M Y'), $html);

        return $html;
    }

    /**
     * Generate default biodata template HTML
     */
    private function renderDefaultTemplate(array $template, array $formData): string
    {
        // Personal Details
        $name = $formData['full_name'] ?? 'Name Not Provided';
        $dob = $formData['date_of_birth'] ?? '';
        $birthTime = $formData['birth_time'] ?? '';
        $birthPlace = $formData['birth_place'] ?? '';
        $height = $formData['height'] ?? '';
        $complexion = $formData['complexion'] ?? '';
        $bloodGroup = $formData['blood_group'] ?? '';
        $maritalStatus = $formData['marital_status'] ?? 'Never Married';
        $aboutMe = $formData['about_me'] ?? '';
        
        // Religious Background
        $religion = $formData['religion'] ?? '';
        $caste = $formData['caste'] ?? '';
        $gotra = $formData['gotra'] ?? '';
        
        // Education & Career
        $education = $formData['education'] ?? '';
        $occupation = $formData['occupation'] ?? '';
        $company = $formData['company'] ?? '';
        $income = $formData['income'] ?? '';
        $hobbies = $formData['hobbies'] ?? '';
        
        // Family Details
        $fatherName = $formData['father_name'] ?? '';
        $fatherOccupation = $formData['father_occupation'] ?? '';
        $motherName = $formData['mother_name'] ?? '';
        $motherOccupation = $formData['mother_occupation'] ?? '';
        $siblings = $formData['siblings'] ?? '';
        $familyType = $formData['family_type'] ?? '';
        
        // Contact Information
        $address = $formData['address'] ?? '';
        $city = $formData['city'] ?? '';
        $state = $formData['state'] ?? '';
        $phone = $formData['phone'] ?? '';
        $email = $formData['email'] ?? '';

        $html = <<<HTML
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Biodata - {$name}</title>
    <style>
        @page {
            margin: 20mm;
            size: A4;
        }
        body {
            font-family: 'Noto Sans', 'Arial', sans-serif;
            font-size: 12pt;
            line-height: 1.6;
            color: #333;
            background: #fff;
        }
        .container {
            max-width: 700px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            border-bottom: 3px double #8B4513;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #8B4513;
            font-size: 28pt;
            margin: 0;
            font-weight: normal;
        }
        .header .subtitle {
            color: #666;
            font-size: 14pt;
            margin-top: 5px;
        }
        .om-symbol {
            font-size: 36pt;
            color: #FF6600;
            margin-bottom: 10px;
        }
        .section {
            margin-bottom: 25px;
        }
        .section-title {
            background: linear-gradient(90deg, #8B4513, transparent);
            color: white;
            padding: 8px 15px;
            font-size: 14pt;
            margin-bottom: 15px;
            border-radius: 3px;
        }
        .field-row {
            display: flex;
            margin-bottom: 8px;
            border-bottom: 1px dotted #ddd;
            padding-bottom: 5px;
        }
        .field-label {
            width: 40%;
            font-weight: bold;
            color: #555;
        }
        .field-value {
            width: 60%;
            color: #333;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 10pt;
            color: #888;
        }
        .photo-placeholder {
            width: 120px;
            height: 150px;
            border: 2px solid #8B4513;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #999;
            font-size: 10pt;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="om-symbol">ॐ</div>
            <h1>|| श्री गणेशाय नमः ||</h1>
            <div class="subtitle">BIODATA</div>
        </div>

        <div class="section">
            <div class="section-title">Personal Details</div>
            <div class="field-row">
                <div class="field-label">Full Name</div>
                <div class="field-value">{$name}</div>
            </div>
            <div class="field-row">
                <div class="field-label">Date of Birth</div>
                <div class="field-value">{$dob}</div>
            </div>
            <div class="field-row">
                <div class="field-label">Birth Time</div>
                <div class="field-value">{$birthTime}</div>
            </div>
            <div class="field-row">
                <div class="field-label">Birth Place</div>
                <div class="field-value">{$birthPlace}</div>
            </div>
            <div class="field-row">
                <div class="field-label">Height</div>
                <div class="field-value">{$height}</div>
            </div>
            <div class="field-row">
                <div class="field-label">Complexion</div>
                <div class="field-value">{$complexion}</div>
            </div>
            <div class="field-row">
                <div class="field-label">Blood Group</div>
                <div class="field-value">{$bloodGroup}</div>
            </div>
            <div class="field-row">
                <div class="field-label">Marital Status</div>
                <div class="field-value">{$maritalStatus}</div>
            </div>
            <div class="field-row">
                <div class="field-label">About Me</div>
                <div class="field-value">{$aboutMe}</div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Religious Background</div>
            <div class="field-row">
                <div class="field-label">Religion</div>
                <div class="field-value">{$religion}</div>
            </div>
            <div class="field-row">
                <div class="field-label">Caste</div>
                <div class="field-value">{$caste}</div>
            </div>
            <div class="field-row">
                <div class="field-label">Gotra</div>
                <div class="field-value">{$gotra}</div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Education & Career</div>
            <div class="field-row">
                <div class="field-label">Education</div>
                <div class="field-value">{$education}</div>
            </div>
            <div class="field-row">
                <div class="field-label">Occupation</div>
                <div class="field-value">{$occupation}</div>
            </div>
            <div class="field-row">
                <div class="field-label">Company</div>
                <div class="field-value">{$company}</div>
            </div>
            <div class="field-row">
                <div class="field-label">Annual Income</div>
                <div class="field-value">{$income}</div>
            </div>
            <div class="field-row">
                <div class="field-label">Hobbies</div>
                <div class="field-value">{$hobbies}</div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Family Details</div>
            <div class="field-row">
                <div class="field-label">Family Type</div>
                <div class="field-value">{$familyType}</div>
            </div>
            <div class="field-row">
                <div class="field-label">Father's Name</div>
                <div class="field-value">{$fatherName}</div>
            </div>
            <div class="field-row">
                <div class="field-label">Father's Occupation</div>
                <div class="field-value">{$fatherOccupation}</div>
            </div>
            <div class="field-row">
                <div class="field-label">Mother's Name</div>
                <div class="field-value">{$motherName}</div>
            </div>
            <div class="field-row">
                <div class="field-label">Mother's Occupation</div>
                <div class="field-value">{$motherOccupation}</div>
            </div>
            <div class="field-row">
                <div class="field-label">Siblings</div>
                <div class="field-value">{$siblings}</div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Contact Information</div>
            <div class="field-row">
                <div class="field-label">Address</div>
                <div class="field-value">{$address}</div>
            </div>
            <div class="field-row">
                <div class="field-label">City</div>
                <div class="field-value">{$city}</div>
            </div>
            <div class="field-row">
                <div class="field-label">State</div>
                <div class="field-value">{$state}</div>
            </div>
            <div class="field-row">
                <div class="field-label">Contact Number</div>
                <div class="field-value">{$phone}</div>
            </div>
            <div class="field-row">
                <div class="field-label">Email</div>
                <div class="field-value">{$email}</div>
            </div>
        </div>

        <div class="footer">
            Generated on {$this->getCurrentDate()} | Biodaat.com
        </div>
    </div>
</body>
</html>
HTML;

        return $html;
    }

    /**
     * Get current date formatted
     */
    private function getCurrentDate(): string
    {
        return date('d M Y');
    }

    /**
     * Generate PDF using mPDF
     */
    private function generateWithMPDF(string $html, string $filepath, array $template): void
    {
        require_once APP_ROOT . '/vendor/autoload.php';

        $mpdf = new \Mpdf\Mpdf([
            'mode' => 'utf-8',
            'format' => 'A4',
            'margin_left' => 15,
            'margin_right' => 15,
            'margin_top' => 15,
            'margin_bottom' => 15,
            'tempDir' => APP_ROOT . '/storage/temp',
        ]);

        $mpdf->SetTitle('Biodata - ' . ($template['name'] ?? 'Wedding Biodata'));
        $mpdf->SetAuthor('Biodaat');
        $mpdf->SetCreator('Biodaat.com');

        $mpdf->WriteHTML($html);
        $mpdf->Output($filepath, \Mpdf\Output\Destination::FILE);
    }

    /**
     * Fallback: Save as HTML file
     */
    private function generateHTMLFallback(string $html, string $filepath): void
    {
        $htmlPath = str_replace('.pdf', '.html', $filepath);
        file_put_contents($htmlPath, $html);
    }

    /**
     * Check if mPDF is available
     */
    private function isMPDFAvailable(): bool
    {
        return file_exists(APP_ROOT . '/vendor/autoload.php') 
            && class_exists('\Mpdf\Mpdf');
    }

    /**
     * Generate unique filename
     */
    private function generateFilename(string $templateSlug, int $userId): string
    {
        $timestamp = date('Ymd_His');
        $random = substr(bin2hex(random_bytes(4)), 0, 8);
        return "biodata_{$templateSlug}_{$userId}_{$timestamp}_{$random}.pdf";
    }

    /**
     * Delete a PDF file
     */
    public function delete(string $filename): bool
    {
        $filepath = $this->outputPath . '/' . $filename;
        if (file_exists($filepath)) {
            return unlink($filepath);
        }
        return false;
    }

    /**
     * Get PDF file path
     */
    public function getFilePath(string $filename): ?string
    {
        $filepath = $this->outputPath . '/' . $filename;
        return file_exists($filepath) ? $filepath : null;
    }
}
