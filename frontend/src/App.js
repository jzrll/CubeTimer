import { Routes, Route } from 'react-router';

import './App.css';

import Login from './pages/Login'
import CreateAccount from './pages/CreateAccount'
import Leaderboard from './pages/Leaderboard'
import Timer from './pages/Timer'


const baseURL = 'http://localhost:5000/';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/create" element={<CreateAccount />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/timer" element={<Timer />} />
      </Routes>
    </div>
  );
}

export default App;
