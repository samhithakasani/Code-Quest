import { useState, useEffect } from 'react';
import api from '../services/api';
import Layout from '../components/Layout';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';

const emptyQ = { questionTitle: '', problemStatement: '', type: 'mcq', difficulty: 'easy', topic: '', options: ['', '', '', ''], correctAnswer: '', marks: 10, explanation: '' };

export default function AdminQuestions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyQ);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [filterDiff, setFilterDiff] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchQuestions = () => {
    const params = new URLSearchParams({ page, limit: 20 });
    if (filterDiff) params.set('difficulty', filterDiff);
    api.get(`/questions?${params}`).then(r => { setQuestions(r.data.questions); setTotal(r.data.total); }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchQuestions(); }, [page, filterDiff]);

  const openCreate = () => { setEditing(null); setForm(emptyQ); setShowForm(true); };
  const openEdit = (q) => {
    setEditing(q._id);
    setForm({ questionTitle: q.questionTitle, problemStatement: q.problemStatement, type: q.type, difficulty: q.difficulty, topic: q.topic || '', options: q.options?.length === 4 ? q.options : ['', '', '', ''], correctAnswer: q.correctAnswer || '', marks: q.marks, explanation: q.explanation || '' });
    setShowForm(true);
  };

  const updateOpt = (i, v) => { const o = [...form.options]; o[i] = v; setForm({ ...form, options: o }); };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    const payload = { ...form };
    if (form.type !== 'mcq') payload.options = [];
    try {
      if (editing) { await api.put(`/questions/${editing}`, payload); toast.success('Question updated!'); }
      else { await api.post('/questions', payload); toast.success('Question created!'); }
      setShowForm(false); fetchQuestions();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this question?')) return;
    try { await api.delete(`/questions/${id}`); toast.success('Deleted!'); fetchQuestions(); }
    catch { toast.error('Delete failed'); }
  };

  const filtered = questions.filter(q =>
    q.questionTitle?.toLowerCase().includes(search.toLowerCase()) || q.topic?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="admin-quizzes-page">
        <div className="aq-header">
          <div>
            <h1>❓ Question Bank</h1>
            <p>{total} questions total</p>
          </div>
          <button className="create-btn" onClick={openCreate}><Plus size={18} /> Add Question</button>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          <div className="search-wrap" style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={16} style={{ position: 'absolute', left: 14, color: '#4b5563' }} />
            <input style={{ width: '100%', padding: '11px 14px 11px 40px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: 'white', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }}
              placeholder="Search questions..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="filter-select-wrap">
            <Filter size={14} />
            <select value={filterDiff} onChange={e => { setFilterDiff(e.target.value); setPage(1); }}>
              <option value="">All Levels</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        {/* Modal Form */}
        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div className="modal-card" onClick={e => e.stopPropagation()}>
              <h2>{editing ? '✏️ Edit Question' : '➕ New Question'}</h2>
              <form onSubmit={handleSave} className="quiz-form">
                <div className="form-row">
                  <div className="form-field">
                    <label>Type</label>
                    <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                      <option value="mcq">MCQ</option>
                      <option value="code_output">Code Output</option>
                      <option value="coding_challenge">Coding Challenge</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label>Difficulty</label>
                    <select value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })}>
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-field">
                    <label>Topic</label>
                    <input value={form.topic} onChange={e => setForm({ ...form, topic: e.target.value })} placeholder="e.g. JavaScript" />
                  </div>
                  <div className="form-field">
                    <label>Marks</label>
                    <input type="number" min="1" max="100" value={form.marks} onChange={e => setForm({ ...form, marks: Number(e.target.value) })} />
                  </div>
                </div>
                <div className="form-field">
                  <label>Question Title *</label>
                  <input required value={form.questionTitle} onChange={e => setForm({ ...form, questionTitle: e.target.value })} placeholder="Short question title" />
                </div>
                <div className="form-field">
                  <label>Problem Statement</label>
                  <textarea rows={3} value={form.problemStatement} onChange={e => setForm({ ...form, problemStatement: e.target.value })} placeholder="Detailed problem description..." />
                </div>
                {form.type === 'mcq' && (
                  <>
                    <div className="form-field">
                      <label>Options (A / B / C / D)</label>
                      {form.options.map((opt, i) => (
                        <input key={i} style={{ marginBottom: 8 }} value={opt} onChange={e => updateOpt(i, e.target.value)} placeholder={`Option ${String.fromCharCode(65 + i)}`} />
                      ))}
                    </div>
                    <div className="form-field">
                      <label>Correct Answer *</label>
                      <select value={form.correctAnswer} onChange={e => setForm({ ...form, correctAnswer: e.target.value })}>
                        <option value="">Select correct answer</option>
                        {form.options.filter(o => o).map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                  </>
                )}
                {form.type === 'code_output' && (
                  <div className="form-field">
                    <label>Expected Output (Correct Answer) *</label>
                    <input required value={form.correctAnswer} onChange={e => setForm({ ...form, correctAnswer: e.target.value })} placeholder="e.g. 42 or true" />
                  </div>
                )}
                <div className="form-field">
                  <label>Explanation</label>
                  <textarea rows={2} value={form.explanation} onChange={e => setForm({ ...form, explanation: e.target.value })} placeholder="Explanation for the correct answer..." />
                </div>
                <div className="form-actions">
                  <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="btn-save" disabled={saving}>{saving ? 'Saving...' : (editing ? 'Update' : 'Create')}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="aq-table-wrap">
          <table className="aq-table">
            <thead>
              <tr><th>#</th><th>Question</th><th>Topic</th><th>Type</th><th>Difficulty</th><th>Marks</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map((q, i) => (
                <tr key={q._id}>
                  <td style={{ color: '#4b5563' }}>{(page - 1) * 20 + i + 1}</td>
                  <td className="qtitle">{q.questionTitle}</td>
                  <td><span className="tag-category">{q.topic || '–'}</span></td>
                  <td><span className="tag-category">{q.type === 'mcq' ? 'MCQ' : q.type === 'code_output' ? 'Code Output' : 'Challenge'}</span></td>
                  <td><span className={`quiz-diff diff-${q.difficulty}`}>{q.difficulty}</span></td>
                  <td style={{ color: '#a78bfa', fontWeight: 700 }}>{q.marks}pts</td>
                  <td>
                    <div className="action-btns">
                      <button className="icon-btn edit" onClick={() => openEdit(q)}><Edit2 size={15} /></button>
                      <button className="icon-btn del" onClick={() => handleDelete(q._id)}><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && !loading && <tr><td colSpan="7" className="no-data">No questions found.</td></tr>}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-cancel">← Prev</button>
          <span style={{ color: '#94a3b8', padding: '10px 14px' }}>Page {page} of {Math.ceil(total / 20)}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(total / 20)} className="btn-cancel">Next →</button>
        </div>
      </div>
    </Layout>
  );
}
