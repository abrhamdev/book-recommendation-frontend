/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {HeartIcon, ShareIcon, FlagIcon, BookmarkIcon, BookOpenIcon, HandThumbUpIcon, HandThumbDownIcon, ChatBubbleLeftIcon,  ArrowTopRightOnSquareIcon, LinkIcon, ChevronDownIcon,
} from "@heroicons/react/24/outline";
import {
  HeartIcon as HeartIconSolid,
  BookmarkIcon as BookmarkIconSolid,
  HandThumbUpIcon as HandThumbUpIconSolid,
  HandThumbDownIcon as HandThumbDownIconSolid,
} from "@heroicons/react/24/solid";
import { Link, useParams } from "react-router-dom";
import { API_URL } from "../../API_URL";
import axios from "axios";
import { toast } from "react-toastify";
import { FaFacebook, FaFacebookF } from "react-icons/fa";
import { X } from "lucide-react";

import ReadBook from "../components/ReadBook";

const BookDetailPage = () => {
  const [book, setBook] = useState({});
  const [reviews, setReviews] = useState([]);
  const [relatedBooks,setRelatedBooks]=useState([]);
  const [reviewLoading,setReviewLoading]=useState(false);
  const [reviewReload,setReviewReload]=useState(true);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isInReadingList, setIsInReadingList] = useState(false);
  const [reviewLikes, setReviewLikes] = useState({});
  const [showReplyForm, setShowReplyForm] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [showReportForm, setShowReportForm] = useState(null);
  const [reportReason, setReportReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);

  const { id } = useParams();

  const [reviewFormData, setReviewFormData] = useState({
    bookId: id,
    rating: 1,
    comment: "",
    visibility: "public",
  });

  const handleReviewInputChange = (e) => {
    const { name, value } = e.target;
    setReviewFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (!id) return;
    const fetchBook = async () => {
      try {
        const response = await axios.get(`${API_URL}/books/getBook/${id}`);
        setBook(response.data);
      } catch (err) {
        console.error("Error fetching book:", err);
      }
    };
    fetchBook();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewLoading(true);
        const response = await axios.get(`${API_URL}/books/reviews/${id}`);
        setReviews(response.data);
      } catch (error) {
        toast.error("Failed to fetch reviews");
        setReviews([]);
      } finally {
        setReviewLoading(false);
      }
    };

    fetchReviews();
  }, [id,reviewReload]);


  useEffect(() => {
    const fetchRelatedBooks = async () => {
      try {
        if (!book) return;
  
        let authorQuery = '';
        let genreQuery = '';
  
        if (book.author !== 'N/A') {
          authorQuery = `inauthor:${book.author.split(',')[0].trim().replace(/\s+/g, '+')}`;
        }
  
        if (book.genres !== 'N/A' && Array.isArray(book.genres)) {
          genreQuery = `subject:${book.genres[0].replace(/\s+/g, '+')}`;
        }
  
        const [authorResponse, genreResponse] = await Promise.all([
          authorQuery ? axios.get(`${API_URL}/books/relatedBooks?q=${authorQuery}`) : Promise.resolve({ data: [] }),
          genreQuery ? axios.get(`${API_URL}/books/relatedBooks?q=${genreQuery}`) : Promise.resolve({ data: [] }),
        ]);
  
        const combined = [...authorResponse.data, ...genreResponse.data];
  
        // Remove duplicates (by book id if available)
        const uniqueBooks = Array.from(new Map(combined.map(books => [books.id, books])).values());
        setRelatedBooks(uniqueBooks);
      } catch (error) {
        setRelatedBooks([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchRelatedBooks();
  }, [id,book]);

  const handleShare = () => {
    setShowShareOptions(!showShareOptions);
  };

  const handleSocialShare = (platform) => {
    const url = window.location.href;
    const title = book.title;
    const text = `Check out ${title} by ${book.author}`;

    switch (platform) {
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            url
          )}`,
          "_blank"
        );
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            text
          )}&url=${encodeURIComponent(url)}`,
          "_blank"
        );
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
        break;
    }
    setShowShareOptions(false);
  };

  const handleReport =async (type,id,e) => {
    e.preventDefault();
    
    const token = localStorage.getItem("NR_token");
    if (reportReason.trim() === "") {
      toast.warn("Please provide a reason for reporting");
      return;
    }

    if(type == "book"){
      try {
       const response= await axios.post(`${API_URL}/books/report/book`, {id, reportReason},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
        toast.success(response.data.message);
        setReportReason('');
      } catch (error) {
        toast.error(error.response?.data?.message);
      }
    }else if(type == 'review'){
      try {
        const response= await axios.post(`${API_URL}/books/report/review`, {id, reportReason},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          toast.success(response.data.message);
        setReportReason('');
      } catch (error) {
        toast.error(error.response?.data?.message);
      }
    }
    setSelectedReviewId(null);
    setReportReason("");
  };

  const handleReplySubmit =async (reviewID, e) => {
    e.preventDefault();
    const token = localStorage.getItem("NR_token");
   
    try {
     const response=await axios.post(`${API_URL}/books/review/reply`, {reviewID, replyText},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        toast.success(response.data.message);
        setReplyText("");
        setShowReplyForm(null);
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("NR_token");
      const response = await axios.post(
        `${API_URL}/books/setReview`,
        reviewFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(response.data.message);
      setShowReviewForm(false);
      setReviewFormData({
        rating: 1,
        comment: "",
        visibility: "public",
      });
    } catch (error) {
      toast.error(error.response?.data.message || error.message);
    } finally {
      setIsSubmitting(false);
      setReviewReload(!reviewReload);
    }
  };

  const handleReviewLike = async (reviewId, action) => {
    const token = localStorage.getItem("NR_token");
    try {
      const response = await axios.post(
        `${API_URL}/books/reviews/react`,
        { reviewId: reviewId, reaction:action},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error(error.response.data.message); // Show error message
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Main Content Section */}
        <div className="flex pt-20 flex-col lg:flex-row gap-4 sm:gap-8">
          {/* Left Column - Book Details and Reviews */}
          <div className="flex-1  w-full">
            {/* Book Details Section */}
            <div className="flex sm:ml-10 flex-col md:flex-row gap-4 sm:gap-6 mb-6 sm:mb-8">
              {/* Book Cover */}

              <div className="w-32 h-48 sm:w-40 sm:h-60 mx-auto md:mx-0">
                <img
                  src={book.coverImage}
                  alt={book.title || "Book cover"}
                  className="w-full h-full object-cover rounded-lg shadow-md"
                />
              </div>

              {/* Book Details */}
              <div className="flex-1 px-2 sm:pl-4">
                {book.title && (
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-800 font-handwritten">
                    {book.title}
                  </h1>
                )}

                <p className="text-base sm:text-lg text-gray-600 mb-3 sm:mb-4 font-handwritten">
                  by {book.author}
                </p>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                  {book.genres && (
                    <div>
                      <p className="text-xs text-gray-500 font-handwritten">
                        Genre
                      </p>
                      <p className="text-sm text-gray-700 font-handwritten">
                        {book.genres}
                      </p>
                    </div>
                  )}
                  {book.publisher && (
                    <div>
                      <p className="text-xs text-gray-500 font-handwritten">
                        Publisher
                      </p>
                      <p className="text-sm text-gray-700 font-handwritten">
                        {book.publisher}
                      </p>
                    </div>
                  )}
                  {book.publicationDate && (
                    <div>
                      <p className="text-xs text-gray-500 font-handwritten">
                        Published
                      </p>
                      <p className="text-sm text-gray-700 font-handwritten">
                        {book.publicationDate}
                      </p>
                    </div>
                  )}
                  {book.pageCount && (
                    <div>
                      <p className="text-xs text-gray-500 font-handwritten">
                        Pages
                      </p>
                      <p className="text-sm text-gray-700 font-handwritten">
                        {book.pageCount}
                      </p>
                    </div>
                  )}
                  {book.language && (
                    <div>
                      <p className="text-xs text-gray-500 font-handwritten">
                        Language
                      </p>
                      <p className="text-sm text-gray-700 font-handwritten">
                        {book.language}
                      </p>
                    </div>
                  )}
                  {book.rating && (
                    <div>
                      <p className="text-xs text-gray-500 font-handwritten">
                        Rating
                      </p>
                      <p className="text-sm text-gray-700 font-handwritten">
                        {book.rating}
                      </p>
                    </div>
                  )}
                </div>

                {book.description && (
                  <p dangerouslySetInnerHTML={{ __html: book.description }} className="text-sm text-gray-600 mb-3 sm:mb-4 font-handwritten"></p>
                )}

                <div className="flex flex-wrap gap-2">
                <ReadBook book={book} />
                  <button
                    onClick={() => setIsInReadingList(!isInReadingList)}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors font-medium font-handwritten flex items-center gap-1"
                  >
                    <BookOpenIcon className="h-4 w-4" />
                    {isInReadingList
                      ? "Remove from List"
                      : "Add to Reading List"}
                  </button>
                  <button
                    onClick={() => {setShowReviewForm(true);setShowReportForm(null)}}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors font-medium font-handwritten"
                  >
                    Write Review
                  </button>

                  {/* Share and Report Buttons */}
                  <div className="flex gap-2">
                    <div className="relative">
                      <button
                        onClick={handleShare}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors font-medium font-handwritten flex items-center gap-1"
                      >
                        <ShareIcon className="h-4 w-4" />
                        Share
                      </button>
                      {showShareOptions && (
                        <div className="absolute bottom-full left-0 mb-2 bg-white rounded-md shadow-lg p-2 flex gap-2">
                          <button
                            onClick={() => handleSocialShare("facebook")}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                          >
                            <FaFacebook className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleSocialShare("twitter")}
                            className="p-2 text-blue-400 hover:bg-blue-50 rounded-md"
                          >
                            <X className="h-5 w-5 text-black" />
                          </button>
                          <button
                            onClick={() => handleSocialShare("copy")}
                            className="p-2 text-gray-600 hover:bg-gray-50 rounded-md"
                          >
                            <LinkIcon className="h-5 w-5" />
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => {setShowReportForm("book");setShowReviewForm(false)}}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors font-medium font-handwritten flex items-center gap-1"
                      >
                        <FlagIcon className="h-4 w-4" />
                        Report
                      </button>
                    </div>
                  </div>
                </div>

                {/*for Review form*/}
                {showReviewForm && (
                  <motion.form
                    onSubmit={handleReviewSubmit}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.6 }}
                    className="mt-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <h3 className="text-sm font-medium text-gray-700 mb-2 font-handwritten">
                      Write a Review
                    </h3>

                    {/* Rating */}
                    <div className="mb-4">
                      <label
                        htmlFor="rating"
                        className="block text-sm text-gray-600"
                      >
                        Rating (1-5)
                      </label>
                      <input
                        type="number"
                        id="rating"
                        name="rating"
                        min="1"
                        max="5"
                        value={reviewFormData.rating}
                        onChange={handleReviewInputChange}
                        className="w-full p-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    {/* Comment */}
                    <div className="mb-4">
                      <label
                        htmlFor="comment"
                        className="block text-sm text-gray-600"
                      >
                        Comment
                      </label>
                      <textarea
                        id="comment"
                        name="comment"
                        value={reviewFormData.comment}
                        onChange={handleReviewInputChange}
                        placeholder="Write your review here..."
                        className="w-full p-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="3"
                        required
                      />
                    </div>

                    {/* Visibility */}
                    <div className="mb-4">
                      <label
                        htmlFor="visibility"
                        className="block text-sm text-gray-600"
                      >
                        Review Visibility
                      </label>
                      <select
                        id="visibility"
                        name="visibility"
                        value={reviewFormData.visibility}
                        onChange={handleReviewInputChange}
                        className="w-full p-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                      </select>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setReviewFormData({
                            rating: 1,
                            comment: "",
                            visibility: "public",
                          });
                          setShowReviewForm(false);
                        }}
                        className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Submitting..." : "Submit Review"}
                      </button>
                    </div>
                  </motion.form>
                )}
                {/* Report Form */}
                {showReportForm === "book" && (
                  <motion.form
                    onSubmit={(e) => handleReport("book",id, e)}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.6 }}
                    className="mt-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <h3 className="text-sm font-medium text-gray-700 mb-2 font-handwritten">
                      Report Book
                    </h3>
                    <textarea
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      placeholder="Please provide a reason for reporting this book..."
                      className="w-full p-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="3"
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => setShowReportForm(null)}
                        className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
                      >
                        Submit Report
                      </button>
                    </div>
                  </motion.form>
                )}
              </div>
            </div>
            {/* Reviews Section */}
            <div className="px-4 sm:pl-4 bg-amber-50 py-10">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 font-handwritten">
                Reviews
              </h2>
              {loading ? (
                <div>Loading ...</div>
              ) : reviews.length > 0 ? (
                <div className="space-y-4 sm:space-y-6">
                  {reviews.map((review) => (
                    <div key={review.reviewID} className="flex gap-3 sm:gap-4">
                      {/* User Avatar Placeholder */}
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                         {review.user?.profile_picture ? (
                             <img 
                                 src={review.user.profile_picture} 
                                 alt={review.user.name || 'User'} 
                                 className="w-full h-full object-cover"
                             />
                         ) : (
                             <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600 text-xs">
                                 {review.user?.name ? review.user.name.charAt(0).toUpperCase() : 'U'}
                             </div>
                         )}
                     </div>
                      {/* Review Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium text-gray-700 font-handwritten">
                            {review.user?.name}
                          </p>
                          <span className="text-xs text-gray-500 font-handwritten">
                            •
                          </span>
                          <p className="text-xs text-gray-500 font-handwritten">
                            {new Date(review.timestamp).toLocaleDateString()}
                          </p>
                          <div className="relative">
                            <button
                              onClick={() =>
                                setSelectedReviewId(review.reviewID)
                              }
                              className="p-1 text-gray-400 hover:text-red-500 transition-colors group"
                            >
                              <FlagIcon className="h-4 w-4" />
                              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                Report
                              </span>
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2 sm:mb-3 font-handwritten">
                          {review.comment}
                        </p>
                        <div className="flex items-center gap-3 sm:gap-4">
                          <button
                            onClick={() =>
                              handleReviewLike(review.reviewID, "like")
                            }
                            className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-500 transition-colors"
                          >
                            {reviewLikes[review.id] === "like" ? (
                              <HandThumbUpIconSolid className="h-4 w-4 text-blue-500" />
                            ) : (
                              <HandThumbUpIcon className="h-4 w-4" />
                            )}
                            <span>{review.likes}</span>
                          </button>
                          <button
                            onClick={() =>
                              handleReviewLike(review.reviewID, "dislike")
                            }
                            className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition-colors"
                          >
                            {reviewLikes[review.reviewID] === "dislike" ? (
                              <HandThumbDownIconSolid className="h-4 w-4 text-red-500" />
                            ) : (
                              <HandThumbDownIcon className="h-4 w-4" />
                            )}
                            <span>{review.dislikes}</span>
                          </button>
                          <button
                            onClick={() =>
                              setShowReplyForm(
                                showReplyForm === review.reviewID
                                  ? null
                                  : review.reviewID
                              )
                            }
                            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                          >
                            <ChatBubbleLeftIcon className="h-4 w-4" />
                            Reply
                          </button>
                        </div>

                        {/* Report Form for Review */}
                        {selectedReviewId === review.reviewID && (
                          <form
                            onSubmit={(e) =>
                              handleReport("review", review.reviewID, e)
                            }
                            className="mt-4 p-4 bg-gray-50 rounded-lg"
                          >
                            <h3 className="text-sm font-medium text-gray-700 mb-2 font-handwritten">
                              Report Review
                            </h3>
                            <textarea
                              value={reportReason}
                              onChange={(e) => setReportReason(e.target.value)}
                              placeholder="Please provide a reason for reporting this review..."
                              className="w-full p-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              rows="3"
                            />
                            <div className="flex justify-end gap-2 mt-2">
                              <button
                                type="button"
                                onClick={() => setSelectedReviewId(null)}
                                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
                              >
                                Submit Report
                              </button>
                            </div>
                          </form>
                        )}

                        {/* Reply Form */}
                        {showReplyForm === review.reviewID && (
                          <form
                            onSubmit={(e) => handleReplySubmit(review.reviewID, e)}
                            className="mt-3"
                          >
                            <textarea
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Write your reply..."
                              className="w-full p-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              rows="2"
                            />
                            <div className="flex justify-end gap-2 mt-2">
                              <button
                                type="button"
                                onClick={() => {setShowReplyForm(null); setReplyText("")}}
                                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
                              >
                                Send
                              </button>
                            </div>
                          </form>
                        )}

                        {/* Replies */}
                        {review.replies && review.replies.length > 0 && (
                          <div className="mt-4 space-y-3">
                            {review.replies.map((reply) => (
                              <div key={reply.id} className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0"></div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className="text-xs font-medium text-gray-700 font-handwritten">
                                      {reply.user}
                                    </p>
                                    <span className="text-xs text-gray-500 font-handwritten">
                                      •
                                    </span>
                                    <p className="text-xs text-gray-500 font-handwritten">
                                      {reply.date}
                                    </p>
                                  </div>
                                  <p className="text-xs text-gray-600 mt-1 font-handwritten">
                                    {reply.text}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>No Reviews Yet</div>
              )}
              <div className="flex justify-end mt-6">
                <button className="text-blue-500 hover:text-blue-600 text-sm font-medium font-handwritten flex items-center gap-1">
                  See More
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Related Books */}
          <div className="ml-auto w-full lg:w-80 mt-4 lg:mt-0">
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <h2 className="text-base sm:text-lg font-bold text-gray-800 font-handwritten">
                  Related Books
                </h2>
                <button className="text-xs sm:text-sm text-blue-500 hover:text-blue-600 font-handwritten">
                  See All
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {relatedBooks.map((book,index) => (
                  <Link to={`/book/${book.id}`}  key={`${book.id}-${index}`}>
                  <motion.div
                    
                    whileHover={{ scale: 1.02 }}
                    className="text-center cursor-pointer"
                  >
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-16 h-24 sm:w-20 sm:h-28 object-cover rounded-md mx-auto mb-1"
                    />
                    <h3 className="text-[10px] sm:text-xs text-gray-700 font-handwritten mb-0.5 line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="text-[8px] sm:text-[10px] text-gray-500 font-handwritten mb-0.5 line-clamp-1">
                      {book.author}
                    </p>
                  </motion.div>
                  </Link>
                ))}
              </div>
              <div className="mt-3 sm:mt-4 flex justify-between items-center text-xs sm:text-sm">
                <button className="text-gray-500 hover:text-gray-700 font-handwritten flex items-center gap-1">
                  <span>Filter</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 sm:h-4 sm:w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                  </svg>
                </button>
                <button className="text-gray-500 hover:text-gray-700 font-handwritten flex items-center gap-1">
                  <span>Sort</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 sm:h-4 sm:w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;
