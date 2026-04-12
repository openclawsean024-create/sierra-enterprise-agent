import { NextRequest, NextResponse } from 'next/server';

const INTENTS: Record<string, { keywords: string[]; responses: string[] }> = {
  '查詢': { keywords: ['查詢', '想知道', '詢問', '订单', '訂單', '查'], responses: ['好的，我來幫您查詢。', '請稍候，我正在為您查詢。'] },
  '退貨': { keywords: ['退貨', '退', '退款', '取消'], responses: ['了解，我來幫您處理退貨申請。', '好的，退貨流程我來說明...'] },
  '投訴': { keywords: ['投訴', '抱怨', '不滿'], responses: ['非常抱歉造成您的不便，我會立即為您處理。', '感謝您的反映，我們一定會改進...'] },
  '真人': { keywords: ['真人', '客服', '服務員', '轉接', '轉人工'], responses: ['好的，正在為您轉接真人客服，請稍候。'] },
};

const FAQ: Record<string, string> = {
  '營業時間': '我們的營業時間是週一至週五 09:00-18:00。',
  '如何退貨': '退貨流程：登入會員 > 訂單查詢 > 申請退貨 > 填寫原因 > 等待審核 > 安排取件',
  '運費多少': '台灣本島滿 NT$1,000 免運費，未滿 NT$1,000 運費 NT$80。',
  '優惠碼': '目前新用戶 9 折優惠碼：NEWBIE2024',
  '客服電話': '客服電話：02-1234-5678，週一至週五 09:00-18:00',
};

function detectIntent(text: string): string {
  for (const [intent, data] of Object.entries(INTENTS)) {
    for (const kw of data.keywords) {
      if (text.includes(kw)) return intent;
    }
  }
  for (const [key, answer] of Object.entries(FAQ)) {
    if (text.includes(key)) return `FAQ:${key}`;
  }
  return '一般';
}

function generateResponse(text: string): string {
  const intent = detectIntent(text);
  if (intent.startsWith('FAQ:')) {
    return FAQ[intent.slice(4)];
  }
  const data = INTENTS[intent];
  if (data) {
    return data.responses[Math.floor(Math.random() * data.responses.length)];
  }
  return '感謝您的來訊！請問有什麼可以幫您的？';
}

export async function POST(req: NextRequest) {
  try {
    const { message, history = [], language = 'zh-TW' } = await req.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Missing message' }, { status: 400 });
    }

    // Simulate LLM delay
    await new Promise(r => setTimeout(r, 600 + Math.random() * 400));

    const intent = detectIntent(message);
    const response = generateResponse(message);
    const needsHuman = intent === '真人';
    const faqMatch = intent.startsWith('FAQ:');

    return NextResponse.json({
      response,
      intent,
      needsHuman,
      faqMatch,
      language,
      timestamp: Date.now(),
    });
  } catch (err) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
