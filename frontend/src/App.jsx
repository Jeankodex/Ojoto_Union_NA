import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import Home from "./pages/main/Home";
import Community from "./pages/community/Community";
import CreatePost from "./pages/community/CreatePost";
import Members from "./pages/members/Members";
import MemberDetail from "./pages/members/MemberDetail";
import EditProfile from "./pages/members/EditProfile";
import Volunteer from "./pages/main/Volunteer";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import PostAnnouncement from "./pages/create/PostAnnouncement";
import PostOpportunity from "./pages/create/PostOpportunity";
import PrivacyPolicy from "./pages/static/PrivacyPolicy";
import TermsOfService from "./pages/static/TermsOfService";
import Questions from "./pages/questions/Questions";
import AskQuestion from "./pages/questions/AskQuestion";
import QuestionDetail from "./pages/questions/QuestionDetail";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/community" element={<Community />} />
            <Route path="/community/create" element={<CreatePost />} />
            <Route path="/members" element={<Members />} />
            <Route path="/members/:id" element={<MemberDetail />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="/volunteer" element={<Volunteer />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/post_announcement" element={<PostAnnouncement />} />
            <Route path="/post_opportunity" element={<PostOpportunity />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/questions" element={<Questions />} />
            <Route path="/questions/ask" element={<AskQuestion />} />
            <Route path="/questions/:id" element={<QuestionDetail />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;