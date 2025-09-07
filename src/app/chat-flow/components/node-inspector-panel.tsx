
import React from 'react';
import { Node } from '@xyflow/react';

interface NodeInspectorPanelProps {
  node: Node | null;
  onClose: () => void;
}

export function NodeInspectorPanel({ node, onClose }: NodeInspectorPanelProps) {
  if (!node) {
    return null;
  }

  const panelStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '350px',
    height: '100%',
    backgroundColor: 'rgba(248, 249, 250, 0.95)',
    borderLeft: '1px solid #dee2e6',
    boxShadow: '-2px 0 5px rgba(0,0,0,0.1)',
    padding: '20px',
    boxSizing: 'border-box',
    zIndex: 10,
    overflowY: 'auto',
    fontFamily: 'monospace',
    fontSize: '12px',
    color: '#343a40'
  };

  const closeButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'transparent',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
  };

  const preStyle: React.CSSProperties = {
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    backgroundColor: '#fff',
    border: '1px solid #ced4da',
    padding: '10px',
    borderRadius: '4px',
  };

  return (
    <div style={panelStyle}>
      <button onClick={onClose} style={closeButtonStyle}>&times;</button>
      <h3>Node Details</h3>
      <hr />
      <strong>ID:</strong> {node.id}
      <h4 style={{ marginTop: '20px' }}>Payload (node.data)</h4>
      <pre style={preStyle}>
        <code>{JSON.stringify(node.data, null, 2)}</code>
      </pre>
    </div>
  );
}
