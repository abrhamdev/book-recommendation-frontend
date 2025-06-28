import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../../../API_URL";
import { FaEdit, FaTrash, FaPlusCircle, FaSearch } from "react-icons/fa";

// Mock data to simulate an API response. Replace this with a real API call.
const mockBooks = [
  {
    _id: "1",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Classic",
    status: "Active",
    coverImage: "https://via.placeholder.com/40x60?text=Book1",
  },
  {
    _id: "2",
    title: "1984",
    author: "George Orwell",
    genre: "Dystopian",
    status: "Active",
    coverImage: "https://via.placeholder.com/40x60?text=Book2",
  },
  {
    _id: "3",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Classic",
    status: "Inactive",
    coverImage: "https://via.placeholder.com/40x60?text=Book3",
  },
  {
    _id: "4",
    title: "Dune",
    author: "Frank Herbert",
    genre: "Sci-Fi",
    status: "Active",
    coverImage: "https://via.placeholder.com/40x60?text=Book4",
  },
    {
    _id: "5",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    genre: "Fantasy",
    status: "Pending Approval",
    coverImage: "https://via.placeholder.com/40x60?text=Book5",
  },
];

const BookManagement = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        // In a real application, you would make an API call like this:
        // const token = localStorage.getItem("NR_token");
        // const response = await axios.get(`${API_URL}/admin/books`, {
        //   headers: { Authorization: `Bearer ${token}` },
        // });
        // setBooks(response.data);

        // For demonstration, we'll use mock data with a delay.
        await new Promise(resolve => setTimeout(resolve, 500));
        setBooks(mockBooks);

      } catch (error) {
        console.error("Failed to fetch books:", error);
        setError("Failed to load book data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const handleBookDelete = (bookId) => {
    // Implement delete functionality
    console.log("Delete book with ID:", bookId);
    alert(`In a real app, this would delete book ${bookId}`);
    // Example: setBooks(books.filter(b => b._id !== bookId));
  };

  const filteredBooks = useMemo(() => {
    return books
      .filter((book) => {
        if (statusFilter === "All") return true;
        return book.status === statusFilter;
      })
      .filter((book) => {
        return (
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
  }, [books, searchTerm, statusFilter]);

  return (
    <div className="pt-20 pl-10 md:px-10 lg:px-24 xl:px-32 max-w-screen-xl mx-auto">
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Manage Books</h1>
            <p className="text-gray-600 mt-1">Add, edit, or remove books from the system.</p>
          </div>
          <Link
            to="/upload/book"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition flex items-center"
          >
            <FaPlusCircle className="mr-2" />
            Add New Book
          </Link>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white p-4 rounded-xl shadow mb-8 flex items-center justify-between">
          <div className="relative w-full max-w-xs">
            <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title or author..."
              className="pl-10 p-2 border rounded-lg w-full"
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
            />
          </div>
          <div>
            <select
              className="p-2 border rounded-lg"
              onChange={(e) => setStatusFilter(e.target.value)}
              value={statusFilter}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Pending Approval">Pending Approval</option>
            </select>
          </div>
        </div>

        {/* Books Table */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          {loading ? (
            <div className="text-center p-8">Loading books...</div>
          ) : error ? (
            <div className="text-center p-8 text-red-500">{error}</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cover</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Genre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBooks.length > 0 ? (
                  filteredBooks.map((book) => (
                    <tr key={book._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img src={book.coverImage} alt={book.title} className="w-10 h-15 object-cover rounded"/>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{book.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">{book.author}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">{book.genre}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          book.status === 'Active' ? 'bg-green-100 text-green-800' :
                          book.status === 'Inactive' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {book.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link to={`/admin/books/edit/${book._id}`} className="text-blue-600 hover:text-blue-900 mr-4">
                          <FaEdit size={18}/>
                        </Link>
                        <button onClick={() => handleBookDelete(book._id)} className="text-red-600 hover:text-red-900">
                          <FaTrash size={18}/>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-500">
                      No books found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookManagement;