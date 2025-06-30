import { useState ,useEffect} from 'react';
import axios from 'axios';
import { API_URL } from '../../../../API_URL';
import { CheckCircleIcon, XCircleIcon, EyeIcon, TrashIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { FaSyncAlt} from "react-icons/fa";


const ReviewModerationPage = () => {
  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(null);

  const handleAction = (id, action) => {
    // Replace with actual API logic
    setReviews(prev =>
      prev.map(review =>
        review.id === id ? { ...review, status: action } : review
      )
    );
  };
  
  
  const fetchReviews = async () => {
    const token = localStorage.getItem("NR_token");
    try {
      setReviewLoading(true);
      const response = await axios.get(`${API_URL}/admin/books/reviews`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReviews(response.data.reviews);
    } catch (error) {
      toast.error("Failed to fetch reviews");
      setReviews([]);
    } finally {
      setReviewLoading(false);
    }
  };

  useEffect(() => {

    fetchReviews();
  }, []);
  
  return (
    <div className="p-6 pt-16 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Moderate Reviews</h1>
      <div className="w-full flex justify-end p-2"><FaSyncAlt onClick={fetchReviews} className="w-5 h-5 " /></div>
      {reviewLoading ? <div className="flex justify-center items-center ">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div> :
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.reviewID}
              className="border p-4 rounded-lg shadow-sm bg-white flex justify-between items-start"
            >
              <div>
                <p className="text-gray-800 font-semibold">{review.user.name}</p>
                <p className="text-gray-600 text-sm mb-2">{new Date(review.updated_at).toLocaleString()}</p>
                <p className="text-gray-700">{review.comment}</p>
                <span
                  className={`mt-2 inline-block px-2 py-1 text-xs rounded ${review.status === 'approved'
                    ? 'bg-green-100 text-green-700'
                    : review.status === 'rejected'
                      ? 'bg-red-100 text-red-700'
                      : review.status === 'flagged'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                >
                  {review.status}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAction(review.id, 'approved')}
                  className="text-green-600 hover:text-green-800"
                  title="Approve"
                >
                  <CheckCircleIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleAction(review.reviewID, 'rejected')}
                  className="text-red-600 hover:text-red-800"
                  title="Reject"
                >
                  <XCircleIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => alert(`Viewing full review from ${review.user.name}`)}
                  className="text-gray-600 hover:text-gray-800"
                  title="View Details"
                >
                  <EyeIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleAction(review.reviewID, 'deleted')}
                  className="text-gray-400 hover:text-black"
                  title="Delete"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>}
    </div>
  );
};

export default ReviewModerationPage;
