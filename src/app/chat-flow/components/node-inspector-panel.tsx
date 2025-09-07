
import React from 'react';
import { Node } from '@xyflow/react';
import { X } from 'lucide-react';

interface NodeInspectorPanelProps {
  node: Node | null;
  onClose: () => void;
}

export function NodeInspectorPanel({ node, onClose }: NodeInspectorPanelProps) {
  if (!node) {
    return null;
  }

  return (
    <div className="absolute top-0 right-0 w-[350px] h-full bg-white border-l border-gray-200 shadow-lg p-5 box-border z-10 overflow-y-auto font-mono text-xs text-gray-800">
      <button onClick={onClose} className="absolute top-2.5 right-2.5 bg-transparent border-none text-lg cursor-pointer"><X className="w-4 h-4" /></button>
      <h3>Node Details</h3>
      <hr />
      <strong>ID:</strong> {node.id}
      <h4 className="mt-5">Payload (node.data)</h4>
      <pre className="whitespace-pre-wrap break-words bg-white border border-gray-300 p-2.5 rounded">
        <code>{JSON.stringify(node.data, null, 2)}</code>
      </pre>
    </div>
  );
}
