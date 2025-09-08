import React from 'react';

interface FeaturesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeaturesModal: React.FC<FeaturesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const chatflowFeatures = [
    "Intuitive Node Management:** Create and connect nodes effortlessly using natural language prompts (e.g., 'Add a node named \"Start\"', 'Connect node A to node B').",
    "Dynamic Flow Control:** Clear the entire flow with a simple command ('Clear the flow') and optimize node arrangement with automatic layout recalculation.",
    "Comprehensive Node Inspection:** Easily view and edit node properties through a dedicated inspection panel, ensuring precise control over your chat flow.",
    "Contextual Node Actions:** Access advanced options like regenerating content or deleting nodes via a right-click context menu for efficient workflow management.",
    "Integrated API Execution:** Directly trigger API calls from within the chat flow, with dedicated fields for URL, method, headers, and body, and instant display of API responses.",
    "Seamless Data Handling:** Export and import your chat flow configurations in JSON format, and generate high-quality PNG images for documentation or sharing.",
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
       
      </div>
    </div>
  );
};

export default FeaturesModal;
