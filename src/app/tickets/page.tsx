'use client';
import { useState } from 'react';

interface Ticket {
  id: string;
  user: string;
  subject: string;
  priority: '高' | '中' | '低';
  status: '處理中' | '待回覆' | '已解決' | '已關閉';
  category: string;
  created: string;
  summary?: string;
}

const MOCK_TICKETS: Ticket[] = [
  { id: 'TK-2024-001', user: '王小明', subject: '訂單 #12345 未收到貨', priority: '高', status: '處理中', category: '物流', created: '2024-12-01 10:30', summary: '用戶反映訂單已出貨但5天未收到，訂單金額 NT$2,380...' },
  { id: 'TK-2024-002', user: '陳小華', subject: '收到的商品與描述不符', priority: '高', status: '待回覆', category: '退貨', created: '2024-12-01 11:15', summary: '收到的商品顏色與網站圖片差異過大，要求退貨...' },
  { id: 'TK-2024-003', user: '李小芳', subject: '優惠碼 NEWBIE2024 無法使用', priority: '中', status: '已解決', category: '優惠', created: '2024-12-01 09:00', summary: '優惠碼已過期，協助提供新優惠碼...' },
  { id: 'TK-2024-004', user: '張阿強', subject: '帳戶無法登入', priority: '中', status: '處理中', category: '帳戶', created: '2024-11-30 16:45', summary: '密碼重置郵件未收到，已手動發送...' },
  { id: 'TK-2024-005', user: '林小美', subject: '商品規格諮詢', priority: '低', status: '已解決', category: '諮詢', created: '2024-11-30 14:20' },
  { id: 'TK-2024-006', user: '周大成', subject: '發票資訊錯誤', priority: '中', status: '待回覆', category: '發票', created: '2024-11-30 13:00', summary: '發票抬頭開立錯誤，需重新開立...' },
];

const priorityColors = { '高': 'text-red-400 bg-red-900/30', '中': 'text-amber-400 bg-amber-900/30', '低': 'text-green-400 bg-green-900/30' };
const statusColors: Record<string, string> = {
  '處理中': 'bg-blue-900/40 text-blue-400',
  '待回覆': 'bg-amber-900/40 text-amber-400',
  '已解決': 'bg-green-900/40 text-green-400',
  '已關閉': 'bg-gray-800 text-gray-500',
};

export default function TicketsPage() {
  const [filter, setFilter] = useState('全部');
  const [tickets] = useState<Ticket[]>(MOCK_TICKETS);

  const filtered = filter === '全部' ? tickets : tickets.filter(t => t.status === filter);
  const counts = {
    全部: tickets.length,
    處理中: tickets.filter(t => t.status === '處理中').length,
    待回覆: tickets.filter(t => t.status === '待回覆').length,
    已解決: tickets.filter(t => t.status === '已解決').length,
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-bold text-white">工單管理</h1>
            <p className="text-xs text-gray-500 mt-1">共 {tickets.length} 件工單</p>
          </div>
          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors">
            + 新建工單
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {(['全部', '處理中', '待回覆', '已解決'] as const).map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                filter === s ? 'bg-indigo-600 border-indigo-700 text-white' : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white'
              }`}>
              {s} ({counts[s]})
            </button>
          ))}
        </div>

        {/* Ticket list */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">ID</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">主旨</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">用戶</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">優先</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">狀態</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">時間</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="border-b border-gray-800/50 last:border-0 hover:bg-gray-800/30 transition-colors">
                  <td className="px-4 py-3 text-xs text-indigo-400 font-mono">{t.id}</td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-white">{t.subject}</div>
                    {t.summary && <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">{t.summary}</div>}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">{t.user}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[t.priority]}`}>{t.priority}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[t.status]}`}>{t.status}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{t.created}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
