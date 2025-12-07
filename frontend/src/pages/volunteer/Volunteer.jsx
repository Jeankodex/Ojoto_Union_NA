
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaHandsHelping, FaSearch, FaFilter, FaMapMarkerAlt, 
  FaClock, FaTools, FaCalendarAlt, FaUsers,
  FaGraduationCap, FaHeart, FaTree, FaPlus,
  FaExclamationCircle, FaBuilding, FaInfoCircle,
  FaPaperPlane, FaArrowRight
} from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";

// Mock data - replace with API calls
const mockOpportunities = [
  {
    id: 1,
    title: "Community Tutoring Program",
    organization: "Ojoto Union NA Education Committee",
    description: "Provide academic support to students in math, science, and English. Help shape the future of our youth through personalized tutoring sessions.",
    location: "Virtual & Ojoto Secondary School",
    time_commitment: "2-4 hours per week",
    skills_needed: "Teaching, Math, Science, English, Patience",
    category: "education",
    is_urgent: false,
    applications_count: 12,
    created_at: "2024-01-15",
    created_by: "Education Committee"
  },
  {
    id: 2,
    title: "Medical Outreach Volunteers",
    organization: "Ojoto Health Initiative",
    description: "Assist in organizing and running medical outreach programs in rural communities. Roles include registration, triage, and patient support.",
    location: "Ojoto Health Center & Surrounding Villages",
    time_commitment: "Full day events (monthly)",
    skills_needed: "Medical background, Organization, Communication",
    category: "health",
    is_urgent: true,
    applications_count: 8,
    created_at: "2024-01-10",
    created_by: "Health Committee"
  },
  {
    id: 3,
    title: "Road Rehabilitation Project",
    organization: "Community Development Team",
    description: "Join hands in improving our community infrastructure. Help with road rehabilitation projects across Ojoto.",
    location: "Ojoto Town",
    time_commitment: "Weekends (flexible)",
    skills_needed: "Construction, Engineering, Teamwork",
    category: "community",
    is_urgent: false,
    applications_count: 25,
    created_at: "2024-01-05",
    created_by: "Development Committee"
  },
  {
    id: 4,
    title: "Youth Tech Mentorship",
    organization: "Ojoto Tech Hub",
    description: "Mentor young people in digital skills. Share your expertise in programming, design, or digital literacy.",
    location: "St. Paul's Tech Hub, Ojoto",
    time_commitment: "3 hours weekly",
    skills_needed: "Programming, Design, Mentoring",
    category: "technology",
    is_urgent: false,
    applications_count: 15,
    created_at: "2024-01-12",
    created_by: "Tech Committee"
  },
  {
    id: 5,
    title: "Cultural Festival Organizers",
    organization: "Cultural Affairs Committee",
    description: "Help organize our annual cultural festival celebrating Ojoto heritage. Roles include planning, logistics, and coordination.",
    location: "Ojoto Town Hall & Community Grounds",
    time_commitment: "5-10 hours weekly (leading up to event)",
    skills_needed: "Event Planning, Organization, Creativity",
    category: "culture",
    is_urgent: false,
    applications_count: 18,
    created_at: "2024-01-08",
    created_by: "Cultural Committee"
  },
  {
    id: 6,
    title: "Emergency Relief Distribution",
    organization: "Ojoto Relief Foundation",
    description: "Urgent need for volunteers to distribute relief materials to affected communities. Immediate assistance required.",
    location: "Flood-Affected Areas",
    time_commitment: "Full-time (2 weeks)",
    skills_needed: "Logistics, Distribution, Compassion",
    category: "relief",
    is_urgent: true,
    applications_count: 6,
    created_at: "2024-01-20",
    created_by: "Relief Committee"
  }
];

const categories = [
  { id: 'all', name: 'All Opportunities', icon: <FaHandsHelping />, count: 6 },
  { id: 'community', name: 'Community Building', icon: <FaUsers />, count: 1 },
  { id: 'education', name: 'Education & Mentoring', icon: <FaGraduationCap />, count: 1 },
  { id: 'health', name: 'Health Services', icon: <FaHeart />, count: 1 },
  { id: 'technology', name: 'Technology', icon: <FaTools />, count: 1 },
  { id: 'culture', name: 'Culture & Arts', icon: <FaTree />, count: 1 },
  { id: 'relief', name: 'Emergency Relief', icon: <FaExclamationCircle />, count: 1 }
];

