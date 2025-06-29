import React, { useState } from "react";
import { FaEnvelopeOpen, FaEnvelope, FaTrashAlt, FaExternalLinkAlt } from "react-icons/fa";

const sampleNotification = {
  id: 1,
  title: "New Book Added",
  message: "The book 'Atomic Habits' has been added to the database.",
  date: "2023-06-15",
  status: "unread",
  link: "/books/atomic-habits",
};

const NotificationDetailPage = () => {
  const [notification, setNotification] = useState(sampleNotification);

  const handleMarkAsRead = () => {
    alert(`Marking "${notification.title}" as read...`);
    setNotification({ ...notification, status: "read" });
  };
  const handleMarkAsUnread = () => {
    alert(`Marking "${notification.title}" as unread...`);
    setNotification({ ...notification, status: "unread" });
  };
  const handleDelete = () => {
    alert(`Deleting "${notification.title}"...`);
  };
  const handleViewSource = () => {
    alert(`Viewing source for "${notification.title}"...`);
  };
  
  return (
    <div className="pt-20 pl-10 pr-10 md:px-10 lg:px-24 xl:px-32 max-w-screen-2xl mx-auto">
      <div className="bg-white rounded-xl shadow p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{notification.title}</h1>
          <span
            className={`text-sm font-bold rounded-full px-3 py-1 ${
              notification.status === "unread" ? "bg-red-600 text-white" : "bg-gray-300 text-gray-800"
            }`}
          >
            {notification.status.toUpperCase()}
          </span>
        </div>
        <div className="mt-3 text-gray-600">{notification.message}</div>
        <div className="mt-1 text-gray-500 text-sm">Date: {notification.date}</div>

        <div className="mt-8 flex flex-wrap gap-3">
          {notification.status === "unread" ? (
            <button
              onClick={handleMarkAsRead}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center gap-2"
            >
              <FaEnvelopeOpen /> Mark as Read
            </button>
          ) : (
            <button
              onClick={handleMarkAsUnread}
              className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded flex items-center gap-2"
            >
              <FaEnvelope /> Mark as Unread
            </button>
          )}
          
          <button
            onClick={handleViewSource}
            className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded flex items-center gap-2"
          >
            <FaExternalLinkAlt /> View Source
          </button>

          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded flex items-center gap-2"
          >
            <FaTrashAlt /> Delete Notification
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationDetailPage;
