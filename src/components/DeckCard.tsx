import { Link } from 'react-router-dom';
import { Layers, Play, Settings, Trash2 } from 'lucide-react';
import { Deck } from '@/types';
import { useFlashcardStore } from '@/store/useFlashcardStore';

interface DeckCardProps {
  deck: Deck;
  cardCount: number;
}

export default function DeckCard({ deck, cardCount }: DeckCardProps) {
  const { deleteDeck } = useFlashcardStore();

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.confirm(`Are you sure you want to delete the dataset "${deck.name}"? This action cannot be undone.`)) {
      deleteDeck(deck.id);
    }
  };

  return (
    <div className="group bg-white rounded-3xl border-4 border-gray-100 p-6 hover:border-[#4F46E5] hover:-translate-y-2 transition-all duration-300 flex flex-col relative overflow-hidden cursor-pointer shadow-sm hover:shadow-[8px_8px_0px_#4F46E5]">
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out -z-10"></div>
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-white rounded-2xl border-4 border-gray-100 text-[#4F46E5] flex items-center justify-center group-hover:border-[#4F46E5] group-hover:rotate-12 transition-all duration-300 shadow-sm">
            <Layers className="w-6 h-6" strokeWidth={2.5} />
          </div>
          <h3 className="font-heading text-2xl font-bold text-[#312E81] truncate max-w-[140px]" title={deck.name}>
            {deck.name}
          </h3>
        </div>
        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link
            to={`/dashboard/deck/${deck.id}`}
            className="p-2 text-gray-400 hover:text-[#4F46E5] rounded-xl hover:bg-indigo-50 transition-colors"
            title="编辑卡包"
            onClick={(e) => e.stopPropagation()}
          >
            <Settings className="w-5 h-5" />
          </Link>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(e);
            }}
            className="p-2 text-gray-400 hover:text-red-500 rounded-xl hover:bg-red-50 transition-colors"
            title="删除卡包"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <p className="text-gray-500 text-sm font-bold mb-6 line-clamp-2 min-h-[2.5rem] relative z-10">
        {deck.description || '这个卡包还没有描述哦~'}
      </p>
      
      <div className="flex items-center justify-between mt-auto pt-5 border-t-4 border-gray-50 relative z-10">
        <div className="flex flex-col">
          <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">卡片数量</span>
          <span className="text-xl font-heading font-extrabold text-[#4F46E5]">
            {cardCount} <span className="text-sm text-gray-400 font-bold">张</span>
          </span>
        </div>
        
        <Link
          to={cardCount > 0 ? `/dashboard/study/${deck.id}` : `/dashboard/deck/${deck.id}`}
          onClick={(e) => e.stopPropagation()}
          className={`flex items-center space-x-2 px-5 py-3 rounded-xl text-sm font-bold transition-all ${
            cardCount > 0 
              ? 'bg-[#22C55E] text-white border-b-4 border-green-700 hover:bg-green-400 hover:-translate-y-1 active:translate-y-0 active:border-b-0 active:mt-[4px]' 
              : 'bg-gray-100 text-gray-400 border-b-4 border-gray-200 hover:bg-gray-200'
          }`}
        >
          <Play className="w-4 h-4 fill-current" />
          <span>{cardCount > 0 ? '去复习！' : '加卡片'}</span>
        </Link>
      </div>
    </div>
  );
}
