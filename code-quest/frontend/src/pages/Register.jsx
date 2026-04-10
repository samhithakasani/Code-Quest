import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Code2, Mail, Lock, User, Eye, EyeOff, Zap, GraduationCap, Shield } from 'lucide-react';
import './Auth.css';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await register(form.name, form.email, form.password, form.role);
      toast.success(`Account created! Welcome, ${user.name}! 🎉`);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="bg-orb orb1" /><div className="bg-orb orb2" /><div className="bg-orb orb3" />
      </div>
      <div className="auth-card">
        <div className="auth-left">
          <div className="auth-left-content">
            <div className="auth-logo"><Code2 size={36} /></div>
            <h1>Join CodeQuest</h1>
            <p>Create your account and start mastering coding with 1000+ questions, live competitions and analytics.</p>
            <div className="auth-features">
              <div className="feature-chip">🧠 AI Difficulty</div>
              <div className="feature-chip">🎖️ Certificates</div>
              <div className="feature-chip">🔥 Streaks</div>
              <div className="feature-chip">👥 Community</div>
            </div>
          </div>
        </div>
        <div className="auth-right">
          <div className="auth-form-wrap">
            <h2>Create Account</h2>
            <p className="auth-subtitle">Start your coding quest today</p>
            <div className="role-selector">
              <button type="button" id="role-student"
                className={`role-btn ${form.role === 'student' ? 'active' : ''}`}
                onClick={() => setForm({ ...form, role: 'student' })}>
                <GraduationCap size={18} /> Student
              </button>
              <button type="button" id="role-admin"
                className={`role-btn ${form.role === 'admin' ? 'active' : ''}`}
                onClick={() => setForm({ ...form, role: 'admin' })}>
                <Shield size={18} /> Admin
              </button>
            </div>
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="field-group">
                <label>Full Name</label>
                <div className="input-wrap">
                  <User size={17} className="input-icon" />
                  <input id="reg-name" type="text" placeholder="John Doe"
                    value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
              </div>
              <div className="field-group">
                <label>Email Address</label>
                <div className="input-wrap">
                  <Mail size={17} className="input-icon" />
                  <input id="reg-email" type="email" placeholder="you@example.com"
                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                </div>
              </div>
              <div className="field-group">
                <label>Password</label>
                <div className="input-wrap">
                  <Lock size={17} className="input-icon" />
                  <input id="reg-password" type={showPass ? 'text' : 'password'} placeholder="Min. 6 characters"
                    value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                  <button type="button" className="eye-btn" onClick={() => setShowPass(!showPass)}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button id="reg-submit" type="submit" className="auth-submit" disabled={loading}>
                {loading ? <span className="spinner" /> : <><Zap size={16} /> Create Account</>}
              </button>
            </form>
            <p className="auth-switch">Already have an account? <Link to="/login">Sign in →</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
