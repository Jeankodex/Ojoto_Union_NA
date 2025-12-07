import { useState, useEffect, useRef } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import heroImg from "../../assets/hero.jpg";
import { 
  FaArrowRight, FaUsers, FaCalendarAlt, FaComments, 
  FaHandsHelping, FaBullhorn, FaSearch, FaBell, 
  FaChartLine, FaGlobe, FaLock, FaUserFriends,
  FaRocket, FaAward, FaHeart
} from "react-icons/fa";
import { Link } from "react-router-dom";

// Image placeholders - replace with your actual images
const PLACEHOLDER_IMAGES = {
  discussion: "https://images.unsplash.com/photo-1589256469067-ea99122bbdc4?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80",
  community: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80",
  features: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80",
  events: "https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-1.2.1&auto=format&fit=crop&w=2069&q=80"
};

// Animated Section Component
const AnimatedSection = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 }
      }}
      transition={{ duration: 0.8, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon: Icon, title, description, index }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    whileHover={{ y: -10, scale: 1.02 }}
    className="group p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 
               border border-gray-100 hover:border-[#E4B84D]/30 relative overflow-hidden"
  >
    {/* Background Gradient */}
    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#E4B84D]/10 to-transparent rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
    
    <div className="relative z-10">
      <div className="inline-flex p-4 bg-gradient-to-br from-[#E4B84D] to-[#FFD166] rounded-2xl text-white mb-6 group-hover:rotate-12 transition-transform duration-300">
        <Icon className="text-2xl" />
      </div>
      <h3 className="text-2xl font-bold text-[#0B1A33] mb-4 group-hover:text-[#E4B84D] transition-colors">
        {title}
      </h3>
      <p className="text-gray-600 leading-relaxed mb-6">{description}</p>
      <div className="inline-flex items-center text-[#0B1A33] font-semibold group-hover:text-[#E4B84D] transition-colors">
        Learn More
        <FaArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
      </div>
    </div>
  </motion.div>
);

// Stat Card Component
const StatCard = ({ value, label, icon: Icon, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.2 }}
    whileHover={{ scale: 1.05 }}
    className="p-8 bg-white/10 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 
               hover:bg-white/15 transition-all duration-300 group"
  >
    <div className="flex flex-col items-center text-center">
      <div className="p-4 bg-white/20 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
        <Icon className="text-3xl text-[#E4B84D]" />
      </div>
      <h3 className="text-5xl font-bold text-white mb-2">{value}</h3>
      <p className="text-gray-200 font-medium tracking-wide text-lg">{label}</p>
    </div>
  </motion.div>
);

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [showSignUpOptions, setShowSignUpOptions] = useState(false);
  const heroRef = useRef(null);

  // Stats with animations
  const stats = [
    { value: "500+", label: "Active Members", icon: FaUsers },
    { value: "150+", label: "Monthly Discussions", icon: FaComments },
    { value: "50+", label: "Community Events", icon: FaCalendarAlt },
    { value: "$2M+", label: "Projects Funded", icon: FaChartLine }
  ];

  // Active Discussions
  const discussions = [
    {
      title: "Community Development Plans",
      category: "Planning",
      participants: 45,
      replies: 120,
      time: "2 hours ago",
      image: PLACEHOLDER_IMAGES.discussion
    },
    {
      title: "Youth Empowerment Programs",
      category: "Education",
      participants: 32,
      replies: 89,
      time: "5 hours ago",
      image: PLACEHOLDER_IMAGES.discussion
    }
  ];

  // Community Hub Features
  const communityHub = [
    {
      title: "Member Directory",
      description: "Connect with professionals across North America",
      icon: FaUserFriends,
      link: "/members"
    },
    {
      title: "Community Gallery",
      description: "Browse photos from events and projects",
      icon: FaGlobe,
      link: "/gallery"
    },
    {
      title: "Volunteer Hub",
      description: "Find opportunities to make a difference",
      icon: FaHandsHelping,
      link: "/volunteer"
    }
  ];

  // Platform Features
  const platformFeatures = [
    {
      title: "Real-time Announcements",
      description: "Instant updates from community leaders",
      icon: FaBell,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Secure Platform",
      description: "Enterprise-grade security for all communications",
      icon: FaLock,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Smart Networking",
      description: "AI-powered connection suggestions",
      icon: FaSearch,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Progress Tracking",
      description: "Monitor community development projects",
      icon: FaChartLine,
      color: "from-orange-500 to-yellow-500"
    }
  ];

  // Upcoming Events
  const upcomingEvents = [
    {
      title: "Annual General Meeting",
      date: "December 15, 2024",
      time: "6:00 PM EST",
      location: "Virtual & NYC",
      attendees: 150,
      image: PLACEHOLDER_IMAGES.events,
      status: "upcoming"
    },
    {
      title: "Cultural Heritage Night",
      date: "January 20, 2025",
      time: "7:30 PM EST",
      location: "Chicago Cultural Center",
      attendees: 200,
      image: PLACEHOLDER_IMAGES.events,
      status: "upcoming"
    },
    {
      title: "Career Development Workshop",
      date: "February 10, 2025",
      time: "5:00 PM EST",
      location: "Toronto Convention",
      attendees: 120,
      image: PLACEHOLDER_IMAGES.events,
      status: "upcoming"
    }
  ];

  return (
    <div className="w-full font-['Inter',_sans-serif] overflow-hidden">
      {/* ------------------------------------------------------ */}
      {/* PREMIUM HERO SECTION                                  */}
      {/* ------------------------------------------------------ */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0B1A33] via-[#1a365d] to-[#2d3748] text-white overflow-hidden"
      >
        {/* Parallax Background */}
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt="Community Hero"
            className="w-full h-full object-cover opacity-20 scale-110"
            style={{ transform: 'translateZ(-1px) scale(2)' }}
          />
        </div>

        {/* Animated Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1A33]/90 via-[#0B1A33]/70 to-[#0B1A33]/90"></div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-[#E4B84D] rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            {/* Animated Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="inline-flex items-center gap-2 mb-8 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
            >
              <FaRocket className="text-[#E4B84D] animate-pulse" />
              <span className="font-semibold tracking-wider">WELCOME TO OUR COMMUNITY</span>
            </motion.div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6 tracking-tighter">
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="block text-white font-['Playfair_Display',_serif]"
              >
                Ojoto Union
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="block text-[#E4B84D] text-4xl md:text-5xl lg:text-6xl font-semibold mt-4 font-['Playfair_Display',_serif]"
              >
                North America Chapter
              </motion.span>
            </h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="mt-8 text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed font-light tracking-wide"
            >
              Where tradition meets innovation. Connect with diaspora professionals, 
              contribute to hometown development, and grow within a thriving community.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
              className="mt-12 flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <button
                onClick={() => setShowSignUpOptions(!showSignUpOptions)}
                className="relative px-12 py-5 bg-gradient-to-r from-[#E4B84D] via-[#FFD166] to-[#E4B84D] 
                         text-[#0B1A33] text-xl font-bold rounded-2xl shadow-2xl 
                         hover:shadow-3xl hover:scale-105 transition-all duration-300
                         hover:from-[#FFD166] hover:via-[#E4B84D] hover:to-[#FFD166]
                         group overflow-hidden"
              >
                {/* Shine effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                <span className="relative flex items-center justify-center gap-3">
                  JOIN OUR COMMUNITY
                  <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                </span>
              </button>

              <Link
                to="/about"
                className="px-12 py-5 bg-white/10 backdrop-blur-sm border-2 border-white/30 
                         text-white text-xl font-bold rounded-2xl hover:bg-white/20 
                         hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
              >
                <FaGlobe />
                LEARN MORE
              </Link>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto"
            >
              {stats.map((stat, index) => (
                <StatCard key={index} {...stat} index={index} />
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <div className="flex flex-col items-center">
            <span className="text-sm text-gray-300 mb-2">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-[#E4B84D] rounded-full mt-2"></div>
            </div>
          </div>
        </motion.div>

        {/* Sign Up Options Modal */}
        {showSignUpOptions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div 
              className="absolute inset-0 bg-black/70" 
              onClick={() => setShowSignUpOptions(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden z-10"
            >
              <div className="bg-gradient-to-r from-[#0B1A33] to-[#1a365d] p-8 text-center">
                <h3 className="text-2xl font-bold text-white">Join Ojoto Union NA</h3>
                <p className="text-gray-300 mt-2">Choose your path to community</p>
              </div>
              
              <div className="p-8 space-y-4">
                <Link
                  to="/register"
                  className="block w-full px-6 py-4 bg-gradient-to-r from-[#E4B84D] to-[#FFD166] 
                           text-[#0B1A33] font-bold rounded-xl hover:shadow-lg hover:scale-[1.02] 
                           transition-all duration-300 text-center"
                  onClick={() => setShowSignUpOptions(false)}
                >
                  CREATE ACCOUNT
                </Link>
                <Link
                  to="/login"
                  className="block w-full px-6 py-4 border-2 border-[#0B1A33] text-[#0B1A33] 
                           font-bold rounded-xl hover:bg-[#0B1A33] hover:text-white 
                           transition-all duration-300 text-center"
                  onClick={() => setShowSignUpOptions(false)}
                >
                  SIGN IN
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </section>

      {/* ------------------------------------------------------ */}
      {/* ACTIVE DISCUSSIONS SECTION                            */}
      {/* ------------------------------------------------------ */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection delay={0.1}>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 mb-6">
                <FaComments className="text-3xl text-[#E4B84D]" />
                <span className="text-[#E4B84D] font-semibold tracking-wider text-xl">LIVE CONVERSATIONS</span>
                <FaComments className="text-3xl text-[#E4B84D]" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#0B1A33] mb-6 font-['Playfair_Display',_serif]">
                Active Discussions
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Join real-time conversations shaping our community's future
              </p>
            </div>
          </AnimatedSection>

          <div className="grid lg:grid-cols-2 gap-8">
            {discussions.map((discussion, index) => (
              <AnimatedSection key={index} delay={0.2 + index * 0.1}>
                <motion.div
                  whileHover={{ y: -10 }}
                  className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl overflow-hidden transition-all duration-300"
                >
                  <div className="md:flex">
                    <div className="md:w-1/3 relative overflow-hidden">
                      <img
                        src={discussion.image}
                        alt={discussion.title}
                        className="w-full h-48 md:h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      <div className="absolute top-4 left-4 px-3 py-1 bg-[#E4B84D] text-white text-sm font-bold rounded-full">
                        {discussion.category}
                      </div>
                    </div>
                    
                    <div className="md:w-2/3 p-8">
                      <h3 className="text-2xl font-bold text-[#0B1A33] mb-3 group-hover:text-[#E4B84D] transition-colors">
                        {discussion.title}
                      </h3>
                      
                      <div className="flex items-center gap-6 mb-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaUsers className="text-[#E4B84D]" />
                          <span className="font-medium">{discussion.participants} participants</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaComments className="text-[#E4B84D]" />
                          <span className="font-medium">{discussion.replies} replies</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-500 text-sm mb-6">{discussion.time}</p>
                      
                      <Link
                        to="/community"
                        className="inline-flex items-center text-[#0B1A33] font-semibold group-hover:text-[#E4B84D] transition-colors"
                      >
                        Join Discussion
                        <FaArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={0.4}>
            <div className="mt-12 text-center">
              <Link
                to="/questions"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#0B1A33] to-[#1a365d] 
                         text-white font-bold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <FaComments className="mr-3" />
                Explore All Discussions
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ------------------------------------------------------ */}
      {/* COMMUNITY HUB SECTION                                 */}
      {/* ------------------------------------------------------ */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection delay={0.1}>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 mb-6">
                <FaGlobe className="text-3xl text-[#E4B84D]" />
                <span className="text-[#E4B84D] font-semibold tracking-wider text-xl">YOUR GATEWAY</span>
                <FaGlobe className="text-3xl text-[#E4B84D]" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#0B1A33] mb-6 font-['Playfair_Display',_serif]">
                Community Hub
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Access all community resources from one central location
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {communityHub.map((item, index) => (
              <AnimatedSection key={index} delay={0.2 + index * 0.1}>
                <Link
                  to={item.link}
                  className="group block h-full"
                >
                  <motion.div
                    whileHover={{ y: -15 }}
                    className="h-full p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl 
                             transition-all duration-300 border border-gray-100 relative overflow-hidden"
                  >
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#E4B84D]/5 to-transparent rounded-full -translate-y-20 translate-x-20"></div>
                    
                    <div className="relative z-10">
                      <div className="inline-flex p-4 bg-gradient-to-br from-[#E4B84D] to-[#FFD166] rounded-2xl text-white mb-6 group-hover:rotate-12 transition-transform">
                        <item.icon className="text-2xl" />
                      </div>
                      
                      <h3 className="text-2xl font-bold text-[#0B1A33] mb-4 group-hover:text-[#E4B84D] transition-colors">
                        {item.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-6">{item.description}</p>
                      
                      <div className="inline-flex items-center text-[#0B1A33] font-semibold group-hover:text-[#E4B84D] transition-colors">
                        Explore
                        <FaArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ */}
      {/* PLATFORM FEATURES SECTION                             */}
      {/* ------------------------------------------------------ */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection delay={0.1}>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 mb-6">
                <FaAward className="text-3xl text-[#E4B84D]" />
                <span className="text-[#E4B84D] font-semibold tracking-wider text-xl">PREMIUM FEATURES</span>
                <FaAward className="text-3xl text-[#E4B84D]" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#0B1A33] mb-6 font-['Playfair_Display',_serif]">
                Platform Features
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Everything you need for seamless community engagement
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {platformFeatures.map((feature, index) => (
              <AnimatedSection key={index} delay={0.2 + index * 0.1}>
                <motion.div
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 
                           border border-gray-100 group relative overflow-hidden"
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
                  
                  <div className="relative z-10">
                    <div className={`inline-flex p-4 bg-gradient-to-br ${feature.color} rounded-2xl text-white mb-6`}>
                      <feature.icon className="text-2xl" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-[#0B1A33] mb-3">{feature.title}</h3>
                    
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={0.6}>
            <div className="mt-16 text-center">
              <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#E4B84D] to-[#FFD166] 
                           text-[#0B1A33] font-bold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300">
                <FaRocket className="animate-bounce" />
                Experience Premium Features
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ------------------------------------------------------ */}
      {/* UPCOMING EVENTS SECTION                               */}
      {/* ------------------------------------------------------ */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-[#0B1A33]">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection delay={0.1}>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 mb-6">
                <FaCalendarAlt className="text-3xl text-[#E4B84D]" />
                <span className="text-[#E4B84D] font-semibold tracking-wider text-xl">MARK YOUR CALENDAR</span>
                <FaCalendarAlt className="text-3xl text-[#E4B84D]" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-['Playfair_Display',_serif]">
                Upcoming Events
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto text-lg">
                Don't miss out on these exciting community gatherings
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {upcomingEvents.map((event, index) => (
              <AnimatedSection key={index} delay={0.2 + index * 0.1}>
                <motion.div
                  whileHover={{ y: -10 }}
                  className="group bg-white/10 backdrop-blur-sm rounded-3xl overflow-hidden 
                           hover:bg-white/15 transition-all duration-300 border border-white/20"
                >
                  {/* Event Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute top-4 left-4 px-3 py-1 bg-[#E4B84D] text-white text-sm font-bold rounded-full">
                      UPCOMING
                    </div>
                  </div>
                  
                  {/* Event Details */}
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-[#E4B84D] transition-colors">
                      {event.title}
                    </h3>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-gray-300">
                        <FaCalendarAlt className="text-[#E4B84D]" />
                        <span>{event.date} • {event.time}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-300">
                        <FaUsers className="text-[#E4B84D]" />
                        <span>{event.attendees} attending</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-300">
                        <FaGlobe className="text-[#E4B84D]" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setShowModal(true)}
                      className="w-full py-3 bg-gradient-to-r from-[#E4B84D] to-[#FFD166] 
                               text-[#0B1A33] font-bold rounded-xl hover:shadow-lg hover:scale-[1.02] 
                               transition-all duration-300"
                    >
                      RSVP Now
                    </button>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={0.5}>
            <div className="mt-16 text-center">
              <Link
                to="/volunteer"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#E4B84D] to-[#FFD166] 
                         text-[#0B1A33] font-bold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <FaCalendarAlt className="mr-3" />
                View All Events
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ------------------------------------------------------ */}
      {/* FINAL CTA SECTION                                      */}
      {/* ------------------------------------------------------ */}
      <section className="py-24 bg-gradient-to-br from-[#0B1A33] to-[#1a365d]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <AnimatedSection delay={0.1}>
            <div className="inline-flex items-center gap-3 mb-8 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <FaHeart className="text-[#E4B84D] animate-pulse" />
              <span className="font-semibold tracking-wider text-white">READY TO JOIN?</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 font-['Playfair_Display',_serif]">
              Start Your Community Journey Today
            </h2>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
              Join hundreds of Ojotorians already making a difference. Connect, collaborate, 
              and contribute to our shared vision of community development.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/register"
                className="px-12 py-5 bg-gradient-to-r from-[#E4B84D] via-[#FFD166] to-[#E4B84D] 
                         text-[#0B1A33] text-xl font-bold rounded-2xl shadow-2xl 
                         hover:shadow-3xl hover:scale-105 transition-all duration-300
                         flex items-center justify-center gap-3"
              >
                <FaUserFriends />
                Join Now - It's Free
              </Link>
              
              <Link
                to="/about"
                className="px-12 py-5 bg-white/10 backdrop-blur-sm border-2 border-white/30 
                         text-white text-xl font-bold rounded-2xl hover:bg-white/20 
                         hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
              >
                <FaGlobe />
                Learn More
              </Link>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.5}>
            <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              {[
                { label: "No Hidden Fees", icon: "💰" },
                { label: "24/7 Support", icon: "🛟" },
                { label: "Secure Platform", icon: "🔒" }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <p className="text-gray-300 font-medium">{item.label}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ------------------------------------------------------ */}
      {/* EVENT DETAILS MODAL                                   */}
      {/* ------------------------------------------------------ */}
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-[#0B1A33] to-[#1a365d] p-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">Event Details</h3>
                  <p className="text-gray-300 mt-1">Annual General Meeting 2024</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <FaTimes className="text-2xl" />
                </button>
              </div>
            </div>
            
            <div className="p-8">
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-[#0B1A33] mb-2">📅 Date & Time</h4>
                    <p className="text-gray-700">December 15, 2024 • 6:00 PM EST</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0B1A33] mb-2">📍 Location</h4>
                    <p className="text-gray-700">Virtual & In-Person (New York City)</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-bold text-[#0B1A33] mb-2">📋 Agenda</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#E4B84D] rounded-full"></div>
                      Annual Reports & Financial Review
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#E4B84D] rounded-full"></div>
                      Community Development Projects Update
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#E4B84D] rounded-full"></div>
                      2025 Strategic Planning
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#E4B84D] rounded-full"></div>
                      Member Networking Session
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-bold text-[#0B1A33] mb-2">🎯 Who Should Attend</h4>
                  <p className="text-gray-700">
                    All registered members of Ojoto Union North America. This is a crucial 
                    gathering for planning our community's future direction.
                  </p>
                </div>
              </div>
              
              <div className="mt-8 flex gap-4">
                <button className="flex-1 py-4 bg-gradient-to-r from-[#E4B84D] to-[#FFD166] 
                         text-[#0B1A33] font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300">
                  Confirm Attendance
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 border-2 border-[#0B1A33] text-[#0B1A33] 
                           font-bold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}