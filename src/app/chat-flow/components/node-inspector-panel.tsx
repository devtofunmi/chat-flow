import React, { useState, useEffect } from 'react';
import { AppNode } from './chat-flow';
import { X } from 'lucide-react';

interface NodeInspectorPanelProps {
  node: AppNode | null;
  onClose: () => void;
  onNodeUpdate: (nodeId: string, newData: Partial<AppNode['data']>) => void;
}

export function NodeInspectorPanel({ node, onClose, onNodeUpdate }: NodeInspectorPanelProps) {
  console.log(`[NodeInspectorPanel] Rendered. Node ID: ${node?.id}, Payload:`, node?.data?.payload);

  const [label, setLabel] = useState(node?.data?.label || '');
  const [messageType, setMessageType] = useState(node?.data?.messageType || 'default');
  const [payload, setPayload] = useState(JSON.stringify(node?.data?.payload || {}, null, 2));
  const [payloadError, setPayloadError] = useState<string | null>(null);
  const [showApiConfig, setShowApiConfig] = useState(false);


  // New state for API configuration
  const [apiUrl, setApiUrl] = useState(node?.data?.apiConfig?.url || '');
  const [apiMethod, setApiMethod] = useState(node?.data?.apiConfig?.method || 'GET');
  const [apiHeaders, setApiHeaders] = useState(JSON.stringify(node?.data?.apiConfig?.headers || {"Authorization": "Bearer YOUR_ACTUAL_TOKEN_HERE", "Content-Type": "application/json"}, null, 2));
  const [apiHeadersError, setApiHeadersError] = useState<string | null>(null);
  const [apiBody, setApiBody] = useState(node?.data?.apiConfig?.body ? JSON.stringify(node.data.apiConfig.body, null, 2) : '');
  const [apiBodyError, setApiBodyError] = useState<string | null>(null);

  useEffect(() => {
    console.log(`[NodeInspectorPanel] useEffect triggered. Node ID: ${node?.id}, Payload:`, node?.data?.payload);
    if (node) {
      setLabel(node.data.label || '');
      setMessageType(node.data.messageType || 'default');
      setPayload(JSON.stringify(node.data.payload || {}, null, 2));
      setPayloadError(null);
      setShowApiConfig(!!node.data.apiConfig);


      // Reset API config states
      setApiUrl(node.data.apiConfig?.url || '');
      setApiMethod(node.data.apiConfig?.method || 'GET');
      setApiHeaders(JSON.stringify(node.data.apiConfig?.headers || {"Authorization": "Bearer YOUR_ACTUAL_TOKEN_HERE", "Content-Type": "application/json"}, null, 2));
      setApiHeadersError(null);
      setApiBody(node.data.apiConfig?.body ? JSON.stringify(node.data.apiConfig.body, null, 2) : '');
      setApiBodyError(null);
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
    } catch {
      setPayloadError('Invalid JSON');
    }
  };

  // Handlers for API config changes
  const handleApiUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setApiUrl(newUrl);
    const currentApiConfig = node!.data.apiConfig || {
      url: '',
      method: 'GET',
      headers: {},
      body: {},
    };
    onNodeUpdate(node!.id, {
      apiConfig: {
        url: newUrl,
        method: currentApiConfig.method,
        headers: currentApiConfig.headers,
        body: currentApiConfig.body,
      }
    });
  };

  const handleApiMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMethod = e.target.value as 'GET' | 'POST' | 'PUT' | 'DELETE';
    setApiMethod(newMethod);
    const currentApiConfig = node!.data.apiConfig || {
      url: '',
      method: 'GET',
      headers: {},
      body: {},
    };
    onNodeUpdate(node!.id, {
      apiConfig: {
        url: currentApiConfig.url,
        method: newMethod,
        headers: currentApiConfig.headers,
        body: currentApiConfig.body,
      }
    });
  };

  const handleApiHeadersChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newHeaders = e.target.value;
    setApiHeaders(newHeaders);
    try {
      const parsedHeaders = JSON.parse(newHeaders);
      setApiHeadersError(null);
      const currentApiConfig = node!.data.apiConfig || {
        url: '',
        method: 'GET',
        headers: {},
        body: {},
      };
      onNodeUpdate(node!.id, {
        apiConfig: {
          url: currentApiConfig.url,
          method: currentApiConfig.method,
          headers: parsedHeaders,
          body: currentApiConfig.body,
        }
      });
    } catch {
      setApiHeadersError('Invalid JSON');
    }
  };

  const handleApiBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newBody = e.target.value;
    setApiBody(newBody);
    try {
      const parsedBody = JSON.parse(newBody);
      setApiBodyError(null);
      const currentApiConfig = node!.data.apiConfig || {
        url: '',
        method: 'GET',
        headers: {},
        body: undefined,
      };

      // If parsedBody is an empty object, set it to undefined
      const bodyToUpdate = Object.keys(parsedBody).length === 0 ? undefined : parsedBody;

      onNodeUpdate(node!.id, {
        apiConfig: {
          url: currentApiConfig.url,
          method: currentApiConfig.method,
          headers: currentApiConfig.headers,
          body: bodyToUpdate,
        }
      });
    } catch {
      setApiBodyError('Invalid JSON');
    }
  };

  if (!node) {
    return null;
  }

  return (
    <div className="absolute top-0 right-0 w-[350px] h-full bg-white border-l border-gray-200 shadow-lg p-5 box-border z-10 overflow-y-auto font-mono text-xs text-gray-800">
      <button onClick={onClose} className="absolute top-2.5 right-2.5  p-2 rounded-full bg-transparent border-none text-lg cursor-pointer"><X className="w-4 h-4" /></button>
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
          className="mt-1 block w-full h-8  p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="message-type" className="block text-sm font-medium text-gray-700">Message Type:</label>
        <select
          id="message-type"
          value={messageType}
          onChange={handleMessageTypeChange}
          className="mt-1 block w-full h-8  p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="default">Default</option>
          <option value="user">User</option>
          <option value="ai">AI</option>
          <option value="success">Success</option>
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

      <div className="flex items-center mt-5">
        <input
          type="checkbox"
          id="show-api-config"
          checked={showApiConfig}
          onChange={(e) => setShowApiConfig(e.target.checked)}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="show-api-config" className="ml-2 block text-sm font-medium text-gray-900">
          Requires API Integration
        </label>
      </div>

      {showApiConfig && (
        <>
          {/* API Configuration Fields */}
          <h4 className="mt-5">API Configuration (node.data.apiConfig)</h4>
          <div className="mb-4">
            <label htmlFor="api-url" className="block text-sm font-medium text-gray-700">URL:</label>
            <input
              type="text"
              id="api-url"
              value={apiUrl}
              onChange={handleApiUrlChange}
              className="mt-1 block w-full h-8 p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="api-method" className="block text-sm font-medium text-gray-700">Method:</label>
            <select
              id="api-method"
              value={apiMethod}
              onChange={handleApiMethodChange}
              className="mt-1 block w-full h-8 p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>
          <label htmlFor="api-headers" className="block text-sm font-medium text-gray-700 mt-5">Headers (JSON):</label>
          <textarea
            id="api-headers"
            value={apiHeaders}
            onChange={handleApiHeadersChange}
            className={`mt-1 block w-full p-2 rounded-md border ${apiHeadersError ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 font-mono text-xs`}
            rows={5}
            placeholder={`{
              "Content-Type": "application/json",
              "Authorization": "Bearer <token>"
            }`}
          />
          {apiHeadersError && <p className="text-red-500 text-xs mt-1">{apiHeadersError}</p>}

          <h4 className="mt-5">Body (JSON):</h4>
          <textarea
            value={apiBody}
            onChange={handleApiBodyChange}
            className={`mt-1 block w-full p-2 rounded-md border ${apiBodyError ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 font-mono text-xs`}
            rows={10}
          />
          {apiBodyError && <p className="text-red-500 text-xs mt-1">{apiBodyError}</p>}
           {/* New section for API Response/Error */}
          {node.data.payload && (
            <div className="mt-5">
              <h4 className="mt-5">API Response/Error:</h4>
              <pre className="bg-gray-100 p-2 rounded overflow-auto text-left" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                <code>{JSON.stringify(node.data.payload, null, 2)}</code>
              </pre>
            </div>
          )}
            </>
          )}
    </div>
  );
}