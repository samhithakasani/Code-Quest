import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Layout from '../components/Layout';
import { Users, BookOpen, Target, TrendingUp, Award, Clock } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import './AdminDashboard.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function AdminDashboard() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [questionsData, setQuestionsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/results/analytics'),
      api.get('/results/questions')
    ]).then(([analyticsRes, questionsRes]) => {
      setAnalytics(analyticsRes.data.analytics);
      setQuestionsData(questionsRes.data);
    }).catch(err => {
      console.error('Failed to load admin data:', err);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <Layout><div className="page-loading"><span className="spinner-lg" /></div></Layout>;

  const stats = [
    { icon: <Users size={22} />, label: 'Total Students', value: analytics?.totalUsers || 0, color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)' },
    { icon: <BookOpen size={22} />, label: 'Total Quizzes', value: analytics?.totalQuizzes || 0, color: '#06b6d4', bg: 'rgba(6,182,212,0.15)' },
    { icon: <Target size={22} />, label: 'Total Attempts', value: analytics?.totalAttempts || 0, color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
    { icon: <TrendingUp size={22} />, label: 'Avg Score', value: `${analytics?.avgScore || 0}%`, color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
  ];

  return (
    <Layout>
      <div className="admin-dash-page">
        <div className="dash-header">
          <div>
            <h1>Welcome back, <span className="grad-text">{user?.name}</span> 👋</h1>
            <p>Monitor platform performance and manage student activity</p>
          </div>
        </div>

        <div className="stats-grid">
          {stats.map((s, i) => (
            <div key={i} className="stat-card" style={{ '--accent': s.color }}>
              <div className="stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
              <div className="stat-info">
                <p className="stat-value">{s.value}</p>
                <p className="stat-label">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Student Portal Upgrade - Rankings & Activity */}
        <div className="portal-section card">
          <div className="card-header-row">
            <h3><Award size={18} /> Student Performance Portal</h3>
            <div className="portal-chips">
              <span className="p-chip">Top Performers</span>
              <span className="p-chip">Active Now</span>
            </div>
          </div>
          
          <div className="portal-table-wrap">
            <table className="portal-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Student Info</th>
                  <th>Total Score</th>
                  <th>Quizzes</th>
                  <th>Last Active</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {analytics?.students?.map((s, idx) => (
                  <tr key={s._id}>
                    <td>
                      <div className={`rank-badge ${idx < 3 ? `rank-${idx + 1}` : ''}`}>
                        {idx + 1}
                      </div>
                    </td>
                    <td>
                      <div className="student-cell">
                        <div className="student-av">{s.name.charAt(0)}</div>
                        <div>
                          <p className="s-name">{s.name}</p>
                          <p className="s-email">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td><span className="s-score">{s.totalScore} pts</span></td>
                    <td><span className="s-count">{s.quizzesAttempted}</span></td>
                    <td className="s-time">
                      {s.lastLogin ? new Date(s.lastLogin).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Never'}
                    </td>
                    <td>
                      <span className={`s-status ${s.isActive ? 'active' : 'inactive'}`}>
                        {s.isActive ? 'Online' : 'Offline'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Questions Management Section */}
        <div className="admin-grid">
          <div className="card">
            <h3><BookOpen size={18} /> Questions Overview</h3>
            <div className="questions-stats">
              <div className="stat-row">
                <span className="stat-label">Total Questions:</span>
                <span className="stat-value">{questionsData?.summary?.totalQuestions || 0}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Paper Sets:</span>
                <span className="stat-value">{questionsData?.summary?.totalPaperSets || 0}</span>
              </div>
              <div className="topics-breakdown">
                <h4>Questions by Topic:</h4>
                {Object.entries(questionsData?.summary?.byTopic || {}).map(([topic, count]) => (
                  <div key={topic} className="topic-item">
                    <span className="topic-name">{topic}</span>
                    <span className="topic-count">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Paper Sets Overview */}
          <div className="card">
            <h3><Target size={18} /> Paper Sets</h3>
            <div className="paper-sets-list">
              {questionsData?.paperSets?.map(set => (
                <div key={set._id} className="paper-set-item">
                  <div className="set-info">
                    <h4>{set.name}</h4>
                    <p>{set.category} • {set.difficulty}</p>
                  </div>
                  <div className="set-stats">
                    <span className="question-count">{set.totalQuestions} questions</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="admin-grid">
          {/* Recent Activity */}
          <div className="card">
            <h3><Clock size={18} /> Recent Quiz Submissions</h3>
            <div className="admin-activity">
              {analytics?.recentResults?.map(r => (
                <div key={r._id} className="activity-row">
                  <div className="av-small">{r.userId?.name?.charAt(0) || '?'}</div>
                  <div className="activity-info">
                    <p className="activity-name">{r.userId?.name}</p>
                    <p className="activity-quiz">{r.paperSetId?.name || r.quizId?.title || 'Unknown Quiz'}</p>
                  </div>
                  <div className={`activity-score ${r.isPassed ? 'pass' : 'fail'}`}>{r.percentage}%</div>
                </div>
              ))}
              {(!analytics?.recentResults || analytics.recentResults.length === 0) && (
                <p className="empty-state">No submissions yet</p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h3><Award size={18} /> Administrative Hub</h3>
            <div className="quick-actions">
              <a href="/admin/quizzes" className="qa-action-btn">
                <span className="qa-icon">📝</span>
                <div><p>Modify Quizzes</p><span>Create & Edit content</span></div>
              </a>
              <a href="/admin/questions" className="qa-action-btn">
                <span className="qa-icon">❓</span>
                <div><p>Question Bank</p><span>Manage problems</span></div>
              </a>
              <a href="/admin/users" className="qa-action-btn">
                <span className="qa-icon">👥</span>
                <div><p>All Student Profiles</p><span>Detailed analytics</span></div>
              </a>
              <a href="/leaderboard" className="qa-action-btn">
                <span className="qa-icon">🏆</span>
                <div><p>Global Rankings</p><span>Across all categories</span></div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
