import { Edit2, Loader2, RotateCcw, Save, X } from 'lucide-react';
import type { AiDraftCard } from '@/types';

interface AiDraftCardItemProps {
  card: AiDraftCard;
  index: number;
  aiIsGenerating: boolean;
  onSaveEdit: (id: string) => void;
  onCancelEdit: (id: string) => void;
  onStartEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onRegenerate: (id: string) => void;
  onEditChange: (id: string, field: 'editQuestion' | 'editAnswer', value: string) => void;
}

export default function AiDraftCardItem({
  card,
  index,
  aiIsGenerating,
  onSaveEdit,
  onCancelEdit,
  onStartEdit,
  onDelete,
  onRegenerate,
  onEditChange,
}: AiDraftCardItemProps) {
  return (
    <div className="rounded-2xl border border-white/40 bg-white/60 shadow-sm overflow-hidden flex-shrink-0">
      <div className="px-5 py-4 flex items-start justify-between gap-4">
        <div className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">#{index + 1}</div>
        <div className="flex items-center gap-1">
          {card.isEditing ? (
            <>
              <button
                onClick={() => onSaveEdit(card.id)}
                className="p-2 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                title="确认"
              >
                <Save className="w-5 h-5" />
              </button>
              <button
                onClick={() => onCancelEdit(card.id)}
                className="p-2 rounded-xl text-slate-600 bg-white/70 hover:bg-white transition-colors"
                title="取消"
              >
                <X className="w-5 h-5" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onStartEdit(card.id)}
                className="p-2 rounded-xl text-slate-500 hover:text-indigo-700 hover:bg-white/70 transition-colors"
                title="编辑"
              >
                <Edit2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => onDelete(card.id)}
                className="p-2 rounded-xl text-slate-500 hover:text-red-700 hover:bg-white/70 transition-colors"
                title="删除"
              >
                <X className="w-5 h-5" />
              </button>
              <button
                onClick={() => onRegenerate(card.id)}
                disabled={card.isRegenerating || aiIsGenerating}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-white/70 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                title="重新生成"
              >
                {card.isRegenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <RotateCcw className="w-5 h-5" />}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="px-5 pb-5 space-y-4">
        {card.isEditing ? (
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">问题</div>
              <textarea
                value={card.editQuestion}
                onChange={(e) => onEditChange(card.id, 'editQuestion', e.target.value)}
                className="w-full min-h-[80px] px-4 py-3 rounded-2xl border border-white/40 bg-white/70 focus:ring-2 focus:ring-indigo-500 outline-none resize-y text-slate-900"
              />
            </div>
            <div className="space-y-1">
              <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">答案</div>
              <textarea
                value={card.editAnswer}
                onChange={(e) => onEditChange(card.id, 'editAnswer', e.target.value)}
                className="w-full min-h-[80px] px-4 py-3 rounded-2xl border border-white/40 bg-white/70 focus:ring-2 focus:ring-indigo-500 outline-none resize-y text-slate-900"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">问题</div>
              <div className="text-slate-900 font-bold leading-relaxed break-words">{card.question}</div>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">答案</div>
              <div className="text-slate-700 leading-relaxed break-words">{card.answer}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}