import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaUser, FaClock, FaCheckCircle } from "react-icons/fa";
import StatusBadge from "../../components/questions/StatusBadge";
import AnswerCard from "../../components/questions/AnswerCard";
import AnswerForm from "../../components/questions/AnswerForm";
import { qandaAPI } from "../../services/api"; // ADD THIS IMPORT

const QuestionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [error, setError] = useState("");

  // Fetch question and answers
  useEffect(() => {
    fetchQuestionData();
  }, [id]);

  const fetchQuestionData = async () => {
    setLoading(true);
    setError("");
    try {
      // Fetch question
      const questionResponse = await qandaAPI.getQuestion(id);
      if (questionResponse.success) {
        setQuestion(questionResponse.data);
        
        // Fetch answers
        const answersResponse = await qandaAPI.getAnswers(id);
        if (answersResponse.success) {
          setAnswers(answersResponse.data);
        }
      } else {
        setError("Question not found");
      }
    } catch (error) {
      console.error('Failed to fetch question:', error);
      setError("Failed to load question. Please try again.");
      // Fallback to mock data
      setQuestion(getMockQuestion());
      setAnswers(getMockQuestion().answers || []);
    } finally {
      setLoading(false);
    }
  };

  // Mock data fallback
  const getMockQuestion = () => {
    return {
      id: 1,
      title: "How do I update my membership information?",
      content: "I recently moved to a new state and need to update my contact information in the membership directory. What's the process for this?",
      author_name: "Chinedu Okeke",
      created_at: "2024-12-15T10:30:00",
      is_urgent: false,
      is_resolved: true,
      views: 45
    };
  };

  const handleAnswerSubmit = async (answerContent) => {
    setSubmittingAnswer(true);
    try {
      const response = await qandaAPI.addAnswer(id, answerContent);
      
      if (response.success) {
        // Add new answer to list
        const newAnswer = {
          ...response.data,
          author_name: "You", // This would come from user context
          created_at: new Date().toISOString()
        };
        setAnswers(prev => [...prev, newAnswer]);
        
        // Update question answer count
        setQuestion(prev => ({
          ...prev,
          answers_count: (prev.answers_count || 0) + 1
        }));
        
        alert("Answer posted successfully!");
      }
    } catch (error) {
      console.error('Failed to post answer:', error);
      alert("Failed to post answer. Please try again.");
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const handleMarkHelpful = async (answerId) => {
    try {
      const response = await qandaAPI.markAnswerHelpful(answerId);
      if (response.success) {
        // Update answer in state
        setAnswers(prev => prev.map(answer => 
          answer.id === answerId ? { ...answer, is_helpful: true } : answer
        ));
      }
    } catch (error) {
      console.error('Failed to mark answer helpful:', error);
    }
  };

  const handleMarkResolved = async () => {
    try {
      const response = await qandaAPI.markQuestionResolved(id);
      if (response.success) {
        setQuestion(prev => ({ ...prev, is_resolved: true }));
        alert("Question marked as resolved!");
      }
    } catch (error) {
      console.error('Failed to mark question resolved:', error);
      alert("Failed to mark question as resolved.");
    }
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

  if (error && !question) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">❓</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Question Not Found</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            to="/questions"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#E4B84D] to-[#FFD166] text-[#0B1A33] font-bold rounded-xl hover:shadow-lg transition"
          >
            <FaArrowLeft />
            Back to Questions
          </Link>
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

        {error && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-700">
            {error} <button onClick={fetchQuestionData} className="underline ml-2">Refresh</button>
          </div>
        )}

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
                {question.author_name || question.author}
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
              <span className="text-sm">
                {question.views || 0} views
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
              Answers ({answers.length})
            </h2>
            <div className="text-sm text-gray-600">
              {question.answers_count || 0} total answers
            </div>
          </div>

          {answers.length > 0 ? (
            <div className="space-y-4">
              {answers.map(answer => (
                <AnswerCard 
                  key={answer.id} 
                  answer={answer} 
                  onMarkHelpful={handleMarkHelpful}
                />
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