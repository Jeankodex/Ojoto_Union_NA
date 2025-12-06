
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
  FaCalendarAlt
} from "react-icons/fa";

const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [sortBy, setSortBy] = useState("name"); // name, location, joined
  const [filters, setFilters] = useState({
    location: "",
    profession: "",
    skills: []
  });
  const [activeFilters, setActiveFilters] = useState([]);

  // Mock data - in real app, this would come from API
  useEffect(() => {
    setTimeout(() => {
      setMembers([
        {
          id: 1,
          fullName: "Dr. Chinedu Okeke",
          profession: "Medical Doctor",
          location: "New York, USA",
          bio: "Specialized in Internal Medicine with 10+ years experience. Passionate about community health initiatives.",
          profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chinedu",
          email: "chinedu.okeke@example.com",
          phone: "+1 (555) 123-4567",
          linkedin: "linkedin.com/in/chineduokeke",
          website: "drchinedu.com",
          skills: ["Medicine", "Public Health", "Mentorship"],
          joinedDate: "2022-05-15",
          isOnline: true
        },
        {
          id: 2,
          fullName: "Amina Bello",
          profession: "Software Engineer",
          location: "Toronto, Canada",
          bio: "Full-stack developer specializing in React and Node.js. Currently working at a tech startup.",
          profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amina",
          email: "amina.bello@example.com",
          phone: "+1 (416) 987-6543",
          linkedin: "linkedin.com/in/aminabello",
          website: "amina.dev",
          skills: ["React", "Node.js", "Python", "AWS"],
          joinedDate: "2023-01-20",
          isOnline: false
        },
        {
          id: 3,
          fullName: "Tunde Adeyemi",
          profession: "Business Consultant",
          location: "Houston, Texas",
          bio: "Helping businesses scale through strategic planning and digital transformation.",
          profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tunde",
          email: "tunde.adeyemi@example.com",
          phone: "+1 (713) 456-7890",
          linkedin: "linkedin.com/in/tundeadeyemi",
          website: "tundeconsulting.com",
          skills: ["Business Strategy", "Digital Marketing", "Leadership"],
          joinedDate: "2021-11-08",
          isOnline: true
        },
        {
          id: 4,
          fullName: "Chioma Eze",
          profession: "University Professor",
          location: "London, UK",
          bio: "Professor of African Studies. Research focuses on cultural preservation and diaspora communities.",
          profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chioma",
          email: "chioma.eze@example.com",
          phone: "+44 20 1234 5678",
          linkedin: "linkedin.com/in/chiomaeze",
          website: "profchioma.ac.uk",
          skills: ["Research", "Teaching", "Cultural Studies"],
          joinedDate: "2020-08-12",
          isOnline: false
        },
        {
          id: 5,
          fullName: "Emeka Nwosu",
          profession: "Architect",
          location: "Atlanta, Georgia",
          bio: "Sustainable architecture designer with award-winning projects across North America.",
          profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emeka",
          email: "emeka.nwosu@example.com",
          phone: "+1 (404) 555-1234",
          linkedin: "linkedin.com/in/emekanwosu",
          website: "nwosuarchitects.com",
          skills: ["Architecture", "Sustainability", "Project Management"],
          joinedDate: "2023-03-25",
          isOnline: true
        },
        {
          id: 6,
          fullName: "Ngozi Okoro",
          profession: "Nurse Practitioner",
          location: "Chicago, Illinois",
          bio: "Providing quality healthcare with focus on preventive medicine and patient education.",
          profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ngozi",
          email: "ngozi.okoro@example.com",
          phone: "+1 (312) 987-6543",
          linkedin: "linkedin.com/in/ngoziokoro",
          website: "",
          skills: ["Healthcare", "Patient Care", "Education"],
          joinedDate: "2022-09-30",
          isOnline: false
        }
      ]);
      setLoading(false);
    }, 1500);
  }, []);

  // Filter and sort members
  const filteredMembers = members
    .filter(member => {
      // Search filter
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
      // Location filter
      if (filters.location && !member.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }
      // Profession filter
      if (filters.profession && !member.profession.toLowerCase().includes(filters.profession.toLowerCase())) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      // Sorting
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

  const handleConnect = (memberId) => {
    // In real app, this would send connection request
    alert(`Connection request sent to member ${memberId}`);
  };

  const handleSendMessage = (memberId) => {
    // In real app, this would open message modal
    alert(`Opening chat with member ${memberId}`);
  };

  const locations = [...new Set(members.map(m => m.location.split(",")[0]))];
  const professions = [...new Set(members.map(m => m.profession))];

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
              <div className="text-gray-300 text-sm">Cities</div>
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
        {loading ? (
          <div className="text-center py-16">
            <div className="w-12 h-12 border-4 border-[#E4B84D] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading members...</p>
          </div>
        ) : filteredMembers.length > 0 ? (
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
            <h3 className="text-2xl font-semibold text-gray-700 mb-3">No Members Found</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              {searchQuery || filters.location || filters.profession
                ? "No members match your search criteria. Try adjusting your filters."
                : "No public member profiles available yet."
              }
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
                Create Your Profile
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