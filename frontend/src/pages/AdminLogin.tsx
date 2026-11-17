import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../hooks/useAdminStore';
import { ShieldCheck, Eye, EyeOff, Lock, Mail, AlertCircle, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAdminAuthenticated } = useAdminAuth();
  const navigate = useNavigate();

  // Render login form unconditionally so admin always verifies credentials when clicking login link

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate auth delay for premium feel
    await new Promise((r) => setTimeout(r, 800));

    const success = login(email, password);
    if (success) {
      toast.success('Welcome back, Admin! 🎉');
      navigate('/admin', { replace: true });
    } else {
      setError('Invalid email or password. Access denied.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0B1F3A 0%, #102a4a 40%, #0d3158 70%, #0B1F3A 100%)' }}>
      {/* Animated background particles */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: `${60 + i * 40}px`,
              height: `${60 + i * 40}px`,
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(36,184,166,${0.08 + i * 0.02}) 0%, transparent 70%)`,
              left: `${10 + i * 15}%`,
              top: `${15 + (i % 3) * 25}%`,
              animation: `float ${6 + i * 2}s ease-in-out infinite alternate`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Login Card */}
      <div style={{
        width: '100%',
        maxWidth: '440px',
        margin: '0 20px',
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '24px',
        padding: '48px 40px',
        position: 'relative',
        zIndex: 10,
        boxShadow: '0 25px 60px rgba(0,0,0,0.4), 0 0 80px rgba(36,184,166,0.06)',
      }}>
        {/* Logo & Title */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '18px',
            background: 'linear-gradient(135deg, #24B8A6 0%, #1a8f80 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 8px 30px rgba(36,184,166,0.3)',
          }}>
            <ShieldCheck style={{ width: '32px', height: '32px', color: 'white' }} />
          </div>
          <h1 style={{
            fontSize: '24px',
            fontWeight: 800,
            color: 'white',
            fontFamily: 'Inter, sans-serif',
            letterSpacing: '-0.5px',
            marginBottom: '8px',
          }}>
            Admin Portal
          </h1>
          <p style={{
            fontSize: '13px',
            color: 'rgba(255,255,255,0.45)',
            fontFamily: 'Inter, sans-serif',
          }}>
            Smart Choice Seller Central
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: '12px',
            padding: '12px 16px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <AlertCircle style={{ width: '16px', height: '16px', color: '#EF4444', flexShrink: 0 }} />
            <span style={{ fontSize: '13px', color: '#FCA5A5', fontFamily: 'Inter, sans-serif' }}>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Email */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: 'rgba(255,255,255,0.4)',
              marginBottom: '8px',
              fontFamily: 'Inter, sans-serif',
            }}>
              Admin Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '18px',
                height: '18px',
                color: 'rgba(255,255,255,0.25)',
              }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nirmalkumar00727@gmail.com"
                required
                style={{
                  width: '100%',
                  padding: '14px 16px 14px 44px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '14px',
                  color: 'white',
                  fontSize: '14px',
                  fontFamily: 'Inter, sans-serif',
                  outline: 'none',
                  transition: 'all 0.3s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(36,184,166,0.5)';
                  e.target.style.boxShadow = '0 0 20px rgba(36,184,166,0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: 'rgba(255,255,255,0.4)',
              marginBottom: '8px',
              fontFamily: 'Inter, sans-serif',
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '18px',
                height: '18px',
                color: 'rgba(255,255,255,0.25)',
              }} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                style={{
                  width: '100%',
                  padding: '14px 48px 14px 44px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '14px',
                  color: 'white',
                  fontSize: '14px',
                  fontFamily: 'Inter, sans-serif',
                  outline: 'none',
                  transition: 'all 0.3s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(36,184,166,0.5)';
                  e.target.style.boxShadow = '0 0 20px rgba(36,184,166,0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                }}
              >
                {showPassword ? (
                  <EyeOff style={{ width: '18px', height: '18px', color: 'rgba(255,255,255,0.35)' }} />
                ) : (
                  <Eye style={{ width: '18px', height: '18px', color: 'rgba(255,255,255,0.35)' }} />
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '16px',
              background: isLoading
                ? 'rgba(36,184,166,0.5)'
                : 'linear-gradient(135deg, #24B8A6 0%, #1a8f80 100%)',
              border: 'none',
              borderRadius: '14px',
              color: 'white',
              fontSize: '15px',
              fontWeight: 700,
              fontFamily: 'Inter, sans-serif',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              marginTop: '8px',
              boxShadow: '0 8px 30px rgba(36,184,166,0.25)',
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                (e.target as HTMLButtonElement).style.transform = 'translateY(-2px)';
                (e.target as HTMLButtonElement).style.boxShadow = '0 12px 40px rgba(36,184,166,0.35)';
              }
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
              (e.target as HTMLButtonElement).style.boxShadow = '0 8px 30px rgba(36,184,166,0.25)';
            }}
          >
            {isLoading ? (
              <>
                <div style={{
                  width: '18px',
                  height: '18px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: 'white',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }} />
                Authenticating...
              </>
            ) : (
              <>
                <Sparkles style={{ width: '18px', height: '18px' }} />
                Access Admin Portal
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <p style={{
          textAlign: 'center',
          fontSize: '11px',
          color: 'rgba(255,255,255,0.25)',
          marginTop: '28px',
          fontFamily: 'Inter, sans-serif',
        }}>
          Protected area · Smart Choice © 2024
        </p>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0) scale(1); }
          100% { transform: translateY(-30px) scale(1.1); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        input::placeholder {
          color: rgba(255,255,255,0.2) !important;
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;
