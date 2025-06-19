import { useState, useEffect } from 'react';
import { 
  BookmarkIcon, 
  BookOpenIcon, 
  CheckCircleIcon, 
  XMarkIcon 
} from '@heroicons/react/24/outline';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../../API_URL';

const ReadingListActions = ({ bookId }) => {
  const [readingStatus, setReadingStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkReadingStatus = async () => {
      try {
        const token = localStorage.getItem("NR_token");
        if (!token || !bookId) return;
        
        const response = await axios.get(`${API_URL}/books/reading-list`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const allBooks = [
          ...response.data.currentlyReading,
          ...response.data.wantToRead,
          ...response.data.completed
        ];
        
        const bookInList = allBooks.find(b => b.bookId === bookId);
        setReadingStatus(bookInList?.status || null);
      } catch (error) {
        console.error("Error checking reading list:", error);
      }
    };
    
    checkReadingStatus();
  }, [bookId]);

  const handleReadingListAction = async (action) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("NR_token");
      if (!token) {
        toast.error("Please login to manage your reading list");
        return;
      }
      
      if (action === 'remove') {
        await axios.delete(`${API_URL}/books/reading-list/${bookId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReadingStatus(null);
        toast.success("Removed from reading list");
      } else {
        if (readingStatus) {
          await axios.patch(
            `${API_URL}/books/reading-list/${bookId}`,
            { status: action },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } else {
          await axios.post(
            `${API_URL}/books/reading-list`,
            { bookId, status: action },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
        setReadingStatus(action);
        toast.success(
          readingStatus 
            ? `Moved to ${action.replace(/([A-Z])/g, ' $1').toLowerCase()}`
            : "Added to reading list"
        );
      }
    } catch (error) {
      console.error("Error updating reading list:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
      } else {
        toast.error("Failed to update reading list");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {readingStatus ? (
        <div className="flex items-center rounded-md overflow-hidden border border-gray-200 divide-x divide-gray-200">
          {/* Status Tag */}
          <div className="px-3 py-1.5 bg-gray-50 text-gray-700 text-sm font-medium flex items-center gap-1">
            {readingStatus === 'wantToRead' && <BookmarkIcon className="h-4 w-4" />}
            {readingStatus === 'currentlyReading' && <BookOpenIcon className="h-4 w-4" />}
            {readingStatus === 'completed' && <CheckCircleIcon className="h-4 w-4" />}
            {readingStatus === 'wantToRead' ? 'Want to Read' : 
             readingStatus === 'currentlyReading' ? 'Currently Reading' : 'Completed'}
          </div>
          
          {/* Remove Button */}
          <button
            onClick={() => handleReadingListAction('remove')}
            disabled={isLoading}
            className="px-2 py-1.5 bg-white text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors flex items-center"
            title="Remove from list"
          >
            {isLoading ? (
              <span className="h-4 w-4 animate-spin">↻</span>
            ) : (
              <XMarkIcon className="h-4 w-4" />
            )}
          </button>
        </div>
      ) : (
        <button
          onClick={() => handleReadingListAction('wantToRead')}
          disabled={isLoading}
          className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors font-medium flex items-center gap-1"
        >
          {isLoading ? (
            <span className="h-4 w-4 animate-spin">↻</span>
          ) : (
            <>
              <BookOpenIcon className="h-4 w-4" />
              Add to Reading List
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default ReadingListActions;