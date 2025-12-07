
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FaArrowLeft, FaMapMarkerAlt, FaClock, FaTools, 
  FaBuilding, FaEnvelope, FaPhone, FaCalendarAlt,
  FaUsers, FaCheckCircle, FaHourglassHalf, FaPaperPlane,
  FaExclamationCircle, FaShareAlt, FaBookmark
} from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";

// Mock data - replace with API call
const mockOpportunity = {
  id: 1,
  title: "Community Tutoring Program",
  organization: "Ojoto Union NA Education Committee",
  description: `We are seeking dedicated volunteers to provide academic support to students in our community. This program aims to improve educational outcomes for students in math, science, and English.

Responsibilities include:
• Conducting one-on-one or small group tutoring sessions
• Preparing lesson materials and practice exercises
• Monitoring student progress and providing feedback
• Participating in training sessions for tutors

This is an excellent opportunity to make a direct impact on the future of our youth while sharing your knowledge and skills.`,
  location: "Virtual & Ojoto Secondary School",
  time_commitment: "2-4 hours per week (flexible scheduling)",
  skills_needed: "Teaching experience, Strong math/science/English skills, Patience, Good communication",
  category: "education",
  is_urgent: false,
  contact_email: "education@ojotounion.org",
  contact_phone: "+1 (555) 123-4567",
  applications_count: 12,
  approved_count: 8,
  pending_count: 4,
  created_at: "January 15, 2024",
  created_by: "Education Committee",
  requirements: [
    "Minimum commitment of 3 months",
    "Background check required",
    "Teaching/tutoring experience preferred",
    "Must be available weekends or evenings"
  ]
};

