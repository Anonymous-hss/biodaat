'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Upload, User, GraduationCap, Users as UsersIcon, Phone } from 'lucide-react';
import api, { ApiError } from '@/lib/api';

// Helper: convert camelCase to snake_case for PHP backend
const toSnakeCase = (obj: Record<string, unknown>): Record<string, unknown> => {
  const result: Record<string, unknown> = {};
  for (const key in obj) {
    const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
    result[snakeKey] = obj[key];
  }
  return result;
};

// =============================================
// Types (preserving existing structure)
// =============================================
interface BiodataData {
  photo: string | null;
  fullName: string;
  dateOfBirth: string;
  birthTime: string;
  birthPlace: string;
  height: string;
  complexion: string;
  bloodGroup: string;
  maritalStatus: string;
  aboutMe: string;
  education: string;
  occupation: string;
  company: string;
  income: string;
  hobbies: string;
  religion: string;
  caste: string;
  gotra: string;
  fatherName: string;
  fatherOccupation: string;
  motherName: string;
  motherOccupation: string;
  siblings: string;
  familyType: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
}

const initialData: BiodataData = {
  photo: null,
  fullName: '',
  dateOfBirth: '',
  birthTime: '',
  birthPlace: '',
  height: '',
  complexion: '',
  bloodGroup: '',
  maritalStatus: 'Never Married',
  aboutMe: '',
  education: '',
  occupation: '',
  company: '',
  income: '',
  hobbies: '',
  religion: '',
  caste: '',
  gotra: '',
  fatherName: '',
  fatherOccupation: '',
  motherName: '',
  motherOccupation: '',
  siblings: '',
  familyType: '',
  address: '',
  city: '',
  state: '',
  phone: '',
  email: '',
};

// Predefined templates to speed up form filling
const presetTemplates: { name: string; icon: string; data: Partial<BiodataData> }[] = [
  {
    name: 'Software Engineer',
    icon: '💻',
    data: {
      education: 'B.Tech/B.E. (Computer Science)',
      occupation: 'Software Engineer',
      company: 'IT Company',
      income: '10-15 LPA',
      hobbies: 'Coding, Gaming, Reading Tech Blogs',
      aboutMe: 'A tech enthusiast who loves building innovative solutions. Passionate about continuous learning and growth.',
    }
  },
  {
    name: 'Doctor',
    icon: '⚕️',
    data: {
      education: 'MBBS / MD',
      occupation: 'Doctor',
      company: 'Hospital / Clinic',
      income: '15-25 LPA',
      hobbies: 'Reading, Yoga, Helping Community',
      aboutMe: 'Dedicated medical professional committed to patient care with a compassionate approach to healing.',
    }
  },
  {
    name: 'Business Owner',
    icon: '💼',
    data: {
      education: 'MBA / B.Com',
      occupation: 'Businessman',
      company: 'Self-Employed',
      income: '20+ LPA',
      hobbies: 'Networking, Travel, Reading Business Books',
      aboutMe: 'An entrepreneur at heart who believes in creating value. Family-oriented with strong business acumen.',
    }
  },
  {
    name: 'Teacher',
    icon: '📚',
    data: {
      education: 'M.A. / B.Ed.',
      occupation: 'Teacher / Professor',
      company: 'School / College',
      income: '6-10 LPA',
      hobbies: 'Reading, Writing, Music',
      aboutMe: 'Passionate educator who believes in shaping young minds. Values knowledge, patience, and continuous learning.',
    }
  },
  {
    name: 'Government Job',
    icon: '🏛️',
    data: {
      education: 'Graduate',
      occupation: 'Government Officer',
      company: 'Central/State Govt.',
      income: '8-15 LPA',
      hobbies: 'Sports, Reading, Social Service',
      aboutMe: 'Dedicated public servant committed to serving the nation. Values integrity, discipline, and family.',
    }
  },
];

