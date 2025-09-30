import React, { useState, useEffect } from 'react';

const Leaderboard = () => {
  const [students, setStudents] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [activeTab, setActiveTab] = useState('students');

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    const studentUsers = users
      .filter(user => user.role === 'student')
      .sort((a, b) => b.points - a.points);
    
    const mentorUsers = users
      .filter(user => user.role === 'mentor')
      .sort((a, b) => b.points - a.points);
    
    setStudents(studentUsers);
    setMentors(mentorUsers);
  };

  const getUserStats = (userId) => {
    const questions = JSON.parse(localStorage.getItem('questions') || '[]');
    const answers = JSON.parse(localStorage.getItem('answers') || '[]');
    
    const userQuestions = questions.filter(q => q.userId === userId);
    const userAnswers = answers.filter(a => a.userId === userId);
    const totalVotes = userAnswers.reduce((sum, answer) => sum + (answer.votes || 0), 0);
    
    return {
      questions: userQuestions.length,
      answers: userAnswers.length,
      votes: totalVotes
    };
  };

  const getRankIcon = (index) => {
    switch(index) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return `#${index + 1}`;
    }
  };

  const LeaderboardTable = ({ users, title }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Questions</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Answers</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Votes</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  No {title.toLowerCase()} found
                </td>
              </tr>
            ) : (
              users.map((user, index) => {
                const stats = getUserStats(user.id);
                return (
                  <tr key={user.id} className={index < 3 ? 'bg-yellow-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {getRankIcon(index)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.username}
                          </div>
                          {user.role === 'mentor' && (
                            <div className="text-xs">
                              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                Mentor
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-blue-600">{user.points}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{stats.questions}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{stats.answers}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{stats.votes}</div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Leaderboard</h1>
      
      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('students')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'students'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Students ({students.length})
            </button>
            <button
              onClick={() => setActiveTab('mentors')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'mentors'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Mentors ({mentors.length})
            </button>
          </nav>
        </div>
      </div>

      {/* Point System Info */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Point System</h3>
        <div className="text-sm text-blue-800 space-y-1">
          <div>• Answering a question: +5 points</div>
          <div>• Receiving an upvote on your answer: +2 points</div>
          <div>• Receiving a downvote on your answer: -1 point</div>
        </div>
      </div>

      {/* Leaderboard Content */}
      {activeTab === 'students' && (
        <LeaderboardTable users={students} title="Top Students" />
      )}
      
      {activeTab === 'mentors' && (
        <LeaderboardTable users={mentors} title="Top Mentors" />
      )}

      {/* Overall Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-2xl font-bold text-blue-600">{students.length + mentors.length}</div>
          <div className="text-gray-600">Total Users</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-2xl font-bold text-green-600">
            {JSON.parse(localStorage.getItem('questions') || '[]').length}
          </div>
          <div className="text-gray-600">Total Questions</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {JSON.parse(localStorage.getItem('answers') || '[]').length}
          </div>
          <div className="text-gray-600">Total Answers</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-2xl font-bold text-orange-600">
            {JSON.parse(localStorage.getItem('questions') || '[]').filter(q => q.isSolved).length}
          </div>
          <div className="text-gray-600">Solved Questions</div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;