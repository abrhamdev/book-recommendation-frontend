import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  const token = localStorage.getItem('NR_token');

  // If user is authenticated, redirect to dashboard
  if (user && token) {
    return <Navigate to="/dashboard" replace />;
  }

  // If not authenticated, show the public route
  return children;
};

export default PublicRoute;
