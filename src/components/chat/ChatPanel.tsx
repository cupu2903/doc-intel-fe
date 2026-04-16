'use client';

import { useChatHistory, useSendMessage } from '@/hooks/useChat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Bot, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

interface ChatPanelProps {
  documentId: string;
}

export function ChatPanel({ documentId }: ChatPanelProps) {
  const { data: messages, isLoading } = useChatHistory(documentId);
  const { mutate: sendMessage, isPending: isSending } = useSendMessage(documentId);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (!input.trim() || isSending) return;
    const msg = input;
    setInput('');
    sendMessage(msg);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  return (
    <aside className="w-[360px] h-screen flex flex-col border-l border-border bg-white shrink-0">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
            <Bot size={15} className="text-primary" />
          </div>
          <div>
            <h2 className="text-[11px] font-bold tracking-widest uppercase text-foreground">
              AI Assistant
            </h2>
            <p className="text-[10px] text-muted-foreground tracking-wider">
              Ask questions about this document
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-4 py-4">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="flex gap-1">
              <div className="typing-dot w-2 h-2 rounded-full bg-primary/40" />
              <div className="typing-dot w-2 h-2 rounded-full bg-primary/40" />
              <div className="typing-dot w-2 h-2 rounded-full bg-primary/40" />
            </div>
          </div>
        ) : messages?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-2 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center">
              <Bot size={22} className="text-primary/50" />
            </div>
            <p className="text-xs text-muted-foreground max-w-[180px]">
              Ask me anything about this document.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages?.map((msg: any) => {
              const isUser = msg.role === 'user';
              return (
                <div key={msg.id} className={cn('flex gap-2.5', isUser && 'flex-row-reverse')}>
                  <Avatar className={cn('w-7 h-7 shrink-0 mt-0.5', isUser ? 'bg-primary' : 'bg-muted')}>
                    <AvatarFallback className={cn('text-xs', isUser ? 'bg-primary text-white' : 'bg-muted text-muted-foreground')}>
                      {isUser ? <User size={13} /> : <Bot size={13} />}
                    </AvatarFallback>
                  </Avatar>

                  <div
                    className={cn(
                      'max-w-[80%] rounded-2xl px-3.5 py-2.5 shadow-sm text-xs leading-relaxed',
                      isUser
                        ? 'bg-primary text-white rounded-tr-sm'
                        : 'bg-muted text-foreground rounded-tl-sm border border-border'
                    )}
                  >
                    {isUser ? (
                      // User messages: plain text
                      <p>{msg.content}</p>
                    ) : (
                      // Assistant messages: render markdown
                      <div className="prose-chat">
                        <ReactMarkdown
                          components={{
                            // Paragraphs
                            p: ({ children }) => (
                              <p className="mb-2 last:mb-0">{children}</p>
                            ),
                            // Bold
                            strong: ({ children }) => (
                              <strong className="font-semibold text-foreground">{children}</strong>
                            ),
                            // Italic
                            em: ({ children }) => (
                              <em className="italic">{children}</em>
                            ),
                            // Unordered list
                            ul: ({ children }) => (
                              <ul className="mt-1 mb-2 space-y-1 list-none pl-0">{children}</ul>
                            ),
                            // Ordered list
                            ol: ({ children }) => (
                              <ol className="mt-1 mb-2 space-y-1 list-none pl-0 counter-reset-list">{children}</ol>
                            ),
                            // List items
                            li: ({ children }) => (
                              <li className="flex gap-1.5 items-start">
                                <span className="mt-1 w-1 h-1 rounded-full bg-primary/60 shrink-0" />
                                <span>{children}</span>
                              </li>
                            ),
                            // Inline code
                            code: ({ children }) => (
                              <code className="px-1 py-0.5 rounded bg-primary/10 text-primary font-mono text-[10px]">
                                {children}
                              </code>
                            ),
                            // Code block
                            pre: ({ children }) => (
                              <pre className="mt-2 mb-2 p-2.5 rounded-lg bg-foreground/5 overflow-x-auto font-mono text-[10px] leading-relaxed">
                                {children}
                              </pre>
                            ),
                            // Headings
                            h1: ({ children }) => (
                              <h1 className="text-sm font-bold mb-1.5 mt-2 first:mt-0">{children}</h1>
                            ),
                            h2: ({ children }) => (
                              <h2 className="text-xs font-bold mb-1 mt-2 first:mt-0">{children}</h2>
                            ),
                            h3: ({ children }) => (
                              <h3 className="text-xs font-semibold mb-1 mt-1.5 first:mt-0">{children}</h3>
                            ),
                            // Blockquote
                            blockquote: ({ children }) => (
                              <blockquote className="border-l-2 border-primary/40 pl-2.5 italic text-muted-foreground my-1.5">
                                {children}
                              </blockquote>
                            ),
                            // Horizontal rule
                            hr: () => <hr className="border-border my-2" />,
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Typing indicator */}
            {isSending && (
              <div className="flex gap-2.5">
                <Avatar className="w-7 h-7 shrink-0">
                  <AvatarFallback className="bg-muted text-muted-foreground">
                    <Bot size={13} />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted border border-border rounded-2xl rounded-tl-sm px-3.5 py-3 flex gap-1 items-center">
                  <div className="typing-dot w-1.5 h-1.5 rounded-full bg-primary/40" />
                  <div className="typing-dot w-1.5 h-1.5 rounded-full bg-primary/40" />
                  <div className="typing-dot w-1.5 h-1.5 rounded-full bg-primary/40" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </ScrollArea>

      {/* Input Bar */}
      <div className="px-4 py-3 border-t border-border bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <Input
            placeholder="Ask a question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isSending}
            className="flex-1 text-xs bg-background"
          />
          <Button
            type="submit"
            size="icon"
            className="shrink-0"
            isLoading={isSending}
            disabled={isSending || !input.trim()}
          >
            {!isSending && <Send size={15} />}
          </Button>
        </form>
      </div>
    </aside>
  );
}
