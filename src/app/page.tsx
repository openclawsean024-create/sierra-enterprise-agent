'use client';
import Link from 'next/link';

const features = [
  {
    icon: '🤖',
    title: 'FAQ 智能機器人',
    desc: '意圖識別率 >85%，支援 10 輪上下文對話，複雜問題自動轉真人'
  },
  {
    icon: '🎫',
    title: '工單系統串接',
    desc: '關鍵字自動建單，附完整對話摘要，工單狀態即時同步'
  },
  {
    icon: '🌏',
    title: '多語言自動切換',
    desc: '繁體中文、簡體中文、英文自動偵測與回覆，準確率 >92%'
  },
  {
    icon: '📊',
    title: '數據分析儀表板',
    desc: '對話量、滿意度、熱門問題排行，即時掌握客服成效'
  },
  {
    icon: '🔌',
    title: 'Webhook API',
    desc: 'REST API 對話 webhook，快速串接任何外部系統'
  },
  {
    icon: '📋',
    title: '嵌入 Widget',
    desc: 'iframe 嵌入任何網站，5 分鐘完成串接上線'
  },
];

const stats = [
  { value: '85%+', label: '意圖識別率' },
  { value: '10 輪', label: '上下文記憶' },
  { value: '<3 秒', label: 'API 回應速度' },
  { value: '92%+', label: '語言偵測準確率' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-purple-600/5 to-transparent" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-4 py-32 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-6">
            <span>🚀</span> 為中小企業打造的 AI 客服解決方案
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            全天候 <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">AI 客服</span>
            <br />降本增效首選
          </h1>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            自動處理常見問題，複雜問題無縫轉接真人，後台數據分析持續優化服務品質
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/chat" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors">
              開始對話
            </Link>
            <Link href="/dashboard" className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium rounded-lg border border-gray-700 transition-colors">
              查看儀表板
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="border-y border-gray-800 bg-gray-900/50">
        <div className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-bold text-white mb-1">{s.value}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-4 py-20">
        <h2 className="text-2xl font-bold text-white text-center mb-12">完整功能覆蓋</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <div key={f.title} className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-indigo-500/30 transition-colors">
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="text-sm font-semibold text-white mb-1">{f.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Demo CTA */}
      <div className="max-w-4xl mx-auto px-4 pb-20">
        <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-800/30 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-white mb-2">立刻體驗 AI 客服</h2>
          <p className="text-sm text-gray-400 mb-6">無需設定，輸入問題即可開始對話</p>
          <Link href="/chat" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors">
            開始對話 →
          </Link>
        </div>
      </div>
    </div>
  );
}
