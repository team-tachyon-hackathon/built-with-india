"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// import { useInView } from 'framer-motion';

const LandingPage: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogin = () => {
    if (isMounted) {
      router.push('/login');
    }
  };

  const handleSignUp = () => {
    if (isMounted) {
      router.push('/signup');
    }
  };

  return (
    <div className="bg-black text-white font-sans">
      {/* Hero Section */}
      <div className="relative min-h-screen">
        {/* Animated Background Elements */}
        <div 
          className="absolute inset-0 z-0" 
          style={{
            background: 'linear-gradient(135deg, #120338 0%, #000000 100%)',
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 92%)',
          }}
        />
        <motion.div 
          className="absolute inset-0 z-0 opacity-40" 
          style={{
            background: '#220338',
            clipPath: 'polygon(100% 60%, 0% 100%, 100% 100%)',
          }}
          animate={{ 
            clipPath: ['polygon(100% 60%, 0% 100%, 100% 100%)', 'polygon(100% 65%, 5% 100%, 100% 100%)', 'polygon(100% 60%, 0% 100%, 100% 100%)'] 
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            repeatType: "reverse" 
          }}
        />
        
        {/* Floating particles */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-indigo-500 opacity-20"
              style={{
                width: Math.random() * 6 + 2,
                height: Math.random() * 6 + 2,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, Math.random() * 30 - 15],
                x: [0, Math.random() * 30 - 15],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>

        {/* Navbar */}
        <nav className="relative z-10 flex justify-between items-center py-4 px-6 md:px-12">
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="text-xl md:text-2xl font-bold">
              CI/CD Genie
            </Link>
          </motion.div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <motion.button
                className="text-lg px-2 py-1 flex items-center gap-1"
                onClick={() => setShowDropdown(!showDropdown)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                About
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </motion.button>
              
              {showDropdown && (
                <motion.div 
                  className="absolute top-full right-0 bg-gray-900 rounded-md shadow-lg py-2 w-40 z-50"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link href="/about" className="block px-4 py-2 hover:bg-indigo-900 transition-colors">
                    Company
                  </Link>
                  <Link href="/services" className="block px-4 py-2 hover:bg-indigo-900 transition-colors">
                    Services
                  </Link>
                  <Link href="/team" className="block px-4 py-2 hover:bg-indigo-900 transition-colors">
                    Team
                  </Link>
                </motion.div>
              )}
            </div>

            <motion.div
              className="hidden md:flex items-center gap-6 ml-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link href="/" className="hover:text-indigo-300 transition-colors">
                Home
              </Link>
              <Link href="/doc" className="hover:text-indigo-300 transition-colors">
                Doc
              </Link>
            </motion.div>

            <motion.button
              className="ml-6 bg-indigo-200 text-indigo-900 px-5 py-2 rounded-full font-medium"
              onClick={handleLogin}
              whileHover={{ scale: 1.05, backgroundColor: '#c7d2fe' }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Login
            </motion.button>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center h-[calc(100vh-80px)] max-h-[900px] min-h-[500px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-8"
          >
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, 0, -5, 0]
              }}
              transition={{ 
                duration: 5, 
                repeat: Infinity, 
                repeatType: "reverse" 
              }}
            >
              <img 
                src="/robot-icon.svg" 
                alt="Robot Icon" 
                className="w-24 h-24 mx-auto drop-shadow-lg"
                onError={(e) => {
                  // Fallback to inline SVG if external SVG fails to load
                  const target = e.target as HTMLImageElement;
                  target.outerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="#a5b4fc" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="drop-shadow-lg">
                      <rect x="3" y="11" width="18" height="10" rx="2" />
                      <circle cx="12" cy="5" r="2" />
                      <path d="M12 7v4" />
                      <line x1="8" y1="16" x2="8" y2="16" />
                      <line x1="16" y1="16" x2="16" y2="16" />
                      <path d="M9 21v-2" />
                      <path d="M15 21v-2" />
                    </svg>
                  `;
                }}
              />
            </motion.div>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6 font-sans tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Welcome to CI/CD Genie.
          </motion.h1>

          <motion.p
            className="text-lg max-w-3xl mx-auto text-gray-300 mb-10 leading-relaxed font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna
            aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            <motion.button
              className="bg-indigo-200 text-indigo-900 px-8 py-3 rounded-full font-medium text-lg"
              onClick={handleSignUp}
              whileHover={{ scale: 1.05, backgroundColor: '#c7d2fe' }}
              whileTap={{ scale: 0.95 }}
            >
              Sign Up
            </motion.button>
            
            <motion.button
              className="bg-transparent border-2 border-white px-8 py-3 rounded-full font-medium text-lg"
              onClick={handleLogin}
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
              whileTap={{ scale: 0.95 }}
            >
              Login
            </motion.button>
          </motion.div>
        </div>

        {/* Arrow indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10"
          animate={{ y: [0, 10, 0] }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="40" 
            height="40" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="opacity-70"
          >
            <path d="M7 13l5 5 5-5M7 6l5 5 5-5"/>
          </svg>
        </motion.div>
      </div>
      
      {/* Features Section - with distinct visual separation */}
      <section className="relative py-24 px-6">
        {/* Features background */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black z-0"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.h2 
            className="text-3xl md:text-5xl font-bold text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-indigo-500">
              Our Features
            </span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div 
              className="relative h-full"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <motion.div 
                className="bg-indigo-200 text-indigo-900 rounded-md px-4 py-1 text-sm font-medium inline-block mb-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                LorenIpsum
              </motion.div>
              <div className="bg-gray-800 rounded-lg p-6 h-full border border-gray-700 shadow-xl">
                <p className="text-gray-200 leading-relaxed">
                  With its intuitive user interface, setting up automated pipelines becomes a breeze, allowing your team to focus on what they do best—building innovative solutions. The Genie automates repetitive tasks, ensuring that every code change is tested, built, and deployed efficiently and reliably. Thanks to its robust notification system,
                </p>
              </div>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              className="relative h-full"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.div 
                className="bg-indigo-200 text-indigo-900 rounded-md px-4 py-1 text-sm font-medium inline-block mb-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                LorenIpsum
              </motion.div>
              <div className="bg-gray-800 rounded-lg p-6 h-full border border-gray-700 shadow-xl">
                <p className="text-gray-200 leading-relaxed">
                  With its intuitive user interface, setting up automated pipelines becomes a breeze, allowing your team to focus on what they do best—building innovative solutions. The Genie automates repetitive tasks, ensuring that every code change is tested, built, and deployed efficiently and reliably. Thanks to its robust notification system,
                </p>
              </div>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              className="relative h-full"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <motion.div 
                className="bg-indigo-200 text-indigo-900 rounded-md px-4 py-1 text-sm font-medium inline-block mb-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                LorenIpsum
              </motion.div>
              <div className="bg-gray-800 rounded-lg p-6 h-full border border-gray-700 shadow-xl">
                <p className="text-gray-200 leading-relaxed">
                  With its intuitive user interface, setting up automated pipelines becomes a breeze, allowing your team to focus on what they do best—building innovative solutions. The Genie automates repetitive tasks, ensuring that every code change is tested, built, and deployed efficiently and reliably. Thanks to its robust notification system,
                </p>
              </div>
            </motion.div>
          </div>
          
          {/* Integration Section */}
          <motion.div 
            className="mt-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <motion.h3
              className="text-2xl md:text-3xl font-bold text-center mb-8"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Supports Your Favorite Platforms
            </motion.h3>
            
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              {/* GitHub */}
              <motion.div
                className="flex flex-col items-center"
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="bg-gray-800 p-6 rounded-full mb-4 shadow-lg border border-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                </div>
                <span className="text-lg font-medium">GitHub</span>
              </motion.div>
              
              {/* GitLab */}
              <motion.div
                className="flex flex-col items-center"
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="bg-gray-800 p-6 rounded-full mb-4 shadow-lg border border-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0 1 18.6 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.51L23 13.45a.84.84 0 0 1-.35.94z"></path>
                  </svg>
                </div>
                <span className="text-lg font-medium">GitLab</span>
              </motion.div>
              
              {/* Bitbucket */}
              <motion.div
                className="flex flex-col items-center"
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="bg-gray-800 p-6 rounded-full mb-4 shadow-lg border border-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5.9 20.5H18.1c.8 0 1.5-.7 1.5-1.5l1.4-8.1c.1-.6-.2-1.2-.8-1.4-1.4-.5-2.9-.7-4.5-.7-3.2 0-6.3 1.3-8.5 3.5l-2.7 2.7c-.5.5-.5 1.4 0 1.9l.1.1c.2.2.4.3.7.3h1.5c.3 0 .6-.1.8-.3l3.2-3.2c.3-.3.7-.5 1.1-.5.8 0 1.5.7 1.5 1.5v4.7"></path>
                    <path d="M12.8 21.5h-6c-.4 0-.8-.4-.8-.8v-7.4c0-.4.4-.8.8-.8h5.3c.5 0 1 .2 1.3.6l1.1 1.1c.4.4.6.9.6 1.4v5.1c0 .4-.4.8-.8.8z"></path>
                  </svg>
                </div>
                <span className="text-lg font-medium">Bitbucket</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-8 bg-gray-900 border-t border-gray-800">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#a5b4fc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="10" rx="2" />
                <circle cx="12" cy="5" r="2" />
                <path d="M12 7v4" />
                <line x1="8" y1="16" x2="8" y2="16" />
                <line x1="16" y1="16" x2="16" y2="16" />
                <path d="M9 21v-2" />
                <path d="M15 21v-2" />
              </svg>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-gray-400 text-sm md:text-base"
            >
              CI/CD Genie by Team Tachyon
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 flex space-x-4"
            >
              <a href="#" className="text-gray-400 hover:text-indigo-300 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-300 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-300 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 text-xs text-gray-500"
            >
              © {new Date().getFullYear()} Team Tachyon. All rights reserved.
            </motion.div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;