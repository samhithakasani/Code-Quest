import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Layout from '../components/Layout';
import {
  Users, BookOpen, Target, TrendingUp, Award, Clock,
  CheckCircle, BarChart2, UserPlus, Star, ChevronUp, ChevronDown
} from 'lucide-react';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [studentSort, setStudentSort] = useState({ key: 'registeredAt', dir: 'desc' });
  const [studentSearch, setStudentSearch] = useState('');

  useEffect(() => {
    api.get('/results/analytics')
      .then(r => setAnalytics(r.data.analytics))
      .catch(err => console.error('Failed to load admin data:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <Layout>
      <div className="page-loading">
        <span className="spinner-lg" />
        <p style={{ color: '#64748b', marginTop: 16 }}>Loading dashboard...</p>
      </div>
    </Layout>
  );

  // Summary stat cards
  const statCards = [
    {
      icon: <UserPlus size={22} />, label: 'Registered Students',
      value: analytics?.totalUsers || 0, sub: 'Total enrolled',
      color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)'
    },
    {
      icon: <Target size={22} />, label: 'Quiz Attempts',
      value: analytics?.totalAttempts || 0, sub: 'Across all quizzes',
      color: '#f59e0b', bg: 'rgba(245,158,11,0.15)'
    },
    {
      icon: <TrendingUp size={22} />, label: 'Avg Score',
      value: `${analytics?.avgScore || 0}%`, sub: 'Platform average',
      color: '#06b6d4', bg: 'rgba(6,182,212,0.15)'
    },
    {
      icon: <CheckCircle size={22} />, label: 'Pass Rate',
      value: `${analytics?.passRate || 0}%`, sub: `${analytics?.totalPassed || 0} passed`,
      color: '#10b981', bg: 'rgba(16,185,129,0.15)'
    },
    {
      icon: <BookOpen size={22} />, label: 'Total Quizzes',
      value: analytics?.totalQuizzes || 0, sub: 'Published content',
      color: '#ec4899', bg: 'rgba(236,72,153,0.15)'
    },
    {
      icon: <BarChart2 size={22} />, label: 'Questions Bank',
      value: analytics?.totalQuestions || 0, sub: 'MCQ & coding',
      color: '#f97316', bg: 'rgba(249,115,22,0.15)'
    },
  ];

  // Score distribution bar widths
  const maxDist = Math.max(...(analytics?.scoreDist?.map(d => d.count) || [1]), 1);
  const distColors = ['#ef4444', '#f97316', '#f59e0b', '#06b6d4', '#10b981'];

  // Student table logic
  const handleSort = (key) => {
    setStudentSort(prev => ({ key, dir: prev.key === key && prev.dir === 'asc' ? 'desc' : 'asc' }));
  };
  const sortedStudents = [...(analytics?.students || [])].sort((a, b) => {
    const va = a[studentSort.key] ?? 0;
    const vb = b[studentSort.key] ?? 0;
    const cmp = typeof va === 'string' ? va.localeCompare(vb) : va - vb;
    return studentSort.dir === 'asc' ? cmp : -cmp;
  }).filter(s =>
    !studentSearch ||
    s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.email.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const SortIcon = ({ col }) => {
    if (studentSort.key !== col) return <span className="sort-neutral">↕</span>;
    return studentSort.dir === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />;
  };

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
  const fmtTime = (d) => d ? new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Never';

  return (
    <Layout>
      <div className="admin-dash-page">

        {/* Header */}
        <div className="dash-header">
          <div>
            <h1>Welcome back, <span className="grad-text">{user?.name}</span> 👋</h1>
            <p>Monitor platform performance — registrations, quiz attempts & student marks</p>
          </div>
          <div className="dash-date">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>

        {/* 6 Stat Cards */}
        <div className="stats-grid-6">
          {statCards.map((s, i) => (
            <div key={i} className="stat-card" style={{ '--accent': s.color }}>
              <div className="stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
              <div className="stat-info">
                <p className="stat-value">{s.value}</p>
                <p className="stat-label">{s.label}</p>
                <p className="stat-sub">{s.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Row: Score Distribution + Top Quizzes + Recent Registrations */}
        <div className="dash-row-3">

          {/* Score Distribution */}
          <div className="card">
            <h3><BarChart2 size={18} /> Score Distribution</h3>
            <p className="card-sub">How students are scoring across all quizzes</p>
            <div className="score-dist">
              {(analytics?.scoreDist || []).map((d, i) => (
                <div key={i} className="dist-row">
                  <span className="dist-label">{d.label}</span>
                  <div className="dist-bar-wrap">
                    <div
                      className="dist-bar"
                      style={{ width: `${(d.count / maxDist) * 100}%`, background: distColors[i] }}
                    />
                  </div>
                  <span className="dist-count" style={{ color: distColors[i] }}>{d.count}</span>
                </div>
              ))}
              {(!analytics?.scoreDist || analytics.scoreDist.every(d => d.count === 0)) && (
                <p className="empty-state">No quiz attempts yet</p>
              )}
            </div>
          </div>

          {/* Top Quizzes */}
          <div className="card">
            <h3><Star size={18} /> Top Quizzes</h3>
            <p className="card-sub">Most attempted quizzes on the platform</p>
            <div className="top-quizzes">
              {(analytics?.topQuizzes || []).length === 0 && (
                <p className="empty-state">No quiz attempts recorded yet</p>
              )}
              {(analytics?.topQuizzes || []).map((q, i) => (
                <div key={i} className="top-quiz-row">
                  <div className="tq-rank">{i + 1}</div>
                  <div className="tq-info">
                    <p className="tq-title">{q.title}</p>
                    <p className="tq-cat">{q.category}</p>
                  </div>
                  <div className="tq-stats">
                    <span className="tq-attempts">{q.attempts} attempts</span>
                    <span className="tq-avg">{q.avgScore}% avg</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Quiz Submissions */}
          <div className="card">
            <h3><Clock size={18} /> Recent Submissions</h3>
            <p className="card-sub">Latest quiz attempts by students</p>
            <div className="admin-activity">
              {(analytics?.recentResults || []).map(r => (
                <div key={r._id} className="activity-row">
                  <div className="av-small">{r.userId?.name?.charAt(0) || '?'}</div>
                  <div className="activity-info">
                    <p className="activity-name">{r.userId?.name || 'Unknown'}</p>
                    <p className="activity-quiz">{r.paperSetId?.name || r.quizId?.title || 'Unknown Quiz'}</p>
                  </div>
                  <div className="act-right">
                    <div className={`activity-score ${r.isPassed ? 'pass' : 'fail'}`}>{r.percentage}%</div>
                    <div className="act-marks">{r.score}/{r.totalMarks} pts</div>
                  </div>
                </div>
              ))}
              {(!analytics?.recentResults || analytics.recentResults.length === 0) && (
                <p className="empty-state">No submissions yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Full Registered Students Table */}
        <div className="card students-section">
          <div className="students-header">
            <div>
              <h3><Users size={18} /> Registered Students</h3>
              <p className="card-sub">{analytics?.students?.length || 0} students registered · Showing marks, attempts & registration date</p>
            </div>
            <input
              className="student-search"
              placeholder="🔍 Search by name or email..."
              value={studentSearch}
              onChange={e => setStudentSearch(e.target.value)}
            />
          </div>

          <div className="portal-table-wrap">
            <table className="portal-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th className="sort-th" onClick={() => handleSort('name')}>Student <SortIcon col="name" /></th>
                  <th className="sort-th" onClick={() => handleSort('registeredAt')}>Registered <SortIcon col="registeredAt" /></th>
                  <th className="sort-th" onClick={() => handleSort('quizzesAttempted')}>Attempts <SortIcon col="quizzesAttempted" /></th>
                  <th className="sort-th" onClick={() => handleSort('totalMarksEarned')}>Marks Earned <SortIcon col="totalMarksEarned" /></th>
                  <th className="sort-th" onClick={() => handleSort('avgPercentage')}>Avg Score <SortIcon col="avgPercentage" /></th>
                  <th className="sort-th" onClick={() => handleSort('highestScore')}>Best Score <SortIcon col="highestScore" /></th>
                  <th className="sort-th" onClick={() => handleSort('passedCount')}>Passed <SortIcon col="passedCount" /></th>
                  <th>Last Active</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {sortedStudents.length === 0 && (
                  <tr><td colSpan={10} className="empty-state">No students found</td></tr>
                )}
                {sortedStudents.map((s, idx) => {
                  const passRate = s.quizzesAttempted > 0
                    ? Math.round((s.passedCount / s.quizzesAttempted) * 100)
                    : 0;
                  return (
                    <tr key={s._id}>
                      <td><span className="row-num">{idx + 1}</span></td>
                      <td>
                        <div className="student-cell">
                          <div className="student-av">{s.name.charAt(0).toUpperCase()}</div>
                          <div>
                            <p className="s-name">{s.name}</p>
                            <p className="s-email">{s.email}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="reg-date">{fmtDate(s.registeredAt)}</span>
                      </td>
                      <td>
                        <div className="attempt-badge">
                          <span className="att-num">{s.quizzesAttempted}</span>
                          {s.quizzesAttempted > 0 && <span className="att-label">quizzes</span>}
                        </div>
                      </td>
                      <td>
                        <div className="marks-cell">
                          <span className="marks-earned">{s.totalMarksEarned}</span>
                          {s.totalMarksPossible > 0 && (
                            <span className="marks-possible">/ {s.totalMarksPossible}</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="avg-cell">
                          <div className="avg-bar-wrap">
                            <div
                              className="avg-bar"
                              style={{
                                width: `${s.avgPercentage}%`,
                                background: s.avgPercentage >= 60 ? '#10b981' : s.avgPercentage >= 40 ? '#f59e0b' : '#ef4444'
                              }}
                            />
                          </div>
                          <span className="avg-pct">{s.avgPercentage}%</span>
                        </div>
                      </td>
                      <td>
                        <span className="best-score" style={{
                          color: s.highestScore >= 80 ? '#10b981' : s.highestScore >= 60 ? '#f59e0b' : '#94a3b8'
                        }}>
                          {s.highestScore > 0 ? `${s.highestScore}%` : '—'}
                        </span>
                      </td>
                      <td>
                        <div className="pass-cell">
                          <span className="pass-num">{s.passedCount}</span>
                          {s.quizzesAttempted > 0 && (
                            <span className="pass-rate">({passRate}%)</span>
                          )}
                        </div>
                      </td>
                      <td className="s-time">{fmtTime(s.lastLogin)}</td>
                      <td>
                        <span className={`s-status ${s.isActive ? 'active' : 'inactive'}`}>
                          {s.isActive ? '● Active' : '○ Inactive'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3><Award size={18} /> Administrative Hub</h3>
          <div className="quick-actions">
            <a href="/admin/quizzes" className="qa-action-btn">
              <span className="qa-icon">📝</span>
              <div><p>Manage Quizzes</p><span>Create & Edit content</span></div>
            </a>
            <a href="/admin/questions" className="qa-action-btn">
              <span className="qa-icon">❓</span>
              <div><p>Question Bank</p><span>Add & manage questions</span></div>
            </a>
            <a href="/leaderboard" className="qa-action-btn">
              <span className="qa-icon">🏆</span>
              <div><p>Leaderboard</p><span>Global rankings</span></div>
            </a>
          </div>
        </div>

      </div>
    </Layout>
  );
}
