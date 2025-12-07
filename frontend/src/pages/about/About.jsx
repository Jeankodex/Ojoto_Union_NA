import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { 
  FaFlag, FaBullseye, FaEye, FaTrophy, FaUsers, 
  FaPhone, FaEnvelope, FaMapMarkerAlt, FaGlobe,
  FaFacebook, FaTwitter, FaInstagram, FaLinkedin,
  FaArrowRight, FaHandshake, FaGraduationCap,
  FaHeartbeat, FaLaptopCode, FaRoad, FaUserTie,
  FaUserPlus  // ADD THIS IMPORT
} from "react-icons/fa";
import { motion, useInView } from "framer-motion";

// Import your images (you'll need to add these to your assets)
// import aboutHero from "../../assets/about-hero.jpg";
// import communityProject from "../../assets/community-project.jpg";
// import scholarship from "../../assets/scholarship.jpg";
// import healthCampaign from "../../assets/health-campaign.jpg";
// import techTraining from "../../assets/tech-training.jpg";

// Placeholder images - replace with actual images
const placeholderImages = {
  hero: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80",
  community: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80",
  education: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80",
  health: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80",
  tech: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=2069&q=80"
};

// Executive Team Data
const executives = [
  {
    name: "Chief John Okeke",
    position: "President",
    city: "Houston, TX",
    phone: "+1 (713) 555-0123",
    email: "president@ojotounion.org",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
  },
  {
    name: "Dr. Chioma Nwosu",
    position: "Vice President",
    city: "Toronto, ON",
    phone: "+1 (416) 555-0124",
    email: "vicepresident@ojotounion.org",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
  },
  {
    name: "Engr. Emeka Onyema",
    position: "General Secretary",
    city: "Atlanta, GA",
    phone: "+1 (404) 555-0125",
    email: "secretary@ojotounion.org",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
  },
  {
    name: "Mrs. Nneka Eze",
    position: "Assistant Secretary",
    city: "Chicago, IL",
    phone: "+1 (312) 555-0126",
    email: "assistant@ojotounion.org",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
  },
  {
    name: "Mr. Chukwudi Okafor",
    position: "Financial Secretary",
    city: "New York, NY",
    phone: "+1 (212) 555-0127",
    email: "finance@ojotounion.org",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
  },
  {
    name: "Mrs. Adaobi Okonkwo",
    position: "Treasurer",
    city: "Calgary, AB",
    phone: "+1 (403) 555-0128",
    email: "treasurer@ojotounion.org",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
  },
  {
    name: "Chief Uche Nwankwo",
    position: "Director of Socials",
    city: "Los Angeles, CA",
    phone: "+1 (213) 555-0129",
    email: "socials@ojotounion.org",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
  },
  {
    name: "Dr. Obinna Adeyemi",
    position: "Public Relations Officer",
    city: "Miami, FL",
    phone: "+1 (305) 555-0130",
    email: "pro@ojotounion.org",
    image: "https://images.unsplash.com/photo-1507591064344-4c6ce005-128?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
  }
];

// AnimatedSection Component
const AnimatedSection = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay }}
    >
      {children}
    </motion.div>
  );
};

