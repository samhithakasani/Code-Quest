import { useState, useEffect } from 'react';
import api from '../services/api';
import Layout from '../components/Layout';
import { Trophy, Medal, Clock, Target } from 'lucide-react';
import './Leaderboard.css';

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/results/leaderboard?limit=50').then(r => setLeaders(r.data.leaders)).finally(() => setLoading(false));
  }, []);

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <Layout>
      <div className="lb-page">
        <div className="lb-header">
          <h1><Trophy size={28} /> Leaderboard</h1>
          <p>Top performers across all quizzes</p>
        </div>

        {/* Top 3 Podium */}
        {leaders.length >= 3 && (
          <div className="podium">
            {[1, 0, 2].map(i => (
              <div key={i} className={`podium-slot rank-${i + 1}`}>
                <div className="podium-avatar">{leaders[i]?.userId?.name?.charAt(0) || '?'}</div>
                <p className="podium-name">{leaders[i]?.userId?.name || 'Unknown'}</p>
                <p className="podium-score">{leaders[i]?.score} pts</p>
                <div className="podium-medal">{medals[i]}</div>
                <div className="podium-block">{i === 0 ? '🥈 2nd' : i === 1 ? '🥇 1st' : '🥉 3rd'}</div>
              </div>
            ))}
          </div>
        )}

        {/* Full Table */}
        <div className="lb-table-wrap">
          <table className="lb-table">
            <thead>
              <tr>
                <th>Rank</th><th>Player</th><th>Quiz</th>
                <th><Target size={14} /> Score</th>
                <th><Clock size={14} /> Time</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {leaders.map((l, i) => (
                <tr key={l._id} className={i < 3 ? 'top-row' : ''}>
                  <td className="rank-cell">
                    {i < 3 ? medals[i] : <span className="rank-num">#{i + 1}</span>}
                  </td>
                  <td>
                    <div className="player-cell">
                      <div className="player-av">{l.userId?.name?.charAt(0) || '?'}</div>
                      <span>{l.userId?.name || 'Unknown'}</span>
                    </div>
                  </td>
                  <td className="quiz-cell">{l.quizId?.title || '–'}</td>
                  <td><span className="score-pill">{l.score}</span></td>
                  <td className="time-cell">{Math.floor(l.timeTaken / 60)}m {l.timeTaken % 60}s</td>
                  <td className="date-cell">{new Date(l.submittedAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {leaders.length === 0 && !loading && (
                <tr><td colSpan="6" className="no-data">No results yet. Be the first to take a quiz!</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
