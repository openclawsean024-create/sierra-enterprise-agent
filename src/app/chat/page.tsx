'use client';
import { useState, useRef, useEffect } from 'react';

const STORAGE_KEY = 'sierra_messages';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  intent?: string;
  timestamp: number;
}

const INTENTS = {
  查詢: { keywords: ['查詢', '想知道', '詢問', '订单', '訂單', '查'], responses: ['好的，我來幫您查詢。', '請稍候，我正在為您查詢相關資訊。'] },
  退貨: { keywords: ['退貨', '退', '退款', '取消'], responses: ['了解，我來幫您處理退貨申請。', '好的，退貨流程我來說明...'] },
  投訴: { keywords: ['投訴', '抱怨', '不滿', '投訴'], responses: ['非常抱歉造成您的不便，我會立即為您處理。', '感謝您的反映，我們一定會改進...'] },
  建議: { keywords: ['建議', '希望', '可以改'], responses: ['謝謝您的建議！', '好的，這個建議我會轉交給相關部門。'] },
  真人: { keywords: ['真人', '客服', '服務員', '轉接', '轉人工'], responses: ['好的，正在為您轉接真人客服，請稍候。', '我已通知真人客服，請稍候會有人員與您聯繫。'] },
  技術: { keywords: ['壞了', '不行', '故障', '問題', 'error', 'Error'], responses: ['了解，讓我協助您解決技術問題。', '抱歉造成困擾，我來幫您處理。'] },
  產品: { keywords: ['產品', '商品', '價格', '規格', '功能'], responses: ['我們的產品規格齊全，請問您想了解哪一款產品的詳細資訊？', '好的，以下是產品的詳細資訊...'] },
};

const FAQ = {
  '營業時間': '我們的營業時間是週一至週五 09:00-18:00，週末暫停服務。',
  '如何退貨': '退貨流程：1. 登入會員 > 2. 訂單查詢 > 3. 申請退貨 > 4. 填寫退貨原因 > 5. 等待審核（約1-3工作天）> 6. 安排取件或自行寄回',
  '運費多少': '台灣本島訂單滿 NT$1,000 免運費，未滿 NT$1,000 運費 NT$80。離島地區運費 NT$150。',
  '優惠碼': '您可以在結帳頁面輸入優惠碼。目前有新用戶 9 折優惠碼：NEWBIE2024',
  '客服電話': '我們的客服電話是 02-1234-5678，服務時間為週一至週五 09:00-18:00。',
};

const DEFAULT_RESPONSE = '感謝您的來訊！我是 Sierra AI 客服，請問有什麼可以幫您的？我可以處理查詢、退貨、投訴、技術問題等事務。如果是常見問題，您也可以直接輸入關鍵字，例如「營業時間」、「退貨流程」等。';

function detectIntent(text: string): string {
  for (const [intent, data] of Object.entries(INTENTS)) {
    for (const kw of data.keywords) {
      if (text.includes(kw)) return intent;
    }
  }
  return '一般';
}

function detectLanguage(text: string): { lang: 'zh-TW' | 'zh-CN' | 'en'; response: string } {
  if (/[\u4e00-\u9fff]/.test(text)) {
    // Simplified detection: count simplified vs traditional characters
    const simplified = '们为这个来对时说是国经发会当见长着与关进过开总动区业点电应来学运论处进开见给关几么'.split('');
    const hasSimplified = [...text].some(c => simplified.includes(c));
    return { lang: hasSimplified ? 'zh-CN' : 'zh-TW', response: '' };
  }
  return { lang: 'en', response: '' };
}

