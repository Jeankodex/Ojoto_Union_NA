import React from "react";
import { Link } from "react-router-dom";
import { FaUser, FaClock, FaComment, FaFire } from "react-icons/fa";

const QuestionCard = ({ question }) => {
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

  return (
    <Link to={`/questions/${question.id}`}>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300 hover:border-[#E4B84D]/30">
        <div className="flex flex-col md:flex-row md:items-start gap-4">
          {/* Stats Column */}
          <div className="flex md:flex-col gap-4 md:gap-2 text-center">
            <div className="flex-1 md:flex-none">
              <div className={`text-lg font-bold ${question.answers_count > 0 ? 'text-emerald-600' : 'text-gray-400'}`}>
                {question.answers_count || 0}
              </div>
              <div className="text-xs text-gray-500">answers</div>
            </div>
            <div className="flex-1 md:flex-none">
              <div className="text-lg font-bold text-gray-700">
                {question.views || 0}
              </div>
              <div className="text-xs text-gray-500">views</div>
            </div>
          </div>

          {/* Content Column */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {question.is_urgent && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                  <FaFire size={10} />
                  Urgent
                </span>
              )}
              {question.is_resolved && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium">
                  Resolved
                </span>
              )}
              <span className="text-xs text-gray-500 capitalize">
                {question.category || 'general'}
              </span>
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-[#E4B84D] transition-colors">
              {question.title}
            </h3>
            
            <p className="text-gray-600 line-clamp-2 mb-4">
              {question.content}
            </p>
            
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <FaUser size={12} />
                  {question.author_name || question.author}
                </span>
                <span className="flex items-center gap-1">
                  <FaClock size={12} />
                  {getTimeAgo(question.created_at)}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                {question.answers_count > 0 ? (
                  <span className="flex items-center gap-1 text-sm text-emerald-600">
                    <FaComment size={12} />
                    {question.answers_count} answer{question.answers_count !== 1 ? 's' : ''}
                  </span>
                ) : (
                  <span className="text-sm text-amber-600">No answers yet</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default QuestionCard;