import React from 'react';
import { Link } from 'react-router-dom';

const QuestionCard = ({ question }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getAnswerCount = () => {
    const answers = JSON.parse(localStorage.getItem('answers') || '[]');
    return answers.filter(answer => answer.questionId === question.id).length;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <Link 
          to={`/question/${question.id}`} 
          className="text-xl font-semibold text-blue-600 hover:text-blue-800"
        >
          {question.title}
        </Link>
        {question.isSolved && (
          <span className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded">
            Solved
          </span>
        )}
      </div>
      
      <p className="text-gray-600 mb-3 line-clamp-3">
        {question.description}
      </p>
      
      <div className="flex flex-wrap gap-2 mb-3">
        {question.tags && question.tags.split(',').map((tag, index) => (
          <span 
            key={index} 
            className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded"
          >
            {tag.trim()}
          </span>
        ))}
      </div>
      
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>By {question.username}</span>
        <div className="flex gap-4">
          <span>{getAnswerCount()} answers</span>
          <span>{formatDate(question.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;