// Validation helpers
const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^(\+91[\-\s]?)?[6-9]\d{9}$/;
  return phone === '' || phoneRegex.test(phone.replace(/\s/g, ''));
};

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return email === '' || emailRegex.test(email);
};

interface BiodataBuilderProps {
  selectedTemplate: number;
}

export default function BiodataBuilder({ selectedTemplate }: BiodataBuilderProps) {
  const [data, setData] = useState<BiodataData>(initialData);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<{ downloadUrl: string; shareUrl: string } | null>(null);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const updateData = (field: keyof BiodataData, value: string | null) => {
    setData(prev => ({ ...prev, [field]: value }));
    // Clear validation error when field is updated
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Apply preset template
  const applyPreset = (preset: typeof presetTemplates[0]) => {
    setData(prev => ({ ...prev, ...preset.data }));
  };

  // Validate form before submission
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!data.fullName.trim()) errors.fullName = 'Name is required';
    if (!data.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
    if (data.phone && !validatePhone(data.phone)) errors.phone = 'Invalid phone format (e.g., +91 9876543210)';
    if (data.email && !validateEmail(data.email)) errors.email = 'Invalid email format';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleGenerate = async (format: 'pdf' | 'html' = 'pdf') => {
    if (!validateForm()) {
      setError('Please fix the validation errors');
      return;
    }
    setGenerating(true);
    setError('');
    
    // Convert camelCase form data to snake_case for PHP backend
    const formData = toSnakeCase(data as unknown as Record<string, unknown>);
    
    try {
      const response = await api.biodatas.generate({
        template_id: selectedTemplate,
        name: data.fullName,
        form_data: formData,
        format
      });
      setResult({
        downloadUrl: api.biodatas.getDownloadUrl(response.biodata?.download_token || response.download_token || ''),
        shareUrl: `${window.location.origin}/view/${response.biodata?.share_token || 'preview'}`
      });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to generate biodata. Please try again.');
        console.error('Generate error:', err);
      }
    } finally {
      setGenerating(false);
    }
  };

  return (
    <section id="biodata-builder" className="py-24 px-6 bg-white">
      <div className="max-w-[1200px] mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#1F2937]">
            Fill Your Details
          </h2>
          <p className="text-xl text-[#6B7280] mb-6">
            Select a quick template or fill manually
          </p>
          
          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {presetTemplates.map((preset) => (
              <button
                key={preset.name}
                onClick={() => applyPreset(preset)}
                className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-[#E5E7EB] bg-white hover:border-[#E07B39] hover:bg-[#FFF8F0] transition-all duration-200 text-sm font-medium text-[#374151]"
              >
                <span>{preset.icon}</span>
                <span>{preset.name}</span>
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Accordion type="single" collapsible defaultValue="personal" className="space-y-4">
              {/* Personal Details */}
              <AccordionItem value="personal">
                <AccordionTrigger>
                  <div className="flex items-center gap-3">
                    <User className="w-6 h-6 text-[#E07B39]" />
                    <span>Personal Details</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid md:grid-cols-2 gap-4 pt-2">
                    <div className="md:col-span-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input 
                        id="fullName" 
                        value={data.fullName} 
                        onChange={e => updateData('fullName', e.target.value)} 
                        placeholder="Enter your full name"
                        className={validationErrors.fullName ? 'border-red-500 focus-visible:ring-red-500' : ''}
                      />
                      {validationErrors.fullName && <p className="text-red-500 text-sm mt-1">{validationErrors.fullName}</p>}
                    </div>
                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                      <Input 
                        id="dateOfBirth" 
                        type="date" 
                        value={data.dateOfBirth} 
                        onChange={e => updateData('dateOfBirth', e.target.value)}
                        className={validationErrors.dateOfBirth ? 'border-red-500 focus-visible:ring-red-500' : ''}
                      />
                      {validationErrors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{validationErrors.dateOfBirth}</p>}
                    </div>
                    <div>
                      <Label htmlFor="birthTime">Birth Time</Label>
                      <Input id="birthTime" value={data.birthTime} onChange={e => updateData('birthTime', e.target.value)} placeholder="e.g., 10:30 AM" />
                    </div>
                    <div>
                      <Label htmlFor="birthPlace">Birth Place</Label>
                      <Input id="birthPlace" value={data.birthPlace} onChange={e => updateData('birthPlace', e.target.value)} placeholder="City of birth" />
                    </div>
                    <div>
                      <Label htmlFor="height">Height</Label>
                      <Input id="height" value={data.height} onChange={e => updateData('height', e.target.value)} placeholder="e.g., 5'8&quot;" />
                    </div>
                    <div>
                      <Label htmlFor="complexion">Complexion</Label>
                      <select
                        id="complexion"
                        value={data.complexion}
                        onChange={e => updateData('complexion', e.target.value)}
                        className="flex w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D5C63]"
                      >
                        <option value="">Select</option>
                        <option>Fair</option>
                        <option>Wheatish</option>
                        <option>Medium</option>
                        <option>Dark</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="bloodGroup">Blood Group</Label>
                      <select
                        id="bloodGroup"
                        value={data.bloodGroup}
                        onChange={e => updateData('bloodGroup', e.target.value)}
                        className="flex w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D5C63]"
                      >
                        <option value="">Select</option>
                        {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => <option key={bg}>{bg}</option>)}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="maritalStatus">Marital Status</Label>
                      <select
                        id="maritalStatus"
                        value={data.maritalStatus}
                        onChange={e => updateData('maritalStatus', e.target.value)}
                        className="flex w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D5C63]"
                      >
                        <option>Never Married</option>
                        <option>Divorced</option>
                        <option>Widowed</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="aboutMe">About Me</Label>
                      <textarea
                        id="aboutMe"
                        value={data.aboutMe}
                        onChange={e => updateData('aboutMe', e.target.value)}
                        placeholder="A short intro about yourself..."
                        className="flex w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base min-h-[80px] resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D5C63]"
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Education & Career */}
              <AccordionItem value="professional">
                <AccordionTrigger>
                  <div className="flex items-center gap-3">
                    <GraduationCap className="w-6 h-6 text-[#E07B39]" />
                    <span>Education & Career</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid md:grid-cols-2 gap-4 pt-2">
                    <div className="md:col-span-2">
                      <Label htmlFor="education">Education</Label>
                      <Input id="education" value={data.education} onChange={e => updateData('education', e.target.value)} placeholder="e.g., B.Tech, MBA" />
                    </div>
                    <div>
                      <Label htmlFor="occupation">Occupation</Label>
                      <Input id="occupation" value={data.occupation} onChange={e => updateData('occupation', e.target.value)} placeholder="e.g., Software Engineer" />
                    </div>
                    <div>
                      <Label htmlFor="company">Company</Label>
                      <Input id="company" value={data.company} onChange={e => updateData('company', e.target.value)} placeholder="e.g., Google, TCS" />
                    </div>
                    <div>
                      <Label htmlFor="income">Annual Income</Label>
                      <Input id="income" value={data.income} onChange={e => updateData('income', e.target.value)} placeholder="e.g., 15-20 LPA" />
                    </div>
                    <div>
                      <Label htmlFor="hobbies">Hobbies</Label>
                      <Input id="hobbies" value={data.hobbies} onChange={e => updateData('hobbies', e.target.value)} placeholder="e.g., Reading, Music" />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Family Details */}
              <AccordionItem value="family">
                <AccordionTrigger>
                  <div className="flex items-center gap-3">
                    <UsersIcon className="w-6 h-6 text-[#E07B39]" />
                    <span>Family Details</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid md:grid-cols-2 gap-4 pt-2">
                    <div>
                      <Label htmlFor="religion">Religion</Label>
                      <select
                        id="religion"
                        value={data.religion}
                        onChange={e => updateData('religion', e.target.value)}
                        className="flex w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D5C63]"
                      >
                        <option value="">Select</option>
                        <option>Hindu</option>
                        <option>Muslim</option>
                        <option>Christian</option>
                        <option>Sikh</option>
                        <option>Buddhist</option>
                        <option>Jain</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="caste">Caste</Label>
                      <Input id="caste" value={data.caste} onChange={e => updateData('caste', e.target.value)} placeholder="e.g., Brahmin" />
                    </div>
                    <div>
                      <Label htmlFor="gotra">Gotra</Label>
                      <Input id="gotra" value={data.gotra} onChange={e => updateData('gotra', e.target.value)} placeholder="e.g., Bharadwaj" />
                    </div>
                    <div>
                      <Label htmlFor="familyType">Family Type</Label>
                      <select
                        id="familyType"
                        value={data.familyType}
                        onChange={e => updateData('familyType', e.target.value)}
                        className="flex w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D5C63]"
                      >
                        <option value="">Select</option>
                        <option>Joint Family</option>
                        <option>Nuclear Family</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="fatherName">Father's Name</Label>
                      <Input id="fatherName" value={data.fatherName} onChange={e => updateData('fatherName', e.target.value)} placeholder="Father's name" />
                    </div>
                    <div>
                      <Label htmlFor="fatherOccupation">Father's Occupation</Label>
                      <Input id="fatherOccupation" value={data.fatherOccupation} onChange={e => updateData('fatherOccupation', e.target.value)} placeholder="e.g., Businessman" />
                    </div>
                    <div>
                      <Label htmlFor="motherName">Mother's Name</Label>
                      <Input id="motherName" value={data.motherName} onChange={e => updateData('motherName', e.target.value)} placeholder="Mother's name" />
                    </div>
                    <div>
                      <Label htmlFor="motherOccupation">Mother's Occupation</Label>
                      <Input id="motherOccupation" value={data.motherOccupation} onChange={e => updateData('motherOccupation', e.target.value)} placeholder="e.g., Homemaker" />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="siblings">Siblings</Label>
                      <Input id="siblings" value={data.siblings} onChange={e => updateData('siblings', e.target.value)} placeholder="e.g., 1 Elder Brother (Married)" />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Contact Information */}
              <AccordionItem value="contact">
                <AccordionTrigger>
                  <div className="flex items-center gap-3">
                    <Phone className="w-6 h-6 text-[#E07B39]" />
                    <span>Contact Information</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid md:grid-cols-2 gap-4 pt-2">
                    <div className="md:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <textarea
                        id="address"
                        value={data.address}
                        onChange={e => updateData('address', e.target.value)}
                        placeholder="Full address"
                        className="flex w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base min-h-[60px] resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D5C63]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input id="city" value={data.city} onChange={e => updateData('city', e.target.value)} placeholder="e.g., Mumbai" />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input id="state" value={data.state} onChange={e => updateData('state', e.target.value)} placeholder="e.g., Maharashtra" />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input 
                        id="phone" 
                        value={data.phone} 
                        onChange={e => updateData('phone', e.target.value)} 
                        placeholder="+91 9876543210"
                        className={validationErrors.phone ? 'border-red-500 focus-visible:ring-red-500' : ''}
                      />
                      {validationErrors.phone && <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>}
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        value={data.email} 
                        onChange={e => updateData('email', e.target.value)} 
                        placeholder="your@email.com"
                        className={validationErrors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}
                      />
                      {validationErrors.email && <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Generate Button */}
            <div className="mt-8">
              {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

              {result ? (
                <Card className="bg-green-50 border-2 border-green-200">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎉</div>
                    <h4 className="text-2xl font-bold mb-4 text-green-800">Biodata Generated!</h4>
                    <div className="flex gap-4 justify-center flex-wrap">
                      <a href={result.downloadUrl} target="_blank" rel="noopener noreferrer">
                        <Button size="lg">📥 Download PDF</Button>
                      </a>
                      <Button
                        onClick={() => {
                          navigator.clipboard.writeText(result.shareUrl);
                          alert('Link copied!');
                        }}
                        variant="secondary"
                        size="lg"
                      >
                        🔗 Copy Link
                      </Button>
                    </div>
                  </div>
                </Card>
              ) : (
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button onClick={() => handleGenerate('pdf')} disabled={generating} size="lg" className="w-full text-lg py-6 flex-1">
                    {generating ? '⏳ Generating...' : '✨ Generate PDF'}
                  </Button>
                  <Button onClick={() => handleGenerate('html')} disabled={generating} variant="outline" size="lg" className="w-full text-lg py-6 flex-1 bg-white hover:bg-gray-50 text-gray-700 border-gray-300">
                    📄 Generate HTML
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Preview (Sticky) */}
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <Card className="bg-gradient-to-br from-[#FFF8F0] to-[#FFE4CC]">
              <div className="text-center">
                <p className="text-sm font-semibold text-[#6B7280] mb-4">Live Preview</p>
                <div className="bg-white rounded-xl p-4 shadow-inner max-h-[500px] overflow-y-auto">
                  <div className="text-2xl mb-2">🕉️</div>
                  <h4 className="font-bold mb-4 text-[#0D5C63]">Your Biodata</h4>
                  <div className="space-y-3 text-sm text-left">
                    {/* Personal */}
                    {data.fullName && <p><strong>Name:</strong> {data.fullName}</p>}
                    {data.dateOfBirth && <p><strong>DOB:</strong> {data.dateOfBirth}</p>}
                    {data.birthTime && <p><strong>Birth Time:</strong> {data.birthTime}</p>}
                    {data.birthPlace && <p><strong>Birth Place:</strong> {data.birthPlace}</p>}
                    {data.height && <p><strong>Height:</strong> {data.height}</p>}
                    {data.complexion && <p><strong>Complexion:</strong> {data.complexion}</p>}
                    {data.bloodGroup && <p><strong>Blood Group:</strong> {data.bloodGroup}</p>}
                    {data.maritalStatus && data.maritalStatus !== 'Never Married' && <p><strong>Marital Status:</strong> {data.maritalStatus}</p>}
                    {data.aboutMe && <p><strong>About:</strong> {data.aboutMe}</p>}
                    
                    {/* Education & Career */}
                    {data.education && <p><strong>Education:</strong> {data.education}</p>}
                    {data.occupation && <p><strong>Occupation:</strong> {data.occupation}</p>}
                    {data.company && <p><strong>Company:</strong> {data.company}</p>}
                    {data.income && <p><strong>Income:</strong> {data.income}</p>}
                    {data.hobbies && <p><strong>Hobbies:</strong> {data.hobbies}</p>}
                    
                    {/* Family */}
                    {data.religion && <p><strong>Religion:</strong> {data.religion}</p>}
                    {data.caste && <p><strong>Caste:</strong> {data.caste}</p>}
                    {data.gotra && <p><strong>Gotra:</strong> {data.gotra}</p>}
                    {data.familyType && <p><strong>Family Type:</strong> {data.familyType}</p>}
                    {data.fatherName && <p><strong>Father:</strong> {data.fatherName} {data.fatherOccupation && `(${data.fatherOccupation})`}</p>}
                    {data.motherName && <p><strong>Mother:</strong> {data.motherName} {data.motherOccupation && `(${data.motherOccupation})`}</p>}
                    {data.siblings && <p><strong>Siblings:</strong> {data.siblings}</p>}
                    
                    {/* Contact */}
                    {(data.address || data.city || data.state) && (
                      <p><strong>Location:</strong> {[data.address, data.city, data.state].filter(Boolean).join(', ')}</p>
                    )}
                    {data.phone && <p><strong>Phone:</strong> {data.phone}</p>}
                    {data.email && <p><strong>Email:</strong> {data.email}</p>}
                  </div>
                  {!data.fullName && (
                    <p className="text-gray-400 text-sm mt-4">
                      Fill the form to see your biodata preview
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
