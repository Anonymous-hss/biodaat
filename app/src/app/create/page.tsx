'use client';

import { useState } from 'react';
import Link from 'next/link';
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

// Types
interface BiodataData {
  // Step 1: Photo & Basics
  photo: string | null;
  fullName: string;
  dateOfBirth: string;
  birthTime: string;
  birthPlace: string;
  height: string;
  complexion: string;
  bloodGroup: string;
  
  // Step 2: Highlights
  aboutMe: string;
  education: string;
  occupation: string;
  company: string;
  income: string;
  achievements: string[];
  hobbies: string;
  
  // Step 3: Family
  religion: string;
  caste: string;
  gotra: string;
  fatherName: string;
  fatherOccupation: string;
  motherName: string;
  motherOccupation: string;
  siblings: string;
  familyType: string;
  
  // Step 4: Contact
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
  aboutMe: '',
  education: '',
  occupation: '',
  company: '',
  income: '',
  achievements: [],
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

// About Me suggestions
const aboutMeSuggestions = [
  "A curious soul who believes in finding joy in the little things.",
  "Passionate about technology and traditional values in equal measure.",
  "An avid reader who dreams of weekend getaways and chai conversations.",
  "Believes in working hard, staying humble, and always being kind.",
  "A foodie at heart with a love for exploring new cuisines and cultures.",
];

// Achievement suggestions
const achievementSuggestions = [
  "First in family to study abroad",
  "Built a successful career from scratch",
  "Published research paper / book",
  "Completed marathon / fitness goal",
  "Started own business / side project",
  "Volunteer / social work experience",
];

export default function CreateBiodata() {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<BiodataData>(initialData);
  const [showPreview, setShowPreview] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<{ downloadUrl: string; shareUrl: string } | null>(null);
  const [error, setError] = useState('');

  const templates = [
    { id: 1, name: 'Classic Elegance', color: '#8B4513', desc: 'Traditional & Timeless' },
    { id: 2, name: 'Modern Minimal', color: '#2d3748', desc: 'Clean & Professional' },
    { id: 3, name: 'Royal Gold', color: '#D4AF37', desc: 'Premium & Ornate' }
  ];

  const steps = [
    { num: 1, title: 'Photo & Basics', icon: '📸' },
    { num: 2, title: 'Your Story', icon: '✏️' },
    { num: 3, title: 'Family', icon: '👨‍👩‍👧‍👦' },
    { num: 4, title: 'Finalize', icon: '🎉' },
  ];

  const updateData = (field: keyof BiodataData, value: string | string[] | null) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      {/* Header */}
      <header className="bg-white border-b border-[var(--cream-dark)] sticky top-0 z-50">
        <div className="container flex items-center justify-between py-4">
          <Link href="/" className="logo">
            <span className="logo-icon">✦</span>
            <span className="text-[var(--teal-deep)] font-bold text-xl">Biodaat</span>
          </Link>
          
          {/* Step Indicator */}
          <div className="hidden md:flex items-center gap-2">
            {steps.map((step, i) => (
              <div key={step.num} className="flex items-center">
                <button
                  onClick={() => setCurrentStep(step.num)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition
                    ${currentStep === step.num 
                      ? 'bg-[var(--teal-deep)] text-white' 
                      : currentStep > step.num 
                        ? 'bg-[var(--success)] text-white'
                        : 'bg-[var(--cream)] text-[var(--charcoal-light)]'
                    }`}
                >
                  <span>{step.icon}</span>
                  <span className="hidden lg:inline">{step.title}</span>
                </button>
                {i < steps.length - 1 && (
                  <div className={`w-8 h-0.5 mx-1 ${currentStep > step.num ? 'bg-[var(--success)]' : 'bg-[var(--cream-dark)]'}`} />
                )}
              </div>
            ))}
          </div>
          
          {/* Mobile Step Indicator */}
          <div className="md:hidden text-sm font-medium text-[var(--teal-deep)]">
            Step {currentStep} / {steps.length}
          </div>

          <button 
            onClick={() => setShowPreview(!showPreview)}
            className="md:hidden btn btn-ghost text-sm"
          >
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Panel */}
          <div className="card">
            {/* Step 1: Photo & Basics */}
            {currentStep === 1 && (
              <div className="animate-fade-in-up">
                <h2 className="text-2xl font-bold mb-2">Let's start with the basics</h2>
                <p className="text-muted mb-8">Add your photo and key details</p>
                
                {/* Photo Upload */}
                <div className="mb-8">
                  <label className="block text-sm font-medium mb-2">Your Photo</label>
                  <div className="flex items-start gap-4">
                    <div className="w-32 h-40 bg-[var(--cream)] rounded-xl flex items-center justify-center border-2 border-dashed border-[var(--teal-light)]">
                      {data.photo ? (
                        <img src={data.photo} alt="Profile" className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <div className="text-center text-[var(--charcoal-light)]">
                          <span className="text-3xl">📷</span>
                          <p className="text-xs mt-2">Add Photo</p>
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-[var(--charcoal-light)]">
                      <p className="font-medium text-[var(--charcoal)] mb-2">Photo Tips:</p>
                      <ul className="space-y-1">
                        <li>✓ Well-lit, recent photo</li>
                        <li>✓ Face clearly visible</li>
                        <li>✓ Traditional or formal attire</li>
                        <li>✗ Avoid group photos</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Basic Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={data.fullName}
                      onChange={(e) => updateData('fullName', e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 rounded-xl border border-[var(--cream-dark)] focus:border-[var(--teal-light)] focus:outline-none transition"
                    />
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Date of Birth *</label>
                      <input
                        type="date"
                        value={data.dateOfBirth}
                        onChange={(e) => updateData('dateOfBirth', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-[var(--cream-dark)] focus:border-[var(--teal-light)] focus:outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Birth Time</label>
                      <input
                        type="text"
                        value={data.birthTime}
                        onChange={(e) => updateData('birthTime', e.target.value)}
                        placeholder="e.g., 10:30 AM"
                        className="w-full px-4 py-3 rounded-xl border border-[var(--cream-dark)] focus:border-[var(--teal-light)] focus:outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Birth Place *</label>
                    <input
                      type="text"
                      value={data.birthPlace}
                      onChange={(e) => updateData('birthPlace', e.target.value)}
                      placeholder="City where you were born"
                      className="w-full px-4 py-3 rounded-xl border border-[var(--cream-dark)] focus:border-[var(--teal-light)] focus:outline-none transition"
                    />
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Height</label>
                      <input
                        type="text"
                        value={data.height}
                        onChange={(e) => updateData('height', e.target.value)}
                        placeholder='e.g., 5&apos;8"'
                        className="w-full px-4 py-3 rounded-xl border border-[var(--cream-dark)] focus:border-[var(--teal-light)] focus:outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Complexion</label>
                      <select
                        value={data.complexion}
                        onChange={(e) => updateData('complexion', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-[var(--cream-dark)] focus:border-[var(--teal-light)] focus:outline-none transition bg-white"
                      >
                        <option value="">Select</option>
                        <option value="Fair">Fair</option>
                        <option value="Wheatish">Wheatish</option>
                        <option value="Medium">Medium</option>
                        <option value="Dark">Dark</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Blood Group</label>
                      <select
                        value={data.bloodGroup}
                        onChange={(e) => updateData('bloodGroup', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-[var(--cream-dark)] focus:border-[var(--teal-light)] focus:outline-none transition bg-white"
                      >
                        <option value="">Select</option>
                        {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                          <option key={bg} value={bg}>{bg}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Highlights / Your Story */}
            {currentStep === 2 && (
              <div className="animate-fade-in-up">
                <h2 className="text-2xl font-bold mb-2">Tell your story</h2>
                <p className="text-muted mb-8">What makes you, you? Share your highlights.</p>

                {/* About Me with Suggestions */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">About Me</label>
                  <p className="text-xs text-[var(--charcoal-light)] mb-2">
                    Not sure what to write? Pick a starter:
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {aboutMeSuggestions.map((suggestion, i) => (
                      <button
                        key={i}
                        onClick={() => updateData('aboutMe', suggestion)}
                        className={`text-xs px-3 py-1.5 rounded-full transition
                          ${data.aboutMe === suggestion 
                            ? 'bg-[var(--teal-deep)] text-white' 
                            : 'bg-[var(--cream)] text-[var(--charcoal-light)] hover:bg-[var(--teal-muted)]'
                          }`}
                      >
                        {suggestion.substring(0, 30)}...
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={data.aboutMe}
                    onChange={(e) => updateData('aboutMe', e.target.value)}
                    placeholder="Write a short intro about yourself..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--cream-dark)] focus:border-[var(--teal-light)] focus:outline-none transition resize-none"
                  />
                </div>

                {/* Education & Career */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">Education *</label>
                    <input
                      type="text"
                      value={data.education}
                      onChange={(e) => updateData('education', e.target.value)}
                      placeholder="e.g., B.Tech (IIT Delhi), MBA (IIM Ahmedabad)"
                      className="w-full px-4 py-3 rounded-xl border border-[var(--cream-dark)] focus:border-[var(--teal-light)] focus:outline-none transition"
                    />
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Occupation *</label>
                      <input
                        type="text"
                        value={data.occupation}
                        onChange={(e) => updateData('occupation', e.target.value)}
                        placeholder="e.g., Software Engineer"
                        className="w-full px-4 py-3 rounded-xl border border-[var(--cream-dark)] focus:border-[var(--teal-light)] focus:outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Company</label>
                      <input
                        type="text"
                        value={data.company}
                        onChange={(e) => updateData('company', e.target.value)}
                        placeholder="e.g., Google, TCS"
                        className="w-full px-4 py-3 rounded-xl border border-[var(--cream-dark)] focus:border-[var(--teal-light)] focus:outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Annual Income</label>
                    <input
                      type="text"
                      value={data.income}
                      onChange={(e) => updateData('income', e.target.value)}
                      placeholder="e.g., 15-20 LPA or Prefer not to say"
                      className="w-full px-4 py-3 rounded-xl border border-[var(--cream-dark)] focus:border-[var(--teal-light)] focus:outline-none transition"
                    />
                  </div>
                </div>

                {/* Achievements */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Achievements / Highlights</label>
                  <p className="text-xs text-[var(--charcoal-light)] mb-2">Pick what resonates:</p>
                  <div className="flex flex-wrap gap-2">
                    {achievementSuggestions.map((achievement, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          const current = data.achievements || [];
                          if (current.includes(achievement)) {
                            updateData('achievements', current.filter(a => a !== achievement));
                          } else {
                            updateData('achievements', [...current, achievement]);
                          }
                        }}
                        className={`text-sm px-4 py-2 rounded-full transition border
                          ${(data.achievements || []).includes(achievement)
                            ? 'bg-[var(--saffron-warm)] text-white border-[var(--saffron-warm)]'
                            : 'bg-white text-[var(--charcoal)] border-[var(--cream-dark)] hover:border-[var(--saffron-warm)]'
                          }`}
                      >
                        {achievement}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hobbies */}
                <div>
                  <label className="block text-sm font-medium mb-1">Hobbies & Interests</label>
                  <input
                    type="text"
                    value={data.hobbies}
                    onChange={(e) => updateData('hobbies', e.target.value)}
                    placeholder="e.g., Reading, Travelling, Cooking, Music"
                    className="w-full px-4 py-3 rounded-xl border border-[var(--cream-dark)] focus:border-[var(--teal-light)] focus:outline-none transition"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Family & Values */}
            {currentStep === 3 && (
              <div className="animate-fade-in-up">
                <h2 className="text-2xl font-bold mb-2">Family matters</h2>
                <p className="text-muted mb-8">Tell us about your family background</p>

                {/* Religious Background */}
                <div className="space-y-4 mb-8">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Religion *</label>
                      <select
                        value={data.religion}
                        onChange={(e) => updateData('religion', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-[var(--cream-dark)] focus:border-[var(--teal-light)] focus:outline-none transition bg-white"
                      >
                        <option value="">Select Religion</option>
                        <option value="Hindu">Hindu</option>
                        <option value="Muslim">Muslim</option>
                        <option value="Christian">Christian</option>
                        <option value="Sikh">Sikh</option>
                        <option value="Buddhist">Buddhist</option>
                        <option value="Jain">Jain</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Caste</label>
                      <input
                        type="text"
                        value={data.caste}
                        onChange={(e) => updateData('caste', e.target.value)}
                        placeholder="e.g., Brahmin, Kshatriya"
                        className="w-full px-4 py-3 rounded-xl border border-[var(--cream-dark)] focus:border-[var(--teal-light)] focus:outline-none transition"
                      />
                    </div>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Gotra</label>
                      <input
                        type="text"
                        value={data.gotra}
                        onChange={(e) => updateData('gotra', e.target.value)}
                        placeholder="e.g., Bharadwaj"
                        className="w-full px-4 py-3 rounded-xl border border-[var(--cream-dark)] focus:border-[var(--teal-light)] focus:outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Family Type</label>
                      <select
                        value={data.familyType}
                        onChange={(e) => updateData('familyType', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-[var(--cream-dark)] focus:border-[var(--teal-light)] focus:outline-none transition bg-white"
                      >
                        <option value="">Select</option>
                        <option value="Joint Family">Joint Family</option>
                        <option value="Nuclear Family">Nuclear Family</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Parents */}
                <div className="space-y-4 mb-6">
                  <h3 className="font-bold text-lg">Parents</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Father's Name *</label>
                      <input
                        type="text"
                        value={data.fatherName}
                        onChange={(e) => updateData('fatherName', e.target.value)}
                        placeholder="Enter father's name"
                        className="w-full px-4 py-3 rounded-xl border border-[var(--cream-dark)] focus:border-[var(--teal-light)] focus:outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Father's Occupation</label>
                      <input
                        type="text"
                        value={data.fatherOccupation}
                        onChange={(e) => updateData('fatherOccupation', e.target.value)}
                        placeholder="e.g., Businessman, Retired"
                        className="w-full px-4 py-3 rounded-xl border border-[var(--cream-dark)] focus:border-[var(--teal-light)] focus:outline-none transition"
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Mother's Name *</label>
                      <input
                        type="text"
                        value={data.motherName}
                        onChange={(e) => updateData('motherName', e.target.value)}
                        placeholder="Enter mother's name"
                        className="w-full px-4 py-3 rounded-xl border border-[var(--cream-dark)] focus:border-[var(--teal-light)] focus:outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Mother's Occupation</label>
                      <input
                        type="text"
                        value={data.motherOccupation}
                        onChange={(e) => updateData('motherOccupation', e.target.value)}
                        placeholder="e.g., Homemaker, Teacher"
                        className="w-full px-4 py-3 rounded-xl border border-[var(--cream-dark)] focus:border-[var(--teal-light)] focus:outline-none transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Siblings */}
                <div>
                  <label className="block text-sm font-medium mb-1">Siblings</label>
                  <textarea
                    value={data.siblings}
                    onChange={(e) => updateData('siblings', e.target.value)}
                    placeholder="e.g., 1 Elder Brother (Married, Software Engineer)"
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--cream-dark)] focus:border-[var(--teal-light)] focus:outline-none transition resize-none"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Finalize & Contact */}
            {currentStep === 4 && (
              <div className="animate-fade-in-up">
                <h2 className="text-2xl font-bold mb-2">Almost there! 🎉</h2>
                <p className="text-muted mb-8">Add contact details and finalize your biodata</p>

                {/* Contact Info */}
                <div className="space-y-4 mb-8">
                  <div>
                    <label className="block text-sm font-medium mb-1">Address</label>
                    <textarea
                      value={data.address}
                      onChange={(e) => updateData('address', e.target.value)}
                      placeholder="Enter your residential address"
                      rows={2}
                      className="w-full px-4 py-3 rounded-xl border border-[var(--cream-dark)] focus:border-[var(--teal-light)] focus:outline-none transition resize-none"
                    />
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">City *</label>
                      <input
                        type="text"
                        value={data.city}
                        onChange={(e) => updateData('city', e.target.value)}
                        placeholder="e.g., Mumbai"
                        className="w-full px-4 py-3 rounded-xl border border-[var(--cream-dark)] focus:border-[var(--teal-light)] focus:outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">State *</label>
                      <input
                        type="text"
                        value={data.state}
                        onChange={(e) => updateData('state', e.target.value)}
                        placeholder="e.g., Maharashtra"
                        className="w-full px-4 py-3 rounded-xl border border-[var(--cream-dark)] focus:border-[var(--teal-light)] focus:outline-none transition"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        value={data.phone}
                        onChange={(e) => updateData('phone', e.target.value)}
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full px-4 py-3 rounded-xl border border-[var(--cream-dark)] focus:border-[var(--teal-light)] focus:outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email</label>
                      <input
                        type="email"
                        value={data.email}
                        onChange={(e) => updateData('email', e.target.value)}
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 rounded-xl border border-[var(--cream-dark)] focus:border-[var(--teal-light)] focus:outline-none transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Privacy Notice */}
                <div className="bg-[var(--cream)] rounded-xl p-4 mb-6">
                  <p className="text-sm text-[var(--charcoal-light)]">
                    <span className="font-medium text-[var(--charcoal)]">🔒 Privacy Control:</span> You can choose to hide your phone number 
                    and email on the shareable link. Only visible on PDF download.
                  </p>
                </div>

                {/* Template Selection */}
                <div className="mb-8">
                  <h3 className="font-bold text-lg mb-4">Choose Design</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {templates.map(t => (
                      <button
                        key={t.id}
                        onClick={() => setSelectedTemplate(t.id)}
                        className={`p-4 rounded-xl border-2 text-left transition relative overflow-hidden
                          ${selectedTemplate === t.id 
                            ? 'border-[var(--teal-deep)] bg-[var(--cream)]' 
                            : 'border-[var(--cream-dark)] hover:border-[var(--teal-muted)]'
                          }`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${selectedTemplate === t.id ? 'bg-[var(--teal-deep)] text-white' : 'bg-gray-100'}`}>
                          {selectedTemplate === t.id && '✓'}
                        </div>
                        <div className="font-bold text-[var(--charcoal)]">{t.name}</div>
                        <div className="text-xs text-[var(--charcoal-light)]">{t.desc}</div>
                        <div className="h-1 w-full mt-3 rounded-full" style={{ background: t.color }}></div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Download Options */}
                <div className="space-y-4">
                  <h3 className="font-bold text-lg">Get Your Biodata</h3>
                  
                  {error && (
                    <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '12px 16px', borderRadius: '12px', fontSize: '14px' }}>
                      {error}
                    </div>
                  )}
                  
                  {result ? (
                    <div style={{ background: '#D1FAE5', padding: '20px', borderRadius: '16px', textAlign: 'center' }}>
                      <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
                      <h4 style={{ fontWeight: 600, marginBottom: '16px', color: '#065F46' }}>Biodata Generated!</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <a 
                          href={result.downloadUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ background: '#0D5C63', color: 'white', padding: '14px', borderRadius: '12px', textDecoration: 'none', fontWeight: 600 }}
                        >
                          📥 Download PDF
                        </a>
                        <button
                          onClick={() => { navigator.clipboard.writeText(result.shareUrl); alert('Link copied!'); }}
                          style={{ background: 'white', color: '#0D5C63', padding: '14px', borderRadius: '12px', border: '2px solid #0D5C63', fontWeight: 600, cursor: 'pointer' }}
                        >
                          🔗 Copy Shareable Link
                        </button>
                        <a
                          href={`https://wa.me/?text=${encodeURIComponent(`Check out my biodata: ${result.shareUrl}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ background: '#25D366', color: 'white', padding: '14px', borderRadius: '12px', textDecoration: 'none', fontWeight: 600 }}
                        >
                          📱 Share on WhatsApp
                        </a>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={async () => {
                        if (!data.fullName || !data.dateOfBirth || !data.fatherName) {
                          setError('Please fill all required fields (Name, DOB, Father Name)');
                          return;
                        }
                        setGenerating(true);
                        setError('');
                        
                        // Convert to snake_case for PHP backend
                        const formData = toSnakeCase(data as unknown as Record<string, unknown>);
                        
                        try {
                          const response = await api.biodatas.generate({
                            template_id: selectedTemplate,
                            name: data.fullName,
                            form_data: formData
                          });
                          setResult({
                            downloadUrl: api.biodatas.getDownloadUrl(response.download_token || ''),
                            shareUrl: `${window.location.origin}/view/${response.biodata?.share_token || 'preview'}`
                          });
                        } catch (err) {
                          if (err instanceof ApiError) {
                            setError(err.message);
                          } else {
                            setError('Failed to generate biodata. Please try again later.');
                            console.error('Generate error:', err);
                          }
                        } finally {
                          setGenerating(false);
                        }
                      }}
                      disabled={generating}
                      style={{
                        width: '100%',
                        background: generating ? '#ccc' : 'linear-gradient(135deg, #E07B39 0%, #F4A261 100%)',
                        color: 'white',
                        padding: '18px',
                        borderRadius: '50px',
                        border: 'none',
                        fontSize: '18px',
                        fontWeight: 600,
                        cursor: generating ? 'not-allowed' : 'pointer',
                        boxShadow: '0 4px 15px rgba(224,123,57,0.3)'
                      }}
                    >
                      {generating ? 'Generating...' : '✨ Generate My Biodata'}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-[var(--cream-dark)]">
              {currentStep > 1 ? (
                <button onClick={prevStep} className="btn btn-ghost">
                  ← Previous
                </button>
              ) : (
                <Link href="/" className="btn btn-ghost">← Cancel</Link>
              )}
              
              {currentStep < 4 ? (
                <button onClick={nextStep} className="btn btn-primary">
                  Continue →
                </button>
              ) : null}
            </div>
          </div>

          {/* Preview Panel */}
          <div className={`${showPreview ? 'block' : 'hidden'} lg:block`}>
            <div className="sticky top-24">
              <div className="card bg-white">
                <div className="text-center mb-6">
                  <span className="text-3xl text-[var(--saffron-warm)]">✦</span>
                  <h3 className="text-lg font-bold text-[var(--teal-deep)] mt-2">|| श्री गणेशाय नमः ||</h3>
                  <p className="text-xs text-[var(--charcoal-light)]">BIODATA</p>
                </div>

                {/* Photo placeholder */}
                <div className="w-24 h-28 mx-auto mb-6 bg-[var(--cream)] rounded-lg flex items-center justify-center border-2 border-[var(--cream-dark)]">
                  {data.photo ? (
                    <img src={data.photo} alt="Profile" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <span className="text-4xl">👤</span>
                  )}
                </div>

                {/* Preview Data */}
                <div className="space-y-3 text-sm">
                  {data.fullName && (
                    <div className="flex bg-[var(--cream)] rounded-lg p-3">
                      <span className="font-semibold w-28 text-[var(--charcoal)]">Name</span>
                      <span className="text-[var(--charcoal-light)]">{data.fullName}</span>
                    </div>
                  )}
                  
                  {data.aboutMe && (
                    <div className="flex bg-[var(--cream)] rounded-lg p-3">
                      <span className="font-semibold w-28 text-[var(--charcoal)]">About</span>
                      <span className="text-[var(--charcoal-light)] text-xs">{data.aboutMe}</span>
                    </div>
                  )}

                  {data.dateOfBirth && (
                    <div className="flex bg-[var(--cream)] rounded-lg p-3">
                      <span className="font-semibold w-28 text-[var(--charcoal)]">DOB</span>
                      <span className="text-[var(--charcoal-light)]">{data.dateOfBirth}</span>
                    </div>
                  )}

                  {data.education && (
                    <div className="flex bg-[var(--cream)] rounded-lg p-3">
                      <span className="font-semibold w-28 text-[var(--charcoal)]">Education</span>
                      <span className="text-[var(--charcoal-light)]">{data.education}</span>
                    </div>
                  )}

                  {data.occupation && (
                    <div className="flex bg-[var(--cream)] rounded-lg p-3">
                      <span className="font-semibold w-28 text-[var(--charcoal)]">Occupation</span>
                      <span className="text-[var(--charcoal-light)]">{data.occupation}{data.company ? ` @ ${data.company}` : ''}</span>
                    </div>
                  )}

                  {data.religion && (
                    <div className="flex bg-[var(--cream)] rounded-lg p-3">
                      <span className="font-semibold w-28 text-[var(--charcoal)]">Religion</span>
                      <span className="text-[var(--charcoal-light)]">{data.religion}{data.caste ? ` / ${data.caste}` : ''}</span>
                    </div>
                  )}

                  {data.fatherName && (
                    <div className="flex bg-[var(--cream)] rounded-lg p-3">
                      <span className="font-semibold w-28 text-[var(--charcoal)]">Father</span>
                      <span className="text-[var(--charcoal-light)]">{data.fatherName}</span>
                    </div>
                  )}

                  {data.city && (
                    <div className="flex bg-[var(--cream)] rounded-lg p-3">
                      <span className="font-semibold w-28 text-[var(--charcoal)]">Location</span>
                      <span className="text-[var(--charcoal-light)]">{data.city}{data.state ? `, ${data.state}` : ''}</span>
                    </div>
                  )}
                </div>

                <div className="text-center mt-6 pt-4 border-t border-[var(--cream-dark)]">
                  <p className="text-xs text-[var(--charcoal-light)]">Made with Biodaat 💛</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
