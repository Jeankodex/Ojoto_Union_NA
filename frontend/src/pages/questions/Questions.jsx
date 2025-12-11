import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaFilter, FaPlus, FaQuestionCircle } from "react-icons/fa";
import QuestionCard from "../../components/questions/QuestionCard";
import { qandaAPI } from "../../services/api"; // ADD THIS IMPORT

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all"); // all, unresolved, resolved, urgent
  const [error, setError] = useState("");

  // Fetch questions from backend
  useEffect(() => {
    fetchQuestions();
  }, [filter, searchQuery]);

  const fetchQuestions = async () => {
    setLoading(true);
    setError("");
    try {
      const filters = {
        category: "all", // You can add category filter if needed
        status: filter === "all" ? "all" : 
                filter === "unresolved" ? "unanswered" : 
                filter === "resolved" ? "resolved" : "all",
        search: searchQuery,
        page: 1,
        limit: 20
      };
      
      const response = await qandaAPI.getQuestions(filters);
      
      if (response.success) {
        setQuestions(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch questions:', error);
      setError("Failed to load questions. Please try again.");
      // Fallback to mock data
      setQuestions(getMockQuestions());
    } finally {
      setLoading(false);
    }
  };

  // Mock data fallback
  const getMockQuestions = () => {
    return [
      {
        id: 1,
        title: "How do I update my membership information?",
        content: "I recently moved and need to update my contact details...",
        author_name: "Chinedu Okeke",
        created_at: "2024-12-15T10:30:00",
        is_urgent: false,
        is_resolved: true,
        answers_count: 2,
        views: 45
      },
      {
        id: 2,
        title: "Urgent: Need help with visa documentation",
        content: "Has anyone recently gone through the visa process...",
        author_name: "Amina Bello",
        created_at: "2024-12-14T15:45:00",
        is_urgent: true,
        is_resolved: false,
        answers_count: 1,
        views: 78
      },
      {
        id: 3,
        title: "Looking for housing recommendations in Houston",
        content: "Moving to Houston next month and looking for...",
        author_name: "Tunde Adeyemi",
        created_at: "2024-12-13T09:20:00",
        is_urgent: false,
        is_resolved: false,
        answers_count: 0,
        views: 32
      },
    ];
  };

  // Frontend filtering as fallback
  const filteredQuestions = questions.filter(question => {
    if (searchQuery) {
      const matchesSearch = 
        question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        question.content.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;
    }
    
    // Frontend status filter (as backup)
    if (filter === "unresolved" && question.is_resolved) return false;
    if (filter === "resolved" && !question.is_resolved) return false;
    if (filter === "urgent" && !question.is_urgent) return false;
    
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#0B1A33] to-[#1a365d] text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold font-['Playfair_Display',_serif] mb-3">
                Community Q&A
              </h1>
              <p className="text-gray-300 text-lg max-w-3xl">
                Ask questions, share knowledge, and help fellow Ojoto Union members
              </p>
            </div>
            
            <Link
              to="/questions/ask"
              className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#E4B84D] to-[#FFD166] text-[#0B1A33] font-bold rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
            >
              <FaPlus />
              Ask Question
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold mb-1">{questions.length}</div>
              <div className="text-gray-300">Total Questions</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold mb-1">
                {questions.filter(q => q.is_resolved).length}
              </div>
              <div className="text-gray-300">Resolved</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold mb-1">
                {questions.reduce((acc, q) => acc + (q.answers_count || 0), 0)}
              </div>
              <div className="text-gray-300">Total Answers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            {error} <button onClick={fetchQuestions} className="underline ml-2">Try again</button>
          </div>
        )}

        {/* Search and Filter Bar */}
        <div className="mb-8 bg-white rounded-2xl shadow-md p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E4B84D] focus:border-transparent transition"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <div className="relative">
                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E4B84D] focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">All Questions</option>
                  <option value="unresolved">Unresolved</option>
                  <option value="resolved">Resolved</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              
              <button
                onClick={fetchQuestions}
                className="px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Questions List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-[#E4B84D] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading questions...</p>
          </div>
        ) : filteredQuestions.length > 0 ? (
          <div className="space-y-6">
            {filteredQuestions.map(question => (
              <QuestionCard key={question.id} question={question} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <FaQuestionCircle className="text-4xl text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-3">No Questions Found</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              {searchQuery 
                ? `No questions match "${searchQuery}". Try a different search term.`
                : `Be the first to ask a question!`
              }
            </p>
            <Link
              to="/questions/ask"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#E4B84D] to-[#FFD166] text-[#0B1A33] font-bold rounded-xl hover:shadow-lg transition"
            >
              <FaPlus />
              Ask First Question
            </Link>
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-blue-50 rounded-2xl border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">🔍 Search First</h4>
            <p className="text-blue-700 text-sm">
              Check if your question has already been answered before posting.
            </p>
          </div>
          <div className="p-6 bg-amber-50 rounded-2xl border border-amber-200">
            <h4 className="font-semibold text-amber-800 mb-2">🎯 Be Specific</h4>
            <p className="text-amber-700 text-sm">
              Clear, detailed questions get better, faster answers.
            </p>
          </div>
          <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200">
            <h4 className="font-semibold text-emerald-800 mb-2">🤝 Help Others</h4>
            <p className="text-emerald-700 text-sm">
              Share your knowledge by answering questions you know about.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Questions;