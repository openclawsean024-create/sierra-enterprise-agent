// Sierra Chat Widget — Embedded Script
(function() {
  const API_URL = document.currentScript.dataset.api || '/api/conversation';
  const SITE_KEY = document.currentScript.dataset.key || 'demo';
  const ROOT = document.currentScript.dataset.root || 'https://sierra-enterprise-agent.vercel.app';

  // Inject styles
  const style = document.createElement('style');
  style.textContent = `
    .sierra-fab {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: #2563EB;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(37,99,235,0.4);
      z-index: 999998;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      transition: transform 0.2s, background 0.2s;
    }
    .sierra-fab:hover { background: #1d4ed8; transform: scale(1.08); }
    .sierra-fab.open { background: #1e40af; }
    .sierra-widget {
      position: fixed;
      bottom: 88px;
      right: 24px;
      width: 380px;
      height: 560px;
      background: #111827;
      border: 1px solid #1f2937;
      border-radius: 16px;
      z-index: 999999;
      display: none;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    }
    .sierra-widget.open { display: flex; }
    .sierra-header {
      background: #1f2937;
      padding: 14px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .sierra-header-title { color: #fff; font-size: 14px; font-weight: 600; }
    .sierra-close {
      background: none; border: none; color: #9ca3af; cursor: pointer;
      font-size: 18px; padding: 2px; line-height: 1;
    }
    .sierra-close:hover { color: #fff; }
    .sierra-messages {
      flex: 1;
      overflow-y: auto;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .sierra-msg {
      max-width: 80%;
      padding: 8px 12px;
      border-radius: 12px;
      font-size: 13px;
      line-height: 1.5;
      word-break: break-word;
    }
    .sierra-msg.bot {
      background: #1f2937;
      color: #e5e7eb;
      align-self: flex-start;
      border-bottom-left-radius: 4px;
    }
    .sierra-msg.user {
      background: #2563EB;
      color: #fff;
      align-self: flex-end;
      border-bottom-right-radius: 4px;
    }
    .sierra-typing {
      align-self: flex-start;
      padding: 8px 12px;
      background: #1f2937;
      border-radius: 12px;
      border-bottom-left-radius: 4px;
    }
    .sierra-typing-dot {
      display: inline-block;
      width: 6px; height: 6px;
      background: #6b7280;
      border-radius: 50%;
      margin: 0 2px;
      animation: sierra-bounce 1.2s infinite;
    }
    .sierra-typing-dot:nth-child(2) { animation-delay: 0.15s; }
    .sierra-typing-dot:nth-child(3) { animation-delay: 0.3s; }
    @keyframes sierra-bounce {
      0%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(-6px); }
    }
    .sierra-input-row {
      padding: 10px 12px;
      border-top: 1px solid #1f2937;
      display: flex;
      gap: 8px;
    }
    .sierra-input {
      flex: 1;
      background: #1f2937;
      border: 1px solid #374151;
      border-radius: 8px;
      padding: 8px 12px;
      color: #fff;
      font-size: 13px;
      resize: none;
      outline: none;
      font-family: inherit;
    }
    .sierra-input:focus { border-color: #2563EB; }
    .sierra-send {
      background: #2563EB;
      border: none;
      border-radius: 8px;
      color: #fff;
      padding: 8px 14px;
      font-size: 13px;
      cursor: pointer;
      font-weight: 500;
    }
    .sierra-send:hover { background: #1d4ed8; }
    .sierra-send:disabled { opacity: 0.5; cursor: not-allowed; }
  `;
  document.head.appendChild(style);

  // Build widget DOM
  const widget = document.createElement('div');
  widget.className = 'sierra-widget';
  widget.innerHTML = `
    <div class="sierra-header">
      <span class="sierra-header-title">🤖 Sierra AI 客服</span>
      <button class="sierra-close" id="sierra-close-btn">✕</button>
    </div>
    <div class="sierra-messages" id="sierra-messages"></div>
    <div class="sierra-input-row">
      <textarea class="sierra-input" id="sierra-input" rows="1" placeholder="輸入問題..."></textarea>
      <button class="sierra-send" id="sierra-send-btn">送出</button>
    </div>
  `;
  document.body.appendChild(widget);

  // Build FAB
  const fab = document.createElement('button');
  fab.className = 'sierra-fab';
  fab.innerHTML = '💬';
  fab.title = 'Sierra AI 客服';
  document.body.appendChild(fab);

  const messages = document.getElementById('sierra-messages');
  const input = document.getElementById('sierra-input');
  const sendBtn = document.getElementById('sierra-send-btn');
  const closeBtn = document.getElementById('sierra-close-btn');

  let conversationHistory = [];
  let isOpen = false;

  function openWidget() {
    isOpen = true;
    widget.classList.add('open');
    fab.classList.add('open');
    fab.innerHTML = '✕';
    if (messages.children.length === 0) {
      addMessage('bot', '👋 你好！我是 Sierra AI 客服，請問有什麼可以幫您的？');
    }
    input.focus();
  }

  function closeWidget() {
    isOpen = false;
    widget.classList.remove('open');
    fab.classList.remove('open');
    fab.innerHTML = '💬';
  }

  fab.addEventListener('click', () => { isOpen ? closeWidget() : openWidget(); });
  closeBtn.addEventListener('click', closeWidget);

  function addMessage(role, content) {
    const div = document.createElement('div');
    div.className = `sierra-msg ${role}`;
    div.textContent = content;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function showTyping() {
    const div = document.createElement('div');
    div.className = 'sierra-typing';
    div.id = 'sierra-typing';
    div.innerHTML = '<span class="sierra-typing-dot"></span><span class="sierra-typing-dot"></span><span class="sierra-typing-dot"></span>';
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function hideTyping() {
    const t = document.getElementById('sierra-typing');
    if (t) t.remove();
  }

  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    addMessage('user', text);
    conversationHistory.push({ role: 'user', content: text });
    showTyping();
    sendBtn.disabled = true;

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: conversationHistory.slice(-6) }),
      });
      const data = await res.json();
      hideTyping();
      const reply = data.response || '感謝您的來訊！';
      addMessage('bot', reply);
      conversationHistory.push({ role: 'assistant', content: reply });
    } catch (e) {
      hideTyping();
      addMessage('bot', '抱歉，發生錯誤，請稍後再試。');
    }

    sendBtn.disabled = false;
    input.focus();
  }

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
})();
