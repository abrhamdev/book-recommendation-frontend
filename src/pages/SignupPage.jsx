/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { Link ,useNavigate} from 'react-router-dom';
import { MoveLeftIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { FcGoogle } from "react-icons/fc";
import { handleGoogleLogin } from '../utils/firebase';
import {motion} from 'framer-motion';
import { toast } from 'react-toastify';
import { API_URL } from '../../API_URL';

const signupSchema = yup.object().shape({
  fullName: yup.string().min(3, 'Full Name must be at least 3 characters').required('Full name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string()
  .required('Password is required')
  .min(8, 'Password must be at least 8 characters')
  .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
  .matches(/[a-z]/, 'Must contain at least one lowercase letter')
  .matches(/\d/, 'Must contain at least one number')
  .matches(/[@$!%*?&.]/, 'Must contain at least one special character'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
 const navigate=useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signupSchema),
  });

  const onSubmit = async (data) => {
    try {
      toast(`Verify Your Email! We have sent Verification link to ${data.email}`,{
        autoClose:5000,
      });
      const response = await axios.post(`${API_URL}/users/signup`, data);
      toast.success( response.data.message);
      
    } catch (error) {
      toast.error(error.response?.data.message || error.message);
    }
  };

  const onGoogleLoginClick = async () => {
    try {
      const response = await handleGoogleLogin();
      toast.success(response.message || "Login successfull!");
      navigate('/');
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Login failed!";
      toast.error(errorMsg);
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
          <div className="flex flex-col md:flex-row">
            {/* Left Page */}
            <div className="w-full md:w-1/2 p-8 md:p-10 bg-[#f8f4e8] relative">
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
                  <h2 className="text-2xl font-serif text-gray-800 mb-4">Welcome to NovaReads</h2>
                  <p className="text-gray-600 italic font-serif mb-6 text-sm">
                    "A reader lives a thousand lives before he dies. The man who never reads lives only one."
                  </p>
                  <p className="text-gray-500 font-serif text-sm">- George R.R. Martin</p>
                </motion.div>
              </div>
            </div>

            {/* Book Spine */}
            <div className="hidden md:block w-1.5 bg-gradient-to-b from-gray-300 to-gray-400 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-400 to-gray-300 transform -skew-x-1"></div>
            </div>

            {/* Right Page */}
            <div className="w-full md:w-1/2 p-8 md:p-10 bg-[#f8f4e8] relative">
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/10 to-transparent transform skew-x-1"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-l from-black/5 to-transparent"></div>
              
              <div className="relative z-10">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-2xl font-serif text-gray-800 mb-6 text-center">Create Your Account</h2>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 font-serif">
                        Full Name
                      </label>
                      <input
                        id="fullName"
                        {...register('fullName')}
                        className="mt-1 block w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                        
                      />
                      <p className="text-red-600 text-xs">{errors.fullName?.message}</p>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 font-serif">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        {...register('email')}
                        className="mt-1 block w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                        
                      />
                      <p className="text-red-600 text-xs">{errors.email?.message}</p>
                    </div>

                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 font-serif">
                        Password
                      </label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        {...register('password')}
                        className="mt-1 block w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                        
                      />
                      <p className="text-red-600 text-xs">{errors.password?.message}</p>
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 font-serif">
                        Confirm Password
                      </label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        {...register('confirmPassword')}
                        className="mt-1 block w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                      />
                      <p className="text-red-600 text-xs">{errors.confirmPassword?.message}</p>
                    </div>
                  <div>
                  <button type="button" onClick={() => setShowPassword(prev => !prev)} className=" right-3 transform cursor-pointer hover:text-gray-900 -translate-y-1/2 text-sm text-gray-600 focus:outline-none">
                    {showPassword ? 'Hide Password' : 'Show Password'}
                  </button>
                  </div>
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full flex justify-center py-1.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-stone-700 hover:bg-stone-500 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Sign Up
                    </motion.button>
                    
                  </form>
                  <button onClick={onGoogleLoginClick} className="flex my-4 cursor-pointer bg-white items-center justify-center gap-2 border border-gray-300 rounded-lg px-4 py-2 shadow-sm hover:shadow-md  transition duration-200 w-full">
                      <FcGoogle className="w-5 h-5" />
                      <span className="text-sm font-medium text-gray-700">
                        Sign in with Google
                      </span>
                   </button>

                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600 font-serif">
                      Already have an account?{' '}
                      <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Log in
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

export default SignupPage; 