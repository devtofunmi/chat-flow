import React from "react";
import { Handle, Position } from "@xyflow/react";

interface CustomNodeProps {
  data: { label: string; messageType?: string };
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

const CustomNode = ({ data }: CustomNodeProps) => {
  const style = nodeStyles[data.messageType || "default"];

  return (
    <div
      className="relative rounded-2xl border flex items-center justify-center"
      style={{
        width: "180px",
        height: "60px",
        ...style, // Apply dynamic styles
      }}
    >
      <div className="!text-gray-800 text-sm text-center px-2">{data.label}</div>

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