// components/DiagramCanvas.tsx
import React from 'react';
import { DiagramCanvasProps } from '../types';

const DiagramCanvas: React.FC<DiagramCanvasProps> = () => {
  return (
    <div id="myDiagramDiv" className="w-full h-screen border border-gray-200"></div>
  );
};

export default DiagramCanvas;