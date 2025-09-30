import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import QuestionCard from '../components/QuestionCard';

const MyQuestions = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    tags: ''
  });

  useEffect(() => {
    if (currentUser) {
      loadMyQuestions();
    }
  }, [currentUser]);

  const loadMyQuestions = () => {
    const allQuestions = JSON.parse(localStorage.getItem('questions') || '[]');
    const myQuestions = allQuestions.filter(q => q.userId === currentUser.id);
    setQuestions(myQuestions);
  };

  const handleEdit = (question) => {
    setEditingQuestion(question.id);
    setEditForm({
      title: question.title,
      description: question.description,
      tags: question.tags || ''
    });
  };

  const handleSaveEdit = () => {
    const allQuestions = JSON.parse(localStorage.getItem('questions') || '[]');
    const questionIndex = allQuestions.findIndex(q => q.id === editingQuestion);
    
    if (questionIndex !== -1) {
      allQuestions[questionIndex] = {
        ...allQuestions[questionIndex],
        title: editForm.title,
        description: editForm.description,
        tags: editForm.tags
      };
      localStorage.setItem('questions', JSON.stringify(allQuestions));
      setEditingQuestion(null);
      loadMyQuestions();
    }
  };

  const handleDelete = (questionId) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      const allQuestions = JSON.parse(localStorage.getItem('questions') || '[]');
      const filteredQuestions = allQuestions.filter(q => q.id !== questionId);
      localStorage.setItem('questions', JSON.stringify(filteredQuestions));
      
      // Also delete associated answers and comments
      const allAnswers = JSON.parse(localStorage.getItem('answers') || '[]');
      const filteredAnswers = allAnswers.filter(a => a.questionId !== questionId);
      localStorage.setItem('answers', JSON.stringify(filteredAnswers));
      
      loadMyQuestions();
    }
  };

  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your questions</h2>
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Questions</h1>
        <button
          onClick={() => navigate('/ask-question')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Ask New Question
        </button>
      </div>

      {questions.length === 0 ? (
        <div className="text-center bg-white rounded-lg shadow-md p-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">No questions yet</h2>
          <p className="text-gray-600 mb-6">You haven't asked any questions. Start by asking your first question!</p>
          <button
            onClick={() => navigate('/ask-question')}
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
          >
            Ask Your First Question
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {questions.map(question => (
            <div key={question.id} className="bg-white rounded-lg shadow-md p-6">
              {editingQuestion === question.id ? (
                <div>
                  <div className="mb-4">
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="mb-4">
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                      rows="4"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                  </div>
                  <div className="mb-4">
                    <input
                      type="text"
                      value={editForm.tags}
                      onChange={(e) => setEditForm({...editForm, tags: e.target.value})}
                      placeholder="Tags (comma separated)"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSaveEdit}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingQuestion(null)}
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <button
                      onClick={() => navigate(`/question/${question.id}`)}
                      className="text-xl font-semibold text-blue-600 hover:text-blue-800 text-left"
                    >
                      {question.title}
                    </button>
                    <div className="flex items-center space-x-2">
                      {question.isSolved && (
                        <span className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded">
                          Solved
                        </span>
                      )}
                      <button
                        onClick={() => handleEdit(question)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(question.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-3 line-clamp-3">{question.description}</p>
                  
                  {question.tags && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {question.tags.split(',').map((tag, index) => (
                        <span 
                          key={index} 
                          className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Created {new Date(question.createdAt).toLocaleDateString()}</span>
                    <div className="flex space-x-4">
                      <span>
                        {JSON.parse(localStorage.getItem('answers') || '[]')
                          .filter(a => a.questionId === question.id).length} answers
                      </span>
                      <button
                        onClick={() => navigate(`/question/${question.id}`)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyQuestions;