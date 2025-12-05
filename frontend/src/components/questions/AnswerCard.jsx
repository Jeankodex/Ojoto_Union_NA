
// Reusable answer display component
import React from "react";
import { FaUser, FaClock } from "react-icons/fa";
import StatusBadge from "./StatusBadge";

const AnswerCard = ({ answer }) => {
  return (
    <div className={`p-4 rounded-xl border-l-4 ${answer.is_helpful ? 'border-amber-400 bg-amber-50' : 'border-gray-300 bg-gray-50'} mb-3`}>
      <p className="text-gray-800 mb-3">{answer.content}</p>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <FaUser size={12} />
            {answer.author}
          </span>
          <span className="flex items-center gap-1">
            <FaClock size={12} />
            {new Date(answer.created_at).toLocaleDateString()}
          </span>
        </div>
        
        {answer.is_helpful && <StatusBadge type="helpful" />}
      </div>
    </div>
  );
};

export default AnswerCard;