// AchievementCard Component
const AchievementCard = ({ icon: Icon, title, description, image, stats, delay }) => {
  return (
    <AnimatedSection delay={delay}>
      <div className="group bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
        <div className="relative h-64 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute top-6 left-6 p-4 bg-gradient-to-br from-[#E4B84D] to-[#FFD166] rounded-2xl text-white">
            <Icon className="text-2xl" />
          </div>
        </div>
        <div className="p-8">
          <h4 className="text-2xl font-bold text-[#0B1A33] mb-3 group-hover:text-[#E4B84D] transition-colors">
            {title}
          </h4>
          <p className="text-gray-600 leading-relaxed mb-4">
            {description}
          </p>
          {stats && (
            <div className="flex gap-4 pt-4 border-t border-gray-100">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-2xl font-bold text-[#0B1A33]">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AnimatedSection>
  );
};

export default function About() {
  const heroRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeInUp');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="font-['Inter',_sans-serif]">
      
      {/* ------------------------------------------------------ */}
      {/* HERO SECTION                                           */}
      {/* ------------------------------------------------------ */}
      <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-[#0B1A33] via-[#1a365d] to-[#2d3748] text-white overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${placeholderImages.hero})` }}
        ></div>
        
        {/* Animated Background Elements */}
        <div className="absolute top-20 left-10 w-48 h-48 rounded-full bg-[#E4B84D] opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 rounded-full bg-blue-400 opacity-10 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-32 h-32 rounded-full bg-indigo-400 opacity-10 blur-3xl animate-pulse delay-500"></div>
        
        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl px-6 text-center animate-on-scroll">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="inline-flex items-center gap-3 mb-8 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <FaFlag className="text-[#E4B84D]" />
              <span className="font-semibold tracking-wider">ESTABLISHED 2010</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 tracking-tight">
              <span className="block font-['Playfair_Display',_serif]">
                <span className="text-[#E4B84D]">Ojoto Union</span>
                <span className="text-white"> North America</span>
              </span>
            </h1>
            
            <p className="mt-8 text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed font-light tracking-wide">
              The official umbrella organization for Ojotorians residing in the United States and Canada, 
              fostering unity, development, and cultural preservation.
            </p>
            
            {/* Animated Stats */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {[
                { value: "500+", label: "Active Members", delay: 0 },
                { value: "15+", label: "Years Serving", delay: 0.2 },
                { value: "$2M+", label: "Projects Funded", delay: 0.4 },
                { value: "50+", label: "Communities Impacted", delay: 0.6 },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: stat.delay }}
                  className="p-6 bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 hover:bg-white/15 hover:scale-105 transition-all duration-300"
                >
                  <h3 className="text-4xl font-bold text-white mb-2">{stat.value}</h3>
                  <p className="text-gray-200 font-medium tracking-wide text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2"></div>
          </div>
        </motion.div>
      </section>

      {/* ------------------------------------------------------ */}
      {/* WHO WE ARE SECTION                                     */}
      {/* ------------------------------------------------------ */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="w-12 h-1 bg-gradient-to-r from-[#E4B84D] to-[#FFD166] rounded-full"></div>
                <span className="text-[#E4B84D] font-semibold tracking-wider">OUR STORY</span>
                <div className="w-12 h-1 bg-gradient-to-r from-[#FFD166] to-[#E4B84D] rounded-full"></div>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#0B1A33] mb-6 font-['Playfair_Display',_serif]">
                Who We Are
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-[#E4B84D] to-[#FFD166] mx-auto rounded-full"></div>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <AnimatedSection delay={0.2}>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-[#E4B84D] to-[#FFD166] rounded-3xl opacity-20 blur-xl"></div>
                <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                  <div className="text-6xl text-[#E4B84D] mb-6">🏛️</div>
                  <h3 className="text-2xl font-bold text-[#0B1A33] mb-4">
                    Official Branch of Ojoto Akanasato Union
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Ojoto Union North America is the official overseas branch of <strong>OJOTO AKANASATO UNION</strong> - 
                    the recognized town leadership association for the people of Ojoto, in Idemili South Local Government Area, 
                    Anambra State, Nigeria.
                  </p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.4}>
              <div className="space-y-6">
                <div className="p-6 bg-gradient-to-br from-[#0B1A33] to-[#1a365d] rounded-3xl text-white">
                  <h4 className="text-xl font-bold mb-3 flex items-center gap-3">
                    <FaUsers className="text-[#E4B84D]" />
                    Our Umbrella Role
                  </h4>
                  <p className="text-gray-200 leading-relaxed">
                    We serve as the unifying umbrella for all Ojotorians residing in the 
                    <span className="font-bold text-[#E4B84D]"> United States of America and Canada</span>, 
                    connecting diaspora members with their roots while fostering community development.
                  </p>
                </div>

                <div className="p-6 bg-white rounded-3xl shadow-lg border border-gray-100">
                  <h4 className="text-xl font-bold text-[#0B1A33] mb-3 flex items-center gap-3">
                    <FaHandshake className="text-[#E4B84D]" />
                    Our Commitment
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    We are committed to preserving our cultural heritage, supporting hometown development, 
                    and creating opportunities for mutual growth among members across North America.
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ */}
      {/* MISSION & VISION                                       */}
      {/* ------------------------------------------------------ */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Mission */}
            <AnimatedSection delay={0.2}>
              <div className="h-full bg-gradient-to-br from-[#0B1A33] to-[#1a365d] rounded-3xl shadow-2xl p-10 text-white relative overflow-hidden">
                <div className="absolute top-10 right-10 w-40 h-40 rounded-full bg-[#E4B84D]/10 blur-3xl"></div>
                <div className="relative z-10">
                  <div className="inline-flex p-4 bg-white/10 rounded-2xl mb-6">
                    <FaBullseye className="text-3xl text-[#E4B84D]" />
                  </div>
                  <h3 className="text-3xl font-bold mb-6 font-['Playfair_Display',_serif]">
                    Our Mission
                  </h3>
                  <p className="text-xl text-gray-200 leading-relaxed mb-6">
                    To unite Ojotorians in North America through <span className="font-bold text-[#E4B84D]">cultural preservation</span>, 
                    <span className="font-bold text-[#E4B84D]"> community development</span>, and <span className="font-bold text-[#E4B84D]">mutual empowerment</span>, 
                    while maintaining strong ties with our homeland for sustainable progress.
                  </p>
                  <ul className="space-y-3">
                    {["Foster unity among diaspora members", "Drive development projects in Ojoto", "Provide educational opportunities", "Preserve cultural heritage"].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-[#E4B84D] rounded-full"></div>
                        <span className="text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </AnimatedSection>

            {/* Vision */}
            <AnimatedSection delay={0.4}>
              <div className="h-full bg-gradient-to-br from-[#E4B84D] via-[#FFD166] to-[#E4B84D] rounded-3xl shadow-2xl p-10 text-[#0B1A33] relative overflow-hidden">
                <div className="absolute bottom-10 left-10 w-40 h-40 rounded-full bg-white/20 blur-3xl"></div>
                <div className="relative z-10">
                  <div className="inline-flex p-4 bg-white/20 rounded-2xl mb-6">
                    <FaEye className="text-3xl" />
                  </div>
                  <h3 className="text-3xl font-bold mb-6 font-['Playfair_Display',_serif]">
                    Our Vision
                  </h3>
                  <p className="text-xl leading-relaxed mb-6">
                    To be the <span className="font-bold">premier diaspora community organization</span> that transforms Ojoto into a 
                    model community through innovative projects, youth empowerment, and sustainable development initiatives.
                  </p>
                  <ul className="space-y-3">
                    {["Model community in Anambra State", "Self-sufficient diaspora organization", "Global network of empowered Ojotorians", "Sustainable development legacy"].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-[#0B1A33] rounded-full"></div>
                        <span className="font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ */}
      {/* ACHIEVEMENTS                                           */}
      {/* ------------------------------------------------------ */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 mb-6">
                <FaTrophy className="text-3xl text-[#E4B84D]" />
                <span className="text-[#E4B84D] font-semibold tracking-wider text-xl">OUR IMPACT</span>
                <FaTrophy className="text-3xl text-[#E4B84D]" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#0B1A33] mb-6 font-['Playfair_Display',_serif]">
                Achievements & Projects
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Transforming communities through strategic interventions and sustainable development
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Community Development */}
            <AchievementCard
              icon={FaRoad}
              title="Community Development"
              description="Comprehensive infrastructure projects including road rehabilitation, modern bus stops, and roundabouts that have transformed transportation in Ojoto."
              image={placeholderImages.community}
              stats={[
                { value: "15+", label: "Roads Rehabilitated" },
                { value: "8", label: "Bus Stops Built" },
                { value: "3", label: "Roundabouts" }
              ]}
              delay={0.2}
            />

            {/* Education & Scholarship */}
            <AchievementCard
              icon={FaGraduationCap}
              title="Education & Scholarship"
              description="School renovation projects and scholarship programs providing educational opportunities for indigent students across Ojoto communities."
              image={placeholderImages.education}
              stats={[
                { value: "200+", label: "Students Supported" },
                { value: "5", label: "Schools Renovated" },
                { value: "$500K", label: "Scholarships Awarded" }
              ]}
              delay={0.4}
            />

            {/* Health Intervention */}
            <AchievementCard
              icon={FaHeartbeat}
              title="Health Intervention"
              description="Medical outreach programs, subsidized drug distribution, and health awareness campaigns improving community wellness."
              image={placeholderImages.health}
              stats={[
                { value: "50+", label: "Medical Campaigns" },
                { value: "2K+", label: "People Served" },
                { value: "$300K", label: "Medical Grants" }
              ]}
              delay={0.6}
            />

            {/* Tech Empowerment */}
            <AchievementCard
              icon={FaLaptopCode}
              title="Tech Empowerment Program"
              description="First batch of tech training completed at St. Paul's and St. Mark's tech hubs, equipping Ojoto youths with digital skills."
              image={placeholderImages.tech}
              stats={[
                { value: "100+", label: "Youths Trained" },
                { value: "2", label: "Tech Hubs" },
                { value: "85%", label: "Employment Rate" }
              ]}
              delay={0.8}
            />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ */}
      {/* EXECUTIVE TEAM                                         */}
      {/* ------------------------------------------------------ */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-[#0B1A33]">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 mb-6">
                <FaUserTie className="text-3xl text-[#E4B84D]" />
                <span className="text-[#E4B84D] font-semibold tracking-wider text-xl">LEADERSHIP</span>
                <FaUserTie className="text-3xl text-[#E4B84D]" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-['Playfair_Display',_serif]">
                Meet Our Executives
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto text-lg">
                Dedicated leaders steering our community towards growth and development
              </p>
            </div>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {executives.map((exec, idx) => (
              <AnimatedSection key={exec.name} delay={idx * 0.1}>
                <div className="group bg-white/10 backdrop-blur-sm rounded-3xl overflow-hidden hover:bg-white/15 transition-all duration-500 hover:-translate-y-2 border border-white/20">
                  <div className="p-6">
                    <div className="relative w-24 h-24 mx-auto mb-6">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#E4B84D] to-[#FFD166] rounded-full opacity-20 group-hover:opacity-30 transition-opacity"></div>
                      <img
                        src={exec.image}
                        alt={exec.name}
                        className="w-full h-full object-cover rounded-full border-4 border-white/20 group-hover:border-[#E4B84D]/50 transition-all"
                      />
                    </div>
                    <h4 className="text-xl font-bold text-white text-center mb-2">{exec.name}</h4>
                    <p className="text-[#E4B84D] font-semibold text-center mb-4">{exec.position}</p>
                    <div className="space-y-2 text-gray-300 text-sm">
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-xs" />
                        <span>{exec.city}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaPhone className="text-xs" />
                        <span>{exec.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaEnvelope className="text-xs" />
                        <span className="truncate">{exec.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ */}
      {/* CONTACT US & CTA                                       */}
      {/* ------------------------------------------------------ */}
      <section className="py-24 bg-gradient-to-b from-[#0B1A33] to-[#1a365d]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <AnimatedSection delay={0.2}>
              <div className="bg-white rounded-3xl shadow-2xl p-10">
                <h3 className="text-3xl font-bold text-[#0B1A33] mb-8 font-['Playfair_Display',_serif]">
                  Contact Us
                </h3>
                
                <div className="space-y-6">
                  {/* USA Office */}
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
                    <div className="p-3 bg-[#0B1A33] rounded-xl text-white">
                      <FaMapMarkerAlt />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0B1A33] mb-1">USA Office</h4>
                      <p className="text-gray-600">
                        123 Community Plaza, Suite 500<br />
                        Houston, TX 77002<br />
                        United States
                      </p>
                    </div>
                  </div>

                  {/* Nigeria Office */}
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
                    <div className="p-3 bg-[#0B1A33] rounded-xl text-white">
                      <FaMapMarkerAlt />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0B1A33] mb-1">Ojoto Headquarters</h4>
                      <p className="text-gray-600">
                        Ojoto Akanasato Union Secretariat<br />
                        Ojoto, Idemili South LGA<br />
                        Anambra State, Nigeria
                      </p>
                    </div>
                  </div>

                  {/* Contact Details */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-2xl">
                      <div className="flex items-center gap-3 mb-2">
                        <FaPhone className="text-[#E4B84D]" />
                        <span className="font-semibold text-[#0B1A33]">Phone</span>
                      </div>
                      <p className="text-gray-600">+1 (800) 555-OUNA</p>
                      <p className="text-gray-600">+234 800 OJOTOUNION</p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-2xl">
                      <div className="flex items-center gap-3 mb-2">
                        <FaEnvelope className="text-[#E4B84D]" />
                        <span className="font-semibold text-[#0B1A33]">Email</span>
                      </div>
                      <p className="text-gray-600">info@ojotounion.org</p>
                      <p className="text-gray-600">support@ojotounion.org</p>
                    </div>
                  </div>

                  {/* Website */}
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <div className="flex items-center gap-3 mb-2">
                      <FaGlobe className="text-[#E4B84D]" />
                      <span className="font-semibold text-[#0B1A33]">Website</span>
                    </div>
                    <a 
                      href="https://www.ojotounion.org" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      www.ojotounion.org
                    </a>
                  </div>

                  {/* Social Media */}
                  <div className="pt-6 border-t border-gray-200">
                    <h4 className="font-bold text-[#0B1A33] mb-4">Follow Us</h4>
                    <div className="flex gap-4">
                      {[
                        { icon: FaFacebook, label: "Facebook", color: "bg-blue-600" },
                        { icon: FaTwitter, label: "Twitter", color: "bg-blue-400" },
                        { icon: FaInstagram, label: "Instagram", color: "bg-pink-600" },
                        { icon: FaLinkedin, label: "LinkedIn", color: "bg-blue-700" },
                      ].map((social, idx) => (
                        <a
                          key={idx}
                          href="#"
                          className={`${social.color} w-12 h-12 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform`}
                          aria-label={social.label}
                        >
                          <social.icon />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* CTA Section */}
            <AnimatedSection delay={0.4}>
              <div className="bg-gradient-to-br from-[#E4B84D] via-[#FFD166] to-[#E4B84D] rounded-3xl shadow-2xl p-10 text-[#0B1A33] relative overflow-hidden">
                <div className="absolute top-10 right-10 w-40 h-40 rounded-full bg-white/20 blur-3xl"></div>
                <div className="relative z-10">
                  <h3 className="text-3xl font-bold mb-6 font-['Playfair_Display',_serif]">
                    Join Our Community
                  </h3>
                  
                  <p className="text-xl mb-8 leading-relaxed">
                    Become part of a vibrant community making real impact. Connect with fellow Ojotorians, 
                    contribute to development projects, and grow both personally and professionally.
                  </p>

                  <div className="space-y-6 mb-10">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <FaUsers className="text-xl" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg mb-1">Network & Connect</h4>
                        <p className="text-[#0B1A33]/80">Build meaningful relationships with professionals across North America</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <FaHandshake className="text-xl" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg mb-1">Make Impact</h4>
                        <p className="text-[#0B1A33]/80">Contribute to transformational projects in our hometown</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <FaTrophy className="text-xl" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg mb-1">Grow Together</h4>
                        <p className="text-[#0B1A33]/80">Access exclusive opportunities for personal and professional development</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Link
                      to="/register"
                      className="block w-full px-8 py-4 bg-[#0B1A33] text-white font-bold rounded-xl text-center hover:bg-[#1a2d4d] hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                    >
                      <FaUserPlus />
                      Register Now
                      <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                    </Link>

                    <Link
                      to="/login"
                      className="block w-full px-8 py-4 bg-white/20 backdrop-blur-sm text-[#0B1A33] font-bold rounded-xl text-center hover:bg-white/30 hover:scale-[1.02] transition-all duration-300 border-2 border-white/30"
                    >
                      Existing Member? Sign In
                    </Link>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/30 text-sm text-[#0B1A33]/70">
                    <p>Registration takes less than 2 minutes. Join 500+ members already making a difference!</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Add animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
}