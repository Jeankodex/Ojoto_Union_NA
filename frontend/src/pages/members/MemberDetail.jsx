import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
  FaComment, // Changed from FaMessage
  FaShare,
  FaFlag,
  FaUsers,
  FaStar,
  FaAward,
  FaLanguage,
  FaHeart,
  FaDownload,
  FaPaperPlane
} from "react-icons/fa";
import { SiGooglescholar } from "react-icons/si";

const MemberDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");
  const [isConnected, setIsConnected] = useState(false);

  // Mock data - in real app, fetch from API based on id
  useEffect(() => {
    setTimeout(() => {
      setMember({
        id: 1,
        fullName: "Dr. Chinedu Okeke",
        title: "Medical Doctor | Healthcare Consultant",
        profession: "Medical Doctor",
        specialization: "Internal Medicine",
        location: "New York, USA",
        bio: "Specialized in Internal Medicine with over 10 years of clinical experience. Currently serving as Chief Medical Officer at New York General Hospital. Passionate about community health initiatives and medical education. Active member of Ojoto Union since 2022, contributing to health outreach programs.",
        profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chinedu",
        coverPhoto: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        email: "chinedu.okeke@example.com",
        phone: "+1 (555) 123-4567",
        linkedin: "linkedin.com/in/chineduokeke",
        website: "drchineduokeke.com",
        joinDate: "2022-05-15",
        memberStatus: "Active Member",
        isOnline: true,
        isVerified: true,
        
        // Professional Details
        education: [
          { degree: "MD Medicine", institution: "University of Lagos", year: "2010" },
          { degree: "MSc Public Health", institution: "Harvard University", year: "2014" },
          { degree: "Board Certification", institution: "American Board of Internal Medicine", year: "2016" }
        ],
        
        experience: [
          { position: "Chief Medical Officer", company: "New York General Hospital", duration: "2018-Present" },
          { position: "Senior Consultant", company: "Mount Sinai Hospital", duration: "2014-2018" },
          { position: "Resident Physician", company: "Johns Hopkins Hospital", duration: "2010-2014" }
        ],
        
        skills: [
          { name: "Internal Medicine", level: "Expert" },
          { name: "Public Health", level: "Expert" },
          { name: "Medical Education", level: "Advanced" },
          { name: "Healthcare Management", level: "Advanced" },
          { name: "Clinical Research", level: "Intermediate" }
        ],
        
        languages: [
          { language: "English", proficiency: "Native" },
          { language: "Igbo", proficiency: "Fluent" },
          { language: "French", proficiency: "Intermediate" }
        ],
        
        communityInvolvement: [
          "Health Committee Coordinator (2023-Present)",
          "Annual Health Fair Organizer",
          "Medical Mentorship Program Lead"
        ],
        
        certifications: [
          "American Board of Internal Medicine Certification",
          "Advanced Cardiac Life Support (ACLS)",
          "Basic Life Support (BLS)"
        ],
        
        // Network stats
        connections: 147,
        mutualConnections: 12,
        posts: 24,
        eventsAttended: 8,
        
        // Contact preferences
        contactPreferences: {
          email: true,
          phone: false,
          linkedin: true,
          inPerson: true
        }
      });
      setLoading(false);
    }, 1500);
  }, [id]);

  const handleConnect = () => {
    setIsConnected(true);
    alert(`Connection request sent to ${member?.fullName}`);
  };

  const handleSendMessage = () => {
    navigate(`/messages/${id}`);
  };

  const handleReport = () => {
    if (window.confirm(`Report ${member?.fullName}'s profile? This will be reviewed by administrators.`)) {
      alert("Profile reported. Our team will review it shortly.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#E4B84D] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading member profile...</p>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Member Not Found</h2>
          <p className="text-gray-600 mb-6">The member profile you're looking for doesn't exist or has been removed.</p>
          <Link to="/members" className="px-6 py-3 bg-gradient-to-r from-[#E4B84D] to-[#FFD166] text-[#0B1A33] font-bold rounded-xl hover:shadow-lg transition">
            Back to Members Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Cover Photo */}
      <div className="relative h-64 md:h-80 bg-gradient-to-r from-[#0B1A33] to-[#1a365d]">
        <div className="absolute inset-0 bg-black/40"></div>
        {member.coverPhoto && (
          <img 
            src={member.coverPhoto} 
            alt="Cover" 
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />
        )}
        
        {/* Back Button */}
        <div className="absolute top-6 left-6">
          <Link 
            to="/members"
            className="inline-flex items-center gap-2 text-white hover:text-[#E4B84D] transition-colors group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Members</span>
          </Link>
        </div>
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
                  src={member.profilePicture} 
                  alt={member.fullName}
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg"
                />
                {member.isOnline && (
                  <div className="absolute bottom-4 right-4 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                )}
                {member.isVerified && (
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                    <FaStar size={16} />
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{member.fullName}</h1>
                    <p className="text-xl text-[#E4B84D] font-medium mb-2">{member.title}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                      <span className="flex items-center gap-2">
                        <FaMapMarkerAlt />
                        {member.location}
                      </span>
                      <span className="flex items-center gap-2">
                        <FaBriefcase />
                        {member.profession}
                      </span>
                      <span className="flex items-center gap-2">
                        <FaCalendarAlt />
                        Member since {new Date(member.joinDate).getFullYear()}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full mb-4">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      {member.memberStatus}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={handleConnect}
                      disabled={isConnected}
                      className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition ${
                        isConnected
                          ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                          : 'bg-gradient-to-r from-[#E4B84D] to-[#FFD166] text-[#0B1A33] hover:shadow-lg'
                      }`}
                    >
                      <FaUserPlus />
                      {isConnected ? 'Connected' : 'Connect'}
                    </button>
                    
                    <button
                      onClick={handleSendMessage}
                      className="flex items-center gap-2 px-5 py-3 bg-[#0B1A33] text-white rounded-xl font-semibold hover:bg-[#1a365d] transition"
                    >
                      <FaComment /> {/* Changed from FaMessage */}
                      Message
                    </button>
                    
                    <button className="flex items-center gap-2 px-5 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition">
                      <FaShare />
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-t border-gray-200">
            <div className="flex overflow-x-auto">
              {['about', 'experience', 'skills', 'community'].map((tab) => (
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
                  <p className="text-gray-700 leading-relaxed mb-6">{member.bio}</p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Education */}
                    <div>
                      <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <FaGraduationCap className="text-[#E4B84D]" />
                        Education
                      </h4>
                      <div className="space-y-4">
                        {member.education.map((edu, index) => (
                          <div key={index} className="border-l-4 border-[#E4B84D] pl-4">
                            <div className="font-semibold text-gray-800">{edu.degree}</div>
                            <div className="text-gray-600">{edu.institution}</div>
                            <div className="text-sm text-gray-500">{edu.year}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Languages */}
                    <div>
                      <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <FaLanguage className="text-[#E4B84D]" />
                        Languages
                      </h4>
                      <div className="space-y-3">
                        {member.languages.map((lang, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-gray-700">{lang.language}</span>
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                              {lang.proficiency}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Certifications */}
                  <div className="mt-8">
                    <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <FaAward className="text-[#E4B84D]" />
                      Certifications
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {member.certifications.map((cert, index) => (
                        <span key={index} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl">
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'experience' && (
              <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Professional Experience</h3>
                <div className="space-y-6">
                  {member.experience.map((exp, index) => (
                    <div key={index} className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-lg font-bold text-gray-800">{exp.position}</h4>
                          <p className="text-gray-600">{exp.company}</p>
                        </div>
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                          {exp.duration}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Skills & Expertise</h3>
                <div className="space-y-6">
                  {member.skills.map((skill, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-800">{skill.name}</span>
                        <span className="text-gray-600">{skill.level}</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            skill.level === 'Expert' ? 'w-full bg-green-500' :
                            skill.level === 'Advanced' ? 'w-3/4 bg-blue-500' :
                            'w-1/2 bg-amber-500'
                          }`}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'community' && (
              <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Community Involvement</h3>
                <div className="space-y-4">
                  {member.communityInvolvement.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                      <FaUsers className="text-[#E4B84D] mt-1" />
                      <span className="text-gray-700">{activity}</span>
                    </div>
                  ))}
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
                {member.email && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                      <FaEnvelope />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Email</div>
                      <a href={`mailto:${member.email}`} className="text-gray-800 hover:text-[#E4B84D] transition">
                        {member.email}
                      </a>
                    </div>
                  </div>
                )}

                {member.phone && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                      <FaPhone />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Phone</div>
                      <a href={`tel:${member.phone}`} className="text-gray-800 hover:text-[#E4B84D] transition">
                        {member.phone}
                      </a>
                    </div>
                  </div>
                )}

                {member.linkedin && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                      <FaLinkedin />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">LinkedIn</div>
                      <a 
                        href={member.linkedin.startsWith('http') ? member.linkedin : `https://${member.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-800 hover:text-blue-600 transition"
                      >
                        View Profile
                      </a>
                    </div>
                  </div>
                )}

                {member.website && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                      <FaGlobe />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Website</div>
                      <a 
                        href={member.website.startsWith('http') ? member.website : `https://${member.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-800 hover:text-purple-600 transition"
                      >
                        Visit Website
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Community Stats */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Community Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600">{member.connections}</div>
                  <div className="text-sm text-gray-600">Connections</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="text-2xl font-bold text-green-600">{member.posts}</div>
                  <div className="text-sm text-gray-600">Posts</div>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-xl">
                  <div className="text-2xl font-bold text-amber-600">{member.mutualConnections}</div>
                  <div className="text-sm text-gray-600">Mutual</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <div className="text-2xl font-bold text-purple-600">{member.eventsAttended}</div>
                  <div className="text-sm text-gray-600">Events</div>
                </div>
              </div>
            </div>

            {/* Export/Report */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center gap-2 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition">
                  <FaDownload />
                  Export Contact
                </button>
                <button
                  onClick={handleReport}
                  className="w-full flex items-center justify-center gap-2 py-3 border border-red-300 text-red-600 rounded-xl hover:bg-red-50 transition"
                >
                  <FaFlag />
                  Report Profile
                </button>
              </div>
            </div>

            {/* Contact Preferences */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Contact Preferences</h3>
              <div className="space-y-3">
                {Object.entries(member.contactPreferences).map(([method, allowed]) => (
                  <div key={method} className="flex items-center justify-between">
                    <span className="text-gray-700 capitalize">{method}</span>
                    <span className={`px-3 py-1 rounded-full text-sm ${allowed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                      {allowed ? 'Allowed' : 'Not Allowed'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDetail;