import { useEffect, useState } from 'react'
import axios from 'axios';
import '../styles/Leaderboard.css';

const Leaderboard = () => {
  const [times, setTimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTimes = async () => {
      try {
        const res = await axios.get('/times');
        console.log('Fetched times:', res.data);
        setTimes(res.data);
      } catch (err) {
        setError('Failed to load leaderboard');
        console.error('Error fetching times:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTimes();
  }, []);

  const sortedTimes = [...times].sort((a, b) => a.time - b.time);

  if (loading) return (
    <div className="leaderboard-container">
      <div className="loading">Loading leaderboard...</div>
    </div>
  );

  if (error) return (
    <div className="leaderboard-container">
      <div className="error-message">{error}</div>
    </div>
  );

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <h1>⏱ Leaderboard</h1>
        <p className="leaderboard-subtitle">Fastest Times</p>
      </div>

      {sortedTimes.length === 0 ? (
        <div className="empty-state">
          <p>No times recorded yet. Be the first to solve!</p>
        </div>
      ) : (
        <div className="leaderboard-table-wrapper">
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th className="rank">Rank</th>
                <th className="solver">Solver</th>
                <th className="time">Time</th>
                <th className="date">Date</th>
              </tr>
            </thead>
            <tbody>
              {sortedTimes.map((time, index) => (
                <tr key={time.id} className={index < 3 ? `rank-${index + 1}` : ''}>
                  <td className="rank">
                    {index < 3 && (
                      <span className="medal">
                        {index === 0 && '🥇'}
                        {index === 1 && '🥈'}
                        {index === 2 && '🥉'}
                      </span>
                    )}
                    {index + 1}
                  </td>
                  <td className="solver">{time.username}</td>
                  <td className="time"><strong>{parseFloat(time.time).toFixed(2)}s</strong></td>
                  <td className="date">{new Date(time.created_at).toLocaleDateString()} {new Date(time.created_at).toLocaleTimeString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
