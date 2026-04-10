import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Layout from '../components/Layout';
import { BookOpen, Clock, Target, Search, Filter, ChevronDown } from 'lucide-react';
import './Quizzes.css';

export default function Quizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const params = new URLSearchParams({ limit: 50 });
    if (difficulty) params.set('difficulty', difficulty);
    if (category) params.set('category', category);
    api.get(`/quizzes?${params}`).then(r => setQuizzes(r.data.quizzes)).finally(() => setLoading(false));
  }, [difficulty, category]);

  const filtered = quizzes.filter(q =>
    q.title.toLowerCase().includes(search.toLowerCase()) ||
    q.category?.toLowerCase().includes(search.toLowerCase())
  );

  const categories = [...new Set(quizzes.map(q => q.category).filter(Boolean))];

  return (
    <Layout>
      <div className="quizzes-page">
        <div className="quizzes-header">
          <div>
            <h1>🎯 Quiz Library</h1>
            <p>{quizzes.length} quizzes across all topics and difficulties</p>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-bar">
          <div className="search-wrap">
            <Search size={16} className="search-icon" />
            <input placeholder="Search quizzes..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="filter-select-wrap">
            <Filter size={14} />
            <select value={difficulty} onChange={e => setDifficulty(e.target.value)}>
              <option value="">All Levels</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
              <option value="mixed">Mixed</option>
            </select>
            <ChevronDown size={14} />
          </div>
          <div className="filter-select-wrap">
            <BookOpen size={14} />
            <select value={category} onChange={e => setCategory(e.target.value)}>
              <option value="">All Topics</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown size={14} />
          </div>
        </div>

        {loading ? (
          <div className="page-loading"><span className="spinner-lg" /></div>
        ) : (
          <div className="quizzes-grid">
            {filtered.map(q => (
              <Link key={q._id} to={`/quiz/${q._id}`} className="quiz-big-card">
                <div className="qbc-top">
                  <div className={`quiz-diff diff-${q.difficulty}`}>{q.difficulty}</div>
                  <span className="qbc-category">{q.category}</span>
                </div>
                <h3>{q.title}</h3>
                <p>{q.description}</p>
                <div className="qbc-stats">
                  <div className="qbc-stat"><Clock size={14} /><span>{q.timeLimit} min</span></div>
                  <div className="qbc-stat"><BookOpen size={14} /><span>{q.questions?.length || 0} Questions</span></div>
                  <div className="qbc-stat"><Target size={14} /><span>{q.totalMarks} pts</span></div>
                </div>
                <div className="qbc-footer">
                  <span className="attempts-count">👥 {q.attempts || 0} attempts</span>
                  <span className="start-link">Start Quiz →</span>
                </div>
              </Link>
            ))}
            {filtered.length === 0 && (
              <div className="no-results"><p>No quizzes match your filters.</p></div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
