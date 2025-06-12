import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/24/solid';
import { ChevronRightIcon, UserGroupIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { API_URL } from '../../API_URL';
import genreDescriptions from '../data/genre-description';

const DiscoverPage = () => {
  const [searchParams] = useSearchParams();
  const selectedGenre = searchParams.get('genre')?.toLowerCase() || 'biography';
  const [newReleases, setNewReleases] = useState([]);
  const [popularBooks, setPopularBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debug genre selection
  console.log('Selected Genre:', selectedGenre);
  console.log('Available Genres:', genreDescriptions.map(g => g.name.toLowerCase()));

  const genreData = genreDescriptions.find(g => g.name.toLowerCase() === selectedGenre) || {
    title: 'Unknown Genre',
    description: 'No description available for this genre.'
  };

  const relatedGenres = [
    { name: 'Nonfiction', path: '/discover?genre=nonfiction' },
    { name: 'Memoir', path: '/discover?genre=memoir' },
    { name: 'Autobiography', path: '/discover?genre=autobiography' },
    { name: 'Adventurers', path: '/discover?genre=adventurers' },
    { name: 'Music Biography', path: '/discover?genre=music-biography' }
  ];

  const relatedNews = {
    title: '132 Page-Turner Books to Help You Beat Any Reading Slump',
    description: 'April can be a tricky month for bookworms, especially those who set ambitious reading plans for the new year. Everyone starts with good...',
    image: 'https://images.gr-assets.com/misc/1711391608-1711391608_goodreads_misc.png',
    link: '/blog/show/2514'
  };

  const popularLists = [
    {
      id: 1,
      title: `Best ${genreData.title} of All Time`,
      books: 158,
      voters: 2453,
      preview: ['Placeholder Book 1', 'Placeholder Book 2', 'Placeholder Book 3']
    },
    {
      id: 2,
      title: `Must-Read ${genreData.title}`,
      books: 124,
      voters: 1876,
      preview: ['Placeholder Book 4', 'Placeholder Book 5', 'Placeholder Book 6']
    }
  ];

  const discussionGroups = [
    {
      id: 1,
      name: `${genreData.title} Book Club`,
      members: 12543,
      discussions: 234,
      lastActive: '2 hours ago'
    },
    {
      id: 2,
      name: `Historical ${genreData.title}`,
      members: 8765,
      discussions: 156,
      lastActive: '5 hours ago'
    }
  ];

  const placeholderBooks = [
    {
      id: 'placeholder1',
      title: 'Placeholder Book 1',
      author: 'Unknown Author',
      coverImage: 'https://via.placeholder.com/128x196.png?text=No+Cover',
      releaseDate: 'N/A',
      rating: 'N/A',
      ratings: '0'
    },
    {
      id: 'placeholder2',
      title: 'Placeholder Book 2',
      author: 'Unknown Author',
      coverImage: 'https://via.placeholder.com/128x196.png?text=No+Cover',
      releaseDate: 'N/A',
      rating: 'N/A',
      ratings: '0'
    }
  ];

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const [newReleasesResponse, popularResponse] = await Promise.all([
          axios.get(`${API_URL}/books/new-releases/${selectedGenre}`),
          axios.get(`${API_URL}/books/popular/${selectedGenre}`)
        ]);
        console.log('New Releases Response:', newReleasesResponse.data);
        console.log('Popular Books Response:', popularResponse.data);
        setNewReleases(newReleasesResponse.data || []);
        setPopularBooks(popularResponse.data || []);
      } catch (error) {
        console.error('Failed to fetch books:', error.response?.status, error.message);
        setError('Failed to load books. Showing placeholder data.');
        setNewReleases(placeholderBooks);
        setPopularBooks(placeholderBooks);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [selectedGenre]);

  if (error && !newReleases.length && !popularBooks.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-16 pb-8">
        <div className="max-w-5xl mx-auto pl-4 pr-6 lg:pl-8 lg:pr-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 max-w-[800px]">
              <h1 className="text-2xl font-bold text-gray-900 mb-3">{genreData.title}</h1>
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">{genreData.description}</p>
              <div className="mb-6">
                <p className="text-gray-900 text-sm">See also:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  <Link to="/discover?genre=autobiography" className="text-indigo-600 hover:underline text-sm">Autobiography</Link>
                  <span className="text-gray-600">,</span>
                  <Link to="/discover?genre=memoir" className="text-indigo-600 hover:underline text-sm">Memoir</Link>
                  <span className="text-gray-600 text-sm">...</span>
                </div>
              </div>
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-base font-bold text-gray-900">NEW RELEASES IN {genreData.title.toUpperCase()}</h2>
                  <Link to={`/genre/${selectedGenre}/new`} className="text-xs text-indigo-600 hover:underline">More new releases...</Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {loading ? (
                    <p>Loading...</p>
                  ) : newReleases.length > 0 ? (
                    newReleases.map(book => (
                      <div key={book.id} className="flex gap-3">
                        <Link to={`/book/${book.id}`} className="shrink-0">
                          <img
                            src={book.coverImage}
                            alt={book.title}
                            className="w-16 aspect-[2/3] object-cover hover:opacity-90 transition-opacity"
                          />
                        </Link>
                        <div className="min-w-0">
                          <Link to={`/book/${book.id}`} className="text-sm font-medium text-gray-900 hover:underline line-clamp-2">
                            {book.title}
                          </Link>
                          <p className="text-xs text-gray-600 mb-1">{book.author}</p>
                          <div className="flex items-center gap-1">
                            <StarIcon className="h-3.5 w-3.5 text-yellow-400" />
                            <span className="text-xs text-gray-600">{book.rating}</span>
                            <span className="text-xs text-gray-400">·</span>
                            <span className="text-xs text-gray-600">{book.ratings} ratings</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No new releases found.</p>
                  )}
                </div>
              </div>
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-base font-bold text-gray-900">POPULAR IN {genreData.title.toUpperCase()}</h2>
                  <Link to={`/genre/${selectedGenre}/popular`} className="text-xs text-indigo-600 hover:underline">More popular books...</Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {loading ? (
                    <p>Loading...</p>
                  ) : popularBooks.length > 0 ? (
                    popularBooks.map(book => (
                      <div key={book.id} className="flex gap-3">
                        <Link to={`/book/${book.id}`} className="shrink-0">
                          <img
                            src={book.coverImage}
                            alt={book.title}
                            className="w-16 aspect-[2/3] object-cover hover:opacity-90 transition-opacity"
                          />
                        </Link>
                        <div className="min-w-0">
                          <Link to={`/book/${book.id}`} className="text-sm font-medium text-gray-900 hover:underline line-clamp-2">
                            {book.title}
                          </Link>
                          <p className="text-xs text-gray-600 mb-1">{book.author}</p>
                          <div className="flex items-center gap-1">
                            <StarIcon className="h-3.5 w-3.5 text-yellow-400" />
                            <span className="text-xs text-gray-600">{book.rating}</span>
                            <span className="text-xs text-gray-400">·</span>
                            <span className="text-xs text-gray-600">{book.ratings} ratings</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No popular books found.</p>
                  )}
                </div>
              </div>
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-base font-bold text-gray-900">{genreData.title.toUpperCase()} BOOK LISTS</h2>
                  <Link to={`/genre/${selectedGenre}/lists`} className="text-xs text-indigo-600 hover:underline">More lists...</Link>
                </div>
                <div className="space-y-4">
                  {popularLists.map(list => (
                    <div key={list.id} className="bg-white p-3 rounded border border-gray-200">
                      <Link to={`/list/${list.id}`} className="text-sm font-medium text-gray-900 hover:underline block mb-2">
                        {list.title}
                      </Link>
                      <p className="text-xs text-gray-500 mb-2">
                        {list.books} items · {list.voters} votes
                      </p>
                      <p className="text-xs text-gray-500">
                        Including: {list.preview.join(", ")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-base font-bold text-gray-900">{genreData.title.toUpperCase()} DISCUSSION GROUPS</h2>
                  <Link to={`/groups/${selectedGenre}`} className="text-xs text-indigo-600 hover:underline">More groups...</Link>
                </div>
                <div className="space-y-4">
                  {discussionGroups.map(group => (
                    <div key={group.id} className="bg-white p-3 rounded border border-gray-200">
                      <Link to={`/group/${group.id}`} className="text-sm font-medium text-gray-900 hover:underline block mb-2">
                        {group.name}
                      </Link>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <UserGroupIcon className="h-4 w-4" />
                          <span>{group.members} members</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ChatBubbleLeftIcon className="h-4 w-4" />
                          <span>{group.discussions} discussions</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Last active {group.lastActive}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="lg:w-56">
              <div className="bg-white p-3 rounded">
                <h2 className="font-bold text-gray-900 mb-2 text-sm">RELATED NEWS</h2>
                <Link to={relatedNews.link} className="block group">
                  <img
                    src={relatedNews.image}
                    alt={relatedNews.title}
                    className="w-full rounded mb-2"
                  />
                  <h3 className="text-indigo-600 group-hover:underline font-medium mb-2 text-sm leading-snug">
                    {relatedNews.title}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {relatedNews.description}
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoverPage;