
import React from "react";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  const { user } = useAuth();
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar user />
      {/* Main content */}
      <main className="flex-grow">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;
