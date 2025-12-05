
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaPaperPlane } from "react-icons/fa";

const AskQuestion = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    is_urgent: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // API call here
    setTimeout(() => setIsSubmitting(false), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/questions"
            className="inline-flex items-center gap-2 text-[#0B1A33] hover:text-[#E4B84D] transition-colors mb-4"
          >
            <FaArrowLeft />
            Back to Questions
          </Link>
          
          <h1 className="text-4xl font-bold text-[#0B1A33] font-['Playfair_Display',_serif] mb-2">
            Ask a Question
          </h1>
          <p className="text-gray-600">Get help from the Ojoto Union community</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-2">
                  Question Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E4B84D] focus:border-transparent transition text-lg"
                  placeholder="What would you like to ask?"
                  required
                />
                <p className="text-sm text-gray-500 mt-2">
                  Be specific and clear for better answers
                </p>
              </div>

              {/* Content */}
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-2">
                  Question Details
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E4B84D] focus:border-transparent transition min-h-[200px]"
                  placeholder="Provide detailed information about your question..."
                  required
                />
                <p className="text-sm text-gray-500 mt-2">
                  Include any relevant context or specific details
                </p>
              </div>

              {/* Urgent Checkbox */}
              <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
                <input
                  type="checkbox"
                  name="is_urgent"
                  id="urgent"
                  checked={formData.is_urgent}
                  onChange={handleChange}
                  className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500"
                />
                <div>
                  <label htmlFor="urgent" className="font-semibold text-amber-800">
                    Mark as Urgent
                  </label>
                  <p className="text-sm text-amber-700 mt-1">
                    Use this for time-sensitive questions that need quick attention
                  </p>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                    isSubmitting
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#E4B84D] to-[#FFD166] hover:shadow-xl hover:scale-[1.02] text-[#0B1A33]'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-[#0B1A33] border-t-transparent rounded-full animate-spin"></div>
                      Posting Question...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      Post Question
                    </>
                  )}
                </button>
                
                <Link
                  to="/questions"
                  className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition flex items-center justify-center"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">💡 Tips for Better Answers</h3>
          <ul className="space-y-2 text-blue-700">
            <li className="flex items-start gap-2">
              <span className="mt-1">•</span>
              <span>Be clear and specific in your question</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1">•</span>
              <span>Include relevant context and details</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1">•</span>
              <span>Check if similar questions have been asked before</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1">•</span>
              <span>Be respectful and follow community guidelines</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AskQuestion;