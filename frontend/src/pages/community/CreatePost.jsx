
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaPaperPlane,
  FaImage,
  FaVideo,
  FaLink,
  FaTag,
  FaEye,
  FaCalendarAlt,
  FaThumbtack,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimes
} from "react-icons/fa";
import { SiGooglescholar } from "react-icons/si";

const CreatePost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "general",
    isPinned: false,
    isUrgent: false,
    tags: [],
    newTag: "",
    attachments: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [charCount, setCharCount] = useState(0);

  // Categories with icons and descriptions
  const categories = [
    {
      id: "general",
      name: "General Discussion",
      icon: <FaPaperPlane />,
      color: "from-gray-500 to-gray-700",
      description: "General community conversations"
    },
    {
      id: "events",
      name: "Events",
      icon: <FaCalendarAlt />,
      color: "from-emerald-500 to-green-600",
      description: "Community events, meetups, gatherings"
    },
    {
      id: "help",
      name: "Help & Support",
      icon: <FaExclamationTriangle />,
      color: "from-amber-500 to-orange-500",
      description: "Get help or offer assistance"
    },
    {
      id: "ideas",
      name: "Ideas & Suggestions",
      icon: <FaCheckCircle />,
      color: "from-purple-500 to-pink-500",
      description: "Share ideas and suggestions"
    },
    {
      id: "announcements",
      name: "Announcements",
      icon: <FaThumbtack />,
      color: "from-red-500 to-rose-600",
      description: "Important announcements"
    },
    {
      id: "cultural",
      name: "Cultural Exchange",
      icon: <SiGooglescholar />,
      color: "from-[#E4B84D] to-[#FFD166]",
      description: "Cultural discussions and heritage"
    }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleContentChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, content: value }));
    setCharCount(value.length);
  };

  const handleAddTag = () => {
    if (formData.newTag.trim() && !formData.tags.includes(formData.newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, prev.newTag.trim()],
        newTag: ""
      }));
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && formData.newTag.trim()) {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      alert("Please enter a title for your post");
      return;
    }
    
    if (!formData.content.trim() || formData.content.length < 20) {
      alert("Please provide more details in your post (at least 20 characters)");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Post created successfully!");
      navigate("/community");
    }, 2000);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    // In a real app, you would upload to a server
    // For now, we'll just add file names
    const fileNames = files.map(file => ({
      name: file.name,
      type: file.type.startsWith('image/') ? 'image' : 'file',
      size: (file.size / 1024).toFixed(2) + ' KB'
    }));
    
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...fileNames]
    }));
  };

  const handleRemoveAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const selectedCategory = categories.find(cat => cat.id === formData.category) || categories[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/community"
            className="inline-flex items-center gap-2 text-[#0B1A33] hover:text-[#E4B84D] transition-colors mb-6 group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Community</span>
          </Link>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-[#0B1A33] font-['Playfair_Display',_serif] mb-2">
                Create New Post
              </h1>
              <p className="text-gray-600">Share your thoughts, questions, or announcements with the community</p>
            </div>
            
            <button
              onClick={() => setPreviewMode(!previewMode)}
              type="button"
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition"
            >
              <FaEye />
              {previewMode ? "Edit Mode" : "Preview Mode"}
            </button>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Form Header */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-[#0B1A33]/5 to-[#1a365d]/5">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${selectedCategory.color} text-white`}>
                {selectedCategory.icon}
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Posting to: {selectedCategory.name}</h3>
                <p className="text-sm text-gray-600">{selectedCategory.description}</p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 md:p-8">
            {!previewMode ? (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Title */}
                <div>
                  <label className="block text-lg font-semibold text-gray-800 mb-3">
                    Post Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full p-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E4B84D] focus:border-transparent transition"
                    placeholder="What would you like to share?"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Choose a clear, descriptive title that summarizes your post
                  </p>
                </div>

                {/* Category Selection */}
                <div>
                  <label className="block text-lg font-semibold text-gray-800 mb-3">
                    Category
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {categories.map((category) => (
                      <label
                        key={category.id}
                        className={`relative flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          formData.category === category.id
                            ? `border-transparent bg-gradient-to-r ${category.color} bg-opacity-10`
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="category"
                          value={category.id}
                          checked={formData.category === category.id}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className={`p-2 rounded-lg ${formData.category === category.id ? `bg-gradient-to-r ${category.color} text-white` : 'bg-gray-100 text-gray-600'}`}>
                          {category.icon}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-800">{category.name}</div>
                          <div className="text-xs text-gray-500 mt-1">{category.description}</div>
                        </div>
                        {formData.category === category.id && (
                          <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full"></div>
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Content Editor */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-lg font-semibold text-gray-800">
                      Post Content
                    </label>
                    <span className={`text-sm ${charCount > 5000 ? 'text-red-600' : 'text-gray-500'}`}>
                      {charCount}/5000 characters
                    </span>
                  </div>
                  
                  <div className="border border-gray-300 rounded-xl overflow-hidden">
                    {/* Toolbar */}
                    <div className="bg-gray-50 border-b border-gray-300 p-3 flex items-center gap-2">
                      <button type="button" className="p-2 hover:bg-gray-200 rounded" title="Bold">
                        <strong>B</strong>
                      </button>
                      <button type="button" className="p-2 hover:bg-gray-200 rounded" title="Italic">
                        <em>I</em>
                      </button>
                      <div className="w-px h-6 bg-gray-300"></div>
                      <button type="button" className="p-2 hover:bg-gray-200 rounded" title="Bullet List">
                        • List
                      </button>
                      <button type="button" className="p-2 hover:bg-gray-200 rounded" title="Numbered List">
                        1. List
                      </button>
                      <div className="w-px h-6 bg-gray-300"></div>
                      <button type="button" className="p-2 hover:bg-gray-200 rounded">
                        <FaLink />
                      </button>
                    </div>
                    
                    {/* Textarea */}
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleContentChange}
                      className="w-full p-4 focus:outline-none min-h-[300px] resize-y"
                      placeholder="Write your post here... Be as detailed as possible to get better responses."
                      required
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="text-sm text-gray-500">Tips:</span>
                    <span className="text-sm text-gray-500">• Be clear and specific</span>
                    <span className="text-sm text-gray-500">• Use paragraphs for readability</span>
                    <span className="text-sm text-gray-500">• Ask questions to encourage responses</span>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-lg font-semibold text-gray-800 mb-3">
                    Tags <span className="text-gray-500 text-sm font-normal">(Optional)</span>
                  </label>
                  <div className="flex gap-2 mb-3">
                    <div className="flex-1 relative">
                      <FaTag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={formData.newTag}
                        onChange={(e) => setFormData(prev => ({ ...prev, newTag: e.target.value }))}
                        onKeyPress={handleKeyPress}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E4B84D] focus:border-transparent transition"
                        placeholder="Add tags (press Enter)"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition"
                    >
                      Add Tag
                    </button>
                  </div>
                  
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-2 bg-blue-100 text-blue-800 rounded-full"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="text-blue-800 hover:text-blue-900"
                          >
                            <FaTimes size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-sm text-gray-500 mt-2">
                    Add relevant tags to help others find your post (e.g., "housing", "jobs", "events")
                  </p>
                </div>

                {/* Attachments */}
                <div>
                  <label className="block text-lg font-semibold text-gray-800 mb-3">
                    Attachments <span className="text-gray-500 text-sm font-normal">(Optional)</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#E4B84D] transition-colors">
                    <input
                      type="file"
                      id="file-upload"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      accept="image/*,.pdf,.doc,.docx"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <FaImage className="text-2xl text-gray-400" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">Click to upload files</div>
                          <div className="text-sm text-gray-500 mt-1">
                            Supports images, PDFs, Word documents
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>
                  
                  {formData.attachments.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h4 className="font-medium text-gray-700">Selected files:</h4>
                      {formData.attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded">
                              {file.type === 'image' ? <FaImage /> : <FaLink />}
                            </div>
                            <div>
                              <div className="font-medium">{file.name}</div>
                              <div className="text-sm text-gray-500">{file.size}</div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveAttachment(index)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Post Options */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800">Post Options</h4>
                  
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
                      <input
                        type="checkbox"
                        name="isPinned"
                        checked={formData.isPinned}
                        onChange={handleChange}
                        className="mt-1 w-5 h-5 text-amber-600 rounded focus:ring-amber-500"
                      />
                      <div>
                        <div className="font-semibold text-amber-800 flex items-center gap-2">
                          <FaThumbtack />
                          Pin this post
                        </div>
                        <p className="text-sm text-amber-700 mt-1">
                          Keep this post at the top of the community feed (Admin approval required)
                        </p>
                      </div>
                    </label>
                    
                    <label className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-200">
                      <input
                        type="checkbox"
                        name="isUrgent"
                        checked={formData.isUrgent}
                        onChange={handleChange}
                        className="mt-1 w-5 h-5 text-red-600 rounded focus:ring-red-500"
                      />
                      <div>
                        <div className="font-semibold text-red-800 flex items-center gap-2">
                          <FaExclamationTriangle />
                          Mark as Urgent
                        </div>
                        <p className="text-sm text-red-700 mt-1">
                          Use for time-sensitive posts that need immediate attention
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
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
                        Publishing Post...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane />
                        Publish Post
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => navigate("/community")}
                    className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              /* Preview Mode */
              <div className="space-y-8">
                <div className="border-l-4 border-[#E4B84D] pl-4 py-2 bg-amber-50 rounded-r">
                  <h3 className="font-bold text-gray-800">Preview Mode</h3>
                  <p className="text-gray-600 text-sm">This is how your post will appear to others</p>
                </div>
                
                {/* Preview Card */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white">
                          YU
                        </div>
                        <div>
                          <div className="font-bold text-gray-800">Your Username</div>
                          <div className="text-sm text-gray-500">Just now • Preview</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {formData.isPinned && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
                            <FaThumbtack />
                            Pinned
                          </span>
                        )}
                        {formData.isUrgent && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                            <FaExclamationTriangle />
                            Urgent
                          </span>
                        )}
                        <span className={`px-3 py-1 rounded-full text-white text-sm font-medium bg-gradient-to-r ${selectedCategory.color}`}>
                          {selectedCategory.name}
                        </span>
                      </div>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">{formData.title || "Your Post Title"}</h2>
                    
                    <div className="prose max-w-none mb-6">
                      <p className="text-gray-700 whitespace-pre-line">
                        {formData.content || "Your post content will appear here..."}
                      </p>
                    </div>
                    
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {formData.tags.map((tag, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {formData.attachments.length > 0 && (
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h4 className="font-medium text-gray-700 mb-2">Attachments ({formData.attachments.length})</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {formData.attachments.map((file, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                              <div className="p-2 bg-gray-100 rounded">
                                {file.type === 'image' ? <FaImage /> : <FaLink />}
                              </div>
                              <div>
                                <div className="font-medium text-sm">{file.name}</div>
                                <div className="text-xs text-gray-500">{file.size}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex items-center gap-6 text-gray-600">
                      <span className="flex items-center gap-2">
                        <FaPaperPlane />
                        0 comments
                      </span>
                      <span className="flex items-center gap-2">
                        <FaPaperPlane />
                        0 likes
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <button
                    onClick={() => setPreviewMode(false)}
                    className="flex-1 py-4 bg-gradient-to-r from-[#0B1A33] to-[#1a365d] text-white font-bold rounded-xl hover:shadow-lg transition"
                  >
                    Back to Editing
                  </button>
                  <button
                    onClick={handleSubmit}
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
                        Publishing...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane />
                        Publish Post
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-blue-50 rounded-2xl border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-3">📝 Writing Tips</h4>
            <ul className="space-y-2 text-blue-700 text-sm">
              <li>• Be clear and specific in your message</li>
              <li>• Use proper formatting for readability</li>
              <li>• Include relevant context and details</li>
              <li>• Ask questions to encourage engagement</li>
            </ul>
          </div>
          
          <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200">
            <h4 className="font-semibold text-emerald-800 mb-3">🎯 Best Practices</h4>
            <ul className="space-y-2 text-emerald-700 text-sm">
              <li>• Choose the right category for your post</li>
              <li>• Add relevant tags for better visibility</li>
              <li>• Be respectful and follow community guidelines</li>
              <li>• Mark urgent only for time-sensitive matters</li>
            </ul>
          </div>
          
          <div className="p-6 bg-purple-50 rounded-2xl border border-purple-200">
            <h4 className="font-semibold text-purple-800 mb-3">⏱️ Post Guidelines</h4>
            <ul className="space-y-2 text-purple-700 text-sm">
              <li>• Minimum 20 characters for meaningful posts</li>
              <li>• Pinned posts require admin approval</li>
              <li>• All posts are subject to community review</li>
              <li>• Check for existing discussions before posting</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;