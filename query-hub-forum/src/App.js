import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AskQuestion from './pages/AskQuestion';
import QuestionDetail from './pages/QuestionDetail';
import Profile from './pages/Profile';
import MyQuestions from './pages/MyQuestions';
import Leaderboard from './pages/Leaderboard';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/ask-question" element={<AskQuestion />} />
              <Route path="/question/:id" element={<QuestionDetail />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/my-questions" element={<MyQuestions />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;