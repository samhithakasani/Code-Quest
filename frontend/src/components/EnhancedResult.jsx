import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Trophy, 
  BookOpen, 
  RotateCcw,
  Download,
  Share2,
  Eye,
  Target,
  ChevronDown,
  ChevronUp,
  Star
} from 'lucide-react';
import toast from 'react-hot-toast';
import './EnhancedResult.css';

export default function EnhancedResult({ result }) {
  const navigate = useNavigate();
  const [showAnswers, setShowAnswers] = useState(false);
  const [stars, setStars] = useState([]);

  // Generate stars for sprinkle effect
  useEffect(() => {
    if (result.isPassed) {
      const newStars = Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        top: Math.random() * 100 + '%',
        left: Math.random() * 100 + '%',
        size: Math.random() * 4 + 2 + 'px',
        delay: Math.random() * 3 + 's',
        duration: Math.random() * 2 + 2 + 's'
      }));
      setStars(newStars);
    }
  }, [result.isPassed]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const handleRetakeQuiz = () => {
    navigate('/quizzes');
    toast.success('Try another quiz to boost your score!');
  };

  const handleDownloadResult = () => {
    const resultText = `
    CODEQUEST QUIZ RESULT
    ====================
    Quiz: ${result.quizId?.title || result.paperSetId?.name || 'Quiz'}
    Score: ${result.score}/${result.totalMarks} (${result.percentage}%)
    Status: ${result.isPassed ? 'PASSED' : 'FAILED'}
    Time Taken: ${formatTime(result.timeTaken)}
    Date: ${new Date(result.submittedAt).toLocaleString()}
    
    DETAILED REVIEW:
    ${result.answers.map((ans, i) => `
    Q${i + 1}: ${ans.questionTitle || 'Question ' + (i+1)}
    Status: ${ans.isCorrect ? 'CORRECT' : 'WRONG'}
    Marks: ${ans.marksObtained}
    Your Answer: ${ans.userAnswer}
    Correct Answer: ${ans.correctAnswer}
    ${ans.explanation ? `Explanation: ${ans.explanation}` : ''}
    `).join('\n')}
    `;

    const blob = new Blob([resultText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Result_${result.quizId?.title || 'Quiz'}.txt`;
    a.click();
    toast.success('Full report downloaded! 📄');
  };

  const handleShareResult = () => {
    const text = `🎯 I just scored ${result.percentage}% on the ${result.quizId?.title || 'CodeQuest'} quiz! Can you beat my score? 🚀 #CodeQuest #CodingMastery`;
    if (navigator.share) {
      navigator.share({ title: 'My Quiz Result', text });
    } else {
      navigator.clipboard.writeText(text);
      toast.success('Bragging rights copied to clipboard! 📋');
    }
  };

  return (
    <div className="enhanced-result-page">
      {/* Star Sprinkle Effect */}
      {result.isPassed && (
        <div className="star-sprinkle">
          {stars.map(star => (
            <div 
              key={star.id} 
              className="star" 
              style={{
                top: star.top,
                left: star.left,
                width: star.size,
                height: star.size,
                animationDelay: star.delay,
                animationDuration: star.duration
              }}
            />
          ))}
        </div>
      )}

      <div className="result-container">
        {/* Hero Card */}
        <div className="result-hero">
          <div className="trophy-container">
            {result.isPassed ? (
              <Trophy size={60} color="#fbbf24" strokeWidth={1.5} />
            ) : (
              <Target size={60} color="#ef4444" strokeWidth={1.5} />
            )}
          </div>
          
          <h1 className="grad-text">Quiz Complete!</h1>
          <div className="score-text">{result.percentage}%</div>
          <p className="res-subtitle">{result.score} out of {result.totalMarks} marks obtained</p>
          
          <div className={`status-badge ${result.isPassed ? 'passed' : 'failed'}`}>
            {result.isPassed ? '🎉 PASSED' : '❌ FAILED'}
          </div>

          {/* Core Stats */}
          <div className="stats-grid">
            <div className="stat-box">
              <Clock size={24} />
              <div className="label">Time Taken</div>
              <div className="value">{formatTime(result.timeTaken)}</div>
            </div>
            <div className="stat-box">
              <BookOpen size={24} />
              <div className="label">Questions</div>
              <div className="value">{result.answers.length}</div>
            </div>
            <div className="stat-box">
              <CheckCircle size={24} color="#10b981" />
              <div className="label">Correct</div>
              <div className="value">{result.answers.filter(a => a.isCorrect).length}</div>
            </div>
            <div className="stat-box">
              <XCircle size={24} color="#ef4444" />
              <div className="label">Incorrect</div>
              <div className="value">{result.answers.filter(a => !a.isCorrect).length}</div>
            </div>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="result-actions">
          <button className="action-btn btn-primary" onClick={() => setShowAnswers(!showAnswers)}>
            <Eye size={20} />
            {showAnswers ? 'Hide Review' : 'Detailed Review'}
          </button>
          
          <button className="action-btn btn-secondary" onClick={handleRetakeQuiz}>
            <RotateCcw size={20} />
            Retake Quiz
          </button>
          
          <button className="action-btn btn-secondary" onClick={handleDownloadResult}>
            <Download size={20} />
          </button>
          
          <button className="action-btn btn-secondary" onClick={handleShareResult}>
            <Share2 size={20} />
          </button>
        </div>

        {/* Answer Review Section */}
        {showAnswers && (
          <div className="review-card">
            <h2>Detailed Answer Review</h2>
            <p>Go through every question and see where you excelled or missed</p>
            
            <div className="answers-list">
              {result.answers.map((ans, idx) => (
                <div key={idx} className="answer-item">
                  <div className="answer-header">
                    <span className="q-num">Question {idx + 1}</span>
                    <span className={`q-status ${ans.isCorrect ? 'correct' : 'wrong'}`}>
                      {ans.isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                  
                  <div className="q-title">{ans.questionTitle || 'Quiz Question'}</div>
                  
                  {ans.options && ans.options.length > 0 && (
                    <div className="options-list">
                      {ans.options.map((opt, oIdx) => {
                        const isCorrect = opt === ans.correctAnswer;
                        const isUserSelect = opt === ans.userAnswer;
                        let className = "option-pill";
                        if (isCorrect) className += " correct-ans";
                        if (isUserSelect && !isCorrect) className += " user-ans-wrong";
                        
                        return (
                          <div key={oIdx} className={className}>
                            <span className="opt-marker">{String.fromCharCode(65+oIdx)}</span>
                            {opt}
                            {isCorrect && <CheckCircle size={14} style={{marginLeft: 'auto'}}/>}
                            {isUserSelect && !isCorrect && <XCircle size={14} style={{marginLeft: 'auto'}}/>}
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {!ans.options?.length && (
                    <div className="fallback-ans">
                      <p><b>Your Answer:</b> <span className={ans.isCorrect ? 'text-green' : 'text-red'}>{ans.userAnswer || 'N/A'}</span></p>
                      {!ans.isCorrect && <p><b>Correct Answer:</b> <span style={{color: '#10b981'}}>{ans.correctAnswer}</span></p>}
                    </div>
                  )}

                  {ans.explanation && (
                    <div className="explanation-box">
                      <b>💡 Explanation:</b> {ans.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
