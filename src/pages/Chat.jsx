import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ThumbsUp, ThumbsDown, Copy, RefreshCw } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';

const Chat = () => {
  const { messages, isLoading, sendMessage, clearChat, rateMessage } = useChat();
  const { user } = useAuth();
  const [input, setInput] = useState('');
  const [isClearing, setIsClearing] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      // Send the message to the backend via useChat context
      await sendMessage(input); // This triggers the POST request to Flask
      setInput(''); // Clear the input field after sending
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleClearChat = async () => {
    setIsClearing(true);
    await clearChat(); // Clear all chat messages
    setIsClearing(false);
  };

  const handleCopyResponse = (text) => {
    navigator.clipboard.writeText(text).then(
      () => alert('Response copied to clipboard!'),
      (err) => console.error('Failed to copy text:', err)
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  // Function to render message with markdown
  const renderMessageContent = (text) => {
    // Simple markdown-like rendering for links
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      parts.push(
        <a
          key={match.index}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          {match[1]}
        </a>
      );

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length ? parts : text;
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between mb-4 p-4 glass rounded-xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-2xl font-bold">Chat with Campus Genie</h1>
          <p className="text-muted-foreground">Ask anything about your college</p>
        </div>
        <motion.button
          onClick={handleClearChat}
          className="p-2 rounded-full hover:bg-muted transition-colors duration-200 flex items-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isClearing || messages.length === 0}
        >
          <RefreshCw size={20} className={`${isClearing ? 'animate-spin' : ''}`} />
          <span className="ml-2 hidden sm:inline">Clear Chat</span>
        </motion.button>
      </motion.div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.length === 0 ? (
          <motion.div
            className="flex flex-col items-center justify-center h-full text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="w-24 h-24 mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <div className="text-4xl">🧞</div>
            </div>
            <h2 className="text-2xl font-bold mb-2">Start a Conversation</h2>
            <p className="text-muted-foreground max-w-md">
              Ask Campus Genie anything about your college, courses, facilities, or events.
            </p>
          </motion.div>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: 20 }}
                  layout
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
                >
                  <div
                    className={`
                      max-w-[80%] rounded-2xl p-4 
                      ${message.sender === 'user'
                        ? 'bg-primary text-primary-foreground ml-auto rounded-br-sm'
                        : 'glass dark:bg-secondary/30 mr-auto rounded-bl-sm'
                      }
                    `}
                  >
                    <div className="prose dark:prose-invert">
                      {renderMessageContent(message.text)}
                    </div>

                    {message.sender === 'bot' && (
                      <div className="flex items-center justify-end mt-2 space-x-2">
                        <button
                          onClick={() => rateMessage(message.id, 'up')}
                          className={`p-1 rounded-full hover:bg-background/20 transition-colors duration-200 ${
                            message.rating === 'up' ? 'text-green-500' : ''
                          }`}
                        >
                          <ThumbsUp size={14} />
                        </button>
                        <button
                          onClick={() => rateMessage(message.id, 'down')}
                          className={`p-1 rounded-full hover:bg-background/20 transition-colors duration-200 ${
                            message.rating === 'down' ? 'text-red-500' : ''
                          }`}
                        >
                          <ThumbsDown size={14} />
                        </button>
                        <button
                          onClick={() => handleCopyResponse(message.text)}
                          className="p-1 rounded-full hover:bg-background/20 transition-colors duration-200"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <motion.div
        className="p-4 border-t border-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <form onSubmit={handleSubmit} className="relative">
          <div className="glass p-2 rounded-full flex items-center shadow-lg transition-all duration-300 hover:shadow-xl">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-transparent border-none outline-none px-4 py-2 text-foreground placeholder:text-muted-foreground"
              disabled={isLoading}
            />
            <motion.button
              type="submit"
              className="p-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!input.trim() || isLoading}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <Send size={18} />
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Chat;

// import React, { useState, useRef, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Send, ThumbsUp, ThumbsDown, Copy, RefreshCw } from 'lucide-react';

// const Chat = () => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const messagesEndRef = useRef(null);

//   // Auto-scroll to bottom when messages change
//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // Focus input on mount
//   useEffect(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.focus();
//     }
//   }, []);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!input.trim()) return;

//     // Add user message to chat history
//     const userMessage = { id: Date.now(), sender: 'user', text: input };
//     setMessages((prev) => [...prev, userMessage]);
//     setInput('');

//     // Show loading state
//     setIsLoading(true);

//     try {
//       // Send query to Flask backend
//       const response = await fetch('http://127.0.0.1:4000/chat', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ query: input }),
//       });

//       const data = await response.json();
//       const botResponse = data.response.join('\n'); // Join bullet points into a single string

//       // Add bot response to chat history
//       const botMessage = { id: Date.now() + 1, sender: 'bot', text: botResponse };
//       setMessages((prev) => [...prev, botMessage]);
//     } catch (error) {
//       console.error('Error fetching response:', error);
//       setMessages((prev) => [
//         ...prev,
//         { id: Date.now() + 1, sender: 'bot', text: 'An error occurred. Please try again.' },
//       ]);
//     } finally {
//       setIsLoading(false); // Hide loading state
//     }
//   };

//   const handleCopyResponse = (text) => {
//     navigator.clipboard.writeText(text);
//   };

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         delayChildren: 0.3,
//         staggerChildren: 0.1,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: { duration: 0.5 },
//     },
//   };

//   return (
//     <div className="min-h-[calc(100vh-4rem)] flex flex-col">
//       {/* Header */}
//       <motion.div
//         className="flex items-center justify-between mb-4 p-4 glass rounded-xl"
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         <div>
//           <h1 className="text-2xl font-bold">Chat with Campus Genie</h1>
//           <p className="text-muted-foreground">Ask anything about your college</p>
//         </div>
//       </motion.div>

//       {/* Chat Messages */}
//       <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
//         {messages.length === 0 ? (
//           <motion.div
//             className="flex flex-col items-center justify-center h-full text-center"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.5, delay: 0.3 }}
//           >
//             <div className="w-24 h-24 mb-6 rounded-full bg-primary/10 flex items-center justify-center">
//               <div className="text-4xl">🧞</div>
//             </div>
//             <h2 className="text-2xl font-bold mb-2">Start a Conversation</h2>
//             <p className="text-muted-foreground max-w-md">
//               Ask Campus Genie anything about your college, courses, facilities, or events.
//             </p>
//           </motion.div>
//         ) : (
//           <motion.div variants={containerVariants} initial="hidden" animate="visible">
//             <AnimatePresence>
//               {messages.map((message) => (
//                 <motion.div
//                   key={message.id}
//                   variants={itemVariants}
//                   initial="hidden"
//                   animate="visible"
//                   exit={{ opacity: 0, y: 20 }}
//                   layout
//                   className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
//                 >
//                   <div
//                     className={`
//                       max-w-[80%] rounded-2xl p-4 
//                       ${message.sender === 'user'
//                         ? 'bg-primary text-primary-foreground ml-auto rounded-br-sm'
//                         : 'glass dark:bg-secondary/30 mr-auto rounded-bl-sm'
//                       }
//                     `}
//                   >
//                     <div>{message.text}</div>
//                     {message.sender === 'bot' && (
//                       <div className="flex items-center justify-end mt-2 space-x-2">
//                         <button
//                           onClick={() => handleCopyResponse(message.text)}
//                           className="p-1 rounded-full hover:bg-background/20 transition-colors duration-200"
//                         >
//                           <Copy size={14} />
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 </motion.div>
//               ))}
//             </AnimatePresence>
//             <div ref={messagesEndRef} />
//           </motion.div>
//         )}
//       </div>

//       {/* Input Area */}
//       <motion.div
//         className="p-4 border-t border-border"
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         <form onSubmit={handleSubmit} className="relative">
//           <div className="glass p-2 rounded-full flex items-center shadow-lg transition-all duration-300 hover:shadow-xl">
//             <input
//               ref={messagesEndRef}
//               type="text"
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               placeholder="Type your message..."
//               className="flex-1 bg-transparent border-none outline-none px-4 py-2 text-foreground placeholder:text-muted-foreground"
//               disabled={isLoading}
//             />
//             <motion.button
//               type="submit"
//               className="p-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center"
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               disabled={!input.trim() || isLoading}
//             >
//               {isLoading ? (
//                 <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
//               ) : (
//                 <Send size={18} />
//               )}
//             </motion.button>
//           </div>
//         </form>
//       </motion.div>
//     </div>
//   );
// };

// export default Chat;