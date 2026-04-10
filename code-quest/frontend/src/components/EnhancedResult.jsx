import { useState } from 'react';
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
  Target
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function EnhancedResult({ result }) {
  const navigate = useNavigate();
  const [showAnswers, setShowAnswers] = useState(false);

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-100';
    if (percentage >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const handleRetakeQuiz = () => {
    if (result.percentage < (result.paperSetId?.passingMarks || 40)) {
      navigate('/paper-sets');
      toast.success('You can retake the quiz with new questions!');
    } else {
      toast.error('You have already passed this quiz!');
    }
  };

  const handleDownloadResult = () => {
    const resultText = `
Quiz Result - ${result.paperSetId?.name || 'Quiz'}
Score: ${result.score}/${result.totalMarks} (${result.percentage}%)
Status: ${result.isPassed ? 'PASSED' : 'FAILED'}
Time Taken: ${formatTime(result.timeTaken)}
Attempt: ${result.attemptNumber}

Answer Summary:
${result.answers.map((answer, index) => `
Question ${index + 1}: ${answer.isCorrect ? 'Correct' : 'Incorrect'}
Your Answer: ${answer.userAnswer}
Correct Answer: ${answer.correctAnswer}
${answer.explanation ? `Explanation: ${answer.explanation}` : ''}
`).join('\n')}
    `;

    const blob = new Blob([resultText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quiz-result-${Date.now()}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Result downloaded successfully!');
  };

  const handleShareResult = async () => {
    const shareText = `I scored ${result.percentage}% in ${result.paperSetId?.name || 'Quiz'} on CodeQuest! 🎯`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'CodeQuest Quiz Result',
          text: shareText,
        });
      } catch (error) {
        toast.error('Failed to share result');
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(shareText);
      toast.success('Result copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Quiz Result</h1>
          <p className="text-gray-600">{result.paperSetId?.name || 'Quiz'}</p>
        </div>

        {/* Score Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${getScoreBgColor(result.percentage)} mb-6`}>
              {result.isPassed ? (
                <Trophy className="w-12 h-12 text-green-600" />
              ) : (
                <Target className="w-12 h-12 text-red-600" />
              )}
            </div>
            
            <h2 className={`text-5xl font-bold mb-2 ${getScoreColor(result.percentage)}`}>
              {result.percentage}%
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              {result.score} out of {result.totalMarks} marks
            </p>
            
            <div className={`inline-flex items-center px-6 py-3 rounded-full text-lg font-medium ${
              result.isPassed 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {result.isPassed ? '🎉 PASSED' : '❌ FAILED'}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Clock className="w-6 h-6 text-gray-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Time Taken</p>
              <p className="font-semibold">{formatTime(result.timeTaken)}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <BookOpen className="w-6 h-6 text-gray-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Questions</p>
              <p className="font-semibold">{result.answers.length}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Correct</p>
              <p className="font-semibold text-green-600">
                {result.answers.filter(a => a.isCorrect).length}
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Incorrect</p>
              <p className="font-semibold text-red-600">
                {result.answers.filter(a => !a.isCorrect).length}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <button
            onClick={() => setShowAnswers(!showAnswers)}
            className={`flex items-center gap-2 px-8 py-4 rounded-lg transition-all transform hover:scale-105 shadow-lg ${
              showAnswers 
                ? 'bg-gray-600 hover:bg-gray-700 text-white' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
            }`}
          >
            <Eye className="w-5 h-5" />
            {showAnswers ? 'Hide Answers' : '📚 View All Answers'}
          </button>
          
          <button
            onClick={handleDownloadResult}
            className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
          
          <button
            onClick={handleShareResult}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
          
          {!result.isPassed && (
            <button
              onClick={handleRetakeQuiz}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Retake Quiz
            </button>
          )}
        </div>

        {!showAnswers && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Eye className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700 font-medium">
                Click "View All Answers" to see detailed solutions and explanations
              </span>
            </div>
          </div>
        )}

        {/* Detailed Answers */}
        {showAnswers && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">📚 Detailed Answer Review</h3>
              <p className="text-gray-600">Review your answers and learn from explanations</p>
            </div>
            
            {/* Answer Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-green-700 font-medium">Correct Answers</p>
                <p className="text-2xl font-bold text-green-800">
                  {result.answers.filter(a => a.isCorrect).length}
                </p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <p className="text-sm text-red-700 font-medium">Incorrect Answers</p>
                <p className="text-2xl font-bold text-red-800">
                  {result.answers.filter(a => !a.isCorrect).length}
                </p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-blue-700 font-medium">Learning Opportunities</p>
                <p className="text-2xl font-bold text-blue-800">
                  {result.answers.filter(a => !a.isCorrect && a.explanation).length}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {result.answers.map((answer, index) => (
                <div key={index} className="border-b pb-6 last:border-b-0">
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      answer.isCorrect ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {answer.isCorrect ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">
                          Question {index + 1}
                        </h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          answer.isCorrect 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {answer.isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                      </div>
                      
                      {answer.questionTitle && (
                        <div className="mb-3">
                          <p className="font-medium text-gray-900">{answer.questionTitle}</p>
                        </div>
                      )}
                      
                      {/* Show MCQ Options if available */}
                      {answer.options && answer.options.length > 0 && (
                        <div className="mb-3 space-y-2">
                          <p className="text-sm font-medium text-gray-700">Options:</p>
                          <div className="space-y-1">
                            {answer.options.map((option, optIndex) => {
                              const isUserAnswer = option === answer.userAnswer;
                              const isCorrectAnswer = option === answer.correctAnswer;
                              const optionLetter = String.fromCharCode(65 + optIndex);
                              
                              return (
                                <div 
                                  key={optIndex}
                                  className={`flex items-center gap-2 p-2 rounded text-sm ${
                                    isCorrectAnswer 
                                      ? 'bg-green-100 text-green-800 border border-green-300' 
                                      : isUserAnswer 
                                        ? 'bg-red-100 text-red-800 border border-red-300'
                                        : 'bg-gray-50 text-gray-700'
                                  }`}
                                >
                                  <span className="font-medium">{optionLetter}.</span>
                                  <span>{option}</span>
                                  {isCorrectAnswer && <span className="ml-auto text-green-600">✓</span>}
                                  {isUserAnswer && !isCorrectAnswer && <span className="ml-auto text-red-600">✗</span>}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Your Answer: </span>
                          <span className={answer.isCorrect ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                            {answer.userAnswer || 'Not answered'}
                          </span>
                        </div>
                        
                        {!answer.isCorrect && answer.correctAnswer && (
                          <div>
                            <span className="font-medium text-gray-700">Correct Answer: </span>
                            <span className="text-green-600 font-medium">{answer.correctAnswer}</span>
                          </div>
                        )}
                        
                        {answer.explanation && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <span className="font-medium text-blue-700">💡 Explanation: </span>
                            <p className="text-blue-600 mt-1">{answer.explanation}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
