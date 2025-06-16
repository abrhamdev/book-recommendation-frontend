import { Link, useNavigate } from 'react-router-dom';
import { RocketLaunchIcon, CodeBracketIcon, ClockIcon } from '@heroicons/react/24/outline';
import Navbar from '../../components/Navbar';
import DashboardSidebar from '../../components/DashboardSidebar';

const FeatureUnderDevelopment = () => {
  const navigate = useNavigate();
  
  const handleReturn = () => {
    navigate(-1, { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex">
        <DashboardSidebar />
        
        {/* Main Content */}
        <div className="flex-1 pt-20 p-6 md:pl-20">
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-white p-6 text-black">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">Under Development</h1>
                  <p className="mt-2 opacity-90">We're working hard to bring you this feature</p>
                </div>
                <RocketLaunchIcon className="h-12 w-12 opacity-90" />
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="bg-indigo-100 p-3 rounded-full">
                      <CodeBracketIcon className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">What's Being Built</h3>
                      <p className="text-gray-600">
                        Our team is currently developing an enhanced recommendation system that will 
                        suggest books tailored specifically to your reading preferences.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 mb-6">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <ClockIcon className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">Estimated Launch</h3>
                      <p className="text-gray-600">
                        We expect to release this feature by <span className="font-medium">June 29, 2025</span>.
                        Check back with us for updates.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Progress Bar - Fixed */}
              <div className="mt-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Development Progress</span>
                  <span>50%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-black h-2.5 rounded-full" 
                    style={{ width: '50%' }}
                  ></div>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <p className="text-sm text-gray-600">
                  Have questions? <Link to="/aboutus" className="text-indigo-600 hover:underline">Contact us</Link>
                </p>
                <button 
                  onClick={handleReturn}
                  className="mt-3 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Return to Previous Page
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureUnderDevelopment;