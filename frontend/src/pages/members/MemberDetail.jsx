
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaBriefcase,
  FaGraduationCap,
  FaEnvelope,
  FaPhone,
  FaLinkedin,
  FaGlobe,
  FaCalendarAlt,
  FaUserPlus,
  FaComment,
  FaShare,
  FaFlag,
  FaUsers,
  FaStar,
  FaAward,
  FaLanguage,
  FaHeart,
  FaDownload,
  FaPaperPlane,
  FaEdit,
  FaSpinner,
  FaBuilding,
  FaCertificate,
  FaHistory
} from "react-icons/fa";

const MemberDetail = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("about");
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null); // null, 'pending', 'accepted'

  
  // Fetch member data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.profile.getUser(id);
        if (!response.success || !response.user) {
          setError("Member not found");
          return;
        }

        const user = response.user;

        setMember({
          ...user,
          skills: JSON.parse(user.skills || "[]"),
          education: JSON.parse(user.education || "[]"),
          experience: JSON.parse(user.experience || "[]"),
          languages: JSON.parse(user.languages || "[]"),
          contact_preferences: JSON.parse(user.contact_preferences || "{}"),
        });

        checkConnectionStatus(user);
      } catch (err) {
        setError("Failed to fetch member profile");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]); // <-- Closing brace was missing here

  const checkConnectionStatus = async () => {
    // This would be a real API call to check if users are connected
    // For now, using mock logic
    if (currentUser && currentUser.id === parseInt(id)) {
      setIsConnected(true);
      setConnectionStatus('self');
    } else {
      // Simulate API call to check connection status
      setTimeout(() => {
        const statuses = [null, 'pending', 'accepted'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        setConnectionStatus(randomStatus);
        setIsConnected(randomStatus === 'accepted');
      }, 500);
    }
  };

  // Rest of your code remains the same...
  // [All the remaining code stays exactly as you have it]
  const handleConnect = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    try {
      // In real app: await api.connections.sendRequest(id);
      setConnectionStatus('pending');
      alert(`Connection request sent to ${member?.full_name || member?.first_name}`);
    } catch (error) {
      console.error('Failed to send connection request:', error);
      alert('Failed to send connection request. Please try again.');
    }
  };

  const handleSendMessage = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    // Navigate to messages or open chat
    navigate(`/messages?user=${id}`);
  };

  const handleReport = () => {
    if (window.confirm(`Report ${member?.full_name}'s profile? This will be reviewed by administrators.`)) {
      // In real app: await api.reports.create({ userId: id, reason: 'profile' });
      alert("Profile reported. Our team will review it shortly.");
    }
  };

  const handleEditProfile = () => {
    navigate('/profile/edit');
  };

  const handleExportContact = () => {
    if (!member) return;
    
    const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${member.full_name}
N:${member.surname};${member.first_name}
ORG:Ojoto Union North America
TITLE:${member.title}
ROLE:${member.profession}
EMAIL:${member.email}
TEL:${member.phone}
ADR:;;${member.location};;;
URL:${member.website}
NOTE:${member.bio?.substring(0, 100)}...
END:VCARD`;

    const blob = new Blob([vCard], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${member.full_name.replace(/\s+/g, '_')}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getProficiencyColor = (proficiency) => {
    const colors = {
      'Beginner': 'bg-red-100 text-red-800',
      'Intermediate': 'bg-yellow-100 text-yellow-800',
      'Advanced': 'bg-blue-100 text-blue-800',
      'Expert': 'bg-green-100 text-green-800',
      'Native': 'bg-purple-100 text-purple-800',
      'Fluent': 'bg-indigo-100 text-indigo-800'
    };
    return colors[proficiency] || 'bg-gray-100 text-gray-800';
  };

  const getProficiencyWidth = (proficiency) => {
    const widths = {
      'Beginner': '25%',
      'Intermediate': '50%',
      'Advanced': '75%',
      'Expert': '100%',
      'Native': '100%',
      'Fluent': '90%'
    };
    return widths[proficiency] || '50%';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="w-12 h-12 text-[#E4B84D] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading member profile...</p>
        </div>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Member Not Found</h2>
          <p className="text-gray-600 mb-6">
            {error || "The member profile you're looking for doesn't exist or has been removed."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link 
              to="/members" 
              className="px-6 py-3 bg-gradient-to-r from-[#E4B84D] to-[#FFD166] text-[#0B1A33] font-bold rounded-xl hover:shadow-lg transition"
            >
              Back to Members Directory
            </Link>
            <Link 
              to="/" 
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
            >
              Go to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser && currentUser.id === parseInt(id);
  const canContact = member.contact_preferences?.email || 
                    member.contact_preferences?.phone || 
                    member.contact_preferences?.linkedin;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Cover Photo */}
      <div className="relative h-64 md:h-80 bg-gradient-to-r from-[#0B1A33] to-[#1a365d]">
        <div className="absolute inset-0 bg-black/40"></div>
        {member.cover_photo ? (
          <img 
            src={member.cover_photo} 
            alt="Cover" 
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />
        ) : null}
        
        {/* Back Button */}
        <div className="absolute top-6 left-6">
          <Link 
            to="/members"
            className="inline-flex items-center gap-2 text-white hover:text-[#E4B84D] transition-colors group bg-black/30 backdrop-blur-sm px-4 py-2 rounded-xl"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Members</span>
          </Link>
        </div>

        {/* Edit Button for own profile */}
        {isOwnProfile && (
          <div className="absolute top-6 right-6">
            <button
              onClick={handleEditProfile}
              className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm text-[#0B1A33] hover:bg-white px-4 py-2 rounded-xl font-semibold transition"
            >
              <FaEdit />
              Edit Profile
            </button>
          </div>
        )}
      </div>

      {/* Profile Header */}
      <div className="max-w-6xl mx-auto px-4 -mt-20 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Profile Header Content */}
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Profile Picture */}
              <div className="relative">
                <img 
                  src={member.profile_picture && member.profile_picture !== 'default.png' 
                    ? `/uploads/${member.profile_picture}` 
                    : `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.full_name || member.username}`
                  }
                  alt={member.full_name}
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg"
                />
                {member.is_online && (
                  <div className="absolute bottom-4 right-4 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                )}
                {member.is_verified && (
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg">
                    <FaStar size={16} />
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {member.full_name || `${member.first_name} ${member.surname}`}
                    </h1>
                    <p className="text-xl text-[#E4B84D] font-medium mb-2">{member.title}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                      <span className="flex items-center gap-2">
                        <FaMapMarkerAlt />
                        {member.location || 'Location not specified'}
                      </span>
                      <span className="flex items-center gap-2">
                        <FaBriefcase />
                        {member.profession || 'Profession not specified'}
                      </span>
                      {member.specialization && (
                        <span className="flex items-center gap-2">
                          <FaCertificate />
                          {member.specialization}
                        </span>
                      )}
                      <span className="flex items-center gap-2">
                        <FaCalendarAlt />
                        Member since {formatDate(member.created_at)}
                      </span>
                    </div>

                    {/* Status Badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Active Member
                      </div>
                      {member.role === 'admin' && (
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full">
                          <FaStar size={12} />
                          Administrator
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    {!isOwnProfile ? (
                      <>
                        {connectionStatus === 'accepted' ? (
                          <button
                            disabled
                            className="flex items-center gap-2 px-5 py-3 bg-gray-200 text-gray-600 rounded-xl font-semibold cursor-not-allowed"
                          >
                            <FaUserPlus />
                            Connected
                          </button>
                        ) : connectionStatus === 'pending' ? (
                          <button
                            disabled
                            className="flex items-center gap-2 px-5 py-3 bg-yellow-100 text-yellow-800 rounded-xl font-semibold cursor-not-allowed"
                          >
                            <FaUserPlus />
                            Request Pending
                          </button>
                        ) : (
                          <button
                            onClick={handleConnect}
                            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#E4B84D] to-[#FFD166] text-[#0B1A33] rounded-xl font-semibold hover:shadow-lg transition"
                          >
                            <FaUserPlus />
                            Connect
                          </button>
                        )}
                        
                        <button
                          onClick={handleSendMessage}
                          disabled={!canContact}
                          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition ${
                            canContact
                              ? 'bg-[#0B1A33] text-white hover:bg-[#1a365d]'
                              : 'bg-gray-200 text-gray-600 cursor-not-allowed'
                          }`}
                          title={!canContact ? "This member has disabled messaging" : ""}
                        >
                          <FaComment />
                          Message
                        </button>
                        
                        <button className="flex items-center gap-2 px-5 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition">
                          <FaShare />
                          Share
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={handleEditProfile}
                        className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#E4B84D] to-[#FFD166] text-[#0B1A33] rounded-xl font-semibold hover:shadow-lg transition"
                      >
                        <FaEdit />
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-t border-gray-200">
            <div className="flex overflow-x-auto">
              {['about', 'experience', 'skills', 'education', 'languages'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 font-medium whitespace-nowrap transition-colors border-b-2 ${
                    activeTab === tab
                      ? 'border-[#E4B84D] text-[#E4B84D]'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tab Content */}
            {activeTab === 'about' && (
              <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">About</h3>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {member.bio || 'No biography provided yet.'}
                  </p>
                  
                  {member.specialization && (
                    <div className="mb-6">
                      <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <FaCertificate className="text-[#E4B84D]" />
                        Specialization
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl">
                          {member.specialization}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'experience' && (
              <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Professional Experience</h3>
                <div className="space-y-6">
                  {member.experience && member.experience.length > 0 ? (
                    member.experience.map((exp, index) => (
                      <div key={index} className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-lg font-bold text-gray-800">{exp.position}</h4>
                            <p className="text-gray-600">{exp.company}</p>
                            {exp.description && (
                              <p className="text-gray-500 text-sm mt-2">{exp.description}</p>
                            )}
                          </div>
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm whitespace-nowrap">
                            {exp.duration}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <FaBuilding className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No work experience added yet.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Skills & Expertise</h3>
                <div className="space-y-6">
                  {member.skills && member.skills.length > 0 ? (
                    member.skills.map((skill, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-800">{skill}</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-[#E4B84D] to-[#FFD166]"
                            style={{ width: '100%' }}
                          ></div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <FaAward className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No skills added yet.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'education' && (
              <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Education</h3>
                <div className="space-y-6">
                  {member.education && member.education.length > 0 ? (
                    member.education.map((edu, index) => (
                      <div key={index} className="border-l-4 border-[#E4B84D] pl-6 py-4">
                        <div className="font-semibold text-gray-800 text-lg">{edu.degree}</div>
                        <div className="text-gray-600">{edu.institution}</div>
                        <div className="text-sm text-gray-500">{edu.year}</div>
                        {edu.description && (
                          <p className="text-gray-500 mt-2">{edu.description}</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <FaGraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No education history added yet.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'languages' && (
              <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Languages</h3>
                <div className="space-y-6">
                  {member.languages && member.languages.length > 0 ? (
                    member.languages.map((lang, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-800">{lang.language}</span>
                          <span className={`px-3 py-1 rounded-full text-sm ${getProficiencyColor(lang.proficiency)}`}>
                            {lang.proficiency}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getProficiencyColor(lang.proficiency).split(' ')[0]}`}
                            style={{ width: getProficiencyWidth(lang.proficiency) }}
                          ></div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <FaLanguage className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No languages added yet.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Contact Information</h3>
              <div className="space-y-4">
                {member.email && member.contact_preferences?.email && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
                      <FaEnvelope />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm text-gray-500">Email</div>
                      <a 
                        href={`mailto:${member.email}`} 
                        className="text-gray-800 hover:text-[#E4B84D] transition truncate block"
                      >
                        {member.email}
                      </a>
                    </div>
                  </div>
                )}

                {member.phone && member.contact_preferences?.phone && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 flex-shrink-0">
                      <FaPhone />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm text-gray-500">Phone</div>
                      <a 
                        href={`tel:${member.phone}`} 
                        className="text-gray-800 hover:text-[#E4B84D] transition truncate block"
                      >
                        {member.phone}
                      </a>
                    </div>
                  </div>
                )}

                {member.linkedin && member.contact_preferences?.linkedin && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
                      <FaLinkedin />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm text-gray-500">LinkedIn</div>
                      <a 
                        href={member.linkedin.startsWith('http') ? member.linkedin : `https://${member.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-800 hover:text-blue-600 transition truncate block"
                      >
                        View Profile
                      </a>
                    </div>
                  </div>
                )}

                {member.website && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 flex-shrink-0">
                      <FaGlobe />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm text-gray-500">Website</div>
                      <a 
                        href={member.website.startsWith('http') ? member.website : `https://${member.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-800 hover:text-purple-600 transition truncate block"
                      >
                        Visit Website
                      </a>
                    </div>
                  </div>
                )}

                {!canContact && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <p className="text-sm text-yellow-700">
                      This member has limited their contact preferences.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Community Stats */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Community Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600">
                    {member.connections_count || 0}
                  </div>
                  <div className="text-sm text-gray-600">Connections</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="text-2xl font-bold text-green-600">
                    {member.posts_count || 0}
                  </div>
                  <div className="text-sm text-gray-600">Posts</div>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-xl">
                  <div className="text-2xl font-bold text-amber-600">
                    {member.questions_count || 0}
                  </div>
                  <div className="text-sm text-gray-600">Questions</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <div className="text-2xl font-bold text-purple-600">
                    {member.events_attended || 0}
                  </div>
                  <div className="text-sm text-gray-600">Events</div>
                </div>
              </div>
            </div>

            {/* Last Active */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
                    <FaHistory />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Last Active</div>
                    <div className="font-medium text-gray-800">
                      {member.last_active ? formatDate(member.last_active) : 'Recently'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
                    <FaUsers />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Member Since</div>
                    <div className="font-medium text-gray-800">{formatDate(member.created_at)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Export/Report */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
              <div className="space-y-3">
                <button
                  onClick={handleExportContact}
                  className="w-full flex items-center justify-center gap-2 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition"
                >
                  <FaDownload />
                  Export Contact
                </button>
                {!isOwnProfile && (
                  <button
                    onClick={handleReport}
                    className="w-full flex items-center justify-center gap-2 py-3 border border-red-300 text-red-600 rounded-xl hover:bg-red-50 transition"
                  >
                    <FaFlag />
                    Report Profile
                  </button>
                )}
              </div>
            </div>

            {/* Contact Preferences */}
            {!isOwnProfile && member.contact_preferences && (
              <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Contact Preferences</h3>
                <div className="space-y-3">
                  {Object.entries(member.contact_preferences).map(([method, allowed]) => (
                    <div key={method} className="flex items-center justify-between">
                      <span className="text-gray-700 capitalize">{method.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        allowed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {allowed ? 'Allowed' : 'Not Allowed'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDetail;