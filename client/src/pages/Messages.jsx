import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import {
  MessageSquare,
  Send,
  Search,
  User,
  Trash2,
  ArrowLeft,
  Check,
  CheckCheck,
  Building,
  GraduationCap,
  Plus,
  X,
  ExternalLink
} from 'lucide-react';

const Messages = () => {
  const { user } = useAuth();
  const { userId: paramUserId } = useParams();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [activePartner, setActivePartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessageText, setNewMessageText] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [allAlumni, setAllAlumni] = useState([]);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [alumniSearchTerm, setAlumniSearchTerm] = useState('');

  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState('');

  const chatContainerRef = useRef(null);
  const pollingTimerRef = useRef(null);
  const wasNearBottomRef = useRef(true);
  const isInitialLoadRef = useRef(false);
  const justSentRef = useRef(false);
  const prevMessagesLengthRef = useRef(0);
  const prevLastMsgIdRef = useRef(null);

  // Scroll ONLY the chat container to bottom (never window)
  const scrollToBottom = (behavior = 'smooth') => {
    if (chatContainerRef.current) {
      const { scrollHeight, clientHeight } = chatContainerRef.current;
      chatContainerRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: behavior,
      });
    }
  };

  // Track whether user is near bottom of chat message container
  const handleChatScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      wasNearBottomRef.current = scrollHeight - scrollTop - clientHeight < 120;
    }
  };

  // Fetch conversations list
  const fetchConversations = async () => {
    try {
      const res = await API.get('/messages/conversations');
      setConversations(res.data);
    } catch (err) {
      console.error('Error fetching conversations:', err);
    } finally {
      setLoadingConversations(false);
    }
  };

  // Fetch messages with specific partner
  const fetchMessagesWithPartner = async (partnerId) => {
    if (!partnerId) return;
    try {
      const res = await API.get(`/messages/${partnerId}`);
      setActivePartner(res.data.partner);
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(err.response?.data?.message || 'Failed to load message history.');
    } finally {
      setLoadingMessages(false);
    }
  };

  // Initial load of conversations list
  useEffect(() => {
    fetchConversations();
  }, []);

  // Handle URL param user selection or active partner change
  useEffect(() => {
    if (paramUserId) {
      isInitialLoadRef.current = true;
      wasNearBottomRef.current = true;
      setLoadingMessages(true);
      fetchMessagesWithPartner(paramUserId);
    } else {
      setActivePartner(null);
      setMessages([]);
      isInitialLoadRef.current = false;
    }
  }, [paramUserId]);

  // Polling for new messages every 4 seconds if a conversation is open
  useEffect(() => {
    if (paramUserId) {
      pollingTimerRef.current = setInterval(() => {
        // Record scroll position right before polling update
        handleChatScroll();

        API.get(`/messages/${paramUserId}`)
          .then((res) => {
            const newMsgs = res.data.messages || [];
            setMessages((prev) => {
              if (
                prev.length === newMsgs.length &&
                prev[prev.length - 1]?._id === newMsgs[newMsgs.length - 1]?._id
              ) {
                return prev; // Maintain reference if no new messages
              }
              return newMsgs;
            });
            fetchConversations();
          })
          .catch((err) => console.error('Polling error:', err));
      }, 4000);
    }

    return () => {
      if (pollingTimerRef.current) {
        clearInterval(pollingTimerRef.current);
      }
    };
  }, [paramUserId]);

  // Smart auto-scroll inside container when messages update
  useEffect(() => {
    if (!paramUserId || messages.length === 0) {
      prevMessagesLengthRef.current = messages.length;
      prevLastMsgIdRef.current = null;
      return;
    }

    const lastMsg = messages[messages.length - 1];
    const lastMsgId = lastMsg?._id;
    const isNewMessageAdded =
      messages.length > prevMessagesLengthRef.current ||
      (lastMsgId && lastMsgId !== prevLastMsgIdRef.current);

    if (isInitialLoadRef.current) {
      // First time loading conversation: scroll to bottom instantly
      scrollToBottom('auto');
      isInitialLoadRef.current = false;
    } else if (justSentRef.current) {
      // User sent a message: scroll to bottom smoothly
      scrollToBottom('smooth');
      justSentRef.current = false;
    } else if (isNewMessageAdded && wasNearBottomRef.current) {
      // New message received via polling and user was already at bottom: scroll smoothly
      scrollToBottom('smooth');
    }

    prevMessagesLengthRef.current = messages.length;
    prevLastMsgIdRef.current = lastMsgId;
  }, [messages, paramUserId]);

  // Select a conversation from sidebar
  const handleSelectConversation = (partnerId) => {
    setError('');
    navigate(`/messages/${partnerId}`);
  };

  // Send a message
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!newMessageText.trim() || !paramUserId || sendingMessage) return;

    const textToSend = newMessageText.trim();
    setNewMessageText('');
    setSendingMessage(true);
    setError('');

    try {
      const res = await API.post(`/messages/${paramUserId}`, { message: textToSend });
      justSentRef.current = true;
      wasNearBottomRef.current = true;
      setMessages((prev) => [...prev, res.data]);
      fetchConversations();
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err.response?.data?.message || 'Failed to send message.');
      setNewMessageText(textToSend); // Restore text on failure
    } finally {
      setSendingMessage(false);
    }
  };

  // Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Delete message
  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await API.delete(`/messages/${messageId}`);
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
      fetchConversations();
    } catch (err) {
      console.error('Error deleting message:', err);
      alert(err.response?.data?.message || 'Failed to delete message');
    }
  };

  // Open New Chat Modal (loads alumni list)
  const handleOpenNewChatModal = async () => {
    setShowNewChatModal(true);
    try {
      const res = await API.get('/users');
      // Filter out logged-in user
      setAllAlumni(res.data.filter((u) => u._id !== user?._id));
    } catch (err) {
      console.error('Error loading alumni directory:', err);
    }
  };

  // Filter conversations by search term
  const filteredConversations = conversations.filter((c) =>
    c.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.user.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.user.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter alumni for new chat modal
  const filteredAlumni = allAlumni.filter((a) =>
    a.name.toLowerCase().includes(alumniSearchTerm.toLowerCase()) ||
    a.department?.toLowerCase().includes(alumniSearchTerm.toLowerCase()) ||
    a.company?.toLowerCase().includes(alumniSearchTerm.toLowerCase())
  );

  // Format timestamp
  const formatTime = (isoDate) => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="messages-page-container section-container">
      <div className="messages-layout-card">
        {/* LEFT SIDEBAR: Conversation List */}
        <div className={`messages-sidebar ${paramUserId ? 'mobile-hidden' : ''}`}>
          <div className="sidebar-header">
            <h2>Messages</h2>
            <button
              onClick={handleOpenNewChatModal}
              className="btn btn-primary btn-sm icon-btn"
              title="Start New Chat"
            >
              <Plus size={16} /> New Chat
            </button>
          </div>

          {/* Search Bar */}
          <div className="sidebar-search">
            <Search className="search-icon" size={16} />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="clear-btn" onClick={() => setSearchTerm('')}>
                <X size={14} />
              </button>
            )}
          </div>

          {/* Conversations List */}
          <div className="conversations-list">
            {loadingConversations ? (
              <div className="spinner-container p-4">
                <div className="spinner"></div>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="empty-sidebar text-center p-4">
                <MessageSquare size={36} className="text-muted mb-2" />
                <p className="text-muted">No conversations found.</p>
                <button onClick={handleOpenNewChatModal} className="btn btn-outline btn-sm mt-2">
                  Find Alumni to Message
                </button>
              </div>
            ) : (
              filteredConversations.map((c) => {
                const isActive = paramUserId === c.user._id;
                return (
                  <div
                    key={c.user._id}
                    className={`conversation-item ${isActive ? 'active' : ''}`}
                    onClick={() => handleSelectConversation(c.user._id)}
                  >
                    <div className="avatar-wrapper">
                      <img src={c.user.profileImage} alt={c.user.name} className="user-avatar" />
                      {c.unreadCount > 0 && (
                        <span className="unread-badge">{c.unreadCount}</span>
                      )}
                    </div>
                    <div className="conversation-info">
                      <div className="conversation-top">
                        <span className="user-name">{c.user.name}</span>
                        {c.lastMessage && (
                          <span className="message-time">
                            {formatTime(c.lastMessage.createdAt)}
                          </span>
                        )}
                      </div>
                      <div className="conversation-bottom">
                        <p className={`last-message ${c.unreadCount > 0 ? 'unread' : ''}`}>
                          {c.lastMessage
                            ? (c.lastMessage.sender === user?._id ? 'You: ' : '') + c.lastMessage.message
                            : 'No messages yet'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT MAIN CHAT AREA */}
        <div className={`chat-window ${!paramUserId ? 'mobile-hidden' : ''}`}>
          {paramUserId ? (
            <>
              {/* Chat Header */}
              <div className="chat-header">
                <button
                  className="mobile-back-btn"
                  onClick={() => navigate('/messages')}
                  title="Back to Conversations"
                >
                  <ArrowLeft size={20} />
                </button>

                {activePartner && (
                  <div className="header-partner-info">
                    <img
                      src={activePartner.profileImage}
                      alt={activePartner.name}
                      className="header-avatar"
                    />
                    <div>
                      <div className="partner-name-row">
                        <h3>{activePartner.name}</h3>
                        <Link
                          to={`/alumni/${activePartner._id}`}
                          className="profile-link-btn"
                          title="View Public Profile"
                        >
                          <ExternalLink size={14} /> Profile
                        </Link>
                      </div>
                      <p className="partner-subtext">
                        {activePartner.jobTitle && activePartner.company
                          ? `${activePartner.jobTitle} at ${activePartner.company}`
                          : `${activePartner.department} • Class of ${activePartner.graduationYear}`}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Messages Content */}
              <div
                className="chat-messages-container"
                ref={chatContainerRef}
                onScroll={handleChatScroll}
              >
                {loadingMessages ? (
                  <div className="spinner-container">
                    <div className="spinner"></div>
                    <p>Loading conversation...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="empty-messages-state">
                    <MessageSquare size={48} className="text-muted" />
                    <h4>Say hello to {activePartner?.name}! 👋</h4>
                    <p>Send a message to start connecting and networking.</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMine = (msg.sender?._id || msg.sender) === user?._id;
                    return (
                      <div
                        key={msg._id}
                        className={`message-bubble-row ${isMine ? 'mine' : 'other'}`}
                      >
                        <div className="message-bubble">
                          <p className="message-text">{msg.message}</p>
                          <div className="message-meta">
                            <span className="timestamp">{formatTime(msg.createdAt)}</span>
                            {isMine && (
                              <span className="read-status">
                                {msg.read ? (
                                  <CheckCheck size={14} className="text-read" title="Read" />
                                ) : (
                                  <Check size={14} title="Sent" />
                                )}
                              </span>
                            )}
                            {isMine && (
                              <button
                                className="delete-msg-btn"
                                onClick={() => handleDeleteMessage(msg._id)}
                                title="Delete Message"
                              >
                                <Trash2 size={12} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Error banner if any */}
              {error && (
                <div className="chat-error-banner">
                  <span>{error}</span>
                </div>
              )}

              {/* Message Input Box */}
              <form onSubmit={handleSendMessage} className="chat-input-area">
                <textarea
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Type your message to ${activePartner?.name || 'alumnus'}... (Press Enter to send)`}
                  rows={1}
                  disabled={sendingMessage}
                />
                <button
                  type="submit"
                  className="btn btn-primary icon-btn send-btn"
                  disabled={!newMessageText.trim() || sendingMessage}
                >
                  <Send size={18} />
                  <span>Send</span>
                </button>
              </form>
            </>
          ) : (
            <div className="no-chat-selected">
              <div className="empty-selection-content text-center">
                <div className="chat-icon-circle mb-3">
                  <MessageSquare size={48} />
                </div>
                <h3>Your Private Messages</h3>
                <p className="text-muted max-w-md">
                  Select an existing conversation from the left sidebar, or start a new chat with any alumnus registered on AlumniConnect.
                </p>
                <button onClick={handleOpenNewChatModal} className="btn btn-primary mt-4 icon-btn">
                  <Plus size={18} /> Start New Conversation
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* NEW CHAT MODAL */}
      {showNewChatModal && (
        <div className="modal-overlay" onClick={() => setShowNewChatModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Start a Conversation</h3>
              <button className="close-btn" onClick={() => setShowNewChatModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-search">
                <Search size={16} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search alumni by name, department, or company..."
                  value={alumniSearchTerm}
                  onChange={(e) => setAlumniSearchTerm(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="alumni-select-list">
                {filteredAlumni.length === 0 ? (
                  <p className="text-center text-muted p-4">No matching alumni found.</p>
                ) : (
                  filteredAlumni.map((alumnus) => (
                    <div
                      key={alumnus._id}
                      className="alumni-select-item"
                      onClick={() => {
                        setShowNewChatModal(false);
                        handleSelectConversation(alumnus._id);
                      }}
                    >
                      <img src={alumnus.profileImage} alt={alumnus.name} className="user-avatar" />
                      <div className="alumni-info">
                        <strong>{alumnus.name}</strong>
                        <p className="text-muted text-sm">
                          {alumnus.company ? `${alumnus.jobTitle} @ ${alumnus.company}` : `${alumnus.department}`}
                        </p>
                      </div>
                      <button className="btn btn-sm btn-outline">Message</button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
