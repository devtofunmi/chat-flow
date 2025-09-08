import React from 'react';

interface NodeContextMenuProps {
  x: number;
  y: number;
  nodeId: string;
  onClose: () => void;
  onAction: (action: string, nodeId: string) => void;
}

const NodeContextMenu = ({ x, y, nodeId, onClose, onAction }: NodeContextMenuProps) => {
  const handleAction = (action: string) => {
    onAction(action, nodeId);
    onClose();
  };

  // Close menu if clicked outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest('.node-context-menu')) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      className="node-context-menu absolute bg-white border border-gray-200 rounded-md shadow-lg z-50 py-1"
      style={{ top: y, left: x }}
    >
      <button
        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        onClick={() => handleAction('regenerate')}
      >
        Regenerate from here
      </button>
      
      <button
        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
        onClick={() => handleAction('delete')}
      >
        Delete Node and Branch
      </button>
    </div>
  );
};

export default NodeContextMenu;