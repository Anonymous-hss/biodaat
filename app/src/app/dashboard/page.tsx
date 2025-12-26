'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api, { User, Biodata } from '@/lib/api';

// Demo data for when API is not available
const demoBiodatas: Biodata[] = [
  { 
    id: 1, 
    user_id: 1,
    template_id: 1,
    template_name: 'Traditional',
    name: 'Priya Sharma', 
    data: {},
    share_token: 'abc123',
    download_token: 'xyz789',
    created_at: '2024-12-25', 
    updated_at: '2024-12-25'
  },
  { 
    id: 2, 
    user_id: 1,
    template_id: 2,
    template_name: 'Modern Minimal',
    name: 'Draft Biodata', 
    data: {},
    created_at: '2024-12-20',
    updated_at: '2024-12-20'
  },
];

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [biodatas, setBiodatas] = useState<Biodata[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const userData = await api.auth.me();
        setUser(userData);
        
        // Fetch biodatas
        const biodataList = await api.biodatas.list();
        setBiodatas(biodataList);
      } catch {
        // Use demo data if API not available
        setUser({ id: 1, name: 'Demo User', phone: '+91 98765 43210', created_at: new Date().toISOString() });
        setBiodatas(demoBiodatas);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await api.auth.logout();
    } catch {
      // Ignore errors
    }
    window.location.href = '/login/';
  };

  const handleDownload = (biodata: Biodata) => {
    if (biodata.download_token) {
      window.open(api.biodatas.getDownloadUrl(biodata.download_token), '_blank');
    } else {
      alert('Download token not available');
    }
  };

  const handleShare = (biodata: Biodata) => {
    if (biodata.share_token) {
      const shareUrl = `${window.location.origin}/view/${biodata.share_token}`;
      navigator.clipboard.writeText(shareUrl);
      alert('Share link copied to clipboard!');
    } else {
      alert('Share token not available');
    }
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#FFF8F0',
        fontFamily: "'Inter', 'Segoe UI', sans-serif"
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>✦</div>
          <p style={{ color: '#636E72' }}>Loading...</p>
        </div>
      </div>
    );
  }

  const isComplete = (biodata: Biodata) => !!biodata.download_token;

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#FFF8F0',
      fontFamily: "'Inter', 'Segoe UI', sans-serif"
    }}>
      {/* Header */}
      <header style={{ 
        background: 'white',
        borderBottom: '1px solid #E5E7EB',
        padding: '16px 0'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <span style={{ fontSize: '28px', color: '#E07B39' }}>✦</span>
            <span style={{ fontSize: '24px', fontWeight: 700, color: '#0D5C63' }}>Biodaat</span>
          </Link>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 600, color: '#2D3436' }}>{user?.name || 'User'}</div>
              <div style={{ fontSize: '14px', color: '#636E72' }}>{user?.phone}</div>
            </div>
            <button
              onClick={handleLogout}
              style={{
                background: 'transparent',
                color: '#D63031',
                border: '1px solid #D63031',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px' }}>
        {/* Welcome Section */}
        <div style={{ marginBottom: '48px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px', color: '#2D3436' }}>
            Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
          </h1>
          <p style={{ color: '#636E72', fontSize: '18px' }}>
            Manage your biodatas and create new ones
          </p>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '48px' }}>
          <Link href="/create/" style={{
            background: 'linear-gradient(135deg, #0D5C63 0%, #14919B 100%)',
            color: 'white',
            padding: '32px',
            borderRadius: '20px',
            textDecoration: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            <span style={{ fontSize: '32px' }}>✨</span>
            <span style={{ fontSize: '20px', fontWeight: 600 }}>Create New Biodata</span>
            <span style={{ fontSize: '14px', opacity: 0.8 }}>Start fresh with a new biodata</span>
          </Link>

          <div style={{
            background: 'white',
            padding: '32px',
            borderRadius: '20px',
            border: '1px solid #E5E7EB'
          }}>
            <span style={{ fontSize: '32px', marginBottom: '12px', display: 'block' }}>📊</span>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#2D3436' }}>{biodatas.length}</div>
            <div style={{ color: '#636E72' }}>Total Biodatas</div>
          </div>

          <div style={{
            background: 'white',
            padding: '32px',
            borderRadius: '20px',
            border: '1px solid #E5E7EB'
          }}>
            <span style={{ fontSize: '32px', marginBottom: '12px', display: 'block' }}>📥</span>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#2D3436' }}>
              {biodatas.filter(b => isComplete(b)).length}
            </div>
            <div style={{ color: '#636E72' }}>Completed</div>
          </div>
        </div>

        {/* Biodatas List */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#2D3436' }}>My Biodatas</h2>
          </div>

          {biodatas.length === 0 ? (
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '64px',
              textAlign: 'center',
              border: '1px solid #E5E7EB'
            }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>📝</div>
              <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px', color: '#2D3436' }}>
                No biodatas yet
              </h3>
              <p style={{ color: '#636E72', marginBottom: '24px' }}>
                Create your first biodata to get started
              </p>
              <Link href="/create/" style={{
                background: 'linear-gradient(135deg, #E07B39 0%, #F4A261 100%)',
                color: 'white',
                padding: '14px 28px',
                borderRadius: '50px',
                textDecoration: 'none',
                fontWeight: 600,
                display: 'inline-block'
              }}>
                Create Biodata
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {biodatas.map((biodata) => (
                <div key={biodata.id} style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid #E5E7EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '12px',
                      background: isComplete(biodata) ? 'rgba(0,184,148,0.1)' : 'rgba(253,203,110,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px'
                    }}>
                      {isComplete(biodata) ? '✅' : '📝'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '18px', color: '#2D3436' }}>{biodata.name}</div>
                      <div style={{ fontSize: '14px', color: '#636E72' }}>
                        {biodata.template_name} • Created {biodata.created_at.split('T')[0]}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {isComplete(biodata) ? (
                      <>
                        <button 
                          onClick={() => handleDownload(biodata)}
                          style={{
                            background: '#0D5C63',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '8px',
                            fontWeight: 500,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                        >
                          📥 Download
                        </button>
                        <button 
                          onClick={() => handleShare(biodata)}
                          style={{
                            background: 'transparent',
                            color: '#0D5C63',
                            border: '1px solid #0D5C63',
                            padding: '10px 20px',
                            borderRadius: '8px',
                            fontWeight: 500,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                        >
                          🔗 Share
                        </button>
                      </>
                    ) : (
                      <Link href="/create/" style={{
                        background: 'linear-gradient(135deg, #E07B39 0%, #F4A261 100%)',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        fontWeight: 500,
                        textDecoration: 'none'
                      }}>
                        Continue Editing
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer style={{ 
        borderTop: '1px solid #E5E7EB', 
        padding: '24px',
        textAlign: 'center',
        color: '#636E72',
        fontSize: '14px'
      }}>
        <p>© {new Date().getFullYear()} Biodaat. Made with 💛 in India</p>
      </footer>
    </div>
  );
}
