/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MoveLeftIcon } from 'lucide-react';
import { FcGoogle } from "react-icons/fc";
import { handleGoogleLogin } from '../utils/firebase';
import { toast } from 'react-toastify';
import { API_URL } from '../../API_URL';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const onGoogleLoginClick = async () => {
    try {
      const response = await handleGoogleLogin();
      toast.success(response.message);
      login({ token: response.token });
      navigate('/');
    } catch (err) {
      const errorMsg ="Something Went Wrong!";
      toast.error(errorMsg);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/users/login`, formData);
      toast.success(response.data.message || "Login successful!");
      login({ token: response.data.token });
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || "Login Failed!");
    }
  };


  return (
    <div className="min-h-screen bg-gray-300 py-8 px-4 sm:px-6 lg:px-8">
      <Link to="/">
        <MoveLeftIcon className='w-10'/>
      </Link>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto"
      >
        <div className="relative">
          {/* Book Container */}
          <div className="flex flex-col md:flex-row">
            {/* Left Page */}
            <div className="w-full md:w-1/2 p-8 md:p-10 bg-[#f8f4e8] relative">
              {/* Curved effect for left page */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-1"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-transparent"></div>
              
              <div className="relative z-10 h-full flex flex-col justify-center items-center text-center">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="max-w-sm"
                >
                  <h2 className="text-2xl font-serif text-gray-800 mb-4">Welcome Back</h2>
                  <p className="text-gray-600 italic font-serif mb-6 text-sm">
                    "The more that you read, the more things you will know. The more that you learn, the more places you'll go."
                  </p>
                  <p className="text-gray-500 font-serif text-sm">- Dr. Seuss</p>
                </motion.div>
              </div>
            </div>

            {/* Book Spine */}
            <div className="hidden md:block w-1.5 bg-gradient-to-b from-gray-300 to-gray-400 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-400 to-gray-300 transform -skew-x-1"></div>
            </div>

            {/* Right Page */}
            <div className="w-full md:w-1/2 p-8 md:p-10 bg-[#f8f4e8] relative">
              {/* Curved effect for right page */}
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/10 to-transparent transform skew-x-1"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-l from-black/5 to-transparent"></div>
              
              <div className="relative z-10 h-full flex flex-col justify-center">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-2xl font-serif text-gray-800 mb-8 text-center">Login to Your Account</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 font-serif">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 font-serif">
                        Password
                      </label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                        required
                      />
                    </div>
                    <button type="button" onClick={() => setShowPassword(prev => !prev)} className=" right-3 transform cursor-pointer hover:text-gray-900 -translate-y-1/2 text-sm text-gray-600 focus:outline-none">
                    {showPassword ? 'Hide Password' : 'Show Password'}
                    </button>

                    <div className="pt-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border cursor-pointer border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-stone-700 hover:bg-stone-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Login
                      </motion.button>
                    </div>
                  </form>
                  <button onClick={onGoogleLoginClick} className="flex my-4 cursor-pointer bg-white items-center justify-center gap-2 border border-gray-300 rounded-lg px-4 py-2 shadow-sm hover:shadow-md  transition duration-200 w-full">
                      <FcGoogle className="w-5 h-5" />
                      <span className="text-sm font-medium text-gray-700">
                        Sign in with Google
                      </span>
                   </button>

                  <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600 font-serif">
                      Don't have an account?{' '}
                      <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Sign up
                      </Link>
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Book Shadow */}
          <div className="absolute -bottom-3 left-0 right-0 h-3 bg-gradient-to-b from-gray-200 to-transparent rounded-b-lg transform -skew-y-1"></div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage; 