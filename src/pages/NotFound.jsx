import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
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

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <motion.div 
        className="text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="mb-8"
          variants={itemVariants}
        >
          <div className="text-9xl font-bold text-primary">404</div>
          <h1 className="text-4xl font-bold mt-4">Page Not Found</h1>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </motion.div>
        
        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          variants={itemVariants}
        >
          <Link 
            to="/"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200 w-full sm:w-auto"
          >
            <Home size={18} />
            Go Home
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-border hover:bg-muted transition-colors duration-200 w-full sm:w-auto"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </motion.div>
        
        <motion.div 
          className="mt-12"
          variants={itemVariants}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl opacity-30 rounded-full"></div>
            <div className="relative glass p-8 rounded-2xl">
              <h2 className="text-xl font-bold mb-2">Lost?</h2>
              <p className="text-muted-foreground mb-4">
                Let Campus Genie guide you to what you're looking for.
              </p>
              <Link 
                to="/chat"
                className="inline-block px-6 py-2 rounded-lg bg-secondary/10 hover:bg-secondary/20 transition-colors duration-200"
              >
                Chat with Genie
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
