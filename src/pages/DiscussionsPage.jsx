import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const HamburgerIcon = ({ onClick }) => (
  <button
    onClick={onClick}
    className="p-2 rounded hover:bg-gray-100 focus:outline-none mb-4"
    aria-label="Back to groups"
  >
    {/* Simple hamburger/back icon */}
    <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gray-700">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  </button>
);

const BackToCommunity = () => (
  <Link
    to="/community/bookclub"
    className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-sm font-medium mb-6"
  >
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="inline-block">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
    Back to Community
  </Link>
);

const DiscussionsPage = () => {
  const [groups, setGroups] = useState([
    { id: 1, name: 'General Discussion', messages: [
      { id: 1, text: 'Welcome to the general group!' }
    ] },
    { id: 2, name: 'Book Lovers', messages: [
      { id: 1, text: 'What are you reading this week?' }
    ] },
  ]);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [newMessages, setNewMessages] = useState({});

  // Create a new group
  const handleCreateGroup = (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    setGroups([
      ...groups,
      { id: Date.now(), name: newGroupName.trim(), messages: [] }
    ]);
    setNewGroupName('');
  };

  // Post a message to a group
  const handlePostMessage = (groupId, e) => {
    e.preventDefault();
    const message = newMessages[groupId] || '';
    if (!message.trim()) return;
    setGroups(groups.map(group =>
      group.id === groupId
        ? { ...group, messages: [...group.messages, { id: Date.now(), text: message.trim() }] }
        : group
    ));
    setNewMessages({ ...newMessages, [groupId]: '' });
  };

  // Main group selection view
  if (selectedGroupId === null) {
    return (
      <div className="max-w-2xl mx-auto px-4 pt-16 py-8">
        <BackToCommunity />
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Discussions</h1>
        <form onSubmit={handleCreateGroup} className="flex gap-2 mb-6">
          <input
            type="text"
            value={newGroupName}
            onChange={e => setNewGroupName(e.target.value)}
            placeholder="New group name"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Create Group
          </button>
        </form>
        <div className="space-y-4">
          {groups.map(group => (
            <div key={group.id} className="border border-gray-200 rounded-lg bg-white">
              <button
                className="w-full text-left px-4 py-3 font-semibold text-gray-800 hover:bg-indigo-50 rounded-lg flex justify-between items-center"
                onClick={() => setSelectedGroupId(group.id)}
              >
                {group.name}
                <span className="text-xs text-gray-400">▶</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Focused group view
  const group = groups.find(g => g.id === selectedGroupId);
  return (
    <div className="max-w-3xl mx-auto px-2 pt-16 py-8">
      <div className="flex items-center mb-4">
        <HamburgerIcon onClick={() => setSelectedGroupId(null)} />
        <h2 className="text-xl font-bold text-gray-900 ml-2">{group?.name}</h2>
      </div>
      <BackToCommunity />
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="mb-4 space-y-2 max-h-80 overflow-y-auto">
          {group.messages.length === 0 && <div className="text-gray-400 text-sm">No messages yet.</div>}
          {group.messages.map(msg => (
            <div key={msg.id} className="text-gray-700 text-base bg-gray-50 rounded px-3 py-2">{msg.text}</div>
          ))}
        </div>
        <form onSubmit={e => handlePostMessage(group.id, e)} className="flex gap-2 mt-4">
          <input
            type="text"
            value={newMessages[group.id] || ''}
            onChange={e => setNewMessages({ ...newMessages, [group.id]: e.target.value })}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-5 py-2 rounded hover:bg-indigo-700 text-base"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default DiscussionsPage; 