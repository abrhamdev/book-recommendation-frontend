import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
import SettingsPage from "./pages/Dashboard/settings";
import FeatureUnderDevelopment from "./pages/errorPages/underDevelopmentPage";
import UserDashboard from "./pages/Dashboard/dashBoard";
import Layout from "./pages/layout/layout";
import AboutUs from "./pages/aboutUs";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from './components/PublicRoute';
import ReadingListPage from "./pages/Dashboard/ReadingList";
import BookForm from "./pages/Dashboard/bookForm";
import PersonalRecommendationPage from "./pages/Dashboard/PersonalRecommendationPage";


function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastContainer hideProgressBar={true} position="top-center" autoClose={3000} />
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/aboutus" element={<AboutUs />} />

          {/* Home route with conditional rendering */}
          <Route path="/" element={
            <PublicRoute>
              <HomePage />
            </PublicRoute>
          } />

          {/* Protected Preferences Route (without Layout) */}
          <Route path="/preferences" element={
            <ProtectedRoute>
              <PreferencesPage />
            </ProtectedRoute>
          } />

          {/* Protected routes with Layout - Only accessible after preferences are set */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/readinglist" element={
              <ProtectedRoute>
                <ReadingListPage />
              </ProtectedRoute>
            } />
            
            <Route path="/upload/book" element={
              <ProtectedRoute>
                <BookForm/>
              </ProtectedRoute>
            } />
            
            <Route path="/book/:id" element={<BookDetailPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/discover" element={<DiscoverPage />} /> 
            <Route path="/community/bookclub" element={<BookClubsPage />} />
            <Route path="/dashboard/settings" element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/recommendations" element={
              <ProtectedRoute>
                <PersonalRecommendationPage />
              </ProtectedRoute>
            } />
            <Route path="*" element={<FeatureUnderDevelopment />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
