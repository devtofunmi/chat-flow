
import { useState, useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge as addEdgeHelper,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  BackgroundVariant,
  Position,
  MiniMap, 
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CustomNode from './CustomNode';
import { NodeInspectorPanel } from './node-inspector-panel';
import dagre from 'dagre';

// --- Dagre layouting setup ---
const nodeWidth = 160;
const nodeHeight = 60;

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    // We are creating a new object to ensure React detects the change.
    const updatedNode: Node = {
      ...node,
      targetPosition: isHorizontal ? Position.Left : Position.Top,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };

    return updatedNode;
  });

  return { nodes: layoutedNodes, edges };
};
// --- End Dagre ---


// Initial state for the flow chart
const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

const nodeTypes = {
  custom: CustomNode,
};

const defaultEdgeOptions = {
  animated: true,
  type: 'smoothstep',
  style: { strokeDasharray: '5 5' },
};

interface ChatFlowProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  // New props for context menu actions
  onDeleteNode: (nodeId: string) => void;
  onRegenerateNode: (nodeId: string) => void;
}

interface ContextMenuState {
  x: number;
  y: number;
  nodeId: string;
  modalX?: number;
  modalY?: number;
}

import NodeContextMenu from './NodeContextMenu'; // Import NodeContextMenu

export function ChatFlow({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onDeleteNode, // Destructure new props
  onRegenerateNode,
}: ChatFlowProps) {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null); // State for context menu

  const handleNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  };

  const handlePanelClose = () => {
    setSelectedNode(null);
  };

  const handleNodeContextMenu = (event: React.MouseEvent, node: Node) => {
    event.preventDefault(); // Prevent default browser context menu
    // Position the context menu at the click coordinates
    // Position the modal next to the context menu, with an offset
    setContextMenu({ 
      x: event.clientX, 
      y: event.clientY, 
      nodeId: node.id, 
      modalX: event.clientX + 160, // Offset by 160px to the right of the click
      modalY: event.clientY // Align vertically with the click
    });
  };

  const handleContextMenuClose = () => {
    setContextMenu(null);
  };

  const handleContextMenuItemClick = (action: string, nodeId: string) => {
    switch (action) {
      case 'regenerate':
        onRegenerateNode(nodeId);
        break;
      case 'delete':
        onDeleteNode(nodeId);
        break;
      default:
        console.warn(`Unknown action: ${action}`);
    }
    handleContextMenuClose();
  };

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle, rgba(255,182,193,0.2) 0%, rgba(135,206,250,0.2) 100%)',
          zIndex: 0,
        }}
      />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        onNodeContextMenu={handleNodeContextMenu} // Add context menu handler
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        style={{ position: 'relative', zIndex: 1 }}
        proOptions={{ hideAttribution: true }} 
      >
        <Controls />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <MiniMap /> 
      </ReactFlow>
      <NodeInspectorPanel node={selectedNode} onClose={handlePanelClose} />
      {contextMenu && ( // Conditionally render context menu
        <NodeContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          nodeId={contextMenu.nodeId}
          onClose={handleContextMenuClose}
          onAction={handleContextMenuItemClick}
        />
      )}
    </div>
  );
}

// A hook to manage the state of the flow chart
export function useFlowState() {
    const [nodes, setNodes] = useState<Node[]>(initialNodes);
    const [edges, setEdges] = useState<Edge[]>(initialEdges);

    const onNodesChange: OnNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
        [setNodes]
    );

    const onEdgesChange: OnEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [setEdges]
    );

    const onConnect: OnConnect = useCallback(
        (connection) => setEdges((eds) => addEdgeHelper(connection, eds)),
        [setEdges]
    );

    const addNode = useCallback(({ id, data, x, y }: { id: string, data: { label: string; messageType?: string }, x: number, y: number }) => {
        const newNode: Node = {
            id,
            type: 'custom',
            position: { x, y },
            data,
        };
        setNodes((nds) => [...nds, newNode]);
        return `Successfully added node with id ${id}.`;
    }, [setNodes]);

    const addEdge = useCallback(({ source, target }: { source: string, target: string }) => {
        const newEdge: Edge = {
            id: `e-${source}-${target}`,
            source,
            target,
        };
        setEdges((eds) => addEdgeHelper(newEdge, eds));
        return "Successfully added edge.";
    }, [setEdges]);
    
    const clearFlow = useCallback(() => {
        setNodes([]);
        setEdges([]);
        return "Successfully cleared the flow.";
    }, []);

    const recalculateLayout = useCallback(() => {
        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
            nodes,
            edges
        );

        setNodes([...layoutedNodes]);
        setEdges([...layoutedEdges]);
    }, [nodes, edges]);

    const deleteNodeAndConnectedElements = useCallback((nodeId: string) => {
        setNodes((nds) => nds.filter((node) => node.id !== nodeId));
        setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
        console.log(`Deleted node ${nodeId} and its connected edges.`);
    }, [setNodes, setEdges]);

    const regenerateNode = useCallback((nodeId: string) => {
        console.log(`Regenerating from node: ${nodeId}. (Not yet implemented: actual AI regeneration)`);
        // For now, just delete outgoing edges to simulate a "reset" for regeneration
        setEdges((eds) => eds.filter((edge) => edge.source !== nodeId));
    }, [setEdges]);

    return { 
        nodes, 
        edges, 
        onNodesChange, 
        onEdgesChange, 
        onConnect, 
        addNode, 
        addEdge, 
        clearFlow, 
        recalculateLayout,
        deleteNodeAndConnectedElements, // Expose new function
        regenerateNode,               // Expose new function
    };
}
