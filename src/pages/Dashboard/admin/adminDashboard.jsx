import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import {
  FaBook,
  FaUsers,
  FaCommentAlt,
  FaBell,
  FaChartLine,
  FaListAlt,
  FaTools,
  FaClipboardCheck,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../../../API_URL";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBooks: 0,
    totalReviews: 0,
    totalReadingLists: 0,
  });
  const [loading, setLoading] = useState(false);
  const { userData } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("NR_token");
        const response = await axios.get(`${API_URL}/admin/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStats(response.data);
        
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const adminActions = [
    { label: "Manage Books", icon: <FaBook />, link: "/admin/dashboard/managebook" },
    { label: "Manage Users", icon: <FaUsers />, link: "/admin/dashboard/manageuser" },
    { label: "Moderate Reviews", icon: <FaCommentAlt />, link: "/admin/reviews" },
    { label: "Notifications", icon: <FaBell />, link: "/admin/dashboard/notification" },
    { label: "View Reports & Logs", icon: <FaChartLine />, link: "/admin/reports" },
    { label: "Reading Lists", icon: <FaListAlt />, link: "/admin/reading-lists" },
    { label: "Site Settings", icon: <FaTools />, link: "/admin/settings" },
    { label: "Approve Book Entries", icon: <FaClipboardCheck />, link: "/admin/book-approvals" },
  ];

  return (
    <div className="pt-20 pl-10 md:px-10 lg:px-24 xl:px-32 max-w-screen-xl mx-auto">
      <div className="p-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, {userData?.name }</p>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <StatCard icon={<FaUsers />} label="Total Users" value={loading ? "..." : stats.totalUsers} />
          <StatCard icon={<FaBook />} label="Total Books" value={loading ? "..." : stats.totalBooks} />
          <StatCard icon={<FaCommentAlt />} label="Total Reviews" value={loading ? "..." : stats.totalReviews} />
          <StatCard icon={<FaListAlt />} label="Reading Lists Created" value={loading ? "..." : stats.totalReadingLists} />
        </div>

        {/* Admin Action Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          {adminActions.map((action) => (
            <Link
              key={action.label}
              to={action.link}
              className="bg-white rounded-xl shadow p-4 flex flex-col items-center text-center hover:shadow-lg transition"
            >
              <div className="text-3xl text-blue-600">{action.icon}</div>
              <div className="text-xl font-bold mt-2">{action.label}</div>
              <div className="text-gray-600 text-sm">Click to manage</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value }) => (
  <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center text-center">
    <div className="text-3xl text-blue-600">{icon}</div>
    <div className="text-2xl font-bold mt-1">{value}</div>
    <div className="text-gray-600 text-sm">{label}</div>
  </div>
);

export default AdminDashboard;
