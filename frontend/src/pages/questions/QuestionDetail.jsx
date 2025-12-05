
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaArrowLeft, FaUser, FaClock, FaCheckCircle } from "react-icons/fa";
import StatusBadge from "../../components/questions/StatusBadge";
import AnswerCard from "../../components/questions/AnswerCard";
import AnswerForm from "../../components/questions/AnswerForm";

const QuestionDetail = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submittingAnswer, setSubmittingAnswer] = useState(false);

  // Fetch question data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setQuestion({
        id: 1,
        title: "How do I update my membership information?",
        content: "I recently moved to a new state and need to update my contact information in the membership directory. What's the process for this?",
        author: "Chinedu Okeke",
        author_id: 1,
        created_at: "2024-12-15T10:30:00",
        is_urgent: false,
        is_resolved: true,
        answers: [
          {
            id: 1,
            content: "You can update your information through the member portal. Log in and go to 'My Profile' section.",
            author: "Admin User",
            created_at: "2024-12-15T14:20:00",
            is_helpful: true
          },
          {
            id: 2,
            content: "Alternatively, you can email membership@ojotounion.org with your updated details.",
            author: "Community Coordinator",
            created_at: "2024-12-16T09:15:00",
            is_helpful: false
          }
        ]
      });
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleAnswerSubmit = (answerContent) => {
    setSubmittingAnswer(true);
    // API call to submit answer
    setTimeout(() => {
      const newAnswer = {
        id: question.answers.length + 1,
        content: answerContent,
        author: "Current User",
        created_at: new Date().toISOString(),
        is_helpful: false
      };
      setQuestion(prev => ({
        ...prev,
        answers: [...prev.answers, newAnswer]
      }));
      setSubmittingAnswer(false);
    }, 1000);
  };

  const handleMarkResolved = () => {
    // API call to mark as resolved
    setQuestion(prev => ({ ...prev, is_resolved: true }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#E4B84D] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading question...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link 
          to="/questions"
          className="inline-flex items-center gap-2 text-[#0B1A33] hover:text-[#E4B84D] transition-colors mb-6"
        >
          <FaArrowLeft />
          Back to Questions
        </Link>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
          {/* Question Header */}
          <div className={`p-6 ${question.is_resolved ? 'bg-emerald-600' : 'bg-[#0B1A33]'} text-white`}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                {question.is_urgent && <StatusBadge type="urgent" />}
                {question.is_resolved && (
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                    <FaCheckCircle />
                    <span className="text-sm font-semibold">RESOLVED</span>
                  </div>
                )}
              </div>
              
              {!question.is_resolved && (
                <button
                  onClick={handleMarkResolved}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-lg transition"
                >
                  Mark as Resolved
                </button>
              )}
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold mb-4">{question.title}</h1>
            
            <div className="flex items-center gap-4 text-white/90">
              <span className="flex items-center gap-2">
                <FaUser size={14} />
                {question.author}
              </span>
              <span className="flex items-center gap-2">
                <FaClock size={14} />
                {new Date(question.created_at).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>

          {/* Question Content */}
          <div className="p-6 md:p-8">
            <div className="prose max-w-none mb-8">
              <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-line">
                {question.content}
              </p>
            </div>
          </div>
        </div>

        {/* Answers Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#0B1A33]">
              Answers ({question.answers.length})
            </h2>
            <div className="text-sm text-gray-600">
              Sorted by: <span className="font-semibold text-[#E4B84D]">Most Helpful</span>
            </div>
          </div>

          {question.answers.length > 0 ? (
            <div className="space-y-4">
              {question.answers.map(answer => (
                <AnswerCard key={answer.id} answer={answer} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-200">
              <div className="text-5xl mb-4">🤔</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Answers Yet</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Be the first to help by answering this question!
              </p>
            </div>
          )}
        </div>

        {/* Answer Form */}
        {!question.is_resolved ? (
          <AnswerForm 
            questionId={question.id}
            onSubmit={handleAnswerSubmit}
            isSubmitting={submittingAnswer}
          />
        ) : (
          <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
            <div className="inline-flex items-center gap-3 text-emerald-700 mb-3">
              <FaCheckCircle className="text-2xl" />
              <span className="text-lg font-semibold">This question has been resolved</span>
            </div>
            <p className="text-emerald-600">
              Thank you to everyone who contributed answers!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionDetail;