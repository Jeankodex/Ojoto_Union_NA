
// Small, reusable badge component
import React from "react";
import { FaExclamationTriangle, FaCheckCircle, FaStar } from "react-icons/fa";

const StatusBadge = ({ type }) => {
  const badges = {
    urgent: {
      bg: "bg-amber-500",
      text: "URGENT",
      icon: <FaExclamationTriangle className="mr-1" />
    },
    resolved: {
      bg: "bg-emerald-500",
      text: "RESOLVED",
      icon: <FaCheckCircle className="mr-1" />
    },
    helpful: {
      bg: "bg-amber-100 text-amber-800",
      text: "HELPFUL",
      icon: <FaStar className="mr-1" />
    }
  };

  const badge = badges[type];
  if (!badge) return null;

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center ${badge.bg}`}>
      {badge.icon}
      {badge.text}
    </span>
  );
};

export default StatusBadge;