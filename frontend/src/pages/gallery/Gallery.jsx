import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaSearch, FaFilter, FaTimes, FaDownload, 
  FaShareAlt, FaExpand, FaArrowLeft, FaArrowRight,
  FaUsers, FaRoad, FaGraduationCap, FaHeartbeat,
  FaCalendarAlt, FaUserTie
} from "react-icons/fa";

// Import your actual images here
import roadRehab1 from "../../assets/gallery/community-projects/road-construction1.jpeg";
import roadRehab2 from "../../assets/gallery/community-projects/road-construction2.jpeg";

import techStudents1 from "../../assets/gallery/education/tech-training1.jpg";
import techStudents2 from "../../assets/gallery/education/tech-training2.jpg";
import techStudents3 from "../../assets/gallery/education/tech-training3.jpg";
import techStudents4 from "../../assets/gallery/education/tech-training4.jpg";
import techStudents5 from "../../assets/gallery/education/tech-training5.jpg";
import classPupils from "../../assets/gallery/education/classpupils.jpeg";
import classStudents from "../../assets/gallery/education/classstudents.jpeg";

import sampleGroup from "../../assets/gallery/events/groupix.jpeg";

import health1 from "../../assets/gallery/health/hospital1.jpeg";
import health2 from "../../assets/gallery/health/hospital2.jpeg";
import health3 from "../../assets/gallery/health/hospital3.jpeg";
import health4 from "../../assets/gallery/health/hospital4.jpeg";
import health5 from "../../assets/gallery/health/health-outreach1.jpeg";
import health6 from "../../assets/gallery/health/health-outreach2.jpeg";
import health7 from "../../assets/gallery/health/health-outreach3.jpeg";

// GALLERY CATEGORIES
const galleryCategories = [
  { id: 'all', name: 'All Photos', icon: <FaSearch />, count: 0 },
  { id: 'projects', name: 'Community Projects', icon: <FaRoad />, count: 0 },
  { id: 'events', name: 'Events', icon: <FaCalendarAlt />, count: 0 },
  { id: 'education', name: 'Education', icon: <FaGraduationCap />, count: 0 },
  { id: 'health', name: 'Health Interventions', icon: <FaHeartbeat />, count: 0 },
  { id: 'executives', name: 'Executives', icon: <FaUserTie />, count: 0 },
  { id: 'members', name: 'Members', icon: <FaUsers />, count: 0 }
];

