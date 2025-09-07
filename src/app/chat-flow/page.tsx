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
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { ChatFlow, useFlowState } from "@/components/tambo/chat-flow";
import { z } from "zod";

export default function ChatFlowPage() {
  const [isChatOpen, setIsChatOpen] = useState(true);
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode, addEdge, clearFlow } = useFlowState();
  const apiKey = process.env.NEXT_PUBLIC_TAMBO_API_KEY;

  const flowTools: TamboTool[] = [
    {
      name: "addNode",
      description: "Adds a new node to the flowchart.",
      tool: addNode,
      toolSchema: z.function().args(
        z.object({
          id: z.string().describe("A unique identifier for the node."),
          data: z.any().describe("The data payload for the node."),
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
            isChatOpen ? "w-96" : "w-0"
          } border-r border-gray-200 bg-white transition-all duration-300 flex flex-col relative`}
        >
          {isChatOpen && (
            <>
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Chat Flow
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Try: "Draw a simple 3-step user authentication flow, connecting the steps in sequence.
                   For each node, the label should be the step name. Also, add a payload object to each node's data
                    containing a description of the step and a security_risk level from 1 to 5."
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
            className="absolute -right-10 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-r-lg p-2 hover:bg-gray-50"
          >
            {isChatOpen ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <ChatFlow 
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
          />
        </div>
      </div>
    </TamboProvider>
  );
}