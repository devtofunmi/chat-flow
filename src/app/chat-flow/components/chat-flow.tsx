
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
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CustomNode from './CustomNode';
import { NodeInspectorPanel } from './node-inspector-panel';

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
}

export function ChatFlow({ nodes, edges, onNodesChange, onEdgesChange, onConnect }: ChatFlowProps) {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const handleNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  };

  const handlePanelClose = () => {
    setSelectedNode(null);
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
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        style={{ position: 'relative', zIndex: 1 }}
      >
        <Controls />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
      <NodeInspectorPanel node={selectedNode} onClose={handlePanelClose} />
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

    const addNode = useCallback(({ id, data, x, y }: { id: string, data: any, x: number, y: number }) => {
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

    return { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode, addEdge, clearFlow };
}
