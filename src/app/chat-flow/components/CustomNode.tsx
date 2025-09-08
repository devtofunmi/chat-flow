import React, { useState, useEffect } from "react";
import { Handle, Position, NodeProps, Node, useUpdateNodeInternals } from "@xyflow/react";
import { ChevronDown, ChevronUp, Play, Loader2 } from "lucide-react";

export interface CustomNodeProps extends NodeProps {
  data: {
    label: string;
    messageType?: string;
    payload?: object;
    apiConfig?: {
      url: string;
      method: 'GET' | 'POST' | 'PUT' | 'DELETE';
      headers?: Record<string, string>;
      body?: object;
    };
    isExpanded?: boolean;
  };
  onNodeUpdate: (nodeId: string, newData: Partial<Node['data']>) => void;
  executeApiNode: (nodeId: string) => Promise<void>;
}

const nodeStyles: { [key: string]: React.CSSProperties } = {
  user: {
    backgroundColor: "#e0f2fe",
    borderColor: "#90cdf4",
  },
  ai: {
    backgroundColor: "#fefcbf",
    borderColor: "#f6e05e",
  },
  success: {
    backgroundColor: "#e6fffa",
    borderColor: "#81e6d9",
  },
  error: {
    backgroundColor: "#fed7d7",
    borderColor: "#fc8181",
  },
  default: {
    backgroundColor: "#ffffff",
    borderColor: "#e2e8f0",
  },
};

const CustomNode = ({ data, id, onNodeUpdate, executeApiNode }: CustomNodeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);
  const [isLoading, setIsLoading] = useState(false);
  const style = nodeStyles[data.messageType || "default"];
  const updateNodeInternals = useUpdateNodeInternals();

  // Use isExpanded from props, default to false if not provided
  const isExpanded = data.isExpanded ?? false;

  useEffect(() => {
    updateNodeInternals(id);
  }, [isExpanded, id, updateNodeInternals]);

  const toggleExpand = (event: React.MouseEvent) => {
    event.stopPropagation();
    // Update the isExpanded state via the onNodeUpdate callback
    onNodeUpdate(id, { isExpanded: !isExpanded });
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(event.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (label !== data.label) {
      onNodeUpdate(id, { label: label });
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setIsEditing(false);
      if (label !== data.label) {
        onNodeUpdate(id, { label: label });
      }
    }
  };

  const handleExecuteApi = async (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsLoading(true);
    await executeApiNode(id);
    setIsLoading(false);
  };

  return (
    <div
      className="relative rounded-2xl border flex flex-col items-center justify-center pt-2 pb-2 px-4"
      style={{
        width: "180px",
        minHeight: "60px",
        height: isExpanded ? "auto" : "60px",
        overflow: "visible",
        ...style,
      }}
      onDoubleClick={handleDoubleClick}
    >
      {isEditing ? (
        <input
          type="text"
          value={label}
          onChange={handleLabelChange}
          onBlur={handleBlur}
          onKeyPress={handleKeyPress}
          className="nodrag text-center w-full bg-transparent border-b border-gray-400 focus:outline-none"
          autoFocus
        />
      ) : (
        <div className="!text-gray-800 text-sm flex items-center justify-center flex-1">{data.label}</div>
      )}
      
      {data.payload && (
        <button
          onClick={toggleExpand}
          className="absolute top-1 right-1 p-1 rounded-full hover:bg-gray-200"
          style={{ lineHeight: 0 }}
        >
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      )}

      {data.apiConfig && (
        <button
          onClick={handleExecuteApi}
          className="absolute top-1 left-1 p-1 rounded-full hover:bg-gray-200"
          title="Execute API Call"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
        </button>
      )}

      {isExpanded && data.payload && (
        <div className="mt-2 text-xs text-gray-700 text-left w-full overflow-auto">
          <pre className="bg-gray-100 p-1 rounded overflow-auto text-left" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            <code>{JSON.stringify(data.payload, null, 2)}</code>
          </pre>
        </div>
      )}

      <Handle
        type="target"
        position={Position.Top}
        className="w-4 h-4 rounded-full !bg-gray-400 !border-0"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-4 h-4 rounded-full !bg-gray-400 !border-0"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-4 h-4 rounded-full !bg-gray-400 !border-0"
      />
      <Handle
        type="target"
        position={Position.Left}
        className="w-4 h-4 rounded-full !bg-gray-400 !border-0"
      />
    </div>
  );
};

export default CustomNode;