import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Send, MessageSquare } from 'lucide-react';
import type { ConversationItem } from '../../types';
import MessageBubble from './MessageBubble';
import EmptyState from '../common/EmptyState';

interface ChatWindowProps {
  conversations: ConversationItem[];
  onSend: (question: string) => Promise<void>;
  isSending: boolean;
  disabled: boolean;
  disabledReason?: string;
}

const ChatWindow = ({ conversations, onSend, isSending, disabled, disabledReason }: ChatWindowProps) => {
  const [question, setQuestion] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations.length, isSending]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!question.trim() || disabled || isSending) return;
    const q = question;
    setQuestion('');
    await onSend(q);
  };

  return (
    <div className="card flex flex-col h-[65vh]">
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {conversations.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="No questions yet"
            description="Ask anything about the selected document — answers are grounded in its content."
          />
        ) : (
          conversations.map((c) => <MessageBubble key={c._id} conversation={c} />)
        )}
        {isSending && (
          <div className="flex justify-start">
            <div className="bg-white border border-ink-200 rounded-card rounded-tl-sm px-4 py-3 flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-ink-400 animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-ink-400 animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-ink-400 animate-bounce" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-ink-200 p-3">
        <input
          className="input-field flex-1"
          placeholder={disabled ? disabledReason || 'Select a document to begin' : 'Ask a question about this document…'}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={disabled || isSending}
        />
        <button type="submit" className="btn-primary !px-3.5" disabled={disabled || isSending || !question.trim()}>
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
