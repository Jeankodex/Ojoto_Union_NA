import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { 
  FaBell, FaUsers, FaCalendarAlt, FaComments, 
  FaQuestionCircle, FaBullhorn, FaChartLine,
  FaUserFriends, FaImages, FaHandsHelping,
  FaThumbsUp, FaReply, FaArrowRight, FaCog,
  FaFileAlt, FaHeart, FaStar, FaTrophy, FaRocket
} from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || '';

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    posts: 0,
    connections: 0,
    events: 0,
    contributions: 0
  });

  // Real data states
  const [recentPosts, setRecentPosts] = useState([]);
  const [recentQuestions, setRecentQuestions] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [communityStats, setCommunityStats] = useState({});
  const [userActivity, setUserActivity] = useState([]);
  const [notificationsCount, setNotificationsCount] = useState(0);

  // Quick actions (swapped position - will appear where Upcoming Events were)
  const quickActions = [
    { icon: <FaRocket />, label: "Create Post", link: "/community/create", color: "from-blue-500 to-cyan-500", bg: "bg-gradient-to-br from-blue-500/10 to-cyan-500/10" },
    { icon: <FaFileAlt />, label: "Ask Question", link: "/questions/ask", color: "from-emerald-500 to-green-500", bg: "bg-gradient-to-br from-emerald-500/10 to-green-500/10" },
    { icon: <FaUserFriends />, label: "Find Members", link: "/members", color: "from-purple-500 to-pink-500", bg: "bg-gradient-to-br from-purple-500/10 to-pink-500/10" },
    { icon: <FaCalendarAlt />, label: "Volunteer", link: "/volunteer", color: "from-amber-500 to-orange-500", bg: "bg-gradient-to-br from-amber-500/10 to-orange-500/10" },
    { icon: <FaHeart />, label: "Donate", link: "/donate", color: "from-rose-500 to-red-500", bg: "bg-gradient-to-br from-rose-500/10 to-red-500/10" },
    { icon: <FaCog />, label: "Settings", link: "/profile/edit", color: "from-slate-600 to-gray-600", bg: "bg-gradient-to-br from-slate-500/10 to-gray-500/10" }
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(`${API_URL}/dashboard/stats`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = response.data.data || {};
      const userStats = data.userStats || {};

      setRecentPosts(data.recentPosts || []);
      setRecentQuestions(data.recentQuestions || []);
      setUpcomingEvents(data.upcomingEvents || []);
      setCommunityStats(data.overview || {});
      setUserActivity(data.userActivity || []);
      setNotificationsCount(data.notificationsCount || 0);

      setStats({
        posts: userStats.posts_count || 0,
        connections: userStats.connections_count || 0,
        events: userStats.events_attended || 0,
        contributions:
          (userStats.posts_count || 0) +
          (userStats.comments_count || 0) +
          (userStats.questions_count || 0) +
          (userStats.answers_count || 0)
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setUpcomingEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLikePost = async (postId) => {
    try {
      await axios.post(`${API_URL}/community/posts/${postId}/like`);
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleRSVP = async (eventId, status) => {
    try {
      await axios.post(`/api/events/${eventId}/rsvp`, { status });
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error("Error updating RSVP:", error);
    }
  };

  const getEventTypeColor = (type) => {
    const colors = {
      meeting: "bg-blue-100 text-blue-700",
      social: "bg-pink-100 text-pink-700",
      networking: "bg-purple-100 text-purple-700",
      volunteer: "bg-green-100 text-green-700",
      default: "bg-gray-100 text-gray-700"
    };
    return colors[type] || colors.default;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-[#E4B84D]/30 border-t-[#E4B84D]"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 bg-gradient-to-br from-[#E4B84D] to-[#FFD166] rounded-full"></div>
            </div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      
      {/* ------------------------------------------------------ */}
      {/* PREMIUM HEADER WITH GLASS EFFECT                      */}
      {/* ------------------------------------------------------ */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1A33]/95 via-[#1a365d]/90 to-[#0B1A33]/95"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#E4B84D_1px,transparent_0)] bg-[length:60px_60px] opacity-5"></div>
  
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            
            {/* Welcome Section with Premium Badge */}
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-[#E4B84D] to-[#FFD166] rounded-full blur-xl opacity-20"></div>
              <div className="relative">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-4">
                  <FaTrophy className="text-[#FFD166]" />
                  <span className="text-sm font-medium text-white/90">Premium Member</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white font-['Playfair_Display',_serif] leading-tight">
                  Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD166] to-[#E4B84D]">{user?.firstName || "Member"}</span>!
                </h1>
                <p className="text-gray-300 mt-3 text-lg max-w-2xl">
                  Your community hub is updated with the latest activities and opportunities.
                </p>
                
                {/* Activity Badges */}
                <div className="flex flex-wrap gap-3 mt-6">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                    <FaStar className="text-[#FFD166] text-sm" />
                    <span className="text-sm font-medium text-white">Top Contributor</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                    <FaChartLine className="text-emerald-400 text-sm" />
                    <span className="text-sm font-medium text-white">Active Streak: 14 days</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notifications with Glass Effect */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <button className="p-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-2xl transition-all duration-300 group">
                  <FaBell className="text-xl text-white group-hover:scale-110 transition-transform" />
                  {notificationsCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-br from-red-500 to-pink-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
                      {notificationsCount}
                    </span>
                  )}
                </button>
              </div>
              <div className="hidden lg:block">
                <div className="text-sm text-gray-300 font-medium">Member since</div>
                <div className="text-white font-bold text-lg">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "Nov 2024"}</div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ------------------------------------------------------ */}
      {/* ENHANCED STATS CARDS WITH REAL DATA                   */}
      {/* ------------------------------------------------------ */}
      <div className="max-w-7xl mx-auto px-6 -mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Posts Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-2xl blur transition-all duration-300 group-hover:blur-lg"></div>
            <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-100/50 hover:shadow-2xl hover:border-blue-200/50 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Your Posts</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.posts}</h3>
                  <p className="text-green-600 text-sm font-medium mt-1">+2 this week</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl group-hover:scale-110 transition-transform">
                  <FaBullhorn className="text-2xl text-blue-600" />
                </div>
              </div>
              <Link to="/community" className="mt-6 inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 group">
                View all posts
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Connections Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5 rounded-2xl blur transition-all duration-300 group-hover:blur-lg"></div>
            <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-100/50 hover:shadow-2xl hover:border-emerald-200/50 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Connections</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.connections}</h3>
                  <p className="text-green-600 text-sm font-medium mt-1">+5 this month</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-xl group-hover:scale-110 transition-transform">
                  <FaUsers className="text-2xl text-emerald-600" />
                </div>
              </div>
              <Link to="/members" className="mt-6 inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 group">
                Find members
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Events Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-2xl blur transition-all duration-300 group-hover:blur-lg"></div>
            <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-100/50 hover:shadow-2xl hover:border-purple-200/50 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Upcoming Events</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.events}</h3>
                  <p className="text-purple-600 text-sm font-medium mt-1">Join now</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl group-hover:scale-110 transition-transform">
                  <FaCalendarAlt className="text-2xl text-purple-600" />
                </div>
              </div>
              <Link to="/volunteer" className="mt-6 inline-flex items-center gap-2 text-purple-600 font-semibold hover:text-purple-700 group">
                View events
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Contributions Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 rounded-2xl blur transition-all duration-300 group-hover:blur-lg"></div>
            <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-100/50 hover:shadow-2xl hover:border-amber-200/50 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Contributions</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.contributions}</h3>
                  <p className="text-amber-600 text-sm font-medium mt-1">Community impact</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl group-hover:scale-110 transition-transform">
                  <FaHandsHelping className="text-2xl text-amber-600" />
                </div>
              </div>
              <Link to="/questions" className="mt-6 inline-flex items-center gap-2 text-amber-600 font-semibold hover:text-amber-700 group">
                See activity
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* ------------------------------------------------------ */}
      {/* MAIN CONTENT WITH REAL DATA                           */}
      {/* ------------------------------------------------------ */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Recent Activity & Content (2/3 width) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Recent Community Posts */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100/50">
                <div className="p-6 border-b border-gray-100/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg">
                        <FaBullhorn className="text-blue-600 text-xl" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">Recent Community Posts</h2>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                      {recentPosts.length} active
                    </span>
                  </div>
                </div>

                <div className="divide-y divide-gray-100/50">
                  {recentPosts.length > 0 ? recentPosts.map((post, index) => (
                    <div key={post.id || index} className="p-6 hover:bg-gray-50/50 transition-colors duration-200">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                            {post.author_name?.charAt(0) || "U"}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">{post.title}</h3>
                            {post.is_urgent && (
                              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full animate-pulse">
                                URGENT
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 line-clamp-2">{post.content}</p>
                          
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-gray-500 font-medium">{post.author_name}</span>
                              <span className="text-gray-400">•</span>
                              <span className="text-gray-500">{new Date(post.created_at).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <button 
                                onClick={() => handleLikePost(post.id)}
                                className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-medium transition-colors"
                              >
                                <FaThumbsUp /> {post.likes || 0}
                              </button>
                              <span className="text-gray-500 flex items-center gap-1">
                                <FaComments /> {post.comments_count || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="p-8 text-center">
                      <div className="text-gray-400 text-lg">No recent posts yet</div>
                      <Link to="/community/create" className="inline-block mt-4 text-blue-600 font-semibold hover:text-blue-700">
                        Create the first post →
                      </Link>
                    </div>
                  )}
                </div>

                <div className="p-6 border-t border-gray-100/50">
                  <Link 
                    to="/community" 
                    className="block w-full text-center px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                  >
                    Explore Community
                  </Link>
                </div>
              </div>
            </div>

            {/* Recent Questions & Activity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Recent Questions */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100/50">
                <div className="p-6 border-b border-gray-100/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-lg">
                      <FaQuestionCircle className="text-emerald-600 text-xl" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Recent Questions</h2>
                  </div>
                </div>

                <div className="p-6">
                  {recentQuestions.length > 0 ? recentQuestions.map((question, index) => (
                    <div key={question.id || index} className="mb-4 last:mb-0">
                      <h4 className="font-semibold text-gray-900 line-clamp-1">{question.title}</h4>
                      <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
                        <span>{question.answers_count || 0} answers</span>
                        <span>{new Date(question.created_at).toLocaleDateString()}</span>
                      </div>
                      {index < recentQuestions.length - 1 && <div className="h-px bg-gray-100/50 my-4"></div>}
                    </div>
                  )) : (
                    <div className="text-center py-6">
                      <div className="text-gray-400">No questions yet</div>
                      <Link to="/questions/ask" className="inline-block mt-2 text-emerald-600 font-semibold hover:text-emerald-700">
                        Ask a question →
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Your Activity */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100/50">
                <div className="p-6 border-b border-gray-100/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-lg">
                      <FaChartLine className="text-amber-600 text-xl" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Your Activity</h2>
                  </div>
                </div>

                <div className="p-6">
                  {userActivity.length > 0 ? userActivity.map((activity, index) => (
                    <div key={index} className="mb-4 last:mb-0">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-lg flex items-center justify-center">
                          <FaThumbsUp className="text-amber-600 text-sm" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                      {index < userActivity.length - 1 && <div className="h-px bg-gray-100/50 my-4"></div>}
                    </div>
                  )) : (
                    <div className="text-center py-6">
                      <div className="text-gray-400">No recent activity</div>
                      <p className="text-sm text-gray-500 mt-1">Start engaging with the community!</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT COLUMN: Quick Actions & Upcoming Events (1/3 width) - SWAPPED POSITIONS */}
          
          {/* QUICK ACTIONS - NOW WHERE UPCOMING EVENTS WERE (TOP OF SIDEBAR) */}
          <div className="space-y-8">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100/50">
                <div className="p-6 border-b border-gray-100/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg">
                      <FaRocket className="text-purple-600 text-xl" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
                  </div>
                  <p className="text-gray-600 text-sm mt-2">Jump right into action</p>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    {quickActions.map((action, index) => (
                      <Link
                        key={index}
                        to={action.link}
                        className="group/action relative overflow-hidden"
                      >
                        <div className={`absolute inset-0 ${action.bg} rounded-xl transition-all duration-300 group-hover/action:scale-105`}></div>
                        <div className="relative p-4 rounded-xl border border-gray-200/50 hover:border-transparent transition-all duration-300 group-hover/action:shadow-lg text-center">
                          <div className={`inline-flex p-3 bg-gradient-to-br ${action.color} rounded-xl text-white mb-3 group-hover/action:scale-110 transition-transform duration-300`}>
                            {action.icon}
                          </div>
                          <h4 className="font-semibold text-gray-900 group-hover/action:text-transparent group-hover/action:bg-clip-text group-hover/action:bg-gradient-to-br group-hover/action:from-purple-600 group-hover/action:to-pink-600 transition-all duration-300">
                            {action.label}
                          </h4>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* UPCOMING EVENTS - MOVED DOWN TO WHERE QUICK ACTIONS WERE */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100/50">
                <div className="p-6 border-b border-gray-100/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg">
                        <FaCalendarAlt className="text-blue-600 text-xl" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">Upcoming Events</h2>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                      {upcomingEvents.length} events
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {upcomingEvents.length > 0 ? upcomingEvents.map((event) => (
                      <div key={event.id} className="p-4 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 rounded-xl border border-blue-100/50 hover:border-blue-200 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-bold text-gray-900">{event.title}</h4>
                          <span className={`px-2 py-1 text-xs font-bold rounded-full ${getEventTypeColor(event.type)}`}>
                            {event.type || "Event"}
                          </span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center text-gray-600">
                            <span className="font-medium">📅 {event.date}</span>
                            <span className="mx-2">•</span>
                            <span className="font-medium">🕒 {event.time}</span>
                          </div>
                          <div className="text-gray-600">
                            <span className="font-medium">📍 {event.location}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <button 
                            onClick={() => handleRSVP(event.id, "going")}
                            className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all"
                          >
                            Going
                          </button>
                          <button 
                            onClick={() => handleRSVP(event.id, "maybe")}
                            className="flex-1 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            Maybe
                          </button>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-6">
                        <div className="text-gray-400">No upcoming events</div>
                        <p className="text-sm text-gray-500 mt-1">Check back soon!</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 border-t border-gray-100/50">
                  <Link 
                    to="/volunteer" 
                    className="block text-center text-blue-600 font-semibold hover:text-blue-700 group"
                  >
                    View All Events
                    <FaArrowRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Community Stats Card */}
            <div className="relative overflow-hidden rounded-2xl shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0B1A33] via-[#1a365d] to-[#0B1A33]"></div>
              <div className="absolute -right-20 -top-20 w-40 h-40 bg-gradient-to-br from-[#E4B84D]/20 to-[#FFD166]/20 rounded-full blur-2xl"></div>
              
              <div className="relative p-6 text-white">
                <h3 className="text-xl font-bold mb-6">Community Stats</h3>
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/10 rounded-lg">
                        <FaUsers className="text-[#FFD166]" />
                      </div>
                      <span className="font-medium">Total Members</span>
                    </div>
                    <span className="text-2xl font-bold">{communityStats.totalMembers || "150+"}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/10 rounded-lg">
                        <FaComments className="text-[#FFD166]" />
                      </div>
                      <span className="font-medium">Active Discussions</span>
                    </div>
                    <span className="text-2xl font-bold">{communityStats.activeDiscussions || "40+"}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/10 rounded-lg">
                        <FaCalendarAlt className="text-[#FFD166]" />
                      </div>
                      <span className="font-medium">This Month</span>
                    </div>
                    <span className="text-2xl font-bold">{communityStats.monthlyEvents || "10+"}</span>
                  </div>
                  
                  <div className="pt-5 border-t border-white/20">
                    <p className="text-white/80 text-sm">
                      Join {communityStats.newMembersThisWeek || "5"} new members this week in making an impact.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}