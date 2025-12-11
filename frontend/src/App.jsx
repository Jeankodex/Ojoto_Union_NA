import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import Home from "./pages/main/Home";
import About from "./pages/about/About";
import Gallery from "./pages/gallery/Gallery";
import Dashboard from "./pages/dashboard/Dashboard";
import Community from "./pages/community/Community";
import CreatePost from "./pages/community/CreatePost";
import Members from "./pages/members/Members";
import MemberDetail from "./pages/members/MemberDetail";
import EditProfile from "./pages/members/EditProfile";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import PostOpportunity from "./pages/create/PostOpportunity";
import PrivacyPolicy from "./pages/static/PrivacyPolicy";
import TermsOfService from "./pages/static/TermsOfService";
import Questions from "./pages/questions/Questions";
import AskQuestion from "./pages/questions/AskQuestion";
import QuestionDetail from "./pages/questions/QuestionDetail";
import Volunteer from "./pages/volunteer/Volunteer";
import VolunteerDetail from "./pages/volunteer/VolunteerDetail";
import ApplyVolunteer from "./pages/volunteer/ApplyVolunteer";

// Create a ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            
            {/* Protected Routes - Require Login */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/community" element={
              <ProtectedRoute>
                <Community />
              </ProtectedRoute>
            } />
            <Route path="/community/create" element={
              <ProtectedRoute>
                <CreatePost />
              </ProtectedRoute>
            } />
            <Route path="/members" element={
              <ProtectedRoute>
                <Members />
              </ProtectedRoute>
            } />
            <Route path="/members/:id" element={
              <ProtectedRoute>
                <MemberDetail />
              </ProtectedRoute>
            } />
            <Route path="/profile/edit" element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            } />
            <Route path="/volunteer" element={
              <ProtectedRoute>
                <Volunteer />
              </ProtectedRoute>
            } />
            <Route path="/post_opportunity" element={
              <ProtectedRoute>
                <PostOpportunity />
              </ProtectedRoute>
            } />
            <Route path="/questions" element={
              <ProtectedRoute>
                <Questions />
              </ProtectedRoute>
            } />
            <Route path="/questions/ask" element={
              <ProtectedRoute>
                <AskQuestion />
              </ProtectedRoute>
            } />
            <Route path="/questions/:id" element={
              <ProtectedRoute>
                <QuestionDetail />
              </ProtectedRoute>
            } />
            <Route path="/volunteer/:id" element={
              <ProtectedRoute>
                <VolunteerDetail />
              </ProtectedRoute>
            } />
            <Route path="/volunteer/:id/apply" element={
              <ProtectedRoute>
                <ApplyVolunteer />
              </ProtectedRoute>
            } />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;