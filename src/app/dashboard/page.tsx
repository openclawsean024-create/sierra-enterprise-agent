'use client';
import { useState } from 'react';

const MOCK_DAYS = Array.from({ length: 7 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (6 - i));
  return d.toLocaleDateString('zh-TW', { month: 'short', day: 'numeric' });
});

const MOCK_VOLUME = [142, 168, 195, 157, 203, 187, 221];
const MOCK_RESPONSE = [2.1, 1.8, 2.4, 1.9, 2.0, 1.7, 1.5];

const TOP_INTENTS = [
  { name: '訂單查詢', count: 892, pct: 32 },
  { name: '退貨申請', count: 456, pct: 16 },
  { name: '產品資訊', count: 387, pct: 14 },
  { name: '優惠折扣', count: 298, pct: 11 },
  { name: '技術問題', count: 245, pct: 9 },
  { name: '帳戶登入', count: 201, pct: 7 },
  { name: '其他', count: 302, pct: 11 },
];

export default function DashboardPage() {
  const [period, setPeriod] = useState('7d');

  const maxVol = Math.max(...MOCK_VOLUME);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-bold text-white">數據分析儀表板</h1>
            <p className="text-xs text-gray-500 mt-1">即時掌握客服成效</p>
          </div>
          <div className="flex gap-2">
            {['7d', '30d', '90d'].map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${period === p ? 'bg-blue-600 border-blue-700 text-white' : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white'}`}>
                {p === '7d' ? '7天' : p === '30d' ? '30天' : '90天'}
              </button>
            ))}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: '總對話量', value: '1,381', change: '+18%', up: true, icon: '💬' },
            { label: '機器人回覆率', value: '94.2%', change: '+2.1%', up: true, icon: '🤖' },
            { label: '平均回應時間', value: '1.9s', change: '-0.3s', up: true, icon: '⚡' },
            { label: '解決率', value: '94.2%', change: '+2.1%', up: true, icon: '✅' },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl">{kpi.icon}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${kpi.up ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400'}`}>
                  {kpi.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-white">{kpi.value}</div>
              <div className="text-xs text-gray-500">{kpi.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Volume Chart */}
          <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-white mb-4">每日對話量</h2>
            <div className="flex items-end gap-3 h-40">
              {MOCK_VOLUME.map((vol, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full bg-blue-600/80 rounded-t-md transition-all hover:bg-blue-500"
                    style={{ height: `${(vol / maxVol) * 100}%` }}
                  />
                  <span className="text-xs text-gray-500">{MOCK_DAYS[i]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Intents */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-white mb-4">熱門問題 Top 5</h2>
            <div className="space-y-2.5">
              {TOP_INTENTS.slice(0, 5).map((item) => (
                <div key={item.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-300">{item.name}</span>
                    <span className="text-xs text-gray-500">{item.count} ({item.pct}%)</span>
                  </div>
                  <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full transition-all"
                      style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Conversation History */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6">
          <h2 className="text-sm font-semibold text-white mb-4">對話歷史（最近 20 筆）</h2>
          <div className="space-y-2">
            {[
              { time: '10:30', question: '運費多少？', answer: '台灣本島訂單滿 NT$1,000 免運費...', thumbs: true },
              { time: '10:31', question: '如何退貨？', answer: '退貨流程：1. 登入會員 > 2. 訂單查詢...', thumbs: true },
              { time: '10:32', question: '優惠折扣代碼？', answer: '目前有新用戶 9 折優惠碼：NEWBIE2024', thumbs: true },
              { time: '10:33', question: '營業時間？', answer: '我們的營業時間是週一至週五 09:00-18:00...', thumbs: false },
            ].map((t, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs text-gray-500 flex-shrink-0">{t.time}</span>
                    <span className="text-xs text-gray-300 truncate">{t.question}</span>
                    <span className="text-gray-600 mx-1">→</span>
                    <span className="text-xs text-gray-500 truncate">{t.answer}</span>
                  </div>
                </div>
                <span className="text-sm flex-shrink-0 ml-2">{t.thumbs ? '👍' : '👎'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Export */}
        <div className="mt-6 flex justify-end">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm text-gray-300 transition-colors">
            <span>📥</span> 匯出 CSV
          </button>
        </div>
      </div>
    </div>
  );
}
