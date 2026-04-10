import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { Radar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, CategoryScale, LinearScale } from 'chart.js';
import { Trophy, BookOpen, Target, TrendingUp, Clock, CheckCircle, XCircle, ArrowRight, Flame, FileText } from 'lucide-react';
import Layout from '../components/Layout';
import './Dashboard.css';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, CategoryScale, LinearScale);

export default function Dashboard() {
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/results/my'), api.get('/quizzes?limit=6')])
      .then(([r, q]) => { setResults(r.data.results); setQuizzes(q.data.quizzes); })
      .finally(() => setLoading(false));
  }, []);

  const avgScore = results.length ? Math.round(results.reduce((a, r) => a + r.percentage, 0) / results.length) : 0;
  const bestScore = results.length ? Math.max(...results.map(r => r.percentage)) : 0;
  const passed = results.filter(r => r.isPassed).length;

  // Chart data
  const scoreHistory = results.slice(0, 8).reverse();
  const lineData = {
    labels: scoreHistory.map((_, i) => `Quiz ${i + 1}`),
    datasets: [{
      label: 'Score %', data: scoreHistory.map(r => r.percentage),
      borderColor: '#8b5cf6', backgroundColor: 'rgba(139,92,246,0.1)',
      tension: 0.4, fill: true, pointBackgroundColor: '#8b5cf6', pointRadius: 5,
    }],
  };

  const stats = [
    { icon: <BookOpen size={22} />, label: 'Quizzes Taken', value: results.length, color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)' },
    { icon: <Target size={22} />, label: 'Avg Score', value: `${avgScore}%`, color: '#06b6d4', bg: 'rgba(6,182,212,0.15)' },
    { icon: <Trophy size={22} />, label: 'Best Score', value: `${bestScore}%`, color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
    { icon: <CheckCircle size={22} />, label: 'Passed', value: passed, color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
  ];

  if (loading) return <Layout><div className="page-loading"><span className="spinner-lg" /></div></Layout>;

  return (
    <Layout>
      <div className="dashboard-page">
        {/* Header */}
        <div className="dash-header">
          <div>
            <h1>Welcome back, <span className="grad-text">{user?.name?.split(' ')[0]}</span> 👋</h1>
            <p>Ready for your next coding challenge?</p>
          </div>
          <div className="flex gap-3">
            <Link to="/quizzes" className="cta-btn"><Flame size={18} /> Start a Quiz <ArrowRight size={16} /></Link>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          {stats.map((s, i) => (
            <div key={i} className="stat-card" style={{ '--accent': s.color, '--accent-bg': s.bg }}>
              <div className="stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
              <div className="stat-info">
                <p className="stat-value">{s.value}</p>
                <p className="stat-label">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="dash-grid">
          {/* Score Chart */}
          <div className="card chart-card">
            <h3><TrendingUp size={18} /> Score History</h3>
            {scoreHistory.length > 0
              ? <Line data={lineData} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { min: 0, max: 100, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b' } }, x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b' } } } }} />
              : <div className="empty-chart"><p>Complete quizzes to see your progress!</p></div>
            }
          </div>

          {/* Recent Results */}
          <div className="card">
            <h3><Clock size={18} /> Recent Attempts</h3>
            <div className="result-list">
              {results.slice(0, 5).map(r => (
                <div key={r._id} className="result-item">
                  <div className="result-meta">
                    <p className="result-title">{r.quizId?.title || 'Quiz'}</p>
                    <p className="result-date">{new Date(r.submittedAt).toLocaleDateString()}</p>
                  </div>
                  <div className="result-score">
                    <span className={`score-badge ${r.isPassed ? 'pass' : 'fail'}`}>
                      {r.isPassed ? <CheckCircle size={13} /> : <XCircle size={13} />} {r.percentage}%
                    </span>
                  </div>
                </div>
              ))}
              {results.length === 0 && <p className="empty-state">No attempts yet. <Link to="/quizzes">Take a quiz!</Link></p>}
            </div>
          </div>
        </div>

        {/* Available Quizzes */}
        <div className="card">
          <div className="card-header-row">
            <h3><BookOpen size={18} /> Available Quizzes</h3>
            <Link to="/quizzes" className="see-all">See all →</Link>
          </div>
          <div className="quiz-grid">
            {quizzes.map(q => (
              <Link key={q._id} to={`/quiz/${q._id}`} className="quiz-card">
                <div className={`quiz-diff diff-${q.difficulty}`}>{q.difficulty}</div>
                <h4>{q.title}</h4>
                <p>{q.description}</p>
                <div className="quiz-meta">
                  <span><Clock size={13} /> {q.timeLimit}m</span>
                  <span><BookOpen size={13} /> {q.questions?.length || 0} Qs</span>
                  <span><Target size={13} /> {q.totalMarks} pts</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
