import { useState } from 'react';
import { Loader2, Sparkles, X } from 'lucide-react';
import AiDraftCardItem from './AiDraftCardItem';
import type { AiMode, AiDraftCard, OpenAiChatMessage } from '@/types';

interface AiGenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
  deckId: string;
  addCard: (deckId: string, question: string, answer: string) => void;
}

export default function AiGenerateModal({ isOpen, onClose, deckId, addCard }: AiGenerateModalProps) {
  const todayKey = new Date().toISOString().slice(0, 10);
  const aiDailyLimit = 20;
  const aiUsedStorageKey = `flashmind_ai_used_${todayKey}`;

  const [aiMode, setAiMode] = useState<AiMode>('basic');
  const [aiInputText, setAiInputText] = useState('');
  const [aiIsGenerating, setAiIsGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiDraftCards, setAiDraftCards] = useState<AiDraftCard[]>([]);
  const [aiUsedToday, setAiUsedToday] = useState(() => {
    try {
      const raw = localStorage.getItem(aiUsedStorageKey);
      const parsed = Number(raw ?? '0');
      return Number.isFinite(parsed) ? parsed : 0;
    } catch {
      return 0;
    }
  });

  const aiRemainingToday = Math.max(0, aiDailyLimit - aiUsedToday);

  const createId = () => {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
    return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
  };

  const extractJsonLike = (text: string) => {
    const trimmed = text.trim();
    const firstArray = trimmed.indexOf('[');
    const lastArray = trimmed.lastIndexOf(']');
    if (firstArray !== -1 && lastArray !== -1 && lastArray > firstArray) {
      return trimmed.slice(firstArray, lastArray + 1);
    }
    const firstObj = trimmed.indexOf('{');
    const lastObj = trimmed.lastIndexOf('}');
    if (firstObj !== -1 && lastObj !== -1 && lastObj > firstObj) {
      return trimmed.slice(firstObj, lastObj + 1);
    }
    return trimmed;
  };

  const parseGeneratedCards = (content: string) => {
    const candidate = extractJsonLike(content);
    const parsed = JSON.parse(candidate) as unknown;
    const asArray = Array.isArray(parsed) ? parsed : null;
    const asCardsProp =
      parsed && typeof parsed === 'object' && 'cards' in parsed && Array.isArray((parsed as { cards: unknown }).cards)
        ? ((parsed as { cards: unknown }).cards as unknown[])
        : null;
    const rawCards = asArray ?? asCardsProp ?? [];
    return rawCards
      .filter((c): c is { question: unknown; answer: unknown } => !!c && typeof c === 'object' && 'question' in c && 'answer' in c)
      .map((c) => ({
        question: String(c.question ?? '').trim(),
        answer: String(c.answer ?? '').trim(),
      }))
      .filter((c) => c.question.length > 0 && c.answer.length > 0);
  };

  const resetModalState = () => {
    setAiMode('basic');
    setAiInputText('');
    setAiIsGenerating(false);
    setAiError(null);
    setAiDraftCards([]);
  };

  const close = () => {
    resetModalState();
    onClose();
  };

  const bumpAiUsage = () => {
    const next = aiUsedToday + 1;
    setAiUsedToday(next);
    try {
      localStorage.setItem(aiUsedStorageKey, String(next));
    } catch {
      return;
    }
  };

  const openAiChat = async (messages: OpenAiChatMessage[]) => {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        temperature: 0.4,
      }),
    });

    const json = (await res.json().catch(() => null)) as
      | {
          choices?: Array<{
            message?: { content?: string };
          }>;
          error?: { message?: string };
        }
      | null;

    if (!res.ok) {
      const msg = json?.error?.message || `请求失败（HTTP ${res.status}）`;
      throw new Error(msg);
    }

    const content = json?.choices?.[0]?.message?.content;
    if (!content) throw new Error('模型没有返回内容');
    return content;
  };

  const handleAiGenerate = async () => {
    setAiError(null);
    if (!aiInputText.trim()) return;
    if (aiRemainingToday <= 0) {
      setAiError('今日剩余次数已用完');
      return;
    }

    setAiIsGenerating(true);
    try {
      const modeHint = aiMode === 'basic' ? '基础模式（记忆+理解）' : '深度模式（全部六层）';
      const content = await openAiChat([
        {
          role: 'system',
          content:
            '你是一个闪卡生成器。只输出严格 JSON，不要输出任何解释、Markdown 或代码块。输出格式为数组：[{ "question": "...", "answer": "..." }...]。问题要清晰短句，答案要准确且可记忆。每条 QA 尽量覆盖不同知识点，避免重复。',
        },
        {
          role: 'user',
          content: `请基于以下文本生成 8-12 张中文闪卡（问答对），模式：${modeHint}。\n\n文本：\n${aiInputText}`,
        },
      ]);

      const parsedCards = parseGeneratedCards(content).slice(0, 12);
      if (parsedCards.length === 0) throw new Error('解析失败：没有得到任何问答对 JSON');

      setAiDraftCards(
        parsedCards.map((c) => ({
          id: createId(),
          question: c.question,
          answer: c.answer,
          isEditing: false,
          editQuestion: c.question,
          editAnswer: c.answer,
          isRegenerating: false,
        }))
      );
      bumpAiUsage();
    } catch (err) {
      const msg = err instanceof Error ? err.message : '生成失败';
      setAiError(msg);
    } finally {
      setAiIsGenerating(false);
    }
  };

  const handleAiDeleteDraft = (draftId: string) => {
    setAiDraftCards((prev) => prev.filter((c) => c.id !== draftId));
  };

  const handleAiStartEditDraft = (draftId: string) => {
    setAiDraftCards((prev) =>
      prev.map((c) => (c.id === draftId ? { ...c, isEditing: true, editQuestion: c.question, editAnswer: c.answer } : c))
    );
  };

  const handleAiCancelEditDraft = (draftId: string) => {
    setAiDraftCards((prev) => prev.map((c) => (c.id === draftId ? { ...c, isEditing: false } : c)));
  };

  const handleAiSaveEditDraft = (draftId: string) => {
    setAiDraftCards((prev) =>
      prev.map((c) => {
        if (c.id !== draftId) return c;
        const q = c.editQuestion.trim();
        const a = c.editAnswer.trim();
        if (!q || !a) return c;
        return { ...c, question: q, answer: a, isEditing: false };
      })
    );
  };

  const handleAiRegenerateDraft = async (draftId: string) => {
    const target = aiDraftCards.find((c) => c.id === draftId);
    if (!target) return;
    if (!aiInputText.trim()) {
      setAiError('请先填写上方文本内容（用于生成上下文）');
      return;
    }
    if (aiRemainingToday <= 0) {
      setAiError('今日剩余次数已用完');
      return;
    }

    setAiError(null);
    setAiDraftCards((prev) => prev.map((c) => (c.id === draftId ? { ...c, isRegenerating: true } : c)));
    try {
      const content = await openAiChat([
        {
          role: 'system',
          content:
            '你是一个闪卡生成器。只输出严格 JSON，不要输出任何解释、Markdown 或代码块。输出格式为：{ "question": "...", "answer": "..." }。',
        },
        {
          role: 'user',
          content: `基于以下文本，为“同一知识点”重新生成一张更好的中文闪卡。\n要求：问题更清晰，答案更精炼可记忆。\n\n原问题：${target.question}\n原答案：${target.answer}\n\n文本：\n${aiInputText}`,
        },
      ]);

      const candidate = extractJsonLike(content);
      const parsed = JSON.parse(candidate) as { question?: unknown; answer?: unknown };
      const nextQuestion = String(parsed.question ?? '').trim();
      const nextAnswer = String(parsed.answer ?? '').trim();
      if (!nextQuestion || !nextAnswer) throw new Error('解析失败：模型返回不是有效的 {question, answer} JSON');

      setAiDraftCards((prev) =>
        prev.map((c) =>
          c.id === draftId
            ? {
                ...c,
                question: nextQuestion,
                answer: nextAnswer,
                editQuestion: nextQuestion,
                editAnswer: nextAnswer,
                isEditing: false,
              }
            : c
        )
      );
      bumpAiUsage();
    } catch (err) {
      const msg = err instanceof Error ? err.message : '重新生成失败';
      setAiError(msg);
    } finally {
      setAiDraftCards((prev) => prev.map((c) => (c.id === draftId ? { ...c, isRegenerating: false } : c)));
    }
  };

  const handleAiEditDraftChange = (draftId: string, field: 'editQuestion' | 'editAnswer', value: string) => {
    setAiDraftCards((prev) =>
      prev.map((c) => (c.id === draftId ? { ...c, [field]: value } : c))
    );
  };

  const handleAiSaveToDeck = () => {
    if (aiDraftCards.length === 0) return;
    aiDraftCards.forEach((c) => {
      const q = c.question.trim();
      const a = c.answer.trim();
      if (!q || !a) return;
      addCard(deckId, q, a);
    });
    close();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1020]/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-[2rem] border border-white/20 bg-white/70 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header - Fixed */}
        <div className="px-8 py-6 border-b border-white/30 bg-white/40 flex-shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-heading text-3xl font-extrabold text-[#0F172A] tracking-tight">AI 生成闪卡</h2>
              <p className="mt-1 text-sm font-bold text-slate-500">
                今日剩余 {aiRemainingToday} 次 / <span className="text-indigo-600">Plus 无限</span>
              </p>
            </div>
            <button
              onClick={close}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-white/60 transition-colors"
              title="关闭"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">文本区</label>
            <textarea
              value={aiInputText}
              onChange={(e) => setAiInputText(e.target.value)}
              placeholder="粘贴你的笔记、课本段落或任何学习内容..."
              className="w-full min-h-[140px] px-4 py-3 rounded-2xl border border-white/40 bg-white/60 focus:ring-2 focus:ring-indigo-500 outline-none resize-y text-slate-900 placeholder-slate-400 shadow-sm"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">层级选择（v1.0）</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="flex items-center gap-3 p-4 rounded-2xl border border-white/40 bg-white/60 cursor-pointer hover:bg-white/70 transition-colors">
                <input
                  type="radio"
                  name="aiMode"
                  value="basic"
                  checked={aiMode === 'basic'}
                  onChange={() => setAiMode('basic')}
                  className="h-5 w-5"
                />
                <div className="flex-1">
                  <div className="font-extrabold text-slate-900">基础模式</div>
                  <div className="text-sm text-slate-500 font-bold">记忆 + 理解</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 rounded-2xl border border-white/30 bg-white/30 opacity-70 cursor-not-allowed">
                <input type="radio" name="aiMode" value="deep" disabled className="h-5 w-5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-extrabold text-slate-700">深度模式</div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-600 text-white">Pro</span>
                  </div>
                  <div className="text-sm text-slate-500 font-bold">全部六层</div>
                </div>
              </label>
            </div>
          </div>

          {aiError && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 font-bold">{aiError}</div>}

          <div className="flex items-center justify-between gap-4">
            <button
              onClick={handleAiGenerate}
              disabled={aiIsGenerating || !aiInputText.trim() || aiRemainingToday <= 0}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-extrabold shadow-md hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              {aiIsGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              生成
            </button>

            {aiDraftCards.length > 0 && (
              <div className="text-sm font-bold text-slate-500">
                已生成 <span className="text-slate-900">{aiDraftCards.length}</span> 张
              </div>
            )}
          </div>

          {aiDraftCards.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between sticky top-0 bg-white/70 backdrop-blur-md py-2 z-10 border-b border-white/30 -mx-2 px-2">
                <h3 className="text-lg font-extrabold text-slate-900">结果区</h3>
                <div className="text-xs font-bold text-slate-500">问题在上，答案在下</div>
              </div>

              <div className="space-y-3">
                {aiDraftCards.map((c, idx) => (
                  <AiDraftCardItem
                    key={c.id}
                    card={c}
                    index={idx}
                    aiIsGenerating={aiIsGenerating}
                    onSaveEdit={handleAiSaveEditDraft}
                    onCancelEdit={handleAiCancelEditDraft}
                    onStartEdit={handleAiStartEditDraft}
                    onDelete={handleAiDeleteDraft}
                    onRegenerate={handleAiRegenerateDraft}
                    onEditChange={handleAiEditDraftChange}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer - Fixed */}
        <div className="px-8 py-4 border-t border-white/30 bg-white/40 flex-shrink-0 flex justify-end gap-3">
          <button onClick={close} className="px-6 py-3 rounded-2xl bg-white/70 text-slate-700 font-extrabold hover:bg-white transition-colors">
            取消
          </button>
          <button
            onClick={handleAiSaveToDeck}
            disabled={aiDraftCards.length === 0}
            className="px-6 py-3 rounded-2xl bg-emerald-600 text-white font-extrabold shadow-md hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            保存到学习集
          </button>
        </div>
      </div>
    </div>
  );
}
