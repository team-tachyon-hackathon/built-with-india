"use client"
import * as go from 'gojs';
import { useEffect, useRef, useState } from 'react';

export function WorkflowBuilder(){
  const diagramRef = useRef<go.Diagram | null>(null);
  const [showBuildOptions, setShowBuildOptions] = useState(false);
  const [showTestOptions, setShowTestOptions] = useState(false);
  const [showDeployOptions, setShowDeployOptions] = useState(false);

  const buildOptions = [
    'Docker Build',
    'NPM Build',
    'Maven Build',
    'Gradle Build',
    'Make Build'
  ];

  const testOptions = [
    'Unit Tests',
    'Integration Tests',
    'E2E Tests',
    'Performance Tests',
    'Security Tests'
  ];

  const deployOptions = [
    'Docker Deploy',
    'Kubernetes Deploy',
    'AWS Deploy',
    'Azure Deploy',
    'GCP Deploy'
  ];

  useEffect(() => {
    // Clean up any existing diagram to prevent duplicates
    if (diagramRef.current) {
      diagramRef.current.div = null;
    }

    // Wait for the DOM to be ready
    if (!document.getElementById('myDiagramDiv')) return;

    const $ = go.GraphObject.make;

    // Create a new diagram
    const diagram = $(go.Diagram, 'myDiagramDiv', {
      // Basic configuration
      'undoManager.isEnabled': true,
      
      // Enable tools explicitly
      'linkingTool.isEnabled': true,
      'linkingTool.direction': go.LinkingTool.ForwardsOnly,
      'draggingTool.isEnabled': true, // Explicitly enable dragging
      
      // Allow operations
      allowMove: true, // Essential for dragging
      allowDelete: true,
      allowDrop: true,
      
      // Appearance
      initialContentAlignment: go.Spot.Center,
      padding: 10,
      
      // Layout
      layout: $(go.ForceDirectedLayout, {
        defaultSpringLength: 50,
        defaultElectricalCharge: 100
      })
    });

    // Create node template with explicit dragging support
    diagram.nodeTemplate = $(
      go.Node, 
      'Auto',
      { 
        // Enable dragging for this node explicitly
        movable: true,
        selectable: true,
        resizable: false,
        
        // Cursor and position
        cursor: 'move',
        locationSpot: go.Spot.Center,
        
        // Add some shadow for better visual feedback
        shadowVisible: true,
      },
      // Node appearance - customize based on node type
      $(go.Shape, 'RoundedRectangle', 
        {
          strokeWidth: 2,
          stroke: 'gray',
          fill: "white",
          portId: "",
        },
        new go.Binding("fill", "key", (k) => {
          if (k.includes('Build')) return "#E1F5FE";  // Light blue
          if (k.includes('Test')) return "#E8F5E9";   // Light green
          if (k.includes('Deploy')) return "#FFF3E0"; // Light orange
          return "white";
        }),
        new go.Binding("stroke", "key", (k) => {
          if (k.includes('Build')) return "#039BE5";  // Blue
          if (k.includes('Test')) return "#43A047";   // Green
          if (k.includes('Deploy')) return "#FB8C00"; // Orange
          return "gray";
        })
      ),
      $(go.TextBlock, 
        { 
          margin: 10,
          font: '14px Inter, system-ui, sans-serif',
          editable: false
        }, 
        new go.Binding('text', 'key')
      ),
      
      // Input port - on the left
      $(go.Panel, "Auto",
        { 
          alignment: new go.Spot(0, 0.5, -8, 0),
          portId: "input",
          fromLinkable: false,
          toLinkable: true,
          toSpot: go.Spot.Left,
          cursor: "pointer"
        },
        $(go.Shape, "Circle", {
          width: 14,
          height: 14,
          fill: "#6FCF97",  // Green for input
          stroke: "#27AE60",
          strokeWidth: 1,
          toolTip: $(go.Adornment, "Auto",
            $(go.Shape, { fill: "#FFFFCC" }),
            $(go.TextBlock, { margin: 4, text: "Input connection" })
          )
        })
      ),
      
      // Output port - on the right
      $(go.Panel, "Auto",
        {
          alignment: new go.Spot(1, 0.5, 8, 0),
          portId: "output",
          fromLinkable: true,
          toLinkable: false,
          fromSpot: go.Spot.Right,
          cursor: "pointer"
        },
        $(go.Shape, "Circle", {
          width: 14,
          height: 14,
          fill: "#41adff",  // Blue for output
          stroke: "#1E75BB",
          strokeWidth: 1,
          toolTip: $(go.Adornment, "Auto",
            $(go.Shape, { fill: "#FFFFCC" }),
            $(go.TextBlock, { margin: 4, text: "Output connection" })
          )
        })
      )
    );

    // Link template
    diagram.linkTemplate = $(
      go.Link,
      { 
        routing: go.Link.AvoidsNodes,
        curve: go.Link.JumpOver,
        corner: 5,
        relinkableFrom: true, 
        relinkableTo: true,
        reshapable: true,
        resegmentable: true
      },
      $(go.Shape, { 
        strokeWidth: 2,
        stroke: '#2E86C1'
      }),
      $(go.Shape, { 
        toArrow: 'Standard',
        stroke: '#2E86C1',
        fill: '#2E86C1'
      })
    );

    // Initialize a GraphLinksModel
    const model = new go.GraphLinksModel([], []);
    model.linkKeyProperty = 'id'; // important for clear operations
    diagram.model = model;

    // Setup keyboard commands
    diagram.commandHandler.archetypeGroupData = { key: "Group", isGroup: true };
    
    // Enable delete key to remove selected elements
    diagram.commandHandler.doKeyDown = function() {
      const e = diagram.lastInput;
      if (e.key === "Delete" || e.key === "Backspace") {
        this.deleteSelection();
        return true;
      }
      return go.CommandHandler.prototype.doKeyDown.call(this);
    };

    // Save the reference
    diagramRef.current = diagram;

    // Clean up function
    return () => {
      if (diagramRef.current) {
        diagramRef.current.div = null;
      }
    };
  }, []);

  const addNode = (key: string) => {
    if (!diagramRef.current) return;

    const diagram = diagramRef.current;
    
    // Start transaction
    diagram.startTransaction('add node');
    
    // Add the node with a unique position
    const model = diagram.model;
    model.addNodeData({ 
      key: key,
      // We add a location property for positioning
      loc: `${100 + Math.random() * 200} ${100 + Math.random() * 100}`
    });
    
    // Commit transaction
    diagram.commitTransaction('add node');
  };

  const deleteSelection = () => {
    if (!diagramRef.current) return;

    const diagram = diagramRef.current;
    diagram.startTransaction('delete selection');
    diagram.commandHandler.deleteSelection();
    diagram.commitTransaction('delete selection');
  };

  const clearDiagram = () => {
    if (!diagramRef.current) return;

    const diagram = diagramRef.current;
    
    // We can't replace the model during a transaction, so we:
    // 1. First end any current transaction
    diagram.commitTransaction("end current transaction");
    
    // 2. Then replace the model without using a transaction
    diagram.model = new go.GraphLinksModel([], []);
  };

  return (
    <div className="flex flex-col">
      <div className="flex">
        <div className="w-1/4 p-4 bg-gray-50 border-r border-gray-200">
          <h3 className="text-lg font-bold mb-4 text-gray-700">CI/CD Components</h3>
          
          {/* Build Dropdown */}
          <div className="relative mb-3">
            <button
              className="flex items-center justify-between w-full px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
              onClick={() => setShowBuildOptions(!showBuildOptions)}
            >
              <div className="flex items-center">
                <span className="mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8l4-2 4 2V6z" clipRule="evenodd" />
                  </svg>
                </span>
                Build
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${showBuildOptions ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            {showBuildOptions && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                {buildOptions.map((option) => (
                  <button
                    key={option}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                    onClick={() => {
                      addNode(option);
                      setShowBuildOptions(false);
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Test Dropdown */}
          <div className="relative mb-3">
            <button
              className="flex items-center justify-between w-full px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
              onClick={() => setShowTestOptions(!showTestOptions)}
            >
              <div className="flex items-center">
                <span className="mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </span>
                Test
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${showTestOptions ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            {showTestOptions && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                {testOptions.map((option) => (
                  <button
                    key={option}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                    onClick={() => {
                      addNode(option);
                      setShowTestOptions(false);
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Deploy Dropdown */}
          <div className="relative mb-3">
            <button
              className="flex items-center justify-between w-full px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
              onClick={() => setShowDeployOptions(!showDeployOptions)}
            >
              <div className="flex items-center">
                <span className="mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
                Deploy
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${showDeployOptions ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            {showDeployOptions && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                {deployOptions.map((option) => (
                  <button
                    key={option}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                    onClick={() => {
                      addNode(option);
                      setShowDeployOptions(false);
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-bold mb-3 text-gray-700">Actions</h3>
            <button
              className="flex items-center w-full px-4 py-2 mb-2 bg-white text-red-600 border border-red-300 rounded-md shadow-sm hover:bg-red-50 focus:outline-none"
              onClick={deleteSelection}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Delete Selected
            </button>
            <button
              className="flex items-center w-full px-4 py-2 bg-white text-gray-600 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
              onClick={clearDiagram}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Clear All
            </button>
          </div>
          
          <div className="mt-6 p-3 bg-blue-50 rounded-md border border-blue-100">
            <h4 className="text-sm font-bold text-blue-800 mb-1">Tips</h4>
            <p className="text-xs text-blue-700">
              • Drag nodes by clicking and holding the main area.<br/>
              • Create connections by dragging from the blue output port to the green input port of another node.<br/>
              • Select elements by clicking on them before deleting.
            </p>
          </div>
        </div>
        <div className="w-3/4">
          <div id="myDiagramDiv" className="w-full h-screen border border-gray-200"></div>
        </div>
      </div>
    </div>
  );
};


// "use client"

// import React, { useState, useEffect, useRef, useCallback } from 'react';

// // Define types for our elements and connections
// interface Position {
//   x: number;
//   y: number;
// }

// interface Size {
//   width: number;
//   height: number;
// }

// interface Element {
//   id: string;
//   type: 'rectangle' | 'diamond' | 'ellipse' | 'text';
//   position: Position;
//   size: Size;
//   text: string;
//   color: string;
//   isSelected: boolean;
//   zIndex: number;
// }

// interface Connection {
//   id: string;
//   from: string;
//   to: string;
//   points?: Position[];
//   isSelected: boolean;
//   fromPoint?: Position;
//   toPoint?: Position;
// }

// interface ResizeHandle {
//   position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
//   cursor: string;
// }

// // Main WorkflowEditor component
// export function WorkflowEditor() {
//   // State for elements, connections, and UI state
//   const [elements, setElements] = useState<Element[]>([]);
//   const [connections, setConnections] = useState<Connection[]>([]);
//   const [selectedElementIds, setSelectedElementIds] = useState<Set<string>>(new Set());
//   const [draggedElement, setDraggedElement] = useState<string | null>(null);
//   const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
//   const [isResizing, setIsResizing] = useState<boolean>(false);
//   const [resizeElement, setResizeElement] = useState<string | null>(null);
//   const [resizeHandle, setResizeHandle] = useState<string | null>(null);
//   const [resizeStartPosition, setResizeStartPosition] = useState<Position>({ x: 0, y: 0 });
//   const [resizeStartSize, setResizeStartSize] = useState<Size>({ width: 0, height: 0 });
//   const [connecting, setConnecting] = useState<boolean>(false);
//   const [connectionStart, setConnectionStart] = useState<string | null>(null);
//   const [mousePosition, setMousePosition] = useState<Position>({ x: 0, y: 0 });
//   const [isDraggingCanvas, setIsDraggingCanvas] = useState<boolean>(false);
//   const [canvasOffset, setCanvasOffset] = useState<Position>({ x: 0, y: 0 });
//   const [dragStartPosition, setDragStartPosition] = useState<Position>({ x: 0, y: 0 });
//   const [zoom, setZoom] = useState<number>(1);
//   const [contextMenu, setContextMenu] = useState<{ show: boolean; x: number; y: number }>({ show: false, x: 0, y: 0 });
//   const [history, setHistory] = useState<{ elements: Element[]; connections: Connection[] }[]>([]);
//   const [historyIndex, setHistoryIndex] = useState<number>(-1);
//   const [selectedTool, setSelectedTool] = useState<string>('select');
//   const [gridSize, setGridSize] = useState<number>(1);
//   const [showGrid, setShowGrid] = useState<boolean>(true);
//   const [canvasColor, setCanvasColor] = useState<string>('#f5f5f5');
  
//   const containerRef = useRef<HTMLDivElement>(null);
//   const nextElementIdRef = useRef(1);
//   const nextConnectionIdRef = useRef(1);
  
//   // Resize handles configuration
//   const resizeHandles: ResizeHandle[] = [
//     { position: 'top-left', cursor: 'nwse-resize' },
//     { position: 'top-right', cursor: 'nesw-resize' },
//     { position: 'bottom-left', cursor: 'nesw-resize' },
//     { position: 'bottom-right', cursor: 'nwse-resize' },
//   ];

//   // History management
//   const saveToHistory = useCallback(() => {
//     const newHistory = history.slice(0, historyIndex + 1);
//     newHistory.push({
//       elements: JSON.parse(JSON.stringify(elements)),
//       connections: JSON.parse(JSON.stringify(connections)),
//     });
    
//     // Limit history to 50 states to prevent memory issues
//     if (newHistory.length > 50) {
//       newHistory.shift();
//     }
    
//     setHistory(newHistory);
//     setHistoryIndex(newHistory.length - 1);
//   }, [elements, connections, history, historyIndex]);

//   // Undo/Redo functions
//   const undo = useCallback(() => {
//     if (historyIndex > 0) {
//       const newIndex = historyIndex - 1;
//       const previousState = history[newIndex];
//       setElements(previousState.elements);
//       setConnections(previousState.connections);
//       setHistoryIndex(newIndex);
//     }
//   }, [history, historyIndex]);

//   const redo = useCallback(() => {
//     if (historyIndex < history.length - 1) {
//       const newIndex = historyIndex + 1;
//       const nextState = history[newIndex];
//       setElements(nextState.elements);
//       setConnections(nextState.connections);
//       setHistoryIndex(newIndex);
//     }
//   }, [history, historyIndex]);

//   // Initialize history with empty state
//   useEffect(() => {
//     setHistory([{ elements: [], connections: [] }]);
//     setHistoryIndex(0);
//   }, []);

//   // Handle keyboard shortcuts
//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       // Undo/Redo
//       if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
//         e.preventDefault();
//         undo();
//       }
//       if ((e.metaKey || e.ctrlKey) && e.key === 'y' || ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'z')) {
//         e.preventDefault();
//         redo();
//       }
      
//       // Delete selected elements
//       if (e.key === 'Delete' || e.key === 'Backspace') {
//         if (selectedElementIds.size > 0) {
//           deleteSelectedElements();
//         }
//       }
      
//       // Escape to cancel connecting or reset selection
//       if (e.key === 'Escape') {
//         if (connecting) {
//           setConnecting(false);
//           setConnectionStart(null);
//         } else {
//           setSelectedElementIds(new Set());
//         }
//       }

//       // Change tool with keyboard shortcuts
//       if (e.key === 's') setSelectedTool('select');
//       if (e.key === 'r') setSelectedTool('rectangle');
//       if (e.key === 'd') setSelectedTool('diamond');
//       if (e.key === 'e') setSelectedTool('ellipse');
//       if (e.key === 't') setSelectedTool('text');
//       if (e.key === 'c') setSelectedTool('connect');
//     };

//     window.addEventListener('keydown', handleKeyDown);
//     return (
//       <div className="flex bg-white border-b border-gray-200 p-2 space-x-2">
//         {tools.map(tool => (
//           <button
//             key={tool.id}
//             className={`p-2 rounded hover:bg-gray-100 ${selectedTool === tool.id ? 'bg-blue-100 text-blue-600' : ''}`}
//             onClick={() => setSelectedTool(tool.id)}
//             title={tool.label}
//           >
//             {tool.icon}
//           </button>
//         ))}
//         <div className="border-l border-gray-300 mx-2" />
//         <button
//           className="p-2 rounded hover:bg-gray-100"
//           onClick={undo}
//           title="Undo"
//           disabled={historyIndex <= 0}
//         >
//           ↩
//         </button>
//         <button
//           className="p-2 rounded hover:bg-gray-100"
//           onClick={redo}
//           title="Redo"
//           disabled={historyIndex >= history.length - 1}
//         >
//           ↪
//         </button>
//         <div className="border-l border-gray-300 mx-2" />
//         <button
//           className={`p-2 rounded hover:bg-gray-100 ${showGrid ? 'bg-blue-100 text-blue-600' : ''}`}
//           onClick={() => setShowGrid(!showGrid)}
//           title={showGrid ? 'Hide Grid' : 'Show Grid'}
//         >
//           #
//         </button>
//         <div className="flex items-center">
//           <span className="text-sm mr-2">Zoom: {Math.round(zoom * 100)}%</span>
//           <button
//             className="p-2 rounded hover:bg-gray-100"
//             onClick={() => setZoom(Math.max(0.1, zoom - 0.1))}
//             title="Zoom Out"
//           >
//             -
//           </button>
//           <button
//             className="p-2 rounded hover:bg-gray-100"
//             onClick={() => setZoom(Math.min(5, zoom + 0.1))}
//             title="Zoom In"
//           >
//             +
//           </button>
//           <button
//             className="p-2 rounded hover:bg-gray-100 ml-1"
//             onClick={() => {
//               setZoom(1);
//               setCanvasOffset({ x: 0, y: 0 });
//             }}
//             title="Reset View"
//           >
//             ⟲
//           </button>
//         </div>
//       </div>) => {
//       window.removeEventListener('keydown', handleKeyDown);
//     };
//   }, [selectedElementIds, connecting, undo, redo]);

//   // Handle element creation
//   const createNewElement = (type: Element['type'], position: Position) => {
//     let size: Size;
//     let text = '';
//     let color = '#ffffff';
    
//     switch (type) {
//       case 'rectangle':
//         size = { width: 150, height: 80 };
//         text = 'Process';
//         color = '#b2f2bb';
//         break;
//       case 'diamond':
//         size = { width: 150, height: 150 };
//         text = 'Decision';
//         color = '#a5d8ff';
//         break;
//       case 'ellipse':
//         size = { width: 120, height: 80 };
//         text = 'Start/End';
//         color = '#ffc9c9';
//         break;
//       case 'text':
//         size = { width: 100, height: 40 };
//         text = 'Text';
//         color = 'transparent';
//         break;
//       default:
//         size = { width: 150, height: 80 };
//     }
    
//     // Adjust position by zoom and canvas offset
//     const adjustedPosition = {
//       x: (position.x - canvasOffset.x) / zoom,
//       y: (position.y - canvasOffset.y) / zoom
//     };
    
//     // Snap to grid if enabled
//     const snappedPosition = showGrid ? {
//       x: Math.round(adjustedPosition.x / gridSize) * gridSize,
//       y: Math.round(adjustedPosition.y / gridSize) * gridSize
//     } : adjustedPosition;
    
//     const newElement: Element = {
//       id: `element-${nextElementIdRef.current++}`,
//       type,
//       position: snappedPosition,
//       size,
//       text,
//       color,
//       isSelected: true,
//       zIndex: elements.length, // Place new element on top
//     };
    
//     const newElements = [...elements];
//     newElements.forEach(el => { el.isSelected = false; });
    
//     setElements([...newElements, newElement]);
//     setSelectedElementIds(new Set([newElement.id]));
//     saveToHistory();
//   };

//   // Delete selected elements
//   const deleteSelectedElements = () => {
//     if (selectedElementIds.size === 0) return;
    
//     const newElements = elements.filter(el => !selectedElementIds.has(el.id));
//     const newConnections = connections.filter(conn => 
//       !selectedElementIds.has(conn.from) && !selectedElementIds.has(conn.to)
//     );
    
//     setElements(newElements);
//     setConnections(newConnections);
//     setSelectedElementIds(new Set());
//     saveToHistory();
//   };

//   // Handle mouse events for canvas
//   const handleCanvasMouseDown = (e: React.MouseEvent) => {
//     if (e.target !== containerRef.current) return;
    
//     // Get the position relative to the container
//     const rect = containerRef.current!.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;
    
//     // If right click, show context menu
//     if (e.button === 2) {
//       e.preventDefault();
//       setContextMenu({ show: true, x, y });
//       return;
//     }
    
//     // Close context menu if it's open
//     if (contextMenu.show) {
//       setContextMenu({ ...contextMenu, show: false });
//       return;
//     }
    
//     // Handle different tools
//     if (selectedTool === 'select') {
//       // Start dragging the canvas
//       setIsDraggingCanvas(true);
//       setDragStartPosition({ x: e.clientX, y: e.clientY });
      
//       // Clear selection when clicking on canvas
//       setSelectedElementIds(new Set());
//     } else if (['rectangle', 'diamond', 'ellipse', 'text'].includes(selectedTool)) {
//       // Create a new element at the click position
//       createNewElement(selectedTool as Element['type'], { x, y });
//       // Switch back to select tool after creating an element
//       setSelectedTool('select');
//     }
//   };

//   const handleCanvasMouseMove = (e: React.MouseEvent) => {
//     if (!containerRef.current) return;
    
//     const rect = containerRef.current.getBoundingClientRect();
//     const mousePos = {
//       x: e.clientX - rect.left,
//       y: e.clientY - rect.top
//     };
    
//     setMousePosition(mousePos);
    
//     // Handle canvas dragging
//     if (isDraggingCanvas) {
//       const dx = e.clientX - dragStartPosition.x;
//       const dy = e.clientY - dragStartPosition.y;
      
//       setCanvasOffset({
//         x: canvasOffset.x + dx,
//         y: canvasOffset.y + dy
//       });
      
//       setDragStartPosition({
//         x: e.clientX,
//         y: e.clientY
//       });
//     }
    
//     // Handle element dragging
//     if (draggedElement) {
//       const dx = (e.clientX - dragOffset.x) / zoom;
//       const dy = (e.clientY - dragOffset.y) / zoom;
      
//       // Get all selected elements
//       const selectedElements = elements.filter(el => selectedElementIds.has(el.id));
      
//       // Update the positions of all selected elements
//       const newElements = elements.map(el => {
//         if (selectedElementIds.has(el.id)) {
//           let newX = el.position.x + dx;
//           let newY = el.position.y + dy;
          
//           // Snap to grid if enabled
//           if (showGrid) {
//             newX = Math.round(newX / gridSize) * gridSize;
//             newY = Math.round(newY / gridSize) * gridSize;
//           }
          
//           return {
//             ...el,
//             position: { x: newX, y: newY }
//           };
//         }
//         return el;
//       });
      
//       setElements(newElements);
//       setDragOffset({ x: e.clientX, y: e.clientY });
      
//       // Update connections
//       updateConnectionPoints();
//     }
    
//     // Handle element resizing
//     if (isResizing && resizeElement) {
//       const element = elements.find(el => el.id === resizeElement);
//       if (!element) return;
      
//       const dx = (e.clientX - resizeStartPosition.x) / zoom;
//       const dy = (e.clientY - resizeStartPosition.y) / zoom;
      
//       let newWidth = resizeStartSize.width;
//       let newHeight = resizeStartSize.height;
//       let newX = element.position.x;
//       let newY = element.position.y;
      
//       // Apply changes based on which handle is being dragged
//       switch (resizeHandle) {
//         case 'top-left':
//           newWidth = resizeStartSize.width - dx;
//           newHeight = resizeStartSize.height - dy;
//           newX = resizeStartSize.width > 20 ? element.position.x + dx : element.position.x;
//           newY = resizeStartSize.height > 20 ? element.position.y + dy : element.position.y;
//           break;
//         case 'top-right':
//           newWidth = resizeStartSize.width + dx;
//           newHeight = resizeStartSize.height - dy;
//           newY = resizeStartSize.height > 20 ? element.position.y + dy : element.position.y;
//           break;
//         case 'bottom-left':
//           newWidth = resizeStartSize.width - dx;
//           newHeight = resizeStartSize.height + dy;
//           newX = resizeStartSize.width > 20 ? element.position.x + dx : element.position.x;
//           break;
//         case 'bottom-right':
//           newWidth = resizeStartSize.width + dx;
//           newHeight = resizeStartSize.height + dy;
//           break;
//       }
      
//       // Enforce minimum size
//       newWidth = Math.max(20, newWidth);
//       newHeight = Math.max(20, newHeight);
      
//       // Snap to grid if enabled
//       if (showGrid) {
//         newWidth = Math.round(newWidth / gridSize) * gridSize;
//         newHeight = Math.round(newHeight / gridSize) * gridSize;
//         newX = Math.round(newX / gridSize) * gridSize;
//         newY = Math.round(newY / gridSize) * gridSize;
//       }
      
//       const updatedElements = elements.map(el => {
//         if (el.id === resizeElement) {
//           return {
//             ...el,
//             position: { x: newX, y: newY },
//             size: { width: newWidth, height: newHeight }
//           };
//         }
//         return el;
//       });
      
//       setElements(updatedElements);
      
//       // Update connections
//       updateConnectionPoints();
//     }
    
//     // Show preview line when creating a connection
//     if (connecting && connectionStart) {
//       const startElement = elements.find(el => el.id === connectionStart);
//       if (!startElement) return;
      
//       // This will redraw the preview line as the mouse moves
//       // The actual line is drawn in the render method
//     }
//   };

//   const handleCanvasMouseUp = () => {
//     if (isDraggingCanvas) {
//       setIsDraggingCanvas(false);
//     }
    
//     if (draggedElement) {
//       setDraggedElement(null);
//       saveToHistory();
//     }
    
//     if (isResizing) {
//       setIsResizing(false);
//       setResizeElement(null);
//       setResizeHandle(null);
//       saveToHistory();
//     }
//   };

//   // Handle wheel events for zooming
//   const handleWheel = (e: React.WheelEvent) => {
//     if (e.ctrlKey || e.metaKey) {
//       e.preventDefault();
      
//       // Calculate the mouse position relative to the canvas
//       const rect = containerRef.current!.getBoundingClientRect();
//       const mouseX = e.clientX - rect.left;
//       const mouseY = e.clientY - rect.top;
      
//       // Calculate the position in the unzoomed canvas
//       const pointX = (mouseX - canvasOffset.x) / zoom;
//       const pointY = (mouseY - canvasOffset.y) / zoom;
      
//       // Calculate new zoom
//       const delta = e.deltaY > 0 ? 0.9 : 1.1;
//       const newZoom = Math.max(0.1, Math.min(5, zoom * delta));
      
//       // Calculate new offset to keep the mouse position fixed
//       const newOffsetX = mouseX - pointX * newZoom;
//       const newOffsetY = mouseY - pointY * newZoom;
      
//       setZoom(newZoom);
//       setCanvasOffset({ x: newOffsetX, y: newOffsetY });
//     }
//   };

//   // Handle element mouse events
//   const handleElementMouseDown = (e: React.MouseEvent, elementId: string) => {
//     e.stopPropagation();
    
//     if (e.button === 2) {
//       // Right click
//       e.preventDefault();
//       setSelectedElementIds(new Set([elementId]));
      
//       const rect = containerRef.current!.getBoundingClientRect();
//       const x = e.clientX - rect.left;
//       const y = e.clientY - rect.top;
      
//       setContextMenu({ show: true, x, y });
//       return;
//     }
    
//     // Close context menu if it's open
//     if (contextMenu.show) {
//       setContextMenu({ ...contextMenu, show: false });
//     }
    
//     // Handle connection tool
//     if (selectedTool === 'connect') {
//       if (!connectionStart) {
//         // Start connection
//         setConnecting(true);
//         setConnectionStart(elementId);
//       } else {
//         // Finish connection if target is different from start
//         if (connectionStart !== elementId) {
//           const newConnection: Connection = {
//             id: `connection-${nextConnectionIdRef.current++}`,
//             from: connectionStart,
//             to: elementId,
//             isSelected: false
//           };
          
//           setConnections([...connections, newConnection]);
//           saveToHistory();
//         }
        
//         // Reset connection state
//         setConnecting(false);
//         setConnectionStart(null);
        
//         // Switch back to select tool
//         setSelectedTool('select');
//       }
//       return;
//     }
    
//     // Handle selection
//     const element = elements.find(el => el.id === elementId);
//     if (!element) return;
    
//     // Check if clicking on a resize handle
//     const handle = getResizeHandleUnderMouse(e, element);
//     if (handle) {
//       setIsResizing(true);
//       setResizeElement(elementId);
//       setResizeHandle(handle);
//       setResizeStartPosition({ x: e.clientX, y: e.clientY });
//       setResizeStartSize({ ...element.size });
//       return;
//     }
    
//     // Handle regular selection and dragging
//     const isSelected = selectedElementIds.has(elementId);
    
//     if (!e.shiftKey && !isSelected) {
//       // Select only this element if not holding shift and element not already selected
//       setSelectedElementIds(new Set([elementId]));
      
//       // Update elements to reflect selection state
//       setElements(elements.map(el => ({
//         ...el,
//         isSelected: el.id === elementId
//       })));
//     } else if (e.shiftKey) {
//       // Add/remove from selection when shift is held
//       const newSelectedIds = new Set(selectedElementIds);
      
//       if (isSelected) {
//         newSelectedIds.delete(elementId);
//       } else {
//         newSelectedIds.add(elementId);
//       }
      
//       setSelectedElementIds(newSelectedIds);
      
//       // Update elements to reflect selection state
//       setElements(elements.map(el => ({
//         ...el,
//         isSelected: newSelectedIds.has(el.id)
//       })));
//     }
    
//     // Set up for dragging
//     setDraggedElement(elementId);
//     setDragOffset({ x: e.clientX, y: e.clientY });
//   };

//   // Handle connection mouse events
//   const handleConnectionMouseDown = (e: React.MouseEvent, connectionId: string) => {
//     e.stopPropagation();
    
//     if (e.button === 2) {
//       // Right click
//       e.preventDefault();
      
//       const rect = containerRef.current!.getBoundingClientRect();
//       const x = e.clientX - rect.left;
//       const y = e.clientY - rect.top;
      
//       // Select the connection
//       const newConnections = connections.map(conn => ({
//         ...conn,
//         isSelected: conn.id === connectionId
//       }));
      
//       setConnections(newConnections);
//       setContextMenu({ show: true, x, y });
//       return;
//     }
    
//     // Close context menu if it's open
//     if (contextMenu.show) {
//       setContextMenu({ ...contextMenu, show: false });
//     }
    
//     // Update selection state
//     const newConnections = connections.map(conn => ({
//       ...conn,
//       isSelected: conn.id === connectionId
//     }));
    
//     setConnections(newConnections);
//   };

//   // Get the resize handle that the mouse is over
//   const getResizeHandleUnderMouse = (e: React.MouseEvent, element: Element) => {
//     if (!containerRef.current) return null;
    
//     const rect = containerRef.current.getBoundingClientRect();
//     const mouseX = (e.clientX - rect.left - canvasOffset.x) / zoom;
//     const mouseY = (e.clientY - rect.top - canvasOffset.y) / zoom;
    
//     const { x, y } = element.position;
//     const { width, height } = element.size;
//     const handleSize = 10 / zoom; // Adjust handle size based on zoom
    
//     // Check each handle
//     if (Math.abs(mouseX - x) < handleSize && Math.abs(mouseY - y) < handleSize) {
//       return 'top-left';
//     }
//     if (Math.abs(mouseX - (x + width)) < handleSize && Math.abs(mouseY - y) < handleSize) {
//       return 'top-right';
//     }
//     if (Math.abs(mouseX - x) < handleSize && Math.abs(mouseY - (y + height)) < handleSize) {
//       return 'bottom-left';
//     }
//     if (Math.abs(mouseX - (x + width)) < handleSize && Math.abs(mouseY - (y + height)) < handleSize) {
//       return 'bottom-right';
//     }
    
//     return null;
//   };

//   // Update connection points when elements move
//   const updateConnectionPoints = () => {
//     if (connections.length === 0) return;
    
//     // Calculate connection points for all connections
//     const newConnections = connections.map(conn => {
//       const fromElement = elements.find(el => el.id === conn.from);
//       const toElement = elements.find(el => el.id === conn.to);
      
//       if (!fromElement || !toElement) return conn;
      
//       // Calculate connection points on elements
//       const fromPoint = getConnectionPoint(fromElement, toElement);
//       const toPoint = getConnectionPoint(toElement, fromElement);
      
//       return {
//         ...conn,
//         fromPoint,
//         toPoint
//       };
//     });
    
//     setConnections(newConnections);
//   };

//   // Calculate connection point on an element
//   const getConnectionPoint = (element: Element, targetElement: Element) => {
//     const { x, y } = element.position;
//     const { width, height } = element.size;
    
//     // Center points of the elements
//     const centerX = x + width / 2;
//     const centerY = y + height / 2;
//     const targetCenterX = targetElement.position.x + targetElement.size.width / 2;
//     const targetCenterY = targetElement.position.y + targetElement.size.height / 2;
    
//     // Vector from element center to target center
//     const dx = targetCenterX - centerX;
//     const dy = targetCenterY - centerY;
    
//     // Simple approach: use element center for now
//     // More sophisticated approach would find intersection with element shape
    
//     // For now, find intersection with rectangle
//     // This is a simplified approach - could be improved for different shapes
    
//     // Normalize direction vector
//     const length = Math.sqrt(dx * dx + dy * dy);
//     const nx = dx / length;
//     const ny = dy / length;
    
//     // Calculate half width and height
//     const hw = width / 2;
//     const hh = height / 2;
    
//     // Calculate intersection point
//     let ix, iy;
    
//     if (Math.abs(nx * hh) > Math.abs(ny * hw)) {
//       // Intersection with left or right edge
//       ix = nx > 0 ? x + width : x;
//       iy = centerY + ny * (hw / Math.abs(nx));
//     } else {
//       // Intersection with top or bottom edge
//       ix = centerX + nx * (hh / Math.abs(ny));
//       iy = ny > 0 ? y + height : y;
//     }
    
//     if (element.type === 'ellipse') {
//       // For ellipses, calculate proper intersection point
//       const angle = Math.atan2(dy, dx);
//       ix = centerX + Math.cos(angle) * (width / 2);
//       iy = centerY + Math.sin(angle) * (height / 2);
//     } else if (element.type === 'diamond') {
//       // For diamonds, calculate proper intersection point
//       const angle = Math.atan2(Math.abs(dy), Math.abs(dx));
//       const diagonalAngle = Math.atan2(height, width);
      
//       if (angle < diagonalAngle) {
//         // Intersect with right/left edge
//         const edgeX = dx > 0 ? x + width : x;
//         const ratio = Math.abs((edgeX - centerX) / nx);
//         ix = edgeX;
//         iy = centerY + ny * ratio;
//       } else {
//         // Intersect with top/bottom edge
//         const edgeY = dy > 0 ? y + height : y;
//         const ratio = Math.abs((edgeY - centerY) / ny);
//         ix = centerX + nx * ratio;
//         iy = edgeY;
//       }
//     }
    
//     return { x: ix, y: iy };
//   };

//   // Render elements
//   const renderElement = (element: Element) => {
//     const { id, type, position, size, text, color, isSelected } = element;
//     const { x, y } = position;
//     const { width, height } = size;
    
//     // Apply zoom and canvas offset
//     const displayX = x * zoom + canvasOffset.x;
//     const displayY = y * zoom + canvasOffset.y;
//     const displayWidth = width * zoom;
//     const displayHeight = height * zoom;
    
//     // Base style for all elements
//     const baseStyle: React.CSSProperties = {
//       position: 'absolute',
//       left: `${displayX}px`,
//       top: `${displayY}px`,
//       width: `${displayWidth}px`,
//       height: `${displayHeight}px`,
//       backgroundColor: color,
//       border: isSelected ? '2px solid blue' : '1px solid #333',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       cursor: 'move',
//       zIndex: element.zIndex,
//       boxSizing: 'border-box',
//       transition: isDraggingCanvas ? 'none' : 'background-color 0.2s',
//     };
    
//     // Element-specific styles
//     let specificStyle: React.CSSProperties = {};
    
//     switch (type) {
//       case 'rectangle':
//         specificStyle = {
//           borderRadius: '4px',
//         };
//         break;
//       case 'diamond':
//         specificStyle = {
//           transform: 'rotate(45deg)',
//         };
//         break;
//       case 'ellipse':
//         specificStyle = {
//           borderRadius: '50%',
//         };
//         break;
//       case 'text':
//         specificStyle = {
//           backgroundColor: 'transparent',
//           border: isSelected ? '1px dashed blue' : 'none',
//           justifyContent: 'flex-start',
//           padding: '5px',
//         };
//         break;
//     }
    
//     // Text style
//     const textStyle: React.CSSProperties = {
//       transform: type === 'diamond' ? 'rotate(-45deg)' : 'none',
//       fontSize: `${Math.max(12, 14 * zoom)}px`,
//       userSelect: 'none',
//       textAlign: 'center',
//       width: '100%',
//       overflow: 'hidden',
//     };
    
//     // Render resize handles for selected elements
//     const renderResizeHandles = () => {
//       if (!isSelected) return null;
      
//       return resizeHandles.map(handle => {
//         const handleStyle: React.CSSProperties = {
//           position: 'absolute',
//           width: `${8 * zoom}px`,
//           height: `${8 * zoom}px`,
//           backgroundColor: 'blue',
//           borderRadius: '50%',
//           cursor: handle.cursor,
//         };
        
//         // Position the handle
//         switch (handle.position) {
//           case 'top-left':
//             handleStyle.top = '-4px';
//             handleStyle.left = '-4px';
//             break;
//           case 'top-right':
//             handleStyle.top = '-4px';
//             handleStyle.right = '-4px';
//             break;
//           case 'bottom-left':
//             handleStyle.bottom = '-4px';
//             handleStyle.left = '-4px';
//             break;
//           case 'bottom-right':
//             handleStyle.bottom = '-4px';
//             handleStyle.right = '-4px';
//             break;
//         }
        
//         return (
//           <div 
//             key={`${id}-${handle.position}`}
//             style={handleStyle}
//           />
//         );
//       });
//     };
    
//     // Content based on element type
//     let content: React.ReactNode = text;
//     if (type === 'text' && isSelected) {
//       content = (
//         <input
//           type="text"
//           value={text}
//           onChange={(e) => {
//             const newElements = elements.map(el => 
//               el.id === id ? { ...el, text: e.target.value } : el
//             );
//             setElements(newElements);
//           }}
//           onBlur={() => saveToHistory()}
//           onClick={(e) => e.stopPropagation()}
//           style={{
//             width: '100%',
//             background: 'transparent',
//             border: 'none',
//             outline: 'none',
//             fontSize: `${Math.max(12, 14 * zoom)}px`,
//             textAlign: 'center',
//           }}
//         />
//       );
//     }
    
//     return (
//       <div
//         key={id}
//         onMouseDown={(e) => handleElementMouseDown(e, id)}
//         style={{ ...baseStyle, ...specificStyle }}
//       >
//         <div style={textStyle}>{content}</div>
//         {renderResizeHandles()}
//       </div>
//     );
//   }