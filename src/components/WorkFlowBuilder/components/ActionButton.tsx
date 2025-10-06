// components/ActionButton.tsx
import React from 'react';
import { ActionButtonProps } from '../types';

const ActionButton: React.FC<ActionButtonProps> = ({ 
  label, 
  icon, 
  onClick, 
  color = "bg-background", 
  textColor = "text-foreground", 
  borderColor = "border-border",
  hoverColor = "hover:bg-muted",
  disabled = false
}) => {
  return (
    <button
      className={`flex items-center w-full px-4 py-2 mb-2 ${color} ${textColor} border ${borderColor} rounded-md shadow-sm ${!disabled ? hoverColor : ''} focus:outline-none ${disabled ? 'cursor-not-allowed opacity-70' : ''} transition-colors`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
      {label}
    </button>
  );
};

export default ActionButton;