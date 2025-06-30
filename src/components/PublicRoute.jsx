import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoute = ({ children }) => {
  const { userData } = useAuth();
  const token = localStorage.getItem('NR_token');

  // If user is authenticated, redirect to dashboard
  if (userData && token) {
    if(userData?.role=="admin"){
      return <Navigate to="/admin/dashboard" replace />;
    }else if(userData?.role=="user"){
      return <Navigate to="/dashboard" replace />;
    }
  }

  // If not authenticated, show the public route
  return children;
};

export default PublicRoute;
