import { useState } from 'react';
import axios from "axios";
import { API_URL } from '../../../API_URL';

export default function BookForm() {
  const [loading,setLoading]=useState(false);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    publisher: '',
    language: '',
    publicationYear: '',
    genre: '',
    description: '',
    pageCount: '',
  });

  const [coverImage, setCoverImage] = useState(null);
  const [bookFile, setBookFile] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    const token = localStorage?.getItem("NR_token");
    console.log(token);
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    data.append('coverImage', coverImage);
    data.append('bookFile', bookFile);
  
    try {
       setLoading(true);
      const res=await axios.post(`${API_URL}/api/ethbooks/insertbook`, 
        data,
        {
          headers: {  
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          
        });
      alert(res.data.message);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error.response) {
        alert(error.response.data.error); 
      } else {
        console.error(error);
        alert('Something went wrong!');
      }
    }
  };

  return (
    <div className=" min-h-screen bg-gradient-to-br from-white to-gray-100 px-4 py-20">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        
        {/* Left Side: Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Add Ethiopian Book</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Title" name="title" value={formData.title} onChange={handleChange} required />
            <Input label="Author" name="author" value={formData.author} onChange={handleChange} required />
            <Input label="Publisher" name="publisher" value={formData.publisher} onChange={handleChange} required />
            <Input label="Language" name="language" value={formData.language} onChange={handleChange} required />
            <div>
              <label className="block text-sm font-medium mb-1">Publication Date</label>
              <input
                type="date"
                name="publicationYear"
                value={formData.publicationYear}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <Input label="Genre" name="genre" value={formData.genre} onChange={handleChange} required />
            <Input label="Page Count" name="pageCount" type="number" value={formData.pageCount} onChange={handleChange} required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
  {loading ? <button
            type="submit"
            className="w-full py-3 rounded-xl bg-blue-400 text-white font-semibold hover:bg-blue-700 transition"
            disabled
          >
            Loading ...
          </button> :
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Submit Book
          </button>
}
        </form>

        {/* Right Side: File Upload */}
        <div className="bg-white p-6 rounded-2xl shadow-lg space-y-6">
          <div>
            <label className="block font-medium text-sm mb-2">Cover Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverImage(e.target.files[0])}
              className="w-full file:py-2 file:px-4 file:border-0 file:bg-blue-600 file:text-white file:rounded-xl file:cursor-pointer"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-sm mb-2">Book File (PDF)</label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setBookFile(e.target.files[0])}
              className="w-full file:py-2 file:px-4 file:border-0 file:bg-green-600 file:text-white file:rounded-xl file:cursor-pointer"
              required
            />
          </div>

          <div className="text-sm text-gray-500">
            Please upload a high-quality cover image and the complete PDF book file.
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        {...props}
        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
}
