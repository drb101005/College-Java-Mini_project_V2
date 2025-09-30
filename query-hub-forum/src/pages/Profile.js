import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { currentUser, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: currentUser?.username || '',
    bio: currentUser?.bio || ''
  });
  const [message, setMessage] = useState('');

  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your profile</h2>
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

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditing(false);
    setMessage('Profile updated successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const getUserQuestions = () => {
    const questions = JSON.parse(localStorage.getItem('questions') || '[]');
    return questions.filter(q => q.userId === currentUser.id);
  };

  const getUserAnswers = () => {
    const answers = JSON.parse(localStorage.getItem('answers') || '[]');
    return answers.filter(a => a.userId === currentUser.id);
  };

  const userQuestions = getUserQuestions();
  const userAnswers = getUserAnswers();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {message}
          </div>
        )}

        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
              {currentUser.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{currentUser.username}</h1>
              <div className="flex items-center mt-1">
                <span className="text-gray-600 mr-2">{currentUser.role}</span>
                {currentUser.role === 'mentor' && (
                  <span className="bg-yellow-100 text-yellow-800 text-sm px-2 py-1 rounded">
                    Mentor
                  </span>
                )}
              </div>
              <p className="text-blue-600 font-semibold">{currentUser.points} points</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                id="bio"
                rows="3"
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tell us about yourself..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Save Changes
            </button>
          </form>
        ) : (
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Email</h3>
              <p className="text-gray-600">{currentUser.email}</p>
            </div>
            {currentUser.bio && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Bio</h3>
                <p className="text-gray-600">{currentUser.bio}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">{userQuestions.length}</div>
          <div className="text-gray-600">Questions Asked</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-green-600">{userAnswers.length}</div>
          <div className="text-gray-600">Answers Given</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-purple-600">{currentUser.points}</div>
          <div className="text-gray-600">Total Points</div>
        </div>
      </div>

      {/* Recent Questions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Your Recent Questions</h2>
        {userQuestions.length === 0 ? (
          <p className="text-gray-600">You haven't asked any questions yet.</p>
        ) : (
          <div className="space-y-4">
            {userQuestions.slice(0, 5).map(question => (
              <div key={question.id} className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-blue-600 hover:text-blue-800">
                  <button onClick={() => navigate(`/question/${question.id}`)}>
                    {question.title}
                  </button>
                </h3>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  {question.isSolved && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded mr-2">
                      Solved
                    </span>
                  )}
                  <span>{new Date(question.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Answers */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Your Recent Answers</h2>
        {userAnswers.length === 0 ? (
          <p className="text-gray-600">You haven't answered any questions yet.</p>
        ) : (
          <div className="space-y-4">
            {userAnswers.slice(0, 5).map(answer => {
              const questions = JSON.parse(localStorage.getItem('questions') || '[]');
              const question = questions.find(q => q.id === answer.questionId);
              return (
                <div key={answer.id} className="border-l-4 border-green-500 pl-4">
                  <p className="text-gray-700 mb-2">{answer.answerText.substring(0, 100)}...</p>
                  {question && (
                    <h4 className="font-semibold text-green-600 hover:text-green-800 text-sm">
                      <button onClick={() => navigate(`/question/${question.id}`)}>
                        Question: {question.title}
                      </button>
                    </h4>
                  )}
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <span className="mr-3">Votes: {answer.votes || 0}</span>
                    <span>{new Date(answer.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;