export default function VolunteerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [opportunity, setOpportunity] = useState(mockOpportunity);
  const [loading, setLoading] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    // Fetch opportunity data based on id
    setLoading(true);
    setTimeout(() => {
      setOpportunity(mockOpportunity);
      setLoading(false);
    }, 500);
  }, [id]);

  const handleApply = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/volunteer/${id}/apply` } });
      return;
    }
    navigate(`/volunteer/${id}/apply`);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: opportunity.title,
          text: opportunity.description.substring(0, 100) + "...",
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#E4B84D]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* ------------------------------------------------------ */}
      {/* HEADER & BACK NAVIGATION                               */}
      {/* ------------------------------------------------------ */}
      <div className="bg-gradient-to-r from-[#0B1A33] to-[#1a365d] text-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <Link
              to="/volunteer"
              className="flex items-center gap-3 text-white hover:text-[#E4B84D] transition-colors"
            >
              <FaArrowLeft />
              <span className="font-medium">Back to Opportunities</span>
            </Link>
            
            <div className="flex items-center gap-4">
              <button
                onClick={handleShare}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                title="Share opportunity"
              >
                <FaShareAlt />
              </button>
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`p-2 rounded-full transition-colors ${isBookmarked ? 'text-[#E4B84D]' : 'hover:bg-white/10'}`}
                title={isBookmarked ? "Remove bookmark" : "Bookmark opportunity"}
              >
                <FaBookmark className={isBookmarked ? "fill-current" : ""} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------ */}
      {/* MAIN CONTENT                                          */}
      {/* ------------------------------------------------------ */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Opportunity Header */}
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      {opportunity.is_urgent && (
                        <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-yellow-500 
                                     text-white text-sm font-bold rounded-full flex items-center gap-2">
                          <FaExclamationCircle />
                          URGENT
                        </span>
                      )}
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                        {opportunity.category.toUpperCase()}
                      </span>
                    </div>
                    
                    <h1 className="text-3xl font-bold text-[#0B1A33] mb-4">
                      {opportunity.title}
                    </h1>
                    
                    <div className="flex items-center gap-3 text-lg">
                      <FaBuilding className="text-[#E4B84D]" />
                      <span className="font-semibold text-gray-800">{opportunity.organization}</span>
                    </div>
                  </div>
                </div>
                
                {/* Quick Details */}
                <div className="grid md:grid-cols-2 gap-6 mb-8 p-6 bg-gray-50 rounded-xl">
                  {opportunity.location && (
                    <div className="flex items-center gap-3">
                      <FaMapMarkerAlt className="text-[#E4B84D] flex-shrink-0" />
                      <div>
                        <div className="text-sm text-gray-500">Location</div>
                        <div className="font-medium text-gray-800">{opportunity.location}</div>
                      </div>
                    </div>
                  )}
                  
                  {opportunity.time_commitment && (
                    <div className="flex items-center gap-3">
                      <FaClock className="text-[#E4B84D] flex-shrink-0" />
                      <div>
                        <div className="text-sm text-gray-500">Time Commitment</div>
                        <div className="font-medium text-gray-800">{opportunity.time_commitment}</div>
                      </div>
                    </div>
                  )}
                  
                  {opportunity.skills_needed && (
                    <div className="flex items-start gap-3 md:col-span-2">
                      <FaTools className="text-[#E4B84D] flex-shrink-0 mt-1" />
                      <div>
                        <div className="text-sm text-gray-500">Skills Needed</div>
                        <div className="font-medium text-gray-800">{opportunity.skills_needed}</div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Description */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-[#0B1A33] mb-4">Opportunity Description</h3>
                  <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
                    {opportunity.description}
                  </div>
                </div>
                
                {/* Requirements */}
                {opportunity.requirements && opportunity.requirements.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-[#0B1A33] mb-4">Requirements</h3>
                    <ul className="space-y-3">
                      {opportunity.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-[#E4B84D] rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              {/* Application Stats */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-[#0B1A33] mb-6">Application Statistics</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-6 bg-gray-50 rounded-xl">
                    <div className="text-4xl font-bold text-[#0B1A33] mb-2">
                      {opportunity.applications_count}
                    </div>
                    <div className="text-gray-600">Total Applications</div>
                  </div>
                  <div className="text-center p-6 bg-green-50 rounded-xl">
                    <div className="text-4xl font-bold text-green-700 mb-2">
                      {opportunity.approved_count}
                    </div>
                    <div className="text-gray-600 flex items-center justify-center gap-2">
                      <FaCheckCircle className="text-green-600" />
                      Approved
                    </div>
                  </div>
                  <div className="text-center p-6 bg-yellow-50 rounded-xl">
                    <div className="text-4xl font-bold text-yellow-700 mb-2">
                      {opportunity.pending_count}
                    </div>
                    <div className="text-gray-600 flex items-center justify-center gap-2">
                      <FaHourglassHalf className="text-yellow-600" />
                      Pending
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            {/* Apply Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gradient-to-br from-[#0B1A33] to-[#1a365d] rounded-2xl shadow-lg p-8 text-white"
            >
              <h3 className="text-2xl font-bold mb-6">Ready to Apply?</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <FaUsers className="text-[#E4B84D]" />
                  </div>
                  <div>
                    <div className="font-semibold">Make an Impact</div>
                    <div className="text-sm text-gray-300">Directly contribute to community development</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <FaCalendarAlt className="text-[#E4B84D]" />
                  </div>
                  <div>
                    <div className="font-semibold">Flexible Commitment</div>
                    <div className="text-sm text-gray-300">Choose hours that work for you</div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleApply}
                className="w-full py-4 bg-gradient-to-r from-[#E4B84D] to-[#FFD166] 
                         text-[#0B1A33] font-bold rounded-xl hover:shadow-xl 
                         hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
              >
                <FaPaperPlane />
                {isAuthenticated ? "Apply Now" : "Login to Apply"}
              </button>
              
              <p className="text-center text-gray-300 text-sm mt-4">
                Application takes 5-10 minutes
              </p>
            </motion.div>
            
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h3 className="text-2xl font-bold text-[#0B1A33] mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                {opportunity.contact_email && (
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-50 rounded-xl">
                      <FaEnvelope className="text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Email</div>
                      <a 
                        href={`mailto:${opportunity.contact_email}`}
                        className="font-medium text-[#0B1A33] hover:text-[#E4B84D] transition-colors"
                      >
                        {opportunity.contact_email}
                      </a>
                    </div>
                  </div>
                )}
                
                {opportunity.contact_phone && (
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-green-50 rounded-xl">
                      <FaPhone className="text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Phone</div>
                      <div className="font-medium text-[#0B1A33]">{opportunity.contact_phone}</div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="text-sm text-gray-500">Posted by</div>
                <div className="font-medium text-[#0B1A33]">{opportunity.created_by}</div>
                <div className="text-sm text-gray-500 mt-1">{opportunity.created_at}</div>
              </div>
            </motion.div>
            
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h3 className="text-2xl font-bold text-[#0B1A33] mb-6">Quick Actions</h3>
              
              <div className="space-y-3">
                <Link
                  to="/volunteer"
                  className="flex items-center justify-between p-3 hover:bg-gray-50 
                           rounded-xl transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-[#E4B84D]/10 
                                 group-hover:text-[#E4B84D] transition-colors">
                      <FaArrowLeft />
                    </div>
                    <span className="font-medium">Browse All Opportunities</span>
                  </div>
                  <FaArrowLeft className="transform rotate-180 text-gray-400" />
                </Link>
                
                <button
                  onClick={handleShare}
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-50 
                           rounded-xl transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-blue-100 
                                 group-hover:text-blue-600 transition-colors">
                      <FaShareAlt />
                    </div>
                    <span className="font-medium">Share Opportunity</span>
                  </div>
                  <FaShareAlt className="text-gray-400" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}