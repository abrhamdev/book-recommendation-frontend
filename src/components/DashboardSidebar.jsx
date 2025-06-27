import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  BookOpenIcon,
  ChartBarIcon,
  UserGroupIcon,
  StarIcon,
  BookmarkIcon,
  BellIcon,
  Cog6ToothIcon,
  XMarkIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';

const DashboardSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const token = localStorage.getItem('NR_token');

  // Only render sidebar for authenticated users
  if (!user || !token) {
    return null;
  }

  const navigation = [
    { name: 'Home', href: '/dashboard', icon: HomeIcon, description: 'Your reading dashboard' },
    { name: 'Reading List', href: '/dashboard/readinglist', icon: BookOpenIcon, description: 'Your reading collection' },
    { name: 'Community', href: '/community/bookClub', icon: UserGroupIcon, description: 'Connect with others' },
    { name: 'For You', href: '/dashboard/recommendations', icon: StarIcon, description: 'Personalized picks' },
    { name: 'Activity', href: '/dashboard/activity', icon: BellIcon, description: 'Recent updates' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-[110] shadow-lg
        transform transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0 w-64' : 'w-12'}
        md:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
<div className="h-12 flex items-center justify-between px-2 border-b border-gray-200">
  {isOpen ? (
    <>
      <span className="font-bold text-indigo-600">NovaReads</span>
      <button 
        onClick={() => setIsOpen(false)}
        className="p-1 rounded-md hover:bg-gray-100"
      >
        <XMarkIcon className="h-6 w-6 text-gray-600" />
      </button>
    </>
  ) : (
    <button 
      onClick={() => setIsOpen(true)}
      className="p-1 rounded-md hover:bg-gray-100 mx-auto"
    >
      {/* Menu (hamburger) icon */}
      <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  )}
</div>


          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`
                      flex items-center gap-4 px-2 py-3 text-sm font-medium
                      transition-colors rounded-md
                      ${isActive(item.href) ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}
                    `}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {isOpen && (
                      <div>
                        <div>{item.name}</div>
                        <div className="text-xs text-gray-500">{item.description}</div>
                      </div>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Bottom Settings */}
          <div className="border-t border-gray-200 p-2">
            <Link
              to="/dashboard/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-4 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <Cog6ToothIcon className="h-5 w-5 text-gray-700" />
              {isOpen && <spa>Settings</spa>}
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[100] md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default DashboardSidebar;
