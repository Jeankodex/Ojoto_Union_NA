
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FaArrowLeft, FaPaperPlane, FaUser, FaEnvelope, 
  FaPhone, FaTools, FaComment, FaBuilding,
  FaMapMarkerAlt, FaClock, FaExclamationCircle
} from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";

// Mock data - replace with API call
const mockOpportunity = {
  id: 1,
  title: "Community Tutoring Program",
  organization: "Ojoto Union NA Education Committee",
  location: "Virtual & Ojoto Secondary School",
  is_urgent: false
};

export default function ApplyVolunteer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [opportunity, setOpportunity] = useState(mockOpportunity);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    applicant_name: "",
    applicant_email: "",
    applicant_phone: "",
    skills: "",
    message: ""
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/volunteer/${id}/apply` } });
      return;
    }

    // Fetch opportunity details
    setLoading(true);
    setTimeout(() => {
      setOpportunity(mockOpportunity);
      
      // Pre-fill form with user data
      if (user) {
        setFormData(prev => ({
          ...prev,
          applicant_name: `${user.firstName || ""} ${user.surname || ""}`.trim(),
          applicant_email: user.email || "",
          applicant_phone: user.phone || ""
        }));
      }
      setLoading(false);
    }, 500);
  }, [id, isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Submit application to backend
      console.log("Submitting application:", { opportunityId: id, ...formData });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success and redirect
      alert("Application submitted successfully!");
      navigate(`/volunteer/${id}`);
      
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Failed to submit application. Please try again.");
    } finally {
      setSubmitting(false);
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link
            to={`/volunteer/${id}`}
            className="flex items-center gap-2 text-[#0B1A33] hover:text-[#E4B84D] transition-colors"
          >
            <FaArrowLeft />
            <span className="font-medium">Back to Opportunity</span>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Form Header */}
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-8 text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <FaPaperPlane className="text-2xl" />
                    <h1 className="text-3xl font-bold">Apply for Volunteer Opportunity</h1>
                  </div>
                  <p className="text-gray-200">Complete the form below to submit your application</p>
                </div>
                
                {/* Opportunity Summary */}
                <div className="p-8 border-b border-gray-200 bg-gray-50">
                  <h3 className="text-xl font-bold text-[#0B1A33] mb-4">Opportunity Summary</h3>
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-lg text-[#0B1A33]">{opportunity.title}</h4>
                        <div className="flex items-center gap-3 text-gray-600 mt-1">
                          <FaBuilding className="text-sm" />
                          <span>{opportunity.organization}</span>
                        </div>
                      </div>
                      {opportunity.is_urgent && (
                        <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-yellow-500 
                                     text-white text-sm font-bold rounded-full flex items-center gap-2">
                          <FaExclamationCircle />
                          URGENT
                        </span>
                      )}
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      {opportunity.location && (
                        <div className="flex items-center gap-3">
                          <FaMapMarkerAlt className="text-green-600 flex-shrink-0" />
                          <span className="text-gray-700">{opportunity.location}</span>
                        </div>
                      )}
                      {opportunity.time_commitment && (
                        <div className="flex items-center gap-3">
                          <FaClock className="text-green-600 flex-shrink-0" />
                          <span className="text-gray-700">{opportunity.time_commitment}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Application Form */}
                <form onSubmit={handleSubmit} className="p-8">
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Full Name */}
                      <div>
                        <label htmlFor="applicant_name" className="block text-sm font-semibold text-gray-700 mb-2">
                          <span className="flex items-center gap-2">
                            <FaUser className="text-green-600" />
                            Full Name *
                          </span>
                        </label>
                        <input
                          type="text"
                          id="applicant_name"
                          name="applicant_name"
                          value={formData.applicant_name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl 
                                   focus:outline-none focus:ring-2 focus:ring-green-500 
                                   focus:border-transparent transition"
                          placeholder="Your full name"
                          required
                        />
                      </div>
                      
                      {/* Email */}
                      <div>
                        <label htmlFor="applicant_email" className="block text-sm font-semibold text-gray-700 mb-2">
                          <span className="flex items-center gap-2">
                            <FaEnvelope className="text-green-600" />
                            Email Address *
                          </span>
                        </label>
                        <input
                          type="email"
                          id="applicant_email"
                          name="applicant_email"
                          value={formData.applicant_email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl 
                                   focus:outline-none focus:ring-2 focus:ring-green-500 
                                   focus:border-transparent transition"
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>
                    </div>
                    
                    {/* Phone Number */}
                    <div>
                      <label htmlFor="applicant_phone" className="block text-sm font-semibold text-gray-700 mb-2">
                        <span className="flex items-center gap-2">
                          <FaPhone className="text-green-600" />
                          Phone Number
                        </span>
                      </label>
                      <input
                        type="tel"
                        id="applicant_phone"
                        name="applicant_phone"
                        value={formData.applicant_phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl 
                                 focus:outline-none focus:ring-2 focus:ring-green-500 
                                 focus:border-transparent transition"
                        placeholder="(123) 456-7890"
                      />
                    </div>
                    
                    {/* Skills & Experience */}
                    <div>
                      <label htmlFor="skills" className="block text-sm font-semibold text-gray-700 mb-2">
                        <span className="flex items-center gap-2">
                          <FaTools className="text-green-600" />
                          Your Skills & Experience *
                        </span>
                      </label>
                      <textarea
                        id="skills"
                        name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        rows="4"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl 
                                 focus:outline-none focus:ring-2 focus:ring-green-500 
                                 focus:border-transparent transition resize-none"
                        placeholder="Describe your relevant skills, experience, and why you're interested in this opportunity..."
                        required
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        Be specific about how your skills match the opportunity requirements
                      </p>
                    </div>
                    
                    {/* Additional Message */}
                    <div>
                      <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                        <span className="flex items-center gap-2">
                          <FaComment className="text-green-600" />
                          Additional Message (Optional)
                        </span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows="4"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl 
                                 focus:outline-none focus:ring-2 focus:ring-green-500 
                                 focus:border-transparent transition resize-none"
                        placeholder="Any additional information you'd like to share, questions, or specific availability..."
                      />
                    </div>
                  </div>
                  
                  {/* Form Actions */}
                  <div className="mt-10 flex flex-col sm:flex-row gap-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 py-4 bg-gradient-to-r from-green-600 to-emerald-600 
                               text-white font-bold rounded-xl hover:shadow-xl hover:scale-105 
                               transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed
                               flex items-center justify-center gap-3"
                    >
                      {submitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <FaPaperPlane />
                          Submit Application
                        </>
                      )}
                    </button>
                    
                    <Link
                      to={`/volunteer/${id}`}
                      className="flex-1 py-4 border-2 border-gray-300 text-gray-700 
                               font-bold rounded-xl hover:bg-gray-50 transition-colors
                               flex items-center justify-center gap-3"
                    >
                      Cancel
                    </Link>
                  </div>
                  
                  <p className="text-center text-gray-500 text-sm mt-6">
                    Your application will be reviewed by the opportunity organizer. 
                    You'll receive a confirmation email upon successful submission.
                  </p>
                </form>
              </div>
            </motion.div>
          </div>
          
          {/* Right Column - Application Tips */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-8"
            >
              {/* Application Tips */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-[#0B1A33] mb-6">Application Tips</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-50 rounded-xl">
                      <div className="text-blue-600 font-bold">1</div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Be Specific</h4>
                      <p className="text-sm text-gray-600">
                        Clearly describe how your skills match the opportunity requirements
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-green-50 rounded-xl">
                      <div className="text-green-600 font-bold">2</div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Show Enthusiasm</h4>
                      <p className="text-sm text-gray-600">
                        Explain why you're passionate about this specific opportunity
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-50 rounded-xl">
                      <div className="text-purple-600 font-bold">3</div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Be Professional</h4>
                      <p className="text-sm text-gray-600">
                        Use proper grammar and proofread your application
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-orange-50 rounded-xl">
                      <div className="text-orange-600 font-bold">4</div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Availability</h4>
                      <p className="text-sm text-gray-600">
                        Mention your availability and any scheduling preferences
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* What Happens Next */}
              <div className="bg-gradient-to-br from-[#0B1A33] to-[#1a365d] rounded-2xl shadow-lg p-8 text-white">
                <h3 className="text-2xl font-bold mb-6">What Happens Next?</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <div className="text-lg font-bold">1</div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Review Process</h4>
                      <p className="text-sm text-gray-300">
                        Organizer reviews your application within 3-5 business days
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <div className="text-lg font-bold">2</div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Follow-up</h4>
                      <p className="text-sm text-gray-300">
                        You'll receive an email with next steps or interview invitation
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <div className="text-lg font-bold">3</div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Onboarding</h4>
                      <p className="text-sm text-gray-300">
                        Successful applicants undergo orientation and training
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}