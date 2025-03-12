"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
// import { useRouter } from 'next/navigation';
import { signIn } from "next-auth/react";
import { Github, GitlabIcon, GithubIcon } from "lucide-react";
import RobotIcon from "@/components/ui/robot.jsx";

const LandingPage: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [showAuthOptions, setShowAuthOptions] = useState(false);
  // const router = useRouter();
  
  const [isLoading, setIsLoading] = useState({
    github: false,
    gitlab: false,
    bitbucket: false,
  });
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogin = () => {
    setShowAuthOptions(true);
  };

  const handleSignUp = () => {
    setShowAuthOptions(true);
  };
  
  const handleSignIn = async (provider: "github" | "gitlab" | "bitbucket") => {
    setIsLoading((prev) => ({ ...prev, [provider]: true }));
    await signIn(provider, { callbackUrl: "/" });
  };
  
  const closeAuthOptions = () => {
    setShowAuthOptions(false);
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
            <motion.div
              className="hidden md:flex items-center gap-6 ml-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link href="/about" className="hover:text-indigo-300 transition-colors">
                About
              </Link>
            </motion.div>
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
              <RobotIcon/>
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
            <b>Build, customize, and deploy with confidence.</b> Our intelligent engine analyzes your repository, recommends optimized workflows, 
            and generates production-ready configuration files for <b>GitHub Actions, GitLab CI, or Jenkins</b> - all with just a few clicks.
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
        <div className="absolute inset-0 bg-gradient-to-b from-[#160024] to-black z-0"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.h2 
            className="text-3xl md:text-5xl font-bold text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-[#FFFFFF] to-[#ffffff]">
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
                className="bg-indigo-200 text-black text-2xl rounded-md px-4 py-1 font-medium inline-block mb-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                 Visual Workflow Builder
              </motion.div>
              <div className="bg-gray-800 rounded-lg p-6 h-full border border-gray-700 shadow-xl">
                <p className="text-gray-200 leading-relaxed">
                With its intuitive user interface, setting up automated pipelines becomes a breeze, allowing your team to focus on what they do best—building innovative solutions. The Genie automates repetitive tasks, ensuring that every code change is tested, built, and deployed efficiently and reliably. Thanks to its robust notification system, your team stays informed at every step of the delivery process.
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
                className="bg-indigo-200 text-black text-2xl rounded-md px-4 py-1 font-medium inline-block mb-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Intelligent Repository Analysis
              </motion.div>
              <div className="bg-gray-800 rounded-lg p-6 h-full border border-gray-700 shadow-xl">
                <p className="text-gray-200 leading-relaxed">
                With intelligent repository scanning, CI/CD Genie analyzes your codebase to automatically recommend the optimal workflow configuration. It detects your programming languages, dependencies, and existing CI/CD setups to suggest the most effective pipeline structure. No more guesswork—just smart, data-driven recommendations that understand your project's unique requirements and technology stack.
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
                className="bg-indigo-200 text-black text-2xl rounded-md px-4 py-1 font-medium inline-block mb-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                 Multi-Platform Generation
              </motion.div>
              <div className="bg-gray-800 rounded-lg p-6 h-full border border-gray-700 shadow-xl">
                <p className="text-gray-200 leading-relaxed">
                Generate production-ready configuration files for any major CI/CD platform with a single click. Whether you use GitHub Actions, GitLab CI, or Jenkins, CI/CD Genie speaks the native language of your chosen platform. Save configurations for later, share them with your team, or modify them as your project evolves. Seamlessly switch between platforms without rewriting your entire workflow from scratch.
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
              
              <a href="https://x.com/_AdityaSingh_9" className="text-gray-400 hover:text-indigo-300 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </a>
              <a href="https://www.linkedin.com/in/aditya-singh-dsa/" className="text-gray-400 hover:text-indigo-300 transition-colors">
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

      {/* Auth Modal */}
      {showAuthOptions && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <motion.div 
            className="absolute inset-0 bg-black opacity-70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            onClick={closeAuthOptions}
          />
          
          <motion.div 
            className="bg-gray-900 rounded-xl p-8 w-full max-w-md z-10 border border-gray-700 shadow-2xl relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <button 
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              onClick={closeAuthOptions}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            
            <div className="text-center mb-8">
              <motion.div
                className="mx-auto mb-4 w-16 h-16 flex items-center justify-center"
                animate={{
                  y: [0, -5, 0],
                  rotate: [0, 5, 0, -5, 0]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#a5b4fc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-lg">
                  <rect x="3" y="11" width="18" height="10" rx="2" />
                  <circle cx="12" cy="5" r="2" />
                  <path d="M12 7v4" />
                  <line x1="8" y1="16" x2="8" y2="16" />
                  <line x1="16" y1="16" x2="16" y2="16" />
                  <path d="M9 21v-2" />
                  <path d="M15 21v-2" />
                </svg>
              </motion.div>
              
              <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">
                Sign in to CI/CD Genie
              </h3>
              <p className="text-gray-400 mt-2">
                Choose your preferred authentication method
              </p>
            </div>
            
            <div className="space-y-4">
              {/* GitHub Button */}
              <motion.button
                className="flex items-center justify-center gap-3 bg-gray-800 text-white px-6 py-3 rounded-lg font-medium text-lg w-full border border-gray-700"
                onClick={() => handleSignIn("github")}
                disabled={isLoading.github}
                whileHover={{ scale: 1.02, backgroundColor: "#1f2937" }}
                whileTap={{ scale: 0.98 }}
              >
                <Github className="h-5 w-5" />
                {isLoading.github ? "Connecting..." : "Sign in with GitHub"}
              </motion.button>

              {/* GitLab Button */}
              <motion.button
                className="flex items-center justify-center gap-3 bg-orange-700 text-white px-6 py-3 rounded-lg font-medium text-lg w-full"
                onClick={() => handleSignIn("gitlab")}
                disabled={isLoading.gitlab}
                whileHover={{ scale: 1.02, backgroundColor: "#c2410c" }}
                whileTap={{ scale: 0.98 }}
              >
                <GitlabIcon className="h-5 w-5" />
                {isLoading.gitlab ? "Connecting..." : "Sign in with GitLab"}
              </motion.button>

              {/* Bitbucket Button */}
              <motion.button
                className="flex items-center justify-center gap-3 bg-blue-700 text-white px-6 py-3 rounded-lg font-medium text-lg w-full"
                onClick={() => handleSignIn("bitbucket")}
                disabled={isLoading.bitbucket}
                whileHover={{ scale: 1.02, backgroundColor: "#1d4ed8" }}
                whileTap={{ scale: 0.98 }}
              >
                <GithubIcon className="h-5 w-5" />
                {isLoading.bitbucket ? "Connecting..." : "Sign in with Bitbucket"}
              </motion.button>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                By signing in, you agree to our <a href="#" className="text-indigo-300 hover:text-indigo-200">Terms of Service</a> and <a href="#" className="text-indigo-300 hover:text-indigo-200">Privacy Policy</a>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;