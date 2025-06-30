import { useState,useEffect,useRef } from 'react';
import { API_URL } from '../../../API_URL';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import {
  languages,
  allGenreItems,
  ageGroups,
  bookLengths
} from '../../data/preferenceOptions'; 
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
  BellIcon,
  SunIcon, 
  MoonIcon, 
  ComputerDesktopIcon
} from '@heroicons/react/24/outline';

const ProfileSettings = () => {
  const { i18n } = useTranslation();
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [securityAction, setSecurityAction] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [user,setUser]=useState();

  const [preference, setPreference] = useState(null);
  const [editPreferenceMode, setEditPreferenceMode] = useState(false);
  const [profileFormData, setProfileFormData] = useState({
      name: '',
      email: '',
      birth_date: '',
      location: '',
    });
  const fileInputRef = useRef(null);


  const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  };

  const getCurrentTheme = () => {
    return localStorage.getItem('theme') || 'light';
  };

  
    const handleEditClick = () => {
      fileInputRef.current.click();
    };
  
    const handleFileChange = async (e) => {
      const token = localStorage.getItem("NR_token");
      const selectedFile = e.target.files[0];
      if (!selectedFile) return;
  
      // Create form data
      const formData = new FormData();
      formData.append("profile_picture", selectedFile);
  
      try {
        // Call your backend API
        const response = await axios.post(`${API_URL}/users/me/upload-profile-picture`, formData, {
          headers: { 
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success(response.data.message);
        
      } catch (error) {
        toast.error(error.response?.data.message);
        alert("Error uploading profile picture");
      }
    };


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
        setProfileFormData({
                  name: response.data.user.name || '',
                  email: response.data.user.email || '',
                  birth_date: response.data.user.birth_date ? new Date(response.data.user.birth_date).toISOString().split('T')[0] : '', 
                  location: response.data.user.location || '',
                });
    }catch(error){
      toast.error(error.response?.data.message);
        setUser(null);
      }}
      
      const getPreference = async () => {
            try {
              const response = await axios.post(`${API_URL}/users/me/fetchPreferences`,{}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
              });
              const prefData = response.data;
              setPreference({
                ...prefData,
                age_group:prefData.age_group || '',
                book_length:prefData.book_length || '',
                languages: JSON.parse(prefData.languages || '[]'),
                genres: JSON.parse(prefData.genres || '[]'),
                authors: JSON.parse(prefData.authors || '[]'),
              });
              
            } catch (error) {
              toast.error(error.response?.data.message);
              setPreference(null);
            }
          };
      
      getUser();
      getPreference();
    }, []);
    
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("NR_token");
        if (!token) {
          toast.error("Authentication token not found.");
          return;
        }
    
        try {
          // Send only the fields that are allowed to be updated
          const updatePayload = {
            name: profileFormData.name,
            email: profileFormData.email,
            birth_date: profileFormData.birth_date,
            location: profileFormData.location,
          };
    
          await axios.post(`${API_URL}/users/me/updateProfile`, updatePayload, { 
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          toast.success("Profile updated successfully!");
          const response = await axios.post(`${API_URL}/users/me/profile`,{}, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(response.data.user);
          setEditMode(false); // Exit edit mode
        } catch (error) {
          toast.error(error.response?.data.message || "Failed to update profile.");
        }
      };


    const handleUpdatePreference = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("NR_token");
        try {
          const payload = {
            ...preference,
            ageGroup:preference.age_group || '',
            bookLength:preference.book_length || '',
            languages: JSON.stringify(preference.languages),
            genres: JSON.stringify(preference.genres),
            authors: JSON.stringify(preference.authors),
          };
          await axios.post(`${API_URL}/users/me/updatePreference`, payload, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          toast.success("Preferences updated successfully!");
          setEditPreferenceMode(false);
        } catch (error) {
          toast.error(error.response?.data.message || "Failed to update preferences.");
        }
      };
    
      const handlePreferenceInputChange = (e) => {
        const { name, value } = e.target;
        setPreference(prev => ({ ...prev, [name]: value }));
      };
    
      const handleMultiSelectChange = (name, value) => {
        setPreference(prev => ({
          ...prev,
          [name]: prev[name].includes(value)
            ? prev[name].filter(item => item !== value)
            : [...prev[name], value]
        }));
      };
    
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
    readingGoal: 24
  });

  const handleChangePassword = async (e) => {
  e.preventDefault();
  
  // Client-side validation
  if (newPassword.length < 8) {
    toast.error("Password must be at least 8 characters");
    return;
  }

  if (newPassword !== confirmPassword) {
    toast.error("New passwords don't match");
    return;
  }

  try {
    const token = localStorage.getItem("NR_token");
    const response = await axios.post(
      `${API_URL}/users/change-password`,
      {
        currentPassword,
        newPassword
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Password changed succesfully")
    toast.success(response.data.message || "Password changed successfully");
    setSecurityAction(null);
    // Clear form fields
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  } catch (error) {
    console.error("Password change failed:", error);
    toast.error(
      error.response?.data?.message || 
      "Failed to change password. Please try again."
    );
  }
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
      const { name, value } = e.target;
      setProfileFormData(prev => ({
        ...prev,
        [name]: value
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
            <h1 className="text-3xl font-bold text-gray-900 mb-6 mt-3">Settings</h1>
          
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
                        src={user?.profile_picture}
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
                <>
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className="relative self-center md:self-start">
                    <img
                      src={user?.profile_picture}
                      alt={user?.name}
                      className="h-24 w-24 rounded-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleEditClick}
                      className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full shadow-sm hover:bg-indigo-700"
                    >
                      <PencilIcon className="h-4 w-4 text-white" />
                    </button>
                    <input
                             ref={fileInputRef}
                             type="file"
                             accept="image/*"
                             className="hidden"
                             onChange={handleFileChange}
                           />
                  </div>
                  </div>
                <form onSubmit={(e) => { handleUpdateProfile(e); setEditMode(false); }} className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    
                    <div className="flex-1 space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={profileFormData.name}
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
                          value={profileFormData?.email || null}
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
                        value={profileFormData?.birth_date || ''}
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
                        value={profileFormData?.location || ''}
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
                </>
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
                            {user?.auth_provider === 'google' ? 
                              'You use Google to sign in. Password changes must be made through your Google account.' : 
                              'Last changed 3 months ago'}
                          </p>
                        </div>
                      </div>
                        <button
                          onClick={() => setSecurityAction('password')}
                          className="ml-4 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Change
                        </button>
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
                    {preference && (
                      !editPreferenceMode ? (
                        <div className="space-y-4">
                          <p><strong>Age Group:</strong> {preference.age_group}</p>
                          <p><strong>Book Length:</strong> {preference.book_length}</p>
                          <p><strong>Languages:</strong> {preference.languages.join(', ')}</p>
                          <p><strong>Genres:</strong> {preference.genres.join(', ')}</p>
                        </div>):(
                                              <form onSubmit={handleUpdatePreference} className="space-y-6">
                                                <div>
                                                  <label htmlFor="age_group" className="block text-sm font-medium text-gray-700">Age Group</label>
                                                  <select id="age_group" name="age_group" value={preference.age_group} onChange={handlePreferenceInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3">
                                                    {ageGroups.map(group => <option key={group.value} value={group.value}>{group.label}</option>)}
                                                  </select>
                                                </div>
                                                <div>
                                                  <label htmlFor="book_length" className="block text-sm font-medium text-gray-700">Book Length</label>
                                                  <select id="book_length" name="book_length" value={preference.book_length} onChange={handlePreferenceInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3">
                                                    {bookLengths.map(len => <option key={len.value} value={len.value}>{len.label}</option>)}
                                                  </select>
                                                </div>
                                                <div>
                                                  <label className="block text-sm font-medium text-gray-700 mb-2">Languages</label>
                                                  <div className="flex flex-wrap gap-2">
                                                    {languages.map(lang => (
                                                      <button key={lang} type="button" onClick={() => handleMultiSelectChange('languages', lang)} className={`px-3 py-1 rounded-full text-sm font-medium ${preference.languages.includes(lang) ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'}`}>
                                                        {lang}
                                                      </button>
                                                    ))}
                                                  </div>
                                                </div>
                                                <div>
                                                  <label className="block text-sm font-medium text-gray-700 mb-2">Genres</label>
                                                  <div className="flex flex-wrap gap-2">
                                                    {allGenreItems.map(genre => (
                                                      <button key={genre} type="button" onClick={() => handleMultiSelectChange('genres', genre)} className={`px-3 py-1 rounded-full text-sm font-medium ${preference.genres.includes(genre) ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'}`}>
                                                        {genre}
                                                      </button>
                                                    ))}
                                                  </div>
                                                </div>
                                                <div className="flex justify-end gap-3">
                                                  <button type="button" onClick={() => setEditPreferenceMode(false)} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                                                    Cancel
                                                  </button>
                                                  <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                                                    Save Changes
                                                  </button>
                                                </div>
                                              </form>
                                            ))}
                   {/* <div>
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
                   </div>*/}
                   {!editPreferenceMode && (
                                         <button
                                           onClick={() => setEditPreferenceMode(true)}
                                           className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                         >
                                           <PencilIcon className="h-4 w-4 mr-2" />
                                           Edit
                                         </button>
                                       )}
                  </div>
                </div>

                {/* Display Preferences */}
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <CogIcon className="h-5 w-5 mr-2 text-gray-500" />
                    Display Preferences
                  </h2>
                  
                  {/* Theme Selection */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Theme
                        </label>
                        <p className="text-s">
                          Choose your preferred color scheme
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          className={`btn btn-sm btn-ghost ${document.documentElement.getAttribute('data-theme') === 'light' ? 'btn-active' : ''}`}
                          onClick={() => {
                            document.documentElement.setAttribute('data-theme', 'light');
                            localStorage.setItem('theme', 'light');
                          }}
                          title="Light mode"
                        >
                          <SunIcon className="h-5 w-5 hover:cursor-pointer" />
                        </button>
                        <button
                          className={`btn btn-sm btn-ghost ${document.documentElement.getAttribute('data-theme') === 'dark' ? 'btn-active' : ''}`}
                          onClick={() => {
                            document.documentElement.setAttribute('data-theme', 'dark');
                            localStorage.setItem('theme', 'dark');
                          }}
                          title="Dark mode"
                        >
                          <MoonIcon className="h-5 w-5 hover:cursor-pointer" />
                        </button>
                        <button
                          className={`btn btn-sm btn-ghost ${localStorage.getItem('theme') === 'system' ? 'btn-active' : ''}`}
                          onClick={() => {
                            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                            document.documentElement.setAttribute('data-theme', systemTheme);
                            localStorage.setItem('theme', 'system');
                          }}
                          title="System preference"
                        >
                          <ComputerDesktopIcon className="h-5 w-5 hover:cursor-pointer" />
                        </button>
                      </div>
                    </div>
                  </div>
                    {/* Language Selection */}
                    <div className="flex items-center justify-between">
                      <div>
                        <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                          Language
                        </label>
                        <p className="text-sm text-gray-500">
                          Choose your preferred language
                        </p>
                      </div>
                      <div>
                        <select
                          id="language"
                          name="language"
                          value={preferences.language}
                          onChange={(e) => i18n.changeLanguage(e.target.value)}
                          className="mt-1 block w-full pl-3 cursor-pointer pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                          <option value="en">English</option>
                          <option value="am">አማርኛ (Amharic)</option>
                        </select>
                      </div>
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
          )}
        </div>
      </div>
    </>
  );
};

export default ProfileSettings;