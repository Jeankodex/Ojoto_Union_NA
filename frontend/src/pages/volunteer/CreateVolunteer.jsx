
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FaArrowLeft, FaSave, FaCalendarAlt, FaMapMarkerAlt,
  FaClock, FaTools, FaExclamationCircle, FaUsers
} from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api"; // ✅ IMPORT THE API

const categories = [
  { id: 'community', name: 'Community Building' },
  { id: 'education', name: 'Education & Mentoring' },
  { id: 'health', name: 'Health Services' },
  { id: 'technology', name: 'Technology' },
  { id: 'culture', name: 'Culture & Arts' },
  { id: 'relief', name: 'Emergency Relief' }
];

export default function CreateVolunteer() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    title: '',
    organization: user?.firstName ? `${user.firstName} ${user.surname}` : '',
    description: '',
    category: 'community',
    location: '',
    time_commitment: '',
    skills_needed: '',
    requirements: '',
    is_urgent: false,
    contact_email: user?.email || '',
    contact_phone: user?.phone || '',
    date: '',
    slots: 1
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.organization.trim()) newErrors.organization = 'Organization is required';
    if (!formData.description.trim() || formData.description.length < 50) 
      newErrors.description = 'Description must be at least 50 characters';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.date) newErrors.date = 'Date is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // ✅ USE THE API INSTEAD OF AXIOS DIRECTLY
      const response = await api.volunteer.createOpportunity(formData);
      
      if (response.success) {
        alert('Volunteer opportunity created successfully!');
        navigate('/volunteer');
      } else {
        throw new Error(response.error || 'Failed to create opportunity');
      }
    } catch (error) {
      console.error('Error creating opportunity:', error);
      alert(error.message || 'Failed to create opportunity. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link
            to="/volunteer"
            className="flex items-center gap-2 text-[#0B1A33] hover:text-[#E4B84D] transition-colors"
          >
            <FaArrowLeft />
            <span className="font-medium">Back to Opportunities</span>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-[#0B1A33] to-[#1a365d] p-8 text-white">
              <div className="flex items-center gap-3 mb-2">
                <FaUsers className="text-2xl text-[#E4B84D]" />
                <h1 className="text-3xl font-bold">Create Volunteer Opportunity</h1>
              </div>
              <p className="text-gray-300">Share a volunteer opportunity with the community</p>
            </div>
            
            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8">
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Opportunity Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E4B84D] transition ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Community Tutoring Program"
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>
                
                {/* Organization */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Organization/Group Name *
                  </label>
                  <input
                    type="text"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E4B84D] transition ${
                      errors.organization ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Your organization or group name"
                  />
                  {errors.organization && <p className="text-red-500 text-sm mt-1">{errors.organization}</p>}
                </div>
                
                {/* Category & Urgent */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E4B84D] transition"
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="is_urgent"
                      name="is_urgent"
                      checked={formData.is_urgent}
                      onChange={handleChange}
                      className="w-5 h-5 text-[#E4B84D] rounded focus:ring-[#E4B84D]"
                    />
                    <label htmlFor="is_urgent" className="flex items-center gap-2 text-gray-700 cursor-pointer">
                      <FaExclamationCircle className="text-orange-500" />
                      <span className="font-semibold">Mark as Urgent</span>
                    </label>
                  </div>
                </div>
                
                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="6"
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E4B84D] transition resize-none ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Describe the opportunity, responsibilities, and impact..."
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                  <p className="text-sm text-gray-500 mt-2">Minimum 50 characters</p>
                </div>
                
                {/* Location & Date */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <span className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-[#E4B84D]" />
                        Location *
                      </span>
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E4B84D] transition ${
                        errors.location ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Virtual & Ojoto Secondary School"
                    />
                    {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <span className="flex items-center gap-2">
                        <FaCalendarAlt className="text-[#E4B84D]" />
                        Date *
                      </span>
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E4B84D] transition ${
                        errors.date ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                  </div>
                </div>
                
                {/* Time Commitment & Slots */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <span className="flex items-center gap-2">
                        <FaClock className="text-[#E4B84D]" />
                        Time Commitment
                      </span>
                    </label>
                    <input
                      type="text"
                      name="time_commitment"
                      value={formData.time_commitment}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E4B84D] transition"
                      placeholder="e.g., 2-4 hours per week"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Available Slots
                    </label>
                    <input
                      type="number"
                      name="slots"
                      value={formData.slots}
                      onChange={handleChange}
                      min="1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E4B84D] transition"
                    />
                  </div>
                </div>
                
                {/* Skills Needed */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                      <FaTools className="text-[#E4B84D]" />
                      Skills Needed
                    </span>
                  </label>
                  <textarea
                    name="skills_needed"
                    value={formData.skills_needed}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E4B84D] transition resize-none"
                    placeholder="e.g., Teaching, Communication, Organization skills..."
                  />
                </div>
                
                {/* Requirements */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Requirements
                  </label>
                  <textarea
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E4B84D] transition resize-none"
                    placeholder="e.g., Background check, minimum age, specific experience..."
                  />
                </div>
                
                {/* Contact Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      name="contact_email"
                      value={formData.contact_email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E4B84D] transition"
                      placeholder="contact@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      name="contact_phone"
                      value={formData.contact_phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E4B84D] transition"
                      placeholder="(123) 456-7890"
                    />
                  </div>
                </div>
              </div>
              
              {/* Form Actions */}
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-4 bg-gradient-to-r from-[#E4B84D] to-[#FFD166] 
                           text-[#0B1A33] font-bold rounded-xl hover:shadow-xl hover:scale-105 
                           transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed
                           flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-[#0B1A33] border-t-transparent rounded-full animate-spin"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <FaSave />
                      Create Opportunity
                    </>
                  )}
                </button>
                
                <Link
                  to="/volunteer"
                  className="flex-1 py-4 border-2 border-gray-300 text-gray-700 
                           font-bold rounded-xl hover:bg-gray-50 transition-colors
                           flex items-center justify-center gap-3"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}