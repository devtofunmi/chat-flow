import { useState, useCallback, useEffect, useMemo, forwardRef } from 'react';
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
  NodeProps,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CustomNode, { CustomNodeProps } from './CustomNode';
import { NodeInspectorPanel } from './node-inspector-panel';
import dagre from 'dagre';

export type AppNode = Node<{ label: string; messageType?: string; description?: string; }>;

// --- Dagre layouting setup ---
const nodeWidth = 160;
const nodeHeight = 60;

const getLayoutedElements = (nodes: AppNode[], edges: Edge[], direction = 'TB') => {
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
    // reating a new object to ensure React detects the change.
    const updatedNode: AppNode = {
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
// End Dagre


// Initial state for the flow chart
const initialNodes: AppNode[] = [];
const initialEdges: Edge[] = [];

const defaultEdgeOptions = {
  animated: true,
  type: 'smoothstep',
  style: { strokeDasharray: '5 5' },
};

interface ChatFlowProps {
  nodes: AppNode[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  onDeleteNode: (nodeId: string) => void;
  
  updateNodeData: (nodeId: string, newData: Partial<AppNode['data']>) => void;
  setFlow: (flow: { nodes: AppNode[], edges: Edge[] }) => void;
}

interface ContextMenuState {
  x: number;
  y: number;
  nodeId: string;
  modalX?: number;
  modalY?: number;
}

import NodeContextMenu from './NodeContextMenu';

export const ChatFlow = forwardRef<HTMLDivElement, ChatFlowProps>(function ChatFlow(
  {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onDeleteNode,
    updateNodeData,
  },
  ref
) {
  const [selectedNode, setSelectedNode] = useState<AppNode | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

  const customNodeTypes = useMemo(() => ({
    custom: (props: NodeProps) => (
      <CustomNode
        {...props}
        data={props.data as CustomNodeProps['data']}
        onNodeUpdate={updateNodeData}
      />
    ),
  }), [updateNodeData]);

  useEffect(() => {
    if (selectedNode) {
      const updatedSelectedNode = nodes.find(n => n.id === selectedNode.id);
      setSelectedNode(updatedSelectedNode || null);
    }
  }, [nodes, selectedNode]);

  const handleNodeClick = (_: React.MouseEvent, node: AppNode) => {
    setSelectedNode(node);
  };

  const handlePanelClose = () => {
    setSelectedNode(null);
  };

  const handleNodeContextMenu = (event: React.MouseEvent, node: AppNode) => {
    event.preventDefault();
    if (ref && 'current' in ref && ref.current) {
      const reactFlowBounds = ref.current.getBoundingClientRect();
      setContextMenu({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
        nodeId: node.id,
      });
    }
  };

  const handleContextMenuClose = () => {
    setContextMenu(null);
  };

  const handleContextMenuItemClick = (action: string, nodeId: string) => {
    switch (action) {
      
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
        onNodeContextMenu={handleNodeContextMenu}
        nodeTypes={customNodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        style={{ position: 'relative', zIndex: 1 }}
        proOptions={{ hideAttribution: true }}
        ref={ref}
      >
        <Controls />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <MiniMap />
      </ReactFlow>
      <NodeInspectorPanel node={selectedNode} onClose={handlePanelClose} onNodeUpdate={updateNodeData} />
      {contextMenu && (
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
});

export function useFlowState() {
    const [nodes, setNodes] = useState<AppNode[]>(initialNodes);
    const [edges, setEdges] = useState<Edge[]>(initialEdges);

    const onNodesChange: OnNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds) as AppNode[]),
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

    const addNode = useCallback(({ id, data, x, y }: { id: string, data: { label: string; messageType?: string; description?: string }, x: number, y: number }) => {
        const newNode: AppNode = {
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

    

    const updateNodeData = useCallback((nodeId: string, newData: Partial<AppNode['data']>) => {
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === nodeId) {
                    const updatedData = { ...node.data, ...newData };

                    return { ...node, data: updatedData };
                }
                return node;
            })
        );
    }, [setNodes]);

    

    const setFlow = useCallback((flow: { nodes: AppNode[], edges: Edge[] }) => {
        setNodes(flow.nodes);
        setEdges(flow.edges);
    }, [setNodes, setEdges]);

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
        deleteNodeAndConnectedElements,
        updateNodeData, 
        setFlow,
    };
}