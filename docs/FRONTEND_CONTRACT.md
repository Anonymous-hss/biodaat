# Frontend-Backend Integration Contract

## Overview

This document defines how the Next.js frontend integrates with the PHP backend for the wedding biodata generator, specifically for the real-time preview feature.

---

## Core Principle: Client-Side Preview

> **The real-time preview happens 100% client-side.**
> No API calls during typing - only when generating final PDF.

```
┌─────────────────────────────────────────────────────┐
│                    Frontend (React)                  │
│                                                      │
│  ┌──────────┐    ┌──────────┐    ┌──────────────┐  │
│  │  Form    │───▶│  State   │───▶│   Preview    │  │
│  │  Input   │    │  (React) │    │   (Live)     │  │
│  └──────────┘    └──────────┘    └──────────────┘  │
│                        │                            │
│                        ▼ (only on submit)           │
└────────────────────────┼────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│                    Backend (PHP)                     │
│                                                      │
│  POST /api/generate-pdf.php  ───▶  PDF Generated    │
│                                                      │
└─────────────────────────────────────────────────────┘
```

---

## Template Field Schema

Each template has a `field_schema` that defines what form fields to render.

### Schema Structure

```json
{
  "sections": [
    {
      "id": "personal",
      "title": "Personal Details",
      "fields": [
        {
          "key": "full_name",
          "label": "Full Name",
          "type": "text",
          "required": true,
          "placeholder": "Enter your full name"
        },
        {
          "key": "date_of_birth",
          "label": "Date of Birth",
          "type": "date",
          "required": true
        },
        {
          "key": "complexion",
          "label": "Complexion",
          "type": "select",
          "options": ["Fair", "Wheatish", "Medium", "Dark"],
          "required": false
        }
      ]
    }
  ]
}
```

### Field Types

| Type | React Component | Description |
|------|-----------------|-------------|
| `text` | `<input type="text">` | Single line text |
| `textarea` | `<textarea>` | Multi-line text |
| `date` | `<input type="date">` | Date picker |
| `select` | `<select>` | Dropdown with `options` |
| `radio` | `<input type="radio">` | Radio buttons with `options` |
| `checkbox` | `<input type="checkbox">` | Boolean checkbox |
| `phone` | `<input type="tel">` | Phone number |
| `email` | `<input type="email">` | Email address |
| `image` | `<input type="file">` | Photo upload |

---

## Frontend Data Flow

### Step 1: Fetch Template

```javascript
// On page load
const response = await fetch('/api/template.php?slug=classic-elegance');
const { data } = await response.json();

// data.template.field_schema contains all form fields
```

### Step 2: Initialize Form State

```javascript
const [formData, setFormData] = useState({});

// Initialize from field_schema
data.template.field_schema.sections.forEach(section => {
  section.fields.forEach(field => {
    formData[field.key] = field.default_value || '';
  });
});
```

### Step 3: Real-Time Preview

```jsx
// Form input updates state instantly
<input 
  value={formData.full_name}
  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
/>

// Preview re-renders automatically when state changes
<BiodataPreview data={formData} template={template} />
```

### Step 4: Generate PDF (API Call)

```javascript
// Only when user clicks "Generate PDF"
const response = await fetch('/api/generate-pdf.php', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    template_id: template.id,
    form_data: formData
  })
});

const { data } = await response.json();
// data.download_url = secure download link
```

---

## Sample Form Data Object

```json
{
  "full_name": "Priya Sharma",
  "date_of_birth": "1995-05-15",
  "birth_time": "10:30 AM",
  "birth_place": "Mumbai",
  "height": "5'4\"",
  "complexion": "Fair",
  "blood_group": "B+",
  "religion": "Hindu",
  "caste": "Brahmin",
  "gotra": "Bharadwaj",
  "education": "B.Tech (Computer Science)",
  "occupation": "Software Engineer",
  "company": "TCS",
  "income": "8 LPA",
  "father_name": "Rajesh Sharma",
  "father_occupation": "Businessman",
  "mother_name": "Sunita Sharma",
  "siblings": "1 Elder Brother (Married)",
  "address": "Andheri West, Mumbai",
  "phone": "9876543210",
  "email": "priya@email.com"
}
```

---

## API Endpoints Summary

| Action | Method | Endpoint | Auth |
|--------|--------|----------|------|
| Get templates | GET | `/api/templates.php` | No |
| Get template detail | GET | `/api/template.php?slug=...` | No |
| Generate PDF | POST | `/api/generate-pdf.php` | Yes |
| Get download link | GET | `/api/download.php?token=...` | No* |

*Download uses token-based auth instead of JWT

---

## Preview Component Architecture

```
┌─────────────────────────────────────────────────┐
│                 BiodataGenerator                 │
├─────────────────────────────────────────────────┤
│  ┌─────────────┐          ┌─────────────────┐  │
│  │ FormPanel   │          │ PreviewPanel    │  │
│  │             │          │                 │  │
│  │ - Sections  │  ─────▶  │ - Template SVG  │  │
│  │ - Fields    │  state   │ - Data overlay  │  │
│  │ - Inputs    │          │ - Zoom controls │  │
│  │             │          │                 │  │
│  └─────────────┘          └─────────────────┘  │
├─────────────────────────────────────────────────┤
│  [← Back]              [Generate PDF →]         │
└─────────────────────────────────────────────────┘
```
