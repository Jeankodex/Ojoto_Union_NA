import React from "react";
import { FaFire, FaCheckCircle } from "react-icons/fa";

const StatusBadge = ({ type }) => {
  const getConfig = () => {
    switch (type) {
      case 'urgent':
        return {
          text: 'URGENT',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          icon: <FaFire size={12} />
        };
      case 'resolved':
        return {
          text: 'RESOLVED',
          bgColor: 'bg-emerald-100',
          textColor: 'text-emerald-800',
          icon: <FaCheckCircle size={12} />
        };
      default:
        return {
          text: type,
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          icon: null
        };
    }
  };

  const config = getConfig();

  return (
    <div className={`inline-flex items-center gap-1 px-3 py-1 ${config.bgColor} ${config.textColor} rounded-full text-xs font-semibold`}>
      {config.icon}
      {config.text}
    </div>
  );
};

export default StatusBadge;