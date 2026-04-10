import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Code2, Mail, Lock, Eye, EyeOff, Zap, Shield } from 'lucide-react';
import './Auth.css';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}! 🚀`);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      toast.error(msg);
    } finally { setLoading(false); }
  };

  const fillAdmin = () => {
    setForm({ email: 'samhitha@gmail.com', password: 'samhitha@gmail.com' });
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
            <h1>CodeQuest</h1>
            <p>Your journey to coding mastery starts here. Multi-language quizzes with smart question randomization!</p>
            <div className="auth-features">
              <div className="feature-chip">💻 Multi-Language</div>
              <div className="feature-chip">📚 6 Paper Sets</div>
              <div className="feature-chip">🎲 Smart Questions</div>
              <div className="feature-chip">📊 Enhanced Results</div>
            </div>
            <div className="demo-btns">
              <p className="demo-label">Quick Admin Access:</p>
              <button className="demo-btn demo-btn-admin" onClick={fillAdmin}>
                <Shield size={14} /> Admin Login
              </button>
            </div>
          </div>
        </div>
        <div className="auth-right">
          <div className="auth-form-wrap">
            <h2>Welcome Back</h2>
            <p className="auth-subtitle">Sign in to continue your coding journey</p>
            <div className="auth-hint">
              🔒 <strong>New here?</strong> <Link to="/register">Create a free account</Link> before signing in!
            </div>
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="field-group">
                <label>Email Address</label>
                <div className="input-wrap">
                  <Mail size={17} className="input-icon" />
                  <input id="login-email" type="email" placeholder="you@example.com"
                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                </div>
              </div>
              <div className="field-group">
                <label>Password</label>
                <div className="input-wrap">
                  <Lock size={17} className="input-icon" />
                  <input id="login-password" type={showPass ? 'text' : 'password'} placeholder="••••••••"
                    value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                  <button type="button" className="eye-btn" onClick={() => setShowPass(!showPass)}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button id="login-submit" type="submit" className="auth-submit" disabled={loading}>
                {loading ? <span className="spinner" /> : <><Zap size={16} /> Sign In</>}
              </button>
            </form>
            <p className="auth-switch">Don't have an account? <Link to="/register">Register here →</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
