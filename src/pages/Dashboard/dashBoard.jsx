import React,{useEffect,useState} from 'react';
import { FaBook, FaListAlt, FaStar, FaClock } from 'react-icons/fa';
import Navbar from '../../components/Navbar';
import DashboardSidebar from '../../components/DashboardSidebar';
import { API_URL } from '../../../API_URL';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const UserDashboard = () => {
  
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const { userData } = useAuth();
  
  // Fetch recommendations from the backend
    const fetchRecommendations = async () => {
      const token = localStorage.getItem("NR_token");
      setLoading(true);
      try {
        const response = await axios.post(
          `${API_URL}/books/recommend`,{},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRecommendations(response.data.books);
      } catch (error) {
        toast.error(error?.response?.data?.error || "Failed to fetch recommendations");
      } finally {
           setLoading(false);
         }
    };
    // Fetch recommendations on component mount
      useEffect(() => {
        fetchRecommendations();
      }, []);

  // Sample data – replace with real data from API
  const user = {
    name: 'user name',
    stats: {
      booksRead: 25,
      readingList: 8,
      reviewsWritten: 12,
      hoursSpent: 73,
    },
   
  };

  return (
    <div className="pt-20 pl-10 md:px-10 lg:px-24 xl:px-32 max-w-screen-xl mx-auto">
    <div className="p-6">
      {/* Welcome */}
      <h1 className="text-3xl font-bold mb-4">Welcome back, {userData?.name}</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<FaBook />} label="Books Read" value={user.stats.booksRead} />
        <Link to="/dashboard/readinglist"><StatCard icon={<FaListAlt />} label="Reading List" value={user.stats.readingList} /></Link>
        <StatCard icon={<FaStar />} label="Reviews Written" value={user.stats.reviewsWritten} />
        <StatCard icon={<FaClock />} label="Hours Spent" value={user.stats.hoursSpent} />
      </div>

      {/* Recommendations */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Recommended for You</h2>
              {loading ? (
                <p>Loading recommendations...</p>
              ) : recommendations.length === 0 ? (
                <p>No recommendations found.</p>
              ) : (
                <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-4">
                  {recommendations.map((book) => (
                    <Link key={book.id} to={`/book/${book.id}`}>
                    <div
                      
                      className="bg-white rounded-xl shadow hover:shadow-lg transition"
                    >
                      <img
                        src={book.thumbnail || 'https://via.placeholder.com/150x220?text=No+Image'}
                        alt={book.title}
                        className="w-full h-56 object-cover rounded-lg mb-3"
                      />
                      <div className="p-2">
                        <h3 className="font-bold text-lg">{book.title}</h3>
                        <p className="text-gray-600">
                          by {book.authors?.join(', ') || 'Unknown Author'}
                        </p>
                        <button className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition">
                          View Book
                        </button>
                      </div>
                    </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

    </div>
    </div>
  );
};

// Reusable stat card
const StatCard = ({ icon, label, value }) => {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center text-center">
      <div className="text-3xl text-blue-600 mb-2">{icon}</div>
      <div className="text-xl font-bold">{value}</div>
      <div className="text-gray-600 text-sm">{label}</div>
    </div>
  );
};

export default UserDashboard;
