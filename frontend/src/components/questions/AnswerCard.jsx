import React, { useState } from "react";
import { FaUser, FaClock, FaThumbsUp } from "react-icons/fa";

const AnswerCard = ({ answer, onMarkHelpful }) => {
  const [helpfulClicked, setHelpfulClicked] = useState(false);

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleMarkHelpful = () => {
    if (!helpfulClicked && onMarkHelpful) {
      setHelpfulClicked(true);
      onMarkHelpful(answer.id);
    }
  };

  return (
    <div className={`bg-white rounded-2xl border ${answer.is_helpful ? 'border-emerald-300 border-l-4 border-l-emerald-500' : 'border-gray-200'} p-6`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {(answer.author_name || answer.author || 'AU').substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="font-semibold text-gray-800">{answer.author_name || answer.author}</div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <FaClock size={10} />
                {getTimeAgo(answer.created_at)}
              </span>
            </div>
          </div>
        </div>
        
        {answer.is_helpful && (
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
            <FaThumbsUp size={12} />
            Helpful Answer
          </div>
        )}
      </div>
      
      <div className="prose max-w-none mb-4">
        <p className="text-gray-800 leading-relaxed whitespace-pre-line">
          {answer.content}
        </p>
      </div>
      
      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        {!answer.is_helpful && (
          <button
            onClick={handleMarkHelpful}
            disabled={helpfulClicked}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              helpfulClicked
                ? 'bg-emerald-100 text-emerald-700 cursor-default'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FaThumbsUp />
            {helpfulClicked ? 'Marked as Helpful' : 'Mark as Helpful'}
          </button>
        )}
        
        <div className="text-sm text-gray-500">
          {/* Add reply or other actions here */}
        </div>
      </div>
    </div>
  );
};

export default AnswerCard;