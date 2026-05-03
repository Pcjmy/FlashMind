import { Link } from 'react-router-dom';
import { Sparkles, Zap, Trophy, HeartPulse, ArrowRight, Brain } from 'lucide-react';

export default function Landing() {
  const logoUrl = "/logo.svg";

  return (
    <div className="min-h-screen bg-[#EEF2FF] flex flex-col font-sans selection:bg-[#4F46E5] selection:text-white">
      {/* Playful Navigation */}
      <nav className="bg-white border-b-4 border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity group">
              <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center transform -rotate-6 group-hover:rotate-0 group-hover:scale-110 transition-all duration-300">
                <img src={logoUrl} alt="FlashMind Logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-heading font-extrabold text-2xl tracking-tight text-[#312E81]">
                FlashMind
              </span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="hidden sm:block text-gray-500 hover:text-[#4F46E5] px-4 py-2 font-bold transition-colors">
                登录账号
              </Link>
              <Link to="/dashboard" className="bg-[#4F46E5] text-white hover:bg-indigo-500 px-6 py-3 rounded-2xl font-bold border-b-4 border-indigo-700 hover:-translate-y-1 active:translate-y-0 active:border-b-0 active:mt-[4px] transition-all duration-150 flex items-center">
                开始免费学习
                <ArrowRight className="w-5 h-5 ml-2" strokeWidth={3} />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Vibrant Hero Section */}
      <div className="relative overflow-hidden bg-white">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute top-48 -right-24 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-24 left-1/2 w-96 h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="pt-24 pb-32 lg:pt-36 lg:pb-48 flex flex-col items-center text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 text-[#4F46E5] font-bold text-sm mb-8 border-2 border-indigo-100 animate-bounce">
              <Sparkles className="w-4 h-4 mr-2" />
              <span>让每一次回想，都成为加深记忆的锚点 ✨</span>
            </div>
            
            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#312E81] tracking-tight mb-8 leading-[1.1]">
              那些记不住的知识，<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#EC4899]">
                只是没找到正确的打开方式
              </span>
            </h1>
            
            <p className="mt-4 text-xl text-gray-500 max-w-2xl mb-12 font-bold leading-relaxed">
              把大部头教材变成一张张轻巧的卡片。在等咖啡、坐地铁的间隙，像刷短视频一样刷两张卡，不知不觉中，你已经比昨天更强了。
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
              <Link to="/dashboard" className="bg-[#22C55E] text-white hover:bg-green-400 px-10 py-5 rounded-2xl text-xl font-extrabold border-b-4 border-green-700 hover:-translate-y-1 hover:shadow-xl active:translate-y-1 active:border-b-0 active:mt-[4px] transition-all flex items-center justify-center group">
                <Zap className="w-6 h-6 mr-2 group-hover:scale-125 transition-transform" fill="currentColor" />
                建造你的第一座记忆宫殿
              </Link>
            </div>

            {/* Social Proof */}
            <div className="mt-16 pt-8 border-t-2 border-gray-100 flex flex-col items-center">
              <div className="flex -space-x-4 mb-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-indigo-100 flex items-center justify-center text-xl">
                    {['🧑‍🎓', '👩‍💻', '👨‍🏫', '👩‍🎨', '👨‍🚀'][i]}
                  </div>
                ))}
              </div>
              <p className="text-gray-500 font-bold">
                已经有 <span className="text-[#4F46E5]">10,000+</span> 小伙伴在这里偷偷变强
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Card-based Features Section */}
      <div id="features" className="py-24 bg-[#EEF2FF] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="font-heading text-4xl md:text-5xl font-extrabold text-[#312E81] mb-6">
              成年人的学习，需要一点“心机”
            </h2>
            <p className="text-xl text-gray-500 font-bold max-w-2xl mx-auto">
              丢掉荧光笔和厚厚的笔记本，用算法帮你“作弊”。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <div className="bg-white p-10 rounded-[2.5rem] border-4 border-gray-100 hover:border-[#4F46E5] hover:-translate-y-2 hover:shadow-[12px_12px_0px_#4F46E5] transition-all duration-300 group">
              <div className="w-20 h-20 bg-[#EEF2FF] rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all">
                <Brain className="w-10 h-10 text-[#4F46E5]" />
              </div>
              <h4 className="font-heading text-2xl font-extrabold text-[#312E81] mb-4">只在“快忘了”时出现</h4>
              <p className="text-gray-500 font-bold text-lg leading-relaxed">
                不要无意义的重复。算法会计算你的遗忘临界点，像精准的狙击手一样，在知识溜走的前一秒把它拽回来。
              </p>
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] border-4 border-gray-100 hover:border-[#F59E0B] hover:-translate-y-2 hover:shadow-[12px_12px_0px_#F59E0B] transition-all duration-300 group">
              <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:-rotate-6 transition-all">
                <Trophy className="w-10 h-10 text-[#F59E0B]" />
              </div>
              <h4 className="font-heading text-2xl font-extrabold text-[#312E81] mb-4">把多巴胺还给学习</h4>
              <p className="text-gray-500 font-bold text-lg leading-relaxed">
                翻开卡片、确认掌握、获得经验值（XP）。把枯燥的记忆过程变成连续的正反馈循环，大脑根本停不下来。
              </p>
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] border-4 border-gray-100 hover:border-[#EC4899] hover:-translate-y-2 hover:shadow-[12px_12px_0px_#EC4899] transition-all duration-300 group">
              <div className="w-20 h-20 bg-pink-50 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all">
                <HeartPulse className="w-10 h-10 text-[#EC4899]" />
              </div>
              <h4 className="font-heading text-2xl font-extrabold text-[#312E81] mb-4">吞噬一切碎片时间</h4>
              <p className="text-gray-500 font-bold text-lg leading-relaxed">
                等咖啡的 3 分钟，坐地铁的 2 站路。掏出手机刷两张卡，不知不觉中，别人用来发呆的时间，你用来变强。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-white border-t-4 border-gray-100 relative overflow-hidden">
        <div className="absolute top-1/2 left-10 transform -translate-y-1/2 opacity-20">
          <Zap className="w-32 h-32 text-[#F59E0B]" />
        </div>
        <div className="absolute top-1/2 right-10 transform -translate-y-1/2 opacity-20">
          <Sparkles className="w-32 h-32 text-[#4F46E5]" />
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="font-heading text-4xl md:text-5xl font-extrabold text-[#312E81] mb-6">
            你的大脑比你想象的更强大
          </h2>
          <p className="text-xl text-gray-500 font-bold mb-10">
            别让糟糕的学习方法拖累了你。今天花 5 分钟试试，明天你会感谢现在的自己。
          </p>
          <Link to="/dashboard" className="inline-flex items-center justify-center bg-[#4F46E5] text-white hover:bg-indigo-500 px-12 py-6 rounded-3xl text-2xl font-extrabold border-b-8 border-indigo-700 hover:-translate-y-2 hover:shadow-2xl active:translate-y-2 active:border-b-0 active:mt-[8px] transition-all group">
            给自己一个变强的机会
            <ArrowRight className="w-8 h-8 ml-3 group-hover:translate-x-2 transition-transform" strokeWidth={3} />
          </Link>
        </div>
      </div>

      {/* Playful Footer */}
      <footer className="bg-[#312E81] text-indigo-200 py-16 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white rounded-xl overflow-hidden flex items-center justify-center transform -rotate-6">
              <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-heading font-extrabold text-2xl text-white">FlashMind</span>
          </div>
          
          <div className="flex space-x-6 font-bold">
            <a href="#" className="hover:text-white transition-colors">关于我们</a>
            <a href="#" className="hover:text-white transition-colors">用户协议</a>
            <a href="#" className="hover:text-white transition-colors">隐私政策</a>
          </div>
          
          <div className="text-sm font-bold opacity-60">
            &copy; {new Date().getFullYear()} FlashMind. Made with ❤️ for Learners.
          </div>
        </div>
      </footer>
    </div>
  );
}
