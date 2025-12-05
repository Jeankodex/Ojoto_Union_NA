
// Reusable answer submission form
import React, { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";

const AnswerForm = ({ questionId, onSubmit, isSubmitting = false }) => {
  const [answer, setAnswer] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (answer.trim() && onSubmit) {
      onSubmit(answer);
      setAnswer("");
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h4 className="text-lg font-semibold text-gray-800 mb-4">Your Answer</h4>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Write your answer here..."
            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E4B84D] focus:border-transparent transition"
            rows="4"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting || !answer.trim()}
          className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
            isSubmitting || !answer.trim()
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-[#E4B84D] to-[#FFD166] hover:shadow-lg hover:scale-[1.02] text-[#0B1A33]'
          }`}
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-[#0B1A33] border-t-transparent rounded-full animate-spin"></div>
              Posting...
            </>
          ) : (
            <>
              <FaPaperPlane />
              Post Answer
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AnswerForm;