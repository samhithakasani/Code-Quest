import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Code2, Mail, Lock, User, Eye, EyeOff, Zap, GraduationCap, Shield } from 'lucide-react';

export default function Auth() {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.pathname === '/login');
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setIsLogin(location.pathname === '/login');
  }, [location.pathname]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const user = await login(form.email, form.password);
        toast.success(`Welcome back, ${user.name}! 🚀`);
        navigate(user.role === 'admin' ? '/admin' : '/dashboard');
      } else {
        const user = await register(form.name, form.email, form.password, form.role);
        toast.success(`Account created! Welcome, ${user.name}! 🎉`);
        navigate(user.role === 'admin' ? '/admin' : '/dashboard');
      }
    } catch (err) {
      const msg = err.response?.data?.message || (isLogin ? 'Login failed' : 'Registration failed');
      toast.error(msg);
    } finally { setLoading(false); }
  };

  const fillAdmin = () => {
    setForm({ ...form, email: 'samhitha@gmail.com', password: 'samhitha@gmail.com' });
  };

  return (
    <div className="auth-page">
      <style>{`
        .auth-page {
          min-height: 100vh; display: flex;
          align-items: center; justify-content: center;
          background: #080b14; position: relative; overflow: hidden;
          font-family: 'Inter', sans-serif; color: white;
        }

        .auth-bg { position: absolute; inset: 0; z-index: 0; }
        .bg-orb {
          position: absolute; border-radius: 50%;
          filter: blur(80px); opacity: 0.35;
        }
        .orb1 { width: 500px; height: 500px; background: radial-gradient(circle, #8b5cf6, transparent); top: -100px; left: -100px; animation: float 8s ease-in-out infinite; }
        .orb2 { width: 400px; height: 400px; background: radial-gradient(circle, #06b6d4, transparent); bottom: -80px; right: -80px; animation: float 10s ease-in-out infinite reverse; }
        .orb3 { width: 300px; height: 300px; background: radial-gradient(circle, #ec4899, transparent); top: 40%; left: 40%; animation: float 12s ease-in-out infinite; }

        @keyframes float { 0%,100% { transform: translate(0,0); } 50% { transform: translate(20px,-20px); } }

        .auth-card {
          position: relative; z-index: 1;
          display: flex; width: 950px; max-width: 95vw;
          background: rgba(15,12,41,0.85);
          border: 1px solid rgba(139,92,246,0.2);
          border-radius: 24px; overflow: hidden;
          backdrop-filter: blur(20px);
          box-shadow: 0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(139,92,246,0.1);
          transition: all 0.5s ease;
        }

        .auth-left {
          flex: 1; padding: 48px 40px;
          background: linear-gradient(135deg, rgba(139,92,246,0.15), rgba(6,182,212,0.08));
          border-right: 1px solid rgba(139,92,246,0.15);
          display: flex; align-items: center;
        }

        .auth-left-content { color: white; }
        .auth-logo {
          width: 64px; height: 64px; border-radius: 16px;
          background: linear-gradient(135deg, #8b5cf6, #06b6d4);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 20px; color: white;
          box-shadow: 0 8px 25px rgba(139,92,246,0.4);
        }
        .auth-left h1 { font-size: 2rem; font-weight: 800; margin-bottom: 12px; }
        .auth-left p { color: #94a3b8; font-size: 1rem; line-height: 1.6; margin-bottom: 24px; }

        .auth-features { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 32px; }
        .feature-chip {
          padding: 8px 14px; border-radius: 20px;
          background: rgba(139,92,246,0.15);
          border: 1px solid rgba(139,92,246,0.25);
          color: #c4b5fd; font-size: 0.85rem; font-weight: 500;
        }

        .demo-btns { display: flex; flex-direction: column; gap: 10px; margin-top: 10px; }
        .demo-label { color: #64748b; font-size: 0.8rem; margin-bottom: 4px; }
        .demo-btn {
          padding: 10px 16px; border-radius: 8px; font-size: 0.85rem; font-weight: 600;
          border: 1px solid rgba(239,68,68,0.4); background: rgba(239,68,68,0.1);
          color: #f87171; cursor: pointer; transition: all 0.2s;
          display: flex; align-items: center; gap: 8px; width: fit-content;
        }
        .demo-btn:hover { background: rgba(239,68,68,0.2); transform: translateY(-1px); }

        .auth-right { flex: 1.2; padding: 48px 50px; display: flex; align-items: center; background: rgba(255,255,255,0.02); }
        .auth-form-wrap { width: 100%; }
        .auth-form-wrap h2 { font-size: 1.8rem; font-weight: 800; color: white; margin-bottom: 8px; }
        .auth-subtitle { color: #64748b; font-size: 0.9rem; margin-bottom: 30px; }

        .role-selector { display: flex; gap: 12px; margin-bottom: 24px; }
        .role-btn {
          flex: 1; padding: 12px; border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.03);
          color: #64748b; cursor: pointer; font-size: 0.9rem; font-weight: 600;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: all 0.2s;
        }
        .role-btn.active { background: rgba(139,92,246,0.2); border-color: #8b5cf6; color: #a78bfa; }

        .auth-form { display: flex; flex-direction: column; gap: 20px; }
        .field-group { display: flex; flex-direction: column; gap: 8px; }
        .field-group label { font-size: 0.8rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; }

        .input-wrap { position: relative; display: flex; align-items: center; }
        .input-icon { position: absolute; left: 16px; color: #4b5563; }
        .input-wrap input {
          width: 100%; padding: 14px 16px 14px 48px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px; color: white; font-size: 0.95rem;
          transition: all 0.2s; outline: none; box-sizing: border-box;
        }
        .input-wrap input:focus { border-color: #8b5cf6; background: rgba(139,92,246,0.07); box-shadow: 0 0 0 4px rgba(139,92,246,0.15); }
        .input-wrap input::placeholder { color: #4b5563; }

        .eye-btn { position: absolute; right: 16px; background: none; border: none; color: #4b5563; cursor: pointer; padding: 6px; display: flex; }
        .eye-btn:hover { color: #94a3b8; }

        .auth-submit {
          padding: 16px; border-radius: 12px; font-size: 1rem; font-weight: 700;
          border: none; cursor: pointer; margin-top: 8px;
          background: linear-gradient(135deg, #8b5cf6, #06b6d4);
          color: white; display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 6px 25px rgba(139,92,246,0.4);
        }
        .auth-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 35px rgba(139,92,246,0.6); filter: brightness(1.1); }
        .auth-submit:active:not(:disabled) { transform: translateY(0); }
        .auth-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        .auth-switch-text { text-align: center; margin-top: 24px; color: #64748b; font-size: 0.9rem; }
        .auth-toggle-btn { 
          background: none; border: none; color: #a78bfa; font-weight: 700; 
          cursor: pointer; padding: 0 4px; font-size: inherit; transition: color 0.2s;
        }
        .auth-toggle-btn:hover { color: #c4b5fd; text-decoration: underline; }

        .spinner {
          width: 20px; height: 20px; border: 3px solid rgba(255,255,255,0.3);
          border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 850px) {
          .auth-card { flex-direction: column; width: 450px; }
          .auth-left { padding: 40px; border-right: none; border-bottom: 1px solid rgba(139,92,246,0.15); }
          .auth-right { padding: 40px; }
        }
      `}</style>

      <div className="auth-bg">
        <div className="bg-orb orb1" />
        <div className="bg-orb orb2" />
        <div className="bg-orb orb3" />
      </div>

      <div className="auth-card">
        <div className="auth-left">
          <div className="auth-left-content">
            <div className="auth-logo"><Code2 size={36} /></div>
            <h1>{isLogin ? 'Welcome Back' : 'Join CodeQuest'}</h1>
            <p>
              {isLogin 
                ? 'Your journey to coding mastery starts here. Multi-language quizzes with smart randomization!' 
                : 'Create your account and start mastering coding with 1000+ questions and live analytics.'}
            </p>
            
            <div className="auth-features">
              {isLogin ? (
                <>
                  <div className="feature-chip">💻 Multi-Language</div>
                  <div className="feature-chip">📚 6 Paper Sets</div>
                  <div className="feature-chip">🎲 Smart Questions</div>
                  <div className="feature-chip">📊 Enhanced Results</div>
                </>
              ) : (
                <>
                  <div className="feature-chip">🧠 AI Difficulty</div>
                  <div className="feature-chip">🎖️ Certificates</div>
                  <div className="feature-chip">🔥 Streaks</div>
                  <div className="feature-chip">👥 Community</div>
                </>
              )}
            </div>

            {isLogin && (
              <div className="demo-btns">
                <p className="demo-label">Quick Admin Access:</p>
                <button className="demo-btn" onClick={fillAdmin}>
                  <Shield size={16} /> Admin Stealth Login
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-form-wrap">
            <h2>{isLogin ? 'Sign In' : 'Create Account'}</h2>
            <p className="auth-subtitle">
              {isLogin ? 'Enter your credentials to continue' : 'Start your coding quest today'}
            </p>

            {!isLogin && (
              <div className="role-selector">
                <button type="button" 
                  className={`role-btn ${form.role === 'student' ? 'active' : ''}`}
                  onClick={() => setForm({ ...form, role: 'student' })}>
                  <GraduationCap size={20} /> Student
                </button>
                <button type="button" 
                  className={`role-btn ${form.role === 'admin' ? 'active' : ''}`}
                  onClick={() => setForm({ ...form, role: 'admin' })}>
                  <Shield size={20} /> Admin
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              {!isLogin && (
                <div className="field-group">
                  <label>Full Name</label>
                  <div className="input-wrap">
                    <User size={18} className="input-icon" />
                    <input type="text" placeholder="John Doe"
                      value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                  </div>
                </div>
              )}

              <div className="field-group">
                <label>Email Address</label>
                <div className="input-wrap">
                  <Mail size={18} className="input-icon" />
                  <input type="email" placeholder="you@example.com"
                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                </div>
              </div>

              <div className="field-group">
                <label>Password</label>
                <div className="input-wrap">
                  <Lock size={18} className="input-icon" />
                  <input type={showPass ? 'text' : 'password'} placeholder="••••••••"
                    value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                  <button type="button" className="eye-btn" onClick={() => setShowPass(!showPass)}>
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? <span className="spinner" /> : <><Zap size={18} /> {isLogin ? 'Sign In' : 'Sign Up'}</>}
              </button>
            </form>

            <p className="auth-switch-text">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button className="auth-toggle-btn" onClick={() => navigate(isLogin ? '/register' : '/login')}>
                {isLogin ? 'Create one here →' : 'Sign in here →'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
