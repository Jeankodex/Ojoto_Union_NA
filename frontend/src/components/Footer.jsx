import React from "react";
import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedinIn, 
  FaYoutube, 
  FaMapMarkerAlt, 
  FaEnvelope, 
  FaPhone, 
  FaClock,
  FaHeart,
  FaRegCopyright 
} from "react-icons/fa";
import { SiGooglemaps } from "react-icons/si";
import logo from "../assets/ojoto_union_logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Social media data with colors
  const socialLinks = [
    { 
      icon: <FaFacebookF />, 
      color: "from-[#1877F2] to-[#0A5BC4]", // Facebook blue gradient
      hover: "hover:shadow-[0_0_20px_#1877F2]",
      url: "#" 
    },
    { 
      icon: <FaTwitter />, 
      color: "from-[#1DA1F2] to-[#0C8DDB]", // Twitter blue gradient
      hover: "hover:shadow-[0_0_20px_#1DA1F2]",
      url: "#" 
    },
    { 
      icon: <FaInstagram />, 
      color: "from-[#E4405F] via-[#833AB4] to-[#FCAF45]", // Instagram gradient
      hover: "hover:shadow-[0_0_20px_#E4405F]",
      url: "#" 
    },
    { 
      icon: <FaLinkedinIn />, 
      color: "from-[#0A66C2] to-[#004182]", // LinkedIn blue gradient
      hover: "hover:shadow-[0_0_20px_#0A66C2]",
      url: "#" 
    },
    { 
      icon: <FaYoutube />, 
      color: "from-[#FF0000] to-[#CC0000]", // YouTube red gradient
      hover: "hover:shadow-[0_0_20px_#FF0000]",
      url: "#" 
    }
  ];

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Q&A Forum", path: "/questions" },
    { name: "Community", path: "/community" },
    { name: "Member Directory", path: "/members" },
    { name: "Announcements", path: "/post_announcement" },
    { name: "Volunteer Opportunities", path: "/volunteer" }
  ];

  const communityLinks = [
    { name: "Community Forum", path: "/community" },
    { name: "Member Profiles", path: "/members" },
    { name: "Events Calendar", path: "/events" },
    { name: "Photo Gallery", path: "/gallery" },
    { name: "Volunteer Portal", path: "/volunteer" },
    { name: "Post Opportunity", path: "/post_opportunity" }
  ];

  const contactInfo = [
    { icon: <SiGooglemaps />, text: "North America Chapter", color: "text-[#E4B84D]" },
    { icon: <FaEnvelope />, text: "contact@ojotounionna.org", color: "text-[#E4B84D]" },
    { icon: <FaPhone />, text: "+1 (555) 123-4567", color: "text-[#E4B84D]" },
    { icon: <FaClock />, text: "Mon - Fri: 9:00 AM - 5:00 PM EST", color: "text-[#E4B84D]" }
  ];

  return (
    <footer className="relative bg-gradient-to-b from-[#0B1A33] via-[#13274B] to-[#0B1A33] text-white pt-16 pb-8 mt-auto overflow-hidden">
      
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#E4B84D] to-transparent"></div>
      <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-[#E4B84D]/5 blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-blue-500/5 blur-3xl"></div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          
          {/* Left Column: Logo, Description & Social Media */}
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <img 
                src={logo} 
                alt="Ojoto Union Logo" 
                className="h-20 w-20 object-contain rounded-xl border-2 border-[#E4B84D]/30 shadow-lg" 
              />
              <div>
                <h2 className="text-2xl font-bold font-['Playfair_Display',_serif] mb-2">
                  Ojoto Union <span className="text-[#E4B84D]">North America</span>
                </h2>
                <p className="text-gray-300 text-sm leading-relaxed max-w-md">
                  A vibrant community connecting Ojoto indigenes across North America. 
                  We foster unity, preserve our cultural heritage, and support development 
                  initiatives through collaboration and shared values.
                </p>
              </div>
            </div>

            {/* Social Media Icons with Enhanced Styling */}
            <div>
              <h4 className="text-lg font-semibold mb-4 flex items-center">
                <span className="bg-gradient-to-r from-[#E4B84D] to-[#FFD166] bg-clip-text text-transparent">
                  Connect With Us
                </span>
              </h4>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    className={`
                      relative group flex items-center justify-center
                      w-12 h-12 rounded-xl
                      bg-gradient-to-br ${social.color}
                      text-white text-lg
                      transform transition-all duration-300
                      hover:scale-110 hover:-translate-y-1 ${social.hover}
                      shadow-lg
                    `}
                    aria-label={`Follow us on ${social.icon.type.displayName}`}
                  >
                    <span className="relative z-10">{social.icon}</span>
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 rounded-xl transition-colors duration-300"></div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Links Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold mb-6 pb-3 relative inline-block">
                <span className="relative z-10">Quick Links</span>
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#E4B84D] to-transparent"></div>
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.path}
                      className="
                        text-gray-300 hover:text-white
                        flex items-center gap-2
                        group transition-all duration-300
                        hover:pl-2
                      "
                    >
                      <span className="text-[#E4B84D] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        ▸
                      </span>
                      <span className="group-hover:text-[#E4B84D] transition-colors duration-300">
                        {link.name}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Community */}
            <div>
              <h4 className="text-lg font-bold mb-6 pb-3 relative inline-block">
                <span className="relative z-10">Community</span>
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#E4B84D] to-transparent"></div>
              </h4>
              <ul className="space-y-3">
                {communityLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.path}
                      className="
                        text-gray-300 hover:text-white
                        flex items-center gap-2
                        group transition-all duration-300
                        hover:pl-2
                      "
                    >
                      <span className="text-[#E4B84D] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        ▸
                      </span>
                      <span className="group-hover:text-[#E4B84D] transition-colors duration-300">
                        {link.name}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Information */}
            <div>
              <h4 className="text-lg font-bold mb-6 pb-3 relative inline-block">
                <span className="relative z-10">Contact Info</span>
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#E4B84D] to-transparent"></div>
              </h4>
              <ul className="space-y-4">
                {contactInfo.map((info, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className={`mt-1 ${info.color}`}>
                      {info.icon}
                    </div>
                    <span className="text-gray-300 text-sm leading-relaxed">
                      {info.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 my-8"></div>

        {/* Footer Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <FaRegCopyright className="text-[#E4B84D]" />
            <span>{currentYear} Ojoto Union North America. All rights reserved.</span>
            <FaHeart className="text-red-500 ml-2 animate-pulse" />
          </div>
          
          <div className="flex items-center gap-6 text-sm">
            <a
              href="/privacy"
              className="
                text-gray-400 hover:text-[#E4B84D]
                transition-colors duration-300
                hover:underline hover:underline-offset-4
              "
            >
              Privacy Policy
            </a>
            <span className="text-white/20">•</span>
            <a
              href="/terms"
              className="
                text-gray-400 hover:text-[#E4B84D]
                transition-colors duration-300
                hover:underline hover:underline-offset-4
              "
            >
              Terms of Service
            </a>
            <span className="text-white/20">•</span>
            <a
              href="/contact"
              className="
                text-gray-400 hover:text-[#E4B84D]
                transition-colors duration-300
                hover:underline hover:underline-offset-4
              "
            >
              Contact
            </a>
          </div>
        </div>

        {/* Back to Top */}
        <div className="text-center mt-8">
          <a
            href="#top"
            className="
              inline-flex items-center gap-2
              text-gray-400 hover:text-[#E4B84D]
              text-sm transition-colors duration-300
              group
            "
          >
            <span>Back to Top</span>
            <span className="transform group-hover:-translate-y-1 transition-transform duration-300">
              ↑
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;