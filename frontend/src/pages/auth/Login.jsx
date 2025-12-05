import React, { useState } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowLeft, FaGoogle, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "../../assets/ojoto_union_logo.png";

const Login = () => {
  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
    rememberMe: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.emailOrUsername.trim()) {
      newErrors.emailOrUsername = "Email or username is required";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForgotPassword = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!forgotPasswordEmail.trim()) {
      return "Email is required";
    }
    if (!emailRegex.test(forgotPasswordEmail)) {
      return "Please enter a valid email address";
    }
    return null;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      // Handle successful login here
    }, 1500);
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    
    const error = validateForgotPassword();
    if (error) {
      setErrors({ forgotPassword: error });
      return;
    }
    
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setForgotPasswordSent(true);
      setTimeout(() => {
        setShowForgotPassword(false);
        setForgotPasswordSent(false);
        setForgotPasswordEmail("");
      }, 3000);
    }, 1500);
  };

  const handleDemoLogin = (role) => {
    setFormData({
      emailOrUsername: role === 'admin' ? 'admin@ojotounion.org' : 'member@example.com',
      password: 'demoPassword123!',
      rememberMe: false
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4 relative">
      
      {/* Back to Home */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 flex items-center gap-2 text-[#0B1A33] hover:text-[#E4B84D] transition-colors group z-10"
      >
        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Back to Home</span>
      </Link>

      {/* Demo Login Buttons */}
      <div className="absolute top-6 right-6 flex gap-2 z-10">
        <button
          onClick={() => handleDemoLogin('admin')}
          className="px-3 py-1 bg-gradient-to-r from-[#0B1A33] to-[#1a365d] text-white text-xs rounded-lg hover:shadow-lg transition"
        >
          Demo Admin
        </button>
        <button
          onClick={() => handleDemoLogin('member')}
          className="px-3 py-1 bg-gradient-to-r from-[#E4B84D] to-[#FFD166] text-[#0B1A33] text-xs rounded-lg hover:shadow-lg transition"
        >
          Demo Member
        </button>
      </div>

      <div className="w-full max-w-4xl flex flex-col lg:flex-row rounded-3xl overflow-hidden shadow-2xl">
        
        {/* Left Side - Brand & Welcome */}
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

            <h2 className="text-3xl font-bold mb-6">Welcome Back!</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="mt-1 p-2 bg-[#E4B84D]/20 rounded-lg">
                  <FaUser className="text-[#E4B84D]" />
                </div>
                <div>
                  <h4 className="font-semibold">Stay Connected</h4>
                  <p className="text-gray-300 text-sm">Access community announcements and updates</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="mt-1 p-2 bg-[#E4B84D]/20 rounded-lg">
                  <FaUser className="text-[#E4B84D]" />
                </div>
                <div>
                  <h4 className="font-semibold">Join Discussions</h4>
                  <p className="text-gray-300 text-sm">Participate in meaningful community conversations</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="mt-1 p-2 bg-[#E4B84D]/20 rounded-lg">
                  <FaUser className="text-[#E4B84D]" />
                </div>
                <div>
                  <h4 className="font-semibold">Access Resources</h4>
                  <p className="text-gray-300 text-sm">Find opportunities and community resources</p>
                </div>
              </div>
            </div>

            <div className="mt-12 p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
              <p className="text-sm text-gray-300">
                New to our community?{" "}
                <Link 
                  to="/register" 
                  className="text-[#E4B84D] font-semibold hover:underline hover:underline-offset-2"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="lg:w-3/5 bg-white p-8 lg:p-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#0B1A33] font-['Playfair_Display',_serif]">
              Member Login
            </h1>
            <p className="text-gray-600 mt-2">Sign in to access your community dashboard</p>
          </div>

          {/* Main Login Form */}
          {!showForgotPassword ? (
            <>
              <form onSubmit={handleLoginSubmit} className="space-y-6">
                {/* Email/Username */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                      <FaEnvelope className="text-[#E4B84D]" />
                      Email or Username
                    </span>
                  </label>
                  <input
                    type="text"
                    name="emailOrUsername"
                    value={formData.emailOrUsername}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E4B84D] focus:border-transparent transition ${
                      errors.emailOrUsername ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your email or username"
                  />
                  {errors.emailOrUsername && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      ⚠️ {errors.emailOrUsername}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      <span className="flex items-center gap-2">
                        <FaLock className="text-[#E4B84D]" />
                        Password
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-sm text-[#E4B84D] hover:text-[#0B1A33] transition-colors font-medium"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E4B84D] focus:border-transparent transition pr-12 ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#0B1A33]"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      ⚠️ {errors.password}
                    </p>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="w-4 h-4 text-[#E4B84D] rounded focus:ring-[#E4B84D]"
                    />
                    <span className="text-sm text-gray-600">Remember me</span>
                  </label>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                    isSubmitting
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#E4B84D] via-[#FFD166] to-[#E4B84D] hover:shadow-xl hover:scale-[1.02]'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Signing In...
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="my-8 flex items-center">
                <div className="flex-1 h-px bg-gray-300"></div>
                <span className="px-4 text-gray-500 text-sm">Or sign in with</span>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-2 gap-4">
                <button className="p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition flex items-center justify-center gap-2 group">
                  <FaGoogle className="text-gray-600 group-hover:text-red-500" />
                  <span>Google</span>
                </button>
                <button className="p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition flex items-center justify-center gap-2">
                  <FaUser className="text-gray-600" />
                  <span>Member ID</span>
                </button>
              </div>
            </>
          ) : (
            /* Forgot Password Form */
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-[#0B1A33]">Reset Password</h3>
                <button
                  onClick={() => setShowForgotPassword(false)}
                  className="text-gray-500 hover:text-[#0B1A33] transition-colors"
                >
                  ← Back to login
                </button>
              </div>

              {forgotPasswordSent ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold text-[#0B1A33] mb-2">Email Sent!</h4>
                  <p className="text-gray-600">
                    We've sent password reset instructions to:<br />
                    <span className="font-semibold text-[#E4B84D]">{forgotPasswordEmail}</span>
                  </p>
                  <p className="text-sm text-gray-500 mt-4">
                    Please check your inbox and follow the instructions to reset your password.
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-gray-600 mb-6">
                    Enter your email address and we'll send you instructions to reset your password.
                  </p>
                  
                  <form onSubmit={handleForgotPasswordSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <span className="flex items-center gap-2">
                          <FaEnvelope className="text-[#E4B84D]" />
                          Email Address
                        </span>
                      </label>
                      <input
                        type="email"
                        value={forgotPasswordEmail}
                        onChange={(e) => setForgotPasswordEmail(e.target.value)}
                        className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E4B84D] focus:border-transparent transition ${
                          errors.forgotPassword ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your registered email"
                      />
                      {errors.forgotPassword && (
                        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                          ⚠️ {errors.forgotPassword}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                        isSubmitting
                          ? 'bg-gray-300 cursor-not-allowed'
                          : 'bg-gradient-to-r from-[#0B1A33] to-[#1a365d] hover:shadow-xl hover:scale-[1.02] text-white'
                      }`}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Sending...
                        </span>
                      ) : (
                        "Send Reset Instructions"
                      )}
                    </button>
                  </form>

                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">📧 Didn't receive the email?</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Check your spam or junk folder</li>
                      <li>• Make sure you entered the correct email</li>
                      <li>• Contact support if you still need help</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Security Notice */}
      <div className="mt-8 max-w-2xl text-center">
        <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <FaLock className="text-green-500" />
            <span>Your login is secure and encrypted</span>
            <span className="text-gray-300 mx-2">•</span>
            <span>Never share your credentials</span>
          </div>
        </div>
      </div>

      {/* Demo Credentials Notice */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          💡 <strong>Demo:</strong> Click "Demo Admin" or "Demo Member" buttons to auto-fill credentials
        </p>
      </div>

      {/* Add CSS for fade animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Login;