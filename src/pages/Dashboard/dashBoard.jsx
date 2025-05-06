import React from 'react';
import { FaBook, FaListAlt, FaStar, FaClock } from 'react-icons/fa';
import Navbar from '../../components/Navbar';
import DashboardSidebar from '../../components/DashboardSidebar';

const UserDashboard = () => {
  // Sample data – replace with real data from API
  const user = {
    name: 'John Doe',
    stats: {
      booksRead: 25,
      readingList: 8,
      reviewsWritten: 12,
      hoursSpent: 73,
    },
    recommendations: [
      {
        title: 'The Alchemist',
        author: 'Paulo Coelho',
        cover:
          'https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg',
      },
      {
        title: 'Atomic Habits',
        author: 'James Clear',
        cover:
          'https://images-na.ssl-images-amazon.com/images/I/91bYsX41DVL.jpg',
      },
      {
        title: 'Sapiens',
        author: 'Yuval Noah Harari',
        cover:
          'https://images-na.ssl-images-amazon.com/images/I/713jIoMO3UL.jpg',
      },
    ],
  };

  return (
    <div className="pt-20 pl-10 md:px-10 lg:px-24 xl:px-32 max-w-screen-xl mx-auto">
    <div className="p-6">
      {/* Welcome */}
      <h1 className="text-3xl font-bold mb-4">Welcome back, {user.name} 👋</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<FaBook />} label="Books Read" value={user.stats.booksRead} />
        <StatCard icon={<FaListAlt />} label="Reading List" value={user.stats.readingList} />
        <StatCard icon={<FaStar />} label="Reviews Written" value={user.stats.reviewsWritten} />
        <StatCard icon={<FaClock />} label="Hours Spent" value={user.stats.hoursSpent} />
      </div>

      {/* Recommendations */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Recommended for You</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-4">
          {user.recommendations.map((book, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow hover:shadow-lg transition "
            >
              <img
                src={book.cover}
                alt={book.title}
                className="w-full h-56 object-cover rounded-lg mb-3"
              />
              <div className='p-2'>
                 <h3 className="font-bold text-lg">{book.title}</h3>
                 <p className="text-gray-600">by {book.author}</p>
                 <button className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition">
                   View Book
                 </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Continue Reading */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Continue Reading</h2>
        <div className="bg-white rounded-xl shadow p-4 flex flex-col sm:flex-row items-center">
          <img
            src="https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg"
            alt="Current book"
            className="w-28 h-40 object-cover rounded-lg mb-4 sm:mb-0 sm:mr-6"
          />
          <div className="flex-1">
            <h3 className="text-xl font-semibold">The Alchemist</h3>
            <p className="text-gray-600 mb-2">by Paulo Coelho</p>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div
                className="bg-green-500 h-3 rounded-full"
                style={{ width: '65%' }}
              ></div>
            </div>
            <p className="text-sm text-gray-500">65% completed</p>
          </div>
        </div>
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
