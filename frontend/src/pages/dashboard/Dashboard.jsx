
import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { 
  FaBell, FaUsers, FaCalendarAlt, FaComments, 
  FaQuestionCircle, FaBullhorn, FaChartLine,
  FaUserFriends, FaImages, FaHandsHelping,
  FaThumbsUp, FaReply, FaArrowRight, FaCog
} from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState(3); // Mock data
  const [stats, setStats] = useState({
    posts: 0,
    connections: 0,
    events: 5,
    contributions: 12
  });

  // Mock announcements data
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: "Annual General Meeting Announcement",
      content: "Our AGM will be held on December 15th. All members are encouraged to attend both virtually and in-person.",
      author: "Admin Team",
      time: "2 hours ago",
      comments: 8,
      isUrgent: true
    },
    {
      id: 2,
      title: "Community Christmas Party",
      content: "Join us for our annual Christmas celebration on December 20th at the Community Center.",
      author: "Events Committee",
      time: "1 day ago",
      comments: 15,
      isUrgent: false
    },
    {
      id: 3,
      title: "New Platform Features",
      content: "We've added new discussion forums and improved the member directory. Check them out!",
      author: "Tech Team",
      time: "3 days ago",
      comments: 23,
      isUrgent: false
    }
  ]);

  // Mock upcoming events
  const [upcomingEvents, setUpcomingEvents] = useState([
    {
      id: 1,
      title: "Annual General Meeting",
      date: "Dec 15, 2024",
      time: "6:00 PM EST",
      location: "Virtual & NYC",
      rsvpStatus: "confirmed"
    },
    {
      id: 2,
      title: "Christmas Party",
      date: "Dec 20, 2024",
      time: "7:00 PM EST",
      location: "Community Center",
      rsvpStatus: "pending"
    },
    {
      id: 3,
      title: "New Year Networking",
      date: "Jan 10, 2025",
      time: "5:30 PM EST",
      location: "Chicago Hub",
      rsvpStatus: "not-responded"
    }
  ]);

  // Mock recent activity
  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      user: "John Doe",
      action: "posted in Community",
      content: "How can we improve local business networking?",
      time: "30 mins ago",
      likes: 5
    },
    {
      id: 2,
      user: "Sarah Johnson",
      action: "answered your question",
      content: "Great question! I suggest monthly networking events...",
      time: "1 hour ago",
      likes: 3
    },
    {
      id: 3,
      user: "Michael Chen",
      action: "joined the community",
      time: "2 hours ago",
      content: "Welcome to Ojoto Union NA!"
    }
  ]);

  // Quick actions
  const quickActions = [
    { icon: <FaBullhorn />, label: "Create Post", link: "/community/create", color: "from-blue-500 to-blue-600" },
    { icon: <FaQuestionCircle />, label: "Ask Question", link: "/questions/ask", color: "from-green-500 to-green-600" },
    { icon: <FaUserFriends />, label: "Find Members", link: "/members", color: "from-purple-500 to-purple-600" },
    { icon: <FaImages />, label: "View Gallery", link: "/gallery", color: "from-pink-500 to-pink-600" },
    { icon: <FaHandsHelping />, label: "Volunteer", link: "/volunteer", color: "from-orange-500 to-orange-600" },
    { icon: <FaCog />, label: "Settings", link: "/profile/edit", color: "from-gray-500 to-gray-600" }
  ];

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleReply = (announcementId, replyText) => {
    console.log(`Reply to announcement ${announcementId}: ${replyText}`);
    // Add your API call here
    alert(`Reply sent to announcement ${announcementId}`);
  };

  const handleRSVP = (eventId, status) => {
    console.log(`RSVP for event ${eventId}: ${status}`);
    // Add your API call here
    alert(`RSVP ${status} for event ${eventId}`);
  };

  const handleLike = (activityId) => {
    console.log(`Liked activity ${activityId}`);
    // Add your API call here
    alert(`Liked activity ${activityId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#E4B84D]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      
      {/* ------------------------------------------------------ */}
      {/* DASHBOARD HEADER                                       */}
      {/* ------------------------------------------------------ */}
      <div className="bg-gradient-to-r from-[#0B1A33] to-[#1a365d] text-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* Welcome Section */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold font-['Playfair_Display',_serif]">
                Welcome back, {user?.firstName || "Member"}! 👋
              </h1>
              <p className="text-gray-300 mt-2 text-lg">
                Here's what's happening in your community today
              </p>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
                  <FaChartLine className="text-[#E4B84D]" />
                  <span className="text-sm">Active Member</span>
                </div>
                <div className="text-sm text-gray-300">
                  Last active: Today
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <button className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                  <FaBell className="text-xl" />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notifications}
                    </span>
                  )}
                </button>
              </div>
              <div className="hidden md:block">
                <div className="text-sm text-gray-300">Member since</div>
                <div className="font-semibold">Nov 2024</div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ------------------------------------------------------ */}
      {/* QUICK STATS CARDS                                      */}
      {/* ------------------------------------------------------ */}
      <div className="max-w-7xl mx-auto px-6 -mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Posts Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Your Posts</p>
                <h3 className="text-3xl font-bold text-[#0B1A33] mt-2">{stats.posts}</h3>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <FaBullhorn className="text-2xl text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <Link to="/community" className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center gap-1">
                View all <FaArrowRight className="text-xs" />
              </Link>
            </div>
          </div>

          {/* Connections Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Connections</p>
                <h3 className="text-3xl font-bold text-[#0B1A33] mt-2">{stats.connections}</h3>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <FaUsers className="text-2xl text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <Link to="/members" className="text-green-600 text-sm font-medium hover:text-green-700 flex items-center gap-1">
                Find members <FaArrowRight className="text-xs" />
              </Link>
            </div>
          </div>

          {/* Events Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Upcoming Events</p>
                <h3 className="text-3xl font-bold text-[#0B1A33] mt-2">{stats.events}</h3>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <FaCalendarAlt className="text-2xl text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              <Link to="/volunteer" className="text-purple-600 text-sm font-medium hover:text-purple-700 flex items-center gap-1">
                View events <FaArrowRight className="text-xs" />
              </Link>
            </div>
          </div>

          {/* Contributions Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Contributions</p>
                <h3 className="text-3xl font-bold text-[#0B1A33] mt-2">{stats.contributions}</h3>
              </div>
              <div className="p-3 bg-yellow-50 rounded-xl">
                <FaHandsHelping className="text-2xl text-yellow-600" />
              </div>
            </div>
            <div className="mt-4">
              <Link to="/questions" className="text-yellow-600 text-sm font-medium hover:text-yellow-700 flex items-center gap-1">
                See activity <FaArrowRight className="text-xs" />
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* ------------------------------------------------------ */}
      {/* MAIN CONTENT GRID                                      */}
      {/* ------------------------------------------------------ */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ANNOUNCEMENTS FEED (2/3 width on desktop) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Announcements Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-[#0B1A33] flex items-center gap-2">
                    <FaBullhorn className="text-[#E4B84D]" />
                    Latest Announcements
                  </h2>
                  <span className="text-sm text-gray-500">{announcements.length} announcements</span>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {announcements.map((announcement) => (
                  <div key={announcement.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-4">
                      {announcement.isUrgent && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                          URGENT
                        </span>
                      )}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-[#0B1A33]">{announcement.title}</h3>
                        <p className="text-gray-600 mt-2">{announcement.content}</p>
                        
                        <div className="flex items-center justify-between mt-4">
                          <div className="text-sm text-gray-500">
                            By {announcement.author} • {announcement.time}
                          </div>
                          <div className="flex items-center gap-4">
                            <button 
                              onClick={() => {
                                const reply = prompt("Enter your reply:");
                                if (reply) handleReply(announcement.id, reply);
                              }}
                              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                              <FaReply /> Reply
                            </button>
                            <span className="text-gray-500 text-sm flex items-center gap-1">
                              <FaComments /> {announcement.comments}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 border-t border-gray-100">
                <Link 
                  to="/post_announcement" 
                  className="block w-full text-center px-6 py-3 bg-gradient-to-r from-[#E4B84D] to-[#FFD166] text-[#0B1A33] font-bold rounded-xl hover:shadow-lg transition-all"
                >
                  Create New Announcement
                </Link>
              </div>
            </div>

            {/* Recent Activity Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-[#0B1A33] flex items-center gap-2">
                  <FaChartLine className="text-[#E4B84D]" />
                  Recent Community Activity
                </h2>
              </div>

              <div className="divide-y divide-gray-100">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#E4B84D] to-[#FFD166] rounded-full flex items-center justify-center text-white font-bold">
                        {activity.user.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-[#0B1A33]">{activity.user}</h4>
                          <span className="text-sm text-gray-500">{activity.time}</span>
                        </div>
                        <p className="text-gray-600 mt-1">
                          <span className="font-medium">{activity.action}:</span> {activity.content}
                        </p>
                        {activity.likes !== undefined && (
                          <div className="flex items-center gap-4 mt-3">
                            <button 
                              onClick={() => handleLike(activity.id)}
                              className="flex items-center gap-1 text-gray-500 hover:text-blue-600"
                            >
                              <FaThumbsUp /> Like
                            </button>
                            <span className="text-sm text-gray-500">{activity.likes} likes</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 border-t border-gray-100">
                <Link 
                  to="/community" 
                  className="block text-center text-[#0B1A33] font-semibold hover:text-[#E4B84D] transition-colors"
                >
                  View All Activity →
                </Link>
              </div>
            </div>

          </div>

          {/* SIDEBAR (1/3 width on desktop) */}
          <div className="space-y-8">
            
            {/* Upcoming Events */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-[#0B1A33] flex items-center gap-2">
                  <FaCalendarAlt className="text-[#E4B84D]" />
                  Upcoming Events
                </h2>
              </div>

              <div className="divide-y divide-gray-100">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <h4 className="font-semibold text-[#0B1A33]">{event.title}</h4>
                    <div className="space-y-2 mt-3">
                      <div className="flex items-center text-gray-600 text-sm">
                        <span className="font-medium">📅 {event.date}</span>
                      </div>
                      <div className="flex items-center text-gray-600 text-sm">
                        <span className="font-medium">🕒 {event.time}</span>
                      </div>
                      <div className="flex items-center text-gray-600 text-sm">
                        <span className="font-medium">📍 {event.location}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex gap-2">
                      <button 
                        onClick={() => handleRSVP(event.id, "confirmed")}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                          event.rsvpStatus === "confirmed" 
                            ? "bg-green-100 text-green-700" 
                            : "bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-700"
                        }`}
                      >
                        {event.rsvpStatus === "confirmed" ? "Going ✓" : "RSVP"}
                      </button>
                      <button 
                        onClick={() => handleRSVP(event.id, "maybe")}
                        className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-yellow-100 hover:text-yellow-700 transition-colors"
                      >
                        Maybe
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 border-t border-gray-100">
                <Link 
                  to="/volunteer" 
                  className="block text-center text-[#0B1A33] font-semibold hover:text-[#E4B84D] transition-colors"
                >
                  View All Events →
                </Link>
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-[#0B1A33] flex items-center gap-2">
                  <FaArrowRight className="text-[#E4B84D]" />
                  Quick Actions
                </h2>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <Link
                      key={index}
                      to={action.link}
                      className="group p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 hover:border-[#E4B84D]/30 hover:shadow-lg transition-all duration-300 text-center"
                    >
                      <div className={`inline-flex p-3 bg-gradient-to-br ${action.color} rounded-xl text-white mb-3 group-hover:scale-110 transition-transform`}>
                        {action.icon}
                      </div>
                      <h4 className="font-semibold text-[#0B1A33] group-hover:text-[#E4B84D] transition-colors">
                        {action.label}
                      </h4>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Community Stats */}
            <div className="bg-gradient-to-br from-[#0B1A33] to-[#1a365d] rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-4">Community at a Glance</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Total Members</span>
                  <span className="text-2xl font-bold">150+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Active Discussions</span>
                  <span className="text-2xl font-bold">40+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Monthly Events</span>
                  <span className="text-2xl font-bold">10+</span>
                </div>
                <div className="pt-4 border-t border-white/20">
                  <p className="text-gray-300 text-sm">
                    You're among active community members making a difference.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}