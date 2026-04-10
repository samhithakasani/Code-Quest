import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Clock, ChevronLeft, ChevronRight, Send, AlertTriangle } from 'lucide-react';
import './QuizAttempt.css';

export default function QuizAttempt() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [started, setStarted] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const startTime = useRef(Date.now());
  const timerRef = useRef(null);

  useEffect(() => {
    api.get(`/quizzes/${id}`).then(r => {
      setQuiz(r.data.quiz);
      setTimeLeft(r.data.quiz.timeLimit * 60);
    }).finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = useCallback(async (auto = false) => {
    if (submitting) return;
    setSubmitting(true);
    clearInterval(timerRef.current);
    const timeTaken = Math.round((Date.now() - startTime.current) / 1000);
    const answersArr = quiz.questions.map(q => ({
      questionId: q._id,
      userAnswer: answers[q._id] || '',
    }));
    try {
      const { data } = await api.post('/results/submit', { quizId: id, answers: answersArr, timeTaken });
      toast.dismiss('submitting');
      if (auto) toast('⏰ Time up! Auto-submitted.', { icon: '🕐' });
      else toast.success('🎉 Quiz submitted successfully! Redirecting to results...');
      navigate(`/result/${data.result._id}`);
    } catch (err) {
      toast.dismiss('submitting');
      toast.error('❌ Submission failed. Please try again.'); 
      setSubmitting(false);
    }
  }, [quiz, answers, id, navigate, submitting]);

  const handleShowConfirmDialog = () => {
    setShowConfirmDialog(true);
    // Prevent body scroll when dialog is open
    document.body.style.overflow = 'hidden';
  };

  const handleConfirmSubmit = () => {
    setShowConfirmDialog(false);
    document.body.style.overflow = 'unset';
    toast.loading('Submitting your quiz...', { id: 'submitting' });
    handleSubmit(false);
  };

  const handleCancelSubmit = () => {
    setShowConfirmDialog(false);
    document.body.style.overflow = 'unset';
  };

  useEffect(() => {
    if (!started || timeLeft <= 0) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); handleSubmit(true); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [started, handleSubmit]);

  // Cleanup body scroll on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (loading) return <div className="qa-loading"><span className="spinner-lg" /></div>;
  if (!quiz) return <div className="qa-loading"><p>Quiz not found</p></div>;

  const q = quiz.questions?.[current];
  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const secs = String(timeLeft % 60).padStart(2, '0');
  const answered = Object.keys(answers).length;
  const total = quiz.questions?.length || 0;
  const progress = (answered / total) * 100;
  const isLowTime = timeLeft < 60;

  if (!started) return (
    <div className="qa-start-screen">
      <div className="qa-start-card">
        <div className="qa-start-icon">🎯</div>
        <h1>{quiz.title}</h1>
        <p>{quiz.description}</p>
        <div className="qa-start-meta">
          <div className="meta-item"><Clock size={18} /><span>{quiz.timeLimit} minutes</span></div>
          <div className="meta-item">📝<span>{total} Questions</span></div>
          <div className="meta-item">🏆<span>{quiz.totalMarks} Points</span></div>
          <div className="meta-item">✅<span>Pass: {quiz.passingMarks} pts</span></div>
        </div>
        <div className="qa-rules">
          <h4>📋 Rules</h4>
          <ul>
            <li>Timer starts immediately upon clicking Start</li>
            <li>Quiz auto-submits when timer reaches 0</li>
            <li>You can navigate between questions freely</li>
            <li>Unanswered questions count as wrong</li>
          </ul>
        </div>
        <button className="qa-start-btn" onClick={() => { setStarted(true); startTime.current = Date.now(); }}>
          🚀 Start Quiz
        </button>
      </div>
    </div>
  );

  return (
    <div className="qa-page">
      {/* Top Bar */}
      <div className="qa-topbar">
        <div className="qa-title">{quiz.title}</div>
        <div className={`qa-timer ${isLowTime ? 'low' : ''}`}>
          <Clock size={16} /> {mins}:{secs}
          {isLowTime && <AlertTriangle size={14} />}
        </div>
        <div className="qa-progress-info">{answered}/{total} answered</div>
      </div>

      {/* Progress Bar */}
      <div className="qa-progress-bar"><div className="qa-progress-fill" style={{ width: `${progress}%` }} /></div>

      <div className="qa-body">
        {/* Question Navigator */}
        <div className="qa-sidebar">
          <p className="qa-nav-label">Questions</p>
          <div className="qa-nav-grid">
            {quiz.questions.map((question, i) => (
              <button key={question._id} onClick={() => setCurrent(i)}
                className={`qa-nav-btn ${i === current ? 'active' : ''} ${answers[question._id] ? 'answered' : ''}`}>
                {i + 1}
              </button>
            ))}
          </div>
          <div className="qa-legend">
            <span className="legend-answered">● Answered</span>
            <span className="legend-current">● Current</span>
            <span className="legend-unanswered">○ Unanswered</span>
          </div>
        </div>

        {/* Question Panel */}
        {q && (
          <div className="qa-main">
            <div className="qa-question-header">
              <span className="qa-qnum">Question {current + 1} of {total}</span>
              <div className="qa-badges">
                <span className={`diff-tag diff-${q.difficulty}`}>{q.difficulty}</span>
                <span className="marks-tag">+{q.marks} pts</span>
              </div>
            </div>
            <div className="qa-question-box">
              <h2>{q.questionTitle}</h2>
              {q.problemStatement && <p className="qa-problem">{q.problemStatement}</p>}
            </div>

            {/* MCQ Options */}
            {q.type === 'MCQ' && (
              <div className="qa-options">
                {q.options.map((opt, i) => (
                  <button key={i}
                    onClick={() => setAnswers(a => ({ ...a, [q._id]: opt }))}
                    className={`qa-option ${answers[q._id] === opt ? 'selected' : ''}`}>
                    <span className="opt-letter">{String.fromCharCode(65 + i)}</span>
                    <span>{opt}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Code Output / Short Answer */}
            {(q.type === 'code_output') && (
              <div className="qa-short-answer">
                <label>Your Answer:</label>
                <input type="text" placeholder="Type your answer..."
                  value={answers[q._id] || ''}
                  onChange={e => setAnswers(a => ({ ...a, [q._id]: e.target.value }))} />
              </div>
            )}

            {/* Navigation */}
            <div className="qa-nav-btns">
              <button onClick={() => setCurrent(c => Math.max(0, c - 1))} disabled={current === 0} className="qa-nav-btn-arrow">
                <ChevronLeft size={18} /> Previous
              </button>
              {current < total - 1
                ? <button onClick={() => setCurrent(c => c + 1)} className="qa-nav-btn-arrow next">
                    Next <ChevronRight size={18} />
                  </button>
                : <button onClick={handleShowConfirmDialog} disabled={submitting} className="qa-submit-btn">
                    <Send size={16} /> {submitting ? 'Submitting...' : 'Submit Quiz'}
                  </button>}
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="qa-confirm-overlay">
          <div className="qa-confirm-dialog">
            <div className="qa-confirm-header">
              <h3>🚨 Submit Quiz?</h3>
            </div>
            <div className="qa-confirm-body">
              <p>Are you sure you want to submit your quiz?</p>
              <div className="qa-confirm-stats">
                <div className="stat-item">
                  <span className="stat-label">Questions Answered:</span>
                  <span className="stat-value">{answered}/{total}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Time Remaining:</span>
                  <span className="stat-value">{mins}:{secs}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Unanswered Questions:</span>
                  <span className="stat-value warning">{total - answered}</span>
                </div>
              </div>
              <p className="qa-confirm-warning">
                ⚠️ Once submitted, you cannot change your answers.
              </p>
            </div>
            <div className="qa-confirm-footer">
              <button onClick={handleCancelSubmit} className="qa-confirm-btn cancel">
                Cancel
              </button>
              <button onClick={handleConfirmSubmit} className="qa-confirm-btn submit">
                Yes, Submit Quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
