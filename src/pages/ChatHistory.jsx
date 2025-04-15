import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Search, Globe, Info, FileText, 
  ChevronRight, Clock, User, Bot 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ChatHistoryPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSession, setSelectedSession] = useState(null);

  const fetchSessions = async () => {
    if (!user?._id) {
      setError('Please log in to view chat history');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`http://127.0.0.1:4000/api/chat/history/${user._id}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch chat sessions');
      }
      
      // Transform the data to match our UI needs
      const transformedData = Array.isArray(data) ? data.map(chat => ({
        _id: chat._id,
        id: chat._id.slice(-6),
        title: chat.query.slice(0, 50) + (chat.query.length > 50 ? '...' : ''),
        timestamp: chat.timestamp,
        messages: [
          {
            role: 'user',
            content: chat.query,
            timestamp: chat.timestamp
          },
          {
            role: 'assistant',
            content: chat.response,
            timestamp: chat.timestamp
          }
        ]
      })) : [];
      
      setSessions(transformedData);
      if (transformedData.length > 0) setSelectedSession(transformedData[0]);
    } catch (err) {
      setError(err.message);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [user]);

  const filteredSessions = sessions.filter(session => 
    session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.messages.some(msg => 
      msg.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="h-screen flex bg-background">
      {/* Left Sidebar */}
      <div className="w-80 border-r border-border bg-card/50 flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent chats</h2>
            <span className="text-sm text-muted-foreground">{sessions.length}</span>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-background/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="p-4 text-sm text-red-500">{error}</div>
          ) : (
            <AnimatePresence>
              {filteredSessions.map((session) => (
                <motion.div
                  key={session._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`p-4 border-b border-border cursor-pointer transition-colors ${
                    selectedSession?._id === session._id ? 'bg-primary/5' : 'hover:bg-secondary/5'
                  }`}
                  onClick={() => setSelectedSession(session)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <MessageSquare size={16} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium truncate">
                          #{session.id}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(session.timestamp), 'MMM d')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock size={12} />
                        <span>{format(new Date(session.timestamp), 'h:mm a')}</span>
                        <span className="mx-1">•</span>
                        <span>{session.messages.length} messages</span>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-muted-foreground" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {selectedSession ? (
          <>
            <div className="border-b border-border p-4 bg-card/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h1 className="text-xl font-semibold">
                    #{selectedSession.id}
                  </h1>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(selectedSession.timestamp), 'MMM d, yyyy')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-secondary/10 rounded-full transition-colors">
                    <Info size={20} className="text-muted-foreground" />
                  </button>
                  <button className="p-2 hover:bg-secondary/10 rounded-full transition-colors">
                    <FileText size={20} className="text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-3xl mx-auto space-y-4">
                {selectedSession.messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div className={`flex gap-3 max-w-[80%] ${
                      message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}>
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        {message.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                      </div>
                      <div className={`rounded-lg p-3 ${
                        message.role === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-secondary/10 text-foreground'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <span className="text-xs opacity-70 mt-1 block">
                          {format(new Date(message.timestamp), 'h:mm a')}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">Select a conversation to view messages</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHistoryPage; 