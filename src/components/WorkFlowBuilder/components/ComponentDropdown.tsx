// components/ComponentDropdown.tsx
import React, { useState, useRef, useEffect } from 'react';
import { ComponentDropdownProps } from '../types';

const ComponentDropdown: React.FC<ComponentDropdownProps> = ({ 
  title, 
  icon, 
  options, 
  onSelect 
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    };

    if (showOptions) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showOptions]);

  return (
    <div className="relative mb-3" ref={dropdownRef}>
      <button
        className="flex items-center justify-between w-full px-4 py-2 bg-card text-card-foreground border border-border rounded-md shadow-sm hover:bg-accent focus:outline-none transition-colors"
        onClick={() => setShowOptions(!showOptions)}
      >
        <div className="flex items-center">
          <span className="mr-2">
            {icon}
          </span>
          {title}
        </div>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-5 w-5 transition-transform ${showOptions ? 'transform rotate-180' : ''}`} 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
      {showOptions && (
        <div
          className="absolute z-50 w-full mt-1 rounded-md shadow-lg border border-border
                     bg-white dark:bg-gray-800"
        >
          {options.map((option) => (
            <button
              key={option}
              className="block w-full px-4 py-2 text-left text-gray-800 dark:text-gray-200
                         bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={() => {
                onSelect(option);
                setShowOptions(false);
              }}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComponentDropdown;