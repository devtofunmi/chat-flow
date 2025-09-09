import React from 'react';

interface FeaturesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeaturesModal: React.FC<FeaturesModalProps> = ({ isOpen, onClose }) => {

  const chatflowFeatures = [
    "Intuitive Node Management: Create and connect nodes effortlessly using natural language prompts (e.g., 'Add a node named \"Start\"', 'Connect node A to node B').",
    "Dynamic Flow Control: Clear the entire flow with a simple command ('Clear the flow') and optimize node arrangement with automatic layout recalculation.",
    "Comprehensive Node Inspection: Easily view and edit node properties through a dedicated inspection panel, ensuring precise control over your chat flow.",
    "Contextual Node Actions: Access advanced options like regenerating content or deleting nodes via a right-click context menu for efficient workflow management.",
    "Seamless Data Handling: Export and import your chat flow configurations in JSON format, and generate high-quality PNG images for documentation or sharing.",
  ];



  return (
    <div className={`fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className={`bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full relative transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 cursor-pointer text-gray-500 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">ChatFlow Features</h2>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Features:</h3>
          <ul className="text-gray-600 space-y-1">
            {chatflowFeatures.map((feature, index) => (
              <li key={index}>
                <span className="bg-[#f3f4f6] p-2 rounded-md block">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Example Prompt:</h3>
          <div className="bg-gray-100 p-3 rounded-md text-sm text-gray-800 overflow-x-auto">
              <p className='bg-[#f3f4f6]'>
                Try: Draw a 7-step network troubleshooting flow. Connect nodes sequentially. Each node&apos;s `label` = step name. `data` includes `payload` with `description`. Assign `messageType` for each step: &apos;user&apos; (steps 1, 6), &apos;ai&apos; (steps 2, 5), &apos;success&apos; (step 3), &apos;error&apos; (step 4), &apos;default&apos; (step 7).
              </p>
          </div>
        </div>
       
      </div>
    </div>
  );
};

export default FeaturesModal;
