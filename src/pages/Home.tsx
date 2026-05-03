import { useState, useMemo } from 'react';
import { Plus, Search, Layers, Trophy, Target, Star } from 'lucide-react';
import { useFlashcardStore } from '@/store/useFlashcardStore';
import DeckCard from '@/components/DeckCard';

export default function Home() {
  const { decks, cards, addDeck } = useFlashcardStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDeckName, setNewDeckName] = useState('');
  const [newDeckDesc, setNewDeckDesc] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const logoUrl = "/logo.svg";

  const handleAddDeck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeckName.trim()) return;
    
    addDeck(newDeckName, newDeckDesc);
    setNewDeckName('');
    setNewDeckDesc('');
    setIsModalOpen(false);
  };

  const filteredDecks = useMemo(() => {
    return decks.filter(deck => 
      deck.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deck.description.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => b.updatedAt - a.updatedAt);
  }, [decks, searchQuery]);

  const totalCards = cards.length;
  const masteredCards = cards.filter(c => c.mastered).length;
  const xpPoints = masteredCards * 10 + totalCards * 2;

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Playful Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#EEF2FF] rounded-[2rem] p-8 md:p-10 border-4 border-[#4F46E5] shadow-[8px_8px_0px_#4F46E5] relative overflow-hidden">
        <div className="absolute -right-10 -top-10 text-[#818CF8]/20 z-0">
          <Star className="w-64 h-64" fill="currentColor" />
        </div>
        
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white flex items-center justify-center border-4 border-[#4F46E5] shadow-sm p-2 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
            <img src={logoUrl} alt="FlashMind Logo" className="w-full h-full object-contain" />
          </div>
          <div className="text-center sm:text-left">
            <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-[#312E81] tracking-tight leading-none mb-2">
              你好呀，小伙伴👋
            </h1>
            <p className="text-lg text-[#4F46E5] font-bold">
              准备好今天的脑力大挑战了吗？
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="relative z-10 inline-flex items-center justify-center px-8 py-4 bg-[#22C55E] text-white rounded-2xl font-bold text-lg border-b-4 border-green-700 hover:bg-green-400 hover:-translate-y-1 hover:shadow-xl active:translate-y-1 active:border-b-0 active:mt-[4px] transition-all duration-150"
        >
          <Plus className="w-6 h-6 mr-2" strokeWidth={3} />
          创建新卡包
        </button>
      </div>

      {/* Gamified Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border-4 border-gray-100 flex items-center gap-5 hover:border-[#4F46E5] transition-colors duration-300 group">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Layers className="w-8 h-8 text-[#4F46E5]" />
          </div>
          <div>
            <p className="text-gray-500 font-bold uppercase tracking-wider text-sm">我的卡包</p>
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-4xl font-extrabold text-[#312E81]">{decks.length}</span>
              <span className="text-gray-400 font-bold">个</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border-4 border-gray-100 flex items-center gap-5 hover:border-[#22C55E] transition-colors duration-300 group">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Target className="w-8 h-8 text-[#22C55E]" />
          </div>
          <div>
            <p className="text-gray-500 font-bold uppercase tracking-wider text-sm">已掌握知识</p>
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-4xl font-extrabold text-green-600">{masteredCards}</span>
              <span className="text-gray-400 font-bold">/ {totalCards}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border-4 border-gray-100 flex items-center gap-5 hover:border-[#F59E0B] transition-colors duration-300 group relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-amber-50 rounded-bl-full -z-10"></div>
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 group-hover:animate-bounce">
            <Trophy className="w-8 h-8 text-[#F59E0B]" />
          </div>
          <div>
            <p className="text-gray-500 font-bold uppercase tracking-wider text-sm">学习经验值</p>
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-4xl font-extrabold text-[#F59E0B]">{xpPoints}</span>
              <span className="text-gray-400 font-bold">XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-[2rem] border-4 border-gray-100 p-6 md:p-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
          <h2 className="font-heading text-3xl font-bold text-[#312E81] flex items-center">
            <Star className="w-8 h-8 text-[#F59E0B] mr-3 fill-current" />
            开始探索
          </h2>
          
          <div className="relative w-full sm:w-auto sm:min-w-[300px]">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="找找看哪个卡包..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-[#4F46E5] focus:bg-white outline-none text-gray-700 font-bold placeholder-gray-400 transition-all"
            />
          </div>
        </div>

        {/* Horizontal scrollable deck list for a more app-like feel */}
        {filteredDecks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDecks.map((deck) => (
              <DeckCard 
                key={deck.id} 
                deck={deck} 
                cardCount={cards.filter(c => c.deckId === deck.id).length} 
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl border-4 border-dashed border-gray-200">
            <div className="text-[64px] mb-4 animate-bounce">🤔</div>
            <h3 className="font-heading text-2xl font-bold text-[#312E81]">
              {searchQuery ? '哎呀，没有找到这个卡包' : '这里空空如也！'}
            </h3>
            <p className="text-gray-500 font-bold mt-2 mb-8 text-center max-w-sm">
              {searchQuery ? '换个名字搜搜看吧。' : '快点击下面的按钮，创建你的第一个专属卡包吧！'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-8 py-4 bg-[#4F46E5] text-white rounded-2xl font-bold text-lg hover:bg-indigo-500 hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
              >
                立即创建卡包
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create Deck Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#312E81]/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden border-4 border-[#4F46E5] animate-in zoom-in-95 duration-200">
            <div className="bg-[#EEF2FF] px-8 py-6 border-b-4 border-gray-100">
              <h2 className="font-heading text-3xl font-bold text-[#312E81]">🌟 新建卡包</h2>
              <p className="text-[#4F46E5] font-bold mt-1">给你的新知识起个响亮的名字！</p>
            </div>
            
            <form onSubmit={handleAddDeck} className="p-8 space-y-6">
              <div>
                <label htmlFor="deckName" className="block font-bold text-gray-700 mb-2">
                  卡包叫什么？ <span className="text-red-500">*</span>
                </label>
                <input
                  id="deckName"
                  type="text"
                  required
                  autoFocus
                  value={newDeckName}
                  onChange={(e) => setNewDeckName(e.target.value)}
                  placeholder="例如：神奇的动物英语"
                  className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-[#4F46E5] focus:bg-white outline-none transition-all font-bold text-lg"
                />
              </div>
              
              <div>
                <label htmlFor="deckDesc" className="block font-bold text-gray-700 mb-2">
                  简单描述一下（选填）
                </label>
                <textarea
                  id="deckDesc"
                  rows={3}
                  value={newDeckDesc}
                  onChange={(e) => setNewDeckDesc(e.target.value)}
                  placeholder="写点什么来激励自己吧！"
                  className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-[#4F46E5] focus:bg-white outline-none transition-all resize-none font-bold"
                />
              </div>
              
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-colors"
                >
                  算啦
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-4 bg-[#22C55E] text-white font-bold rounded-2xl border-b-4 border-green-700 hover:bg-green-400 hover:-translate-y-1 active:translate-y-0 active:border-b-0 active:mt-[4px] transition-all"
                >
                  创建！
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
