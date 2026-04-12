'use client';
import { useState } from 'react';

const MOCK_DAYS = Array.from({ length: 7 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (6 - i));
  return d.toLocaleDateString('zh-TW', { month: 'short', day: 'numeric' });
});

const MOCK_VOLUME = [142, 168, 195, 157, 203, 187, 221];
const MOCK_SATISFACTION = [4.1, 4.3, 4.0, 4.4, 4.2, 4.5, 4.6];
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

const recentTickets = [
  { id: 'TK-001', user: '王小明', subject: '訂單未收到', status: '處理中', time: '2分鐘前' },
  { id: 'TK-002', user: '陳小華', subject: '商品損壞', status: '待回覆', time: '8分鐘前' },
  { id: 'TK-003', user: '李小芳', subject: '退貨申請', status: '已解決', time: '15分鐘前' },
  { id: 'TK-004', user: '張大強', subject: '優惠碼失效', status: '待回覆', time: '23分鐘前' },
];

const statusColors: Record<string, string> = {
  '處理中': 'bg-blue-900/40 text-blue-400 border-blue-800',
  '待回覆': 'bg-amber-900/40 text-amber-400 border-amber-800',
  '已解決': 'bg-green-900/40 text-green-400 border-green-800',
};

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
                className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${period === p ? 'bg-indigo-600 border-indigo-700 text-white' : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white'}`}>
                {p === '7d' ? '7天' : p === '30d' ? '30天' : '90天'}
              </button>
            ))}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: '總對話量', value: '1,381', change: '+18%', up: true, icon: '💬' },
            { label: '平均滿意度', value: '4.3', change: '+0.2', up: true, icon: '⭐' },
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
                  <div className="w-full bg-indigo-600/80 rounded-t-md transition-all hover:bg-indigo-500"
                    style={{ height: `${(vol / maxVol) * 100}%` }}
                  />
                  <span className="text-xs text-gray-500">{MOCK_DAYS[i]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Intents */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-white mb-4">熱門意圖排行</h2>
            <div className="space-y-2.5">
              {TOP_INTENTS.map((item, i) => (
                <div key={item.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-300">{item.name}</span>
                    <span className="text-xs text-gray-500">{item.count} ({item.pct}%)</span>
                  </div>
                  <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full transition-all"
                      style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Satisfaction trend */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-white mb-4">滿意度趨勢</h2>
            <div className="flex items-end gap-2 h-28">
              {MOCK_SATISFACTION.map((s, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full bg-green-600/80 rounded-t-md"
                    style={{ height: `${((s - 3) / 2) * 100}%` }}
                  />
                  <span className="text-xs text-gray-500">{MOCK_DAYS[i].split(' ')[1]}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-600 mt-2">
              <span>3.0</span><span>5.0</span>
            </div>
          </div>

          {/* Recent tickets */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-white mb-4">最新工單</h2>
            <div className="space-y-2">
              {recentTickets.map((t) => (
                <div key={t.id} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                  <div>
                    <div className="text-xs font-medium text-white">{t.subject}</div>
                    <div className="text-xs text-gray-500">{t.user} · {t.time}</div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[t.status]}`}>
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
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
