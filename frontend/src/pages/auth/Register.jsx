import React, { useState } from "react";
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaEye, FaEyeSlash, FaCheck, FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "../../assets/ojoto_union_logo.png";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    surname: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

 // Inside the Register component, replace the handleSubmit function:
const { register } = useAuth();
const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Validate passwords match
  if (formData.password !== formData.confirmPassword) {
    alert('Passwords do not match');
    return;
  }
  
  if (!formData.agreeTerms) {
    alert('You must agree to the terms and conditions');
    return;
  }

  setIsSubmitting(true);
  
  try {
    // Prepare data for backend
    const userData = {
      firstName: formData.firstName,
      surname: formData.surname,
      email: formData.email,
      phone: formData.phone,
      username: formData.username,
      password: formData.password,
      agreeTerms: formData.agreeTerms
    };
    
    // Call the register API
    const response = await register(userData);
    
    // Success! Redirect to home or dashboard
    alert('Registration successful!');
    navigate('/');
    
  } catch (error) {
    // Handle error
    console.error('Registration error:', error);
    alert(error || 'Registration failed. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};

  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"];

  const passwordStrength = (password) => {
  let score = 0;
  if (!password) return 0;

  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  return score; // 0–4
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
      {/* Back to Home */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 flex items-center gap-2 text-[#0B1A33] hover:text-[#E4B84D] transition-colors group"
      >
        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Back to Home</span>
      </Link>

      <div className="w-full max-w-4xl flex flex-col lg:flex-row rounded-3xl overflow-hidden shadow-2xl">
        
        {/* Left Side - Brand & Info */}
        <div className="lg:w-2/5 bg-gradient-to-br from-[#0B1A33] to-[#1a365d] p-8 lg:p-12 text-white relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-10 -left-10 w-40 h-40 rounded-full bg-[#E4B84D]/10 blur-3xl"></div>
          <div className="absolute bottom-10 -right-10 w-40 h-40 rounded-full bg-blue-500/10 blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <img 
                src={logo} 
                alt="Ojoto Union Logo" 
                className="h-16 w-16 object-cover rounded-xl border-2 border-[#E4B84D]/30"
              />
              <div>
                <h1 className="text-2xl font-bold font-['Playfair_Display',_serif]">
                  Ojoto Union
                </h1>
                <p className="text-gray-300 text-sm">North America Chapter</p>
              </div>
            </div>

            <h2 className="text-3xl font-bold mb-6">Join Our Community</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="mt-1 p-2 bg-[#E4B84D]/20 rounded-lg">
                  <FaCheck className="text-[#E4B84D]" />
                </div>
                <div>
                  <h4 className="font-semibold">Connect with Members</h4>
                  <p className="text-gray-300 text-sm">Network with Ojoto indigenes across North America</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="mt-1 p-2 bg-[#E4B84D]/20 rounded-lg">
                  <FaCheck className="text-[#E4B84D]" />
                </div>
                <div>
                  <h4 className="font-semibold">Access Exclusive Content</h4>
                  <p className="text-gray-300 text-sm">Get announcements, events, and opportunities</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="mt-1 p-2 bg-[#E4B84D]/20 rounded-lg">
                  <FaCheck className="text-[#E4B84D]" />
                </div>
                <div>
                  <h4 className="font-semibold">Participate in Discussions</h4>
                  <p className="text-gray-300 text-sm">Join meaningful conversations and share ideas</p>
                </div>
              </div>
            </div>

            <div className="mt-12 p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
              <p className="text-sm text-gray-300">
                Already have an account?{" "}
                <Link 
                  to="/login" 
                  className="text-[#E4B84D] font-semibold hover:underline hover:underline-offset-2"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="lg:w-3/5 bg-white p-8 lg:p-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#0B1A33] font-['Playfair_Display',_serif]">
              Create Account
            </h1>
            <p className="text-gray-600 mt-2">Fill in your details to join our community</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <FaUser className="text-[#E4B84D]" />
                    First Name
                  </span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E4B84D] focus:border-transparent transition"
                  placeholder="Enter your first name"
                  required
                />
              </div>

              {/* Surname */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <FaUser className="text-[#E4B84D]" />
                    Surname
                  </span>
                </label>
                <input
                  type="text"
                  name="surname"
                  value={formData.surname}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E4B84D] focus:border-transparent transition"
                  placeholder="Enter your surname"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <FaEnvelope className="text-[#E4B84D]" />
                  Email Address
                </span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E4B84D] focus:border-transparent transition"
                placeholder="you@example.com"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <FaPhone className="text-[#E4B84D]" />
                  Phone Number
                </span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E4B84D] focus:border-transparent transition"
                placeholder="+1 (123) 456-7890"
                required
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <FaUser className="text-[#E4B84D]" />
                  Username
                </span>
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E4B84D] focus:border-transparent transition"
                placeholder="Choose a username"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <FaLock className="text-[#E4B84D]" />
                  Password
                </span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E4B84D] focus:border-transparent transition pr-12"
                  placeholder="Create a strong password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#0B1A33]"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              
              {/* Password Strength Meter */}
              {formData.password && (
                <div className="mt-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Password Strength:</span>
                    <span className={`font-semibold ${
                      passwordStrength(formData.password) >= 4 ? 'text-green-600' :
                      passwordStrength(formData.password) >= 3 ? 'text-blue-600' :
                      passwordStrength(formData.password) >= 2 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {strengthLabels[passwordStrength(formData.password)]}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        strengthColors[passwordStrength(formData.password)]
                      }`}
                      style={{ width: `${(passwordStrength(formData.password) / 4) * 100}%` }}
                    ></div>
                  </div>
                  <ul className="text-xs text-gray-500 mt-2 space-y-1">
                    <li className={`flex items-center gap-2 ${formData.password.length >= 8 ? 'text-green-600' : ''}`}>
                      <FaCheck className={`${formData.password.length >= 8 ? 'text-green-600' : 'text-gray-300'}`} size={10} />
                      At least 8 characters
                    </li>
                    <li className={`flex items-center gap-2 ${/[A-Z]/.test(formData.password) ? 'text-green-600' : ''}`}>
                      <FaCheck className={`${/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-gray-300'}`} size={10} />
                      One uppercase letter
                    </li>
                    <li className={`flex items-center gap-2 ${/[0-9]/.test(formData.password) ? 'text-green-600' : ''}`}>
                      <FaCheck className={`${/[0-9]/.test(formData.password) ? 'text-green-600' : 'text-gray-300'}`} size={10} />
                      One number
                    </li>
                    <li className={`flex items-center gap-2 ${/[^A-Za-z0-9]/.test(formData.password) ? 'text-green-600' : ''}`}>
                      <FaCheck className={`${/[^A-Za-z0-9]/.test(formData.password) ? 'text-green-600' : 'text-gray-300'}`} size={10} />
                      One special character
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <FaLock className="text-[#E4B84D]" />
                  Confirm Password
                </span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E4B84D] focus:border-transparent transition pr-12 ${
                    formData.confirmPassword && formData.password !== formData.confirmPassword
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                  placeholder="Re-enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#0B1A33]"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-red-500 text-sm mt-2">Passwords do not match</p>
              )}
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                id="terms"
                className="mt-1"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the{" "}
                <a href="/terms" className="text-[#E4B84D] font-semibold hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" className="text-[#E4B84D] font-semibold hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || (formData.confirmPassword && formData.password !== formData.confirmPassword)}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                isSubmitting || (formData.confirmPassword && formData.password !== formData.confirmPassword)
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#E4B84D] via-[#FFD166] to-[#E4B84D] hover:shadow-xl hover:scale-[1.02]'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="px-4 text-gray-500 text-sm">Or continue with</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Social Login (Optional) */}
          <div className="grid grid-cols-2 gap-4">
            <button className="p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition flex items-center justify-center gap-2">
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
              Google
            </button>
            <button className="p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition flex items-center justify-center gap-2">
              <FaUser className="text-gray-600" />
              Member Invite
            </button>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <p className="mt-8 text-center text-gray-600 text-sm">
        By creating an account, you agree to our community guidelines and code of conduct.
      </p>
    </div>
  );
};

export default Register;