import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/24/solid';
import { ChevronRightIcon, UserGroupIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import Navbar from '../components/Navbar';
import DashboardSidebar from '../components/DashboardSidebar';

const DiscoverPage = () => {
  const location = useLocation();
  const selectedGenre = new URLSearchParams(location.search).get('genre') || 'biography';

  // Sample books data
  const newReleases = [
    {
      id: 1,
      title: "Propaganda Girls",
      author: "Lisa Rogak",
      coverImage: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1693424755i/123727831.jpg",
      releaseDate: "2024"
    },
    {
      id: 2,
      title: "Saving Five",
      author: "Amanda Nguyen",
      coverImage: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1699977534i/127244983.jpg",
      releaseDate: "2024"
    },
    {
      id: 3,
      title: "Story of a Murder",
      author: "Hallie Rubenhold",
      coverImage: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1693337431i/123714411.jpg",
      releaseDate: "2024"
    },
    {
      id: 4,
      title: "Good Soil",
      author: "Jeff Chu",
      coverImage: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1683836301i/123680600.jpg",
      releaseDate: "2024"
    },
    {
      id: 5,
      title: "Amanda Knox: By Search for Moving Free",
      author: "Amanda Knox",
      coverImage: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1702419045i/198921546.jpg",
      releaseDate: "2024"
    }
  ];

  const relatedGenres = [
    { name: "Nonfiction", path: "/discover?genre=nonfiction" },
    { name: "Memoir", path: "/discover?genre=memoir" },
    { name: "Autobiography", path: "/discover?genre=autobiography" },
    { name: "Adventurers", path: "/discover?genre=adventurers" },
    { name: "Music Biography", path: "/discover?genre=music-biography" }
  ];

  const relatedNews = {
    title: "132 Page-Turner Books to Help You Beat Any Reading Slump",
    description: "April can be a tricky month for bookworms, especially those who set ambitious reading plans for the new year. Everyone starts with good...",
    image: "https://images.gr-assets.com/misc/1711391608-1711391608_goodreads_misc.png",
    link: "/blog/show/2514"
  };

  // Additional sample data
  const popularBooks = [
    {
      id: 1,
      title: "Steve Jobs",
      author: "Walter Isaacson",
      coverImage: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1511288482i/11084145.jpg",
      rating: 4.2,
      ratings: "1.2M",
      reviews: "45K"
    },
    {
      id: 2,
      title: "The Diary of a Young Girl",
      author: "Anne Frank",
      coverImage: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1560816565i/48855.jpg",
      rating: 4.1,
      ratings: "3.2M",
      reviews: "38K"
    },
    {
      id: 3,
      title: "Einstein: His Life and Universe",
      author: "Walter Isaacson",
      coverImage: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1328011405i/10884.jpg",
      rating: 4.3,
      ratings: "450K",
      reviews: "12K"
    }
  ];

  const popularLists = [
    {
      id: 1,
      title: "Best Biographies of All Time",
      books: 158,
      voters: 2453,
      preview: ["Steve Jobs", "Einstein", "The Diary of a Young Girl"]
    },
    {
      id: 2,
      title: "Must-Read Musician Biographies",
      books: 124,
      voters: 1876,
      preview: ["Life", "Chronicles", "Just Kids"]
    }
  ];

  const discussionGroups = [
    {
      id: 1,
      name: "Biography Book Club",
      members: 12543,
      discussions: 234,
      lastActive: "2 hours ago"
    },
    {
      id: 2,
      name: "Historical Biographies",
      members: 8765,
      discussions: 156,
      lastActive: "5 hours ago"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-16 pb-8">
        <div className="max-w-5xl mx-auto pl-4 pr-6 lg:pl-8 lg:pr-8">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <Link to="/discover" className="hover:underline">Genres</Link>
            <ChevronRightIcon className="h-4 w-4" />
            <Link to="/discover?genre=nonfiction" className="hover:underline">Nonfiction</Link>
            <ChevronRightIcon className="h-4 w-4" />
            <span className="text-gray-900">Biography</span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main Content */}
            <div className="flex-1 max-w-[800px]">
              {/* Genre Title and Description */}
              <h1 className="text-2xl font-bold text-gray-900 mb-3">Biography</h1>
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                A biography (from the Greek words bios meaning "life", and graphos meaning "write") is a non-fictional 
                account of a person's life. Biographies are written by an author who is not the subject/focus of the book.
              </p>

              {/* See Also Section */}
              <div className="mb-6">
                <p className="text-gray-900 text-sm">See also:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  <Link to="/discover?genre=autobiography" className="text-indigo-600 hover:underline text-sm">Autobiography</Link>
                  <span className="text-gray-600">,</span>
                  <Link to="/discover?genre=memoir" className="text-indigo-600 hover:underline text-sm">Memoir</Link>
                  <span className="text-gray-600 text-sm">...more</span>
                </div>
              </div>

              {/* New Releases Section */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-base font-bold text-gray-900">NEW RELEASES TAGGED "BIOGRAPHY"</h2>
                  <Link to="/genres/biography/new" className="text-xs text-indigo-600 hover:underline">More new releases...</Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {newReleases.map(book => (
                    <div key={book.id} className="flex flex-col">
                      <Link to={`/book/${book.id}`} className="block">
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="w-full aspect-[2/3] object-cover hover:opacity-90 transition-opacity"
                        />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* Popular in Biography Section */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-base font-bold text-gray-900">POPULAR IN BIOGRAPHY</h2>
                  <Link to="/genres/biography/popular" className="text-xs text-indigo-600 hover:underline">More popular books...</Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {popularBooks.map(book => (
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
                  ))}
                </div>
              </div>

              {/* Lists Section */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-base font-bold text-gray-900">LISTS WITH BIOGRAPHY BOOKS</h2>
                  <Link to="/genres/biography/lists" className="text-xs text-indigo-600 hover:underline">More lists...</Link>
                </div>
                <div className="space-y-4">
                  {popularLists.map(list => (
                    <div key={list.id} className="bg-white p-3 rounded border border-gray-200">
                      <Link to={`/list/${list.id}`} className="text-sm font-medium text-gray-900 hover:underline block mb-2">
                        {list.title}
                      </Link>
                      <p className="text-xs text-gray-600 mb-2">
                        {list.books} books · {list.voters} voters
                      </p>
                      <p className="text-xs text-gray-500">
                        Including: {list.preview.join(", ")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Discussion Groups Section */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-base font-bold text-gray-900">BIOGRAPHY DISCUSSION GROUPS</h2>
                  <Link to="/genres/biography/groups" className="text-xs text-indigo-600 hover:underline">More groups...</Link>
                </div>
                <div className="space-y-4">
                  {discussionGroups.map(group => (
                    <div key={group.id} className="bg-white p-3 rounded border border-gray-200">
                      <Link to={`/group/${group.id}`} className="text-sm font-medium text-gray-900 hover:underline block mb-2">
                        {group.name}
                      </Link>
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <UserGroupIcon className="h-4 w-4" />
                          <span>{group.members} members</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ChatBubbleLeftIcon className="h-4 w-4" />
                          <span>{group.discussions} discussions</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Last active {group.lastActive}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:w-56">
              {/* Related Genres */}
              <div className="bg-white p-3 rounded mb-4">
                <h2 className="font-bold text-gray-900 mb-2 text-sm">RELATED GENRES</h2>
                <ul className="space-y-1">
                  {relatedGenres.map(genre => (
                    <li key={genre.name}>
                      <Link
                        to={genre.path}
                        className="text-indigo-600 hover:underline text-sm"
                      >
                        {genre.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Related News */}
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