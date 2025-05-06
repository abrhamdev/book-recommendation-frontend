import { useState,useEffect } from 'react';
import { API_URL } from '../../../API_URL';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  UserCircleIcon,
  PencilIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  DevicePhoneMobileIcon,
  EnvelopeIcon,
  KeyIcon,
  BookOpenIcon,
  CogIcon,
  BellIcon
} from '@heroicons/react/24/outline';

const ProfileSettings = () => {
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [securityAction, setSecurityAction] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [user,setUser]=useState();
  
  const [profile, setProfile] = useState({
    name: 'Alex Johnson',
    email: 'alex@example.com',
    auth_provider: 'local',
    birth_date: '1990-01-15',
    location: 'New York, USA',
    profile_picture: 'https://randomuser.me/api/portraits/men/32.jpg',
    created_at: '2023-01-01T00:00:00Z'
  });

    useEffect(() => {
      const token = localStorage.getItem("NR_token");
      if (!token) return;
      const getUser = async () => {
    try{
      const response =await axios.post(`${API_URL}/users/me/profile`,{}, {
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

  // Sample connected devices
  const [devices, setDevices] = useState([
    { id: 1, name: 'iPhone 13', os: 'iOS', last_active: '2023-06-20T14:30:00Z', current: true },
    { id: 2, name: 'MacBook Pro', os: 'macOS', last_active: '2023-06-18T09:15:00Z', current: false },
  ]);

  // Preferences state
  const [preferences, setPreferences] = useState({
    notificationEnabled: true,
    newsletterSubscribed: false,
    darkMode: false,
    preferredGenres: ['Fantasy', 'Science Fiction'],
    readingGoal: 24
  });

  const handleChangePassword = (e) => {
    e.preventDefault();
    // Add password change logic here
    console.log('Password changed');
    setSecurityAction(null);
  };

  const handleRemoveDevice = (deviceId) => {
    setDevices(devices.filter(device => device.id !== deviceId));
  };

  const handleAddRecoveryEmail = (e) => {
    e.preventDefault();
    // Add recovery email logic here
    console.log('Recovery email added:', recoveryEmail);
    setSecurityAction(null);
  };

  const handleProfileChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePreferenceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleGenreToggle = (genre) => {
    setPreferences(prev => {
      const newGenres = prev.preferredGenres.includes(genre)
        ? prev.preferredGenres.filter(g => g !== genre)
        : [...prev.preferredGenres, genre];
      return { ...prev, preferredGenres: newGenres };
    });
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Security Actions Components
  const SecurityActions = {
    password: (
      <form onSubmit={handleChangePassword} className="space-y-4">
        <div>
          <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
            Current Password
          </label>
          <input
            type="password"
            id="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <input
            type="password"
            id="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
            minLength="8"
          />
          <p className="mt-1 text-xs text-gray-500">Minimum 8 characters with at least one number and one special character</p>
        </div>

        <div>
          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
            Confirm New Password
          </label>
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={() => setSecurityAction(null)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Update Password
          </button>
        </div>
      </form>
    ),
    
    recoveryEmail: (
      <form onSubmit={handleAddRecoveryEmail} className="space-y-4">
        <div>
          <label htmlFor="recovery-email" className="block text-sm font-medium text-gray-700">
            Recovery Email Address
          </label>
          <input
            type="email"
            id="recovery-email"
            value={recoveryEmail}
            onChange={(e) => setRecoveryEmail(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            We'll send a verification email to this address
          </p>
        </div>

        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={() => setSecurityAction(null)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Recovery Email
          </button>
        </div>
      </form>
    )
  };

  // Available genres for preferences
  const allGenres = [
    'Fantasy', 'Science Fiction', 'Mystery', 'Thriller', 'Romance',
    'Historical Fiction', 'Horror', 'Biography', 'Self Help', 'Business',
    'History', 'Poetry', 'Young Adult', 'Children', 'Cookbooks'
  ];

  return (
    <>
      <div className="flex-1 p-4 md:p-6 md:pl-20">
        <div className="max-w-4xl pt-8 mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h1>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('personal')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'personal' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Personal
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'security' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Security
              </button>
              <button
                onClick={() => setActiveTab('preferences')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'preferences' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Preferences
              </button>
            </nav>
          </div>

          {/* Personal Information */}
          {activeTab === 'personal' && (
            <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm">
              {!editMode ? (
                <>
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    <div className="relative self-center md:self-start">
                      <img
                        src={user?.profile_picture || ''}
                        alt={user?.name}
                        className="h-24 w-24 rounded-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                      <p className="text-gray-600">{user?.email}</p>
                      <p className="mt-2 text-gray-700">
                        {user?.location ? (
                          <span className="flex items-center">
                            <svg className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {user?.location}
                          </span>
                        ):(
                          <span className="flex items-center">
                            <svg className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </span>
                        )}
                        {user?.birth_date ? (
                          <span className="flex items-center mt-1">
                            <svg className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(user.birth_date).toLocaleDateString()}
                          </span>
                        ):(
                          <span className="flex items-center mt-1">
                            <svg className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </span>
                        )}
                      </p>
                      <div className="mt-4 text-sm text-gray-500">
                        <span>Member since {new Date(user?.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => setEditMode(true)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <PencilIcon className="h-4 w-4 mr-2" />
                      Edit Profile
                    </button>
                  </div>
                </>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setEditMode(false); }} className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    <div className="relative self-center md:self-start">
                      <img
                        src={user?.profile_picture}
                        alt={user?.name}
                        className="h-24 w-24 rounded-full object-cover"
                      />
                      <button
                        type="button"
                        className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full shadow-sm hover:bg-indigo-700"
                      >
                        <PencilIcon className="h-4 w-4 text-white" />
                      </button>
                    </div>
                    <div className="flex-1 space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={user.name}
                          onChange={handleProfileChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={user.email}
                          onChange={handleProfileChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="birth_date" className="block text-sm font-medium text-gray-700">
                        Birth Date
                      </label>
                      <input
                        type="date"
                        id="birth_date"
                        name="birth_date"
                        value={user.birth_date}
                        onChange={handleProfileChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                        Location
                      </label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={user.location}
                        onChange={handleProfileChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setEditMode(false)}
                      className="w-full md:w-auto inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="w-full md:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Enhanced Security Settings */}
          {activeTab === 'security' && (
            <div className="bg-white rounded-lg shadow-sm">
              {securityAction ? (
                <div className="p-6">
                  <div className="flex items-center mb-6">
                    <button
                      onClick={() => setSecurityAction(null)}
                      className="mr-2 p-1 rounded-full hover:bg-gray-100"
                    >
                      <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                    </button>
                    <h2 className="text-lg font-medium text-gray-900">
                      {securityAction === 'password' && 'Change Password'}
                      {securityAction === 'recoveryEmail' && 'Add Recovery Email'}
                    </h2>
                  </div>
                  {SecurityActions[securityAction]}
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {/* Password Section */}
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <KeyIcon className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <h3 className="text-base font-medium text-gray-900">Password</h3>
                          <p className="text-sm text-gray-500">
                            {profile.auth_provider === 'google' ? 
                              'You use Google to sign in. Password changes must be made through your Google account.' : 
                              'Last changed 3 months ago'}
                          </p>
                        </div>
                      </div>
                      {profile.auth_provider === 'local' && (
                        <button
                          onClick={() => setSecurityAction('password')}
                          className="ml-4 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Change
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <ShieldCheckIcon className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <h3 className="text-base font-medium text-gray-900">Two-Factor Authentication</h3>
                          <p className="text-sm text-gray-500">
                            {twoFactorEnabled ? 
                              'Enabled - Adds an extra layer of security' : 
                              'Disabled - Protect your account with an extra layer of security'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                        className={`ml-4 inline-flex items-center px-3 py-2 border ${twoFactorEnabled ? 'border-transparent bg-indigo-100 text-indigo-700' : 'border-gray-300 bg-white text-gray-700'} shadow-sm text-sm leading-4 font-medium rounded-md hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                      >
                        {twoFactorEnabled ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                    {twoFactorEnabled && (
                      <div className="mt-4 pl-8 text-sm text-gray-500">
                        <p>You'll be prompted for a verification code when signing in.</p>
                      </div>
                    )}
                  </div>

                  {/* Recovery Email */}
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <EnvelopeIcon className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <h3 className="text-base font-medium text-gray-900">Recovery Email</h3>
                          <p className="text-sm text-gray-500">
                            {recoveryEmail ? 
                              recoveryEmail : 
                              'Not set - Add an email to help recover your account'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSecurityAction('recoveryEmail')}
                        className="ml-4 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        {recoveryEmail ? 'Change' : 'Add'}
                      </button>
                    </div>
                  </div>

                  {/* Connected Devices */}
                  <div className="p-6">
                    <div className="flex items-center">
                      <DevicePhoneMobileIcon className="h-5 w-5 text-gray-500 mr-3" />
                      <div>
                        <h3 className="text-base font-medium text-gray-900">Connected Devices</h3>
                        <p className="text-sm text-gray-500">
                          {devices.length} device{devices.length !== 1 ? 's' : ''} connected to your account
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 space-y-4 pl-8">
                      {devices.map(device => (
                        <div key={device.id} className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{device.name}</p>
                            <p className="text-xs text-gray-500">
                              {device.os} • {device.current ? 'This device' : `Last active ${formatDate(device.last_active)}`}
                            </p>
                          </div>
                          {!device.current && (
                            <button
                              onClick={() => handleRemoveDevice(device.id)}
                              className="text-sm font-medium text-red-600 hover:text-red-500"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm">
              <div className="space-y-8">
                {/* Notification Preferences */}
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <BellIcon className="h-5 w-5 mr-2 text-gray-500" />
                    Notification Preferences
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <label htmlFor="notificationEnabled" className="block text-sm font-medium text-gray-700">
                          Email Notifications
                        </label>
                        <p className="text-sm text-gray-500">
                          Receive important account notifications via email
                        </p>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="notificationEnabled"
                          name="notificationEnabled"
                          checked={preferences.notificationEnabled}
                          onChange={handlePreferenceChange}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label htmlFor="newsletterSubscribed" className="block text-sm font-medium text-gray-700">
                          Newsletter Subscription
                        </label>
                        <p className="text-sm text-gray-500">
                          Receive our weekly newsletter with book recommendations
                        </p>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="newsletterSubscribed"
                          name="newsletterSubscribed"
                          checked={preferences.newsletterSubscribed}
                          onChange={handlePreferenceChange}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reading Preferences */}
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <BookOpenIcon className="h-5 w-5 mr-2 text-gray-500" />
                    Reading Preferences
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Genres
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {allGenres.map(genre => (
                          <button
                            key={genre}
                            type="button"
                            onClick={() => handleGenreToggle(genre)}
                            className={`px-3 py-1 rounded-full text-sm font-medium ${preferences.preferredGenres.includes(genre) ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'}`}
                          >
                            {genre}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label htmlFor="readingGoal" className="block text-sm font-medium text-gray-700">
                        Annual Reading Goal
                      </label>
                      <input
                        type="number"
                        id="readingGoal"
                        name="readingGoal"
                        min="1"
                        max="100"
                        value={preferences.readingGoal}
                        onChange={handlePreferenceChange}
                        className="mt-1 block w-full sm:w-1/3 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        Set your yearly book reading target
                      </p>
                    </div>
                  </div>
                </div>

                {/* Display Preferences */}
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <CogIcon className="h-5 w-5 mr-2 text-gray-500" />
                    Display Preferences
                  </h2>
                  <div className="flex items-center justify-between">
                    <div>
                      <label htmlFor="darkMode" className="block text-sm font-medium text-gray-700">
                        Dark Mode
                      </label>
                      <p className="text-sm text-gray-500">
                        Switch between light and dark theme
                      </p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="darkMode"
                        name="darkMode"
                        checked={preferences.darkMode}
                        onChange={handlePreferenceChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfileSettings;