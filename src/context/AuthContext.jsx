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

  useEffect(() => {
    const token = localStorage.getItem("NR_token");
    if (!token) return;
    const getUser = async () => {
  try{
    const response =await axios.post(`${API_URL}/users/me`,{}, {
      headers: {
         Authorization: `Bearer ${token}`,
         }
    })
      setUserData(response.data.user);
  }catch(error){
      setUserData(null);
    }}
    getUser();
  }, []);
  
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check for token in localStorage
        const token = localStorage.getItem('NR_token');
        const userPreferences = localStorage.getItem('userPreferences');
        
        if (token) {
          setUser({ token });
          // If user hasn't set preferences, redirect to preferences page
          if (!userPreferences && window.location.pathname !== '/preferences') {
            navigate('/preferences');
          }
        } else {
          // If no token, ensure user state is cleared
          setUser(null);
          localStorage.clear();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // On any error, clear everything to be safe
        setUser(null);
        localStorage.clear();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [navigate]);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('NR_token', userData.token);
    // Check if user has preferences
    const hasPreferences = localStorage.getItem('userPreferences');
    if (!hasPreferences) {
      navigate('/preferences');
    } else {
      navigate('/dashboard');
    }
  };

  const logout = () => {
    // Clear all auth-related state
    setUser(null);
    setLoading(false);
    
    // Clear all stored data
    localStorage.clear(); // This will remove all localStorage items
    
    // Navigate to home page
    navigate('/', { replace: true });
  };

  const setPreferences = (preferences) => {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
    navigate('/dashboard');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ userData,user, login, logout, setPreferences }}>
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
