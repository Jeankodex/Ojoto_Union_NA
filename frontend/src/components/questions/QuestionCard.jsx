
// Reusable question card for list view
import React from "react";
import { Link } from "react-router-dom";
import { FaUser, FaClock, FaComment } from "react-icons/fa";
import StatusBadge from "./StatusBadge";

const QuestionCard = ({ question, showAnswers = false }) => {
  return (
    <div className={`p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 border ${question.is_resolved ? 'border-emerald-200' : 'border-gray-200'} mb-4`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          {question.is_urgent && <StatusBadge type="urgent" />}
          {question.is_resolved && <StatusBadge type="resolved" />}
        </div>
        
        <span className="text-sm text-gray-500">
          {new Date(question.created_at).toLocaleDateString()}
        </span>
      </div>
      
      <Link to={`/questions/${question.id}`}>
        <h3 className="text-xl font-bold text-gray-800 hover:text-[#E4B84D] transition-colors mb-3">
          {question.title}
        </h3>
      </Link>
      
      <p className="text-gray-600 mb-4 line-clamp-2">{question.content}</p>
      
      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <FaUser size={12} />
            {question.author}
          </span>
          <span className="flex items-center gap-1">
            <FaComment size={12} />
            {question.answers?.length || 0} answers
          </span>
        </div>
        
        <Link 
          to={`/questions/${question.id}`}
          className="text-[#E4B84D] font-medium hover:text-[#0B1A33] transition-colors"
        >
          View Details →
        </Link>
      </div>
      
      {/* Optional: Show first answer preview */}
      {showAnswers && question.answers?.[0] && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-gray-700">Top Answer:</span>
          </div>
          <p className="text-gray-600 text-sm line-clamp-2">
            {question.answers[0].content}
          </p>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;