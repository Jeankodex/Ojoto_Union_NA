

import { useState } from "react";
import heroImg from "../../assets/hero.jpg";
import { FaArrowRight, FaUsers, FaCalendarAlt, FaComments, FaHandsHelping, FaBullhorn } from "react-icons/fa";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [showSignUpOptions, setShowSignUpOptions] = useState(false);

  return (
    <div className="w-full font-['Inter',_sans-serif]">

      {/* ------------------------------------------------------ */}
      {/* ENHANCED HERO SECTION                                  */}
      {/* ------------------------------------------------------ */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0B1A33] via-[#1a365d] to-[#2d3748] text-white overflow-hidden">

        {/* Background Hero Image with enhanced effect */}
        <img
          src={heroImg}
          alt="Community Hero"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1A33]/80 via-transparent to-[#0B1A33]/60"></div>

        {/* Animated floating elements */}
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-[#E4B84D] opacity-15 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-blue-400 opacity-15 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 rounded-full bg-indigo-400 opacity-10 blur-3xl animate-pulse delay-500"></div>

        {/* HERO CONTENT */}
        <div className="relative z-10 max-w-5xl px-6 text-center">
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 tracking-tight">
            <span className="block text-white font-['Playfair_Display',_serif]">
              Ojoto Union
            </span>
            <span className="block text-[#E4B84D] text-4xl md:text-5xl font-semibold mt-2 font-['Playfair_Display',_serif]">
              North America Community
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed font-light tracking-wide">
            Connect, collaborate, and grow with your community. Real-time announcements, 
            meaningful discussions, and exclusive events await you.
          </p>

          {/* SIGN UP CALL TO ACTION */}
          <div className="mt-12 relative">
            <button
              onClick={() => setShowSignUpOptions(!showSignUpOptions)}
              className="px-10 py-4 bg-gradient-to-r from-[#E4B84D] via-[#FFD166] to-[#E4B84D] 
                       text-[#0B1A33] text-xl font-bold rounded-2xl shadow-2xl 
                       hover:shadow-3xl hover:scale-105 transition-all duration-300
                       hover:from-[#FFD166] hover:via-[#E4B84D] hover:to-[#FFD166]
                       animate-pulse hover:animate-none
                       flex items-center justify-center gap-3 mx-auto"
            >
              <span>JOIN OUR COMMUNITY NOW</span>
              <FaArrowRight className="animate-bounce" />
            </button>

            {/* Sign Up Options Dropdown */}
            {showSignUpOptions && (
              <div className="absolute left-1/2 transform -translate-x-1/2 mt-4 w-64 bg-white rounded-xl shadow-2xl overflow-hidden z-20 animate-fadeIn">
                <div className="p-1 bg-gradient-to-r from-[#E4B84D] to-[#FFD166]"></div>
                <div className="p-4">
                  <a
                    href="/register"
                    className="block w-full text-center px-6 py-3 mb-3 bg-[#0B1A33] text-white font-bold rounded-lg
                             hover:bg-[#1a2d4d] transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    CREATE ACCOUNT
                  </a>
                  <a
                    href="/login"
                    className="block w-full text-center px-6 py-3 border-2 border-[#0B1A33] text-[#0B1A33] font-bold rounded-lg
                             hover:bg-[#0B1A33] hover:text-white transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    SIGN IN
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Close dropdown when clicking outside */}
          {showSignUpOptions && (
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setShowSignUpOptions(false)}
            />
          )}

          {/* ENHANCED STATS */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { value: "150+", label: "Active Members", icon: <FaUsers className="text-2xl" /> },
              { value: "40+", label: "Monthly Discussions", icon: <FaComments className="text-2xl" /> },
              { value: "10+", label: "Community Events", icon: <FaCalendarAlt className="text-2xl" /> }
            ].map((stat, index) => (
              <div 
                key={index}
                className="p-6 bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 
                         hover:bg-white/15 hover:scale-105 transition-all duration-300 group"
              >
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="text-[#E4B84D] group-hover:scale-110 transition-transform">
                    {stat.icon}
                  </div>
                  <h3 className="text-4xl font-bold text-white">{stat.value}</h3>
                </div>
                <p className="text-gray-200 font-medium tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ */}
      {/* ENHANCED ACTIVE DISCUSSIONS SECTION                    */}
      {/* ------------------------------------------------------ */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-[#0B1A33] mb-4 font-['Playfair_Display',_serif]">
              Active Discussions
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#E4B84D] to-[#FFD166] mx-auto rounded-full"></div>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-lg">
              Join conversations that matter to our community
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              { 
                title: "Q&A Forum", 
                description: "Ask questions and receive helpful answers from community experts.", 
                link: "/questions",
                icon: <FaComments className="text-3xl" />
              },
              { 
                title: "Community Conversations", 
                description: "Engage in meaningful discussions with fellow members.", 
                link: "/community",
                icon: <FaUsers className="text-3xl" />
              }
            ].map((item, index) => (
              <a
                key={index}
                href={item.link}
                className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 
                         border border-gray-100 hover:border-[#E4B84D]/30 hover:scale-[1.02]"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-[#E4B84D] to-[#FFD166] rounded-xl text-white">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#0B1A33] group-hover:text-[#E4B84D] transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-gray-600 leading-relaxed">{item.description}</p>
                    <div className="mt-4 inline-flex items-center text-[#0B1A33] font-semibold group-hover:text-[#E4B84D] transition-colors">
                      Explore Now
                      <FaArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ */}
      {/* ENHANCED EVENTS SECTION                               */}
      {/* ------------------------------------------------------ */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-[#0B1A33] mb-4 font-['Playfair_Display',_serif]">
              Upcoming Events
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#E4B84D] to-[#FFD166] mx-auto rounded-full"></div>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-lg">
              Mark your calendar for these exciting community gatherings
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                title: "Annual General Meeting", 
                date: "December 15, 2024", 
                location: "Virtual & In-Person",
                icon: <FaCalendarAlt className="text-2xl" />
              },
              { 
                title: "Cultural Night Gala", 
                date: "January 20, 2025", 
                location: "New York City",
                icon: <FaCalendarAlt className="text-2xl" />
              },
              { 
                title: "Career Networking Mixer", 
                date: "February 10, 2025", 
                location: "Chicago",
                icon: <FaCalendarAlt className="text-2xl" />
              }
            ].map((event, index) => (
              <div
                key={index}
                className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 
                         border border-gray-100 hover:border-[#E4B84D]/30 hover:scale-[1.02] cursor-pointer group"
                onClick={() => setShowModal(true)}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-br from-[#E4B84D] to-[#FFD166] rounded-lg text-white">
                    {event.icon}
                  </div>
                  <h4 className="text-xl font-bold text-[#0B1A33] group-hover:text-[#E4B84D] transition-colors">
                    {event.title}
                  </h4>
                </div>
                <div className="space-y-2 mt-4">
                  <div className="flex items-center text-gray-700">
                    <span className="font-medium">📅 {event.date}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <span className="font-medium">📍 {event.location}</span>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <span className="inline-flex items-center text-[#0B1A33] font-semibold group-hover:text-[#E4B84D] transition-colors">
                    View Details
                    <FaArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ENHANCED COMMUNITY SECTION                            */}
  
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-[#0B1A33] mb-4 font-['Playfair_Display',_serif]">
              Community Hub
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#E4B84D] to-[#FFD166] mx-auto rounded-full"></div>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-lg">
              Explore all aspects of our vibrant community
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                title: "Member Directory", 
                description: "Connect with fellow community members",
                link: "/members",
                icon: <FaUsers className="text-2xl" />
              },
              { 
                title: "Community Gallery", 
                description: "Browse photos from our events",
                link: "/gallery",
                icon: <FaBullhorn className="text-2xl" />
              },
              { 
                title: "Volunteer Opportunities", 
                description: "Make a difference in our community",
                link: "/volunteer_opportunities",
                icon: <FaHandsHelping className="text-2xl" />
              }
            ].map((item, index) => (
              <a
                key={index}
                href={item.link}
                className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 
                         border border-gray-100 hover:border-[#E4B84D]/30 hover:scale-[1.02] text-center"
              >
                <div className="inline-flex p-4 bg-gradient-to-br from-[#E4B84D] to-[#FFD166] rounded-2xl text-white mb-4">
                  {item.icon}
                </div>
                <h4 className="text-2xl font-bold text-[#0B1A33] group-hover:text-[#E4B84D] transition-colors mb-3">
                  {item.title}
                </h4>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <div className="inline-flex items-center text-[#0B1A33] font-semibold group-hover:text-[#E4B84D] transition-colors">
                  Discover
                  <FaArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-[#0B1A33] mb-4 font-['Playfair_Display',_serif]">
              Platform Features
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#E4B84D] to-[#FFD166] mx-auto rounded-full"></div>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-lg">
              Everything you need to stay connected and engaged
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              { 
                title: "Instant Announcements", 
                description: "Receive real-time updates and important notifications directly from community leaders.",
                icon: <FaBullhorn className="text-3xl" />
              },
              { 
                title: "Community Engagement", 
                description: "Participate in discussions, share ideas, and collaborate on community projects.",
                icon: <FaComments className="text-3xl" />
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="p-8 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg 
                         border border-gray-100 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex items-start gap-5">
                  <div className="flex-shrink-0 p-3 bg-gradient-to-br from-[#E4B84D] to-[#FFD166] rounded-xl text-white">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-[#0B1A33] mb-3">{feature.title}</h4>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeIn">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#0B1A33] to-[#1a365d] p-6">
              <h3 className="text-2xl font-bold text-white text-center">Event Details</h3>
            </div>
            
            {/* Modal Body */}
            <div className="p-8">
              <p className="text-gray-700 text-center text-lg leading-relaxed">
                Detailed information about our upcoming events will be available soon. 
                Stay tuned for announcements!
              </p>
              
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-8 py-3 bg-gradient-to-r from-[#E4B84D] to-[#FFD166] text-[#0B1A33] 
                           font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  Got It!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>

    </div>
  );
}