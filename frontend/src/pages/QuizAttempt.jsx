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
  const [userTimer, setUserTimer] = useState(30); // Default minutes
  const startTime = useRef(Date.now());
  const timerRef = useRef(null);

  useEffect(() => {
    api.get(`/quizzes/${id}`).then(r => {
      setQuiz(r.data.quiz);
      setTimeLeft(r.data.quiz.timeLimit * 60);
      setUserTimer(r.data.quiz.timeLimit);
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
      else toast.success('🎉 Quiz submitted successfully!');
      navigate(`/result/${data.result._id}`);
    } catch (err) {
      toast.dismiss('submitting');
      toast.error('❌ Submission failed. Please try again.'); 
      setSubmitting(false);
    }
  }, [quiz, answers, id, navigate, submitting]);

  const handleStart = () => {
    setTimeLeft(userTimer * 60);
    setStarted(true);
    startTime.current = Date.now();
  };

  const handleShowConfirmDialog = () => {
    setShowConfirmDialog(true);
    document.body.style.overflow = 'hidden';
  };

  const handleConfirmSubmit = () => {
    setShowConfirmDialog(false);
    document.body.style.overflow = 'unset';
    toast.loading('Submitting...', { id: 'submitting' });
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

  useEffect(() => { return () => { document.body.style.overflow = 'unset'; }; }, []);

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
        <div className="qa-start-header">
          <div className="qa-start-icon">🎯</div>
          <div className="qa-start-title">
            <h1>{quiz.title}</h1>
            <p className="qa-cat-badge">{quiz.category} • {quiz.difficulty}</p>
          </div>
        </div>
        <p className="qa-desc">{quiz.description}</p>
        <div className="qa-start-meta">
          <div className="meta-item"><Clock size={16} /><span>Default: {quiz.timeLimit}m</span></div>
          <div className="meta-item">📝<span>{total} Qs</span></div>
          <div className="meta-item">🏆<span>{quiz.totalMarks} pts</span></div>
          <div className="meta-item">✅<span>Pass: {quiz.passingMarks}</span></div>
        </div>

        <div className="qa-timer-config">
          <div className="timer-config-header">
            <h4>⏱️ Set Your Own Timer</h4>
            <span className="timer-value">{userTimer} minutes</span>
          </div>
          <input 
            type="range" min="1" max={Math.max(120, quiz.timeLimit * 2)} 
            value={userTimer} 
            onChange={e => setUserTimer(Number(e.target.value))} 
            className="timer-range"
          />
          <p className="timer-hint">Challenge yourself with a custom time limit!</p>
        </div>

        <div className="qa-rules">
          <h4>📋 Quiz Rules</h4>
          <ul>
            <li>Timer starts as soon as you click <b>"🚀 Start Now"</b></li>
            <li>Questions are randomized for every attempt</li>
            <li>Unanswered questions count as 0 marks</li>
            <li>You can navigate back and forth easily</li>
          </ul>
        </div>
        <button className="qa-start-btn" onClick={handleStart}>🚀 Start Now</button>
      </div>
    </div>
  );

  return (
    <div className="qa-page">
      <div className="qa-topbar">
        <div className="qa-title">{quiz.title}</div>
        <div className={`qa-timer ${isLowTime ? 'low' : ''}`}>
          <Clock size={16} /> {mins}:{secs}
          {isLowTime && <AlertTriangle size={14} />}
        </div>
        <div className="qa-progress-info">{answered}/{total} answered</div>
      </div>
      <div className="qa-progress-bar"><div className="qa-progress-fill" style={{ width: `${progress}%` }} /></div>
      <div className="qa-body">
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
        </div>
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
            {q.type === 'MCQ' && (
              <div className="qa-options">
                {q.options.map((opt, i) => (
                  <button key={i} onClick={() => setAnswers(a => ({ ...a, [q._id]: opt }))}
                    className={`qa-option ${answers[q._id] === opt ? 'selected' : ''}`}>
                    <span className="opt-letter">{String.fromCharCode(65 + i)}</span>
                    <span>{opt}</span>
                  </button>
                ))}
              </div>
            )}
            {q.type === 'code_output' && (
              <div className="qa-short-answer">
                <label>Your Answer:</label>
                <input type="text" placeholder="Type here..." value={answers[q._id] || ''}
                  onChange={e => setAnswers(a => ({ ...a, [q._id]: e.target.value }))} />
              </div>
            )}
            <div className="qa-nav-btns">
              <button onClick={() => setCurrent(c => Math.max(0, c - 1))} disabled={current === 0} className="qa-nav-btn-arrow">
                <ChevronLeft size={18} /> Previous
              </button>
              {current < total - 1
                ? <button onClick={() => setCurrent(c => c + 1)} className="qa-nav-btn-arrow next">Next <ChevronRight size={18} /></button>
                : <button onClick={handleShowConfirmDialog} disabled={submitting} className="qa-submit-btn"><Send size={16} /> Submit Quiz</button>}
            </div>
          </div>
        )}
      </div>

      {showConfirmDialog && (
        <div className="qa-confirm-overlay">
          <div className="qa-confirm-dialog">
            <div className="qa-confirm-header"><h3>🚨 Submit Quiz?</h3></div>
            <div className="qa-confirm-body">
              <p>Ready to finalize? Submitting will end your attempt.</p>
              <div className="qa-confirm-stats">
                <div className="stat-item"><span>Done:</span><span>{answered}/{total}</span></div>
                <div className="stat-item"><span>Time:</span><span>{mins}:{secs}</span></div>
              </div>
            </div>
            <div className="qa-confirm-footer">
              <button onClick={handleCancelSubmit} className="qa-confirm-btn cancel">Cancel</button>
              <button onClick={handleConfirmSubmit} className="qa-confirm-btn submit">Yes, Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
