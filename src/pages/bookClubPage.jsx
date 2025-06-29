import { useState, useEffect, useRef } from "react";
import io from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { FaSpinner } from 'react-icons/fa';
import {
  UserGroupIcon,
  ChatBubbleLeftIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PlusIcon,
  UsersIcon,
  Cog6ToothIcon,
  BookOpenIcon,
  BookmarkSquareIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { API_URL, SOCKET_URL } from "../../API_URL";
import { toast } from "react-toastify";

const socket = io(SOCKET_URL, {
  auth: {
    token: localStorage.getItem('NR_token'),
  },
});

const BookClubsPage = () => {
  const { userData } = useAuth();
  const [activeTab, setActiveTab] = useState("bookClubs");
  const [selectedClub, setSelectedClub] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clubloading, setclubLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [joinedClubs, setJoinedClubs] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [members, setMembers] = useState([]);
  const [allClubs, setAllClubs] = useState([]);
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'chat'
  
  //for club setting book search for selecting current book
  const [booksearchQuery, booksetSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    coverImage: null,
    visibility: "public",
    genreFocus: "",
  });
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [isClubSettingModalOpen, setIsClubSettingModalOpen] = useState(false);
  const [activeClubSettingTab, setActiveClubSettingTab] = useState('currentBook');

  const isModerator =members.some(
    (member) => member.id === userData?.id && member.role === 'moderator'
  );
  //state for pagination
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalItems: 0,
    itemsPerPage: 10
  });
  
  //for searching book
  useEffect(() => {
  if (booksearchQuery.trim() === '') {
    setSearchResults([]);
    setPagination(prev => ({ ...prev, totalItems: 0 }));
    return;
  }

  const timeoutId = setTimeout(async () => {
    setSelectedBook(null);
    setSearchLoading(true);
    try {
       
      const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
      

      const response = await axios.get(
        `${API_URL}/books/search?q=${encodeURIComponent(booksearchQuery)}&startIndex=${startIndex}&maxResults=${pagination.itemsPerPage}`
      );
      setSearchResults(response.data.items || []);
      setPagination(prev => ({
        ...prev,
        totalItems: response.data.totalItems
      }));
    } catch (error) {
      console.error(error);
    } finally {
      setSearchLoading(false);
    }
  }, 500);

  return () => clearTimeout(timeoutId);
}, [
  booksearchQuery, 
  pagination.currentPage,
]);
  
  // selected current book
  const handleSetCurrentBook=async(book)=>{
    const token = localStorage?.getItem("NR_token");
    try{
      const response = await axios.post(`${API_URL}/community/bookclub/setcurrentbook`,{book}, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        
      });
      toast.success(response.data.message);
    }catch(error){
      toast.error(error?.response?.data.message);
    }
  }
  
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    // Fetch user's joined clubs
    fetchJoinedClubs();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (selectedClub && viewMode === "chat") {
      fetchClubMembers(selectedClub.id);
    }
  }, [selectedClub, viewMode]);

  useEffect(() => {
    // Scroll to bottom of messages
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchJoinedClubs = async () => {
    const token = localStorage?.getItem("NR_token");
    try {
      const response = await axios.post(`${API_URL}/community/bookclub/joined`,{}, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setJoinedClubs(response.data.clubs);
    } catch (err) {
      console.log(err);
    }
  };

  // for feching all clubs for testing
  useEffect(() => {
    const fetchBookClubs = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/community/bookclub/fetchclubs`
        );
        setAllClubs(response.data.clubs);
      } catch (error) {
        console.log(error);
      }
    };

    fetchBookClubs();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('NR_token');
        const response = await axios.post(
          `${API_URL}/community/bookclub/messages`,{clubId:selectedClub.id},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMessages(response.data.messages);
      } catch (error) {
        console.error('Failed to fetch messages', error);
      }
    };

    if (selectedClub?.id) {
      fetchMessages();
    }
  }, [selectedClub?.id]);

  const fetchClubMembers = async (clubId) => {
    try {
      const token = localStorage?.getItem("NR_token");
      const response = await axios.post(
        `${API_URL}/community/bookclub/members`,{clubId},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMembers(response.data.members);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch members");
    }
  };

  const handleCreateBookClub = async (e) => {
    e.preventDefault();
    const token = localStorage?.getItem("NR_token");
    try {
      setclubLoading(true);

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
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // 'Content-Type': 'multipart/form-data',
          },
        }
      );

      toast.success(response.data.message);
      setIsModalOpen(false);
      /*setFormData({
        name: '',
        description: '',
        coverImage: null,
        visibility: 'public',
        genreFocus: ''
      });*/
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setclubLoading(false);
    }
  };

  
  useEffect(() => {
    socket.emit('join_room', selectedClub?.id);

    socket.on('receive_message', (msg) => {
      console.log(msg);
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('receive_message');
    };
  }, [selectedClub?.id]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    const clubId=selectedClub.id;
    if (newMessage.trim() === '') return;
    socket.emit('send_message', { clubId, message: newMessage });
    setNewMessage('');
  };

  const handleJoinClub = async (clubId) => {
    try {
      const token = localStorage?.getItem("NR_token");
      const response = await axios.post(
        `${API_URL}/community/bookclub/join`,
        {clubId},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(response.data.message);
      fetchJoinedClubs(); // Refresh the joined clubs list
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to join club");
    }
  };

 


  const filteredClubs = allClubs.filter(
    (club) =>
      club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.currentBook?.title.toLowerCase().includes(searchQuery.toLowerCase())
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

                  <button
                    onClick={() => {
                      setActiveTab("discussions");
                      setViewMode("list");
                    }}
                    className={`flex items-center w-full p-2 rounded-md ${
                      activeTab === "discussions"
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <ChatBubbleLeftIcon className="h-5 w-5 mr-2" />
                    Discussions
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab("events");
                      setViewMode("list");
                    }}
                    className={`flex items-center w-full p-2 rounded-md ${
                      activeTab === "events"
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <CalendarIcon className="h-5 w-5 mr-2" />
                    Events
                  </button>
                </nav>
              </div>

              <div className="w-full bg-white border lg:sticky lg:top-65  border-gray-200 p-4 mt-6">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Your Clubs
                </h3>
                <div className="space-y-1">
                  {joinedClubs.length > 0 ? (
                    joinedClubs.map((club) => (
                      <button
                        key={club.id}
                        onClick={() => {
                          setSelectedClub(club);
                          setViewMode("chat");
                        }}
                        className={`flex items-center w-full p-2 rounded-md text-left ${
                          selectedClub?.id === club.id && viewMode === "chat"
                            ? "bg-indigo-50 text-indigo-600"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex-shrink-0 h-4 w-4 mr-2">
                        <img
                                    src={club.currentBook?.coverImage}
                                    alt={club.currentBook?.title}
                                    className="w-16 aspect-[2/3] object-cover rounded"
                                  />
                        </div>
                        <span className="truncate">{club.name}</span>
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 p-2">
                      You haven't joined any clubs yet
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1">
              {/* Search Bar and Add Button */}
              <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search book clubs..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <PlusIcon className="h-5 w-5" />
                  Add
                </button>
              </div>

              {/* Content Layout */}
              {isDesktop ? (
                <div className="flex gap-6">
                  {/* Middle Section - Clubs List or Chat */}
                  <div className="flex-1 max-w-[600px]">
                    {viewMode === "list" ? (
                      <div className="space-y-4">
                        {filteredClubs.map((club,index) => (
                          <div
                            key={`${club.id}-${index}`}
                            className={`bg-white p-4 rounded-lg border ${
                              selectedClub?.id === club.id
                                ? "border-indigo-500"
                                : "border-gray-200"
                            } cursor-pointer hover:shadow-md transition-shadow`}
                            onClick={() => setSelectedClub(club)}
                          >
                            <div className="flex items-start gap-4">
                              <div className="flex-shrink-0">
                                <div className="relative">
                                  <img
                                    src={club.currentBook?.coverImage}
                                    alt={club.currentBook?.title}
                                    className="w-16 aspect-[2/3] object-cover rounded"
                                  />
                                  <div className="absolute -bottom-1 -right-1 bg-indigo-500 text-white rounded-full p-1">
                                    <UserGroupIcon className="h-3 w-3" />
                                  </div>
                                </div>
                              </div>
                              <div className="min-w-0">
                                <h3 className="text-lg font-medium text-gray-900 mb-1">
                                  {club.name}
                                </h3>
                                <p className="text-sm text-gray-600 mb-2">
                                  Currently reading:{" "}
                                  <span className="text-indigo-600">
                                    {club.currentBook?.title}
                                  </span>{" "}
                                  by {club.currentBook?.author}
                                </p>
                                <p className="text-sm text-gray-600 mb-2">
                                  Genre Focus:{" "}
                                  <span className="text-indigo-600">
                                    {club.genre_focus}
                                  </span>{" "}
                                </p>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                  <span>{club.member_count} members</span>
                                  <span>•</span>
                                  <span>{club.discussions} discussions</span>
                                  <span>•</span>
                                  <span>Next: {club.nextMeeting}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      /* Chat Room */
                      <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
                      {/* Chat Header */}
                      <div className="py-1 px-4 border-b border-gray-200 flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {selectedClub?.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Currently reading: {selectedClub?.currentBook?.title}
                          </p>
                        </div>
                            {isModerator && (
                              <button
                                className="text-gray-500 hover:text-gray-700 ml-4 cursor-pointer"
                                onClick={() => setIsClubSettingModalOpen(true)}
                                aria-label="Club settings"
                              >
                                <Cog6ToothIcon className="h-6 w-6 text-gray-600" />
                              </button>)}
                      </div>

                      
                      {/* Messages Area */}
                      <div className="flex-1 p-4 min-h-80 overflow-y-auto  max-h-[430px]">
                        {messages.length > 0 ? (
                          <div className="space-y-4">
                            {messages.map((message, index) => (
                              <div key={index} className="flex items-start  gap-3">
                                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center">
                                <img
                                    className="h-5 w-5 rounded-full"
                                    src={message.user?.profile_picture || `https://ui-avatars.com/api/?name=${message.user?.name}&background=random`}
                                    alt={message.user?.name}
                                  />
                                </div>
                                <div className=''>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-gray-900">
                                      {message.user?.name} {/* Here you'd typically display the sender's name */}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {new Date(message?.timestamp).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      })}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-700 mt-1 p-4 border border-gray-200 bg-blue-300 rounded-lg">{message.message}</p>
                                </div>
                              </div>
                            ))}
                            <div ref={messagesEndRef} />
                          </div>
                        ) : (
                          <div className="h-full flex items-center justify-center text-gray-500">
                            No messages yet. Start the conversation!
                          </div>
                        )}
                      </div>
                
                      {/* Message Input */}
                      <form
                        onSubmit={handleSendMessage}
                        className="p-2 border-t border-gray-200"
                      >
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Type your message..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                          />
                          <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            Send
                          </button>
                        </div>
                      </form>
                    </div>
                    
                    )}
                  </div>
                  {isClubSettingModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                      {/* Modal Container */}
                      <div className="bg-white w-full max-w-4xl h-[500px] rounded-lg shadow-lg flex">
                        {/* Left Menu */}
                        <div className="w-1/3 border-r border-gray-200 p-4 space-y-3 bg-gray-50">
                          <h2 className="text-lg font-semibold text-gray-800 mb-4">Club Settings</h2>
                          <ul className="space-y-2 text-sm">
                            <li
                              className={`cursor-pointer p-2 rounded ${activeClubSettingTab === 'currentBook' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                              onClick={() => setActiveClubSettingTab('currentBook')}
                            >
                              <BookOpenIcon className="h-5 w-5" />
                                Current Book
                            </li>
                            <li
                              className={`cursor-pointer p-2 rounded ${activeClubSettingTab === 'nextBook' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                              onClick={() => setActiveClubSettingTab('nextBook')}
                            >
                              <BookmarkSquareIcon className="h-5 w-5" />
                                Next Book
                            </li>
                            <li
                              className={`cursor-pointer p-2 rounded ${activeClubSettingTab === 'meeting' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                              onClick={() => setActiveClubSettingTab('meeting')}
                            >
                              <CalendarIcon className="h-5 w-5" />
                                Next Meeting
                            </li>
                          </ul>
                        </div>
                  
                        {/* Right Content */}
                        <div className="flex-1 p-6 overflow-y-auto relative">
                          {/* Close Button */}
                          <button
                            onClick={() => setIsClubSettingModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
                            aria-label="Close settings"
                          >
                            &times;
                          </button>
                  
                          {activeClubSettingTab === 'currentBook' && (
                            <div>
                              <h3 className="text-lg font-medium text-gray-900 mb-4">Set Current Book</h3>
                          
                              {/* Search Input */}
                              <div className="flex gap-2 mb-4">
                                <input
                                  type="text"
                                  placeholder="Search for a book..."
                                  className="w-full border border-gray-300 rounded-md p-2"
                                  value={booksearchQuery}
                                  onChange={(e) => booksetSearchQuery(e.target.value)}
                                />
                                <button
                                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                  
                                >
                                  Search
                                </button>
                              </div>
                          
                              {/* Search Results */}
                              { searchLoading ?
                                <div className="w-full flex justify-center"><FaSpinner className="animate-spin text-4xl text-blue-600" /></div>
                                :searchResults.length > 0 && (
                                <div className="space-y-3 mb-6">
                                  <h4 className="text-sm font-semibold text-gray-800">Select a book:</h4>
                                  {searchResults.map((book, idx) => (
                                    <div
                                      key={idx}
                                      className={`flex items-center gap-4 p-2 rounded border ${
                                        selectedBook?.title === book.volumeInfo.title ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                                      } cursor-pointer hover:bg-gray-50`}
                                      onClick={() => setSelectedBook(book)}
                                    >
                                      <img src={book?.volumeInfo
.imageLinks?.thumbnail
} alt={book.title} className="w-10 h-14 object-cover rounded" />
                                      <div>
                                        <p className="text-sm font-medium text-gray-900">{book.volumeInfo.title}</p>
                                        <p className="text-sm text-gray-600">{book.volumeInfo.authors}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                          
                              {/* Selected Book Summary */}
                              {selectedBook && (
                                <div className="border-t pt-4">
                                  <h4 className="text-sm font-semibold text-gray-800 mb-2">Selected Book:</h4>
                                  <div className="flex items-center gap-3">
                                    <img src={selectedBook.volumeInfo
.imageLinks?.thumbnail} alt={selectedBook.volumeInfo.title} className="w-12 h-16 rounded object-cover" />
                                    <div>
                                      <p className="font-medium text-gray-900">{selectedBook.volumeInfo.title}</p>
                                      <p className="text-sm text-gray-600">{selectedBook.volumeInfo.authors}</p>
                                    </div>
                                  </div>
                          
                                  <button
                                    className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                    onClick={() => handleSetCurrentBook(selectedBook)}
                                  >
                                    Set as Current Book
                                  </button>
                                </div>
                              )}
                            </div>
                          )}

                  
                          {activeClubSettingTab === 'nextBook' && (
                            <div>
                              <h3 className="text-lg font-medium text-gray-900 mb-4">Next Book</h3>
                              <input
                                type="text"
                                placeholder="e.g. Brave New World by Aldous Huxley"
                                className="w-full border border-gray-300 rounded-md p-2"
                              />
                            </div>
                          )}
                  
                          {activeClubSettingTab === 'meeting' && (
                            <div>
                              <h3 className="text-lg font-medium text-gray-900 mb-4">Next Meeting</h3>
                              <input
                                type="datetime-local"
                                className="w-full border border-gray-300 rounded-md p-2"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Right Panel - Club Details or Members List */}
                  <div className="w-80 flex-shrink-0">
                    {viewMode === "list" ? (
                      selectedClub ? (
                        <div className="bg-white p-4 rounded-lg border border-gray-200 sticky top-15">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {selectedClub.name}
                          </h3>

                          <div className="flex items-center gap-2 mb-4">
                            <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                              Active
                            </span>
                            <span className="text-sm text-gray-600">
                              {selectedClub.member_count} members
                            </span>
                          </div>

                          <div className="mb-4">
                            <h4 className="font-medium text-gray-900 mb-1">
                              Currently Reading
                            </h4>
                            <div className="flex items-center gap-3">
                              <img
                                src={selectedClub.currentBook?.coverImage}
                                alt={selectedClub.currentBook?.title}
                                className="w-12 aspect-[2/3] object-cover rounded"
                              />
                              <div>
                                <p className="text-sm font-medium">
                                  {selectedClub.currentBook?.title}
                                </p>
                                <p className="text-xs text-gray-600">
                                  {selectedClub.currentBook?.author}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="mb-4">
                            <h4 className="font-medium text-gray-900 mb-1">
                              Next Meeting
                            </h4>
                            <p className="text-sm text-gray-600">
                              {selectedClub.nextMeeting}
                            </p>
                          </div>

                          <div className="mb-4">
                            <h4 className="font-medium text-gray-900 mb-1">
                              About This Club
                            </h4>
                            <p className="text-sm text-gray-600">
                              {selectedClub.description}
                            </p>
                          </div>

                          <div className="space-y-3">
                            <button
                              onClick={() => handleJoinClub(selectedClub.id)}
                              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium"
                              disabled={joinedClubs.some((c) => c.id === selectedClub.id)}
                            >
                              {joinedClubs.some((c) => c.id === selectedClub.id)
                                ? "Joined"
                                : "Join Club"}
                            </button>
                            <button
                              onClick={() => {
                                if (
                                  joinedClubs.some(
                                    (c) => c.id === selectedClub.id
                                  )
                                ) {
                                  setViewMode("chat");
                                }
                              }}
                              className="w-full border border-indigo-600 text-indigo-600 py-2 px-4 rounded-md hover:bg-indigo-50 transition-colors text-sm font-medium"
                              disabled={
                                !joinedClubs.some(
                                  (c) => c.id === selectedClub.id
                                )
                              }
                            >
                              Open Chat
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white p-4 rounded-lg border lg:sticky lg:top-17 border-gray-200 text-center">
                          <div className="text-gray-400 mb-2">
                            <UserGroupIcon className="h-10 w-10 mx-auto" />
                          </div>
                          <p className="text-gray-600">
                            Select a book club to view details
                          </p>
                        </div>
                      )
                    ) : (
                      /* Members List */
                      <div className="bg-white p-4 rounded-lg border border-gray-200 sticky top-17">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <UsersIcon className="h-5 w-5 text-gray-500" />
                          Members ({members.length})
                        </h3>

                        <div className="space-y-3">
                          {members.length > 0 ? (
                            members.map((member) => (
                              <div
                                key={member.id}
                                className="flex items-center gap-3"
                              >
                                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                  <img
                                    className="h-8 w-8 rounded-full"
                                    src={member.profile_picture || `https://ui-avatars.com/api/?name=${member.name}&background=random`}
                                    alt={member.name}
                                  />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {member.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {member.role}
                                  </p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500">
                              No members found
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Mobile Layout */
                <div className="space-y-6">
                  {/* Clubs List (Mobile) */}
                  <div className="space-y-4">
                    {filteredClubs.map((club,index) => (
                      <div
                        key={`${club.id}-${index}`}
                        className={`bg-white p-4 rounded-lg border ${
                          selectedClub?.id === club.id
                            ? "border-indigo-500"
                            : "border-gray-200"
                        } cursor-pointer hover:shadow-md transition-shadow`}
                        onClick={() => setSelectedClub(club)}
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div className="relative">
                              <img
                                src={null}
                                alt=""
                                className="w-16 aspect-[2/3] object-cover rounded"
                              />
                              <div className="absolute -bottom-1 -right-1 bg-indigo-500 text-white rounded-full p-1">
                                <UserGroupIcon className="h-3 w-3" />
                              </div>
                            </div>
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-lg font-medium text-gray-900 mb-1">
                              {club.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              Currently reading:{" "}
                              <span className="text-indigo-600">
                                {club.currentBook?.title}
                              </span>{" "}
                              by {club.currentBook?.author}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>{club.members} members</span>
                              <span>•</span>
                              <span>{club.discussions} discussions</span>
                              <span>•</span>
                              <span>Next: {club.nextMeeting}</span>
                            </div>
                          </div>
                          <div className="ml-auto">
                            {selectedClub?.id === club.id ? (
                              <ChevronUpIcon className="h-5 w-5 text-gray-400" />
                            ) : (
                              <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Club Details or Chat (Mobile - appears below when selected) */}
                  {selectedClub && viewMode === "list" && (
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {selectedClub.name}
                      </h3>

                      <div className="flex items-center gap-2 mb-4">
                        <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                          Active
                        </span>
                        <span className="text-sm text-gray-600">
                          {selectedClub.members} members
                        </span>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-1">
                          Currently Reading
                        </h4>
                        <div className="flex items-center gap-3">
                          <img
                            src={selectedClub.currentBook?.coverImage}
                            alt={selectedClub.currentBook?.title}
                            className="w-12 aspect-[2/3] object-cover rounded"
                          />
                          <div>
                            <p className="text-sm font-medium">
                              {selectedClub.currentBook?.title}
                            </p>
                            <p className="text-xs text-gray-600">
                              {selectedClub.currentBook?.author}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-1">
                          Next Meeting
                        </h4>
                        <p className="text-sm text-gray-600">
                          {selectedClub.nextMeeting}
                        </p>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-1">
                          About This Club
                        </h4>
                        <p className="text-sm text-gray-600">
                          {selectedClub.description}
                        </p>
                      </div>

                      <div className="space-y-3">
                        <button
                          onClick={() => handleJoinClub(selectedClub.id)}
                          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium"
                        >
                          {joinedClubs.some((c) => c.id === selectedClub.id)
                            ? "Joined"
                            : "Join Club"}
                        </button>
                        <button
                          onClick={() => {
                            if (
                              joinedClubs.some((c) => c.id === selectedClub.id)
                            ) {
                              setViewMode("chat");
                            }
                          }}
                          className="w-full border border-indigo-600 text-indigo-600 py-2 px-4 rounded-md hover:bg-indigo-50 transition-colors text-sm font-medium"
                          disabled={
                            !joinedClubs.some((c) => c.id === selectedClub.id)
                          }
                        >
                          Open Chat
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Chat Room (Mobile) */}
                  {selectedClub && viewMode === "chat" && (
                    <div className="bg-white rounded-lg border border-gray-200">
                      {/* Chat Header */}
                      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                        <button
                          onClick={() => setViewMode("list")}
                          className="text-indigo-600"
                        >
                          Back
                        </button>
                        <div className="text-center">
                          <h3 className="text-lg font-medium text-gray-900">
                            {selectedClub.name}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {members.length} members online
                          </p>
                        </div>
                        <div className="w-8"></div> {/* Spacer for alignment */}
                      </div>

                      {/* Messages Area */}
                      <div className="p-4 h-64 overflow-y-auto">
                        {messages.length > 0 ? (
                          <div className="space-y-4">
                            {messages.map((message, index) => (
                              <div
                                key={index}
                                className="flex items-start gap-3"
                              >
                                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                  <span className="text-xs font-medium text-indigo-600">
                                    {message.user.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-900">
                                      {message.user.name}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {new Date(
                                        message.created_at
                                      ).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-700 mt-1">
                                    {message.content}
                                  </p>
                                </div>
                              </div>
                            ))}
                            <div ref={messagesEndRef} />
                          </div>
                        ) : (
                          <div className="h-full flex items-center justify-center text-gray-500">
                            No messages yet. Start the conversation!
                          </div>
                        )}
                      </div>

                      {/* Message Input */}
                      <form
                        onSubmit={handleSendMessage}
                        className="p-4 border-t border-gray-200"
                      >
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Type your message..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                          />
                          <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            Send
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Book Club Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-[120] p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden border border-gray-300">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900">
                Create Book Club
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Start your own reading community
              </p>
            </div>

            <form onSubmit={handleCreateBookClub}>
              <div className="p-6 grid grid-cols-2 gap-x-5 space-y-4">
                {/* Name Input */}
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="name"
                  >
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    maxLength={100}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                {/* Description Input */}
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="description"
                  >
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                {/* Cover Image Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cover Image
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      className="px-3 py-1.5 text-sm bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      Choose File
                    </button>
                    <span className="text-sm text-gray-500 truncate flex-1">
                      {formData.coverImage
                        ? formData.coverImage.name
                        : "No file chosen"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setFormData({ ...formData, coverImage: file });
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Visibility Input */}
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="visibility"
                  >
                    Visibility
                  </label>
                  <select
                    id="visibility"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={formData.visibility}
                    onChange={(e) =>
                      setFormData({ ...formData, visibility: e.target.value })
                    }
                  >
                    <option value="public">Public (Anyone can join)</option>
                    <option value="private">Private (invited only)</option>
                  </select>
                </div>

                {/* Genre Focus Input */}
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="genreFocus"
                  >
                    Genre Focus <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="genreFocus"
                    required
                    maxLength={100}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={formData.genreFocus}
                    onChange={(e) =>
                      setFormData({ ...formData, genreFocus: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={clubloading}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {clubloading ? "Creating..." : "Create Book Club"}
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
