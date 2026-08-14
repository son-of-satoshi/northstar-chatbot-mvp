// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
  const userInput = document.getElementById('user-input');
  const sendBtn = document.getElementById('send-btn');
  const chatFeed = document.getElementById('chat-feed');

  // Helper to append messages
  window.appendMessage = function(text, isUser = false) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    msgDiv.textContent = text;
    chatFeed.appendChild(msgDiv);
    chatFeed.scrollTop = chatFeed.scrollHeight;
  };

  // Process user input
  function handleSendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    // Display user message
    appendMessage(text, true);
    userInput.value = '';

    // Simulated Bot Response Logic
    setTimeout(() => {
      const lower = text.toLowerCase();
      if (lower.includes('ord-9821') || lower.includes('order') || lower.includes('track')) {
        appendMessage('📦 Order #ORD-9821 is currently in transit and scheduled for delivery tomorrow by 3:00 PM.');
      } else if (lower.includes('return') || lower.includes('refund')) {
        appendMessage('🔄 We offer a 30-day return policy for unused items in original packaging. Would you like to start a return request?');
      } else if (lower.includes('stock') || lower.includes('item') || lower.includes('headphones')) {
        appendMessage('🏷️ Wireless Noise-Canceling Headphones are in stock (14 units available).');
      } else if (lower.includes('human') || lower.includes('agent')) {
        appendMessage('👤 Connecting you to a support agent... Estimated wait time: 2 minutes.');
      } else {
        appendMessage("🤖 Thanks for reaching out! I'm here to help with order tracking, returns, or product availability.");
      }
    }, 600);
  }

  // Quick Reply Handler
  window.handleQuickReply = function(type) {
    if (type === 'order') appendMessage('Where is my order ORD-9821?', true);
    if (type === 'return') appendMessage('What is your return policy?', true);
    if (type === 'stock') appendMessage('Do you have headphones in stock?', true);
    if (type === 'human') appendMessage('I need to speak to a human agent.', true);

    setTimeout(() => {
      if (type === 'order') appendMessage('📦 Order #ORD-9821 is in transit and scheduled for delivery tomorrow.');
      if (type === 'return') appendMessage('🔄 Returns are accepted within 30 days of delivery with original receipt.');
      if (type === 'stock') appendMessage('🏷️ Most standard electronics and headphones are in stock and ship within 24 hours.');
      if (type === 'human') appendMessage('👤 Transferring your session to live chat support...');
    }, 500);
  };

  // Event Listeners
  if (sendBtn) sendBtn.addEventListener('click', handleSendMessage);
  if (userInput) {
    userInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleSendMessage();
    });
  }
});
