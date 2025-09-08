
import React, { useState, useEffect } from 'react';
import { AppNode } from './chat-flow';
import { X } from 'lucide-react';

interface NodeInspectorPanelProps {
  node: AppNode | null;
  onClose: () => void;
  onNodeUpdate: (nodeId: string, newData: Partial<AppNode['data']>) => void;
}

export function NodeInspectorPanel({ node, onClose, onNodeUpdate }: NodeInspectorPanelProps) {
  const [label, setLabel] = useState(node?.data?.label || '');
  const [messageType, setMessageType] = useState(node?.data?.messageType || 'default');
  const [payload, setPayload] = useState(JSON.stringify(node?.data?.payload || {}, null, 2));
  const [payloadError, setPayloadError] = useState<string | null>(null);

  useEffect(() => {
    if (node) {
      setLabel(node.data.label || '');
      setMessageType(node.data.messageType || 'default');
      setPayload(JSON.stringify(node.data.payload || {}, null, 2));
      setPayloadError(null);
    }
  }, [node]);

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLabel = e.target.value;
    setLabel(newLabel);
    onNodeUpdate(node!.id, { label: newLabel });
  };

  const handleMessageTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMessageType = e.target.value;
    setMessageType(newMessageType);
    onNodeUpdate(node!.id, { messageType: newMessageType });
  };

  const handlePayloadChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newPayload = e.target.value;
    setPayload(newPayload);
    try {
      const parsedPayload = JSON.parse(newPayload);
      setPayloadError(null);
      onNodeUpdate(node!.id, { payload: parsedPayload });
    } // eslint-disable-next-line @typescript-eslint/no-unused-vars
    catch (error) {
      setPayloadError('Invalid JSON');
    }
  };

  if (!node) {
    return null;
  }

  return (
    <div className="absolute top-0 right-0 w-[350px] h-full bg-white border-l border-gray-200 shadow-lg p-5 box-border z-10 overflow-y-auto font-mono text-xs text-gray-800">
      <button onClick={onClose} className="absolute top-2.5 right-2.5  p-2 bg-transparent border-none text-lg cursor-pointer"><X className="w-4 h-4" /></button>
      <h3>Node Details</h3>
      <hr />
      <div className="mb-2 mt-2">
        <strong>ID:</strong> {node.id}
      </div>
      <div className="mb-4">
        <label htmlFor="node-label" className="block text-sm font-medium text-gray-700">Label:</label>
        <input
          type="text"
          id="node-label"
          value={label}
          onChange={handleLabelChange}
          className="mt-1 block w-full h-8 cursor-pointer p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="message-type" className="block text-sm font-medium text-gray-700">Message Type:</label>
        <select
          id="message-type"
          value={messageType}
          onChange={handleMessageTypeChange}
          className="mt-1 block w-full h-8 cursor-pointer p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="default">Default</option>
          <option value="user">User</option>
          <option value="ai">AI</option>
          <option value="tool">Tool</option>
          <option value="error">Error</option>
        </select>
      </div>
      <h4 className="mt-5">Payload (node.data.payload)</h4>
      <textarea
        value={payload}
        onChange={handlePayloadChange}
        className={`mt-1 block w-full p-2 rounded-md border ${payloadError ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 font-mono text-xs`}
        rows={10}
      />
      {payloadError && <p className="text-red-500 text-xs mt-1">{payloadError}</p>}
    </div>
  );
}
