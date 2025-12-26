'use client';

import { useState } from 'react';
import Link from 'next/link';
import api, { ApiError } from '@/lib/api';

type Step = 'phone' | 'otp' | 'success';

export default function LoginPage() {
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fullPhone = `+91${phone}`;

  const handleSendOtp = async () => {
    if (phone.length < 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await api.auth.sendOtp(fullPhone);
      setStep('otp');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        // For demo, move to OTP step anyway
        setStep('otp');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await api.auth.verifyOtp(fullPhone, otpCode);
      setStep('success');
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        window.location.href = '/dashboard/';
      }, 2000);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        // For demo with static OTP 123456
        if (otpCode === '123456') {
          setStep('success');
          setTimeout(() => {
            window.location.href = '/dashboard/';
          }, 2000);
        } else {
          setError('Invalid OTP. Try 123456 for demo.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FFF8F0 0%, #FFE4CC 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: "'Inter', 'Segoe UI', sans-serif"
    }}>
      <div style={{ 
        background: 'white',
        borderRadius: '32px',
        padding: '48px',
        maxWidth: '420px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(13,92,99,0.12)',
        textAlign: 'center'
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '32px' }}>
          <span style={{ fontSize: '32px', color: '#E07B39' }}>✦</span>
          <span style={{ fontSize: '28px', fontWeight: 700, color: '#0D5C63' }}>Biodaat</span>
        </Link>

        {/* Phone Input Step */}
        {step === 'phone' && (
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px', color: '#2D3436' }}>
              Welcome back
            </h1>
            <p style={{ color: '#636E72', marginBottom: '32px' }}>
              Enter your phone number to continue
            </p>
            
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: '#FFF8F0',
              borderRadius: '16px',
              padding: '16px 20px',
              marginBottom: '16px'
            }}>
              <span style={{ fontSize: '16px', fontWeight: 600, color: '#2D3436' }}>+91</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="Enter phone number"
                style={{
                  flex: 1,
                  border: 'none',
                  background: 'transparent',
                  fontSize: '16px',
                  outline: 'none',
                  color: '#2D3436'
                }}
              />
            </div>

            {error && (
              <p style={{ color: '#D63031', fontSize: '14px', marginBottom: '16px' }}>{error}</p>
            )}

            <button
              onClick={handleSendOtp}
              disabled={loading}
              style={{
                width: '100%',
                background: loading ? '#ccc' : 'linear-gradient(135deg, #E07B39 0%, #F4A261 100%)',
                color: 'white',
                padding: '16px',
                borderRadius: '50px',
                border: 'none',
                fontSize: '16px',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 15px rgba(224,123,57,0.3)'
              }}
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>

            <p style={{ marginTop: '24px', fontSize: '14px', color: '#636E72' }}>
              Don&apos;t have an account?{' '}
              <Link href="/create/" style={{ color: '#0D5C63', fontWeight: 600, textDecoration: 'none' }}>
                Create Biodata Free
              </Link>
            </p>
          </div>
        )}

        {/* OTP Verification Step */}
        {step === 'otp' && (
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px', color: '#2D3436' }}>
              Verify OTP
            </h1>
            <p style={{ color: '#636E72', marginBottom: '32px' }}>
              Enter the 6-digit code sent to {fullPhone}
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '24px' }}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  style={{
                    width: '48px',
                    height: '56px',
                    textAlign: 'center',
                    fontSize: '24px',
                    fontWeight: 600,
                    border: '2px solid #E5E7EB',
                    borderRadius: '12px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    color: '#2D3436'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#0D5C63'}
                  onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                />
              ))}
            </div>

            {error && (
              <p style={{ color: '#D63031', fontSize: '14px', marginBottom: '16px' }}>{error}</p>
            )}

            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              style={{
                width: '100%',
                background: loading ? '#ccc' : 'linear-gradient(135deg, #E07B39 0%, #F4A261 100%)',
                color: 'white',
                padding: '16px',
                borderRadius: '50px',
                border: 'none',
                fontSize: '16px',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 15px rgba(224,123,57,0.3)'
              }}
            >
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </button>

            <p style={{ marginTop: '24px', fontSize: '14px', color: '#636E72' }}>
              Didn&apos;t receive code?{' '}
              <button 
                onClick={() => { setOtp(['', '', '', '', '', '']); handleSendOtp(); }}
                style={{ color: '#0D5C63', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Resend OTP
              </button>
            </p>

            <button
              onClick={() => { setStep('phone'); setOtp(['', '', '', '', '', '']); setError(''); }}
              style={{ marginTop: '12px', color: '#636E72', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}
            >
              ← Change phone number
            </button>

            <div style={{ marginTop: '24px', padding: '16px', background: '#FFF8F0', borderRadius: '12px' }}>
              <p style={{ fontSize: '13px', color: '#636E72' }}>
                🔑 <strong>Demo OTP:</strong> 123456
              </p>
            </div>
          </div>
        )}

        {/* Success Step */}
        {step === 'success' && (
          <div>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px', color: '#2D3436' }}>
              Welcome!
            </h1>
            <p style={{ color: '#636E72', marginBottom: '24px' }}>
              Login successful. Redirecting to dashboard...
            </p>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              margin: '0 auto',
              border: '3px solid #E5E7EB',
              borderTopColor: '#0D5C63',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <style>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        )}
      </div>
    </div>
  );
}
