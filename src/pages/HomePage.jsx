/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../API_URL';
import {
  BookOpenIcon,
  UsersIcon,
  StarIcon,
  SparklesIcon,
  GlobeAltIcon,
  HeartIcon,
  ArrowRightIcon,
  ChevronRightIcon,
  LightBulbIcon,
  PencilSquareIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import ealinore from '../../public/images/ealinore.jpeg';
import { useTranslation } from 'react-i18next';

const HomePage = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [trendingBooks, setTrendingBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Data for new sections (dummy data for demonstration)
  const literaryQuotes = [
    {
      quote: t('homePage.quotes.quote1'),
      author: t('homePage.quotes.author1')
    },
    {
      quote: t('homePage.quotes.quote2'),
      author: t('homePage.quotes.author2')
    },
    {
      quote: t('homePage.quotes.quote3'),
      author: t('homePage.quotes.author3')
    },
    {
      quote: t('homePage.quotes.quote4'),
      author: t('homePage.quotes.author4')
    },
    {
      quote: t('homePage.quotes.quote5'),
      author: t('homePage.quotes.author5')
    }
  ];
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  const featuredAuthor = {
    name: t('homePage.authorSpotlight.name'),
    bio: t('homePage.authorSpotlight.bio'),
    imageUrl: "https://images.unsplash.com/photo-1544717305-ad2d1696b998?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    notableWorks: [
      { id: 'book101', title: t('homePage.authorSpotlight.works.work1'), cover: "https://covers.openlibrary.org/b/id/8243681-L.jpg" },
      { id: 'book102', title: t('homePage.authorSpotlight.works.work2'), cover: "https://covers.openlibrary.org/b/id/8885662-L.jpg" },
      { id: 'book103', title: t('homePage.authorSpotlight.works.work3'), cover: "https://covers.openlibrary.org/b/id/7946955-L.jpg" }
    ]
  };

  const popularGenres = [
          { 
              slug: 'fantasy', 
              icon: '🧙‍♂️', 
              name: t('navbar.allGenres.fantasy'), 
              description: t('homePage.genres.descriptions.fantasy') 
          },
          { 
              slug: 'science-fiction', 
              icon: '🚀', 
              name: t('navbar.allGenres.scienceFiction'), 
              description: t('homePage.genres.descriptions.scienceFiction') 
          },
          { 
              slug: 'thriller', 
              icon: '🕵️‍♀️', 
              name: t('navbar.allGenres.thriller'), 
              description: t('homePage.genres.descriptions.thriller') 
          },
          { 
              slug: 'romance', 
              icon: '💖', 
              name: t('navbar.allGenres.romance'), 
              description: t('homePage.genres.descriptions.romance') 
          },
          { 
              slug: 'history', 
              icon: '📜', 
              name: t('navbar.allGenres.history'), 
              description: t('homePage.genres.descriptions.history') 
          },
          { 
              slug: 'biography', 
              icon: '👤', 
              name: t('navbar.allGenres.biography'), 
              description: t('homePage.genres.descriptions.biography') 
          },
      ];

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Avid Reader",
      quote: "NovaReads completely transformed my reading journey! The recommendations are incredibly accurate, leading me to so many hidden gems.",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Librarian",
      quote: "As a librarian, I'm consistently impressed by the platform's robust recommendation engine and its ability to foster a vibrant community.",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    {
      id: 3,
      name: "Emma Thompson",
      role: "Book Blogger",
      quote: "The Personalized suggestions are a game-changer for my blog. I've discovered countless unique titles I wouldn't have found otherwise.",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg"
    },
    {
      id: 4,
      name: "David Wilson",
      role: "Educator",
      quote: "Finding appropriate books for my students has never been easier. The filtering system is exceptionally helpful for educational purposes.",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg"
    },
    {
      id: 5,
      name: "Lisa Rodriguez",
      role: "Book Club Organizer",
      quote: "Our book club has thrived thanks to NovaReads. The discussion features and shared reading lists have truly enhanced our meetings!",
      avatar: "https://randomuser.me/api/portraits/women/3.jpg"
    },
    {
      id: 6,
      name: "James Anderson",
      role: "Bestselling Author",
      quote: "This platform is invaluable for connecting authors with enthusiastic readers. It's truly a boost for literary discovery.",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg"
    },
    {
      id: 7,
      name: "Aisha Patel",
      role: "Bookstore Owner",
      quote: "NovaReads provides incredible insights into current reading trends, helping me curate a better selection for my customers.",
      avatar: "https://randomuser.me/api/portraits/women/4.jpg"
    },
    {
      id: 8,
      name: "Robert Kim",
      role: "Parent",
      quote: "My children now genuinely look forward to reading! NovaReads makes finding engaging and age-appropriate books a joyful experience.",
      avatar: "https://randomuser.me/api/portraits/men/4.jpg"
    }
  ];

  
  // Duplicate testimonials for seamless infinite scroll
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  useEffect(() => {
    const fetchTrendingBooks = async () => {
      try {
        const response = await axios.post(`${API_URL}/books/trending`, {
          maxResults: 5
        });
        setTrendingBooks(response.data);
      } catch (err) {
        console.error('Error fetching trending books:', err);
        setError(t('homePage.trending.error'));
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingBooks();

    // Rotate quotes every 7 seconds
    const quoteInterval = setInterval(() => {
      setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % literaryQuotes.length);
    }, 7000);

    return () => clearInterval(quoteInterval);
  }, [t]);

  // Animation variants for sections
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-[650px] md:h-[700px] overflow-hidden flex items-center justify-center text-white">
        <img
          src="/images/susan-q-yin-2JIvboGLeho-unsplash.jpg"
          alt={t('homePage.hero.imageAlt')}
          className="absolute inset-0 w-full h-full object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="relative max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 text-center z-10">
          <motion.h1
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight text-white drop-shadow-lg"
          >
            {t('homePage.hero.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-6 text-xl sm:text-2xl max-w-3xl mx-auto text-gray-200 drop-shadow-md"
          >
            {t('homePage.hero.subtitle')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-10"
          >
            <Link
              to="/login"
              className="inline-flex items-center bg-indigo-600 text-white px-8 py-4 rounded-full text-xl font-semibold shadow-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105"
            >
              {t('homePage.hero.cta')}
              <ArrowRightIcon className="ml-2 h-6 w-6" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Quote of the Day Section */}
      <motion.section
        className="py-16 bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-10 text-center">
          <LightBulbIcon className="h-16 w-16 text-white mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl font-bold mb-8">{t('homePage.quoteOfTheDay.title')}</h2>
          <motion.blockquote
            key={currentQuoteIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
            className="text-3xl font-serif italic leading-relaxed mb-6"
          >
            "{literaryQuotes[currentQuoteIndex].quote}"
          </motion.blockquote>
          <motion.p
            key={`author-${currentQuoteIndex}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl font-semibold opacity-90"
          >
            — {literaryQuotes[currentQuoteIndex].author}
          </motion.p>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="py-20 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">{t('homePage.features.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <motion.div variants={itemVariants} className="p-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl text-center shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-2">
              <SparklesIcon className="h-16 w-16 text-indigo-600 mx-auto mb-6 drop-shadow-md" />
              <h3 className="text-2xl font-semibold mb-3 text-gray-900">{t('homePage.features.personalized.title')}</h3>
              <p className="text-gray-700 leading-relaxed">
                {t('homePage.features.personalized.description')}
              </p>
            </motion.div>
            <motion.div variants={itemVariants} className="p-8 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl text-center shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-2">
              <BookOpenIcon className="h-16 w-16 text-green-600 mx-auto mb-6 drop-shadow-md" />
              <h3 className="text-2xl font-semibold mb-3 text-gray-900">{t('homePage.features.curated.title')}</h3>
              <p className="text-gray-700 leading-relaxed">
                {t('homePage.features.curated.description')}
              </p>
            </motion.div>
            <motion.div variants={itemVariants} className="p-8 bg-gradient-to-br from-yellow-50 to-red-50 rounded-xl text-center shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-2">
              <UsersIcon className="h-16 w-16 text-red-600 mx-auto mb-6 drop-shadow-md" />
              <h3 className="text-2xl font-semibold mb-3 text-gray-900">{t('homePage.features.community.title')}</h3>
              <p className="text-gray-700 leading-relaxed">
                {t('homePage.features.community.description')}
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section
        className="py-20 bg-gray-100"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">{t('homePage.howItWorks.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
            {/* Step 1 */}
            <motion.div variants={itemVariants} className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-md border-t-4 border-indigo-500">
              <div className="flex items-center justify-center h-20 w-20 bg-indigo-500 text-white rounded-full text-3xl font-bold mb-6 shadow-lg">1</div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-900">{t('homePage.howItWorks.step1.title')}</h3>
              <p className="text-gray-700 leading-relaxed">
                {t('homePage.howItWorks.step1.description')}
              </p>
              <ChevronRightIcon className="h-8 w-8 text-indigo-400 mt-6 md:hidden" />
            </motion.div>

            {/* Step 2 */}
            <motion.div variants={itemVariants} className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-md border-t-4 border-purple-500">
              <div className="flex items-center justify-center h-20 w-20 bg-purple-500 text-white rounded-full text-3xl font-bold mb-6 shadow-lg">2</div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-900">{t('homePage.howItWorks.step2.title')}</h3>
              <p className="text-gray-700 leading-relaxed">
                {t('homePage.howItWorks.step2.description')}
              </p>
              <ChevronRightIcon className="h-8 w-8 text-purple-400 mt-6 md:hidden" />
            </motion.div>

            {/* Step 3 */}
            <motion.div variants={itemVariants} className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-md border-t-4 border-teal-500">
              <div className="flex items-center justify-center h-20 w-20 bg-teal-500 text-white rounded-full text-3xl font-bold mb-6 shadow-lg">3</div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-900">{t('homePage.howItWorks.step3.title')}</h3>
              <p className="text-gray-700 leading-relaxed">
                {t('homePage.howItWorks.step3.description')}
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Trending Books Section */}
      <motion.section
        className="py-20 bg-gray-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">{t('homePage.trending.title')}</h2>
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
              <p className="ml-4 text-xl text-gray-600">{t('homePage.trending.loading')}</p>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 text-lg py-10">{error}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {trendingBooks.map((book) => (
                <Link
                  key={book.id}
                  to={`/book/${book.id}`}
                  className="block group"
                >
                  <motion.div
                    className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300"
                    whileHover={{ y: -5 }}
                  >
                    <img
                      src={book.cover || 'https://via.placeholder.com/250x380?text=No+Cover'}
                      alt={book.title}
                      className="w-full h-64 object-cover object-center group-hover:opacity-90 transition-opacity duration-300"
                    />
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-1 text-gray-900 truncate group-hover:text-indigo-600">
                        {book.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2 truncate">
                        {book.authors?.length ? book.authors.join(', ') : t('homePage.unknownAuthor')}
                      </p>
                      {book.averageRating && (
                        <div className="flex items-center text-yellow-500">
                          <StarIcon className="h-5 w-5 fill-current" />
                          <span className="ml-1 text-gray-800">{book.averageRating.toFixed(1)}</span>
                          <span className="ml-1 text-gray-500">({book.ratingsCount || 0} {t('homePage.reviews')})</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </motion.section>

      {/* Author Spotlight Section */}
      <motion.section
        className="py-20 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
            {t('homePage.authorSpotlight.title', { name: featuredAuthor.name })}
          </h2>
          <div className="flex flex-col md:flex-row items-center bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-xl overflow-hidden p-8 gap-8">
            <div className="flex-shrink-0 w-full md:w-1/3">
              <img
                src={ealinore || featuredAuthor.imageUrl}
                alt={featuredAuthor.name}
                className="w-full h-80 object-cover rounded-lg shadow-lg border-4 border-white"
              />
            </div>
            <div className="flex-grow text-center md:text-left">
              <PencilSquareIcon className="h-12 w-12 text-indigo-600 mx-auto md:mx-0 mb-4" />
              <h3 className="text-3xl font-bold mb-4 text-gray-900">{featuredAuthor.name}</h3>
              <p className="text-gray-700 leading-relaxed text-lg mb-6">
                {featuredAuthor.bio}
              </p>
              <h4 className="font-bold text-xl mb-4 text-gray-800">
                {t('homePage.authorSpotlight.notableWorks')}
              </h4>
              <div className="flex justify-center md:justify-start gap-4 flex-wrap">
                {featuredAuthor.notableWorks.map(book => (
                  <Link to={`/book/${book.id}`} key={book.id} className="block group">
                    <img
                      src={book.cover || 'https://via.placeholder.com/100x150?text=Book+Cover'}
                      alt={book.title}
                      className="w-24 h-36 object-cover rounded shadow-md group-hover:scale-105 transition-transform duration-200"
                      title={book.title}
                    />
                  </Link>
                ))}
              </div>
              <Link
                to="/authors"
                className="inline-flex items-center text-indigo-600 font-semibold mt-8 hover:text-indigo-800 transition-colors duration-200"
              >
                {t('homePage.authorSpotlight.discoverMore')}
                <ChevronRightIcon className="ml-1 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </motion.section>


      {/* Genre Showcase Section */}
      <motion.section
        className="py-20 bg-gray-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">{t('homePage.genres.title')}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
            {popularGenres.map((genre, index) => (
              <Link to={`/genre/${genre.name.toLowerCase()}`} key={index} className="block group">
                <motion.div
                  variants={itemVariants}
                  className="bg-white p-6 rounded-xl shadow-lg text-center flex flex-col items-center justify-center h-48 hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2"
                >
                  <div className="text-5xl mb-4">{genre.icon}</div>
                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-indigo-600 mb-2">{genre.name}</h3>
                  <p className="text-gray-600 text-sm">{genre.description}</p>
                </motion.div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/genres"
              className="inline-flex items-center bg-indigo-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105"
            >
              {t('homePage.genres.viewAll')}
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Why Choose Us Section */}
      <motion.section
        className="py-20 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-4xl font-bold mb-8 text-gray-800 leading-tight">
                {t('homePage.whyChooseUs.title')}
              </h2>
              <ul className="space-y-6">
                <motion.li variants={itemVariants} className="flex items-start">
                  <SparklesIcon className="h-8 w-8 text-indigo-600 flex-shrink-0 mr-4 mt-1" />
                  <div>
                    <h3 className="font-bold text-xl mb-1 text-gray-900">{t('homePage.whyChooseUs.discoveries.title')}</h3>
                    <p className="text-gray-700">
                      {t('homePage.whyChooseUs.discoveries.description')}
                    </p>
                  </div>
                </motion.li>
                <motion.li variants={itemVariants} className="flex items-start">
                  <GlobeAltIcon className="h-8 w-8 text-indigo-600 flex-shrink-0 mr-4 mt-1" />
                  <div>
                    <h3 className="font-bold text-xl mb-1 text-gray-900">{t('homePage.whyChooseUs.diversity.title')}</h3>
                    <p className="text-gray-700">
                      {t('homePage.whyChooseUs.diversity.description')}
                    </p>
                  </div>
                </motion.li>
                <motion.li variants={itemVariants} className="flex items-start">
                  <HeartIcon className="h-8 w-8 text-indigo-600 flex-shrink-0 mr-4 mt-1" />
                  <div>
                    <h3 className="font-bold text-xl mb-1 text-gray-900">{t('homePage.whyChooseUs.community.title')}</h3>
                    <p className="text-gray-700">
                      {t('homePage.whyChooseUs.community.description')}
                    </p>
                  </div>
                </motion.li>
              </ul>
            </div>
            <div className="order-1 md:order-2 relative rounded-xl shadow-2xl overflow-hidden">
              <img
                src="/images/gulfer-ergin-LUGuCtvlk1Q-unsplash.jpg"
                alt={t('homePage.whyChooseUs.imageAlt')}
                className="w-full h-[450px] object-cover rounded-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-xl"></div>
              <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full text-indigo-700 font-semibold text-lg shadow-lg">
                {t('homePage.whyChooseUs.tagline')}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section
             className="py-20 bg-gray-50 overflow-hidden"
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true, amount: 0.3 }}
             variants={sectionVariants}
           >
             <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
               <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">{t('homePage.testimonials.title')}</h2>
               <div className="relative">
                 <motion.div
                   className="flex space-x-8 pb-4"
                   animate={{
                     x: ['0%', '-100%'],
                   }}
                   transition={{
                     x: {
                       repeat: Infinity,
                       repeatType: "loop",
                       duration: 40,
                       ease: "linear",
                     },
                   }}
                 >
                   {duplicatedTestimonials.map((testimonial, index) => (
                     <motion.div
                       key={`${testimonial.id}-${index}`}
                       className="bg-white p-8 rounded-xl shadow-xl min-w-[320px] md:min-w-[380px] flex-shrink-0 border border-gray-100"
                       whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
                       transition={{ duration: 0.2 }}
                     >
                       <div className="flex items-center mb-6">
                         <img
                           src={testimonial.avatar}
                           alt={testimonial.name}
                           className="w-16 h-16 rounded-full object-cover border-4 border-indigo-100 mr-5 shadow-sm"
                         />
                         <div>
                           <h3 className="font-bold text-xl text-gray-900">{testimonial.name}</h3>
                           <p className="text-indigo-600 text-md">{testimonial.role}</p>
                         </div>
                       </div>
                       <p className="text-gray-700 italic leading-relaxed text-lg">
                         "<span className="font-semibold text-gray-800">{testimonial.quote}</span>"
                       </p>
                     </motion.div>
                   ))}
                 </motion.div>
               </div>
             </div>
           </motion.section>

      {/* Newsletter Section */}
      <section className="py-20 bg-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-10 text-center">
          <h2 className="text-4xl font-bold mb-6 leading-tight">{t('homePage.newsletter.title')}</h2>
          <p className="text-xl mb-10 text-indigo-100">
            {t('homePage.newsletter.subtitle')}
          </p>
          <div className="max-w-md mx-auto">
            <div className="flex shadow-lg rounded-full overflow-hidden">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('homePage.newsletter.placeholder')}
                className="flex-1 px-6 py-4 rounded-l-full border-2 border-transparent focus:border-indigo-300 text-gray-800 focus:ring-2 focus:ring-indigo-300 focus:outline-none transition-all duration-300"
                aria-label={t('homePage.newsletter.ariaLabel')}
              />
              <button
                className="bg-white text-indigo-700 px-8 py-4 rounded-r-full font-bold text-lg hover:bg-indigo-50 hover:text-indigo-800 transition-colors duration-300 transform hover:scale-105"
                type="submit"
                onClick={() => alert(t('homePage.newsletter.subscribed', { email }))}
              >
                {t('homePage.newsletter.cta')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-gray-700 pb-12 mb-12">
            <div>
              <h3 className="text-3xl font-extrabold mb-5 text-white">{t('navbar.logo')}</h3>
              <p className="text-gray-400 leading-relaxed">
                {t('homePage.footer.tagline')}
              </p>
            </div>
            <div>
              <h4 className="font-bold text-xl mb-5 text-white">{t('homePage.footer.quickLinks')}</h4>
              <ul className="space-y-3">
                <li><Link to="/about" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200">{t('navbar.about')}</Link></li>
                <li><Link to="/privacy" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200">{t('homePage.footer.privacy')}</Link></li>
                <li><Link to="/terms" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200">{t('homePage.footer.terms')}</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200">{t('homePage.footer.contact')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-xl mb-5 text-white">{t('homePage.footer.features')}</h4>
              <ul className="space-y-3">
                <li><Link to="/books" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200">{t('homePage.footer.bookRecs')}</Link></li>
                <li><Link to="/genres" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200">{t('homePage.footer.browseGenres')}</Link></li>
                <li><Link to="/clubs" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200">{t('homePage.footer.joinClubs')}</Link></li>
                <li><Link to="/reviews" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200">{t('homePage.footer.reviews')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-xl mb-5 text-white">{t('homePage.footer.connect')}</h4>
              <div className="flex space-x-6">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transform hover:scale-110 transition-transform duration-200" aria-label="Facebook">
                  <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transform hover:scale-110 transition-transform duration-200" aria-label="Twitter">
                  <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transform hover:scale-110 transition-transform duration-200" aria-label="Instagram">
                  <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} NovaReads. All rights reserved.</p>
            <p className="mt-2">Made with <HeartIcon className="inline-block h-4 w-4 text-red-500 -mt-1" /> for book lovers everywhere.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;