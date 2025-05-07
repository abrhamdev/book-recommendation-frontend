import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requirePreferences = false }) => {
  const { user } = useAuth();
  const hasPreferences = localStorage.getItem('userPreferences');
  
  if (!user) {
    // Redirect to login if there's no user
    return <Navigate to="/login" replace />;
  }

  // Handle preferences requirement
  if (!hasPreferences) {
    // If on preferences page, allow access
    if (window.location.pathname === '/preferences') {
      return children;
    }
    // Otherwise redirect to preferences
    return <Navigate to="/preferences" replace />;
  }

  // If preferences are required but we're still on preferences page, redirect to dashboard
  if (hasPreferences && window.location.pathname === '/preferences') {
    return <Navigate to="/dashboard" replace />;
  }

  // If preferences are required and we have them, or if preferences aren't required
  if ((requirePreferences && hasPreferences) || !requirePreferences) {
    return children;
  }

  // Fallback to preferences page
  return <Navigate to="/preferences" replace />;
};

export default ProtectedRoute;
