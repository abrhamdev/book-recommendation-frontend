import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from 'react-toastify';
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import PreferencesPage from "./pages/PreferencesPage";
import BookDetailPage from "./pages/BookDetailPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import DiscoverPage from "./pages/DiscoverPage";
import BookClubsPage from "./pages/bookClubPage";
import ProfilePage from "./pages/Dashboard/profile";
import FeatureUnderDevelopment from "./pages/errorPages/underDevelopmentPage";
import UserDashboard from "./pages/Dashboard/dashBoard";
import Layout from "./pages/layout/layout";
import AboutUs from "./pages/aboutUs";

function App() {
  return (
    <Router>
      <ToastContainer hideProgressBar={true} position="top-center" autoClose={3000} />
      <Routes>
        
        <Route path="/" element={<HomePage />} />
        <Route path="/preferences" element={<PreferencesPage />} />
        <Route path="/signup" element={<SignupPage />} />
       <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Layout/>}>
           <Route path="/book/:id" element={<BookDetailPage />} />
           <Route path="/search" element={<SearchResultsPage />} />
           <Route path="/dashboard" element={<UserDashboard/>} />
           <Route path="/discover" element={<DiscoverPage />} />
           <Route path="/community/bookclub" element={<BookClubsPage />} />
           <Route path="/profile" element={<ProfilePage />} />
           <Route path="/underdevelopment" element={<FeatureUnderDevelopment />} />
        </Route>  
        
        <Route path="/aboutus" element={<AboutUs />} />
      </Routes>
    </Router>
  );
}

export default App;
