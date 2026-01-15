import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import '../styles/Timer.css';

const Timer = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [userTimes, setUserTimes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/');
    } else {
      // Fetch user's times
      const userData = JSON.parse(user);
      axios.get(`/times/${userData.id}`)
        .then((response) => {
          setUserTimes(response.data.reverse());
        })
        .catch((error) => {
          console.error('Error fetching times:', error);
        });
    }
  }, [navigate]);

  // Timer interval effect
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 0.01);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // Spacebar toggle timer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (isRunning) {
          // Stop timer
          setIsRunning(false);
        } else {
          // Start timer at 0
          setTime(0);
          setIsRunning(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isRunning]);

  const handleSignOut = () => {
    localStorage.clear();
    navigate('/');
  };

  const getUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  };

  const user = getUser();

  return (
    <div className="timer-container">
      {/* Top Navigation */}
      <nav className="timer-nav">
        <div className="nav-left">
          <h1 className="nav-title">Cube Timer</h1>
        </div>
        <div className="nav-right">
          <button className="nav-btn leaderboard-btn" onClick={() => navigate('/leaderboard')}>
            Leaderboard
          </button>
          <button className="nav-btn signout-btn" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </nav>

      {/* User Info */}
      {user && (
        <div className="user-info">
          Logged in as: <strong>{user.username}</strong>
        </div>
      )}

      {/* Main Content */}
      <div className="timer-content">
        {/* Timer Section */}
        <div className="timer-main">
          <div className="timer-display">{time.toFixed(2)}</div>
        </div>

        {/* Times List Section */}
        <div className="times-list-container">
          <h2 className="times-list-title">Your Times</h2>
          <div className="times-list">
            {userTimes.length > 0 ? (
              <table className="times-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {userTimes.map((record, index) => (
                    <tr key={record.id}>
                      <td>{userTimes.length - index}</td>
                      <td>{record.time.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-times-message">No times recorded yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timer;