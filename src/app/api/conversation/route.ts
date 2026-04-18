import { NextRequest, NextResponse } from 'next/server';

const INTENTS: Record<string, { keywords: string[]; responses: string[] }> = {
  '查詢': { keywords: ['查詢', '想知道', '詢問', '订单', '訂單', '查'], responses: ['好的，我來幫您查詢。', '請稍候，我正在為您查詢。'] },
  '退貨': { keywords: ['退貨', '退', '退款', '取消'], responses: ['了解，我來幫您處理退貨申請。', '好的，退貨流程我來說明...'] },
  '投訴': { keywords: ['投訴', '抱怨', '不滿'], responses: ['非常抱歉造成您的不便，我會立即為您處理。', '感謝您的反映，我們一定會改進...'] },
  '建議': { keywords: ['建議', '希望', '可以改'], responses: ['謝謝您的建議！', '好的，這個建議我會轉交給相關部門。'] },
  '技術': { keywords: ['壞了', '不行', '故障', '問題', 'error', 'Error'], responses: ['了解，讓我協助您解決技術問題。', '抱歉造成困擾，我來幫您處理。'] },
  '產品': { keywords: ['產品', '商品', '價格', '規格', '功能'], responses: ['我們的產品規格齊全，請問您想了解哪一款產品的詳細資訊？', '好的，以下是產品的詳細資訊...'] },
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

    // Simulate delay
    await new Promise(r => setTimeout(r, 600 + Math.random() * 400));

    const intent = detectIntent(message);
    const response = generateResponse(message);
    const faqMatch = intent.startsWith('FAQ:');

    return NextResponse.json({
      response,
      intent,
      faqMatch,
      language,
      timestamp: Date.now(),
    });
  } catch (err) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
