import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requirePreferences = false }) => {
  const { userData,preference,user } = useAuth();
  if (!user) {
    // Redirect to login if there's no user
    return <Navigate to="/login" replace />;
  }

  // Handle preferences requirement
  if (!preference) {
    // If on preferences page, allow access
    if (window.location.pathname === '/preferences') {
      return children;
    }
    // Otherwise redirect to preferences
    return <Navigate to="/preferences" replace />;
  }

  // If preferences are required but we're still on preferences page, redirect to dashboard
  if (preference && window.location.pathname === '/preferences') {
   if(userData?.role =="admin"){
      return <Navigate to="/admin/dashboard" replace />;
   }else if(userData?.role=="user"){
      return <Navigate to="/dashboard" replace />;
   }
  }

  // If preferences are required and we have them, or if preferences aren't required
  if ((requirePreferences && preference) || !requirePreferences) {
    return children;
  }

  // Fallback to preferences page
  return <Navigate to="/preferences" replace />;
};

export default ProtectedRoute;
