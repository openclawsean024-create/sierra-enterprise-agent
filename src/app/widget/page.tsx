'use client';
import { useState } from 'react';

const CODE_SNIPPET = `<!-- Sierra Chat Widget -->
<script
  src="https://sierra-enterprise-agent.vercel.app/widget.js"
  data-api="https://sierra-enterprise-agent.vercel.app/api/conversation"
  data-key="YOUR_SITE_KEY"
></script>`;

const HTML_EXAMPLE = `<!DOCTYPE html>
<html>
<head>
  <title>我的網站</title>
</head>
<body>
  <h1>歡迎來到我的網站</h1>
  <p>有任何問題歡迎使用右下角客服！</p>

  <!-- Sierra Chat Widget -->
  <script
    src="https://sierra-enterprise-agent.vercel.app/widget.js"
    data-api="https://sierra-enterprise-agent.vercel.app/api/conversation"
    data-key="YOUR_SITE_KEY"
  ></script>
</body>
</html>`;

export default function WidgetPage() {
  const [copied, setCopied] = useState(false);

  const copy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-white">嵌入 Widget</h1>
          <p className="text-sm text-gray-500 mt-1">將 Sierra 客服聊天框嵌入任何網站</p>
        </div>

        {/* Preview */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-sm font-semibold text-white mb-4">Widget 預覽</h2>
          <div className="bg-gray-800 rounded-xl p-8 text-center relative">
            <div className="absolute bottom-4 right-4 flex flex-col gap-2">
              <button className="w-14 h-14 rounded-full bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/30 flex items-center justify-center transition-colors">
                <span className="text-xl">💬</span>
              </button>
            </div>
            <p className="text-gray-400 text-sm">點擊右下角按鈕預覽</p>
          </div>
        </div>

        {/* Setup steps */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-sm font-semibold text-white mb-4">快速設定（3步驟）</h2>
          <div className="space-y-4">
            {[
              { step: '1', title: '複製程式碼', desc: '在網站的 &lt;head&gt; 或 &lt;body&gt; 結束標籤前加入以下程式碼' },
              { step: '2', title: '替換參數', desc: '將 YOUR_SITE_KEY 替換為您的網站金鑰' },
              { step: '3', title: '上線', desc: '完成！Widget 會自動出現在網站右下角' },
            ].map((s) => (
              <div key={s.step} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold text-white">{s.step}</div>
                <div>
                  <div className="text-sm font-medium text-white" dangerouslySetInnerHTML={{ __html: s.title }} />
                  <div className="text-xs text-gray-500 mt-0.5" dangerouslySetInnerHTML={{ __html: s.desc }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Code snippet */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden mb-6">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
            <span className="text-xs text-gray-400 font-mono">HTML</span>
            <button
              onClick={() => copy(CODE_SNIPPET)}
              className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              {copied ? '✅ 已複製' : '📋 複製'}
            </button>
          </div>
          <pre className="p-4 text-xs text-gray-300 overflow-x-auto font-mono leading-relaxed">
            <code>{CODE_SNIPPET}</code>
          </pre>
        </div>

        {/* Full HTML example */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
            <span className="text-xs text-gray-400 font-mono">完整 HTML 範例</span>
            <button
              onClick={() => copy(HTML_EXAMPLE)}
              className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              📋 複製
            </button>
          </div>
          <pre className="p-4 text-xs text-gray-300 overflow-x-auto font-mono leading-relaxed">
            <code>{HTML_EXAMPLE}</code>
          </pre>
        </div>

        {/* API endpoint */}
        <div className="mt-6 bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-3">Webhook API</h2>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex gap-3">
              <span className="text-green-400 flex-shrink-0">POST</span>
              <span className="text-gray-300">/api/webhook</span>
            </div>
            <div className="text-gray-600 mt-2">接收外部系統觸發，完整對話上下文</div>
          </div>
        </div>
      </div>
    </div>
  );
}
