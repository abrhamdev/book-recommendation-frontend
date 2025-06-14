/* eslint-disable no-unused-vars */
import { useState,useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon, Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_URL } from '../../API_URL';
import { toast } from 'react-toastify';

const Navbar = () => {
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDiscoverOpen, setIsDiscoverOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  

 

  // Outside click handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])


  const handleLogout=()=>{
      localStorage.removeItem('NR_token');
      navigate('/');
  }

  useEffect(() => {
    const token = localStorage.getItem("NR_token");
    if (!token) return;
    const getUser = async () => {
  try{
    const response =await axios.post(`${API_URL}/users/me`,{}, {
      headers: {
         Authorization: `Bearer ${token}`,
         }
    })
    
      setUser(response.data.user);
    
  }catch(error){
      toast.error(error.response?.data.message)
      setUser(null);
    }}
    getUser();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]); 
      return;
    }
  
    const timeoutId = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${API_URL}/books/search?q=${ searchQuery }`);
        setSearchResults(response.data.items || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, 500); 
  
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery) {
      navigate(`/search?q=${searchQuery}`);
      setIsSearchOpen(false);
    }
  };

  const menuItems = [
    localStorage?.getItem("NR_token") ? {}:{ title: 'Home', path: '/'},
    { 
      title: 'Discover', 
      path: '/books',
      dropdown: [
        { title: 'Art', path: '/discover?genre=art' },
        { title: 'Biography', path: '/discover?genre=biography' },
        { title: 'Business', path: '/discover?genre=business' },
        { title: "Children's", path: '/discover?genre=children' },
        { title: 'Christian', path: '/discover?genre=christian' },
        { title: 'Classics', path: '/discover?genre=classics' },
        { title: 'Comics', path: '/discover?genre=comics' },
        { title: 'Cookbooks', path: '/discover?genre=cookbooks' },
        { title: 'Fantasy', path: '/discover?genre=fantasy' },
        { title: 'Fiction', path: '/discover?genre=fiction' },
        { title: 'Graphic Novels', path: '/discover?genre=graphic-novels' },
        { title: 'Historical Fiction', path: '/discover?genre=historical-fiction' },
        { title: 'History', path: '/discover?genre=history' },
        { title: 'Horror', path: '/discover?genre=horror' },
        { title: 'Humor', path: '/discover?genre=humor' },
        { title: 'Manga', path: '/discover?genre=manga' },
        { title: 'Memoir', path: '/discover?genre=memoir' },
        { title: 'Music', path: '/discover?genre=music' },
        { title: 'Mystery', path: '/discover?genre=mystery' },
        { title: 'Nonfiction', path: '/discover?genre=nonfiction' },
        { title: 'Poetry', path: '/discover?genre=poetry' },
        { title: 'Psychology', path: '/discover?genre=psychology' },
        { title: 'Romance', path: '/discover?genre=romance' },
        { title: 'Science', path: '/discover?genre=science' },
        { title: 'Science Fiction', path: '/discover?genre=science-fiction' },
        { title: 'Self Help', path: '/discover?genre=self-help' },
        { title: 'Sports', path: '/discover?genre=sports' },
        { title: 'Thriller', path: '/discover?genre=thriller' },
        { title: 'Travel', path: '/discover?genre=travel' },
        { title: 'Young Adult', path: '/discover?genre=young-adult' }
      ]
    },
    { title: 'Community', path: '/community/bookclub' },
    { title: 'About Us', path: '/aboutus' }
  ];

  return (
    <nav className="bg-white shadow-sm fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="sm:pl-8 pl-10 text-2xl font-bold text-indigo-600 hover:text-indigo-500 transition-colors">
              NovaReads
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="flex space-x-8">
              {menuItems.map((item,index) => (
                <div key={`${item.path}-${index}`} className="relative group">
                  {item.dropdown ? (
                    <>
                      <button
                        className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center h-full"
                        onMouseEnter={() => setIsDiscoverOpen(true)}
                        onMouseLeave={() => setIsDiscoverOpen(false)}
                      >
                        {item.title}
                        <ChevronDownIcon className="ml-1 h-4 w-4" />
                      </button>
                      <AnimatePresence>
                        {isDiscoverOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute left-0 w-[400px] bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50"
                            onMouseEnter={() => setIsDiscoverOpen(true)}
                            onMouseLeave={() => setIsDiscoverOpen(false)}
                          >
                            <div className="px-2 py-1 border-b border-gray-200">
                              <h3 className="text-sm font-semibold text-gray-800">Genres</h3>
                            </div>
                            <div className="grid grid-cols-3 gap-1 p-2">
                              {item.dropdown.map((genre) => (
                                <Link
                                  key={genre.path}
                                  to={genre.path}
                                  className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded-md text-xs transition-colors"
                                >
                                  {genre.title}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      to={item.path}
                      className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors relative group flex items-center h-full"
                    >
                      {item.title}
                      <motion.div
                        className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600"
                        initial={{ scale: 0 }}
                        whileHover={{ scale: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Search and Login */}
          <div className="flex items-center space-x-4">
            {/* Search Component */}
            <div className="relative flex items-center">
              <motion.button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-gray-400 hover:text-indigo-600 focus:outline-none z-10 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </motion.button>
              
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div
                    initial={{ width: 0, opacity: 0, x: 20 }}
                    animate={{ width: "200px", opacity: 1, x: 0 }}
                    exit={{ width: 0, opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="absolute right-8 top-0 bg-white "
                  >
                    <form onSubmit={handleSearch}>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search books..."
                        className="w-full px-3 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      />
                    </form>
                    {loading ? <div className=" p-4 absolute mt-2 w-80 bg-white shadow-lg rounded-lg z-20 max-h-60 overflow-y-auto border border-gray-200">Loading...</div> : searchResults.length > 0 && (
                         <div className="absolute mt-2 w-80 bg-white shadow-lg rounded-lg z-20 max-h-60 overflow-y-auto border border-gray-200">
                           {searchResults.map((book,index) => (
                            <Link onClick={()=>setSearchQuery('')} to={`/book/${book.id}`} key={`${book.id}-${index}`}>
                             <div
                               
                               className="flex items-center gap-3 p-2 hover:bg-gray-100 cursor-pointer"
                             >
                               <img
                                 src={book.volumeInfo.imageLinks?.thumbnail}
                                 alt="cover"
                                 className="w-10 h-14 object-cover rounded"
                               />
                               <span className="text-sm">{book.volumeInfo.title}</span>
                             </div>
                             </Link>
                           ))}
                         </div>
                         
                       )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {user ? (
              <div className="relative" ref={profileRef}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative flex cursor-pointer"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  <span className="sr-only">View profile</span>
                  <img
                    className="h-6 w-6 rounded-full"
                    src={user.profile_picture || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                    alt={user.name}
                  />
                  <p className='px-2 overflow-hidden hidden md:block'>{user.name}</p>
                </motion.button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="fixed overflow-hidden right-0 w-72 bg-white rounded-lg shadow-xl border border-gray-200 py-1 mt-2 z-50"
                    >
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-xs font-semibold text-gray-800">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          to="/profile"
                          className="block px-4 py-1 text-xs text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
                        >
                          Profile Settings
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-1 text-xs text-red-600 hover:bg-gray-100"
                        >
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-xs font-medium text-gray-700 hover:text-indigo-600 transition-colors"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-400 hover:text-indigo-600 focus:outline-none"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden bg-white overflow-y-auto max-h-screen"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {menuItems.map((item) => (
                  <div key={item.path}>
                    {item.dropdown ? (
                      <div className="space-y-1">
                        <button
                          onClick={() => setIsDiscoverOpen(!isDiscoverOpen)}
                          className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 transition-colors flex items-center justify-between"
                        >
                          {item.title}
                          <ChevronDownIcon className={`h-5 w-5 transition-transform ${isDiscoverOpen ? 'transform rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                          {isDiscoverOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="pl-4 space-y-1 overflow-y-auto max-h-screen"
                              
                            >
                              {item.dropdown.map((genre) => (
                                <Link
                                  key={genre.path}
                                  to={genre.path}
                                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50 transition-colors"
                                  onClick={() => setIsMobileMenuOpen(false)}
                                >
                                  {genre.title}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        to={item.path}
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.title}
                      </Link>
                    )}
                  </div>
                ))}
                
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar; 