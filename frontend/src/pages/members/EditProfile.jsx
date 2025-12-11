import React, { useState, useEffect } from "react";
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
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
  FaUsers,
  FaSpinner
} from "react-icons/fa";

const EditProfile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profilePicture, setProfilePicture] = useState("https://api.dicebear.com/7.x/avataaars/svg?seed=CurrentUser");
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [languages, setLanguages] = useState([]);
  const [newLanguage, setNewLanguage] = useState({ language: "", proficiency: "Beginner" });
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);

  const [formData, setFormData] = useState({
    fullName: "",
    title: "",
    profession: "",
    specialization: "",
    location: "",
    bio: "",
    email: "",
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
      profileVisibility: "members",
      contactVisibility: "members",
      activityVisibility: "public"
    }
  });

  const proficiencyLevels = ["Beginner", "Intermediate", "Advanced", "Native", "Fluent"];

  // Load user profile data on component mount
  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const response = await api.profile.getProfile();
      if (response.success && response.profile) {
        const profile = response.profile;
        
        
        // Set form data from API response
        setFormData({
          fullName: profile.full_name || `${user.first_name} ${user.surname}`,
          title: profile.title || "",
          profession: profile.profession || "",
          specialization: profile.specialization || "",
          location: profile.location || "",
          bio: profile.bio || "",
          email: user.email || "",
          phone: profile.phone || user.phone || "",
          linkedin: profile.linkedin || "",
          website: profile.website || "",
          contactPreferences: profile.contact_preferences || {
            email: true,
            phone: true,
            linkedin: true,
            inPerson: true
          },
          privacy: profile.privacy_settings || {
            profileVisibility: "members",
            contactVisibility: "members",
            activityVisibility: "public"
          }
        });

        // Set arrays from API response
        // Parse JSON fields into arrays
        setSkills(JSON.parse(profile.skills || '[]'));
        setEducation(JSON.parse(profile.education || '[]'));
        setExperience(JSON.parse(profile.experience || '[]'));
        setLanguages(JSON.parse(profile.languages || '[]'));

        
        // Set profile picture if available
        if (profile.profile_picture && profile.profile_picture !== 'default.png') {
          setProfilePicture(`/uploads/${profile.profile_picture}`);
        }
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      alert('Failed to load profile data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Profile picture must be less than 5MB');
        return;
      }
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
      
      // In a real app, you would upload to server here
      // await uploadProfilePicture(file);
    }
  };

  const handleCoverPhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('Cover photo must be less than 10MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPhoto(reader.result);
      };
      reader.readAsDataURL(file);
      
      // In a real app, you would upload to server here
      // await uploadCoverPhoto(file);
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

  const handleAddExperience = () => {
    setExperience([...experience, { position: "", company: "", duration: "" }]);
  };

  const handleExperienceChange = (index, field, value) => {
    const updated = [...experience];
    updated[index][field] = value;
    setExperience(updated);
  };

  const handleRemoveExperience = (index) => {
    if (experience.length > 1) {
      setExperience(experience.filter((_, i) => i !== index));
    }
  };

  const handleAddLanguage = () => {
    if (newLanguage.language.trim()) {
      setLanguages([...languages, { ...newLanguage }]);
      setNewLanguage({ language: "", proficiency: "Beginner" });
    }
  };

  const handleRemoveLanguage = (index) => {
    setLanguages(languages.filter((_, i) => i !== index));
  };

  const handleLanguageChange = (field, value) => {
    setNewLanguage(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const profileData = {
        full_name: formData.fullName,
        title: formData.title,
        profession: formData.profession,
        specialization: formData.specialization,
        location: formData.location,
        bio: formData.bio,
        linkedin: formData.linkedin,
        website: formData.website,
        skills: skills,
        languages: languages,
        education: education,
        experience: experience,
        contact_preferences: formData.contactPreferences,
        privacy_settings: formData.privacy,
        phone: formData.phone,
        first_name: user?.firstName || user?.first_name,
        surname: user?.surname
      };
      
      const response = await api.profile.updateProfile(profileData);
      
      if (response.success) {
        // Update user context with new phone number if changed
        if (formData.phone !== user?.phone) {
          updateUser({ phone: formData.phone });
        }
        
        alert("Profile updated successfully!");
        navigate(`/members/${user?.id}`);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert(`Failed to update profile: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="w-12 h-12 text-[#E4B84D] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading profile data...</p>
        </div>
      </div>
    );
  }

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
                  <p className="text-gray-600 text-sm mb-3">Recommended: Square image, at least 400x400 pixels. Max 5MB.</p>
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
                  placeholder="e.g., Software Engineer"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <FaBriefcase className="text-[#E4B84D]" />
                    Specialization
                  </span>
                </label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E4B84D] focus:border-transparent transition"
                  placeholder="e.g., Frontend Development"
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
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
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

            {skills.length > 0 ? (
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
            ) : (
              <p className="text-gray-500 italic">No skills added yet. Add your skills above.</p>
            )}
          </div>

          {/* Languages */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Languages</h3>
            
            <div className="mb-6">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={newLanguage.language}
                  onChange={(e) => handleLanguageChange('language', e.target.value)}
                  placeholder="Language (e.g., English)"
                  className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E4B84D] focus:border-transparent transition"
                />
                <select
                  value={newLanguage.proficiency}
                  onChange={(e) => handleLanguageChange('proficiency', e.target.value)}
                  className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E4B84D] focus:border-transparent transition"
                >
                  {proficiencyLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={handleAddLanguage}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition"
              >
                <FaPlus />
                Add Language
              </button>
            </div>

            {languages.length > 0 ? (
              <div className="space-y-3">
                {languages.map((lang, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                    <div>
                      <span className="font-medium">{lang.language}</span>
                      <span className="text-gray-500 ml-4">({lang.proficiency})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveLanguage(index)}
                      className="text-red-600 hover:bg-red-50 p-2 rounded-lg"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No languages added yet.</p>
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
              {education.length > 0 ? (
                education.map((edu, index) => (
                  <div key={index} className="grid md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Degree</label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E4B84D] focus:border-transparent"
                        placeholder="e.g., Bachelor of Science"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Institution</label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E4B84D] focus:border-transparent"
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
                          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E4B84D] focus:border-transparent"
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
                ))
              ) : (
                <p className="text-gray-500 italic text-center py-4">No education entries yet.</p>
              )}
            </div>
          </div>

          {/* Experience */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Work Experience</h3>
              <button
                type="button"
                onClick={handleAddExperience}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition"
              >
                <FaPlus />
                Add Experience
              </button>
            </div>
            
            <div className="space-y-6">
              {experience.length > 0 ? (
                experience.map((exp, index) => (
                  <div key={index} className="grid md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Position</label>
                      <input
                        type="text"
                        value={exp.position}
                        onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E4B84D] focus:border-transparent"
                        placeholder="e.g., Software Engineer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Company</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E4B84D] focus:border-transparent"
                        placeholder="Company name"
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Duration</label>
                        <input
                          type="text"
                          value={exp.duration}
                          onChange={(e) => handleExperienceChange(index, 'duration', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E4B84D] focus:border-transparent"
                          placeholder="e.g., 2020-2023"
                        />
                      </div>
                      {experience.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveExperience(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic text-center py-4">No work experience entries yet.</p>
              )}
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
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
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
                  placeholder="+1 (555) 123-4567"
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
                    <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="privacy.profileVisibility"
                        value={option.value}
                        checked={formData.privacy.profileVisibility === option.value}
                        onChange={handleChange}
                        className="w-4 h-4 text-[#E4B84D] cursor-pointer"
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
                    <label key={method} className="flex items-center justify-between cursor-pointer">
                      <span className="text-gray-700 capitalize">{method} contact</span>
                      <input
                        type="checkbox"
                        name={`contactPreferences.${method}`}
                        checked={allowed}
                        onChange={handleChange}
                        className="w-5 h-5 text-[#E4B84D] rounded cursor-pointer"
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
                  <FaSpinner className="animate-spin" />
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