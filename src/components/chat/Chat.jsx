import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Smile, Image, Paperclip, Mic, Bot } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import ChatHistory from './ChatHistory';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingAnimation from './LoadingAnimation';

const Chat = () => {
  const [newMessage, setNewMessage] = useState('');
  const [historyVisible, setHistoryVisible] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const messagesEndRef = useRef(null);
  const { messages, isLoading, sendMessage } = useChat();
  const { user } = useAuth();
  const inputRef = useRef(null);

  useEffect(() => {
    // Check if we should show chat history on mount
    const shouldShowHistory = localStorage.getItem('showChatHistory') === 'true';
    if (shouldShowHistory) {
      setHistoryVisible(true);
      localStorage.removeItem('showChatHistory'); // Clear the flag
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    if (messages.length > 0) {
      setShowWelcome(false);
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isLoading) return;
    const message = newMessage.trim();
    setNewMessage('');
    setIsLoading(true);

    try {
      await sendMessage(message);
    } catch (error) {
      console.error('Error:', error);
      setNewMessage('Sorry, there was an error processing your request.');
    } finally {
      setIsLoading(false);
    }
  };

  const WelcomeMessage = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center h-full text-center p-8"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
        className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6"
      >
        <Bot className="w-8 h-8 text-primary" />
      </motion.div>
      <h1 className="text-2xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
        Welcome to Campus Genie
      </h1>
      <p className="text-muted-foreground mb-6 max-w-md">
        I'm here to help you with anything related to campus life. Feel free to ask me anything!
      </p>
      <div className="grid grid-cols-2 gap-4 max-w-lg w-full">
        {["What's my attendance?", "Show my timetable", "Tell me about KMIT", "How can you help me?"].map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => {
              setNewMessage(suggestion);
              inputRef.current?.focus();
            }}
            className="p-3 text-sm text-left rounded-xl border border-border/50 bg-background/50 hover:bg-primary/5 backdrop-blur-sm transition-colors"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </motion.div>
  );

  const MessageBubble = ({ message, isLast }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4 group`}
    >
      {message.sender !== 'user' && (
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2 mt-1">
          <Bot className="w-4 h-4 text-primary" />
        </div>
      )}
      <div
        className={`relative max-w-[80%] rounded-2xl p-4 ${
          message.sender === 'user'
            ? 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground ml-4'
            : 'bg-secondary/5 hover:bg-secondary/10 backdrop-blur-sm border border-border/50 text-foreground mr-4'
        } shadow-lg transition-all duration-200 hover:shadow-xl`}
      >
        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">{message.text}</p>
        <div className={`mt-1 text-xs opacity-0 group-hover:opacity-70 transition-opacity flex items-center gap-2 ${
          message.sender === 'user' ? 'justify-end' : 'justify-start'
        }`}>
          {new Date(message.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
          {isLast && message.sender === 'user' && (
            <span className="flex items-center">
              {isLoading ? (
                <LoadingAnimation />
              ) : (
                "✓✓"
              )}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="relative flex h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
      <ChatHistory
        userId={user?._id}
        visible={historyVisible}
        onToggle={() => setHistoryVisible(!historyVisible)}
        onSelect={(chat) => setNewMessage(chat.query)}
      />
      
      <div className="flex-1 flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-primary/10 scrollbar-track-transparent hover:scrollbar-thumb-primary/20">
          <AnimatePresence>
            {showWelcome && messages.length === 0 ? (
              <WelcomeMessage />
            ) : (
              messages.map((message, index) => (
                <MessageBubble
                  key={message.id || index}
                  message={message}
                  isLast={index === messages.length - 1}
                />
              ))
            )}
          </AnimatePresence>
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-secondary/5 backdrop-blur-sm border border-border/50 rounded-2xl p-3 flex items-center">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <motion.form
          initial={false}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.2 }}
          onSubmit={handleSubmit}
          className="p-4 border-t border-border bg-background/80 backdrop-blur-md"
        >
          <div className="flex items-center gap-2">
            <div className="flex-1 glass rounded-xl p-2 flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-transparent border-none outline-none px-2 text-foreground placeholder:text-muted-foreground"
                disabled={isLoading}
              />
              <div className="flex items-center gap-1">
                <button type="button" className="p-2 rounded-full hover:bg-background/20 transition-colors">
                  <Smile className="w-5 h-5" />
                </button>
                <button type="button" className="p-2 rounded-full hover:bg-background/20 transition-colors">
                  <Image className="w-5 h-5" />
                </button>
                <button type="button" className="p-2 rounded-full hover:bg-background/20 transition-colors">
                  <Paperclip className="w-5 h-5" />
                </button>
                <button type="button" className="p-2 rounded-full hover:bg-background/20 transition-colors">
                  <Mic className="w-5 h-5" />
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={!newMessage.trim() || isLoading}
              className="inline-flex items-center justify-center rounded-xl px-4 py-2 font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg active:scale-95"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default Chat; 