import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import QuestionCard from '../components/QuestionCard';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { currentUser } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [topUsers, setTopUsers] = useState([]);

  useEffect(() => {
    loadQuestions();
    loadTopUsers();
  }, []);

  const loadQuestions = () => {
    const storedQuestions = JSON.parse(localStorage.getItem('questions') || '[]');
    setQuestions(storedQuestions);
  };

  const loadTopUsers = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const sortedUsers = users
      .filter(user => user.points > 0)
      .sort((a, b) => b.points - a.points)
      .slice(0, 5);
    setTopUsers(sortedUsers);
  };

  const getFilteredQuestions = () => {
    let filtered = questions.filter(q => 
      q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedTag) {
      filtered = filtered.filter(q => 
        q.tags && q.tags.toLowerCase().includes(selectedTag.toLowerCase())
      );
    }

    if (sortBy === 'latest') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'answers') {
      const answers = JSON.parse(localStorage.getItem('answers') || '[]');
      filtered.sort((a, b) => {
        const aAnswers = answers.filter(ans => ans.questionId === a.id).length;
        const bAnswers = answers.filter(ans => ans.questionId === b.id).length;
        return bAnswers - aAnswers;
      });
    }

    return filtered;
  };

  const getAllTags = () => {
    const allTags = questions.flatMap(q => 
      q.tags ? q.tags.split(',').map(tag => tag.trim()) : []
    );
    return [...new Set(allTags)];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Recent Questions</h1>
            {currentUser && (
              <Link 
                to="/ask-question" 
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Ask Question
              </Link>
            )}
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Tags</option>
                {getAllTags().map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="latest">Latest</option>
                <option value="answers">Most Answered</option>
              </select>
            </div>
          </div>

          {/* Questions List */}
          <div>
            {getFilteredQuestions().length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No questions found. Be the first to ask!</p>
                {currentUser && (
                  <Link 
                    to="/ask-question" 
                    className="text-blue-600 hover:text-blue-800 mt-2 inline-block"
                  >
                    Ask a Question
                  </Link>
                )}
              </div>
            ) : (
              getFilteredQuestions().map(question => (
                <QuestionCard key={question.id} question={question} />
              ))
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80">
          {/* Top Contributors */}
          {topUsers.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <h3 className="text-lg font-semibold mb-4">Top Contributors</h3>
              <div className="space-y-3">
                {topUsers.map(user => (
                  <div key={user.id} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-medium">{user.username}</span>
                        {user.role === 'mentor' && (
                          <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                            Mentor
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-blue-600 font-semibold">{user.points}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-4">Community Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Questions:</span>
                <span className="font-semibold">{questions.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Users:</span>
                <span className="font-semibold">{JSON.parse(localStorage.getItem('users') || '[]').length}</span>
              </div>
              <div className="flex justify-between">
                <span>Solved Questions:</span>
                <span className="font-semibold">{questions.filter(q => q.isSolved).length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;