// GALLERY ITEMS WITH ACTUAL IMAGES
const galleryItems = [
  // COMMUNITY PROJECTS
  {
    id: 1,
    category: 'projects',
    title: 'Road Rehabilitation Project',
    description: 'Complete rehabilitation of Ojoto-Obosi road, 2023',
    date: 'Nov 2023',
    location: 'Ojoto, Anambra',
    image: roadRehab1,
    tags: ['infrastructure', 'development', 'road']
  },
  {
    id: 2,
    category: 'projects',
    title: 'Ongoing road construction in Ojoto',
    description: 'Standard roads with modern technology across Ojoto',
    date: 'Feb 2024',
    location: 'Ojoto Town',
    image: roadRehab2,
    tags: ['transport', 'modernization']
  },
  
  // EVENTS
  {
    id: 3,
    category: 'events',
    title: 'Annual General Meeting 2024',
    description: 'Members gathering for strategic planning',
    date: 'Dec 2024',
    location: 'Houston, TX',
    image: sampleGroup,
    tags: ['meeting', 'planning', 'members']
  },
  
  // EDUCATION
  {
    id: 4,
    category: 'education',
    title: 'Scholarship Award Ceremony',
    description: 'Awarding scholarships to indigent students',
    date: 'Sep 2024',
    location: 'Ojoto Secondary School',
    image: techStudents1,
    tags: ['education', 'scholarship', 'students']
  },
  {
    id: 5,
    category: 'education',
    title: 'Tech Hub Training Session',
    description: 'Youths learning digital skills at St. Paul\'s Tech Hub',
    date: 'Aug 2024',
    location: 'St. Paul\'s Tech Hub',
    image: techStudents2,
    tags: ['technology', 'youth', 'empowerment']
  },
  {
    id: 6,
    category: 'education',
    title: 'Advanced Tech Training',
    description: 'Students mastering modern technologies',
    date: 'Aug 2024',
    location: 'St. Paul\'s Tech Hub',
    image: techStudents3,
    tags: ['technology', 'learning', 'skills']
  },
  {
    id: 7,
    category: 'education',
    title: 'Classroom Session',
    description: 'Interactive learning environment',
    date: 'Sep 2024',
    location: 'Ojoto Schools',
    image: classPupils,
    tags: ['classroom', 'learning', 'students']
  },
  {
    id: 8,
    category: 'education',
    title: 'Student Engagement',
    description: 'Active participation in class activities',
    date: 'Sep 2024',
    location: 'Ojoto Schools',
    image: classStudents,
    tags: ['engagement', 'education', 'youth']
  },
  
  // HEALTH
  {
    id: 9,
    category: 'health',
    title: 'Hospital Facility',
    description: 'Modern healthcare infrastructure',
    date: 'Jul 2024',
    location: 'Ojoto Health Center',
    image: health1,
    tags: ['health', 'infrastructure', 'facility']
  },
  {
    id: 10,
    category: 'health',
    title: 'Medical Outreach Program',
    description: 'Free medical checkup for community members',
    date: 'Jul 2024',
    location: 'Ojoto Health Center',
    image: health2,
    tags: ['health', 'medical', 'community']
  },
  {
    id: 11,
    category: 'health',
    title: 'Healthcare Services',
    description: 'Quality medical care delivery',
    date: 'Jul 2024',
    location: 'Ojoto Health Center',
    image: health3,
    tags: ['healthcare', 'services', 'medical']
  },
  {
    id: 12,
    category: 'health',
    title: 'Medical Facility',
    description: 'Well-equipped health center',
    date: 'Jul 2024',
    location: 'Ojoto Health Center',
    image: health4,
    tags: ['facility', 'equipment', 'health']
  },
  {
    id: 13,
    category: 'health',
    title: 'Community Health Outreach',
    description: 'Bringing healthcare to the people',
    date: 'Jun 2024',
    location: 'Ojoto Community',
    image: health5,
    tags: ['outreach', 'community', 'wellness']
  },
  {
    id: 14,
    category: 'health',
    title: 'Health Education',
    description: 'Teaching preventive healthcare',
    date: 'Jun 2024',
    location: 'Ojoto Community',
    image: health6,
    tags: ['education', 'prevention', 'awareness']
  },
  {
    id: 15,
    category: 'health',
    title: 'Medical Consultation',
    description: 'One-on-one health consultations',
    date: 'Jun 2024',
    location: 'Ojoto Community',
    image: health7,
    tags: ['consultation', 'care', 'medical']
  },
  
  // Add placeholder items for categories without images
  {
    id: 16,
    category: 'executives',
    title: 'Executive Committee Meeting',
    description: 'Planning community development initiatives',
    date: 'Oct 2024',
    location: 'Toronto, Canada',
    image: null,
    tags: ['leadership', 'planning', 'governance']
  },
  {
    id: 17,
    category: 'members',
    title: 'Community Members Gathering',
    description: 'Regular members meeting and bonding',
    date: 'Nov 2024',
    location: 'Various Locations',
    image: null,
    tags: ['membership', 'community', 'unity']
  }
];

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState(galleryItems);

  // Filter images based on category and search
  useEffect(() => {
    let filtered = galleryItems;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    setFilteredItems(filtered);
    
    // Update counts
    galleryCategories.forEach(cat => {
      if (cat.id === 'all') {
        cat.count = galleryItems.length;
      } else {
        cat.count = galleryItems.filter(item => item.category === cat.id).length;
      }
    });
  }, [selectedCategory, searchQuery]);

  const openLightbox = (item) => {
    setSelectedImage(item);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  const navigateImage = (direction) => {
    if (!selectedImage) return;
    
    const currentIndex = filteredItems.findIndex(item => item.id === selectedImage.id);
    let newIndex = currentIndex + direction;
    
    if (newIndex < 0) newIndex = filteredItems.length - 1;
    if (newIndex >= filteredItems.length) newIndex = 0;
    
    setSelectedImage(filteredItems[newIndex]);
  };

  // Get category emoji
  const getCategoryEmoji = (category) => {
    switch(category) {
      case 'projects': return '🏗️';
      case 'events': return '🎉';
      case 'education': return '🎓';
      case 'health': return '🏥';
      case 'executives': return '👔';
      case 'members': return '👥';
      default: return '📷';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* ------------------------------------------------------ */}
      {/* HERO HEADER                                           */}
      {/* ------------------------------------------------------ */}
      <section className="relative bg-gradient-to-br from-[#0B1A33] to-[#1a365d] text-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold font-['Playfair_Display',_serif] mb-6">
              Community <span className="text-[#E4B84D]">Gallery</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
              Visual journey through our community's achievements, events, and memorable moments
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search photos by title, description, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E4B84D] pr-12"
                />
                <FaSearch className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-14 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ */}
      {/* FILTER TABS                                           */}
      {/* ------------------------------------------------------ */}
      <div className="sticky top-0 z-30 bg-white shadow-lg py-4 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#0B1A33]">
              Categories
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({filteredItems.length} photos)
              </span>
            </h2>
            <div className="flex items-center gap-2 text-gray-600">
              <FaFilter />
              <span className="text-sm">Filter</span>
            </div>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {galleryCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all
                  ${selectedCategory === category.id
                    ? 'bg-gradient-to-r from-[#E4B84D] to-[#FFD166] text-[#0B1A33] font-semibold'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {category.icon}
                <span>{category.name}</span>
                <span className={`
                  text-xs px-2 py-0.5 rounded-full
                  ${selectedCategory === category.id
                    ? 'bg-white/30'
                    : 'bg-gray-300'
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
      {/* GALLERY GRID                                          */}
      {/* ------------------------------------------------------ */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {filteredItems.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-6">📷</div>
              <h3 className="text-2xl font-bold text-[#0B1A33] mb-3">No photos found</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Try a different search term or browse all categories
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer bg-white"
                  onClick={() => openLightbox(item)}
                >
                  {/* Image Container */}
                  <div className="aspect-square overflow-hidden bg-gray-200">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
                        <div className="text-4xl">
                          {getCategoryEmoji(item.category)}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Overlay Info */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-300 mb-3 line-clamp-2">{item.description}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="bg-white/20 px-2 py-1 rounded">{item.date}</span>
                        <span className="flex items-center gap-1">
                          <FaExpand /> View
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick Info */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-[#0B1A33] truncate">{item.title}</h3>
                      <span className="text-xs text-gray-500">{item.date}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 2).map((tag, idx) => (
                        <span key={idx} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                          {tag}
                        </span>
                      ))}
                      {item.tags.length > 2 && (
                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                          +{item.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ------------------------------------------------------ */}
      {/* LIGHTBOX MODAL                                        */}
      {/* ------------------------------------------------------ */}
      <AnimatePresence>
        {selectedImage && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 z-50"
              onClick={closeLightbox}
            />
            
            {/* Lightbox Content */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative w-full max-w-6xl bg-white rounded-3xl overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Lightbox Header */}
                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-[#0B1A33] to-[#1a365d] text-white">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedImage.title}</h2>
                    <p className="text-gray-300">{selectedImage.description}</p>
                  </div>
                  <button
                    onClick={closeLightbox}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <FaTimes className="text-2xl" />
                  </button>
                </div>
                
                {/* Lightbox Body */}
                <div className="grid lg:grid-cols-3 gap-8 p-8">
                  {/* Image Display */}
                  <div className="lg:col-span-2">
                    <div className="aspect-video bg-gray-200 rounded-xl overflow-hidden">
                      {selectedImage.image ? (
                        <img
                          src={selectedImage.image}
                          alt={selectedImage.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
                          <div className="text-6xl">
                            {getCategoryEmoji(selectedImage.category)}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Navigation Buttons */}
                    <div className="flex justify-center gap-4 mt-6">
                      <button
                        onClick={() => navigateImage(-1)}
                        className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                      >
                        <FaArrowLeft />
                      </button>
                      <button
                        onClick={() => navigateImage(1)}
                        className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                      >
                        <FaArrowRight />
                      </button>
                    </div>
                  </div>
                  
                  {/* Image Details */}
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="font-bold text-[#0B1A33] mb-4">Photo Details</h3>
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm text-gray-500">Date</div>
                          <div className="font-medium">{selectedImage.date}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Location</div>
                          <div className="font-medium">{selectedImage.location}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Category</div>
                          <div className="font-medium capitalize">{selectedImage.category}</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Tags */}
                    <div>
                      <h4 className="font-bold text-[#0B1A33] mb-3">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedImage.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-gradient-to-r from-[#E4B84D] to-[#FFD166] text-[#0B1A33] rounded-full text-sm font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex gap-3">
                      <button className="flex-1 py-3 bg-[#0B1A33] text-white rounded-xl font-semibold hover:bg-[#1a2d4d] transition-colors flex items-center justify-center gap-2">
                        <FaDownload /> Download
                      </button>
                      <button className="flex-1 py-3 border-2 border-[#0B1A33] text-[#0B1A33] rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                        <FaShareAlt /> Share
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* ------------------------------------------------------ */}
      {/* UPLOAD SECTION (For Admin)                            */}
      {/* ------------------------------------------------------ */}
      <section className="py-20 px-6 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#0B1A33] mb-6 font-['Playfair_Display',_serif]">
            Have Photos to Share?
          </h2>
          <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
            Community members can contribute photos to our gallery. Send your high-quality images 
            from events, projects, or community activities to our media team.
          </p>
          <button className="px-8 py-4 bg-gradient-to-r from-[#E4B84D] to-[#FFD166] text-[#0B1A33] font-bold rounded-xl hover:shadow-xl hover:scale-105 transition-all">
            Submit Photos to Gallery
          </button>
        </div>
      </section>
    </div>
  );
}