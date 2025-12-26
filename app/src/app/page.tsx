import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", background: '#FFF8F0', color: '#2D3436' }}>
      {/* Header */}
      <header style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 100,
        background: 'rgba(255,248,240,0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #E5E7EB'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <span style={{ fontSize: '28px', color: '#E07B39' }}>✦</span>
            <span style={{ fontSize: '24px', fontWeight: 700, color: '#0D5C63' }}>Biodaat</span>
          </Link>
          
          <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <Link href="#how-it-works" style={{ color: '#636E72', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}>How It Works</Link>
            <Link href="#testimonials" style={{ color: '#636E72', textDecoration: 'none', fontWeight: 500 }}>Stories</Link>
            <Link href="/login/" style={{ 
              color: '#0D5C63', 
              textDecoration: 'none', 
              fontWeight: 600,
              padding: '10px 20px'
            }}>Login</Link>
            <Link href="/create/" style={{ 
              background: 'linear-gradient(135deg, #E07B39 0%, #F4A261 100%)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '50px',
              textDecoration: 'none',
              fontWeight: 600,
              boxShadow: '0 4px 15px rgba(224,123,57,0.3)',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}>Create Free</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        paddingTop: '100px',
        background: 'linear-gradient(135deg, #FFF8F0 0%, #FFE4CC 50%, #FFF8F0 100%)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}>
            {/* Left Content */}
            <div>
              <div style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(224,123,57,0.1)',
                color: '#E07B39',
                padding: '8px 16px',
                borderRadius: '50px',
                fontSize: '14px',
                fontWeight: 600,
                marginBottom: '24px'
              }}>
                ✨ Trusted by 100k+ families
              </div>
              
              <h1 style={{ fontSize: '56px', fontWeight: 700, lineHeight: 1.1, marginBottom: '24px', color: '#2D3436' }}>
                Tell your story —{' '}
                <span style={{ 
                  background: 'linear-gradient(135deg, #E07B39 0%, #F4A261 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>beautifully.</span>
              </h1>
              
              <p style={{ fontSize: '20px', color: '#636E72', marginBottom: '40px', lineHeight: 1.6, maxWidth: '500px' }}>
                Create a marriage biodata that feels like you. 
                100+ handcrafted templates, instant PDF, shareable link & QR.
              </p>
              
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '48px' }}>
                <Link href="/create/" style={{ 
                  background: 'linear-gradient(135deg, #E07B39 0%, #F4A261 100%)',
                  color: 'white',
                  padding: '18px 36px',
                  borderRadius: '50px',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '18px',
                  boxShadow: '0 6px 25px rgba(224,123,57,0.4)',
                  display: 'inline-block'
                }}>
                  Create My Biodata — It's Free →
                </Link>
                <Link href="#how-it-works" style={{ 
                  background: 'transparent',
                  color: '#0D5C63',
                  padding: '18px 36px',
                  borderRadius: '50px',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '18px',
                  border: '2px solid #0D5C63',
                  display: 'inline-block'
                }}>
                  See Styles
                </Link>
              </div>
              
              {/* Trust Strip */}
              <div style={{ display: 'flex', gap: '32px', fontSize: '14px', color: '#636E72', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#00B894' }}>✓</span>
                  <span>No sign-up required</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#00B894' }}>🔒</span>
                  <span>Your data stays private</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#00B894' }}>⚡</span>
                  <span>Ready in 5 minutes</span>
                </div>
              </div>
            </div>
            
            {/* Right: Biodata Preview Card */}
            <div style={{ position: 'relative' }}>
              <div style={{ 
                background: 'white',
                borderRadius: '24px',
                padding: '40px',
                boxShadow: '0 20px 60px rgba(13,92,99,0.15)',
                border: '1px solid rgba(13,92,99,0.08)',
                maxWidth: '380px',
                margin: '0 auto'
              }}>
                <div style={{ textAlign: 'center', marginBottom: '28px', paddingBottom: '20px', borderBottom: '2px solid #FFF8F0' }}>
                  <div style={{ fontSize: '32px', color: '#E07B39', marginBottom: '8px' }}>✦</div>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: '#0D5C63' }}>|| श्री गणेशाय नमः ||</div>
                  <div style={{ fontSize: '12px', color: '#636E72', marginTop: '4px', letterSpacing: '2px' }}>BIODATA</div>
                </div>
                
                {/* Sample Photo */}
                <div style={{ 
                  width: '100px', 
                  height: '120px', 
                  margin: '0 auto 24px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg, #FFF8F0 0%, #FFE4CC 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '3px solid #E07B39'
                }}>
                  <img 
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=250&fit=crop&crop=face"
                    alt="Profile"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                {/* Biodata Fields */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { label: 'Name', value: 'Priya Sharma' },
                    { label: 'About', value: '"A curious soul who loves chai & code"' },
                    { label: 'DOB', value: '15 May, 1996' },
                    { label: 'Education', value: 'B.Tech, MBA - IIM Bangalore' },
                    { label: 'Work', value: 'Product Manager @ Google' },
                  ].map((field, i) => (
                    <div key={i} style={{ 
                      display: 'flex',
                      background: '#FFF8F0',
                      borderRadius: '10px',
                      padding: '12px 16px'
                    }}>
                      <span style={{ fontWeight: 600, width: '80px', fontSize: '13px', color: '#2D3436' }}>{field.label}</span>
                      <span style={{ fontSize: '13px', color: '#636E72', flex: 1 }}>{field.value}</span>
                    </div>
                  ))}
                </div>
                
                <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '12px', color: '#636E72' }}>
                  Made with Biodaat 💛
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div style={{ 
                position: 'absolute', 
                top: '-20px', 
                right: '-20px', 
                width: '120px', 
                height: '120px',
                background: 'rgba(224,123,57,0.15)',
                borderRadius: '50%',
                filter: 'blur(40px)',
                zIndex: -1
              }} />
              <div style={{ 
                position: 'absolute', 
                bottom: '-30px', 
                left: '-30px', 
                width: '150px', 
                height: '150px',
                background: 'rgba(13,92,99,0.1)',
                borderRadius: '50%',
                filter: 'blur(50px)',
                zIndex: -1
              }} />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" style={{ padding: '100px 0', background: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ fontSize: '42px', fontWeight: 700, marginBottom: '16px', color: '#2D3436' }}>
              Your story, in{' '}
              <span style={{ 
                background: 'linear-gradient(135deg, #0D5C63 0%, #14919B 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>3 simple steps</span>
            </h2>
            <p style={{ fontSize: '18px', color: '#636E72', maxWidth: '600px', margin: '0 auto' }}>
              No complicated forms. Just answer a few questions, and we'll help you create something beautiful.
            </p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
            {[
              { num: '01', icon: '📸', title: 'Add your photo & basics', desc: 'Upload a nice photo. We\'ll guide you with tips for the perfect shot.' },
              { num: '02', icon: '✏️', title: 'Share your story', desc: 'Pick from smart suggestions or write your own. "My proudest moment is..."' },
              { num: '03', icon: '🎉', title: 'Download & share', desc: 'Get PDF, shareable link, and QR code. Send directly to WhatsApp!' },
            ].map((step, i) => (
              <div key={i} style={{ 
                background: '#FFF8F0',
                borderRadius: '24px',
                padding: '40px 32px',
                textAlign: 'center',
                transition: 'transform 0.3s, box-shadow 0.3s',
                border: '1px solid rgba(13,92,99,0.06)'
              }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>{step.icon}</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#E07B39', marginBottom: '12px' }}>{step.num}</div>
                <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '12px', color: '#2D3436' }}>{step.title}</h3>
                <p style={{ fontSize: '16px', color: '#636E72', lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Persona Selection */}
      <section id="personas" style={{ padding: '100px 0', background: '#FFF8F0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ fontSize: '42px', fontWeight: 700, marginBottom: '16px', color: '#2D3436' }}>
              Choose your{' '}
              <span style={{ 
                background: 'linear-gradient(135deg, #E07B39 0%, #F4A261 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>style</span>
            </h2>
            <p style={{ fontSize: '18px', color: '#636E72', maxWidth: '600px', margin: '0 auto' }}>
              We've crafted different styles for different personalities. Pick one that feels like you.
            </p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
            {[
              { icon: '🌸', name: 'Traditional', desc: 'Classic design with auspicious elements. Perfect for families who value heritage.', style: 'For: Joint families' },
              { icon: '💼', name: 'NRI Professional', desc: 'Modern, career-focused layout. Highlights education and achievements.', style: 'For: Working professionals' },
              { icon: '🎨', name: 'Creative', desc: 'Unique, story-driven design. Stand out with personality and hobbies.', style: 'For: Artists, unconventional' },
              { icon: '✨', name: 'Modern Minimal', desc: 'Clean, elegant simplicity. Let the content speak for itself.', style: 'For: Urban, contemporary' },
            ].map((persona, i) => (
              <Link href="/create/" key={i} style={{ 
                background: 'white',
                borderRadius: '24px',
                padding: '32px',
                textAlign: 'center',
                textDecoration: 'none',
                color: 'inherit',
                border: '2px solid transparent',
                transition: 'all 0.3s',
                display: 'block',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>{persona.icon}</div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px', color: '#2D3436' }}>{persona.name}</h3>
                <p style={{ fontSize: '14px', color: '#636E72', lineHeight: 1.5, marginBottom: '16px' }}>{persona.desc}</p>
                <div style={{ fontSize: '13px', color: '#0D5C63', fontWeight: 600 }}>{persona.style}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Social Sharing */}
      <section style={{ padding: '100px 0', background: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}>
            <div>
              <div style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(13,92,99,0.1)',
                color: '#0D5C63',
                padding: '8px 16px',
                borderRadius: '50px',
                fontSize: '14px',
                fontWeight: 600,
                marginBottom: '24px'
              }}>
                📱 Share Anywhere
              </div>
              <h2 style={{ fontSize: '42px', fontWeight: 700, marginBottom: '16px', color: '#2D3436' }}>
                Share with family{' '}
                <span style={{ 
                  background: 'linear-gradient(135deg, #0D5C63 0%, #14919B 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>the Indian way</span>
              </h2>
              <p style={{ fontSize: '18px', color: '#636E72', marginBottom: '32px', lineHeight: 1.6 }}>
                Your biodata comes with a shareable link, downloadable QR code, 
                and pre-filled WhatsApp messages. <strong>Perfect for "mummy wants to send it to aunty"</strong> moments.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                {[
                  'PDF Download — high quality, print-ready',
                  'Shareable Link — public or password protected',
                  'QR Code — add to wedding cards',
                  'WhatsApp Share — "Send this to mom" button',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '16px' }}>
                    <span style={{ color: '#00B894', fontSize: '18px' }}>✓</span>
                    <span style={{ color: '#2D3436' }}>{item}</span>
                  </div>
                ))}
              </div>
              <Link href="/create/" style={{ 
                background: 'linear-gradient(135deg, #E07B39 0%, #F4A261 100%)',
                color: 'white',
                padding: '16px 32px',
                borderRadius: '50px',
                textDecoration: 'none',
                fontWeight: 600,
                display: 'inline-block',
                boxShadow: '0 4px 15px rgba(224,123,57,0.3)'
              }}>
                Create My Biodata →
              </Link>
            </div>
            
            <div style={{ 
              background: 'linear-gradient(135deg, #FFF8F0 0%, #FFE4CC 100%)',
              borderRadius: '32px',
              padding: '48px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '80px', marginBottom: '24px' }}>📲</div>
              <p style={{ fontWeight: 600, fontSize: '18px', marginBottom: '8px', color: '#2D3436' }}>Share via WhatsApp</p>
              <p style={{ fontSize: '14px', color: '#636E72', marginBottom: '24px' }}>"Hi! Please check Priya's biodata..."</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>💬</div>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#0088cc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>📨</div>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#2D3436', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>🔗</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" style={{ padding: '100px 0', background: '#FFF8F0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ fontSize: '42px', fontWeight: 700, marginBottom: '16px', color: '#2D3436' }}>
              Wall of{' '}
              <span style={{ 
                background: 'linear-gradient(135deg, #E07B39 0%, #F4A261 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>Love</span> 💛
            </h2>
            <p style={{ fontSize: '18px', color: '#636E72' }}>
              Real stories from real families who found their perfect match
            </p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {[
              { name: 'Priya S.', location: 'Mumbai', text: 'The story prompts were amazing! I didn\'t know what to write, but the suggestions made it so easy. My biodata actually sounds like me now.', avatar: '👩' },
              { name: 'Rahul K.', location: 'Delhi', text: 'Shared the QR code at my sister\'s wedding. So many families scanned it! Got 3 genuine proposals within a week.', avatar: '👨' },
              { name: 'Anjali M.', location: 'Bangalore', text: 'As an NRI, I loved the professional template. It highlighted my career while respecting our traditions. Perfect balance.', avatar: '👩' },
              { name: 'Vikram T.', location: 'Pune', text: 'My mom couldn\'t stop sharing it on WhatsApp 😂 The "send to family" feature is genius. Made the whole process less awkward.', avatar: '👨' },
              { name: 'Sneha R.', location: 'Chennai', text: 'No sign-up required was the selling point for me. Created a beautiful biodata in 10 minutes without sharing my email.', avatar: '👩' },
              { name: 'Arjun P.', location: 'Hyderabad', text: 'The privacy controls are great. I could share a public link but hide my phone number until I was sure. Very thoughtful.', avatar: '👨' },
            ].map((t, i) => (
              <div key={i} style={{ 
                background: 'white',
                borderRadius: '20px',
                padding: '32px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
              }}>
                <div style={{ color: '#E07B39', fontSize: '20px', marginBottom: '16px', letterSpacing: '2px' }}>★★★★★</div>
                <p style={{ fontSize: '15px', color: '#2D3436', marginBottom: '24px', lineHeight: 1.6, fontStyle: 'italic' }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '50%', 
                    background: 'rgba(13,92,99,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px'
                  }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#2D3436' }}>{t.name}</div>
                    <div style={{ fontSize: '14px', color: '#636E72' }}>{t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '100px 0', background: 'linear-gradient(135deg, #0D5C63 0%, #14919B 100%)', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
          <h2 style={{ fontSize: '42px', fontWeight: 700, color: 'white', marginBottom: '16px' }}>
            Ready to tell your story?
          </h2>
          <p style={{ fontSize: '20px', color: 'rgba(255,255,255,0.85)', marginBottom: '40px', lineHeight: 1.6 }}>
            Join 100,000+ families who created beautiful biodatas. 
            No sign-up. No stress. Just your story, beautifully told.
          </p>
          <Link href="/create/" style={{ 
            background: 'white',
            color: '#0D5C63',
            padding: '20px 48px',
            borderRadius: '50px',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: '18px',
            display: 'inline-block',
            boxShadow: '0 6px 30px rgba(0,0,0,0.2)'
          }}>
            Create My Biodata — It's Free ✨
          </Link>
          <div style={{ marginTop: '24px', color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
            No credit card required • Ready in 5 minutes
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '80px 0 40px', background: '#2D3436', color: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '48px', marginBottom: '48px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '24px', fontWeight: 700, marginBottom: '16px' }}>
                <span style={{ color: '#E07B39' }}>✦</span>
                <span>Biodaat</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, fontSize: '15px' }}>
                Your story, beautifully told. Create marriage biodatas that 
                feel authentic, look stunning, and share effortlessly.
              </p>
            </div>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px', color: '#E07B39' }}>Product</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Link href="/create/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '15px' }}>Create Biodata</Link>
                <Link href="#personas" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '15px' }}>Styles</Link>
                <Link href="#testimonials" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '15px' }}>Stories</Link>
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px', color: '#E07B39' }}>Support</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Link href="#" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '15px' }}>Help Center</Link>
                <Link href="#" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '15px' }}>Contact Us</Link>
                <Link href="#" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '15px' }}>FAQ</Link>
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px', color: '#E07B39' }}>Legal</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Link href="#" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '15px' }}>Privacy Policy</Link>
                <Link href="#" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '15px' }}>Terms of Service</Link>
                <Link href="#" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '15px' }}>Refund Policy</Link>
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '32px', textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
            <p>© {new Date().getFullYear()} Biodaat. Made with 💛 in India</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
