import { useState, useEffect, useRef } from "react";
import io from 'socket.io-client';
import {
  UserGroupIcon,
  ChatBubbleLeftIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PlusIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { API_URL, SOCKET_URL } from "../../API_URL";
import { toast } from "react-toastify";
import EventsPage from './EventsPage';
import { Link } from "react-router-dom";

const socket = io(SOCKET_URL, {
  auth: {
    token: localStorage.getItem('NR_token'),
  },
});

const BookClubsPage = () => {
  const [activeTab, setActiveTab] = useState("bookClubs");
  const [selectedClub, setSelectedClub] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [joinedClubs, setJoinedClubs] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [members, setMembers] = useState([]);
  const [allClubs, setAllClubs] = useState([]);
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'chat'
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    coverImage: null,
    visibility: "public",
    genreFocus: "",
  });
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    // Fetch user's joined clubs and all clubs
    fetchJoinedClubs();
    fetchBookClubs();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (selectedClub && viewMode === "chat") {
      fetchClubMembers(selectedClub.id);
      fetchMessages(selectedClub.id);
    }
  }, [selectedClub, viewMode]);

  useEffect(() => {
    // Scroll to bottom of messages
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchJoinedClubs = async () => {
    const token = localStorage?.getItem("NR_token");
    if (!token) return;
    
    try {
      const response = await axios.post(
        `${API_URL}/community/bookclub/joined`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setJoinedClubs(response.data.clubs);
    } catch (err) {
      console.error("Error fetching joined clubs:", err);
      toast.error("Failed to fetch joined clubs");
    }
  };

  const fetchBookClubs = async () => {
    try {
      const response = await axios.get(`${API_URL}/community/bookclub/fetchclubs`);
      setAllClubs(response.data.clubs);
    } catch (error) {
      console.error("Error fetching book clubs:", error);
      toast.error("Failed to fetch book clubs");
    }
  };

  const fetchMessages = async (clubId) => {
    try {
      const token = localStorage.getItem('NR_token');
      const response = await axios.post(
        `${API_URL}/community/bookclub/messages`,
        { clubId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      toast.error("Failed to fetch messages");
    }
  };

  const fetchClubMembers = async (clubId) => {
    try {
      const token = localStorage?.getItem("NR_token");
      const response = await axios.post(
        `${API_URL}/community/bookclub/members`,
        { clubId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMembers(response.data.members);
    } catch (err) {
      console.error("Error fetching club members:", err);
      toast.error("Failed to fetch club members");
    }
  };

  const handleCreateBookClub = async (e) => {
    e.preventDefault();
    const token = localStorage?.getItem("NR_token");
    if (!token) {
      toast.error("Please login to create a book club");
      return;
    }

    try {
      setLoading(true);

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("visibility", formData.visibility);
      formDataToSend.append("genre_focus", formData.genreFocus);

      if (formData.coverImage) {
        formDataToSend.append("cover_image", formData.coverImage);
      }

      const response = await axios.post(
        `${API_URL}/community/bookclub/create`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      toast.success(response.data.message);
      setIsModalOpen(false);
      setFormData({
        name: '',
        description: '',
        coverImage: null,
        visibility: 'public',
        genreFocus: ''
      });
      
      // Refresh the clubs list
      fetchBookClubs();
      fetchJoinedClubs();
    } catch (err) {
      console.error("Error creating book club:", err);
      toast.error(err.response?.data?.message || "Failed to create book club");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClub = async (clubId) => {
    const token = localStorage?.getItem("NR_token");
    if (!token) {
      toast.error("Please login to join a book club");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/community/bookclub/join`,
        { clubId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(response.data.message);
      fetchJoinedClubs(); // Refresh the joined clubs list
      fetchBookClubs(); // Refresh all clubs list
    } catch (err) {
      console.error("Error joining club:", err);
      toast.error(err.response?.data?.message || "Failed to join club");
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!selectedClub?.id) return;
    if (newMessage.trim() === '') return;

    const token = localStorage.getItem('NR_token');
    if (!token) {
      toast.error("Please login to send messages");
      return;
    }

    socket.emit('send_message', { 
      clubId: selectedClub.id, 
      message: newMessage,
      token 
    });
    setNewMessage('');
  };

  // Socket connection and message handling
  useEffect(() => {
    if (selectedClub?.id) {
      socket.emit('join_room', selectedClub.id);

      socket.on('receive_message', (msg) => {
        setMessages((prev) => [...prev, msg]);
      });

      return () => {
        socket.off('receive_message');
      };
    }
  }, [selectedClub?.id]);

  const filteredClubs = allClubs.filter(
    (club) =>
      club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.genreFocus?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isDesktop = windowWidth >= 1024;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-16 pb-8">
        <div className="sm:max-w-6xl max-w-80 mx-auto pl-6 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Sidebar */}
            <div className="w-full lg:w-56 space-y-2 flex-shrink-0">
              <div className="bg-white p-4 rounded-lg border border-gray-200 lg:sticky lg:top-17">
                <nav className="space-y-1">
                  <button
                    onClick={() => {
                      setActiveTab("bookClubs");
                      setViewMode("list");
                    }}
                    className={`flex items-center w-full p-2 rounded-md ${
                      activeTab === "bookClubs"
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <UserGroupIcon className="h-5 w-5 mr-2" />
                    Book Clubs
                  </button>

                  <Link
                    to="/community/discussions"
                    className={`flex items-center w-full p-2 rounded-md ${
                      window.location.pathname === "/community/discussions"
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <ChatBubbleLeftIcon className="h-5 w-5 mr-2" />
                    Discussions
                  </Link>

                  <Link
                    to="/community/events"
                    className={`flex items-center w-full p-2 rounded-md ${
                      window.location.pathname === "/community/events"
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <CalendarIcon className="h-5 w-5 mr-2" />
                    Events
                  </Link>
                </nav>
              </div>

              {/* Your Clubs Section */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Your Clubs</h3>
                <div className="space-y-2">
                  {joinedClubs.map((club) => (
                    <button
                      key={club.id}
                      onClick={() => {
                        setSelectedClub(club);
                        setViewMode("chat");
                      }}
                      className={`w-full text-left p-2 rounded-md text-sm ${
                        selectedClub?.id === club.id
                          ? "bg-indigo-50 text-indigo-600"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {club.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {activeTab === "bookClubs" && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Book Clubs</h2>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2"
                    >
                      <PlusIcon className="h-5 w-5" />
                      Create Club
                    </button>
                  </div>

                  {/* Search Bar */}
                  <div className="mb-6">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search clubs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  {/* Clubs Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredClubs.map((club) => (
                      <div
                        key={club.id}
                        className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                          <img
                            src={club.coverImage || "/default-club-cover.jpg"}
                            alt={club.name}
                            className="object-cover w-full h-48"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {club.name}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4">
                            {club.description}
                          </p>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">
                              {club.members?.length || 0} members
                            </span>
                            <button
                              onClick={() => handleJoinClub(club.id)}
                              className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-100 transition-colors"
                            >
                              Join Club
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "discussions" && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Discussions</h2>
                  <p className="text-gray-500">Discussions feature coming soon!</p>
                </div>
              )}

              {activeTab === "events" && <EventsPage />}
            </div>
          </div>
        </div>
      </div>

      {/* Create Club Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Create Book Club</h2>
            <form onSubmit={handleCreateBookClub}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Club Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    rows="3"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Genre Focus
                  </label>
                  <input
                    type="text"
                    value={formData.genreFocus}
                    onChange={(e) =>
                      setFormData({ ...formData, genreFocus: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Visibility
                  </label>
                  <select
                    value={formData.visibility}
                    onChange={(e) =>
                      setFormData({ ...formData, visibility: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cover Image
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) =>
                      setFormData({ ...formData, coverImage: e.target.files[0] })
                    }
                    className="w-full"
                    accept="image/*"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create Club"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookClubsPage;
