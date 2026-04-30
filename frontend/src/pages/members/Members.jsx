import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaUsers,
  FaSearch,
  FaFilter,
  FaMapMarkerAlt,
  FaBriefcase,
  FaGraduationCap,
  FaUserPlus,
  FaEdit,
  FaEye,
  FaEnvelope,
  FaLinkedin,
  FaGlobe,
  FaSortAmountDown,
  FaThLarge,
  FaList,
  FaUserCircle,
  FaPhone,
  FaCalendarAlt,
  FaSpinner
} from "react-icons/fa";
import api from "../../services/api"; // Import your API

const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("name");
  const [filters, setFilters] = useState({
    location: "",
    profession: "",
    skills: []
  });

  // Fetch real members data from backend
  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      // First, get all user profiles
      const response = await api.profile.getAllProfiles();
      
      if (response.success && Array.isArray(response.data)) {
        const membersData = response.data.map(user => {
          const profilePicture = user.profile_picture
            ? `${api.uploadBaseUrl}/uploads/profile-pictures/${user.profile_picture}`
            : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`;

          return {
            id: user.id,
            fullName: user.full_name || `${user.first_name || ''} ${user.surname || ''}`.trim() || 'Anonymous Member',
            profession: user.profession || 'Not specified',
            location: user.location || 'Location not set',
            bio: user.bio || 'No bio provided yet',
            profilePicture,
            email: user.email || '',
            phone: user.phone || '',
            linkedin: user.linkedin || '',
            website: user.website || '',
            skills: Array.isArray(user.skills) ? user.skills : [],
            joinedDate: user.created_at || new Date().toISOString(),
            isOnline: user.is_online || false
          };
        });

        setMembers(membersData);
      } else {
        throw new Error(response.error || 'Failed to fetch members');
      }
    } catch (err) {
      console.error('Error fetching members:', err);
      setError(err.message || 'Failed to load members. Please try again.');
      // Fallback: Use empty array
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  // If your API doesn't have a getAll endpoint yet, use this fallback approach:
  const fetchMembersFallback = async () => {
    setLoading(true);
    try {
      // Get current user's profile first to test connection
      const currentUser = await api.profile.getProfile();
      
      // Since we don't have a getAll endpoint, we'll show current user + empty state
      if (currentUser.success) {
        const user = currentUser.data;
        setMembers([{
          id: user.id,
          fullName: `${user.first_name || ''} ${user.surname || ''}`.trim() || 'You',
          profession: user.profession || 'Not specified',
          location: user.location || 'Location not set',
          bio: user.bio || 'No bio provided yet',
          profilePicture: user.profile_picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`,
          email: user.email || '',
          phone: user.phone || '',
          linkedin: user.linkedin || '',
          website: user.website || '',
          skills: user.skills ? JSON.parse(user.skills) : [],
          joinedDate: user.created_at || new Date().toISOString(),
          isOnline: user.is_online || false
        }]);
      }
    } catch (err) {
      console.error('Error in fallback fetch:', err);
      setError('Member directory feature is coming soon. Please check back later.');
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort members
  const filteredMembers = members
    .filter(member => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          member.fullName.toLowerCase().includes(query) ||
          member.profession.toLowerCase().includes(query) ||
          member.location.toLowerCase().includes(query) ||
          member.bio.toLowerCase().includes(query) ||
          member.skills.some(skill => skill.toLowerCase().includes(query))
        );
      }
      return true;
    })
    .filter(member => {
      if (filters.location && !member.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }
      if (filters.profession && !member.profession.toLowerCase().includes(filters.profession.toLowerCase())) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.fullName.localeCompare(b.fullName);
        case "location":
          return a.location.localeCompare(b.location);
        case "joined":
          return new Date(b.joinedDate) - new Date(a.joinedDate);
        case "profession":
          return a.profession.localeCompare(b.profession);
        default:
          return a.fullName.localeCompare(b.fullName);
      }
    });

  const handleConnect = async (memberId) => {
    try {
      // Send connection request
      // You'll need to implement this API endpoint
      alert(`Connection request would be sent to member ${memberId}`);
    } catch (err) {
      alert('Failed to send connection request');
    }
  };

  const handleSendMessage = (memberId) => {
    alert(`Opening chat with member ${memberId}`);
  };

  const locations = [...new Set(members.map(m => m.location.split(",")[0]))].filter(Boolean);
  const professions = [...new Set(members.map(m => m.profession))].filter(Boolean);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-[#E4B84D] mx-auto mb-4" />
          <p className="text-gray-600">Loading member directory...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <div className="text-6xl mb-6">👥</div>
          <h2 className="text-2xl font-bold text-[#0B1A33] mb-3">Member Directory Coming Soon</h2>
          <p className="text-gray-600 mb-6">
            The member directory feature is currently being developed. Check back soon to connect with other community members!
          </p>
          <div className="space-y-4">
            <Link
              to="/profile/edit"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#E4B84D] to-[#FFD166] text-[#0B1A33] font-bold rounded-xl hover:shadow-lg transition-all"
            >
              <FaEdit />
              Complete Your Profile First
            </Link>
            <p className="text-sm text-gray-500 mt-4">
              Complete your profile to be ready when the directory launches!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#0B1A33] to-[#1a365d] text-white pt-12 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold font-['Playfair_Display',_serif] mb-3">
                Member Directory
              </h1>
              <p className="text-gray-300 text-lg max-w-3xl">
                Connect with Ojoto Union members across North America. Network, collaborate, and build meaningful relationships.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/profile/edit"
                className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-[#E4B84D] to-[#FFD166] text-[#0B1A33] font-bold rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
              >
                <FaEdit />
                Edit My Profile
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold mb-1">{members.length}</div>
              <div className="text-gray-300 text-sm">Total Members</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold mb-1">
                {members.filter(m => m.isOnline).length}
              </div>
              <div className="text-gray-300 text-sm">Online Now</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold mb-1">
                {locations.length}
              </div>
              <div className="text-gray-300 text-sm">Locations</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold mb-1">
                {professions.length}
              </div>
              <div className="text-gray-300 text-sm">Professions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filters Bar */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search members by name, profession, location, or skills..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E4B84D] focus:border-transparent transition"
              />
            </div>

            {/* Location Filter */}
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={filters.location}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                className="w-full pl-12 pr-8 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E4B84D] focus:border-transparent appearance-none bg-white"
              >
                <option value="">All Locations</option>
                {locations.map((location, index) => (
                  <option key={index} value={location}>{location}</option>
                ))}
              </select>
            </div>

            {/* Profession Filter */}
            <div className="relative">
              <FaBriefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={filters.profession}
                onChange={(e) => setFilters(prev => ({ ...prev, profession: e.target.value }))}
                className="w-full pl-12 pr-8 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E4B84D] focus:border-transparent appearance-none bg-white"
              >
                <option value="">All Professions</option>
                {professions.map((profession, index) => (
                  <option key={index} value={profession}>{profession}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Advanced Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-4">
              <span className="text-gray-700 font-medium">View:</span>
              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition ${viewMode === "grid" ? "bg-white shadow-sm" : "hover:bg-gray-200"}`}
                >
                  <FaThLarge className={viewMode === "grid" ? "text-[#E4B84D]" : "text-gray-500"} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition ${viewMode === "list" ? "bg-white shadow-sm" : "hover:bg-gray-200"}`}
                >
                  <FaList className={viewMode === "list" ? "text-[#E4B84D]" : "text-gray-500"} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-gray-700 font-medium">Sort by:</span>
              <div className="relative">
                <FaSortAmountDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E4B84D] focus:border-transparent appearance-none bg-white"
                >
                  <option value="name">Name (A-Z)</option>
                  <option value="profession">Profession</option>
                  <option value="location">Location</option>
                  <option value="joined">Recently Joined</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(searchQuery || filters.location || filters.profession) && (
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm text-gray-600">Active filters:</span>
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  Search: "{searchQuery}"
                  <button onClick={() => setSearchQuery("")} className="text-blue-800 hover:text-blue-900">
                    ×
                  </button>
                </span>
              )}
              {filters.location && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  Location: {filters.location}
                  <button onClick={() => setFilters(prev => ({ ...prev, location: "" }))} className="text-green-800 hover:text-green-900">
                    ×
                  </button>
                </span>
              )}
              {filters.profession && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                  Profession: {filters.profession}
                  <button onClick={() => setFilters(prev => ({ ...prev, profession: "" }))} className="text-purple-800 hover:text-purple-900">
                    ×
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Members Grid/List */}
        {filteredMembers.length > 0 ? (
          <>
            {/* Results Count */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">
                {filteredMembers.length} {filteredMembers.length === 1 ? 'Member' : 'Members'} Found
              </h3>
              <div className="text-sm text-gray-600">
                Showing {filteredMembers.length} of {members.length} total members
              </div>
            </div>

            {/* Members Display */}
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMembers.map(member => (
                  <MemberCard 
                    key={member.id} 
                    member={member} 
                    viewMode={viewMode}
                    onConnect={handleConnect}
                    onMessage={handleSendMessage}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredMembers.map(member => (
                  <MemberCard 
                    key={member.id} 
                    member={member} 
                    viewMode={viewMode}
                    onConnect={handleConnect}
                    onMessage={handleSendMessage}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <FaUsers className="text-4xl text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-3">
              {members.length === 0 ? 'No Members Available Yet' : 'No Members Found'}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              {members.length === 0 
                ? 'Be the first to create a profile and connect with future members!' 
                : 'No members match your search criteria. Try adjusting your filters.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilters({ location: "", profession: "", skills: [] });
                }}
                className="px-6 py-3 bg-gradient-to-r from-[#0B1A33] to-[#1a365d] text-white font-semibold rounded-xl hover:shadow-lg transition"
              >
                Clear All Filters
              </button>
              <Link
                to="/profile/edit"
                className="px-6 py-3 bg-gradient-to-r from-[#E4B84D] to-[#FFD166] text-[#0B1A33] font-bold rounded-xl hover:shadow-lg transition"
              >
                <FaUserPlus className="inline mr-2" />
                {members.length === 0 ? 'Create Your Profile' : 'Edit Your Profile'}
              </Link>
            </div>
          </div>
        )}

        {/* Networking Tips */}
        <div className="mt-12 p-8 bg-gradient-to-r from-[#0B1A33]/5 to-[#1a365d]/5 rounded-2xl border border-gray-200">
          <h3 className="text-2xl font-bold text-[#0B1A33] mb-6 font-['Playfair_Display',_serif]">
            Networking Tips
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4 bg-white rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-3">
                <FaEnvelope className="text-xl" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Personalize Messages</h4>
              <p className="text-gray-600 text-sm">Mention specific interests or connections when reaching out.</p>
            </div>
            <div className="p-4 bg-white rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 mb-3">
                <FaBriefcase className="text-xl" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Professional Approach</h4>
              <p className="text-gray-600 text-sm">Be clear about your professional background and interests.</p>
            </div>
            <div className="p-4 bg-white rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600 mb-3">
                <FaCalendarAlt className="text-xl" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Follow Up</h4>
              <p className="text-gray-600 text-sm">Follow up on connections and maintain relationships.</p>
            </div>
            <div className="p-4 bg-white rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-3">
                <FaUsers className="text-xl" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Community First</h4>
              <p className="text-gray-600 text-sm">Focus on building genuine community relationships.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Member Card Component
const MemberCard = ({ member, viewMode, onConnect, onMessage }) => {
  return viewMode === "grid" ? (
    // Grid View Card
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Header with Online Status */}
      <div className="relative">
        <div className="h-32 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
          <div className="relative">
            <img 
              src={member.profilePicture} 
              alt={member.fullName}
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
            />
            {member.isOnline && (
              <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
        </div>
      </div>

      {/* Member Info */}
      <div className="pt-16 pb-6 px-6 text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-1">{member.fullName}</h3>
        <p className="text-[#E4B84D] font-medium mb-2">{member.profession}</p>
        
        <div className="flex items-center justify-center gap-2 text-gray-600 mb-3">
          <FaMapMarkerAlt className="text-sm" />
          <span className="text-sm">{member.location}</span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {member.bio}
        </p>

        {/* Skills */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {member.skills.slice(0, 3).map((skill, index) => (
            <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
              {skill}
            </span>
          ))}
          {member.skills.length > 3 && (
            <span className="px-3 py-1 bg-gray-200 text-gray-600 rounded-full text-xs">
              +{member.skills.length - 3} more
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link
            to={`/members/${member.id}`}
            className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
          >
            <FaEye />
            View
          </Link>
          <button
            onClick={() => onConnect(member.id)}
            className="flex-1 flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-[#E4B84D] to-[#FFD166] text-[#0B1A33] font-medium rounded-lg hover:shadow-md transition"
          >
            <FaUserPlus />
            Connect
          </button>
        </div>
      </div>
    </div>
  ) : (
    // List View Card
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        {/* Avatar */}
        <div className="relative">
          <img 
            src={member.profilePicture} 
            alt={member.fullName}
            className="w-20 h-20 rounded-full border-4 border-gray-100"
          />
          {member.isOnline && (
            <div className="absolute bottom-2 right-2 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
            <div>
              <h3 className="text-xl font-bold text-gray-800">{member.fullName}</h3>
              <div className="flex items-center gap-4 mt-1">
                <span className="text-[#E4B84D] font-medium">{member.profession}</span>
                <span className="flex items-center gap-1 text-gray-600 text-sm">
                  <FaMapMarkerAlt />
                  {member.location}
                </span>
                <span className="flex items-center gap-1 text-gray-600 text-sm">
                  <FaCalendarAlt />
                  Joined {new Date(member.joinedDate).getFullYear()}
                </span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Link
                to={`/members/${member.id}`}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
              >
                View Profile
              </Link>
              <button
                onClick={() => onConnect(member.id)}
                className="px-4 py-2 bg-gradient-to-r from-[#E4B84D] to-[#FFD166] text-[#0B1A33] font-medium rounded-lg hover:shadow-md transition"
              >
                Connect
              </button>
            </div>
          </div>

          {/* Bio and Skills */}
          <p className="text-gray-600 mb-3">{member.bio}</p>
          
          <div className="flex flex-wrap gap-2">
            {member.skills.map((skill, index) => (
              <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>

          {/* Contact Icons */}
          <div className="flex gap-4 mt-4 pt-4 border-t border-gray-100">
            {member.email && (
              <a href={`mailto:${member.email}`} className="text-gray-500 hover:text-[#E4B84D] transition">
                <FaEnvelope />
              </a>
            )}
            {member.linkedin && (
              <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 transition">
                <FaLinkedin />
              </a>
            )}
            {member.website && (
              <a href={member.website} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-green-600 transition">
                <FaGlobe />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Members;