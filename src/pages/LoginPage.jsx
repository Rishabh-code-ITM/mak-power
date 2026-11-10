import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, User, Phone, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { STORE_INFO } from '../services/mockData';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: ''
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    try {
      if (isRegistering) {
        if (!formData.fullName || !formData.email || !formData.password) {
          throw new Error('Please fill all required fields.');
        }
        const res = await register(formData);
        if (!res.success) throw new Error(res.error || 'Registration failed.');
      } else {
        if (!formData.email || !formData.password) {
          throw new Error('Please enter email and password.');
        }
        const res = await login(formData.email, formData.password);
        if (!res.success) throw new Error(res.error || 'Login failed.');
      }
      navigate('/account');
    } catch (err) {
      setErrorMsg(err.message || 'Authentication error.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickDemoLogin = (role) => {
    if (role === 'admin') {
      login('admin@makpower.com', 'admin123').then(() => navigate('/admin'));
    } else {
      login('customer@makpower.com', 'pass123').then(() => navigate('/account'));
    }
  };

  return (
    <div className="container" style={{ padding: '60px 20px', maxWidth: '440px' }}>
      
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '30px', boxShadow: 'var(--shadow-md)' }}>
        
        {/* Brand header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <img src={STORE_INFO.logoImage} alt="MAK POWER" style={{ width: '50px', height: '50px', margin: '0 auto 10px', objectFit: 'contain' }} />
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 900, color: 'var(--secondary)' }}>
            {isRegistering ? 'Create MAK POWER Account' : 'Welcome Back to MAK POWER'}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {isRegistering ? 'Sign up to manage orders and track shipments' : 'Log in to access your orders and saved addresses'}
          </p>
        </div>

        {errorMsg && (
          <div style={{ padding: '10px 14px', background: '#fee2e2', border: '1px solid #f87171', color: '#b91c1c', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', marginBottom: '16px' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {isRegistering && (
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Kumar"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Email Address *</label>
            <input
              type="email"
              required
              placeholder="e.g. yourname@gmail.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}
            />
          </div>

          {isRegistering && (
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Mobile Number</label>
              <input
                type="tel"
                placeholder="10-digit mobile"
                maxLength={10}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Password *</label>
            <input
              type="password"
              required
              placeholder="Enter password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={submitting} style={{ marginTop: '10px' }}>
            <span>{submitting ? 'Please wait...' : isRegistering ? 'Sign Up' : 'Log In'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Toggle Register / Login */}
        <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.88rem' }}>
          {isRegistering ? (
            <span>
              Already have an account?{' '}
              <button onClick={() => setIsRegistering(false)} style={{ color: 'var(--primary)', fontWeight: 700 }}>
                Log in here
              </button>
            </span>
          ) : (
            <span>
              New to MAK POWER?{' '}
              <button onClick={() => setIsRegistering(true)} style={{ color: 'var(--primary)', fontWeight: 700 }}>
                Create an account
              </button>
            </span>
          )}
        </div>

        {/* Quick Demo Access Bar */}
        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
            ⚡ 1-Click Demo Login Shortcuts:
          </span>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <button
              onClick={() => handleQuickDemoLogin('customer')}
              className="btn btn-secondary btn-sm"
            >
              Customer Demo
            </button>
            <button
              onClick={() => handleQuickDemoLogin('admin')}
              className="btn btn-dark btn-sm"
            >
              Admin Demo
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
