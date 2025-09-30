import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AskQuestion = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (!title.trim() || !description.trim()) {
      setError('Please fill in both title and description');
      return;
    }

    setError('');
    setLoading(true);

    const newQuestion = {
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      tags: tags.trim(),
      userId: currentUser.id,
      username: currentUser.username,
      userRole: currentUser.role,
      isSolved: false,
      createdAt: new Date().toISOString()
    };

    const questions = JSON.parse(localStorage.getItem('questions') || '[]');
    questions.unshift(newQuestion);
    localStorage.setItem('questions', JSON.stringify(questions));

    setLoading(false);
    navigate(`/question/${newQuestion.id}`);
  };

  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to ask a question</h2>
          <button 
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Ask a Question</h1>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Question Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your question title..."
            maxLength={200}
          />
          <p className="text-sm text-gray-500 mt-1">{title.length}/200 characters</p>
        </div>

        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            id="description"
            rows="6"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe your question in detail..."
          ></textarea>
        </div>

        <div className="mb-6">
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
            Tags (optional)
          </label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="programming, javascript, css (comma separated)"
          />
          <p className="text-sm text-gray-500 mt-1">Add relevant tags separated by commas</p>
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Posting...' : 'Post Question'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AskQuestion;