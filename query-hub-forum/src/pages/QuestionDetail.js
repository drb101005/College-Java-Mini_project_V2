import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const QuestionDetail = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [comments, setComments] = useState([]);
  const [newAnswer, setNewAnswer] = useState('');
  const [newComment, setNewComment] = useState('');
  const [activeCommentAnswer, setActiveCommentAnswer] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadQuestion();
    loadAnswers();
    loadComments();
  }, [id]);

  const loadQuestion = () => {
    const questions = JSON.parse(localStorage.getItem('questions') || '[]');
    const foundQuestion = questions.find(q => q.id === parseInt(id));
    setQuestion(foundQuestion);
  };

  const loadAnswers = () => {
    const allAnswers = JSON.parse(localStorage.getItem('answers') || '[]');
    const questionAnswers = allAnswers
      .filter(answer => answer.questionId === parseInt(id))
      .sort((a, b) => b.votes - a.votes);
    setAnswers(questionAnswers);
  };

  const loadComments = () => {
    const allComments = JSON.parse(localStorage.getItem('comments') || '[]');
    setComments(allComments);
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (!newAnswer.trim()) {
      return;
    }

    setLoading(true);

    const answer = {
      id: Date.now(),
      questionId: parseInt(id),
      userId: currentUser.id,
      username: currentUser.username,
      userRole: currentUser.role,
      answerText: newAnswer.trim(),
      votes: 0,
      createdAt: new Date().toISOString()
    };

    const allAnswers = JSON.parse(localStorage.getItem('answers') || '[]');
    allAnswers.push(answer);
    localStorage.setItem('answers', JSON.stringify(allAnswers));

    // Award points to user
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
      users[userIndex].points += 5; // 5 points for answering
      localStorage.setItem('users', JSON.stringify(users));
    }

    setNewAnswer('');
    loadAnswers();
    setLoading(false);
  };

  const handleVote = (answerId, voteType) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const allAnswers = JSON.parse(localStorage.getItem('answers') || '[]');
    const answerIndex = allAnswers.findIndex(a => a.id === answerId);
    
    if (answerIndex !== -1) {
      const currentVotes = allAnswers[answerIndex].votes || 0;
      allAnswers[answerIndex].votes = voteType === 'up' ? currentVotes + 1 : currentVotes - 1;
      localStorage.setItem('answers', JSON.stringify(allAnswers));
      
      // Award/deduct points to answer author
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const authorIndex = users.findIndex(u => u.id === allAnswers[answerIndex].userId);
      if (authorIndex !== -1) {
        users[authorIndex].points += voteType === 'up' ? 2 : -1;
        localStorage.setItem('users', JSON.stringify(users));
      }
      
      loadAnswers();
    }
  };

  const handleSubmitComment = (answerId) => {
    if (!currentUser || !newComment.trim()) return;

    const comment = {
      id: Date.now(),
      answerId: answerId,
      userId: currentUser.id,
      username: currentUser.username,
      userRole: currentUser.role,
      commentText: newComment.trim(),
      createdAt: new Date().toISOString()
    };

    const allComments = JSON.parse(localStorage.getItem('comments') || '[]');
    allComments.push(comment);
    localStorage.setItem('comments', JSON.stringify(allComments));

    setNewComment('');
    setActiveCommentAnswer(null);
    loadComments();
  };

  const markAsSolved = () => {
    if (!currentUser || currentUser.id !== question.userId) return;

    const questions = JSON.parse(localStorage.getItem('questions') || '[]');
    const questionIndex = questions.findIndex(q => q.id === parseInt(id));
    
    if (questionIndex !== -1) {
      questions[questionIndex].isSolved = true;
      localStorage.setItem('questions', JSON.stringify(questions));
      loadQuestion();
    }
  };

  const getCommentsForAnswer = (answerId) => {
    return comments.filter(comment => comment.answerId === answerId);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (!question) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Question not found</h2>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Question */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold text-gray-900">{question.title}</h1>
          {question.isSolved && (
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
              Solved
            </span>
          )}
        </div>
        
        <p className="text-gray-700 mb-4 whitespace-pre-wrap">{question.description}</p>
        
        {question.tags && (
          <div className="flex flex-wrap gap-2 mb-4">
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
          <div className="flex items-center">
            <span>Asked by {question.username}</span>
            {question.userRole === 'mentor' && (
              <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                Mentor
              </span>
            )}
          </div>
          <span>{formatDate(question.createdAt)}</span>
        </div>
        
        {currentUser && currentUser.id === question.userId && !question.isSolved && (
          <div className="mt-4">
            <button
              onClick={markAsSolved}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Mark as Solved
            </button>
          </div>
        )}
      </div>

      {/* Answers */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {answers.length} Answer{answers.length !== 1 ? 's' : ''}
        </h2>
        
        {answers.map(answer => (
          <div key={answer.id} className="bg-white rounded-lg shadow-md p-6 mb-4">
            <p className="text-gray-700 mb-4 whitespace-pre-wrap">{answer.answerText}</p>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                {currentUser && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleVote(answer.id, 'up')}
                      className="text-green-600 hover:text-green-700"
                    >
                      ↑
                    </button>
                    <span className="font-semibold">{answer.votes || 0}</span>
                    <button
                      onClick={() => handleVote(answer.id, 'down')}
                      className="text-red-600 hover:text-red-700"
                    >
                      ↓
                    </button>
                  </div>
                )}
                <button
                  onClick={() => setActiveCommentAnswer(activeCommentAnswer === answer.id ? null : answer.id)}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  Comment
                </button>
              </div>
              
              <div className="flex items-center text-sm text-gray-500">
                <span>By {answer.username}</span>
                {answer.userRole === 'mentor' && (
                  <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                    Mentor
                  </span>
                )}
                <span className="ml-2">{formatDate(answer.createdAt)}</span>
              </div>
            </div>
            
            {/* Comments */}
            {getCommentsForAnswer(answer.id).length > 0 && (
              <div className="mt-4 pl-4 border-l-2 border-gray-200">
                {getCommentsForAnswer(answer.id).map(comment => (
                  <div key={comment.id} className="mb-2 p-2 bg-gray-50 rounded">
                    <p className="text-sm text-gray-700">{comment.commentText}</p>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <span>{comment.username}</span>
                      {comment.userRole === 'mentor' && (
                        <span className="ml-1 bg-yellow-100 text-yellow-800 px-1 rounded">
                          Mentor
                        </span>
                      )}
                      <span className="ml-2">{formatDate(comment.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Comment Form */}
            {activeCommentAnswer === answer.id && currentUser && (
              <div className="mt-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => handleSubmitComment(answer.id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Post
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Answer Form */}
      {currentUser ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Your Answer</h3>
          <form onSubmit={handleSubmitAnswer}>
            <textarea
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write your answer here..."
            ></textarea>
            <div className="mt-4">
              <button
                type="submit"
                disabled={loading || !newAnswer.trim()}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Posting...' : 'Post Answer'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-700 mb-4">Please log in to post an answer</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Login
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestionDetail;