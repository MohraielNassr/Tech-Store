// Chatbot Responses Database
const chatbotResponses = {
  greetings: {
    keywords: ["hello", "hi", "hey", "greetings", "مرحبا", "السلام", "اهلا"],
    responses: [
      "Hello! 👋 Welcome to Tech Store. How can I help you today?",
      "Hi there! 🎉 Looking for the perfect laptop?",
      "Greetings! How can I assist you?",
    ],
  },
  products: {
    keywords: [
      "product",
      "laptop",
      "brand",
      "dell",
      "hp",
      "asus",
      "apple",
      "lenovo",
      "منتج",
      "لابتوب",
    ],
    responses: [
      "We have amazing laptops from top brands! 💻\n• Dell\n• HP\n• Asus\n• Apple (MacBook)\n• Lenovo\n\nWould you like to browse our products?",
      "Our store offers premium laptops with great prices! Visit our Products page to see all options.",
    ],
  },
  price: {
    keywords: ["price", "cost", "how much", "expensive", "cheap", "سعر", "كم"],
    responses: [
      "Our laptops range from 12,000 EGP to 40,000+ EGP depending on specs. 💰\nWant to see specific brands?",
      "We have options for every budget! From budget-friendly to premium models.",
    ],
  },
  cart: {
    keywords: [
      "cart",
      "buy",
      "purchase",
      "checkout",
      "order",
      "shopping",
      "سلة",
      "شراء",
    ],
    responses: [
      "Great! 🛒 You can add products to your cart and checkout anytime.\nYou need to login first if you haven't already.",
      "Ready to shop? Browse our products and add items to your cart!",
    ],
  },
  shipping: {
    keywords: [
      "shipping",
      "delivery",
      "ship",
      "fast",
      "deliver",
      "توصيل",
      "شحن",
    ],
    responses: [
      "🚚 Fast Shipping & Delivery!\n✅ 2-3 Business Days Delivery\n✅ Nationwide Coverage\n✅ Free Returns (30 days)",
      "We offer fast and reliable shipping across Egypt! Your order arrives in 2-3 days.",
    ],
  },
  support: {
    keywords: [
      "help",
      "support",
      "contact",
      "issue",
      "problem",
      "help",
      "مساعدة",
    ],
    responses: [
      "📞 Our Support Team is here 24/7!\nYou can reach us for any issues or questions.",
      "Need help? Our customer support team is always ready to assist you!",
    ],
  },
  search: {
    keywords: [
      "search",
      "find",
      "filter",
      "find laptop",
      "looking for",
      "ابحث",
      "ابحث عن",
    ],
    responses: [
      "🔍 Use our search bar and filters to find exactly what you're looking for!\nYou can filter by brand, price, and specs.",
      "Try using the search bar or filters to find your perfect laptop!",
    ],
  },
  login: {
    keywords: [
      "login",
      "account",
      "sign in",
      "password",
      "register",
      "تسجيل",
      "دخول",
    ],
    responses: [
      "🔐 You can login using your email and password.\nNew user? Create an account in seconds!",
      "Visit our login page to access your account or create a new one.",
    ],
  },
  thanks: {
    keywords: ["thanks", "thank you", "appreciate", "شكرا", "شكراً"],
    responses: [
      "You're welcome! 😊 Happy shopping!",
      "My pleasure! Feel free to ask if you need anything else!",
      "Glad to help! Enjoy your shopping experience!",
    ],
  },
};

// Initialize Chatbot
document.addEventListener("DOMContentLoaded", () => {
  createChatbotWidget();
});

function createChatbotWidget() {
  // Create chatbot container
  const chatbotHTML = `
    <div id="chatbot-widget" class="chatbot-widget hidden">
      <div class="chatbot-header">
        <div class="chatbot-title">
          <i class="fas fa-robot"></i> Tech Store Bot
        </div>
        <button class="chatbot-close" onclick="toggleChatbot()">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="chatbot-messages" id="chatbot-messages">
        <div class="chatbot-message bot-message">
          <p>👋 Hello! I'm Tech Store Bot. How can I help you today?</p>
        </div>
      </div>
      <div class="chatbot-input-area">
        <input 
          type="text" 
          id="chatbot-input" 
          placeholder="Type your message..." 
          onkeypress="handleChatbotKeypress(event)"
        />
        <button onclick="sendChatbotMessage()" class="chatbot-send">
          <i class="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>

    <button id="chatbot-toggle" class="chatbot-toggle" onclick="toggleChatbot()">
      <i class="fas fa-robot"></i>
    </button>
  `;

  document.body.insertAdjacentHTML("beforeend", chatbotHTML);

  // Add styles
  addChatbotStyles();
}

