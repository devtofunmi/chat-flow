# Tambo AI Chat Flow Template

This template provides a dynamic and interactive chat flow builder, powered by Tambo AI. It allows developers to rapidly prototype and visualize conversational flows, process pipelines, or any sequence of interconnected steps, using natural language commands. The core idea is to bridge the gap between conceptual design and a working visual representation quickly and effectively.

## Features

*   **AI-Driven Flow Creation:** Utilize Tambo AI to build and modify flowcharts using natural language prompts. The AI can add nodes, connect them with edges, and clear the entire flow.
*   **Interactive Visual Editor:** Built with React Flow, offering a drag-and-drop interface for nodes and edges, zoom, pan, and selection capabilities.
*   **Node Manipulation:**
    *   Add new nodes with custom labels and descriptions.
    *   Connect nodes to define relationships.
    *   Delete individual nodes and their connected edges.
    *   Regenerate node content (if applicable).
    *   Update node data through an inspector panel.
*   **Layout Recalculation:** Automatically re-arrange nodes for better readability.
*   **Flow Import/Export:**
    *   Export the current flow structure (nodes and edges) as a JSON file.
    *   Export a visual snapshot of the flow as a PNG image.
    *   Import a flow from a JSON file, enabling easy sharing and versioning.
*   **Integrated Chat Interface:** A sidebar for interacting with the Tambo AI, sending commands, and receiving feedback.
*   **Features Modal:** A dedicated modal to explain the template's functionalities to the user.

## How It Works

This template leverages several key technologies to deliver its functionality:

1.  **Tambo AI (`@tambo-ai/react`):** The heart of the AI interaction. The `TamboProvider` wraps the application, enabling the AI to understand and execute predefined "tools."
2.  **AI Tools (`flowTools`):** Specific functions (`addNode`, `addEdge`, `clearFlow`) are exposed to the Tambo AI. These tools are defined with `zod` schemas, allowing the AI to understand their parameters and how to use them to manipulate the flowchart. When you type a command like "add a node called 'Start' at 100,100", Tambo AI calls the `addNode` tool with the appropriate arguments.
3.  **React Flow:** Provides the visual canvas for the flowchart. It handles rendering nodes and edges, user interactions (dragging, zooming), and layout.
4.  **`useFlowState`:** A custom hook (defined in `./components/chat-flow.tsx`) that manages the state of the nodes and edges for the React Flow instance. It provides functions to modify the flow, which are then exposed as AI tools.
5.  **Next.js:** The framework for the application, providing routing, API key handling, and server-side rendering capabilities.
6.  **Tailwind CSS:** Used for styling, ensuring a consistent and modern look with utility-first classes.

## Getting Started

Follow these steps to get the Chat Flow template up and running on your local machine.

### Prerequisites

*   Node.js (v18 or higher)
*   npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/devtofunmi/tambo-temp
    cd tambo-temp/src/app/chat-flow
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Configure your Tambo API Key:**
    Copy the example environment file:
    ```bash
    cp example.env.local .env.local
    ```
    Open `.env.local` and add your Tambo API Key:
    ```
    NEXT_PUBLIC_TAMBO_API_KEY=your_tambo_api_key_here
    ```
    You can obtain a Tambo API key from [Tambo AI website](https://tambo.co).

4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    Open [http://localhost:3000/chat-flow](http://localhost:3000/chat-flow) in your browser to see the application.

## How to Adapt and Extend

This template is designed to be a starting point. Here's how you can adapt it to your needs:

### 1. Adding Custom Nodes

To create new types of nodes for your specific use cases:

*   **Define a new React component** for your custom node's UI (e.g., `CustomNode.tsx` in `components/`).
*   **Register your custom node** in `src/app/chat-flow/components/chat-flow.tsx` by adding it to the `nodeTypes` object passed to `ReactFlow`.
*   **Update the `addNode` AI tool's schema** in `src/app/chat-flow/page.tsx` to include any new `messageType` or `data` properties relevant to your custom node.

### 2. Creating New AI Tools

Extend Tambo AI's capabilities by exposing more functions as tools:

*   **Identify a function** in your application logic (e.g., in `useFlowState` or a utility file) that you want the AI to be able to call.
*   **Define a new `TamboTool` object** in `src/app/chat-flow/page.tsx` within the `flowTools` array.
*   **Provide a clear `name` and `description`** for the tool.
*   **Define its `toolSchema` using `zod`** to specify the expected arguments and return type. This is crucial for the AI to understand how to use your tool.
*   **Add the new tool** to the `allTools` array.

Example: You could add a tool `connectNodes(sourceId: string, targetId: string)` if you wanted the AI to explicitly connect nodes by their IDs.

### 3. Modifying UI and Styling

*   **Tailwind CSS:** Adjust the `tailwind.config.ts` file to customize your design system (colors, fonts, spacing).
*   **Component Styling:** Modify the Tailwind classes directly within the JSX of components like `page.tsx`, `chat-flow.tsx`, `CustomNode.tsx`, or `node-inspector-panel.tsx`.
*   **Custom Components:** Replace or extend existing UI components with your own to match your application's aesthetic.

### 4. Integrating with Backend Services

*   The `TamboProvider` can be configured with a `tamboUrl` to point to your own Tambo backend instance.
*   You can create new AI tools that make API calls to your backend services, allowing the AI to orchestrate complex operations.

## File Structure Overview

```
src/app/chat-flow/
├── page.tsx                  # Main page for the chat flow, integrates all components and Tambo AI.
├── components/
│   ├── chat-flow.tsx         # React Flow setup, handles node/edge rendering and interactions.
│   ├── CustomNode.tsx        # Example of a custom node component.
│   ├── FeaturesModal.tsx     # Modal to explain template features.
│   ├── node-inspector-panel.tsx # Panel to view/edit selected node properties.
│   └── NodeContextMenu.tsx   # Context menu for nodes (e.g., delete, regenerate).
└── README.md                 # This file.
```

## Conclusion

This Tambo AI Chat Flow template offers a powerful starting point for building intelligent, interactive applications. By understanding how Tambo AI interacts with the UI through defined tools, you can rapidly develop complex systems that respond to natural language commands. I encourage you to explore, adapt, and extend this template to bring your unique concepts to life!
