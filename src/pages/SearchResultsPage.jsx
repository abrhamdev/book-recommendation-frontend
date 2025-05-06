import { useState,useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { API_URL } from '../../API_URL';
import axios from 'axios';
import { 
  MagnifyingGlassIcon, 
  XMarkIcon,
  ChevronDownIcon,
  StarIcon,
  FunnelIcon, 
  ArrowsUpDownIcon,
  Squares2X2Icon,
  ListBulletIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import Navbar from '../components/Navbar';
import { Import } from 'lucide-react';
import DashboardSidebar from '../components/DashboardSidebar';

const SearchResultsPage = () => {
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('q') || '';

  //state for pagination
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalItems: 0,
    itemsPerPage: 10
  });
  
  // State for search and filters
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [showFilters, setShowFilters] = useState(true);
  const [sortBy, setSortBy] = useState('relevance');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  
  // Filter states
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('');
  const [bookLength, setBookLength] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [yearRange, setYearRange] = useState({ min: '', max: '' });
  const [minRating, setMinRating] = useState(0);
  const [loading,setLoading]=useState(false);
  const [searchResults,setSearchResults]=useState([]);

  useEffect(() => {
    if (searchInput.trim() === '') {
      setSearchResults([]);
      setPagination(prev => ({ ...prev, totalItems: 0 }));
      return;
    }
  
    const timeoutId = setTimeout(async () => {
      setLoading(true);
      try {
        const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
        const response = await axios.get(
          `${API_URL}/books/search?q=${searchInput}&startIndex=${startIndex}&maxResults=${pagination.itemsPerPage}`
        );
        setSearchResults(response.data.items || []);
        setPagination(prev => ({
          ...prev,
          totalItems: response.data.totalItems || 0
        }));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, 500);
  
    return () => clearTimeout(timeoutId);
  }, [searchInput, pagination.currentPage]);



  const genres = ["Fiction", "Non-Fiction", "Mystery", "Romance", "Science Fiction", "Fantasy", "Biography"];
  const languages = ["English", "Spanish", "French", "German", "Japanese"];
  const ageGroups = ["Children", "Young Adult", "Adult"];
  const bookLengths = ["Short (< 200 pages)", "Medium (200-400 pages)", "Long (> 400 pages)"];

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search logic
  };

  const handleFilterChange = (filter, value) => {
    // Implement filter logic
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    // Implement sort logic
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Bar Section */}
      <div className="pt-25 py-4">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            {/* Filter Button */ }
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm"
            >
              <FunnelIcon className="h-4 w-4" />
              Filters
            </button>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search for books..."
                  className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm"
                />
                <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-full lg:w-56 bg-white p-4 rounded-lg shadow-sm border border-gray-200 h-fit">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-semibold text-gray-800">Filters</h3>
                <button onClick={() => setShowFilters(false)} className="text-gray-500 hover:text-gray-700">
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>

              {/* Genre Filter */}
              <div className="mb-4">
                <h4 className="font-medium mb-1.5 text-gray-700 text-sm">Genre</h4>
                <div className="space-y-1.5">
                  {genres.map(genre => (
                    <label key={genre} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedGenres.includes(genre)}
                        onChange={() => handleFilterChange('genre', genre)}
                        className="rounded text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
                      />
                      <span className="ml-2 text-gray-600 text-sm">{genre}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Language Filter */}
              <div className="mb-4">
                <h4 className="font-medium mb-1.5 text-gray-700 text-sm">Language</h4>
                <select
                  value={selectedLanguage}
                  onChange={(e) => handleFilterChange('language', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-1.5 text-gray-600 text-sm"
                >
                  <option value="">All Languages</option>
                  {languages.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>

              {/* Age Group Filter */}
              <div className="mb-4">
                <h4 className="font-medium mb-1.5 text-gray-700 text-sm">Age Group</h4>
                <select
                  value={selectedAgeGroup}
                  onChange={(e) => handleFilterChange('ageGroup', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-1.5 text-gray-600 text-sm"
                >
                  <option value="">All Ages</option>
                  {ageGroups.map(age => (
                    <option key={age} value={age}>{age}</option>
                  ))}
                </select>
              </div>

              {/* Book Length Filter */}
              <div className="mb-4">
                <h4 className="font-medium mb-1.5 text-gray-700 text-sm">Book Length</h4>
                <select
                  value={bookLength}
                  onChange={(e) => handleFilterChange('length', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-1.5 text-gray-600 text-sm"
                >
                  <option value="">Any Length</option>
                  {bookLengths.map(length => (
                    <option key={length} value={length}>{length}</option>
                  ))}
                </select>
              </div>

              {/* Rating Filter */}
              <div className="mb-4">
                <h4 className="font-medium mb-1.5 text-gray-700 text-sm">Minimum Rating</h4>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      onClick={() => handleFilterChange('rating', rating)}
                      className={`text-${minRating >= rating ? 'yellow' : 'gray'}-400`}
                    >
                      {minRating >= rating ? (
                        <StarIconSolid className="h-4 w-4" />
                      ) : (
                        <StarIcon className="h-4 w-4" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Year Range Filter */}
              <div className="mb-4">
                <h4 className="font-medium mb-1.5 text-gray-700 text-sm">Publication Year</h4>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={yearRange.min}
                    onChange={(e) => setYearRange({ ...yearRange, min: e.target.value })}
                    className="w-1/2 border border-gray-300 rounded-lg p-1.5 text-gray-600 text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={yearRange.max}
                    onChange={(e) => setYearRange({ ...yearRange, max: e.target.value })}
                    className="w-1/2 border border-gray-300 rounded-lg p-1.5 text-gray-600 text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Results Section */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-gray-800">Search Results</h2>
                <span className="text-gray-500 text-sm">({pagination.totalItems>200?'>200':pagination.totalItems} books found)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg ${viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                  >
                    <ListBulletIcon className="h-4 w-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg ${viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                  >
                    <Squares2X2Icon className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={handleSortChange}
                    className="appearance-none pl-3 pr-8 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-600 text-sm"
                  >
                    <option value="relevance">Sort by: Relevance</option>
                    <option value="rating">Sort by: Rating</option>
                    <option value="title">Sort by: Title A-Z</option>
                    <option value="newest">Sort by: Newest</option>
                  </select>
                  <ChevronDownIcon className="h-4 w-4 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Results Grid/List */}
            <div className={`${viewMode === 'grid' ? 'grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4' : 'space-y-3 overflow-y-scroll max-h-screen'}`}>
              {!loading ? searchResults.length > 0 ? searchResults.map((book,index) => (
                <div
                key={`${book.id}-${index}`}
                  className={`bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}
                >
                  <Link to={`/book/${book.id}`} className={`${viewMode === 'list' ? 'flex' : 'block'}`}>
                    <img
                      src={book.volumeInfo.imageLinks?.thumbnail}
                      alt={book.title}
                      className={`${viewMode === 'list' ? 'w-24 h-36' : 'w-full h-40'} object-cover`}
                    />
                    <div className="h-auto p-2 flex-1">
                      <h3 className="font-semibold text-base text-gray-800 mb-1">{book.volumeInfo.title}</h3>
                      <p className="text-gray-600 text-sm mb-1.5">{book.volumeInfo.authors}</p>
                      <div className="flex flex-wrap gap-1.5 mb-1.5">
                        
                          <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                            {book.volumeInfo.categories}
                          </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {book.volumeInfo.averageRating ? 
                            <>
                          <StarIconSolid className="h-4 w-4 text-yellow-400" />
                          <span className="ml-1 text-gray-600 text-sm">{book.volumeInfo.averageRating}</span>
                          </>: <span className="ml-1 text-gray-600 text-sm">N/A</span>
                      }
                        </div>
                        <span className="text-gray-500 text-sm">{book.volumeInfo.publishedDate}</span>
                      </div>
                      {viewMode === 'list' && (
                        <p className="mt-1.5 text-gray-600 text-sm line-clamp-2">{book.volumeInfo.description}</p>
                      )}
                    </div>
                  </Link>
                </div>
              ) ):<div>No Results Found</div>:<div>Loading...</div> }
            </div>

            {/* Pagination */}
            <div className="mt-6 flex justify-center">
  <nav className="flex items-center gap-1.5">
    {/* Previous Button */}
    <button
      onClick={() => setPagination(prev => ({
        ...prev,
        currentPage: Math.max(prev.currentPage - 1, 1)
      }))}
      disabled={pagination.currentPage === 1}
      className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 text-sm"
    >
      Previous
    </button>

    {/* First Page - Only show if not in first 3 pages */}
    {pagination.currentPage > 3 && (
      <>
        <button
          onClick={() => setPagination(prev => ({ ...prev, currentPage: 1 }))}
          className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 text-sm"
        >
          1
        </button>
        {pagination.currentPage > 4 && (
          <span className="px-2 text-gray-500">...</span>
        )}
      </>
    )}

    {/* Middle Pages - Limited to 20 max */}
    {Array.from({ 
      length: Math.min(
        5, 
        Math.min(
          Math.ceil(pagination.totalItems / pagination.itemsPerPage),
          20 // Hard limit of 20 pages
        )
      ) 
    }, (_, i) => {
      let pageNum;
      const totalPages = Math.min(
        Math.ceil(pagination.totalItems / pagination.itemsPerPage),
        20
      );

      if (totalPages <= 5) {
        pageNum = i + 1;
      } else if (pagination.currentPage <= 3) {
        pageNum = i + 1;
      } else if (pagination.currentPage >= totalPages - 2) {
        pageNum = totalPages - 4 + i;
      } else {
        pageNum = pagination.currentPage - 2 + i;
      }

      return pageNum <= totalPages ? (
        <button
          key={pageNum}
          onClick={() => setPagination(prev => ({ ...prev, currentPage: pageNum }))}
          className={`px-3 py-1.5 rounded-lg text-sm ${
            pagination.currentPage === pageNum
              ? 'bg-indigo-600 text-white'
              : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
          }`}
        >
          {pageNum}
        </button>
      ) : null;
    })}

    {/* Last Page - Only show if not in last 3 pages */}
    {pagination.currentPage < Math.min(
      Math.ceil(pagination.totalItems / pagination.itemsPerPage),
      20
    ) - 2 && (
      <>
        {pagination.currentPage < Math.min(
          Math.ceil(pagination.totalItems / pagination.itemsPerPage),
          20
        ) - 3 && (
          <span className="px-2 text-gray-500">...</span>
        )}
        <button
          onClick={() => setPagination(prev => ({
            ...prev,
            currentPage: Math.min(
              Math.ceil(pagination.totalItems / pagination.itemsPerPage),
              20
            )
          }))}
          className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 text-sm"
        >
          {Math.min(
            Math.ceil(pagination.totalItems / pagination.itemsPerPage),
            20
          )}
        </button>
      </>
    )}

    {/* Next Button */}
    <button
      onClick={() => setPagination(prev => ({
        ...prev,
        currentPage: Math.min(
          prev.currentPage + 1,
          Math.min(
            Math.ceil(pagination.totalItems / pagination.itemsPerPage),
            20
          )
        )
      }))}
      disabled={
        pagination.currentPage === Math.min(
          Math.ceil(pagination.totalItems / pagination.itemsPerPage),
          20
        )
      }
      className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 text-sm"
    >
      Next
    </button>
  </nav>
</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage; 