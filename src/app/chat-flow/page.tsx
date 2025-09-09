"use client";

import {
  MessageInput,
  MessageInputSubmitButton,
  MessageInputTextarea,
  MessageInputToolbar,
} from "@/components/tambo/message-input";
import { ScrollableMessageContainer } from "@/components/tambo/scrollable-message-container";
import {
  ThreadContent,
  ThreadContentMessages,
} from "@/components/tambo/thread-content";
import { components, tools as staticTools } from "@/lib/tambo";
import { TamboProvider, TamboTool } from "@tambo-ai/react";
import { ChevronRight, Menu, MessageSquare } from "lucide-react";
import { useState, useRef } from "react";
import { ChatFlow, useFlowState } from "./components/chat-flow";
import { z } from "zod";
import { saveAs } from "file-saver";
import { toPng } from "html-to-image";

import FeaturesModal from './components/FeaturesModal';

export default function ChatFlowPage() {
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isFeaturesModalOpen, setIsFeaturesModalOpen] = useState(false);

  const { 
    nodes, 
    edges, 
    onNodesChange, 
    onEdgesChange, 
    onConnect, 
    addNode, 
    addEdge, 
    clearFlow,
    recalculateLayout,
    deleteNodeAndConnectedElements,
    regenerateNode,
    updateNodeData,
    setFlow,
  } = useFlowState();
  const apiKey = process.env.NEXT_PUBLIC_TAMBO_API_KEY;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const handleOpenFeaturesModal = () => {
    setIsFeaturesModalOpen(true);
  };

  const handleCloseFeaturesModal = () => {
    setIsFeaturesModalOpen(false);
  };

  const onExport = (format: 'json' | 'png') => {
    if (format === 'json') {
      const flow = { nodes, edges };
      const blob = new Blob([JSON.stringify(flow, null, 2)], { type: 'application/json' });
      saveAs(blob, 'chat-flow.json');
    } else if (format === 'png') {
      if (reactFlowWrapper.current) {
        const getAllCss = () => {
          return Array.from(document.styleSheets)
            .map(sheet => {
              try {
                return Array.from(sheet.cssRules)
                  .map(rule => rule.cssText)
                  .join('');
              } catch (e) {
                console.log('Could not read stylesheet: ', sheet.href);
                return '';
              }
            })
            .join('');
        };

        const style = document.createElement('style');
        style.innerHTML = getAllCss();
        reactFlowWrapper.current.appendChild(style);

        toPng(reactFlowWrapper.current, {
          cacheBust: true,
          pixelRatio: 2,
          width: reactFlowWrapper.current.scrollWidth,
          height: reactFlowWrapper.current.scrollHeight,
          backgroundColor: '#F9FAFB',
          filter: (node) => {
            return !node.classList?.contains('react-flow__controls');
          },
        })
          .then((dataUrl) => {
            saveAs(dataUrl, 'chat-flow.png');
          })
          .catch((err) => {
            console.error('oops, something went wrong!', err);
          })
          .finally(() => {
            if (reactFlowWrapper.current) {
              reactFlowWrapper.current.removeChild(style);
            }
          });
      }
    }
  };

  const onImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (_e) => {
        const content = _e.target?.result;
        if (typeof content === 'string') {
          try {
            const flow = JSON.parse(content);
            setFlow(flow);
          } catch (error) {
            console.error('Error parsing JSON file:', error);
            alert('Error parsing JSON file.');
          }
        }
      };
      reader.readAsText(file);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const flowTools: TamboTool[] = [
    {
      name: "addNode",
      description: "Adds a new node to the flowchart.",
      tool: addNode,
      toolSchema: z.function().args(
        z.object({
          id: z.string().describe("A unique identifier for the node."),
          data: z.object({
            label: z.string().describe("The text to display on the node."),
            messageType: z.string().optional().describe("The type of message (e.g., 'user', 'ai', 'success', 'error')."),
            description: z.string().optional().describe("A detailed description for the node."), // Changed from payload to description
          }).describe("The data for the node."), // Updated description
          x: z.number().describe("The x-coordinate for the node's position."),
          y: z.number().describe("The y-coordinate for the node's position."),
        })
      ).returns(z.string()),
    },
    {
      name: "addEdge",
      description: "Adds a new edge to connect two nodes in the flowchart.",
      tool: addEdge,
      toolSchema: z.function().args(
        z.object({
          source: z.string().describe("The ID of the source node."),
          target: z.string().describe("The ID of the target node."),
        })
      ).returns(z.string()),
    },
    {
        name: "clearFlow",
        description: "Removes all nodes and edges from the flowchart.",
        tool: clearFlow,
        toolSchema: z.function().args().returns(z.string()),
    }
  ];

  const allTools = [...staticTools, ...flowTools];

  if (!apiKey) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center p-4 rounded-lg bg-white shadow-md max-w-md">
          <h2 className="text-lg font-semibold text-gray-900">
            Tambo API Key Missing
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Please set your{" "}
            <code className="font-mono bg-gray-200 rounded px-1">
              NEXT_PUBLIC_TAMBO_API_KEY
            </code>{" "}
            in an environment file.
          </p>
          <p className="mt-2 text-xs text-gray-500">
            You can copy{" "}
            <code className="font-mono bg-gray-200 rounded px-1">example.env.local</code> to{" "}
            <code className="font-mono bg-gray-200 rounded px-1">.env.local</code> and add your key there.
          </p>
        </div>
      </div>
    );
  }

  return (
    <TamboProvider
      apiKey={apiKey}
      components={components}
      tools={allTools}
      tamboUrl={process.env.NEXT_PUBLIC_TAMBO_URL}
    >

      <div className="flex h-screen bg-gray-50">
        {/* Chat Sidebar */}
        <div
          className={`${
            isChatOpen ? "w-96" : "w-16"
          } border-r border-gray-200 bg-white transition-all duration-300 flex flex-col relative`}
        >
          {isChatOpen && (
            <>
              <div className="p-4 mt-12 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Chat Flow
                </h2>
               <p className="text-sm text-gray-600 mt-1">
                 check features
               </p>


              </div>

              <ScrollableMessageContainer className="flex-1 p-4">
                <ThreadContent variant="default">
                  <ThreadContentMessages />
                </ThreadContent>
              </ScrollableMessageContainer>

              <div className="p-4 border-t border-gray-200">
                <MessageInput
                  contextKey="interactables-demo"
                  variant="bordered"
                >
                  <MessageInputTextarea placeholder="Build your flow..." />
                  <MessageInputToolbar>
                    <MessageInputSubmitButton />
                  </MessageInputToolbar>
                </MessageInput>
              </div>
            </>
          )}

          {/* Toggle Button */}
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="fixed top-5 left-2 bg-gray-100 rounded-full p-2 hover:bg-gray-200 shadow-md z-50"
            title={isChatOpen ? "Close Sidebar" : "Open Sidebar"}
          >
            {isChatOpen ? (
              <MessageSquare className="w-4 h-4" />
            ) : (
               <MessageSquare className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto relative">
          <div className="absolute top-4 right-4 z-10 flex space-x-2">
            <button
              onClick={recalculateLayout}
              className="cursor-pointer hover:bg-[#333333] bg-black/90 text-white  py-2 px-3 rounded-lg"
            >
              Recalculate Layout
            </button>
            <button
              onClick={handleOpenFeaturesModal}
              className="cursor-pointer hover:bg-[#333333] bg-black/90 text-white  py-2 px-3 rounded-lg"
            >
              Features
            </button>
          </div>
          <ChatFlow 
            ref={reactFlowWrapper}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDeleteNode={deleteNodeAndConnectedElements} 
            onRegenerateNode={regenerateNode}         
                        updateNodeData={updateNodeData}
            setFlow={setFlow}
          />
          <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center z-10">
            <div className="flex flex-row space-x-2 p-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-md">
                <button onClick={() => onExport('json')} title="Export JSON" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-3 py-1 text-sm">
                    JSON
                </button>
                <button onClick={() => onExport('png')} title="Export PNG" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-3 py-1 text-sm">
                    PNG
                </button>
                <button onClick={handleImportClick} title="Import JSON" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-3 py-1 text-sm">
                    IMPORT
                </button>
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={onImport}
            accept=".json"
          />
        </div>
      </div>
      <FeaturesModal isOpen={isFeaturesModalOpen} onClose={handleCloseFeaturesModal} />
    </TamboProvider>
  );
}