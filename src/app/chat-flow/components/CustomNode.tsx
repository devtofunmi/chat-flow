import React, { useState } from "react";
import { Handle, Position, NodeProps, Node } from "@xyflow/react";
import { ChevronDown, ChevronUp } from "lucide-react"; 

export interface CustomNodeProps extends NodeProps {
  data: { label: string; messageType?: string; payload?: object }; // Override data from NodeProps
  onNodeUpdate: (nodeId: string, newData: Partial<Node['data']>) => void; // Add onNodeUpdate
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
  tool: {
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

const CustomNode = ({ data, id, onNodeUpdate }: CustomNodeProps) => {
  const [isExpanded, setIsExpanded] = useState(false); // State for expand/collapse
  const [isEditing, setIsEditing] = useState(false); // State for in-place editing
  const [label, setLabel] = useState(data.label); // Local state for editable label
  const style = nodeStyles[data.messageType || "default"];

  const toggleExpand = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent React Flow from moving the node
    setIsExpanded(!isExpanded);
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
      onNodeUpdate(id, { label: label }); // Call the prop function to update the node data
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

  return (
    <div
      className="relative rounded-2xl border flex flex-col items-center justify-center pt-2 pb-2 px-4"
      style={{
        width: "180px",
        minHeight: "60px",
        height: isExpanded ? "auto" : "60px", 
        ...style,
      }}
      onDoubleClick={handleDoubleClick} // Add double-click handler
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
      
      {data.payload && ( // Only show button if there's a payload
        <button
          onClick={toggleExpand}
          className="absolute top-1 right-1 p-1 rounded-full hover:bg-gray-200" 
          style={{ lineHeight: 0 }} // Remove extra line height
        >
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      )}

      {isExpanded && data.payload && (
        <div className="mt-2 text-xs text-gray-700 text-left w-full overflow-auto max-h-40"> 
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