import React, { useState,useEffect } from "react";
import axios from 'axios';
import { API_URL } from "../../../../API_URL";
import {FaSpinner} from 'react-icons/fa';

const ManageUsers = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(null);
  
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("NR_token");
        const response = await axios.get(`${API_URL}/admin/fetchusers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data.users);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);
  
  const handleEdit = (user) => {
    alert(`Edit user ${user.name}`);
  };
  const handleToggleStatus = (user) => {
    alert(`${user.status === "active" ? "Suspend" : "Activate"} ${user.name}`);
  };
  const handleDelete = (user) => {
    alert(`Delete ${user.name}`);
  };
  
  return (
    <div className="pt-20 pl-10 pr-10 md:px-10 lg:px-24 xl:px-32 max-w-screen-2xl mx-auto">
      <div className="flex gap-8">
        {/* Left Side: User List */}
        
          <div className="flex-1 space-y-4">
            <h2 className="text-2xl font-bold">All Users</h2>
            <div className="bg-white rounded-xl shadow p-4 max-h-[85vh] overflow-y-auto">
              {loading ?  <div className="w-full flex justify-center" ><FaSpinner className="animate-spin text-4xl text-blue-600" /></div> :users?.map((user) => (
                <div
                  key={user.id}
                  className={`p-4 rounded cursor-pointer hover:bg-gray-100 flex flex-col ${selectedUser?.id === user.id ? "bg-blue-100" : ""}`}
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="flex justify-between items-start">
                    <div className="font-bold text-lg">{user?.name}</div>
                    <div className="text-sm text-gray-500">{user?.role}</div>
                  </div>
                  <div className="text-gray-600 text-sm">{user?.email}</div>
                </div>
              ))}
            </div>
          </div>

        {/* Right Side: User Details */}
        <div className="w-1/3">
          {selectedUser ? (
            <div className="bg-white rounded-xl shadow p-6 sticky top-20 space-y-4">
              {/* Profile Image */}
              {selectedUser.profile_picture && (
                <img
                  src={selectedUser.profile_picture}
                  alt={selectedUser.name}
                  className="w-24 h-24 rounded-full mx-auto object-cover"
                />
              )}
        
              {/* Name and Email */}
              <div className="text-center">
                <h2 className="text-2xl font-bold">{selectedUser.name}</h2>
                <p className="text-gray-600">{selectedUser.email}</p>
              </div>
        
              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4 text-gray-700">
                <div>
                  <span className="font-semibold">Role:</span> {selectedUser.role}
                </div>
                <div>
                  <span className="font-semibold">Status:</span> {selectedUser.status || 'N/A'}
                </div>
                <div>
                  <span className="font-semibold">Joined:</span>{' '}
                  {new Date(selectedUser.created_at).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-semibold">Books Read:</span> {selectedUser.booksRead ?? 0}
                </div>
                <div>
                  <span className="font-semibold">Reviews Written:</span> {selectedUser.reviewsWritten ?? 0}
                </div>
                <div>
                  <span className="font-semibold">Auth Provider:</span> {selectedUser.auth_provider}
                </div>
              </div>
        
              {/* Action Buttons */}
              <div className="mt-6 space-y-4">
                {/* Main Actions */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm font-semibold transition"
                    onClick={() => handleEdit(selectedUser)}
                  >
                    Edit
                  </button>
              
                  <button
                    className={`${
                      selectedUser.status === 'active'
                        ? 'bg-yellow-500 hover:bg-yellow-600'
                        : 'bg-green-600 hover:bg-green-700'
                    } text-white py-2 rounded-md text-sm font-semibold transition`}
                    onClick={() => handleToggleStatus(selectedUser)}
                  >
                    {selectedUser.status === 'active' ? 'Suspend' : 'Activate'}
                  </button>
                </div>
              
                {/* Danger Zone */}
                <div>
                  <button
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md text-sm font-semibold transition"
                    onClick={() => handleDelete(selectedUser)}
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-gray-100 rounded-xl p-6 text-center text-gray-600">
              Click a user from the list to view details
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ManageUsers;
