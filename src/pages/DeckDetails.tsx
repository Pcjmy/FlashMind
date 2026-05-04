import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Play, 
  Edit2, 
  Trash2, 
  Save, 
  X,
  CheckCircle2,
  Circle,
  Wand2
} from 'lucide-react';
import { useFlashcardStore } from '@/store/useFlashcardStore';
import AiGenerateModal from '@/components/ai/AiGenerateModal';

export default function DeckDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    decks, 
    cards, 
    updateDeck, 
    addCard, 
    updateCard, 
    deleteCard, 
    toggleMastered 
  } = useFlashcardStore();

  const deck = decks.find(d => d.id === id);
  const deckCards = cards.filter(c => c.deckId === id);

  const [isEditingDeck, setIsEditingDeck] = useState(false);
  const [deckName, setDeckName] = useState(deck?.name || '');
  const [deckDesc, setDeckDesc] = useState(deck?.description || '');

  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');

  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editQuestion, setEditQuestion] = useState('');
  const [editAnswer, setEditAnswer] = useState('');

  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const openAiModal = () => {
    setIsAiModalOpen(true);
  };

  const closeAiModal = () => {
    setIsAiModalOpen(false);
  };

  if (!deck) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-2xl font-bold text-gray-900">牌组未找到</h2>
        <Link to="/" className="mt-4 text-blue-600 hover:underline">返回首页</Link>
      </div>
    );
  }

  const handleUpdateDeck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deckName.trim()) return;
    updateDeck(deck.id, deckName, deckDesc);
    setIsEditingDeck(false);
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) return;
    addCard(deck.id, newQuestion, newAnswer);
    setNewQuestion('');
    setNewAnswer('');
    setIsAddingCard(false);
  };

  const startEditingCard = (cardId: string, q: string, a: string) => {
    setEditingCardId(cardId);
    setEditQuestion(q);
    setEditAnswer(a);
  };

  const handleUpdateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCardId || !editQuestion.trim() || !editAnswer.trim()) return;
    updateCard(editingCardId, editQuestion, editAnswer);
    setEditingCardId(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-gray-500 hover:text-blue-600 transition-colors font-medium group"
        >
          <ArrowLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
          返回列表
        </button>
        
        {deckCards.length > 0 && (
          <Link
            to={`/dashboard/study/${deck.id}`}
            className="inline-flex items-center px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-md hover:bg-blue-700 transition-all hover:shadow-lg active:scale-95"
          >
            <Play className="w-4 h-4 mr-2 fill-current" />
            开始学习 ({deckCards.length})
          </Link>
        )}
      </div>

      {/* Deck Info Header */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        {isEditingDeck ? (
          <form onSubmit={handleUpdateDeck} className="space-y-4">
            <input
              type="text"
              value={deckName}
              onChange={(e) => setDeckName(e.target.value)}
              className="w-full text-3xl font-bold bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              autoFocus
            />
            <textarea
              value={deckDesc}
              onChange={(e) => setDeckDesc(e.target.value)}
              className="w-full text-gray-600 bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              rows={2}
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
              >
                保存修改
              </button>
              <button
                type="button"
                onClick={() => setIsEditingDeck(false)}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg font-semibold hover:bg-gray-200"
              >
                取消
              </button>
            </div>
          </form>
        ) : (
          <div className="flex justify-between items-start">
            <div className="flex-grow">
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{deck.name}</h1>
              <p className="mt-3 text-lg text-gray-500 max-w-2xl">{deck.description || '暂无描述'}</p>
              <div className="mt-6 flex items-center space-x-4">
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-bold border border-blue-100">
                  {deckCards.length} 张卡片
                </span>
                <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-bold border border-green-100">
                  {deckCards.filter(c => c.mastered).length} 已掌握
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={openAiModal}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-bold shadow-md hover:bg-indigo-700 transition-all active:scale-95"
                title="AI 生成闪卡"
              >
                <Wand2 className="w-5 h-5" />
                AI 生成
              </button>
              <button
                onClick={() => {
                  setDeckName(deck.name);
                  setDeckDesc(deck.description);
                  setIsEditingDeck(true);
                }}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                title="编辑学习集信息"
              >
                <Edit2 className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Cards Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">卡片管理</h2>
          {!isAddingCard && (
            <button
              onClick={() => setIsAddingCard(true)}
              className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all active:scale-95 shadow-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              添加卡片
            </button>
          )}
        </div>

        {/* Add Card Form */}
        {isAddingCard && (
          <div className="bg-blue-50/50 rounded-2xl p-6 border-2 border-dashed border-blue-200 animate-in zoom-in-95 duration-200">
            <form onSubmit={handleAddCard} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-blue-600 uppercase tracking-wider mb-2 ml-1">问题 (正面)</label>
                  <textarea
                    required
                    autoFocus
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="输入问题或提示..."
                    className="w-full px-4 py-3 bg-white border border-blue-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px] shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-blue-600 uppercase tracking-wider mb-2 ml-1">答案 (背面)</label>
                  <textarea
                    required
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    placeholder="输入正确答案..."
                    className="w-full px-4 py-3 bg-white border border-blue-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px] shadow-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddingCard(false)}
                  className="px-6 py-2.5 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-8 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-md transition-all active:scale-95"
                >
                  确认添加
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Cards List */}
        <div className="space-y-4">
          {deckCards.length > 0 ? (
            deckCards.sort((a, b) => b.createdAt - a.createdAt).map((card) => (
              <div
                key={card.id}
                className={`bg-white rounded-2xl border transition-all duration-300 ${
                  editingCardId === card.id 
                    ? 'border-blue-500 shadow-lg ring-1 ring-blue-500 ring-opacity-50' 
                    : 'border-gray-100 hover:border-blue-200 hover:shadow-md'
                }`}
              >
                {editingCardId === card.id ? (
                  <form onSubmit={handleUpdateCard} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <textarea
                        value={editQuestion}
                        onChange={(e) => setEditQuestion(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none min-h-[80px]"
                        autoFocus
                      />
                      <textarea
                        value={editAnswer}
                        onChange={(e) => setEditAnswer(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none min-h-[80px]"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="submit"
                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        title="保存"
                      >
                        <Save className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingCardId(null)}
                        className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                        title="取消"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="p-6 flex items-start gap-4">
                    <button
                      onClick={() => toggleMastered(card.id)}
                      className={`mt-1 transition-colors ${
                        card.mastered ? 'text-green-500' : 'text-gray-300 hover:text-blue-500'
                      }`}
                      title={card.mastered ? "取消掌握标记" : "标记为已掌握"}
                    >
                      {card.mastered ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                    </button>
                    
                    <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">问题</span>
                        <p className="text-gray-900 font-medium break-words leading-relaxed">{card.question}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">答案</span>
                        <p className="text-gray-600 break-words leading-relaxed">{card.answer}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => startEditingCard(card.id, card.question, card.answer)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="编辑卡片"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('确定要删除这张卡片吗？')) {
                            deleteCard(card.id);
                          }
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="删除卡片"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <Plus className="w-12 h-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-bold text-gray-900">牌组还是空的</h3>
              <p className="text-gray-500 mt-1">添加一些卡片来开始学习吧！</p>
              <button
                onClick={() => setIsAddingCard(true)}
                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-sm"
              >
                立即添加
              </button>
            </div>
          )}
        </div>
      </div>

      <AiGenerateModal isOpen={isAiModalOpen} onClose={closeAiModal} deckId={deck.id} addCard={addCard} />
    </div>
  );
}