function generateResponse(text: string, lang: string): string {
  const intent = detectIntent(text);
  const intentData = INTENTS[intent as keyof typeof INTENTS];
  if (intentData) {
    const response = intentData.responses[Math.floor(Math.random() * intentData.responses.length)];
    if (lang === 'zh-CN') return response + ' [簡體中文模式]';
    if (lang === 'en') return 'I understand. ' + response;
    return response;
  }
  // FAQ check
  for (const [key, answer] of Object.entries(FAQ)) {
    if (text.includes(key)) {
      if (lang === 'zh-CN') return `[簡體] ${answer}`;
      if (lang === 'en') return `[English] ${key}: ${answer}`;
      return answer;
    }
  }
  if (lang === 'zh-CN') return `[簡體] 感謝您的來訊！請問還有什麼需要幫助的？`;
  if (lang === 'en') return `Thanks for reaching out! How can I help you today?`;
  return DEFAULT_RESPONSE;
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationCount, setConversationCount] = useState(0);
  const [transferring, setTransferring] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const count = messages.filter(m => m.role === 'user').length;
    setConversationCount(count);
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = {
      id: `${Date.now()}-u`,
      role: 'user',
      content: text.trim(),
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    await new Promise(r => setTimeout(r, 800 + Math.random() * 600));

    const { lang } = detectLanguage(text);
    const intent = detectIntent(text);
    const content = generateResponse(text, lang);

    // Check for human transfer
    if (intent === '真人') {
      setTransferring(true);
      await new Promise(r => setTimeout(r, 1500));
    }

    const assistantMsg: Message = {
      id: `${Date.now()}-a`,
      role: 'assistant',
      content,
      intent,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, assistantMsg]);
    setLoading(false);
    setTransferring(false);
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const totalTurns = messages.filter(m => m.role === 'user').length;
  const isHandoff = conversationCount >= 5 && totalTurns > 0;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-950">
      {/* Chat header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-800 bg-gray-900/50 flex-shrink-0">
        <div>
          <h1 className="text-sm font-semibold text-white">Sierra AI 客服</h1>
          <p className="text-xs text-gray-500">已對話 {totalTurns} 輪 | {detectLanguage(input || '').lang === 'zh-CN' ? '簡體' : detectLanguage(input || '').lang === 'en' ? 'EN' : '繁體'}</p>
        </div>
        <div className="flex items-center gap-2">
          {isHandoff && (
            <span className="text-xs text-amber-400 px-2 py-1 rounded-md bg-amber-900/20 border border-amber-800">
              建議轉真人
            </span>
          )}
          <button onClick={clearChat} className="text-xs text-gray-500 hover:text-gray-300 px-3 py-1.5 rounded-md hover:bg-gray-800 transition-colors">
            清除對話
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-4xl mb-4">💬</div>
            <h2 className="text-lg font-semibold text-white mb-2">歡迎來到 Sierra AI 客服</h2>
            <p className="text-sm text-gray-500 max-w-sm">
              我可以幫您處理查詢、退貨、投訴、技術問題。嘗試說「營業時間」或「如何退貨」
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={cn('flex gap-3', msg.role === 'user' && 'flex-row-reverse')}>
            <div className={cn('flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm',
              msg.role === 'user' ? 'bg-indigo-600' : 'bg-gray-800'
            )}>
              {msg.role === 'user' ? '👤' : '🤖'}
            </div>
            <div className={cn('max-w-xl rounded-xl px-4 py-3 text-sm',
              msg.role === 'user'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-800 text-gray-200 border border-gray-700'
            )}>
              {msg.content}
              {msg.intent && msg.role === 'assistant' && (
                <span className={cn('inline-block ml-2 text-xs px-1.5 py-0.5 rounded-full',
                  msg.intent === '投訴' ? 'bg-red-900/40 text-red-400' :
                  msg.intent === '退貨' ? 'bg-orange-900/40 text-orange-400' :
                  msg.intent === '真人' ? 'bg-amber-900/40 text-amber-400' :
                  'bg-gray-700 text-gray-400'
                )}>
                  {msg.intent}
                </span>
              )}
            </div>
          </div>
        ))}

        {transferring && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-sm">🤖</div>
            <div className="bg-gray-800 text-gray-200 border border-gray-700 rounded-xl px-4 py-3 text-sm">
              <span className="text-amber-400">正在轉接真人客服...</span>
              <div className="mt-2 flex gap-1">
                <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.15s' }} />
                <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.3s' }} />
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-sm">🤖</div>
            <div className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 border-t border-gray-800 bg-gray-900/50 px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(input);
                }
              }}
              placeholder="輸入問題，例如：查詢訂單、退貨流程..."
              className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
              disabled={loading || transferring}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading || transferring}
              className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-colors"
            >
              {loading ? '...' : '送出'}
            </button>
          </div>
          <p className="text-xs text-gray-600 mt-2 text-center">
            說「轉真人」可立即轉接人工客服 | 可用繁體中文、簡體中文、英文提問
          </p>
        </div>
      </div>
    </div>
  );
}
