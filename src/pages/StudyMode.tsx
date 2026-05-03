import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Circle,
  Trophy,
  RefreshCw,
  Home
} from 'lucide-react';
import { useFlashcardStore } from '@/store/useFlashcardStore';

export default function StudyMode() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { decks, cards, toggleMastered, resetMastery } = useFlashcardStore();

  const deck = decks.find(d => d.id === id);
  const deckCards = useMemo(() => cards.filter(c => c.deckId === id), [cards, id]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  if (!deck || deckCards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in fade-in">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <RotateCcw className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">无法开始学习</h2>
        <p className="text-gray-500 mt-2">牌组不存在或没有任何卡片。</p>
        <Link 
          to={id ? `/dashboard/deck/${id}` : '/dashboard'} 
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
        >
          返回添加卡片
        </Link>
      </div>
    );
  }

  const currentCard = deckCards[currentIndex];
  const progress = ((currentIndex + 1) / deckCards.length) * 100;
  const masteredCount = deckCards.filter(c => c.mastered).length;

  const handleNext = () => {
    if (currentIndex < deckCards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(prev => prev + 1), 100);
    } else {
      setIsFinished(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(prev => prev - 1), 100);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsFinished(false);
  };

  const handleResetMastery = () => {
    if (window.confirm('确定要重置当前牌组的所有掌握进度吗？')) {
      resetMastery(deck.id);
    }
  };

  if (isFinished) {
    return (
      <div className="max-w-md mx-auto py-12 px-6 bg-white rounded-3xl shadow-xl border border-gray-100 text-center animate-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
          <Trophy className="w-12 h-12 text-yellow-500" />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">太棒了！</h2>
        <p className="text-gray-500 mb-8">你已经完成了当前牌组的所有卡片复习。</p>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-blue-50 p-4 rounded-2xl">
            <span className="block text-2xl font-bold text-blue-600">{deckCards.length}</span>
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">总计卡片</span>
          </div>
          <div className="bg-green-50 p-4 rounded-2xl">
            <span className="block text-2xl font-bold text-green-600">{masteredCount}</span>
            <span className="text-xs font-bold text-green-400 uppercase tracking-widest">已掌握</span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleRestart}
            className="w-full flex items-center justify-center py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            再学一遍
          </button>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate(`/dashboard/deck/${deck.id}`)}
              className="py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-all"
            >
              管理卡片
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all"
            >
              返回看板
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(`/dashboard/deck/${deck.id}`)}
          className="flex items-center text-gray-500 hover:text-blue-600 transition-colors font-medium group"
        >
          <ArrowLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
          退出学习
        </button>
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900">{deck.name}</h1>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
            第 {currentIndex + 1} / {deckCards.length} 张卡片
          </p>
        </div>
        <button
          onClick={handleResetMastery}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
          title="重置进度"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-blue-600 rounded-full"
        />
      </div>

      {/* Flashcard Component */}
      <div 
        className="relative h-[400px] w-full perspective-1000 cursor-pointer group"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <AnimatePresence mode='wait'>
          <motion.div
            key={currentIndex + (isFlipped ? '-back' : '-front')}
            initial={{ rotateY: isFlipped ? -90 : 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: isFlipped ? 90 : -90, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={`absolute inset-0 w-full h-full rounded-3xl p-10 flex flex-col items-center justify-center text-center shadow-xl border-2 transition-colors ${
              isFlipped 
                ? 'bg-blue-600 border-blue-500 text-white' 
                : 'bg-white border-gray-100 text-gray-900'
            }`}
          >
            <div className="absolute top-6 left-1/2 -translate-x-1/2">
              <span className={`text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full ${
                isFlipped ? 'bg-blue-500 text-blue-100' : 'bg-gray-100 text-gray-400'
              }`}>
                {isFlipped ? '答案 (背面)' : '问题 (正面)'}
              </span>
            </div>
            
            <p className="text-2xl md:text-3xl font-bold leading-relaxed max-w-md break-words">
              {isFlipped ? currentCard.answer : currentCard.question}
            </p>

            <div className="absolute bottom-8 text-sm opacity-50 font-medium">
              点击卡片翻转
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center space-y-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleMastered(currentCard.id);
            }}
            className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-bold transition-all shadow-sm hover:shadow-md active:scale-95 ${
              currentCard.mastered 
                ? 'bg-green-100 text-green-700 border-2 border-green-200' 
                : 'bg-white text-gray-500 border-2 border-gray-100 hover:border-blue-200'
            }`}
          >
            {currentCard.mastered ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
            <span>{currentCard.mastered ? '已掌握' : '标记掌握'}</span>
          </button>
        </div>

        <div className="flex items-center justify-between w-full max-w-xs">
          <button
            disabled={currentIndex === 0}
            onClick={handlePrev}
            className="p-4 bg-white rounded-2xl border-2 border-gray-100 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:border-blue-200 transition-all active:scale-90"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div className="flex space-x-2">
            {Array.from({ length: Math.min(deckCards.length, 5) }).map((_, i) => {
              const dotIndex = deckCards.length > 5 && currentIndex > 2 
                ? Math.min(currentIndex - 2 + i, deckCards.length - 1)
                : i;
              return (
                <div 
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    dotIndex === currentIndex ? 'bg-blue-600 w-4' : 'bg-gray-200'
                  }`}
                />
              );
            })}
          </div>

          <button
            onClick={handleNext}
            className="p-4 bg-blue-600 rounded-2xl text-white shadow-lg hover:bg-blue-700 transition-all active:scale-90"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Keyboard Shortcuts Hint */}
      <div className="hidden md:flex justify-center items-center space-x-8 text-xs font-bold text-gray-400 uppercase tracking-widest">
        <div className="flex items-center"><span className="bg-gray-100 px-1.5 py-0.5 rounded mr-2">Space</span> 翻转</div>
        <div className="flex items-center"><span className="bg-gray-100 px-1.5 py-0.5 rounded mr-2">← / →</span> 切换</div>
      </div>
    </div>
  );
}
