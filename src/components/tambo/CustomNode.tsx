import React from "react";
import { Handle, Position } from "@xyflow/react";

interface CustomNodeProps {
  data: { label: string };
}

const CustomNode = ({ data }: CustomNodeProps) => {
  return (
    <div
      className="relative rounded-2xl border border-gray-300 bg-white flex items-center justify-center"
      style={{
        width: "160px",
        height: "60px", 
      }}
    >

      <div className="!text-gray-500 text-md text-center">{data.label}</div>

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