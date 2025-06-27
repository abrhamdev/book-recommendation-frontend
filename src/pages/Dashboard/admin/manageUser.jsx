import React, { useState } from "react";

const sampleUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    role: "user",
    createdAt: "2023-06-15",
    status: "active",
    booksRead: 25,
    reviewsWritten: 12,
  },
  {
    id: 2,
    name: "Sarah Lee",
    email: "sarah.lee@example.com",
    role: "admin",
    createdAt: "2023-03-10",
    status: "active",
    booksRead: 102,
    reviewsWritten: 45,
  },
  {
    id: 3,
    name: "Michael Scott",
    email: "michael.scott@example.com",
    role: "user",
    createdAt: "2022-12-30",
    status: "suspended",
    booksRead: 5,
    reviewsWritten: 1,
  },
];

const ManageUsers = () => {
  const [selectedUser, setSelectedUser] = useState(null);

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
            {sampleUsers.map((user) => (
              <div
                key={user.id}
                className={`p-4 rounded cursor-pointer hover:bg-gray-100 flex flex-col space-y-1 ${selectedUser?.id === user.id ? "bg-blue-100" : ""}`}
                onClick={() => setSelectedUser(user)}
              >
                <div className="font-bold text-lg">{user.name}</div>
                <div className="text-gray-600 text-sm">{user.email}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: User Details */}
        <div className="w-1/3">
          {selectedUser ? (
            <div className="bg-white rounded-xl shadow p-6 sticky top-20">
              <h2 className="text-2xl font-bold">{selectedUser.name}</h2>
              <p className="text-gray-600">{selectedUser.email}</p>
              <div className="grid grid-cols-2 mt-4 gap-4 text-gray-700">
                <div><span className="font-semibold">Role:</span> {selectedUser.role}</div>
                <div><span className="font-semibold">Status:</span> {selectedUser.status}</div>
                <div><span className="font-semibold">Joined:</span> {selectedUser.createdAt}</div>
                <div><span className="font-semibold">Books Read:</span> {selectedUser.booksRead}</div>
                <div><span className="font-semibold">Reviews Written:</span> {selectedUser.reviewsWritten}</div>
              </div>
              <div className="mt-6 flex flex-col space-y-3">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
                  onClick={() => handleEdit(selectedUser)}
                >
                  Edit User
                </button>
                {selectedUser.status === "active" ? (
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded"
                    onClick={() => handleToggleStatus(selectedUser)}
                  >
                    Suspend User
                  </button>
                ) : (
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white py-2 rounded"
                    onClick={() => handleToggleStatus(selectedUser)}
                  >
                    Activate User
                  </button>
                )}
                <button
                  className="bg-red-600 hover:bg-red-700 text-white py-2 rounded"
                  onClick={() => handleDelete(selectedUser)}
                >
                  Delete User
                </button>
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
