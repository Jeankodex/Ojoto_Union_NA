
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaSave,
  FaUpload,
  FaCamera,
  FaTrash,
  FaPlus,
  FaTimes,
  FaUser,
  FaBriefcase,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaPhone,
  FaEnvelope,
  FaLinkedin,
  FaGlobe,
  FaLanguage,
  FaAward,
  FaUsers
} from "react-icons/fa";

const EditProfile = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profilePicture, setProfilePicture] = useState("https://api.dicebear.com/7.x/avataaars/svg?seed=CurrentUser");
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [skills, setSkills] = useState(["Medicine", "Public Health", "Mentorship"]);
  const [newSkill, setNewSkill] = useState("");
  const [languages, setLanguages] = useState([{ language: "English", proficiency: "Native" }]);
  const [education, setEducation] = useState([{ degree: "", institution: "", year: "" }]);
  const [experience, setExperience] = useState([{ position: "", company: "", duration: "" }]);

  const [formData, setFormData] = useState({
    fullName: "Current User",
    title: "Your Professional Title",
    profession: "",
    specialization: "",
    location: "",
    bio: "Tell us about yourself...",
    email: "user@example.com",
    phone: "",
    linkedin: "",
    website: "",
    
    // Contact preferences
    contactPreferences: {
      email: true,
      phone: true,
      linkedin: true,
      inPerson: true
    },
    
    // Privacy settings
    privacy: {
      profileVisibility: "public", // public, members, private
      contactVisibility: "members",
      activityVisibility: "public"
    }
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleProfilePictureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In real app, upload to server and get URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverPhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleAddEducation = () => {
    setEducation([...education, { degree: "", institution: "", year: "" }]);
  };

  const handleEducationChange = (index, field, value) => {
    const updated = [...education];
    updated[index][field] = value;
    setEducation(updated);
  };

  const handleRemoveEducation = (index) => {
    if (education.length > 1) {
      setEducation(education.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Profile updated successfully!");
      navigate(`/members/1`); // In real app, navigate to user's profile
    }, 2000);
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel? Unsaved changes will be lost.")) {
      navigate("/members");
    }
  };

  const privacyOptions = [
    { value: "public", label: "Public (Anyone can view)" },
    { value: "members", label: "Members Only" },
    { value: "private", label: "Private (Only me)" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/members"
            className="inline-flex items-center gap-2 text-[#0B1A33] hover:text-[#E4B84D] transition-colors mb-6 group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Members</span>
          </Link>
          
          <div>
            <h1 className="text-4xl font-bold text-[#0B1A33] font-['Playfair_Display',_serif] mb-2">
              Edit Profile
            </h1>
            <p className="text-gray-600">Update your profile information and customize your visibility</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Cover & Profile Photos */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Profile Photos</h3>
              
              {/* Cover Photo */}
              <div className="mb-8">
                <label className="block text-lg font-semibold text-gray-800 mb-3">
                  Cover Photo
                </label>
                <div className="relative h-48 bg-gradient-to-r from-[#0B1A33] to-[#1a365d] rounded-xl overflow-hidden">
                  {coverPhoto ? (
                    <img src={coverPhoto} alt="Cover" className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-50"></div>
                  )}
                  <label className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverPhotoUpload}
                      className="hidden"
                    />
                    <div className="text-center">
                      <FaCamera className="text-3xl text-white mx-auto mb-2" />
                      <span className="text-white font-medium">Upload Cover Photo</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Profile Picture */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <img 
                    src={profilePicture} 
                    alt="Profile" 
                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                  />
                  <label className="absolute bottom-0 right-0 w-10 h-10 bg-[#E4B84D] rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-[#FFD166] transition">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureUpload}
                      className="hidden"
                    />
                    <FaCamera />
                  </label>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-2">Profile Picture</h4>
                  <p className="text-gray-600 text-sm mb-3">Recommended: Square image, at least 400x400 pixels</p>
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl cursor-pointer hover:bg-gray-200 transition">
                    <FaUpload />
                    Upload New Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Basic Information</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <FaUser className="text-[#E4B84D]" />
                    Full Name *
                  </span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E4B84D] focus:border-transparent transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <FaBriefcase className="text-[#E4B84D]" />
                    Professional Title
                  </span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E4B84D] focus:border-transparent transition"
                  placeholder="e.g., Senior Software Engineer"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <FaBriefcase className="text-[#E4B84D]" />
                    Profession *
                  </span>
                </label>
                <input
                  type="text"
                  name="profession"
                  value={formData.profession}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E4B84D] focus:border-transparent transition"
                  required
                />
              </div>

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
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E4B84D] focus:border-transparent transition"
                  placeholder="City, State/Country"
                  required
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Bio / About You
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E4B84D] focus:border-transparent transition min-h-[150px]"
                placeholder="Tell the community about yourself..."
              />
              <p className="text-sm text-gray-500 mt-2">
                Share your background, interests, and what you're looking for in the community
              </p>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Skills & Expertise</h3>
            
            <div className="mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                  placeholder="Add a skill (press Enter)"
                  className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E4B84D] focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition"
                >
                  <FaPlus />
                </button>
              </div>
            </div>

            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-blue-800 hover:text-blue-900"
                    >
                      <FaTimes size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Education */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Education</h3>
              <button
                type="button"
                onClick={handleAddEducation}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition"
              >
                <FaPlus />
                Add Education
              </button>
            </div>
            
            <div className="space-y-6">
              {education.map((edu, index) => (
                <div key={index} className="grid md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Degree</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      placeholder="e.g., Bachelor of Science"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Institution</label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      placeholder="University name"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Year</label>
                      <input
                        type="text"
                        value={edu.year}
                        onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        placeholder="e.g., 2020"
                      />
                    </div>
                    {education.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveEducation(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Contact Information</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <FaEnvelope className="text-[#E4B84D]" />
                    Email
                  </span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E4B84D] focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <FaPhone className="text-[#E4B84D]" />
                    Phone
                  </span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E4B84D] focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <FaLinkedin className="text-[#E4B84D]" />
                    LinkedIn Profile
                  </span>
                </label>
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E4B84D] focus:border-transparent transition"
                  placeholder="linkedin.com/in/username"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <FaGlobe className="text-[#E4B84D]" />
                    Personal Website
                  </span>
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E4B84D] focus:border-transparent transition"
                  placeholder="yourwebsite.com"
                />
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Privacy Settings</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Profile Visibility
                </label>
                <div className="space-y-3">
                  {privacyOptions.map((option) => (
                    <label key={option.value} className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="privacy.profileVisibility"
                        value={option.value}
                        checked={formData.privacy.profileVisibility === option.value}
                        onChange={handleChange}
                        className="w-4 h-4 text-[#E4B84D]"
                      />
                      <span className="text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Contact Preferences</h4>
                <div className="space-y-3">
                  {Object.entries(formData.contactPreferences).map(([method, allowed]) => (
                    <label key={method} className="flex items-center justify-between">
                      <span className="text-gray-700 capitalize">{method} contact</span>
                      <input
                        type="checkbox"
                        name={`contactPreferences.${method}`}
                        checked={allowed}
                        onChange={handleChange}
                        className="w-5 h-5 text-[#E4B84D] rounded"
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
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
                  Saving Changes...
                </>
              ) : (
                <>
                  <FaSave />
                  Save Profile
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={handleCancel}
              className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;