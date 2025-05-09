import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBook, FaBookmark, FaCheckCircle, FaSpinner, FaBars, FaChevronDown } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const ReadingList = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [books, setBooks] = useState({
    currentlyReading: [
      {
        id: 1,
        title: 'The Midnight Library',
        author: 'Matt Haig',
        coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1602190253i/52578297.jpg',
        progress: 65
      },
      {
        id: 2,
        title: 'Atomic Habits',
        author: 'James Clear',
        coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1655988385i/40121378.jpg',
        progress: 30
      }
    ],
    wantToRead: [
      {
        id: 3,
        title: 'Project Hail Mary',
        author: 'Andy Weir',
        coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1597695864i/54493401.jpg'
      },
      {
        id: 4,
        title: 'Tomorrow, and Tomorrow, and Tomorrow',
        author: 'Gabrielle Zevin',
        coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1635862579i/58784475.jpg'
      }
    ],
    completed: [
      {
        id: 5,
        title: 'The Seven Husbands of Evelyn Hugo',
        author: 'Taylor Jenkins Reid',
        coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1664458703i/32620332.jpg'
      },
      {
        id: 6,
        title: 'Verity',
        author: 'Colleen Hoover',
        coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1634158558i/59344312.jpg'
      }
    ]
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const { user } = useAuth();

  useEffect(() => {
    // Since we have sample data, just set loading to false
    setIsLoading(false);
    // Uncomment below when API is ready
    /*
    const fetchBooks = async () => {
      try {
        const response = await axios.get('/api/reading-list', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setBooks(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching reading list:', error);
        setIsLoading(false);
      }
    };
    fetchBooks();
    */
  }, []);

  const updateBookStatus = async (bookId, newStatus) => {
    try {
      await axios.patch(`/api/reading-list/${bookId}`, {
        status: newStatus
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      // Refresh books after update
      const response = await axios.get('/api/reading-list', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setBooks(response.data);
    } catch (error) {
      console.error('Error updating book status:', error);
    }
  };

  const BookCard = ({ book, status }) => {
    const [showDetails, setShowDetails] = useState(false);

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
              <div>
                <h3 className="font-semibold text-xs sm:text-sm text-gray-800 hover:text-blue-600 transition-colors line-clamp-1">{book.title}</h3>
                <p className="text-gray-500 text-[10px] sm:text-xs mt-0.5 line-clamp-1">{book.author}</p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={status}
                  onChange={(e) => {
                    e.stopPropagation();
                    updateBookStatus(book.id, e.target.value);
                  }}
                  className="text-[10px] sm:text-xs border border-gray-200 rounded px-1.5 sm:px-2 py-0.5 sm:py-1 hover:border-blue-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all"
                >
                  <option value="currentlyReading">Currently Reading</option>
                  <option value="wantToRead">Want to Read</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            {status === 'currentlyReading' && book.progress && (
              <div className="mt-4">
                <div className="flex justify-between text-[10px] sm:text-xs text-gray-600 mb-0.5">
                  <span className="hidden sm:inline">Progress</span>
                  <span className="sm:hidden">{book.progress}%</span>
                  <span className="hidden sm:inline">{book.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1 sm:h-1.5">
                  <div
                    className="bg-blue-500 h-1 sm:h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${book.progress}%` }}
                  />
                </div>
              </div>
            )}

            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 sm:mt-4 space-y-2 sm:space-y-3"
              >
                <div className="flex gap-1 sm:gap-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add review functionality
                    }}
                    className="flex-1 bg-blue-500 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs hover:bg-blue-600 transition-colors"
                  >
                    Add Review
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add to favorites functionality
                    }}
                    className="flex-1 bg-gray-100 text-gray-700 px-2 sm:px-3 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs hover:bg-gray-200 transition-colors"
                  >
                    Add to Favorites
                  </button>
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
    { id: 'completed', label: 'Completed', icon: <FaCheckCircle />, count: books.completed?.length }
  ];

  return (
    <div className="max-w-6xl ml-12 lg:mx-auto px-3 sm:px-4 lg:px-6 mt-20 py-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold text-gray-900">My Reading List</h1>
        <button
          onClick={() => {
            // Add new book functionality
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
              if (books.currentlyReading.find(b => b.id === book.id)) status = 'currentlyReading';
              if (books.completed.find(b => b.id === book.id)) status = 'completed';
              
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
      </div>
    </div>
  );
};

export default ReadingList;
