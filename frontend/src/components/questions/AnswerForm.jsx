import React, { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";

const AnswerForm = ({ questionId, onSubmit, isSubmitting }) => {
  const [answer, setAnswer] = useState("");
  const [charCount, setCharCount] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (answer.trim().length >= 10 && !isSubmitting) {
      onSubmit(answer.trim());
      setAnswer("");
      setCharCount(0);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setAnswer(value);
    setCharCount(value.length);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
      <h3 className="text-xl font-bold text-[#0B1A33] mb-4">Your Answer</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <textarea
            value={answer}
            onChange={handleChange}
            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E4B84D] focus:border-transparent transition min-h-[150px]"
            placeholder="Write your answer here... Be as detailed and helpful as possible."
            required
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-sm text-gray-500">
              Minimum 10 characters required
            </p>
            <span className={`text-sm ${charCount > 1000 ? 'text-red-600' : charCount < 10 ? 'text-amber-600' : 'text-gray-500'}`}>
              {charCount}/1000 characters
            </span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="submit"
            disabled={isSubmitting || charCount < 10}
            className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
              isSubmitting || charCount < 10
                ? 'bg-gray-200 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#E4B84D] to-[#FFD166] hover:shadow-xl hover:scale-[1.02] text-[#0B1A33]'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-[#0B1A33] border-t-transparent rounded-full animate-spin"></div>
                Posting Answer...
              </>
            ) : (
              <>
                <FaPaperPlane />
                Post Answer
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={() => {
              setAnswer("");
              setCharCount(0);
            }}
            className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
          >
            Clear
          </button>
        </div>
      </form>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-2">💡 Tips for Good Answers</h4>
        <ul className="space-y-1 text-blue-700 text-sm">
          <li>• Be specific and provide examples when possible</li>
          <li>• Share from personal experience if relevant</li>
          <li>• Be respectful and helpful</li>
          <li>• Check facts before sharing information</li>
        </ul>
      </div>
    </div>
  );
};

export default AnswerForm;