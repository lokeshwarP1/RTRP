import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Send, Info, BookOpen, Users, Award, Building, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';

const Home = () => {
  const { user } = useAuth();
  const { sendMessage } = useChat();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [isLogoRevealed, setIsLogoRevealed] = useState(false);
  const [activeTab, setActiveTab] = useState('kmit');
  const [showDemo, setShowDemo] = useState(false);
  const [demoMessages, setDemoMessages] = useState([
    { id: 1, text: "Hello! I'm KMIT Genie, your AI assistant for all questions about Keshav Memorial Institute of Technology. How can I help you today?", sender: 'bot' }
  ]);
  const [demoInput, setDemoInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    if (user) {
      sendMessage(message);
      navigate('/chat');
    } else {
      navigate('/login', { state: { message } });
    }
  };
  
  // Demo chat functionality
  const handleDemoSubmit = async (e) => {
    e.preventDefault();
    if (!demoInput.trim()) return;
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      text: demoInput,
      sender: 'user'
    };
    
    setDemoMessages(prev => [...prev, userMessage]);
    setDemoInput('');
    
    // Set loading state
    const loadingMessage = {
      id: Date.now() + 1,
      text: '...',
      sender: 'bot',
      isLoading: true
    };
    
    setDemoMessages(prev => [...prev, loadingMessage]);
    
    try {
      // Connect to the real KMIT chatbot backend
      const response = await axios.post('http://127.0.0.1:4000/api/chat', { query: demoInput });
      
      // Replace loading message with actual response
      setDemoMessages(prev => {
        const filtered = prev.filter(msg => !msg.isLoading);
        return [...filtered, {
          id: Date.now() + 2,
          text: response.data.response,
          sender: 'bot'
        }];
      });
    } catch (error) {
      console.error('Error fetching response from KMIT chatbot:', error);
      
      // Replace loading message with error message
      setDemoMessages(prev => {
        const filtered = prev.filter(msg => !msg.isLoading);
        return [...filtered, {
          id: Date.now() + 2,
          text: 'Sorry, I encountered an error while processing your request. Please try again.',
          sender: 'bot',
          isError: true
        }];
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const logoVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
        onComplete: () => setIsLogoRevealed(true)
      }
    }
  };

  const floatingElements = Array(5).fill().map((_, i) => (
    <motion.div
      key={i}
      className="absolute rounded-full bg-primary/10 dark:bg-primary/20"
      initial={{ 
        x: Math.random() * window.innerWidth, 
        y: Math.random() * window.innerHeight,
        scale: Math.random() * 0.5 + 0.5
      }}
      animate={{ 
        y: ['-20px', '20px', '-20px'],
        x: ['20px', '-20px', '20px']
      }}
      transition={{ 
        repeat: Infinity, 
        duration: Math.random() * 5 + 5,
        ease: 'easeInOut' 
      }}
      style={{ 
        width: `${Math.random() * 100 + 50}px`,
        height: `${Math.random() * 100 + 50}px`,
        filter: 'blur(40px)',
        opacity: Math.random() * 0.3 + 0.1
      }}
    />
  ));

  // Effect to scroll demo chat to bottom when messages change
  useEffect(() => {
    const demoChat = document.getElementById('demo-chat');
    if (demoChat) {
      demoChat.scrollTop = demoChat.scrollHeight;
    }
  }, [demoMessages]);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center overflow-hidden">
      {/* Floating background elements */}
      {floatingElements}
      
      <motion.div
        className="z-10 max-w-5xl w-full px-4 py-8 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo */}
        <motion.div 
          className="flex flex-col items-center mb-8"
          variants={logoVariants}
        >
          <div className="relative w-32 h-32 mb-6">
            <div className="absolute inset-0 bg-primary rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute inset-4 bg-primary rounded-full"></div>
            <div className="absolute inset-8 bg-background rounded-full flex items-center justify-center">
              <span className="text-primary font-bold text-4xl">CG</span>
            </div>
          </div>
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Campus Genie
          </motion.h1>
          <motion.p 
            className="text-xl text-muted-foreground mb-4"
            variants={itemVariants}
          >
            Your AI-powered college assistant for KMIT
          </motion.p>
          
          {/* College Tabs */}
          <motion.div className="flex space-x-2 mb-8" variants={itemVariants}>
            <button 
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeTab === 'kmit' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
              onClick={() => setActiveTab('kmit')}
            >
              KMIT
            </button>
            <button 
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeTab === 'coming' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
              onClick={() => setActiveTab('coming')}
            >
              More Colleges (Coming Soon)
            </button>
          </motion.div>
        </motion.div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Column - Chat Input and Features */}
          <motion.div variants={itemVariants} className="flex flex-col items-center">
            {/* Chat Input */}
            <motion.form 
              onSubmit={handleSubmit}
              className="w-full max-w-xl mx-auto mb-6"
              variants={itemVariants}
            >
              <div className="glass p-2 rounded-full flex items-center shadow-lg transition-all duration-300 hover:shadow-xl glow">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask me anything about KMIT..."
                  className="flex-1 bg-transparent border-none outline-none px-4 py-2 text-foreground placeholder:text-muted-foreground"
                />
                <button
                  type="submit"
                  className="p-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center"
                  disabled={!message.trim()}
                >
                  <Send size={18} />
                </button>
              </div>
            </motion.form>
            
            {/* Get Started Button */}
            <motion.div variants={itemVariants} className="mb-8">
              <Link
                to={user ? '/chat' : '/signup'}
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200 font-medium"
              >
                {user ? 'Go to Chat' : 'Get Started'}
                <ArrowRight size={18} className="ml-2" />
              </Link>
            </motion.div>
            
            {/* KMIT Info */}
            <motion.div 
              className="w-full max-w-xl glass p-6 rounded-xl mb-6"
              variants={itemVariants}
            >
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Info size={20} className="mr-2 text-primary" />
                About KMIT
              </h3>
              <p className="text-muted-foreground mb-4 text-left">
                Keshav Memorial Institute of Technology (KMIT) is a premier engineering college in Hyderabad, established in 2007.
                It is affiliated to Jawaharlal Nehru Technological University Hyderabad (JNTUH) and approved by AICTE.
              </p>
              <div className="grid grid-cols-2 gap-4 text-left">
                <div className="flex items-start">
                  <BookOpen size={16} className="mr-2 text-primary mt-1" />
                  <span>AICTE Approved</span>
                </div>
                <div className="flex items-start">
                  <Users size={16} className="mr-2 text-primary mt-1" />
                  <span>2500+ Students</span>
                </div>
                <div className="flex items-start">
                  <Award size={16} className="mr-2 text-primary mt-1" />
                  <span>NAAC 'A' Grade</span>
                </div>
                <div className="flex items-start">
                  <Building size={16} className="mr-2 text-primary mt-1" />
                  <span>Narayanguda, Hyderabad</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Right Column - Chat Demo */}
          <motion.div variants={itemVariants}>
            <div className="glass rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl">
              <div className="bg-primary/10 p-4 flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold mr-3">
                  KG
                </div>
                <div className="text-left">
                  <h3 className="font-semibold">KMIT Genie</h3>
                  <p className="text-xs text-muted-foreground">AI Assistant</p>
                </div>
                <button 
                  className="ml-auto text-xs bg-primary/20 hover:bg-primary/30 px-3 py-1 rounded-full transition-colors duration-200"
                  onClick={() => setShowDemo(!showDemo)}
                >
                  {showDemo ? 'Hide Demo' : 'Try Demo'}
                </button>
              </div>
              
              <AnimatePresence>
                {showDemo ? (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div id="demo-chat" className="h-80 overflow-y-auto p-4 flex flex-col space-y-4">
                      {demoMessages.map((msg) => (
                        <div 
                          key={msg.id} 
                          className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div 
                            className={`max-w-[80%] rounded-2xl p-3 ${msg.sender === 'user' 
                              ? 'bg-primary text-primary-foreground ml-auto rounded-br-sm' 
                              : msg.isError ? 'bg-destructive/10 text-destructive mr-auto rounded-bl-sm' 
                              : 'bg-muted mr-auto rounded-bl-sm'}`}
                          >
                            {msg.isLoading ? (
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                              </div>
                            ) : (
                              <p className="text-left text-sm">{msg.text}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <form onSubmit={handleDemoSubmit} className="p-4 border-t border-border">
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={demoInput}
                          onChange={(e) => setDemoInput(e.target.value)}
                          placeholder="Ask about KMIT..."
                          className="flex-1 bg-transparent border-none outline-none px-3 py-2 text-foreground placeholder:text-muted-foreground text-sm"
                          disabled={demoMessages.some(msg => msg.isLoading)}
                        />
                        <button
                          type="submit"
                          className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={!demoInput.trim() || demoMessages.some(msg => msg.isLoading)}
                        >
                          <Send size={16} />
                        </button>
                      </div>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-8 text-center"
                  >
                    <p className="text-muted-foreground mb-4">Click "Try Demo" to interact with the KMIT Genie chatbot.</p>
                    <div className="flex flex-col space-y-2">
                      <button 
                        className="text-sm text-left bg-muted/50 hover:bg-muted px-4 py-2 rounded-lg transition-colors duration-200"
                        onClick={() => {
                          setShowDemo(true);
                          setDemoInput("What courses does KMIT offer?");
                        }}
                      >
                        What courses does KMIT offer?
                      </button>
                      <button 
                        className="text-sm text-left bg-muted/50 hover:bg-muted px-4 py-2 rounded-lg transition-colors duration-200"
                        onClick={() => {
                          setShowDemo(true);
                          setDemoInput("Tell me about KMIT placements");
                        }}
                      >
                        Tell me about KMIT placements
                      </button>
                      <button 
                        className="text-sm text-left bg-muted/50 hover:bg-muted px-4 py-2 rounded-lg transition-colors duration-200"
                        onClick={() => {
                          setShowDemo(true);
                          setDemoInput("How is the admission process?");
                        }}
                      >
                        How is the admission process?
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Features */}
        <motion.div 
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isLogoRevealed ? "visible" : "hidden"}
        >
          {[
            {
              title: 'KMIT-Specific Knowledge',
              description: 'Get accurate information about KMIT courses, admissions, faculty, and campus life',
              icon: '🎓'
            },
            {
              title: 'Instant Answers',
              description: 'Get quick responses to all your college-related questions without waiting',
              icon: '⚡'
            },
            {
              title: 'Always Available',
              description: 'Access information 24/7, whenever you need it - your personal KMIT assistant',
              icon: '🤖'
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="p-6 rounded-xl neumorph dark:bg-secondary/20"
              variants={itemVariants}
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Events Section */}
        <motion.div 
          className="mt-16 w-full max-w-4xl mx-auto"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center justify-center">
            <Calendar size={24} className="mr-2 text-primary" />
            Upcoming KMIT Events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: 'Tech Fest 2025',
                date: 'April 15-17, 2025',
                description: 'Annual technical festival featuring coding competitions, robotics, and project exhibitions.'
              },
              {
                title: 'Placement Drive',
                date: 'May 5-10, 2025',
                description: 'Campus recruitment drive with top companies like Microsoft, Amazon, and Google.'
              },
              {
                title: 'Alumni Meet',
                date: 'June 12, 2025',
                description: 'Annual alumni gathering to connect current students with KMIT graduates.'
              },
              {
                title: 'Admissions 2025',
                date: 'July 1-15, 2025',
                description: 'Admission process for the 2025-26 academic year based on TS EAMCET ranks.'
              }
            ].map((event, index) => (
              <motion.div
                key={index}
                className="glass p-4 rounded-lg"
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <h3 className="font-semibold mb-1">{event.title}</h3>
                <p className="text-xs text-primary mb-2">{event.date}</p>
                <p className="text-sm text-muted-foreground">{event.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;
