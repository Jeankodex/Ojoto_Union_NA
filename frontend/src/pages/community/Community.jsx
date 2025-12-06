
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FaUsers, 
  FaPlus, 
  FaComment, 
  FaThumbtack, 
  FaFire, 
  FaSearch, 
  FaFilter,
  FaUserCircle,
  FaHeart,
  FaShare,
  FaCalendarAlt,
  FaLightbulb,
  FaBullhorn,
  FaHandsHelping,
  FaTimes,
  FaTrash,
  FaEdit,
  FaRegClock,
  FaChevronRight
} from "react-icons/fa";
import { SiGooglescholar } from "react-icons/si";

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [newComment, setNewComment] = useState({});
  const [activePost, setActivePost] = useState(null);

  // Categories with icons and colors
  const categories = [
    { id: "all", name: "All Topics", icon: <FaUsers />, color: "from-blue-500 to-cyan-500" },
    { id: "general", name: "General", icon: <FaUsers />, color: "from-gray-500 to-gray-700" },
    { id: "events", name: "Events", icon: <FaCalendarAlt />, color: "from-emerald-500 to-green-600" },
    { id: "help", name: "Help & Support", icon: <FaHandsHelping />, color: "from-amber-500 to-orange-500" },
    { id: "ideas", name: "Ideas & Suggestions", icon: <FaLightbulb />, color: "from-purple-500 to-pink-500" },
    { id: "announcements", name: "Announcements", icon: <FaBullhorn />, color: "from-red-500 to-rose-600" },
    { id: "cultural", name: "Cultural", icon: <SiGooglescholar />, color: "from-[#E4B84D] to-[#FFD166]" },
  ];

  // Fetch posts (mock data)
  useEffect(() => {
    setTimeout(() => {
      setPosts([
        {
          id: 1,
          title: "Annual Ojoto Union Picnic 2024 - Save the Date!",
          content: "Mark your calendars! Our annual community picnic will be held on July 20th at Central Park. Family-friendly event with food, games, and cultural activities.",
          author: "Chinwe Okafor",
          authorRole: "Event Coordinator",
          authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chinwe",
          category: "events",
          created_at: "2024-12-10T14:30:00",
          is_pinned: true,
          likes: 24,
          comments: [
            { id: 1, author: "Emeka Nwosu", content: "Can't wait! Should I bring anything?", created_at: "2024-12-10T16:45:00" },
            { id: 2, author: "Amina Bello", content: "Will there be activities for children?", created_at: "2024-12-10T18:20:00" },
          ]
        },
        {
          id: 2,
          title: "Looking for Housing Assistance in Toronto",
          content: "Moving to Toronto next month and looking for temporary accommodation. Any recommendations for short-term rentals or community members who can help?",
          author: "Tunde Adeyemi",
          authorRole: "Member",
          authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tunde",
          category: "help",
          created_at: "2024-12-09T11:20:00",
          is_pinned: false,
          likes: 15,
          comments: [
            { id: 1, author: "Chioma Eze", content: "I know a great Airbnb host in downtown Toronto.", created_at: "2024-12-09T13:45:00" },
          ]
        },
        {
          id: 3,
          title: "Proposal: Monthly Virtual Meetups",
          content: "I suggest we start monthly virtual meetups for members who can't attend in-person events. Could be great for networking and keeping connected.",
          author: "Adebayo Johnson",
          authorRole: "Active Member",
          authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Adebayo",
          category: "ideas",
          created_at: "2024-12-08T09:15:00",
          is_pinned: false,
          likes: 42,
          comments: [
            { id: 1, author: "Ngozi Okoro", content: "Great idea! Zoom or Google Meet?", created_at: "2024-12-08T10:30:00" },
            { id: 2, author: "Kunle Adebayo", content: "I can help organize if needed.", created_at: "2024-12-08T14:20:00" },
            { id: 3, author: "Fatima Ahmed", content: "+1 for this initiative!", created_at: "2024-12-08T16:45:00" },
          ]
        },
        {
          id: 4,
          title: "Cultural Heritage Month Celebration",
          content: "Join us for a month-long celebration of our rich cultural heritage. Various activities planned including cooking classes, language sessions, and traditional dance workshops.",
          author: "Cultural Committee",
          authorRole: "Committee",
          authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Cultural",
          category: "cultural",
          created_at: "2024-12-07T16:45:00",
          is_pinned: false,
          likes: 31,
          comments: []
        },
      ]);
      setLoading(false);
    }, 1500);
  }, []);

  const filteredPosts = posts.filter(post => {
    // Category filter
    if (selectedCategory !== "all" && post.category !== selectedCategory) {
      return false;
    }
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.author.toLowerCase().includes(query)
      );
    }
    
    return true;
  }).sort((a, b) => {
    // Sorting
    switch (sortBy) {
      case "newest":
        return new Date(b.created_at) - new Date(a.created_at);
      case "most_commented":
        return (b.comments?.length || 0) - (a.comments?.length || 0);
      case "most_liked":
        return (b.likes || 0) - (a.likes || 0);
      default:
        return new Date(b.created_at) - new Date(a.created_at);
    }
  });

  const handleLikePost = (postId) => {
    setPosts(prev => prev.map(post => 
      post.id === postId ? { ...post, likes: (post.likes || 0) + 1 } : post
    ));
  };

  const handleAddComment = (postId) => {
    if (!newComment[postId]?.trim()) return;
    
    const comment = {
      id: Date.now(),
      author: "Current User",
      content: newComment[postId],
      created_at: new Date().toISOString(),
    };
    
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            comments: [...(post.comments || []), comment] 
          } 
        : post
    ));
    
    setNewComment(prev => ({ ...prev, [postId]: "" }));
  };

  const handleDeletePost = (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      setPosts(prev => prev.filter(post => post.id !== postId));
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getCategoryInfo = (categoryId) => {
    return categories.find(cat => cat.id === categoryId) || categories[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#0B1A33] to-[#1a365d] text-white pt-12 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold font-['Playfair_Display',_serif] mb-3">
                Community Forum
              </h1>
              <p className="text-gray-300 text-lg max-w-3xl">
                Connect, share ideas, and engage with the Ojoto Union community. 
                Join discussions, get help, and stay updated with community events.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
            <Link
              // Change this in Community.jsx
                to="/community/create"  // 👈 Updated link
                className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-[#E4B84D] to-[#FFD166] text-[#0B1A33] font-bold rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
            >
            <FaPlus />
                Create Post
            </Link>
              
              <button className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition">
                <FaFilter />
                Filter
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold mb-1">{posts.length}</div>
              <div className="text-gray-300 text-sm">Total Posts</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold mb-1">
                {posts.reduce((acc, post) => acc + (post.comments?.length || 0), 0)}
              </div>
              <div className="text-gray-300 text-sm">Total Comments</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold mb-1">
                {posts.reduce((acc, post) => acc + (post.likes || 0), 0)}
              </div>
              <div className="text-gray-300 text-sm">Total Likes</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold mb-1">
                {new Set(posts.map(post => post.author)).size}
              </div>
              <div className="text-gray-300 text-sm">Active Members</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Categories Navigation */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Discussion Categories</h3>
            <button 
              onClick={() => setSelectedCategory("all")}
              className="text-sm text-[#E4B84D] hover:text-[#0B1A33] font-medium"
            >
              Clear Filter
            </button>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 ${
                  selectedCategory === category.id
                    ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <span className="text-lg">{category.icon}</span>
                <span className="font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts, topics, or members..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E4B84D] focus:border-transparent transition"
              />
            </div>

            {/* Sort */}
            <div className="relative">
              <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-12 pr-8 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E4B84D] focus:border-transparent appearance-none bg-white"
              >
                <option value="newest">Newest First</option>
                <option value="most_commented">Most Comments</option>
                <option value="most_liked">Most Liked</option>
              </select>
            </div>

            {/* Active Filters */}
            <div className="flex items-center gap-2">
              {(selectedCategory !== "all" || searchQuery) && (
                <div className="flex flex-wrap gap-2">
                  {selectedCategory !== "all" && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {getCategoryInfo(selectedCategory).name}
                      <button onClick={() => setSelectedCategory("all")}>
                        <FaTimes size={12} />
                      </button>
                    </span>
                  )}
                  {searchQuery && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
                      Search: "{searchQuery}"
                      <button onClick={() => setSearchQuery("")}>
                        <FaTimes size={12} />
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Posts List */}
        {loading ? (
          <div className="text-center py-16">
            <div className="w-12 h-12 border-4 border-[#E4B84D] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading community posts...</p>
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="space-y-6">
            {/* Pinned Posts First */}
            {filteredPosts.filter(post => post.is_pinned).map(post => (
              <PostCard
                key={post.id}
                post={post}
                categoryInfo={getCategoryInfo(post.category)}
                formatTimeAgo={formatTimeAgo}
                onLike={handleLikePost}
                onComment={handleAddComment}
                onDelete={handleDeletePost}
                newComment={newComment}
                setNewComment={setNewComment}
                activePost={activePost}
                setActivePost={setActivePost}
              />
            ))}
            
            {/* Regular Posts */}
            {filteredPosts.filter(post => !post.is_pinned).map(post => (
              <PostCard
                key={post.id}
                post={post}
                categoryInfo={getCategoryInfo(post.category)}
                formatTimeAgo={formatTimeAgo}
                onLike={handleLikePost}
                onComment={handleAddComment}
                onDelete={handleDeletePost}
                newComment={newComment}
                setNewComment={setNewComment}
                activePost={activePost}
                setActivePost={setActivePost}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <FaUsers className="text-4xl text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-3">No Posts Found</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              {searchQuery 
                ? `No posts match "${searchQuery}". Try a different search term.`
                : `Be the first to start a discussion in the ${selectedCategory !== "all" ? getCategoryInfo(selectedCategory).name.toLowerCase() : "community"}!`
              }
            </p>
            <Link
              to="/community/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#E4B84D] to-[#FFD166] text-[#0B1A33] font-bold rounded-xl hover:shadow-lg transition"
            >
              <FaPlus />
              Create First Post
            </Link>
          </div>
        )}

        {/* Community Guidelines */}
        <div className="mt-12 p-8 bg-gradient-to-r from-[#0B1A33]/5 to-[#1a365d]/5 rounded-2xl border border-gray-200">
          <h3 className="text-2xl font-bold text-[#0B1A33] mb-6 font-['Playfair_Display',_serif]">
            Community Guidelines
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4 bg-white rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-3">
                <FaUsers className="text-xl" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Be Respectful</h4>
              <p className="text-gray-600 text-sm">Treat all members with respect and courtesy.</p>
            </div>
            <div className="p-4 bg-white rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 mb-3">
                <FaHandsHelping className="text-xl" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Help Others</h4>
              <p className="text-gray-600 text-sm">Share knowledge and support fellow members.</p>
            </div>
            <div className="p-4 bg-white rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600 mb-3">
                <FaLightbulb className="text-xl" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Share Ideas</h4>
              <p className="text-gray-600 text-sm">Contribute constructive ideas and feedback.</p>
            </div>
            <div className="p-4 bg-white rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-3">
                <FaBullhorn className="text-xl" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Stay Relevant</h4>
              <p className="text-gray-600 text-sm">Keep discussions focused on community topics.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Post Card Component
const PostCard = ({ 
  post, 
  categoryInfo, 
  formatTimeAgo, 
  onLike, 
  onComment, 
  onDelete, 
  newComment, 
  setNewComment,
  activePost,
  setActivePost 
}) => {
  const isActive = activePost === post.id;

  return (
    <div className={`bg-white rounded-2xl shadow-lg border ${post.is_pinned ? 'border-amber-300 border-l-4 border-l-amber-500' : 'border-gray-200'} overflow-hidden transition-all duration-300 hover:shadow-xl`}>
      {/* Post Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-start gap-4">
            <img 
              src={post.authorAvatar} 
              alt={post.author}
              className="w-12 h-12 rounded-full border-2 border-gray-200"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-gray-800">{post.author}</h3>
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                  {post.authorRole}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <FaRegClock />
                  {formatTimeAgo(post.created_at)}
                </span>
                <span className="flex items-center gap-1">
                  <FaComment />
                  {post.comments?.length || 0} comments
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {post.is_pinned && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
                <FaThumbtack />
                Pinned
              </span>
            )}
            <span className={`px-3 py-1 rounded-full text-white text-sm font-medium bg-gradient-to-r ${categoryInfo.color}`}>
              {categoryInfo.name}
            </span>
          </div>
        </div>
        
        <h2 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h2>
        <p className="text-gray-700 leading-relaxed">{post.content}</p>
      </div>

      {/* Post Actions */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => onLike(post.id)}
              className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors group"
            >
              <FaHeart className={`group-hover:scale-110 transition-transform ${post.likes > 0 ? 'text-red-500' : ''}`} />
              <span className="font-medium">{post.likes || 0}</span>
            </button>
            
            <button
              onClick={() => setActivePost(isActive ? null : post.id)}
              className="flex items-center gap-2 text-gray-600 hover:text-[#E4B84D] transition-colors"
            >
              <FaComment />
              <span className="font-medium">Comment</span>
            </button>
            
            <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors">
              <FaShare />
              <span className="font-medium">Share</span>
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Only show delete for author/admin */}
            {post.author === "Current User" && (
              <button
                onClick={() => onDelete(post.id)}
                className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors"
              >
                <FaTrash />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Comments Section */}
      {isActive && (
        <div className="p-6 bg-gray-50 border-t border-gray-100">
          {/* Existing Comments */}
          {post.comments && post.comments.length > 0 ? (
            <div className="mb-6 space-y-4">
              <h4 className="font-semibold text-gray-800 mb-4">Comments ({post.comments.length})</h4>
              {post.comments.map(comment => (
                <div key={comment.id} className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <FaUserCircle className="text-gray-400 text-xl mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-gray-800">{comment.author}</span>
                        <span className="text-xs text-gray-500">
                          {formatTimeAgo(comment.created_at)}
                        </span>
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mb-6 text-center py-4 bg-white rounded-xl">
              <FaComment className="text-gray-400 text-2xl mx-auto mb-2" />
              <p className="text-gray-600">No comments yet. Be the first to comment!</p>
            </div>
          )}

          {/* Add Comment Form */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h5 className="font-semibold text-gray-800 mb-3">Add your comment</h5>
            <div className="flex gap-3">
              <textarea
                value={newComment[post.id] || ""}
                onChange={(e) => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))}
                placeholder="Write your comment here..."
                className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E4B84D] focus:border-transparent transition"
                rows="2"
              />
              <button
                onClick={() => onComment(post.id)}
                disabled={!newComment[post.id]?.trim()}
                className={`px-6 py-3 rounded-xl font-semibold transition ${
                  newComment[post.id]?.trim()
                    ? 'bg-gradient-to-r from-[#E4B84D] to-[#FFD166] text-[#0B1A33] hover:shadow-lg'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;