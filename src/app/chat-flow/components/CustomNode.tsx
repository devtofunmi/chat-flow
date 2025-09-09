import React, { useState, useEffect } from "react";
import { Handle, Position, NodeProps, Node, useUpdateNodeInternals } from "@xyflow/react";
import { ChevronDown, ChevronUp } from "lucide-react";

export interface CustomNodeProps extends NodeProps {
  data: {
    label: string;
    messageType?: string;
    isExpanded?: boolean;
    description?: string;
  };
  onNodeUpdate: (nodeId: string, newData: Partial<Node['data']>) => void;
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

const CustomNode = ({ data, id, onNodeUpdate }: CustomNodeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);
  const style = (data.messageType && nodeStyles[data.messageType]) || nodeStyles.default;
  const updateNodeInternals = useUpdateNodeInternals();
  const [randomBgColor, setRandomBgColor] = useState<string | undefined>();

  // Use isExpanded from props, default to false if not provided
  const isExpanded = data.isExpanded ?? false;

  useEffect(() => {
    updateNodeInternals(id);
  }, [isExpanded, id, updateNodeInternals]);

  useEffect(() => {
    if (isExpanded) {
      const colors = Object.values(nodeStyles).map(s => s.backgroundColor).filter(c => c !== style.backgroundColor);
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      setRandomBgColor(randomColor);
    }
  }, [isExpanded, style.backgroundColor]);

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

  const [description, setDescription] = useState(data.description || "");

  useEffect(() => {
    setDescription(data.description || "");
  }, [data.description]);

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
    onNodeUpdate(id, { description: event.target.value });
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
        <>
          <div className="!text-gray-800 text-sm flex items-center justify-center flex-1 "> 
            {data.label}
            <button onClick={toggleExpand} className="absolute right-2 top-1 rounded-full hover:bg-gray-200"> 
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
          {isExpanded && (
            <div> 
              <div className="w-full mt-2">
                <h4 className="text-xs font-semibold text-gray-600">Description:</h4>
                <p
                  style={{ backgroundColor: randomBgColor }}
                  className="nodrag mt-1 block w-full p-1 text-xs rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 font-mono overflow-hidden break-words"
                >
                  {description}
                </p>
              </div>
             
            </div>
          )}
        </>
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