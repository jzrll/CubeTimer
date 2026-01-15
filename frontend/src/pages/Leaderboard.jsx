import { useEffect, useState } from 'react'
import axios from 'axios';

const Leaderboard = () => {
  const [times, setTimes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimes = async () => {
      try {
        const res = await axios.get('/times');
        setTimes(res.data);
      } catch (error) {
        console.error('Error fetching times:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTimes();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {times.map(time => (
        <div key={time.id}>
          User {time.user_id} — {time.time}s
        </div>
      ))}
    </div>
  );
};

export default Leaderboard;
