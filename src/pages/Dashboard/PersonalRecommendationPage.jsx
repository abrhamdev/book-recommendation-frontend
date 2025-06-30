import React,{useEffect,useState} from 'react';
import { API_URL } from '../../../API_URL';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/24/solid';

const PersonalRecommendationPage = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="pt-20 px-4 md:px-10 lg:px-24 xl:px-32 max-w-screen-xl mx-auto min-h-screen bg-gray-50">
      <div className="p-6">
        <h2 className="text-3xl font-bold mb-8 text-center">Recommended for You</h2>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
          </div>
        ) : recommendations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
            {/* Book-themed illustration */}
            <svg className="h-28 w-28 mb-4" fill="none" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
              <rect x="8" y="16" width="48" height="32" rx="4" fill="#e0e7ff" />
              <rect x="16" y="24" width="32" height="16" rx="2" fill="#6366f1" />
              <rect x="20" y="28" width="24" height="8" rx="1" fill="#fff" />
              <rect x="24" y="32" width="16" height="2" rx="1" fill="#c7d2fe" />
            </svg>
            <p className="text-xl font-semibold mb-2 text-gray-700">No recommendations yet</p>
            <p className="mb-6 text-gray-500 text-center max-w-md">Start exploring books, add some to your reading list, or rate books you've read to get personalized recommendations!</p>
            <div className="flex gap-3 flex-wrap justify-center">
              <Link to="/discover" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition">Browse Discover</Link>
              <Link to="/dashboard/reading-list" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition">My Reading List</Link>
              <Link to="/dashboard" className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium transition">Go to Dashboard</Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {recommendations.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition flex flex-col h-full"
              >
                <Link to={`/book/${book.id}`} className="block">
                  <img
                    src={book.thumbnail || book.coverImage || 'https://via.placeholder.com/150x220?text=No+Image'}
                    alt={book.title}
                    className="w-full h-56 object-cover rounded-t-xl mb-2"
                  />
                </Link>
                <div className="p-3 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg mb-1 line-clamp-2">{book.title}</h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-1">
                    by {book.authors?.join(', ') || book.author || 'Unknown Author'}
                  </p>
                  {book.rating && (
                    <div className="flex items-center mb-2">
                      <StarIcon className="h-5 w-5 text-yellow-400 mr-1" />
                      <span className="text-sm font-medium text-gray-700">{book.rating}</span>
                    </div>
                  )}
                  <Link
                    to={`/book/${book.id}`}
                    className="mt-auto w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition text-center font-semibold"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalRecommendationPage;
