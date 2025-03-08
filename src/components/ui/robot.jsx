import Image from 'next/image';
import { useState } from 'react';

const RobotIcon = () => {
  const [showFallback, setShowFallback] = useState(false);
  
  return (
    <>
      {!showFallback ? (
        <Image
          src="/robot-icon.svg"
          alt="Robot Icon"
          width={96}
          height={96}
          className="mx-auto drop-shadow-lg"
          onError={() => setShowFallback(true)}
        />
      ) : (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="96" 
          height="96" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="#a5b4fc" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="mx-auto drop-shadow-lg"
        >
          <rect x="3" y="11" width="18" height="10" rx="2" />
          <circle cx="12" cy="5" r="2" />
          <path d="M12 7v4" />
          <line x1="8" y1="16" x2="8" y2="16" />
          <line x1="16" y1="16" x2="16" y2="16" />
          <path d="M9 21v-2" />
          <path d="M15 21v-2" />
        </svg>
      )}
    </>
  );
};

export default RobotIcon;