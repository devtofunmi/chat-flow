"use client";

import { cn } from "@/lib/utils";
import { TamboThreadMessage, useTambo } from "@tambo-ai/react";
import * as React from "react";

export interface MessageProps extends React.HTMLAttributes<HTMLDivElement> {
  role: "user" | "assistant";
  message: TamboThreadMessage;
  isLoading?: boolean;
  children?: React.ReactNode;
}

const Message = React.forwardRef<HTMLDivElement, MessageProps>(
  ({ children, className, role, message, isLoading, ...props }, ref) => {
    const contextValue = React.useMemo(
      () => ({
        message,
        isLoading: isLoading ?? false,
      }),
      [message, isLoading],
    );

    return (
      <MessageContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(
            "flex w-full my-2 bg-transparent",
            role === "assistant" ? "justify-start" : "justify-end",
            className,
          )}
          data-slot="message-container"
          {...props}
        >
          {children}
        </div>
      </MessageContext.Provider>
    );
  },
);
Message.displayName = "Message";

export interface MessageContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  isFinalAssistantMessage?: boolean; // Added prop
}

const MessageContent = React.forwardRef<
  HTMLDivElement,
  MessageContentProps
>(({ className, children, isFinalAssistantMessage, ...props }, ref) => {
  const { message, isLoading } = useMessageContext();

  return (
    <div
      ref={ref}
      className={cn("flex flex-col w-full",)}
      data-slot="message-content"
      {...props}
    >
      <MessageBubble isFinalAssistantMessage={isFinalAssistantMessage} />
      {children}
    </div>
  );
});
MessageContent.displayName = "Message.Content";

interface MessageBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  isFinalAssistantMessage?: boolean;
}

const MessageBubble = React.forwardRef<
  HTMLDivElement,
  MessageBubbleProps // Changed to MessageBubbleProps
>(({ className, isFinalAssistantMessage, ...props }, ref) => {
  const { message, isLoading } = useMessageContext();
  const isUser = message.role === "user";

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex flex-col text-sm ",
        isUser ? "self-end" : "self-start",
        className,
      )}
      {...props}
    >
      {isUser ? (
        // USER STYLE (pill bubble with px, py, rounded-full)
        <div className="px-4 py-2 rounded-full bg-gray-100 text-gray-900">
          {message.content?.map((part, idx) =>
            part.type === "text" ? (
              <span key={idx}>{part.text}</span>
            ) : null
          )}
        </div>
      ) : (
        // ASSISTANT STYLE
        <div className="flex items-start gap-2">
          <div className="flex flex-col">
            {isLoading ? (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100">
                <div className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground" />
                <div className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground delay-75" />
                <div className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground delay-150" />
              </div>
            ) : (
              message.content?.map((part, idx) =>
                part.type === "text" ? (
                  <p
                    key={idx}
                    className={cn(
                      "text-gray-800 bg-gray-100 rounded-lg  px-4 py-2",
                      isFinalAssistantMessage && "font-bold" 
                    )}
                    dangerouslySetInnerHTML={{ __html: part.text || '' }}
                  />
                ) : null
              )
            )}
            {!!message.metadata?.subtext && (
              <span className="text-sm text-gray-500 mt-1">
                {message.metadata.subtext as React.ReactNode}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
});
MessageBubble.displayName = "Message.Bubble";

export interface MessageRenderedComponentAreaProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const MessageRenderedComponentArea = React.forwardRef<
  HTMLDivElement,
  MessageRenderedComponentAreaProps
>(({ className, children, ...props }, ref) => {
  const { message } = useMessageContext();
  const { components: _components } = useTambo() as unknown as {
    components: Record<string, React.ComponentType<Record<string, unknown>>>;
  };

  if (!message.renderedComponent) {
    return null;
  }

  return (
    <div
      ref={ref}
      className={cn("flex flex-col gap-2", className)}
      data-slot="message-rendered-component-area"
      {...props}
    >
      {message.renderedComponent as React.ReactNode}
      {children}
    </div>
  );
});
MessageRenderedComponentArea.displayName = "Message.RenderedComponentArea";



interface MessageContextValue {
  message: TamboThreadMessage;
  isLoading: boolean;
}

const MessageContext = React.createContext<MessageContextValue | null>(null);

const useMessageContext = () => {
  const context = React.useContext(MessageContext);
  if (!context) {
    throw new Error(
      "Message sub-components must be used within a Message component",
    );
  }
  return context;
};

export {
  Message,
  MessageBubble,
  MessageContent,
  MessageRenderedComponentArea,
  useMessageContext,
};
