import React, { useState } from "react";

const sampleNotifications = [
  {
    id: 1,
    title: "New Book Added",
    message: "The book 'Atomic Habits' has been added to the database.",
    date: "2023-06-15",
    status: "unread",
  },
  {
    id: 2,
    title: "User Registration",
    message: "Sarah Lee has registered as a new user.",
    date: "2023-06-10",
    status: "read",
  },
  {
    id: 3,
    title: "Review Reported",
    message: "A review by John Doe has been flagged for review.",
    date: "2023-06-08",
    status: "unread",
  },
];

const NotificationsPage = () => {
  const [selectedNotification, setSelectedNotification] = useState(null);

  const handleMarkAsRead = (notification) => {
    alert(`Marking "${notification.title}" as read...`);
  };
  const handleDeleteNotification = (notification) => {
    alert(`Deleting "${notification.title}"...`);
  };
  const handleViewMore = (notification) => {
    alert(`Viewing details for "${notification.title}"...`);
  };
  
  return (
    <div className="pt-20 pl-10 pr-10 md:px-10 lg:px-24 xl:px-32 max-w-screen-2xl mx-auto">
      <div className="flex gap-8">
        {/* Left Side: Notification List */}
        <div className="flex-1 space-y-4">
          <h2 className="text-2xl font-bold">Notifications</h2>
          <div className="bg-white rounded-xl shadow p-4 max-h-[85vh] overflow-y-auto">
            {sampleNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded cursor-pointer hover:bg-gray-100 flex flex-col space-y-1 ${selectedNotification?.id === notification.id ? "bg-blue-100" : ""}`}
                onClick={() => setSelectedNotification(notification)}
              >
                <div className="font-bold text-lg flex justify-between items-center">
                  {notification.title}
                  {notification.status === "unread" && (
                    <span className="text-xs text-white bg-red-600 rounded-full px-2">New</span>
                  )}
                </div>
                <div className="text-gray-600 text-sm">{notification.message}</div>
                <div className="text-gray-500 text-xs">{notification.date}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Notification Details */}
        <div className="w-1/3">
          {selectedNotification ? (
            <div className="bg-white rounded-xl shadow p-6 sticky top-20">
              <h2 className="text-2xl font-bold">{selectedNotification.title}</h2>
              <div className="mt-2 text-gray-600">{selectedNotification.message}</div>
              <div className="mt-1 text-gray-500 text-sm">{selectedNotification.date}</div>
              <div className="mt-6 flex flex-col space-y-3">
                {selectedNotification.status === "unread" && (
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
                    onClick={() => handleMarkAsRead(selectedNotification)}
                  >
                    Mark as Read
                  </button>
                )}
                <button
                  className="bg-gray-600 hover:bg-gray-700 text-white py-2 rounded"
                  onClick={() => handleViewMore(selectedNotification)}
                >
                  View More
                </button>
                <button
                  className="bg-red-600 hover:bg-red-700 text-white py-2 rounded"
                  onClick={() => handleDeleteNotification(selectedNotification)}
                >
                  Delete Notification
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-100 rounded-xl p-6 text-center text-gray-600">
              Click a notification from the list to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
