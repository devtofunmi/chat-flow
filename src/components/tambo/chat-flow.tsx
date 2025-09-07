
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
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Initial state for the flow chart
const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

interface ChatFlowProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
}

export function ChatFlow({ nodes, edges, onNodesChange, onEdgesChange, onConnect }: ChatFlowProps) {
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Controls />
        <Background />
      </ReactFlow>
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

    const addNode = useCallback(({ id, label, x, y }: { id: string, label: string, x: number, y: number }) => {
        const newNode: Node = {
            id,
            position: { x, y },
            data: { label },
        };
        setNodes((nds) => [...nds, newNode]);
        return `Successfully added node ${label} with id ${id}.`;
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
