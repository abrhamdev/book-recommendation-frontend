import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBook, FaBookmark, FaCheckCircle, FaSpinner, FaBars, FaChevronDown, FaEye, FaStar, FaRegStar } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { API_URL } from '../../../API_URL';
import { useNavigate } from 'react-router-dom';

const ReadingList = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [books, setBooks] = useState({
    currentlyReading: [],
    wantToRead: [],
    completed: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [favorites, setFavorites] = useState({});
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('NR_token');
        
        if (!token) {
          setIsLoading(false);
          return;
        }

        const response = await axios.get(`${API_URL}/books/reading-list`, {
          headers: { 
            Authorization: `Bearer ${token}` 
          }
        });
        
        setBooks(response.data);
      } catch (error) {
        if (error.response?.status === 401) {
          logout();
          toast.error('Session expired. Please login again.');
        } else {
          toast.error('Failed to fetch reading list');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, [logout]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem('NR_token');
        const response = await axios.get(`${API_URL}/books/favorites`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Create a map of favorites with full book details
        const favMap = {};
        response.data.forEach(fav => {
          favMap[fav.bookId] = {
            ...fav,
            isFavorite: true
          };
        });
        setFavorites(favMap);
      } catch (error) {
        console.error('Error fetching favorites:', error);
        toast.error('Failed to load favorites');
      }
    };
    
    fetchFavorites();
  }, []);

  const updateBookStatus = async (bookId, newStatus) => {
    try {
      const token = localStorage.getItem('NR_token');
      await axios.patch(
        `${API_URL}/books/reading-list/${bookId}`, 
        { status: newStatus },
        {
          headers: { 
            Authorization: `Bearer ${token}` 
          }
        }
      );
      
      // Optimistically update the UI
      setBooks(prev => {
        const newBooks = { ...prev };
        
        // Remove from current status
        Object.keys(newBooks).forEach(status => {
          newBooks[status] = newBooks[status].filter(book => book.bookId !== bookId);
        });
        
        // Add to new status
        if (newBooks[newStatus]) {
          const bookToMove = [...prev.currentlyReading, ...prev.wantToRead, ...prev.completed]
            .find(book => book.bookId === bookId);
          if (bookToMove) {
            newBooks[newStatus].push({ ...bookToMove, status: newStatus });
          }
        }
        
        return newBooks;
      });
      
      toast.success('Reading status updated');
    } catch (error) {
      if (error.response?.status === 401) {
        logout();
        toast.error('Session expired. Please login again.');
      } else {
        toast.error('Failed to update reading status');
      }
    }
  };

  const toggleFavorite = async (bookId) => {
    try {
      const token = localStorage.getItem('NR_token');
      const response = await axios.post(
        `${API_URL}/books/favorites/${bookId}/toggle`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setFavorites(prev => ({
        ...prev,
        [bookId]: response.data.isFavorite
      }));
      
      toast.success(
        response.data.isFavorite 
          ? 'Added to favorites' 
          : 'Removed from favorites'
      );
    } catch (error) {
      toast.error('Failed to update favorite');
    }
  };

  const BookCard = ({ book, status }) => {
    const [showDetails, setShowDetails] = useState(false);
  
    const getProgressPercentage = (status) => {
      switch (status) {
        case 'wantToRead': return 0;
        case 'currentlyReading': return 50;
        case 'completed': return 100;
        default: return 0;
      }
    };
  
    const handleViewDetails = (e) => {
      e.stopPropagation();
      navigate(`/book/${book.bookId}`);
    };
  
    const handleAddReview = (e) => {
      e.stopPropagation();
      navigate(`/book/${book.bookId}?openReview=true`);
    };
  
    const progress = getProgressPercentage(status);
  
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded shadow overflow-hidden hover:shadow-md transition-shadow duration-300 w-full"
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="flex p-1.5 sm:p-2 gap-2 sm:gap-3">
          <div className="relative group">
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-14 h-20 sm:w-20 sm:h-28 object-cover rounded shadow group-hover:scale-105 transition-transform duration-200"
            />
            {status === 'completed' && (
              <div className="absolute top-1 right-1 bg-green-500 text-white p-0.5 rounded-full">
                <FaCheckCircle className="w-3 h-3" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-xs sm:text-sm text-gray-800 hover:text-blue-600 transition-colors line-clamp-1">{book.title}</h3>
                    <p className="text-gray-500 text-[10px] sm:text-xs mt-0.5 line-clamp-1">{book.author}</p>
                  </div>
                  {(status === 'currentlyReading' || status === 'completed') && (
                    <button
    onClick={(e) => {
      e.stopPropagation();
      toggleFavorite(book.bookId);
    }}
    className="ml-2 p-1 hover:bg-gray-100 rounded transition-colors"
  >
    {favorites[book.bookId] ? (
      <FaStar className="w-4 h-4 text-yellow-500" />
    ) : (
      <FaRegStar className="w-4 h-4 text-gray-400" />
    )}
  </button>
                  )}
                </div>
                
                <div className="flex items-center gap-2 mt-2">
                  <select
                    value={status}
                    onChange={(e) => {
                      e.stopPropagation();
                      updateBookStatus(book.bookId, e.target.value);
                    }}
                    className="text-[10px] sm:text-xs border border-gray-200 rounded px-1.5 sm:px-2 py-0.5 sm:py-1 hover:border-blue-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all"
                  >
                    <option value="currentlyReading">Currently Reading</option>
                    <option value="wantToRead">Want to Read</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
  
                {/* Progress Bar */}
                <div className="mt-2">
                  <div className="flex justify-between text-[10px] sm:text-xs text-gray-600 mb-0.5">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1 sm:h-1.5">
                    <div
                      className={`h-1 sm:h-1.5 rounded-full transition-all duration-300 ${
                        status === 'completed' ? 'bg-green-500' : 
                        status === 'currentlyReading' ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
  
            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 sm:mt-4 space-y-2 sm:space-y-3"
              >
                <div className="flex gap-1 sm:gap-2">
                  <button 
                    onClick={handleViewDetails}
                    className="flex-1 bg-gray-100 text-gray-700 px-2 sm:px-3 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
                  >
                    <FaEye className="w-3 h-3" />
                    View Details
                  </button>
                  {status === 'completed' && (
                    <button 
                      onClick={handleAddReview}
                      className="flex-1 bg-blue-500 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs hover:bg-blue-600 transition-colors flex items-center justify-center gap-1"
                    >
                      <FaStar className="w-3 h-3" />
                      Add Review
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  const getAllBooks = () => {
    return [
      ...books.currentlyReading,
      ...books.wantToRead,
      ...books.completed
    ];
  };

  const tabs = [
    { id: 'all', label: 'All Books', icon: <FaBook />, count: getAllBooks().length },
    { id: 'currentlyReading', label: 'Currently Reading', icon: <FaBook />, count: books?.currentlyReading?.length },
    { id: 'wantToRead', label: 'Want to Read', icon: <FaBookmark />, count: books.wantToRead?.length },
    { id: 'completed', label: 'Completed', icon: <FaCheckCircle />, count: books.completed?.length },
    { id: 'favorites', label: 'Favorites', icon: <FaStar />, count: Object.keys(favorites).length }
  ];

  return (
    <div className="max-w-6xl ml-12 lg:mx-auto px-3 sm:px-4 lg:px-6 mt-20 py-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold text-gray-900">My Reading List</h1>
        <button
          onClick={() => {
            navigate('/dashboard/recommendations');
          }}
          className="bg-blue-500 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-600 transition-colors flex items-center gap-1.5"
        >
          <FaBook className="w-3.5 h-3.5" />
          Add Book
        </button>
      </div>
      
      {/* Mobile Tabs */}
      <div className="md:hidden relative mb-4">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-full bg-white p-2 rounded shadow-sm flex items-center justify-between"
        >
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5">{tabs.find(tab => tab.id === activeTab)?.icon}</span>
            <span className="text-sm font-medium">{tabs.find(tab => tab.id === activeTab)?.label}</span>
          </div>
          <FaChevronDown className={`w-4 h-4 transition-transform ${isMobileMenuOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-1 bg-white rounded shadow-lg z-10"
          >
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full px-3 py-2 text-sm font-medium flex items-center gap-1.5 ${activeTab === tab.id ? 'bg-blue-50 text-blue-500' : 'hover:bg-gray-50'}`}
              >
                <span className="w-3.5 h-3.5">{tab.icon}</span>
                <span>{tab.label}</span>
                <span className="text-xs ml-auto">({tab.count})</span>
              </button>
            ))}
          </motion.div>
        )}
        </AnimatePresence>
      </div>

      {/* Desktop Tabs */}
      <div className="hidden md:flex flex-wrap gap-2 mb-4 bg-white p-2 rounded shadow-sm">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-3 py-1.5 text-sm font-medium rounded flex items-center gap-1.5 transition-all duration-200
            ${activeTab === tab.id
              ? 'bg-blue-500 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-50'}`}
        >
          <span className="w-3.5 h-3.5">{tab.icon}</span>
          <span className="whitespace-nowrap">{tab.label}</span>
          <span className="text-xs">({tab.count})</span>
        </button>
      ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-1 gap-4">
        {activeTab === 'all' && (
          <>
            {getAllBooks().map((book) => {
              let status = 'wantToRead';
              if (books.currentlyReading.find(b => b.bookId === book.bookId)) status = 'currentlyReading';
              if (books.completed.find(b => b.bookId === book.bookId)) status = 'completed';
              
              return (
                <BookCard
                  key={book.id}
                  book={book}
                  status={status}
                />
              );
            })}
            {getAllBooks().length === 0 && (
              <p className="text-gray-500 text-center py-8">
                No books in your library
              </p>
            )}
          </>
        )}

        {activeTab === 'currentlyReading' && (
          <>
            {books.currentlyReading?.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                status="currentlyReading"
              />
            ))}
            {books.currentlyReading?.length === 0 && (
              <p className="text-gray-500 text-center py-8">
                No books currently being read
              </p>
            )}
          </>
        )}

        {activeTab === 'wantToRead' && (
          <>
            {books.wantToRead?.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                status="wantToRead"
              />
            ))}
            {books.wantToRead?.length === 0 && (
              <p className="text-gray-500 text-center py-8">
                No books in your want to read list
              </p>
            )}
          </>
        )}

        {activeTab === 'completed' && (
          <>
            {books.completed?.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                status="completed"
              />
            ))}
            {books.completed?.length === 0 && (
              <p className="text-gray-500 text-center py-8">
                No completed books yet
              </p>
            )}
          </>
        )}

        {activeTab === 'favorites' && (
    <>
      {getAllBooks()
        .filter(book => favorites[book.bookId])
        .map((book) => {
          let status = 'wantToRead';
          if (books.currentlyReading.find(b => b.bookId === book.bookId)) status = 'currentlyReading';
          if (books.completed.find(b => b.bookId === book.bookId)) status = 'completed';
          
          return (
            <BookCard
              key={book.id}
              book={book}
              status={status}
            />
          );
        })}
      {Object.keys(favorites).length === 0 && (
        <p className="text-gray-500 text-center py-8">
          No favorite books yet
        </p>
      )}
    </>
  )}
      </div>
    </div>
  );
};

export default ReadingList;
