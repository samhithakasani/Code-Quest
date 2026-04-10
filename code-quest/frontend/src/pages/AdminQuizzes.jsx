import { useState, useEffect } from 'react';
import api from '../services/api';
import Layout from '../components/Layout';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, Eye, EyeOff, BookOpen, Clock, Target } from 'lucide-react';
import './AdminQuizzes.css';

const emptyQuiz = { title: '', description: '', difficulty: 'easy', timeLimit: 30, category: '', isPublished: false, isRandomized: false };

export default function AdminQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyQuiz);
  const [saving, setSaving] = useState(false);

  const fetchQuizzes = () => {
    api.get('/quizzes/admin/all').then(r => setQuizzes(r.data.quizzes)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchQuizzes(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyQuiz); setShowForm(true); };
  const openEdit = (q) => { setEditing(q._id); setForm({ title: q.title, description: q.description, difficulty: q.difficulty, timeLimit: q.timeLimit, category: q.category || '', isPublished: q.isPublished, isRandomized: q.isRandomized }); setShowForm(true); };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editing) { await api.put(`/quizzes/${editing}`, form); toast.success('Quiz updated!'); }
      else { await api.post('/quizzes', form); toast.success('Quiz created!'); }
      setShowForm(false); fetchQuizzes();
    } catch (err) { toast.error(err.response?.data?.message || 'Error saving quiz'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this quiz?')) return;
    try { await api.delete(`/quizzes/${id}`); toast.success('Deleted!'); fetchQuizzes(); }
    catch (err) { toast.error('Delete failed'); }
  };

  const handlePublish = async (id) => {
    try { const { data } = await api.post(`/quizzes/${id}/publish`); toast.success(data.isPublished ? 'Published!' : 'Unpublished!'); fetchQuizzes(); }
    catch (err) { toast.error('Error'); }
  };

  return (
    <Layout>
      <div className="admin-quizzes-page">
        <div className="aq-header">
          <div>
            <h1>📝 Quiz Management</h1>
            <p>{quizzes.length} quizzes total</p>
          </div>
          <button className="create-btn" onClick={openCreate}><Plus size={18} /> Create Quiz</button>
        </div>

        {/* Modal Form */}
        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div className="modal-card" onClick={e => e.stopPropagation()}>
              <h2>{editing ? '✏️ Edit Quiz' : '➕ Create Quiz'}</h2>
              <form onSubmit={handleSave} className="quiz-form">
                <div className="form-row">
                  <div className="form-field">
                    <label>Quiz Title *</label>
                    <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. JavaScript Basics" />
                  </div>
                  <div className="form-field">
                    <label>Category</label>
                    <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="e.g. JavaScript" />
                  </div>
                </div>
                <div className="form-field">
                  <label>Description</label>
                  <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Brief description..." />
                </div>
                <div className="form-row">
                  <div className="form-field">
                    <label>Difficulty</label>
                    <select value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })}>
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                      <option value="mixed">Mixed</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label>Time Limit (minutes)</label>
                    <input type="number" min="5" max="180" value={form.timeLimit} onChange={e => setForm({ ...form, timeLimit: Number(e.target.value) })} />
                  </div>
                </div>
                <div className="form-checkboxes">
                  <label className="checkbox-label">
                    <input type="checkbox" checked={form.isPublished} onChange={e => setForm({ ...form, isPublished: e.target.checked })} />
                    Publish immediately
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" checked={form.isRandomized} onChange={e => setForm({ ...form, isRandomized: e.target.checked })} />
                    Randomize question order
                  </label>
                </div>
                <div className="form-actions">
                  <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="btn-save" disabled={saving}>{saving ? 'Saving...' : (editing ? 'Update Quiz' : 'Create Quiz')}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Quiz Table */}
        <div className="aq-table-wrap">
          <table className="aq-table">
            <thead>
              <tr><th>Title</th><th>Category</th><th>Difficulty</th><th>Time</th><th>Questions</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {quizzes.map(q => (
                <tr key={q._id}>
                  <td className="qtitle">{q.title}</td>
                  <td><span className="tag-category">{q.category || '–'}</span></td>
                  <td><span className={`quiz-diff diff-${q.difficulty}`}>{q.difficulty}</span></td>
                  <td><span className="qmeta"><Clock size={13} /> {q.timeLimit}m</span></td>
                  <td><span className="qmeta"><BookOpen size={13} /> {q.questions?.length || 0}</span></td>
                  <td>
                    <button className={`status-btn ${q.isPublished ? 'published' : 'draft'}`} onClick={() => handlePublish(q._id)}>
                      {q.isPublished ? <><Eye size={13} /> Published</> : <><EyeOff size={13} /> Draft</>}
                    </button>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="icon-btn edit" onClick={() => openEdit(q)} title="Edit"><Edit2 size={15} /></button>
                      <button className="icon-btn del" onClick={() => handleDelete(q._id)} title="Delete"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {quizzes.length === 0 && !loading && (
                <tr><td colSpan="7" className="no-data">No quizzes yet. Create one!</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