function addChatbotStyles() {
  const style = document.createElement("style");
  style.textContent = `
    .chatbot-toggle {
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #8b5e3c, #3b241b);
      color: white;
      border: none;
      font-size: 24px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      transition: all 0.3s ease;
      z-index: 999;
    }

    .chatbot-toggle:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
    }

    .chatbot-toggle.hidden {
      display: none;
    }

    .chatbot-widget {
      position: fixed;
      bottom: 100px;
      right: 30px;
      width: 380px;
      max-height: 550px;
      border-radius: 12px;
      background: white;
      box-shadow: 0 5px 40px rgba(0, 0, 0, 0.2);
      display: flex;
      flex-direction: column;
      z-index: 1000;
      animation: slideUp 0.3s ease;
    }

    .chatbot-widget.hidden {
      display: none;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .chatbot-header {
      background: linear-gradient(135deg, #8b5e3c, #3b241b);
      color: white;
      padding: 15px 20px;
      border-radius: 12px 12px 0 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .chatbot-title {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 600;
      font-size: 16px;
    }

    .chatbot-title i {
      font-size: 20px;
    }

    .chatbot-close {
      background: none;
      border: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
      transition: 0.3s;
    }

    .chatbot-close:hover {
      transform: rotate(90deg);
    }

    .chatbot-messages {
      flex: 1;
      overflow-y: auto;
      padding: 15px;
      background: #f9f9f9;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .chatbot-message {
      display: flex;
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .chatbot-message p {
      margin: 0;
      padding: 10px 14px;
      border-radius: 12px;
      font-size: 14px;
      line-height: 1.4;
      max-width: 80%;
      word-wrap: break-word;
    }

    .user-message {
      justify-content: flex-end;
    }

    .user-message p {
      background: #8b5e3c;
      color: white;
      border-bottom-right-radius: 4px;
    }

    .bot-message {
      justify-content: flex-start;
    }

    .bot-message p {
      background: #e8e8e8;
      color: #333;
      border-bottom-left-radius: 4px;
    }

    .chatbot-input-area {
      display: flex;
      gap: 8px;
      padding: 12px;
      border-top: 1px solid #eee;
      background: white;
    }

    #chatbot-input {
      flex: 1;
      border: 1px solid #ddd;
      border-radius: 20px;
      padding: 10px 15px;
      font-size: 14px;
      outline: none;
      transition: 0.3s;
    }

    #chatbot-input:focus {
      border-color: #8b5e3c;
      box-shadow: 0 0 0 3px rgba(139, 94, 60, 0.1);
    }

    .chatbot-send {
      background: #8b5e3c;
      color: white;
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      cursor: pointer;
      transition: 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .chatbot-send:hover {
      background: #3b241b;
      transform: scale(1.05);
    }

    /* Mobile Responsive */
    @media (max-width: 480px) {
      .chatbot-widget {
        width: calc(100% - 40px);
        bottom: 80px;
        right: 20px;
        max-height: 400px;
      }

      .chatbot-toggle {
        bottom: 20px;
        right: 20px;
        width: 55px;
        height: 55px;
        font-size: 20px;
      }

      .chatbot-message p {
        max-width: 90%;
      }
    }
  `;
  document.head.appendChild(style);
}

function toggleChatbot() {
  const widget = document.getElementById("chatbot-widget");
  const toggle = document.getElementById("chatbot-toggle");

  widget.classList.toggle("hidden");
  toggle.classList.toggle("hidden");
}

function sendChatbotMessage() {
  const input = document.getElementById("chatbot-input");
  const message = input.value.trim();

  if (!message) return;

  // Add user message
  addChatbotMessageToUI(message, "user");
  input.value = "";

  // Get bot response
  setTimeout(() => {
    const response = getBotResponse(message);
    addChatbotMessageToUI(response, "bot");
  }, 500);
}

function handleChatbotKeypress(event) {
  if (event.key === "Enter") {
    sendChatbotMessage();
  }
}

function addChatbotMessageToUI(message, sender) {
  const messagesContainer = document.getElementById("chatbot-messages");

  const messageDiv = document.createElement("div");
  messageDiv.className = `chatbot-message ${sender}-message`;

  const p = document.createElement("p");
  p.textContent = message;

  messageDiv.appendChild(p);
  messagesContainer.appendChild(messageDiv);

  // Scroll to bottom
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function getBotResponse(userMessage) {
  const message = userMessage.toLowerCase();

  // Check each category
  for (const category in chatbotResponses) {
    const category_data = chatbotResponses[category];
    for (const keyword of category_data.keywords) {
      if (message.includes(keyword)) {
        return category_data.responses[
          Math.floor(Math.random() * category_data.responses.length)
        ];
      }
    }
  }

  // Default response
  const defaultResponses = [
    "😊 That's a great question! Could you tell me more about what you're looking for?",
    "I'm here to help! 💬 Ask me about our products, prices, shipping, or anything else!",
    "I understand! Feel free to explore our website or ask me any questions.",
  ];

  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}
