/* eslint-disable no-unused-vars */
import { useState ,useEffect} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../API_URL';
import { 
  BookOpenIcon,
  UsersIcon,
  StarIcon,
  SparklesIcon,
  GlobeAltIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';

const HomePage = () => {
  const [email, setEmail] = useState('');

  const [trendingBooks, setTrendingBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingBooks = async () => {
      try {
        const response = await axios.post(`${API_URL}/books/trending`, {
          maxResults: 5 // Number of books to fetch
        });
        setTrendingBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingBooks();
  }, []);

  
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Student",
      quote: "This platform has completely transformed my reading habits. The recommendations are spot-on!",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Librarian",
      quote: "As a librarian, I'm impressed by the quality of recommendations and the vibrant community.",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    {
      id: 3,
      name: "Emma Thompson",
      role: "Book Blogger",
      quote: "The AI-powered recommendations have helped me discover so many hidden gems I would have never found otherwise.",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg"
    },
    {
      id: 4,
      name: "David Wilson",
      role: "Teacher",
      quote: "Perfect for finding age-appropriate books for my students. The filtering system is excellent.",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg"
    },
    {
      id: 5,
      name: "Lisa Rodriguez",
      role: "Book Club Organizer",
      quote: "Our book club has grown so much since we started using this platform. The discussion features are fantastic!",
      avatar: "https://randomuser.me/api/portraits/women/3.jpg"
    },
    {
      id: 6,
      name: "James Anderson",
      role: "Writer",
      quote: "As an author, I appreciate how this platform helps readers discover new voices in literature.",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg"
    },
    {
      id: 7,
      name: "Aisha Patel",
      role: "Bookstore Owner",
      quote: "This platform has helped me understand reading trends and stock my store accordingly.",
      avatar: "https://randomuser.me/api/portraits/women/4.jpg"
    },
    {
      id: 8,
      name: "Robert Kim",
      role: "Parent",
      quote: "My kids love the book recommendations. It's made reading fun for the whole family!",
      avatar: "https://randomuser.me/api/portraits/men/4.jpg"
    }
  ];

  // Duplicate testimonials for seamless infinite scroll
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar/>
      <div className="relative h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
            alt="Library"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-indigo-600"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex  items-center">
          <div className="text-center w-full ">
            <motion.h1 
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 font-handwritten"
            >
              Discover Books
            </motion.h1>
            <motion.div 
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="inline-block"
            >
              <h2 className="text-2xl sm:text-3xl px-5 md:text-4xl font-bold text-white mb-2 font-handwritten">
                Tailored
              </h2>
            </motion.div>
            <motion.div 
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              className="inline-block"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white font-handwritten">
                Just for you
              </h2>
            </motion.div>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.9 }}
              className="mt-6 text-lg text-white max-w-2xl mx-auto font-handwritten"
            >
              Find your next favorite book with personalized recommendations based on your reading preferences.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="mt-8"
            >
              <Link
                to="/login"
                className="inline-block bg-white text-indigo-600 px-6 py-3 rounded-lg text-lg font-medium hover:bg-indigo-50 transition-colors font-handwritten"
              >
                Get Started
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Our Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-50 rounded-lg text-center">
              <SparklesIcon className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Personalized Recommendations</h3>
              <p className="text-gray-600">Get book suggestions based on your reading history and preferences.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg text-center">
              <BookOpenIcon className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Reading List</h3>
              <p className="text-gray-600">Organize and track your reading journey with our smart lists.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg text-center">
              <UsersIcon className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Book Clubs</h3>
              <p className="text-gray-600">Join vibrant communities of readers and discuss your favorite books.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Books Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Trending Books</h2>
          {loading ? (
    <div>Loading books...</div>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-5 gap-8">
      {trendingBooks.map((book) => (
        <Link 
        key={book.id} 
        to={`/book/${book.id}`} 
      >
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <img 
            src={book.cover || 'https://via.placeholder.com/150'} 
            alt={book.title} 
            className="w-full h-64 object-cover" 
          />
          <div className="p-2">
            <h3 className="font-semibold text-lg mb-1 truncate">{book.title}</h3>
            <p className="text-gray-600 mb-2 truncate">{book.authors?.join(', ')}</p>
            {book.averageRating && (
              <div className="flex items-center">
                <StarIcon className="h-5 w-5 text-yellow-400" />
                <span className="ml-1">{book.averageRating}</span>
              </div>
            )}
          </div>
        </div>
        </Link>
      ))}
    </div>
  )}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Why Choose Our Platform?</h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <SparklesIcon className="h-6 w-6 text-indigo-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold">AI-Powered Recommendations</h3>
                    <p className="text-gray-600">Our advanced algorithms learn from your reading habits to suggest perfect matches.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <GlobeAltIcon  className="h-6 w-6 text-indigo-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold">Global & Local Books</h3>
                    <p className="text-gray-600">Discover both international bestsellers and hidden local gems.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <HeartIcon className="h-6 w-6 text-indigo-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold">Community-Driven</h3>
                    <p className="text-gray-600">Join a passionate community of readers who share your love for books.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-gray-100 rounded-lg h-96">
              {/* Placeholder for illustration */}
              <div className="relative h-96">
              <img
                src="https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
                alt="Reading Experience"
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-lg"></div>
            </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Readers Say</h2>
          <div className="relative">
            <motion.div
              className="flex space-x-8"
              animate={{
                x: [0, -1000],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 20,
                  ease: "linear",
                },
              }}
            >
              {duplicatedTestimonials.map((testimonial, index) => (
                <motion.div
                  key={`${testimonial.id}-${index}`}
                  className="bg-white p-6 rounded-lg shadow-md min-w-[300px]"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center mb-4">
                    <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4" />
                    <div>
                      <h3 className="font-semibold">{testimonial.name}</h3>
                      <p className="text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic">"{testimonial.quote}"</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated With Book Trends</h2>
          <p className="mb-8">Subscribe to our newsletter for the latest book recommendations and community updates.</p>
          <div className="max-w-md mx-auto">
            <div className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-l-lg border border-white text-white focus:outline-none"
              />
              <button className="bg-white text-indigo-600 px-6 py-2 rounded-r-lg font-semibold hover:bg-gray-100">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">NovaReads</h3>
              <p className="text-gray-400">Discover your next favorite book with our AI-powered recommendation system.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
                <li><Link to="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2">
                <li><Link to="/books" className="text-gray-400 hover:text-white">Book Recommendations</Link></li>
                <li><Link to="/clubs" className="text-gray-400 hover:text-white">Book Clubs</Link></li>
                <li><Link to="/reviews" className="text-gray-400 hover:text-white">Reviews</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect With Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2024 NovaReads. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage; 