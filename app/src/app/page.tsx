'use client';

import { useState } from 'react';
import api, { ApiError } from '@/lib/api';

// =============================================
// Types
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

// =============================================
// Template Data
// =============================================
const templates = [
  { id: 1, name: 'Traditional', icon: '🕉️', color: '#D4AF37', desc: 'Classic with religious motifs' },
  { id: 2, name: 'Modern Minimal', icon: '✨', color: '#0D5C63', desc: 'Clean and elegant' },
  { id: 3, name: 'Professional', icon: '💼', color: '#2C3E50', desc: 'Career-focused layout' },
  { id: 4, name: 'Elegant Floral', icon: '🌸', color: '#E91E63', desc: 'Soft floral borders' },
  { id: 5, name: 'Royal Gold', icon: '👑', color: '#B8860B', desc: 'Premium golden accents' },
  { id: 6, name: 'Simple Classic', icon: '📄', color: '#6B7280', desc: 'No-frills format' },
];

// =============================================
// Main Component
// =============================================
export default function HomePage() {
  const [data, setData] = useState<BiodataData>(initialData);
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState<string>('personal');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<{ downloadUrl: string; shareUrl: string } | null>(null);
  const [error, setError] = useState('');

  const updateData = (field: keyof BiodataData, value: string | null) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const scrollToEditor = () => {
    document.getElementById('editor')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleGenerate = async () => {
    if (!data.fullName || !data.dateOfBirth) {
      setError('Please fill Name and Date of Birth');
      return;
    }
    setGenerating(true);
    setError('');
    try {
      const response = await api.biodatas.generate({
        template_id: selectedTemplate,
        name: data.fullName,
        biodata_data: data as unknown as Record<string, unknown>
      });
      setResult({
        downloadUrl: api.biodatas.getDownloadUrl(response.biodata.download_token || ''),
        shareUrl: `${window.location.origin}/view/${response.biodata.share_token}`
      });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        // Demo mode
        setResult({
          downloadUrl: '#demo',
          shareUrl: `${window.location.origin}/view/demo-${Date.now()}`
        });
      }
    } finally {
      setGenerating(false);
    }
  };

  // Styles
  const styles = {
    page: { fontFamily: "'Inter', 'Segoe UI', sans-serif", background: '#FAFAFA', color: '#1F2937' },
    container: { maxWidth: '1200px', margin: '0 auto', padding: '0 24px' },
    section: { padding: '80px 0' },
    heading: { fontSize: '36px', fontWeight: 700, marginBottom: '16px', color: '#1F2937' },
    subheading: { fontSize: '18px', color: '#6B7280', marginBottom: '40px' },
    btn: { 
      background: 'linear-gradient(135deg, #E07B39 0%, #F4A261 100%)', 
      color: 'white', 
      padding: '16px 32px', 
      borderRadius: '50px', 
      border: 'none', 
      fontSize: '16px', 
      fontWeight: 600, 
      cursor: 'pointer',
      boxShadow: '0 4px 15px rgba(224,123,57,0.3)'
    },
    card: { background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
    input: { 
      width: '100%', 
      padding: '12px 16px', 
      borderRadius: '10px', 
      border: '1px solid #E5E7EB', 
      fontSize: '15px',
      outline: 'none',
      marginBottom: '12px'
    },
    label: { display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px', color: '#374151' },
  };

  return (
    <div style={styles.page}>
      {/* ========== HERO SECTION ========== */}
      <section style={{ 
        background: 'linear-gradient(135deg, #FFF8F0 0%, #FFE4CC 50%, #FFF8F0 100%)', 
        padding: '120px 0 80px',
        textAlign: 'center'
      }}>
        <div style={styles.container}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(224,123,57,0.1)', color: '#E07B39', padding: '8px 16px', borderRadius: '50px', fontSize: '14px', fontWeight: 600, marginBottom: '24px' }}>
            ✨ 100% Free • No Sign-up Required
          </div>
          <h1 style={{ fontSize: '48px', fontWeight: 700, lineHeight: 1.2, marginBottom: '20px', color: '#1F2937' }}>
            Create Your Marriage<br/>
            <span style={{ background: 'linear-gradient(135deg, #E07B39 0%, #F4A261 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Biodata in Minutes</span>
          </h1>
          <p style={{ fontSize: '18px', color: '#6B7280', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
            Choose from beautiful templates, fill your details, and download a stunning PDF biodata instantly.
          </p>
          <button onClick={scrollToEditor} style={styles.btn}>
            Create My Biodata →
          </button>
        </div>
      </section>

      {/* ========== USPs SECTION ========== */}
      <section style={{ ...styles.section, background: 'white' }}>
        <div style={styles.container}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
            {[
              { icon: '🎨', title: '6+ Templates', desc: 'Traditional to modern designs' },
              { icon: '⚡', title: 'Instant PDF', desc: 'Download in seconds' },
              { icon: '🔒', title: '100% Private', desc: 'Your data stays safe' },
              { icon: '📱', title: 'Easy Sharing', desc: 'WhatsApp, email, QR code' },
            ].map((usp, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '24px' }}>
                <div style={{ fontSize: '40px', marginBottom: '16px' }}>{usp.icon}</div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>{usp.title}</h3>
                <p style={{ fontSize: '14px', color: '#6B7280' }}>{usp.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== TEMPLATES SECTION ========== */}
      <section id="templates" style={{ ...styles.section, background: '#F9FAFB' }}>
        <div style={styles.container}>
          <h2 style={{ ...styles.heading, textAlign: 'center' }}>Choose Your Template</h2>
          <p style={{ ...styles.subheading, textAlign: 'center' }}>Select a design that matches your style</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {templates.map(t => (
              <div 
                key={t.id}
                onClick={() => { setSelectedTemplate(t.id); scrollToEditor(); }}
                style={{
                  ...styles.card,
                  cursor: 'pointer',
                  border: selectedTemplate === t.id ? `3px solid ${t.color}` : '3px solid transparent',
                  transition: 'all 0.2s',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>{t.icon}</div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px', color: t.color }}>{t.name}</h3>
                <p style={{ fontSize: '14px', color: '#6B7280' }}>{t.desc}</p>
                {selectedTemplate === t.id && (
                  <div style={{ marginTop: '12px', background: t.color, color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', display: 'inline-block' }}>
                    ✓ Selected
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== EDITOR + PREVIEW SECTION ========== */}
      <section id="editor" style={{ ...styles.section, background: 'white' }}>
        <div style={styles.container}>
          <h2 style={{ ...styles.heading, textAlign: 'center' }}>Fill Your Details</h2>
          <p style={{ ...styles.subheading, textAlign: 'center' }}>Your biodata preview updates in real-time</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '32px', alignItems: 'start' }}>
            {/* ===== LEFT: FORM ===== */}
            <div>
              {/* Accordion: Personal */}
              <Accordion 
                title="Personal Details" 
                icon="👤" 
                isOpen={activeAccordion === 'personal'} 
                onClick={() => setActiveAccordion(activeAccordion === 'personal' ? '' : 'personal')}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={styles.label}>Full Name *</label>
                    <input style={styles.input} value={data.fullName} onChange={e => updateData('fullName', e.target.value)} placeholder="Enter your full name" />
                  </div>
                  <div>
                    <label style={styles.label}>Date of Birth *</label>
                    <input type="date" style={styles.input} value={data.dateOfBirth} onChange={e => updateData('dateOfBirth', e.target.value)} />
                  </div>
                  <div>
                    <label style={styles.label}>Birth Time</label>
                    <input style={styles.input} value={data.birthTime} onChange={e => updateData('birthTime', e.target.value)} placeholder="e.g., 10:30 AM" />
                  </div>
                  <div>
                    <label style={styles.label}>Birth Place</label>
                    <input style={styles.input} value={data.birthPlace} onChange={e => updateData('birthPlace', e.target.value)} placeholder="City of birth" />
                  </div>
                  <div>
                    <label style={styles.label}>Height</label>
                    <input style={styles.input} value={data.height} onChange={e => updateData('height', e.target.value)} placeholder="e.g., 5'8&quot;" />
                  </div>
                  <div>
                    <label style={styles.label}>Complexion</label>
                    <select style={styles.input} value={data.complexion} onChange={e => updateData('complexion', e.target.value)}>
                      <option value="">Select</option>
                      <option>Fair</option>
                      <option>Wheatish</option>
                      <option>Medium</option>
                      <option>Dark</option>
                    </select>
                  </div>
                  <div>
                    <label style={styles.label}>Blood Group</label>
                    <select style={styles.input} value={data.bloodGroup} onChange={e => updateData('bloodGroup', e.target.value)}>
                      <option value="">Select</option>
                      {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => <option key={bg}>{bg}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={styles.label}>Marital Status</label>
                    <select style={styles.input} value={data.maritalStatus} onChange={e => updateData('maritalStatus', e.target.value)}>
                      <option>Never Married</option>
                      <option>Divorced</option>
                      <option>Widowed</option>
                    </select>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={styles.label}>About Me</label>
                    <textarea style={{ ...styles.input, minHeight: '80px', resize: 'vertical' }} value={data.aboutMe} onChange={e => updateData('aboutMe', e.target.value)} placeholder="A short intro about yourself..." />
                  </div>
                </div>
              </Accordion>

              {/* Accordion: Professional */}
              <Accordion 
                title="Education & Career" 
                icon="🎓" 
                isOpen={activeAccordion === 'professional'} 
                onClick={() => setActiveAccordion(activeAccordion === 'professional' ? '' : 'professional')}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={styles.label}>Education</label>
                    <input style={styles.input} value={data.education} onChange={e => updateData('education', e.target.value)} placeholder="e.g., B.Tech, MBA" />
                  </div>
                  <div>
                    <label style={styles.label}>Occupation</label>
                    <input style={styles.input} value={data.occupation} onChange={e => updateData('occupation', e.target.value)} placeholder="e.g., Software Engineer" />
                  </div>
                  <div>
                    <label style={styles.label}>Company</label>
                    <input style={styles.input} value={data.company} onChange={e => updateData('company', e.target.value)} placeholder="e.g., Google, TCS" />
                  </div>
                  <div>
                    <label style={styles.label}>Annual Income</label>
                    <input style={styles.input} value={data.income} onChange={e => updateData('income', e.target.value)} placeholder="e.g., 15-20 LPA" />
                  </div>
                  <div>
                    <label style={styles.label}>Hobbies</label>
                    <input style={styles.input} value={data.hobbies} onChange={e => updateData('hobbies', e.target.value)} placeholder="e.g., Reading, Music" />
                  </div>
                </div>
              </Accordion>

              {/* Accordion: Family */}
              <Accordion 
                title="Family Details" 
                icon="👨‍👩‍👧" 
                isOpen={activeAccordion === 'family'} 
                onClick={() => setActiveAccordion(activeAccordion === 'family' ? '' : 'family')}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={styles.label}>Religion</label>
                    <select style={styles.input} value={data.religion} onChange={e => updateData('religion', e.target.value)}>
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
                    <label style={styles.label}>Caste</label>
                    <input style={styles.input} value={data.caste} onChange={e => updateData('caste', e.target.value)} placeholder="e.g., Brahmin" />
                  </div>
                  <div>
                    <label style={styles.label}>Gotra</label>
                    <input style={styles.input} value={data.gotra} onChange={e => updateData('gotra', e.target.value)} placeholder="e.g., Bharadwaj" />
                  </div>
                  <div>
                    <label style={styles.label}>Family Type</label>
                    <select style={styles.input} value={data.familyType} onChange={e => updateData('familyType', e.target.value)}>
                      <option value="">Select</option>
                      <option>Joint Family</option>
                      <option>Nuclear Family</option>
                    </select>
                  </div>
                  <div>
                    <label style={styles.label}>Father&apos;s Name</label>
                    <input style={styles.input} value={data.fatherName} onChange={e => updateData('fatherName', e.target.value)} placeholder="Father's name" />
                  </div>
                  <div>
                    <label style={styles.label}>Father&apos;s Occupation</label>
                    <input style={styles.input} value={data.fatherOccupation} onChange={e => updateData('fatherOccupation', e.target.value)} placeholder="e.g., Businessman" />
                  </div>
                  <div>
                    <label style={styles.label}>Mother&apos;s Name</label>
                    <input style={styles.input} value={data.motherName} onChange={e => updateData('motherName', e.target.value)} placeholder="Mother's name" />
                  </div>
                  <div>
                    <label style={styles.label}>Mother&apos;s Occupation</label>
                    <input style={styles.input} value={data.motherOccupation} onChange={e => updateData('motherOccupation', e.target.value)} placeholder="e.g., Homemaker" />
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={styles.label}>Siblings</label>
                    <input style={styles.input} value={data.siblings} onChange={e => updateData('siblings', e.target.value)} placeholder="e.g., 1 Elder Brother (Married)" />
                  </div>
                </div>
              </Accordion>

              {/* Accordion: Contact */}
              <Accordion 
                title="Contact Information" 
                icon="📞" 
                isOpen={activeAccordion === 'contact'} 
                onClick={() => setActiveAccordion(activeAccordion === 'contact' ? '' : 'contact')}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={styles.label}>Address</label>
                    <textarea style={{ ...styles.input, minHeight: '60px' }} value={data.address} onChange={e => updateData('address', e.target.value)} placeholder="Full address" />
                  </div>
                  <div>
                    <label style={styles.label}>City</label>
                    <input style={styles.input} value={data.city} onChange={e => updateData('city', e.target.value)} placeholder="e.g., Mumbai" />
                  </div>
                  <div>
                    <label style={styles.label}>State</label>
                    <input style={styles.input} value={data.state} onChange={e => updateData('state', e.target.value)} placeholder="e.g., Maharashtra" />
                  </div>
                  <div>
                    <label style={styles.label}>Phone</label>
                    <input style={styles.input} value={data.phone} onChange={e => updateData('phone', e.target.value)} placeholder="+91 XXXXX XXXXX" />
                  </div>
                  <div>
                    <label style={styles.label}>Email</label>
                    <input style={styles.input} value={data.email} onChange={e => updateData('email', e.target.value)} placeholder="your@email.com" />
                  </div>
                </div>
              </Accordion>

              {/* Generate Button */}
              <div style={{ marginTop: '24px' }}>
                {error && <p style={{ color: '#DC2626', marginBottom: '16px' }}>{error}</p>}
                
                {result ? (
                  <div style={{ background: '#D1FAE5', padding: '24px', borderRadius: '16px', textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
                    <h4 style={{ fontWeight: 600, marginBottom: '16px', color: '#065F46' }}>Biodata Generated!</h4>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <a href={result.downloadUrl} target="_blank" rel="noopener noreferrer" style={{ ...styles.btn, background: '#0D5C63' }}>📥 Download PDF</a>
                      <button onClick={() => { navigator.clipboard.writeText(result.shareUrl); alert('Link copied!'); }} style={{ ...styles.btn, background: 'white', color: '#0D5C63', border: '2px solid #0D5C63' }}>🔗 Copy Link</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={handleGenerate} disabled={generating} style={{ ...styles.btn, width: '100%', opacity: generating ? 0.7 : 1 }}>
                    {generating ? 'Generating...' : '✨ Generate My Biodata'}
                  </button>
                )}
              </div>
            </div>

            {/* ===== RIGHT: PREVIEW ===== */}
            <div style={{ position: 'sticky', top: '24px' }}>
              <BiodataPreview data={data} template={templates.find(t => t.id === selectedTemplate)!} />
            </div>
          </div>
        </div>
      </section>

      {/* ========== FAQ SECTION ========== */}
      <section style={{ ...styles.section, background: '#F9FAFB' }}>
        <div style={styles.container}>
          <h2 style={{ ...styles.heading, textAlign: 'center' }}>Frequently Asked Questions</h2>
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            {[
              { q: 'Is this really free?', a: 'Yes! Creating and downloading biodata is 100% free. No hidden charges.' },
              { q: 'Do I need to create an account?', a: 'No sign-up required. Just fill your details and download instantly.' },
              { q: 'Is my data safe?', a: 'Your data is processed securely and is not stored permanently on our servers.' },
              { q: 'Can I edit after downloading?', a: 'Yes! Come back anytime and create a new biodata with updated information.' },
            ].map((faq, i) => (
              <div key={i} style={{ ...styles.card, marginBottom: '16px' }}>
                <h4 style={{ fontWeight: 600, marginBottom: '8px', color: '#1F2937' }}>{faq.q}</h4>
                <p style={{ color: '#6B7280', fontSize: '15px' }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer style={{ background: '#1F2937', color: 'white', padding: '48px 0', textAlign: 'center' }}>
        <div style={styles.container}>
          <p style={{ fontSize: '24px', marginBottom: '8px' }}>✦ Biodaat</p>
          <p style={{ color: '#9CA3AF', fontSize: '14px' }}>© {new Date().getFullYear()} Biodaat. Made with ❤️ in India</p>
        </div>
      </footer>
    </div>
  );
}

// =============================================
// Accordion Component
// =============================================
function Accordion({ title, icon, isOpen, onClick, children }: { 
  title: string; 
  icon: string; 
  isOpen: boolean; 
  onClick: () => void; 
  children: React.ReactNode 
}) {
  return (
    <div style={{ background: 'white', borderRadius: '16px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden', border: '1px solid #E5E7EB' }}>
      <button onClick={onClick} style={{ 
        width: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px', 
        padding: '20px 24px', 
        background: isOpen ? '#F9FAFB' : 'white', 
        border: 'none', 
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 600,
        color: '#1F2937',
        textAlign: 'left'
      }}>
        <span style={{ fontSize: '24px' }}>{icon}</span>
        <span style={{ flex: 1 }}>{title}</span>
        <span style={{ fontSize: '20px', transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>▼</span>
      </button>
      {isOpen && <div style={{ padding: '0 24px 24px' }}>{children}</div>}
    </div>
  );
}

// =============================================
// Biodata Preview Component - Multiple Designs
// =============================================
function BiodataPreview({ data, template }: { data: BiodataData; template: { id: number; name: string; icon: string; color: string } }) {
  // Render different template based on ID
  switch (template.id) {
    case 1: return <TemplateTraditional data={data} color={template.color} />;
    case 2: return <TemplateModern data={data} color={template.color} />;
    case 3: return <TemplateProfessional data={data} color={template.color} />;
    case 4: return <TemplateFloral data={data} color={template.color} />;
    case 5: return <TemplateRoyal data={data} color={template.color} />;
    case 6: return <TemplateSimple data={data} color={template.color} />;
    default: return <TemplateTraditional data={data} color={template.color} />;
  }
}

// =============================================
// Template 1: Traditional (Centered with Om)
// =============================================
function TemplateTraditional({ data, color }: { data: BiodataData; color: string }) {
  return (
    <div style={{ background: `linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)`, borderRadius: '16px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', border: `4px solid ${color}`, minHeight: '550px' }}>
      {/* Header with Om */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{ fontSize: '40px', color: color }}>🕉️</div>
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: color, margin: '8px 0' }}>॥ श्री गणेशाय नमः ॥</h3>
        <div style={{ background: color, height: '2px', width: '60%', margin: '0 auto' }} />
        <p style={{ fontSize: '14px', letterSpacing: '4px', marginTop: '8px', color: '#92400E' }}>BIODATA</p>
      </div>

      {/* Photo */}
      <div style={{ width: '100px', height: '120px', margin: '0 auto 20px', borderRadius: '8px', border: `3px solid ${color}`, background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {data.photo ? <img src={data.photo} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '40px' }}>👤</span>}
      </div>

      {/* Fields - Traditional Table Style */}
      <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
        <tbody>
          {data.fullName && <tr><td style={{ padding: '8px 0', fontWeight: 600, color: '#92400E', width: '40%' }}>Name</td><td style={{ color: '#78350F' }}>{data.fullName}</td></tr>}
          {data.dateOfBirth && <tr><td style={{ padding: '8px 0', fontWeight: 600, color: '#92400E' }}>Date of Birth</td><td style={{ color: '#78350F' }}>{data.dateOfBirth}</td></tr>}
          {data.birthPlace && <tr><td style={{ padding: '8px 0', fontWeight: 600, color: '#92400E' }}>Birth Place</td><td style={{ color: '#78350F' }}>{data.birthPlace}</td></tr>}
          {data.height && <tr><td style={{ padding: '8px 0', fontWeight: 600, color: '#92400E' }}>Height</td><td style={{ color: '#78350F' }}>{data.height}</td></tr>}
          {data.education && <tr><td style={{ padding: '8px 0', fontWeight: 600, color: '#92400E' }}>Education</td><td style={{ color: '#78350F' }}>{data.education}</td></tr>}
          {data.occupation && <tr><td style={{ padding: '8px 0', fontWeight: 600, color: '#92400E' }}>Occupation</td><td style={{ color: '#78350F' }}>{data.occupation}</td></tr>}
          {data.religion && <tr><td style={{ padding: '8px 0', fontWeight: 600, color: '#92400E' }}>Religion/Caste</td><td style={{ color: '#78350F' }}>{data.religion}{data.caste ? ` / ${data.caste}` : ''}</td></tr>}
          {data.fatherName && <tr><td style={{ padding: '8px 0', fontWeight: 600, color: '#92400E' }}>Father</td><td style={{ color: '#78350F' }}>{data.fatherName}</td></tr>}
          {data.motherName && <tr><td style={{ padding: '8px 0', fontWeight: 600, color: '#92400E' }}>Mother</td><td style={{ color: '#78350F' }}>{data.motherName}</td></tr>}
          {data.city && <tr><td style={{ padding: '8px 0', fontWeight: 600, color: '#92400E' }}>Location</td><td style={{ color: '#78350F' }}>{data.city}{data.state ? `, ${data.state}` : ''}</td></tr>}
          {data.phone && <tr><td style={{ padding: '8px 0', fontWeight: 600, color: '#92400E' }}>Contact</td><td style={{ color: '#78350F' }}>{data.phone}</td></tr>}
        </tbody>
      </table>

      <div style={{ textAlign: 'center', marginTop: '16px', paddingTop: '12px', borderTop: `2px solid ${color}` }}>
        <p style={{ fontSize: '11px', color: '#92400E' }}>॥ सुभमंगलम ॥</p>
      </div>
    </div>
  );
}

// =============================================
// Template 2: Modern Minimal (Cards)
// =============================================
function TemplateModern({ data, color }: { data: BiodataData; color: string }) {
  const CardField = ({ label, value }: { label: string; value: string }) => (
    <div style={{ background: '#F8FAFC', padding: '10px 14px', borderRadius: '8px', marginBottom: '8px' }}>
      <p style={{ fontSize: '10px', color: '#64748B', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</p>
      <p style={{ fontSize: '14px', fontWeight: 500, color: '#1E293B', marginTop: '2px' }}>{value}</p>
    </div>
  );

  return (
    <div style={{ background: 'white', borderRadius: '20px', padding: '28px', boxShadow: '0 8px 30px rgba(0,0,0,0.08)', border: '1px solid #E2E8F0', minHeight: '550px' }}>
      {/* Header - Minimal */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', paddingBottom: '16px', borderBottom: `2px solid ${color}` }}>
        <div style={{ width: '70px', height: '85px', borderRadius: '12px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
          {data.photo ? <img src={data.photo} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '32px' }}>👤</span>}
        </div>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A', margin: 0 }}>{data.fullName || 'Your Name'}</h2>
          <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>{data.occupation || 'Occupation'} {data.company ? `@ ${data.company}` : ''}</p>
        </div>
      </div>

      {/* Two Column Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        {data.dateOfBirth && <CardField label="Date of Birth" value={data.dateOfBirth} />}
        {data.birthPlace && <CardField label="Birth Place" value={data.birthPlace} />}
        {data.height && <CardField label="Height" value={data.height} />}
        {data.complexion && <CardField label="Complexion" value={data.complexion} />}
        {data.education && <CardField label="Education" value={data.education} />}
        {data.income && <CardField label="Income" value={data.income} />}
        {data.religion && <CardField label="Religion" value={`${data.religion}${data.caste ? ` / ${data.caste}` : ''}`} />}
        {data.familyType && <CardField label="Family" value={data.familyType} />}
        {data.fatherName && <CardField label="Father" value={data.fatherName} />}
        {data.motherName && <CardField label="Mother" value={data.motherName} />}
        {data.city && <CardField label="Location" value={`${data.city}${data.state ? `, ${data.state}` : ''}`} />}
        {data.phone && <CardField label="Contact" value={data.phone} />}
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px', paddingTop: '16px' }}>
        <p style={{ fontSize: '11px', color: '#94A3B8' }}>Created with Biodaat ✨</p>
      </div>
    </div>
  );
}

// =============================================
// Template 3: Professional (Table Format)
// =============================================
function TemplateProfessional({ data, color }: { data: BiodataData; color: string }) {
  return (
    <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: `1px solid ${color}`, minHeight: '550px' }}>
      {/* Header - Professional */}
      <div style={{ background: color, padding: '16px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>
        <h2 style={{ color: 'white', fontSize: '18px', fontWeight: 700, margin: 0 }}>BIODATA</h2>
      </div>

      {/* Photo + Basic Info Side by Side */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #E5E7EB' }}>
        <div style={{ width: '80px', height: '100px', borderRadius: '4px', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid #D1D5DB', flexShrink: 0 }}>
          {data.photo ? <img src={data.photo} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '30px' }}>👤</span>}
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>{data.fullName || 'Name'}</h3>
          <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '8px' }}>{data.occupation || 'Profession'}</p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {data.education && <span style={{ fontSize: '12px', background: '#F3F4F6', padding: '4px 10px', borderRadius: '4px' }}>🎓 {data.education}</span>}
            {data.city && <span style={{ fontSize: '12px', background: '#F3F4F6', padding: '4px 10px', borderRadius: '4px' }}>📍 {data.city}</span>}
          </div>
        </div>
      </div>

      {/* Striped Table */}
      <table style={{ width: '100%', fontSize: '13px' }}>
        <tbody>
          {[
            { label: 'Date of Birth', value: data.dateOfBirth },
            { label: 'Height / Complexion', value: `${data.height || '-'} / ${data.complexion || '-'}` },
            { label: 'Religion / Caste', value: `${data.religion || '-'}${data.caste ? ` / ${data.caste}` : ''}` },
            { label: 'Annual Income', value: data.income },
            { label: 'Father', value: data.fatherName ? `${data.fatherName}${data.fatherOccupation ? ` (${data.fatherOccupation})` : ''}` : '' },
            { label: 'Mother', value: data.motherName ? `${data.motherName}${data.motherOccupation ? ` (${data.motherOccupation})` : ''}` : '' },
            { label: 'Siblings', value: data.siblings },
            { label: 'Contact', value: data.phone },
          ].filter(row => row.value).map((row, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? '#F9FAFB' : 'white' }}>
              <td style={{ padding: '10px 12px', fontWeight: 600, color: '#374151', width: '40%' }}>{row.label}</td>
              <td style={{ padding: '10px 12px', color: '#4B5563' }}>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// =============================================
// Template 4: Elegant Floral (Decorative Border)
// =============================================
function TemplateFloral({ data, color }: { data: BiodataData; color: string }) {
  return (
    <div style={{ background: `linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)`, borderRadius: '20px', padding: '28px', boxShadow: '0 8px 30px rgba(0,0,0,0.08)', border: `3px solid ${color}`, minHeight: '550px', position: 'relative' }}>
      {/* Corner Decorations */}
      <div style={{ position: 'absolute', top: '8px', left: '8px', fontSize: '20px' }}>🌸</div>
      <div style={{ position: 'absolute', top: '8px', right: '8px', fontSize: '20px' }}>🌸</div>
      <div style={{ position: 'absolute', bottom: '8px', left: '8px', fontSize: '20px' }}>🌸</div>
      <div style={{ position: 'absolute', bottom: '8px', right: '8px', fontSize: '20px' }}>🌸</div>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <p style={{ fontSize: '14px', color: color, fontStyle: 'italic' }}>~ Marriage Biodata ~</p>
        <div style={{ width: '60%', height: '2px', background: `linear-gradient(90deg, transparent, ${color}, transparent)`, margin: '8px auto' }} />
      </div>

      {/* Photo */}
      <div style={{ width: '90px', height: '110px', margin: '0 auto 20px', borderRadius: '50%', border: `3px solid ${color}`, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {data.photo ? <img src={data.photo} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '36px' }}>👤</span>}
      </div>

      <h2 style={{ textAlign: 'center', fontSize: '18px', fontWeight: 600, color: '#831843', marginBottom: '16px' }}>{data.fullName || 'Your Name'}</h2>

      {/* Fields */}
      <div style={{ fontSize: '13px' }}>
        {[
          { icon: '📅', label: 'Born', value: data.dateOfBirth },
          { icon: '📍', label: 'Place', value: data.birthPlace },
          { icon: '🎓', label: 'Education', value: data.education },
          { icon: '💼', label: 'Work', value: data.occupation },
          { icon: '🙏', label: 'Religion', value: data.religion },
          { icon: '👨‍👩‍👧', label: 'Family', value: data.fatherName ? `Father: ${data.fatherName}` : '' },
          { icon: '📞', label: 'Contact', value: data.phone },
        ].filter(f => f.value).map((f, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0', borderBottom: '1px dashed #FBCFE8' }}>
            <span>{f.icon}</span>
            <span style={{ fontWeight: 500, color: '#9D174D', minWidth: '70px' }}>{f.label}:</span>
            <span style={{ color: '#831843' }}>{f.value}</span>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p style={{ fontSize: '11px', color: '#BE185D', fontStyle: 'italic' }}>~ With Love ~</p>
      </div>
    </div>
  );
}

// =============================================
// Template 5: Royal Gold (Ornate)
// =============================================
function TemplateRoyal({ data, color }: { data: BiodataData; color: string }) {
  return (
    <div style={{ background: `linear-gradient(180deg, #1C1917 0%, #292524 100%)`, borderRadius: '16px', padding: '28px', boxShadow: '0 8px 30px rgba(0,0,0,0.3)', border: `4px solid ${color}`, minHeight: '550px' }}>
      {/* Ornate Header */}
      <div style={{ textAlign: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: `2px solid ${color}` }}>
        <div style={{ fontSize: '12px', color: color, letterSpacing: '3px' }}>✦ ✦ ✦</div>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: color, margin: '8px 0', textTransform: 'uppercase', letterSpacing: '4px' }}>Biodata</h2>
        <div style={{ fontSize: '12px', color: color, letterSpacing: '3px' }}>✦ ✦ ✦</div>
      </div>

      {/* Photo with gold border */}
      <div style={{ width: '90px', height: '110px', margin: '0 auto 20px', border: `3px solid ${color}`, background: '#44403C', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {data.photo ? <img src={data.photo} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '36px' }}>👤</span>}
      </div>

      <h3 style={{ textAlign: 'center', fontSize: '18px', fontWeight: 600, color: color, marginBottom: '16px' }}>{data.fullName || 'Your Name'}</h3>

      {/* Gold divider */}
      <div style={{ width: '50%', height: '1px', background: color, margin: '0 auto 16px' }} />

      {/* Fields */}
      <table style={{ width: '100%', fontSize: '12px' }}>
        <tbody>
          {[
            data.dateOfBirth && ['Date of Birth', data.dateOfBirth],
            data.education && ['Education', data.education],
            data.occupation && ['Profession', data.occupation],
            data.income && ['Income', data.income],
            data.religion && ['Religion', `${data.religion}${data.caste ? ` / ${data.caste}` : ''}`],
            data.fatherName && ['Father', data.fatherName],
            data.motherName && ['Mother', data.motherName],
            data.city && ['Location', `${data.city}${data.state ? `, ${data.state}` : ''}`],
            data.phone && ['Contact', data.phone],
          ].filter(Boolean).map((row, i) => (
            <tr key={i}>
              <td style={{ padding: '8px 0', color: color, fontWeight: 500, width: '35%' }}>{row![0]}</td>
              <td style={{ padding: '8px 0', color: '#D6D3D1' }}>{row![1]}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ textAlign: 'center', marginTop: '20px', paddingTop: '16px', borderTop: `1px solid ${color}` }}>
        <p style={{ fontSize: '10px', color: color, letterSpacing: '2px' }}>👑 ROYAL BIODATA 👑</p>
      </div>
    </div>
  );
}

// =============================================
// Template 6: Simple Classic (No Frills)
// =============================================
function TemplateSimple({ data, color }: { data: BiodataData; color: string }) {
  return (
    <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #E5E7EB', minHeight: '550px' }}>
      {/* Simple Header */}
      <div style={{ textAlign: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: '2px solid #E5E7EB' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#374151', textTransform: 'uppercase', letterSpacing: '2px' }}>Biodata</h2>
      </div>

      {/* Photo */}
      <div style={{ width: '80px', height: '100px', margin: '0 auto 20px', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid #D1D5DB' }}>
        {data.photo ? <img src={data.photo} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '30px' }}>👤</span>}
      </div>

      {/* Simple Lines */}
      <div style={{ fontSize: '13px', lineHeight: '2' }}>
        {data.fullName && <p><strong>Name:</strong> {data.fullName}</p>}
        {data.dateOfBirth && <p><strong>DOB:</strong> {data.dateOfBirth}</p>}
        {data.height && <p><strong>Height:</strong> {data.height}</p>}
        {data.education && <p><strong>Education:</strong> {data.education}</p>}
        {data.occupation && <p><strong>Occupation:</strong> {data.occupation}</p>}
        {data.income && <p><strong>Income:</strong> {data.income}</p>}
        {data.religion && <p><strong>Religion:</strong> {data.religion}{data.caste ? ` / ${data.caste}` : ''}</p>}
        {data.fatherName && <p><strong>Father:</strong> {data.fatherName}</p>}
        {data.motherName && <p><strong>Mother:</strong> {data.motherName}</p>}
        {data.city && <p><strong>Location:</strong> {data.city}{data.state ? `, ${data.state}` : ''}</p>}
        {data.phone && <p><strong>Contact:</strong> {data.phone}</p>}
        {data.email && <p><strong>Email:</strong> {data.email}</p>}
      </div>

      <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #E5E7EB' }}>
        <p style={{ fontSize: '11px', color: '#9CA3AF' }}>Created with Biodaat</p>
      </div>
    </div>
  );
}