export default function Volunteer() {
  const { isAuthenticated } = useAuth();
  const [opportunities, setOpportunities] = useState(mockOpportunities);
  const [filteredOpportunities, setFilteredOpportunities] = useState(mockOpportunities);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Filter opportunities
  useEffect(() => {
    let filtered = [...opportunities];
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(opp => opp.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(opp => 
        opp.title.toLowerCase().includes(query) ||
        opp.organization.toLowerCase().includes(query) ||
        opp.description.toLowerCase().includes(query) ||
        opp.skills_needed.toLowerCase().includes(query)
      );
    }
    
    setFilteredOpportunities(filtered);
    
    // Update category counts
    categories.forEach(cat => {
      if (cat.id === 'all') {
        cat.count = opportunities.length;
      } else {
        cat.count = opportunities.filter(opp => opp.category === cat.id).length;
      }
    });
  }, [selectedCategory, searchQuery, opportunities]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* ------------------------------------------------------ */}
      {/* HERO HEADER                                           */}
      {/* ------------------------------------------------------ */}
      <section className="relative bg-gradient-to-br from-[#0B1A33] to-[#1a365d] text-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-3 mb-8 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <FaHandsHelping className="text-[#E4B84D] text-2xl" />
                <span className="font-semibold tracking-wider text-lg">VOLUNTEER WITH PURPOSE</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold font-['Playfair_Display',_serif] mb-6">
                Volunteer <span className="text-[#E4B84D]">Opportunities</span>
              </h1>
              
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
                Join hands with fellow community members and contribute to meaningful projects. 
                Your time and skills can create lasting impact across our community.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ */}
      {/* STATS & CATEGORIES BAR                                */}
      {/* ------------------------------------------------------ */}
      <div className="bg-white shadow-lg py-6 px-6 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Stats */}
            <div className="flex items-center gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#0B1A33]">{filteredOpportunities.length}</div>
                <div className="text-sm text-gray-500">Active Opportunities</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#E4B84D]">
                  {opportunities.filter(o => o.is_urgent).length}
                </div>
                <div className="text-sm text-gray-500">Urgent Needs</div>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search opportunities by title, skills, or organization..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full px-6 py-3 rounded-xl bg-gray-100 border border-gray-300 
                           focus:outline-none focus:ring-2 focus:ring-[#E4B84D] focus:border-transparent
                           pl-12"
                />
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
            
            {/* Post Opportunity Button */}
            {isAuthenticated && (
              <Link
                to="/volunteer/create"
                className="px-6 py-3 bg-gradient-to-r from-[#E4B84D] to-[#FFD166] 
                         text-[#0B1A33] font-bold rounded-xl hover:shadow-lg hover:scale-105 
                         transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <FaPlus />
                Post Opportunity
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------ */}
      {/* CATEGORY FILTERS                                      */}
      {/* ------------------------------------------------------ */}
      <div className="py-6 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#0B1A33] flex items-center gap-2">
              <FaFilter className="text-[#E4B84D]" />
              Filter by Category
            </h3>
            {(selectedCategory !== 'all' || searchQuery) && (
              <button
                onClick={clearFilters}
                className="text-sm text-[#E4B84D] hover:text-[#0B1A33] font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`
                  flex items-center gap-3 px-5 py-3 rounded-xl whitespace-nowrap transition-all
                  ${selectedCategory === category.id
                    ? 'bg-gradient-to-r from-[#E4B84D] to-[#FFD166] text-[#0B1A33] font-semibold shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
                  }
                `}
              >
                <span className="text-lg">{category.icon}</span>
                <span>{category.name}</span>
                <span className={`
                  px-2 py-0.5 text-xs rounded-full
                  ${selectedCategory === category.id
                    ? 'bg-white/50'
                    : 'bg-gray-200'
                  }
                `}>
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------ */}
      {/* OPPORTUNITIES GRID                                    */}
      {/* ------------------------------------------------------ */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence>
            {filteredOpportunities.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="text-6xl mb-6">🤝</div>
                <h3 className="text-2xl font-bold text-[#0B1A33] mb-3">No opportunities found</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-8">
                  {searchQuery 
                    ? `No opportunities match "${searchQuery}". Try a different search term.`
                    : "Check back soon for new volunteer opportunities."
                  }
                </p>
                {(searchQuery || selectedCategory !== 'all') && (
                  <button
                    onClick={clearFilters}
                    className="px-6 py-3 bg-gradient-to-r from-[#0B1A33] to-[#1a365d] 
                             text-white font-bold rounded-xl hover:shadow-lg transition-all"
                  >
                    View All Opportunities
                  </button>
                )}
              </motion.div>
            ) : (
              <>
                {/* Opportunity Cards Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredOpportunities.map((opportunity, index) => (
                    <motion.div
                      key={opportunity.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ y: -8 }}
                      className="group"
                    >
                      <Link to={`/volunteer/${opportunity.id}`}>
                        <div className="h-full bg-white rounded-2xl shadow-lg hover:shadow-2xl 
                                     transition-all duration-300 border border-gray-100 
                                     hover:border-[#E4B84D]/30 overflow-hidden">
                          
                          {/* Card Header */}
                          <div className={`p-6 ${opportunity.is_urgent ? 'bg-gradient-to-r from-orange-50 to-yellow-50' : 'bg-gray-50'}`}>
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                {opportunity.is_urgent && (
                                  <div className="flex items-center gap-2 mb-3">
                                    <FaExclamationCircle className="text-orange-500" />
                                    <span className="text-sm font-bold text-orange-600">URGENT - Volunteers Needed</span>
                                  </div>
                                )}
                                <h3 className="text-xl font-bold text-[#0B1A33] group-hover:text-[#E4B84D] 
                                               transition-colors line-clamp-2">
                                  {opportunity.title}
                                </h3>
                                <div className="flex items-center gap-2 mt-2 text-gray-600">
                                  <FaBuilding className="text-sm" />
                                  <span className="text-sm font-medium">{opportunity.organization}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Card Body */}
                          <div className="p-6">
                            <p className="text-gray-600 mb-6 line-clamp-3">
                              {opportunity.description}
                            </p>
                            
                            {/* Details */}
                            <div className="space-y-3 mb-6">
                              {opportunity.location && (
                                <div className="flex items-center gap-3">
                                  <FaMapMarkerAlt className="text-[#E4B84D] flex-shrink-0" />
                                  <span className="text-sm text-gray-700">{opportunity.location}</span>
                                </div>
                              )}
                              
                              {opportunity.time_commitment && (
                                <div className="flex items-center gap-3">
                                  <FaClock className="text-[#E4B84D] flex-shrink-0" />
                                  <span className="text-sm text-gray-700">{opportunity.time_commitment}</span>
                                </div>
                              )}
                              
                              {opportunity.skills_needed && (
                                <div className="flex items-start gap-3">
                                  <FaTools className="text-[#E4B84D] flex-shrink-0 mt-1" />
                                  <span className="text-sm text-gray-700 line-clamp-2">
                                    Skills: {opportunity.skills_needed}
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            {/* Footer */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                              <div className="text-sm text-gray-500">
                                Posted {opportunity.created_at}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-700 font-medium">
                                  {opportunity.applications_count} applications
                                </span>
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Apply Button Overlay */}
                          <div className="px-6 pb-6">
                            <button className="w-full py-3 bg-gradient-to-r from-[#0B1A33] to-[#1a365d] 
                                         text-white font-bold rounded-xl hover:from-[#1a2d4d] 
                                         hover:to-[#0B1A33] hover:shadow-lg transition-all 
                                         flex items-center justify-center gap-2">
                              <FaPaperPlane />
                              Apply Now
                            </button>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
                
                {/* Stats Footer */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-12 text-center"
                >
                  <p className="text-gray-500">
                    Showing {filteredOpportunities.length} of {opportunities.length} opportunities
                  </p>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ------------------------------------------------------ */}
      {/* COMMUNITY IMPACT SECTION                              */}
      {/* ------------------------------------------------------ */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-[#0B1A33] mb-8 font-['Playfair_Display',_serif]">
              Make a Difference in Our Community
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
              {[
                {
                  icon: <FaUsers className="text-4xl" />,
                  title: "Community Building",
                  description: "Strengthen social bonds and infrastructure"
                },
                {
                  icon: <FaGraduationCap className="text-4xl" />,
                  title: "Education & Mentoring",
                  description: "Empower the next generation through knowledge"
                },
                {
                  icon: <FaHeart className="text-4xl" />,
                  title: "Social Services",
                  description: "Provide essential support to those in need"
                },
                {
                  icon: <FaTree className="text-4xl" />,
                  title: "Environment & Culture",
                  description: "Preserve heritage and improve our surroundings"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl 
                           transition-all duration-300 border border-gray-100"
                >
                  <div className="inline-flex p-4 bg-gradient-to-br from-[#E4B84D]/10 to-[#FFD166]/10 
                               rounded-2xl text-[#E4B84D] mb-6">
                    {item.icon}
                  </div>
                  <h4 className="text-xl font-bold text-[#0B1A33] mb-3">{item.title}</h4>
                  <p className="text-gray-600">{item.description}</p>
                </motion.div>
              ))}
            </div>
            
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-16"
            >
              <p className="text-gray-600 max-w-2xl mx-auto mb-8 text-lg">
                Every volunteer hour contributes to our shared vision of a stronger, 
                more connected community. Your participation matters.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                {!isAuthenticated ? (
                  <>
                    <Link
                      to="/register"
                      className="px-8 py-4 bg-gradient-to-r from-[#E4B84D] to-[#FFD166] 
                               text-[#0B1A33] font-bold rounded-xl hover:shadow-xl 
                               hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
                    >
                      <FaHandsHelping />
                      Join to Volunteer
                    </Link>
                    
                    <Link
                      to="/about"
                      className="px-8 py-4 border-2 border-[#0B1A33] text-[#0B1A33] 
                               font-bold rounded-xl hover:bg-gray-50 hover:scale-105 
                               transition-all duration-300 flex items-center justify-center gap-3"
                    >
                      <FaInfoCircle />
                      Learn About Impact
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/volunteer/create"
                    className="px-8 py-4 bg-gradient-to-r from-[#0B1A33] to-[#1a365d] 
                             text-white font-bold rounded-xl hover:shadow-xl 
                             hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    <FaPlus />
                    Create New Opportunity
                  </Link>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}