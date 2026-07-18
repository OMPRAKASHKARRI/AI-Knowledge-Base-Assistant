import ReactMarkdown from 'react-markdown';
import { AlertCircle } from 'lucide-react';
import type { ConversationItem } from '../../types';
import { formatDate } from '../../utils/format';

const MessageBubble = ({ conversation }: { conversation: ConversationItem }) => (
  <div className="space-y-3">
    <div className="flex justify-end">
      <div className="max-w-[75%] bg-ledger-500 text-white rounded-card rounded-tr-sm px-4 py-2.5">
        <p className="text-sm">{conversation.question}</p>
      </div>
    </div>
    <div className="flex justify-start">
      <div
        className={`max-w-[75%] rounded-card rounded-tl-sm px-4 py-2.5 border ${
          conversation.status === 'failed'
            ? 'bg-signal-error/5 border-signal-error/20'
            : 'bg-white border-ink-200'
        }`}
      >
        {conversation.status === 'failed' && (
          <p className="flex items-center gap-1.5 text-xs text-signal-error font-medium mb-1.5">
            <AlertCircle className="w-3.5 h-3.5" /> AI service error
          </p>
        )}
        <div className="prose prose-sm max-w-none text-ink-800">
          <ReactMarkdown>{conversation.answer}</ReactMarkdown>
        </div>
        <p className="text-[11px] text-ink-400 font-mono mt-1.5">{formatDate(conversation.createdAt)}</p>
      </div>
    </div>
  </div>
);

export default MessageBubble;
