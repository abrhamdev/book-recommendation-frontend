import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { API_URL } from '../../API_URL';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null); //to be replace user state is we get time
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
//preferences
  const [preference, setPreference] = useState(null);
 
  
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check for token in localStorage
        const token = localStorage.getItem('NR_token');        
        if (token) {
          setUser({ token });
          const fetchuser =await axios.post(`${API_URL}/users/me`,{}, {
            headers: {
               Authorization: `Bearer ${token}`,
               }
          })
            setUserData(fetchuser.data.user);
          
          const response = await axios.post(`${API_URL}/users/me/fetchPreferences`,{}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
          });
          setPreference(response?.data);
          // If user hasn't set preferences, redirect to preferences page
          if (!preference && window.location.pathname !== '/preferences') {
            navigate('/preferences');
          }
        } else {
          // If no token, ensure user state is cleared
          setUser(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // On any error, clear everything to be safe
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [navigate]);

  const login = (userDataparam) => {
    setUser(userDataparam);
    localStorage.setItem('NR_token', userDataparam.token);
    // Check if user has preferences
   // const hasPreferences = localStorage.getItem('userPreferences');
    try{
      if (userDataparam.isLanding) {
        navigate('/preferences');
      } else {
        if(userDataparam.role=="admin"){
          navigate('/admin/dashboard');
        }else if(userDataparam.role=="user"){
          navigate('/dashboard');
        }
      }
    }catch(error){
      console.log(error);
    }
  };

  const logout = () => {
    // Clear all auth-related state
    setUser(null);
    setLoading(false);
    
    // Navigate to home page
    navigate('/', { replace: true });
  };

  const setPreferences = (preferences) => {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
    if(userData.role=="admin"){
      navigate('/admin/dashboard');
    }else{
      navigate('/dashboard');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen w-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
    </div>
;
  }

  return (
    <AuthContext.Provider value={{ preference,userData,user, login, logout, setPreferences }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
