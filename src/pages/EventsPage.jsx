import React, { useState } from 'react';
import { CalendarIcon, MapPinIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const EventsPage = () => {
  // Sample events data - replace with actual data from your backend
  const [events] = useState([
    {
      id: 1,
      title: 'Book Launch: The Ethiopian Chronicles',
      date: '2024-03-15',
      time: '18:00',
      location: 'Addis Ababa Book Fair',
      attendees: 45,
      description: 'Join us for the launch of this exciting new book about Ethiopian history.',
      image: '/events/book-launch.jpg'
    },
    {
      id: 2,
      title: 'Author Meet & Greet',
      date: '2024-03-20',
      time: '15:00',
      location: 'Unity Park Library',
      attendees: 30,
      description: 'Meet your favorite authors and get your books signed.',
      image: '/events/author-meet.jpg'
    },
    {
      id: 3,
      title: 'Book Club Discussion: The Mountains Sing',
      date: '2024-03-25',
      time: '19:00',
      location: 'Online Zoom Meeting',
      attendees: 25,
      description: 'Join our monthly book club discussion about this month\'s selected book.',
      image: '/events/book-club.jpg'
    }
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
      <Link
        to="/community/bookclub"
        className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-sm font-medium mb-6"
      >
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="inline-block">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Community
      </Link>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Upcoming Events</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
            <div className="aspect-w-16 aspect-h-9 bg-gray-200">
              <img
                src={event.image}
                alt={event.title}
                className="object-cover w-full h-48"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPinIcon className="h-5 w-5 mr-2" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <UserGroupIcon className="h-5 w-5 mr-2" />
                  <span>{event.attendees} attendees</span>
                </div>
              </div>
              <p className="mt-3 text-gray-600 text-sm">{event.description}</p>
              <button className="mt-4 w-full bg-indigo-50 text-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-100 transition-colors">
                Register Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsPage; 