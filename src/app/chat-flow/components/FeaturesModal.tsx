import React from 'react';

interface FeaturesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeaturesModal: React.FC<FeaturesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const chatflowFeatures = [
    "Node creation (via prompt, e.g., 'Add a node named \"Start\"')",
    "Edge creation (via prompt, e.g., 'Connect node A to node B')",
    "Flow clearing (via prompt, e.g., 'Clear the flow')",
    "Layout recalculation (button)",
    "Node inspection/editing (click on node)",
    "Node context menu (right-click on node: regenerate, delete)",
    "API node execution (click 'Execute API' on API node)",
    "JSON export/import (buttons in footer)",
    "PNG export (button in footer)",
  ];

  const apiPromptExamples = [
    "Execute API node with config: {url: 'https://api.example.com/users', method: 'GET', headers: {'Authorization': 'Bearer YOUR_TOKEN'}, body: {}}",
    "Execute API node with URL: https://api.example.com/data, method: POST, headers: {'Content-Type': 'application/json'}, body: {'key': 'value'}",
    "Add a node named 'Create User' with API config: {url: 'https://api.example.com/users', method: 'POST', headers: {'Content-Type': 'application/json'}, body: {'name': 'John Doe', 'email': 'john.doe@example.com'}}",
  ];

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 cursor-pointer text-gray-500 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">ChatFlow Features</h2>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Features:</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            {chatflowFeatures.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-700">API Integration Prompt Examples:</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            {apiPromptExamples.map((example, index) => (
              <li key={index}>
                <code className="bg-gray-100 p-1 rounded text-sm block whitespace-pre-wrap">{example}</code>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FeaturesModal;
