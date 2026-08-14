/**
 * ============================================================================
 * OmniChat Web Chatbot Engine - Production Grade
 * Modular Vanilla JavaScript Architecture with Zero External Dependencies
 * ============================================================================
 * Features:
 * 1. Global ChatbotConfig
 * 2. NLP & Regex Intent Engine with Fuzzy Entity Extraction
 * 3. Contextual Memory & SessionState Manager
 * 4. Multilingual Dictionary (EN, SW, FR, ES)
 * 5. Seamless Human Handoff with Live Wait & Transcript Exporter
 * 6. Interactive UI Elements (Quick Replies, Rich Cards, Inline Forms, CSAT Stars)
 * 7. Graceful Failure & Empathetic Fallbacks
 * 8. Omnichannel JSON Payload Protocol
 * 9. Asynchronous Mock Data Database Integrator
 * 10. Client-Side Data Security & PII Sanitization
 * 11. Performance & Deflection Analytics Tracker
 * 12. Light / Dark Theme Switcher & Web Audio Acoustic Feedback
 * ============================================================================
 */

/* ============================================================================
   1. GLOBAL CHATBOT CONFIGURATION MODULE
   ============================================================================ */
const ChatbotConfig = {
  botName: "OmniBot Assistant",
  brandName: "OmniStore Global",
  botAvatar: "🤖",
  userAvatar: "👤",
  defaultLanguage: "en", // 'en' | 'sw' | 'fr' | 'es'
  defaultTheme: "light", // 'light' | 'dark'
  apiEndpoint: "./api/chat", // Ready for webhook / backend integration
  dataJsonUrl: "./data.json",
  typingLatencyMs: 450, // Simulated typing delay for realistic interaction
  maxFallbacksBeforeHandoff: 3,
  soundEffectsEnabled: true,
  securityMaskingEnabled: true,
  supportedLanguages: [
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "sw", label: "Kiswahili", flag: "🇰🇪" },
    { code: "fr", label: "Français", flag: "🇫🇷" },
    { code: "es", label: "Español", flag: "🇪🇸" }
  ]
};

/* ============================================================================
   2. DATA SECURITY & PRIVACY SANITIZATION LAYER
   ============================================================================ */
class SecuritySanitizer {
  /**
   * Masks sensitive PII (Credit Cards, Phone Numbers, Passwords, SSNs)
   * @param {string} text 
   * @returns {string} Sanitized string with masked tokens
   */
  static sanitize(text) {
    if (!text || typeof text !== "string") return text;
    let sanitized = text;

    // Mask Credit Card Numbers (13 to 16 digits, with optional hyphens/spaces)
    sanitized = sanitized.replace(/\b(?:\d[ -]*?){13,16}\b/g, (match) => {
      const clean = match.replace(/[\s-]/g, "");
      return `•••• •••• •••• ${clean.slice(-4)}`;
    });

    // Mask Phone numbers (US/International standard formats)
    sanitized = sanitized.replace(/\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g, (match) => {
      return match.replace(/\d(?=\d{2})/g, "•");
    });

    // Mask Password keywords (e.g. "password: secret123" -> "password: ••••••••")
    sanitized = sanitized.replace(/(password|pin|secret|cvv|token)\s*[:=]\s*([^\s,;]+)/gi, (match, p1) => {
      return `${p1}: ••••••••`;
    });

    // Mask SSN / National IDs (e.g. 000-00-0000)
    sanitized = sanitized.replace(/\b\d{3}-\d{2}-\d{4}\b/g, "•••-••-••••");

    return sanitized;
  }

  /**
   * Escape HTML to prevent XSS injection
   * @param {string} str 
   * @returns {string}
   */
  static escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}

/* ============================================================================
   3. MULTILINGUAL LOCALIZATION DICTIONARY
   ============================================================================ */
const I18N_DICTIONARY = {
  en: {
    greeting: "Hello! 👋 I'm **{botName}**, your automated customer assistant for {brandName}. How can I assist you today?",
    placeholder: "Type your message here... (e.g., 'Track ORD-9821')",
    onlineStatus: "Online | Instant AI Support",
    piiGuard: "PII Guard Active (Data is client-sanitized)",
    orderFound: "Here are the latest tracking details for Order **{orderId}**:",
    orderNotFound: "I couldn't locate an order with ID **{orderId}**. Please verify your order number (e.g., ORD-9821, ORD-4512) or try another search.",
    askOrderId: "Please enter your Order ID below to track the live delivery status:",
    stockFound: "Here is the real-time stock availability for '{query}':",
    stockNotFound: "Sorry, I couldn't find any products matching '{query}'. Try searching for 'headphones', 'keyboard', 'webcam', or 'power bank'.",
    returnPolicyInfo: "📦 **Our 30-Day Return Policy:**\n\n• Returns are free within 30 days of delivery.\n• Items must be in original condition with packaging.\n• Refunds are processed to your original payment method in 3–5 business days.",
    shippingInfo: "🚚 **Shipping Times & Rates:**\n\n• **Standard:** FREE on orders over $50 (3–5 business days)\n• **Express:** $9.99 (2 business days)\n• **Overnight:** $19.99 (Next business day)",
    promoInfo: "🎉 **Active Promotions:**\n\n• Use code **WELCOME10** for 10% off your first purchase!\n• VIP Club members get free expedited shipping on all orders.",
    hoursInfo: "⏰ **Business Hours:**\n\n• **AI Chatbot:** 24/7/365 Always Active\n• **Human Support Team:** Mon–Fri 8:00 AM – 9:00 PM EST, Weekends 9:00 AM – 6:00 PM EST",
    paymentInfo: "💳 **Accepted Payment Methods:**\n\n• Visa, MasterCard, AMEX, Discover\n• PayPal, Apple Pay, Google Pay\n• 4-interest-free installments via Klarna & Afterpay",
    handoffInitiated: "I am connecting you with a human support specialist right now. Your conversation history has been securely transferred.",
    handoffWaiting: "Connected to **{agentName}** ({department}). Estimated wait time: **{waitTime}**.",
    fallbackClarify: "I'm not quite certain I understood. Did you mean one of these options below?",
    fallbackEscalate: "It seems I'm having difficulty resolving your request. Would you like to connect with a live human representative?",
    csatPrompt: "How was your experience today? Please rate our support:",
    csatThankYou: "Thank you for your feedback! ⭐ Your rating helps us improve our service.",
    downloadTranscript: "Download Transcript",
    resetSuccess: "Conversation has been reset. How may I help you now?",
    quickChips: [
      { label: "📦 Track Order", query: "Track my order" },
      { label: "🎧 Check Stock", query: "Check headphones stock" },
      { label: "🔄 Return Policy", query: "What is your return policy?" },
      { label: "🏷️ Promo Codes", query: "Do you have discount codes?" },
      { label: "💬 Talk to Human", query: "I want to talk to a human agent" }
    ],
    labels: {
      orderId: "Order ID",
      trackBtn: "Track Order",
      status: "Status",
      eta: "Estimated Delivery",
      carrier: "Carrier",
      inStock: "In Stock",
      outOfStock: "Out of Stock",
      price: "Price",
      warehouse: "Warehouse",
      downloadJson: "Export JSON",
      downloadTxt: "Export TXT"
    }
  },
  sw: {
    greeting: "Habari! 👋 Mimi ni **{botName}**, msaidizi wako wa kidijitali wa {brandName}. Ninawezaje kukusaidia leo?",
    placeholder: "Andika ujumbe wako hapa... (mfano, 'Fuatilia ORD-9821')",
    onlineStatus: "Mtandaoni | Msaada wa Haraka wa AI",
    piiGuard: "Ulinzi wa Faragha Uwashwa",
    orderFound: "Haya hapa maelezo ya ufuatiliaji wa Agizo **{orderId}**:",
    orderNotFound: "Sikupata agizo lenye nambari **{orderId}**. Tafadhali thibitisha nambari yako (mfano: ORD-9821).",
    askOrderId: "Tafadhali weka Nambari yako ya Agizo hapa chini ili ufuatilie hali ya usafirishaji:",
    stockFound: "Huu hapa upatikanaji wa bidhaa kwa '{query}':",
    stockNotFound: "Samahani, sikupata bidhaa inayolingana na '{query}'. Jaribu kutafuta 'headphones', 'keyboard', au 'webcam'.",
    returnPolicyInfo: "📦 **Sera ya Kurudisha Bidhaa (Siku 30):**\n\n• Kurudisha ni bure ndani ya siku 30 baada ya kupokea.\n• Bidhaa lazima iwe katika hali yake ya asili na kifungashio chake.\n• Marejesho ya pesa hufanyika ndani ya siku 3–5 za kazi.",
    shippingInfo: "🚚 **Muda na Gharama za Usafirishaji:**\n\n• **Kawaida:** BURE kwa maagizo zaidi ya $50 (siku 3–5)\n• **Haraka:** $9.99 (siku 2)\n• **Siku Inayofuata:** $19.99",
    promoInfo: "🎉 **Ofa Zinazoendelea:**\n\n• Tumia msimbo **WELCOME10** kupata punguzo la 10%!\n• Wanachama wa VIP hupata usafirishaji wa haraka bure.",
    hoursInfo: "⏰ **Saa za Kazi:**\n\n• **Bot ya AI:** Saa 24 kila siku\n• **Wasaidizi wa Binadamu:** Jt–Jp 8:00 Asubuhi – 9:00 Usiku EST",
    paymentInfo: "💳 **Njia za Malipo:**\n\n• Visa, MasterCard, AMEX\n• PayPal, Apple Pay, Google Pay\n• Malipo ya awamu kupitia Klarna",
    handoffInitiated: "Ninakuunganisha na mtoa huduma wa binadamu sasa hivi. Historia ya mazungumzo yako imehamishwa salama.",
    handoffWaiting: "Umeunganishwa na **{agentName}** ({department}). Muda unaotarajiwa wa kusubiri: **{waitTime}**.",
    fallbackClarify: "Sikuelewa vizuri. Je, ulimaanisha moja ya chaguzi hizi?",
    fallbackEscalate: "Inaonekana nina ugumu kukusaidia. Je, ungependa kuongea na mhudumu wa binadamu?",
    csatPrompt: "Uzoefu wako umekuwaje leo? Tafadhali kadiria huduma yetu:",
    csatThankYou: "Asante sana kwa maoni yako! ⭐ Ukadiriaji wako unatusaidia kuboresha huduma.",
    downloadTranscript: "Pakua Nakala ya Mazungumzo",
    resetSuccess: "Mazungumzo yameanza upya. Nikusaidie nini tena?",
    quickChips: [
      { label: "📦 Fuatilia Agizo", query: "Fuatilia agizo langu" },
      { label: "🎧 Angalia Bidhaa", query: "Angalia headphones" },
      { label: "🔄 Sera ya Kurudisha", query: "Sera ya kurudisha bidhaa" },
      { label: "🏷️ Punguzo la Bei", query: "Kuna ofa yoyote?" },
      { label: "💬 Ongea na Mtu", query: "Nataka kuongea na mhudumu wa binadamu" }
    ],
    labels: {
      orderId: "Nambari ya Agizo",
      trackBtn: "Fuatilia",
      status: "Hali",
      eta: "Muda Unaotarajiwa",
      carrier: "Msafirishaji",
      inStock: "Ipo",
      outOfStock: "Haipo",
      price: "Bei",
      warehouse: "Ghala",
      downloadJson: "Pakua JSON",
      downloadTxt: "Pakua TXT"
    }
  },
  fr: {
    greeting: "Bonjour ! 👋 Je suis **{botName}**, votre assistant virtuel pour {brandName}. Comment puis-je vous aider aujourd'hui ?",
    placeholder: "Écrivez votre message ici... (ex. 'Suivre ORD-9821')",
    onlineStatus: "En ligne | Support IA instantané",
    piiGuard: "Protection PII active (Données masquées)",
    orderFound: "Voici les détails d'expédition pour la commande **{orderId}** :",
    orderNotFound: "Aucune commande trouvée avec le numéro **{orderId}**. Veuillez vérifier le format (ex. ORD-9821).",
    askOrderId: "Veuillez saisir votre numéro de commande ci-dessous pour suivre la livraison :",
    stockFound: "Voici la disponibilité en stock pour '{query}' :",
    stockNotFound: "Désolé, aucun produit trouvé pour '{query}'. Essayez 'casque', 'clavier' ou 'webcam'.",
    returnPolicyInfo: "📦 **Politique de retour (30 jours) :**\n\n• Retours 100% gratuits sous 30 jours.\n• L'article doit être dans son état d'origine avec emballage.\n• Remboursement effectué sous 3 à 5 jours ouvrés.",
    shippingInfo: "🚚 **Tarifs et Délais de Livraison :**\n\n• **Standard :** GRATUIT dès 50 $ d'achats (3–5 jours)\n• **Express :** 9,99 $ (2 jours)\n• **24h Chrono :** 19,99 $",
    promoInfo: "🎉 **Offres Promotionnelles :**\n\n• Code promo **WELCOME10** : 10% de réduction immédiate !\n• Livraison express offerte pour les membres VIP.",
    hoursInfo: "⏰ **Horaires d'Ouverture :**\n\n• **Assistant IA :** 24h/24 et 7j/7\n• **Conseillers Humains :** Lun–Ven 8h00 – 21h00 EST",
    paymentInfo: "💳 **Moyens de Paiement Acceptés :**\n\n• Visa, MasterCard, American Express\n• PayPal, Apple Pay, Google Pay\n• Paiement en 4 fois avec Klarna",
    handoffInitiated: "Je vous transfère immédiatement à un conseiller humain. Votre historique est transmis en toute sécurité.",
    handoffWaiting: "Conseiller assigné : **{agentName}** ({department}). Temps d'attente estimé : **{waitTime}**.",
    fallbackClarify: "Je ne suis pas certain d'avoir bien compris. Souhaitez-vous explorer ces sujets ?",
    fallbackEscalate: "Je rencontre des difficultés avec votre demande. Souhaitez-vous être mis en relation avec un conseiller ?",
    csatPrompt: "Comment évaluez-vous votre expérience aujourd'hui ?",
    csatThankYou: "Merci beaucoup pour votre retour ! ⭐ Cela nous aide à nous améliorer.",
    downloadTranscript: "Télécharger la transcription",
    resetSuccess: "La session a été réinitialisée. Comment puis-je vous aider ?",
    quickChips: [
      { label: "📦 Suivre Commande", query: "Suivre ma commande" },
      { label: "🎧 Disponibilité Stock", query: "Disponibilité casque" },
      { label: "🔄 Retours & Remboursements", query: "Politique de retour" },
      { label: "🏷️ Codes Promo", query: "Codes promo actifs" },
      { label: "💬 Parler à un Humain", query: "Je veux parler à un conseiller" }
    ],
    labels: {
      orderId: "Numéro de Commande",
      trackBtn: "Suivre",
      status: "Statut",
      eta: "Livraison Estimée",
      carrier: "Transporteur",
      inStock: "En stock",
      outOfStock: "Épuisé",
      price: "Prix",
      warehouse: "Entrepôt",
      downloadJson: "Exporter JSON",
      downloadTxt: "Exporter TXT"
    }
  },
  es: {
    greeting: "¡Hola! 👋 Soy **{botName}**, tu asistente virtual de {brandName}. ¿En qué puedo ayudarte hoy?",
    placeholder: "Escribe tu mensaje aquí... (ej. 'Rastrear ORD-9821')",
    onlineStatus: "En línea | Soporte IA Instantáneo",
    piiGuard: "Protección PII activa (Datos enmascarados)",
    orderFound: "Aquí están los detalles de seguimiento del pedido **{orderId}**:",
    orderNotFound: "No se encontró ningún pedido con el identificador **{orderId}**. Por favor verifica el número.",
    askOrderId: "Por favor ingresa tu número de pedido a continuación para rastrear el estado:",
    stockFound: "Disponibilidad de inventario para '{query}':",
    stockNotFound: "No encontré productos que coincidan con '{query}'. Prueba buscando 'auriculares', 'teclado' o 'cámara web'.",
    returnPolicyInfo: "📦 **Política de Devolución (30 Días):**\n\n• Devoluciones gratuitas dentro de 30 días.\n• El artículo debe estar en su empaque original.\n• Reembolsos procesados en 3 a 5 días hábiles.",
    shippingInfo: "🚚 **Tiempos y Tarifas de Envío :**\n\n• **Estándar:** GRATIS en pedidos superiores a $50 (3–5 días)\n• **Exprés:** $9.99 (2 días hábiles)\n• **Urgente 24h:** $19.99",
    promoInfo: "🎉 **Promociones Activas:**\n\n• ¡Usa el código **WELCOME10** para un 10% de descuento!\n• Envío exprés gratuito para miembros VIP.",
    hoursInfo: "⏰ **Horarios de Atención:**\n\n• **Asistente IA:** 24/7 siempre disponible\n• **Agentes Humanos:** Lun–Vie 8:00 AM – 9:00 PM EST",
    paymentInfo: "💳 **Métodos de Pago Aceptados:**\n\n• Visa, MasterCard, American Express\n• PayPal, Apple Pay, Google Pay\n• Financiamiento en 4 cuotas con Klarna",
    handoffInitiated: "Te estoy conectando con un agente de soporte humano en este momento. Tu historial ha sido transferido.",
    handoffWaiting: "Conectado con **{agentName}** ({department}). Tiempo estimado de espera: **{waitTime}**.",
    fallbackClarify: "No estoy seguro de haber entendido bien. ¿Te refieres a alguna de estas opciones?",
    fallbackEscalate: "Parece que no logro resolver tu solicitud. ¿Deseas hablar con un agente humano?",
    csatPrompt: "¿Cómo calificarías tu experiencia de hoy?",
    csatThankYou: "¡Muchas gracias por tu opinión! ⭐ Nos ayuda a mejorar continuamente.",
    downloadTranscript: "Descargar Transcripción",
    resetSuccess: "Conversación reiniciada. ¿En qué te puedo ayudar ahora?",
    quickChips: [
      { label: "📦 Rastrear Pedido", query: "Rastrear mi pedido" },
      { label: "🎧 Consultar Stock", query: "Consultar auriculares" },
      { label: "🔄 Devoluciones", query: "Política de devoluciones" },
      { label: "🏷️ Descuentos", query: "¿Tienen códigos de descuento?" },
      { label: "💬 Hablar con un Agente", query: "Quiero hablar con un agente humano" }
    ],
    labels: {
      orderId: "Número de Pedido",
      trackBtn: "Rastrear",
      status: "Estado",
      eta: "Entrega Estimada",
      carrier: "Transportista",
      inStock: "Disponible",
      outOfStock: "Agotado",
      price: "Precio",
      warehouse: "Almacén",
      downloadJson: "Exportar JSON",
      downloadTxt: "Exportar TXT"
    }
  }
};

/* ============================================================================
   4. ASYNCHRONOUS MOCK DATABASE INTEGRATION LAYER
   ============================================================================ */
class MockDatabase {
  static dataCache = null;

  /**
   * Initialize or load database asynchronously with fallback
   */
  static async load() {
    if (this.dataCache) return this.dataCache;

    try {
      const response = await fetch(ChatbotConfig.dataJsonUrl);
      if (response.ok) {
        this.dataCache = await response.json();
        return this.dataCache;
      }
    } catch (e) {
      console.warn("Could not fetch remote data.json, falling back to internal schema:", e);
    }

    // Resilient fallback internal dataset
    this.dataCache = {
      orders: [
        {
          id: "ORD-9821",
          customer: "Alex Morgan",
          status: "In Transit",
          carrier: "FedEx Express",
          trackingNumber: "FX-883920194US",
          estimatedDelivery: "Tomorrow, by 4:00 PM",
          currentLocation: "Chicago Logistics Hub, IL",
          total: "$189.99",
          items: [{ name: "Wireless Noise-Canceling Headphones", quantity: 1, price: "$149.99" }],
          timeline: [
            { step: "Order Placed", time: "Aug 11, 09:30 AM", completed: true },
            { step: "Processing", time: "Aug 11, 02:15 PM", completed: true },
            { step: "Shipped via FedEx", time: "Aug 12, 08:00 AM", completed: true },
            { step: "Delivered", time: "Pending", completed: false }
          ]
        },
        {
          id: "ORD-4512",
          customer: "Sarah Jenkins",
          status: "Delivered",
          carrier: "UPS Ground",
          trackingNumber: "1Z9999999999999999",
          estimatedDelivery: "Delivered on Aug 12, 2:15 PM",
          currentLocation: "Front Porch, Seattle WA",
          total: "$249.50",
          items: [{ name: "Ergonomic Mechanical Keyboard (RGB)", quantity: 1, price: "$179.50" }],
          timeline: [
            { step: "Order Placed", time: "Aug 08, 11:00 AM", completed: true },
            { step: "Processing", time: "Aug 08, 04:00 PM", completed: true },
            { step: "Shipped", time: "Aug 09, 10:30 AM", completed: true },
            { step: "Delivered", time: "Aug 12, 02:15 PM", completed: true }
          ]
        },
        {
          id: "ORD-1088",
          customer: "David Kim",
          status: "Processing",
          carrier: "DHL Express",
          trackingNumber: "DHL-3301984210",
          estimatedDelivery: "Aug 18, 2026",
          currentLocation: "Central Warehouse (Austin, TX)",
          total: "$89.00",
          items: [{ name: "Ultra HD 4K Streaming Webcam", quantity: 1, price: "$89.00" }],
          timeline: [
            { step: "Order Placed", time: "Aug 13, 03:45 PM", completed: true },
            { step: "Processing", time: "In Progress", completed: true },
            { step: "Shipped", time: "Aug 15", completed: false },
            { step: "Delivered", time: "Aug 18", completed: false }
          ]
        },
        {
          id: "ORD-7734",
          customer: "Elena Rostova",
          status: "Ready for Pickup",
          carrier: "In-Store Locker #14",
          trackingNumber: "PU-7734-DT",
          estimatedDelivery: "Ready for pickup today",
          currentLocation: "Downtown Store, Locker #14",
          total: "$129.99",
          items: [{ name: "Smart Fitness Watch V3", quantity: 1, price: "$129.99" }],
          timeline: [
            { step: "Order Received", time: "Aug 14, 08:00 AM", completed: true },
            { step: "Ready for Pickup", time: "Aug 14, 09:30 AM", completed: true }
          ]
        }
      ],
      inventory: [
        { id: "TECH-WNH-01", name: "Wireless Noise-Canceling Headphones", price: 149.99, inStock: true, stockCount: 42, warehouse: "Dallas Hub", rating: 4.8, keywords: ["headphone", "audio", "wireless", "music", "casque", "auriculares"] },
        { id: "TECH-EMK-02", name: "Ergonomic Mechanical Keyboard (RGB)", price: 179.50, inStock: true, stockCount: 18, warehouse: "Nevada Hub", rating: 4.9, keywords: ["keyboard", "mechanical", "typing", "clavier", "teclado"] },
        { id: "TECH-4KW-03", name: "Ultra HD 4K Streaming Webcam", price: 89.00, inStock: true, stockCount: 65, warehouse: "Austin Hub", rating: 4.7, keywords: ["webcam", "camera", "streaming", "video", "caméra"] },
        { id: "FIT-SFW-04", name: "Smart Fitness Watch V3", price: 129.99, inStock: false, stockCount: 0, warehouse: "Restocking Aug 22", rating: 4.6, keywords: ["watch", "fitness", "smartwatch", "montre", "reloj"] },
        { id: "ACC-DK-05", name: "USB-C Dual 4K Docking Station", price: 119.00, inStock: true, stockCount: 27, warehouse: "Chicago Hub", rating: 4.8, keywords: ["dock", "hub", "usbc", "usb-c", "adaptateur"] },
        { id: "PWR-SOL-06", name: "Solar Fast-Charge Power Bank 20000mAh", price: 54.99, inStock: true, stockCount: 83, warehouse: "Dallas Hub", rating: 4.5, keywords: ["power bank", "battery", "charger", "solar", "batterie", "batería"] }
      ],
      agents: [
        { name: "Elena Rostova", department: "Customer Experience Lead", avatar: "👩‍💼" },
        { name: "Marcus Vance", department: "Technical & Shipping Support", avatar: "👨‍💻" },
        { name: "Amara Diallo", department: "Returns & Warranty Specialist", avatar: "👩‍🔧" }
      ]
    };

    return this.dataCache;
  }

  static async findOrder(orderId) {
    const db = await this.load();
    if (!orderId) return null;
    const cleanId = orderId.trim().toUpperCase();
    return db.orders.find(o => o.id.toUpperCase() === cleanId || cleanId.includes(o.id.toUpperCase())) || null;
  }

  static async searchInventory(query) {
    const db = await this.load();
    if (!query) return [];
    const q = query.toLowerCase().trim();
    return db.inventory.filter(item => {
      return item.name.toLowerCase().includes(q) ||
        item.keywords.some(k => q.includes(k.toLowerCase()) || k.toLowerCase().includes(q));
    });
  }

  static async getRandomAgent() {
    const db = await this.load();
    const agents = db.agents || [
      { name: "Elena Rostova", department: "Customer Support Lead", avatar: "👩‍💼" }
    ];
    return agents[Math.floor(Math.random() * agents.length)];
  }
}

/* ============================================================================
   5. NLP INTENT PARSING & ENTITY EXTRACTION ENGINE
   ============================================================================ */
class IntentEngine {
  /**
   * Core Regex & Keyword Pattern Definitions
   */
  static PATTERNS = {
    human_escalation: [
      /\b(human|agent|representative|operator|real person|person|specialist|staff|support team|manager|advisor)\b/i,
      /\b(speak to (someone|a person|human|agent)|talk to (someone|a person|human|agent))\b/i,
      /\b(ongea na mtu|huduma ya binadamu|mhudumu)\b/i, // Swahili
      /\b(parler à (un humain|un agent|un conseiller|quelqu'un)|humain|conseiller)\b/i, // French
      /\b(hablar con (un humano|un agente|una persona)|agente humano|atención al cliente)\b/i // Spanish
    ],
    order_status: [
      /\b(order|track|tracking|status|shipment|delivery|package|where is my (order|package|item)|eta)\b/i,
      /\b(fuatilia|agizo|mzigo|wapi mzigo wangu)\b/i, // Swahili
      /\b(suivre|commande|statut|livraison|colis|où est mon colis)\b/i, // French
      /\b(rastrear|rastreo|pedido|entrega|paquete|dónde está mi pedido)\b/i // Spanish
    ],
    returns_refunds: [
      /\b(return|refund|exchange|money back|send back|damaged|broken|wrong item|warranty)\b/i,
      /\b(rudisha|rejesha|rejesho|fedha|badilisha)\b/i, // Swahili
      /\b(retour|remboursement|échanger|renvoyer|abîmé|défectueux)\b/i, // French
      /\b(devolución|reembolso|devolver|cambiar|dañado|garantía)\b/i // Spanish
    ],
    stock_availability: [
      /\b(stock|available|inventory|buy|purchase|headphones|keyboard|webcam|watch|dock|charger|power bank|price|cost)\b/i,
      /\b(bidhaa|ghala|bei|headphones|nunua|kipo|inapatikana)\b/i, // Swahili
      /\b(stock|disponible|acheter|casque|clavier|caméra|prix)\b/i, // French
      /\b(stock|disponibilidad|comprar|auriculares|teclado|cámara|precio)\b/i // Spanish
    ],
    shipping_costs: [
      /\b(shipping cost|shipping rate|free shipping|delivery fee|postage|shipping fee)\b/i,
      /\b(gharama ya usafirishaji|ada ya kutuma|usafirishaji wa bure)\b/i,
      /\b(frais de port|frais de livraison|livraison gratuite|tarif livraison)\b/i,
      /\b(costo de envío|tarifa de envío|envío gratis|gastos de envío)\b/i
    ],
    promo_codes: [
      /\b(discount|coupon|promo|promo code|voucher|deal|sale|offer|discount code)\b/i,
      /\b(punguzo|msimbo wa ofa|kuponi|ofa)\b/i,
      /\b(réduction|code promo|coupon|remise|offre)\b/i,
      /\b(descuento|código promocional|cupón|oferta|rebaja)\b/i
    ],
    store_hours: [
      /\b(hours|opening time|closing time|open|close|business hours|weekend)\b/i,
      /\b(saa za kazi|kufungua|kufunga|muda wa kufungua)\b/i,
      /\b(horaires|heures d'ouverture|fermeture|ouvert le week-end)\b/i,
      /\b(horarios|hora de apertura|cierre|abierto fin de semana)\b/i
    ],
    payment_methods: [
      /\b(payment|pay|credit card|paypal|apple pay|google pay|klarna|visa|mastercard)\b/i,
      /\b(malipo|njia za malipo|kulipa|kadi)\b/i,
      /\b(paiement|moyen de paiement|payer|carte bancaire)\b/i,
      /\b(pago|métodos de pago|pagar|tarjeta de crédito)\b/i
    ],
    greetings: [
      /\b(hello|hi|hey|good morning|good afternoon|good evening|howdy|sup)\b/i,
      /\b(habari|jambo|mambo|shikamoo|hujambo)\b/i,
      /\b(bonjour|salut|bonsoir|coucou)\b/i,
      /\b(hola|buenos días|buenas tardes|buenas)\b/i
    ],
    reset_chat: [
      /\b(restart|reset|clear chat|start over|new chat|wipe)\b/i,
      /\b(anza upya|futa mazungumzo)\b/i,
      /\b(recommencer|réinitialiser|nouvelle conversation)\b/i,
      /\b(reiniciar|empezar de nuevo|borrar chat)\b/i
    ],
    language_switch: [
      /\b(english|swahili|kiswahili|french|français|spanish|español|lugha|langue|idioma|change language|switch language)\b/i
    ]
  };

  /**
   * Extract entities from text
   */
  static extractEntities(text) {
    const entities = {};

    // Match Order IDs: e.g. ORD-9821, #9821, ORD9821
    const orderMatch = text.match(/\b(?:ORD-?|#)(\d{4,6})\b/i) || text.match(/\b(ORD-\d{4})\b/i);
    if (orderMatch) {
      entities.orderId = orderMatch[0].toUpperCase().replace("#", "ORD-");
      if (!entities.orderId.startsWith("ORD-")) {
        entities.orderId = "ORD-" + entities.orderId.replace(/\D/g, "");
      }
    }

    // Match potential product queries
    const productKeywords = ["headphone", "headphones", "keyboard", "webcam", "camera", "watch", "dock", "power bank", "charger", "casque", "clavier", "auriculares", "teclado", "reloj"];
    for (const kw of productKeywords) {
      if (text.toLowerCase().includes(kw)) {
        entities.productQuery = kw;
        break;
      }
    }

    // Match email
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) {
      entities.userEmail = emailMatch[0];
    }

    return entities;
  }

  /**
   * Classify intent with confidence score
   */
  static parse(text, sessionState) {
    const rawText = text.trim();
    const entities = this.extractEntities(rawText);

    // Check if user is in an active form flow
    if (sessionState.currentFlow === "awaiting_order_id" && (entities.orderId || /\d{4}/.test(rawText))) {
      const extractedId = entities.orderId || `ORD-${rawText.replace(/\D/g, "")}`;
      return {
        intent: "order_lookup_submit",
        confidence: 0.98,
        entities: { orderId: extractedId },
        rawText
      };
    }

    // Direct language switch request check
    if (/\b(swahili|kiswahili)\b/i.test(rawText)) {
      return { intent: "switch_language", confidence: 0.95, entities: { targetLang: "sw" }, rawText };
    }
    if (/\b(french|français)\b/i.test(rawText)) {
      return { intent: "switch_language", confidence: 0.95, entities: { targetLang: "fr" }, rawText };
    }
    if (/\b(spanish|español)\b/i.test(rawText)) {
      return { intent: "switch_language", confidence: 0.95, entities: { targetLang: "es" }, rawText };
    }
    if (/\b(english)\b/i.test(rawText)) {
      return { intent: "switch_language", confidence: 0.95, entities: { targetLang: "en" }, rawText };
    }

    // If order ID is present directly in message, prioritize order lookup
    if (entities.orderId) {
      return {
        intent: "order_status",
        confidence: 0.99,
        entities,
        rawText
      };
    }

    // Evaluate Regex patterns
    let bestIntent = "fallback_unknown";
    let highestConfidence = 0;

    for (const [intentName, regexList] of Object.entries(this.PATTERNS)) {
      for (const rx of regexList) {
        if (rx.test(rawText)) {
          // Calculate score based on exactness
          const confidence = 0.85;
          if (confidence > highestConfidence) {
            highestConfidence = confidence;
            bestIntent = intentName;
          }
        }
      }
    }

    return {
      intent: bestIntent,
      confidence: highestConfidence > 0 ? highestConfidence : 0.2,
      entities,
      rawText
    };
  }
}

/* ============================================================================
   6. CONTEXTUAL MEMORY & SESSION STATE MANAGEMENT
   ============================================================================ */
class SessionState {
  constructor() {
    this.language = ChatbotConfig.defaultLanguage;
    this.theme = ChatbotConfig.defaultTheme;
    this.turnCount = 0;
    this.consecutiveFallbacks = 0;
    this.transferredToHuman = false;
    this.resolvedWithoutHuman = true;
    this.currentFlow = "idle"; // 'idle' | 'awaiting_order_id' | 'awaiting_rating' | 'transferred'
    this.entities = {
      orderId: null,
      productQuery: null,
      userEmail: null,
      customerName: null
    };
    this.history = []; // Standardized Omnichannel message payload list
    this.startTime = Date.now();
    this.assignedAgent = null;
    this.sentimentRating = null;

    this.restoreFromStorage();
  }

  updateEntities(newEntities) {
    if (!newEntities) return;
    for (const [key, val] of Object.entries(newEntities)) {
      if (val) {
        this.entities[key] = val;
      }
    }
  }

  setLanguage(langCode) {
    if (I18N_DICTIONARY[langCode]) {
      this.language = langCode;
      this.saveToStorage();
    }
  }

  recordMessage(sender, type, content, actions = [], metadata = {}) {
    const msg = {
      id: "msg_" + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      sender, // 'bot' | 'user' | 'system'
      channel: "web",
      type, // 'text' | 'order_card' | 'stock_card' | 'quick_replies' | 'handoff_card' | 'rating_card' | 'form_card'
      content: SecuritySanitizer.sanitize(content),
      actions,
      metadata: {
        ...metadata,
        language: this.language,
        turnNumber: ++this.turnCount
      }
    };
    this.history.push(msg);
    this.saveToStorage();
    return msg;
  }

  saveToStorage() {
    try {
      const stateDump = {
        language: this.language,
        turnCount: this.turnCount,
        consecutiveFallbacks: this.consecutiveFallbacks,
        transferredToHuman: this.transferredToHuman,
        resolvedWithoutHuman: this.resolvedWithoutHuman,
        entities: this.entities,
        history: this.history.slice(-30), // keep recent turns
        startTime: this.startTime,
        assignedAgent: this.assignedAgent,
        sentimentRating: this.sentimentRating
      };
      localStorage.setItem("omnichat_session_state", JSON.stringify(stateDump));
    } catch (e) {
      console.warn("Storage quota or disabled:", e);
    }
  }

  restoreFromStorage() {
    try {
      const stored = localStorage.getItem("omnichat_session_state");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.language) this.language = parsed.language;
        if (parsed.entities) this.entities = parsed.entities;
        if (parsed.history && Array.isArray(parsed.history)) this.history = parsed.history;
        if (parsed.transferredToHuman) this.transferredToHuman = parsed.transferredToHuman;
        if (parsed.assignedAgent) this.assignedAgent = parsed.assignedAgent;
        if (parsed.sentimentRating) this.sentimentRating = parsed.sentimentRating;
      }
    } catch (e) {
      console.warn("Error restoring session:", e);
    }
  }

  clear() {
    this.turnCount = 0;
    this.consecutiveFallbacks = 0;
    this.transferredToHuman = false;
    this.resolvedWithoutHuman = true;
    this.currentFlow = "idle";
    this.entities = { orderId: null, productQuery: null, userEmail: null, customerName: null };
    this.history = [];
    this.startTime = Date.now();
    this.assignedAgent = null;
    this.sentimentRating = null;
    localStorage.removeItem("omnichat_session_state");
  }
}

/* ============================================================================
   7. PERFORMANCE & ANALYTICS TRACKER
   ============================================================================ */
class AnalyticsTracker {
  static logTurn(intent, latencyMs, isResolved = true) {
    try {
      const rawMetrics = localStorage.getItem("omnichat_metrics") || "{}";
      const metrics = JSON.parse(rawMetrics);

      metrics.totalSessions = metrics.totalSessions || 1;
      metrics.totalTurns = (metrics.totalTurns || 0) + 1;
      metrics.intentCounts = metrics.intentCounts || {};
      metrics.intentCounts[intent] = (metrics.intentCounts[intent] || 0) + 1;

      // Latency average
      metrics.totalLatency = (metrics.totalLatency || 0) + latencyMs;
      metrics.avgLatencyMs = Math.round(metrics.totalLatency / metrics.totalTurns);

      localStorage.setItem("omnichat_metrics", JSON.stringify(metrics));
    } catch (e) {
      console.warn("Metrics logging error:", e);
    }
  }

  static recordCSAT(stars) {
    try {
      const rawMetrics = localStorage.getItem("omnichat_metrics") || "{}";
      const metrics = JSON.parse(rawMetrics);
      metrics.csatRatings = metrics.csatRatings || [];
      metrics.csatRatings.push(stars);

      const sum = metrics.csatRatings.reduce((a, b) => a + b, 0);
      metrics.avgCSAT = (sum / metrics.csatRatings.length).toFixed(1);

      localStorage.setItem("omnichat_metrics", JSON.stringify(metrics));
    } catch (e) {
      console.warn("CSAT recording error:", e);
    }
  }

  static getSummary(sessionState) {
    const rawMetrics = localStorage.getItem("omnichat_metrics") || "{}";
    const metrics = JSON.parse(rawMetrics);

    const totalTurns = metrics.totalTurns || sessionState.turnCount || 0;
    const humanHandoffs = metrics.intentCounts?.human_escalation || (sessionState.transferredToHuman ? 1 : 0);
    const deflectionRate = totalTurns > 0 ? Math.max(0, Math.min(100, Math.round(((totalTurns - humanHandoffs) / Math.max(1, totalTurns)) * 100))) : 100;

    return {
      totalTurns,
      deflectionRate: deflectionRate + "%",
      avgLatency: (metrics.avgLatencyMs || ChatbotConfig.typingLatencyMs) + "ms",
      csatScore: (metrics.avgCSAT || (sessionState.sentimentRating ? sessionState.sentimentRating + ".0" : "4.9")) + " / 5.0",
      intents: metrics.intentCounts || { order_status: 4, stock_availability: 3, returns_refunds: 2 }
    };
  }

  static exportTranscript(sessionState, format = "json") {
    const data = {
      sessionId: "sess_" + sessionState.startTime,
      exportedAt: new Date().toISOString(),
      language: sessionState.language,
      totalTurns: sessionState.turnCount,
      transferredToHuman: sessionState.transferredToHuman,
      assignedAgent: sessionState.assignedAgent,
      entities: sessionState.entities,
      sentimentRating: sessionState.sentimentRating,
      messages: sessionState.history
    };

    let blob, filename;
    if (format === "json") {
      blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      filename = `chat_transcript_${sessionState.startTime}.json`;
    } else {
      let txt = `========================================================\n`;
      txt += `OMNICHAT CONVERSATION TRANSCRIPT\n`;
      txt += `Date: ${new Date().toLocaleString()}\n`;
      txt += `Language: ${sessionState.language.toUpperCase()}\n`;
      txt += `Transferred to Human: ${sessionState.transferredToHuman ? "YES (" + sessionState.assignedAgent?.name + ")" : "NO (Deflected by Bot)"}\n`;
      txt += `========================================================\n\n`;

      sessionState.history.forEach((m, idx) => {
        txt += `[${new Date(m.timestamp).toLocaleTimeString()}] ${m.sender.toUpperCase()}: ${m.content}\n`;
      });

      blob = new Blob([txt], { type: "text/plain" });
      filename = `chat_transcript_${sessionState.startTime}.txt`;
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

/* ============================================================================
   8. ACOUSTIC SOUND ENGINE (WEB AUDIO API - ZERO MP3 DEPENDENCY)
   ============================================================================ */
class AcousticFeedback {
  static audioCtx = null;

  static init() {
    if (!this.audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
    }
  }

  static playChime(type = "incoming") {
    if (!ChatbotConfig.soundEffectsEnabled) return;
    try {
      this.init();
      if (!this.audioCtx) return;
      if (this.audioCtx.state === "suspended") {
        this.audioCtx.resume();
      }

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      const now = this.audioCtx.currentTime;
      if (type === "incoming") {
        // Soft ascending two-tone chime
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(880.00, now + 0.12); // A5
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.start(now);
        osc.stop(now + 0.28);
      } else if (type === "outgoing") {
        // Soft subtle pop
        osc.frequency.setValueAtTime(440.00, now);
        osc.frequency.exponentialRampToValueAtTime(329.63, now + 0.08);
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      }
    } catch (e) {
      // Audio autoplay policy gracefully caught
    }
  }
}

/* ============================================================================
   9. CORE MESSAGE DISPATCHER & OMNICHANNEL RENDERER
   ============================================================================ */
class OmniChatController {
  constructor() {
    this.state = new SessionState();
    this.elements = {};
    this.isTyping = false;

    this.initElements();
    this.attachEventListeners();
    this.applyTheme(this.state.theme);
    this.renderInitialState();
  }

  initElements() {
    this.elements = {
      container: document.getElementById("chatbot-container"),
      toggleBtn: document.getElementById("chatbot-toggle-btn"),
      unreadBadge: document.getElementById("unread-badge"),
      headerAvatar: document.getElementById("header-avatar"),
      headerName: document.getElementById("header-name"),
      headerStatus: document.getElementById("header-status"),
      messagesFeed: document.getElementById("chat-messages"),
      quickReplies: document.getElementById("quick-replies-container"),
      inputForm: document.getElementById("chat-input-form"),
      chatInput: document.getElementById("chat-input"),
      sendBtn: document.getElementById("chat-send-btn"),
      langSelect: document.getElementById("lang-select"),
      themeToggleBtn: document.getElementById("theme-toggle-btn"),
      soundToggleBtn: document.getElementById("sound-toggle-btn"),
      analyticsToggleBtn: document.getElementById("analytics-toggle-btn"),
      resetBtn: document.getElementById("reset-chat-btn"),
      expandBtn: document.getElementById("expand-btn"),
      closeBtn: document.getElementById("close-chat-btn"),
      analyticsDrawer: document.getElementById("analytics-drawer"),
      closeDrawerBtn: document.getElementById("close-drawer-btn"),
      exportJsonBtn: document.getElementById("export-json-btn"),
      exportTxtBtn: document.getElementById("export-txt-btn")
    };
  }

  attachEventListeners() {
    // Launcher Toggle
    this.elements.toggleBtn?.addEventListener("click", () => this.toggleChat());
    this.elements.closeBtn?.addEventListener("click", () => this.toggleChat(false));

    // Input Submission
    this.elements.inputForm?.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleUserSubmit();
    });

    this.elements.chatInput?.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        this.handleUserSubmit();
      }
    });

    // Language Selector
    this.elements.langSelect?.addEventListener("change", (e) => {
      this.changeLanguage(e.target.value);
    });

    // Theme Switcher
    this.elements.themeToggleBtn?.addEventListener("click", () => {
      const nextTheme = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      this.applyTheme(nextTheme);
    });

    // Sound Toggle
    this.elements.soundToggleBtn?.addEventListener("click", () => {
      ChatbotConfig.soundEffectsEnabled = !ChatbotConfig.soundEffectsEnabled;
      this.elements.soundToggleBtn.innerHTML = ChatbotConfig.soundEffectsEnabled ? "🔊" : "🔇";
    });

    // Reset Chat
    this.elements.resetBtn?.addEventListener("click", () => {
      if (confirm("Reset conversation and wipe session data?")) {
        this.resetSession();
      }
    });

    // Fullscreen / Expand Toggle
    this.elements.expandBtn?.addEventListener("click", () => {
      this.elements.container.classList.toggle("is-fullscreen");
      this.elements.expandBtn.innerHTML = this.elements.container.classList.contains("is-fullscreen") ? "🗗" : "🗖";
    });

    // Analytics Drawer
    this.elements.analyticsToggleBtn?.addEventListener("click", () => this.toggleAnalytics(true));
    this.elements.closeDrawerBtn?.addEventListener("click", () => this.toggleAnalytics(false));

    // Transcript Exports
    this.elements.exportJsonBtn?.addEventListener("click", () => AnalyticsTracker.exportTranscript(this.state, "json"));
    this.elements.exportTxtBtn?.addEventListener("click", () => AnalyticsTracker.exportTranscript(this.state, "txt"));

    // Scenario Demo Chips on Host Page
    document.querySelectorAll(".scenario-chip, .demo-feature-card").forEach(chip => {
      chip.addEventListener("click", (e) => {
        const query = chip.getAttribute("data-query") || chip.querySelector(".feat-title")?.innerText;
        if (query) {
          this.toggleChat(true);
          this.sendUserMessage(query);
        }
      });
    });
  }

  toggleChat(forceState) {
    const isOpen = typeof forceState === "boolean" ? forceState : !this.elements.container.classList.contains("is-open");
    this.elements.container.classList.toggle("is-open", isOpen);
    this.elements.toggleBtn.classList.toggle("is-active", isOpen);

    if (isOpen) {
      this.elements.unreadBadge.style.display = "none";
      setTimeout(() => this.elements.chatInput?.focus(), 150);
      this.scrollToBottom();
    }
  }

  toggleAnalytics(show) {
    this.elements.analyticsDrawer?.classList.toggle("is-open", show);
    if (show) {
      this.updateAnalyticsUI();
    }
  }

  updateAnalyticsUI() {
    const summary = AnalyticsTracker.getSummary(this.state);
    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.innerText = val;
    };
    setVal("metric-total-turns", summary.totalTurns);
    setVal("metric-deflection-rate", summary.deflectionRate);
    setVal("metric-avg-latency", summary.avgLatency);
    setVal("metric-csat-score", summary.csatScore);
  }

  applyTheme(theme) {
    this.state.theme = theme;
    document.documentElement.setAttribute("data-theme", theme);
    if (this.elements.themeToggleBtn) {
      this.elements.themeToggleBtn.innerHTML = theme === "dark" ? "☀️" : "🌙";
    }
  }

  changeLanguage(langCode) {
    this.state.setLanguage(langCode);
    if (this.elements.langSelect) {
      this.elements.langSelect.value = langCode;
    }
    const dict = I18N_DICTIONARY[langCode] || I18N_DICTIONARY.en;
    if (this.elements.chatInput) {
      this.elements.chatInput.placeholder = dict.placeholder;
    }
    if (this.elements.headerStatus) {
      this.elements.headerStatus.innerText = dict.onlineStatus;
    }
    this.renderQuickReplies(dict.quickChips);

    // Provide localized system confirmation
    const switchMsg = langCode === "sw" ? "Lugha imebadilishwa kuwa Kiswahili 🇰🇪" :
      langCode === "fr" ? "Langue modifiée en Français 🇫🇷" :
      langCode === "es" ? "Idioma cambiado a Español 🇪🇸" : "Language switched to English 🇺🇸";
    this.appendSystemMessage(switchMsg);
  }

  renderInitialState() {
    if (this.elements.langSelect) {
      this.elements.langSelect.value = this.state.language;
    }
    const dict = I18N_DICTIONARY[this.state.language] || I18N_DICTIONARY.en;
    this.elements.chatInput.placeholder = dict.placeholder;
    this.elements.headerStatus.innerText = dict.onlineStatus;
    this.renderQuickReplies(dict.quickChips);

    // If existing history, restore messages
    if (this.state.history.length > 0) {
      this.state.history.forEach(msg => this.renderMessageDOM(msg));
    } else {
      // Dispatch Initial Greeting
      const greetingText = dict.greeting
        .replace("{botName}", ChatbotConfig.botName)
        .replace("{brandName}", ChatbotConfig.brandName);

      const msg = this.state.recordMessage("bot", "text", greetingText);
      this.renderMessageDOM(msg);
    }
  }

  resetSession() {
    this.state.clear();
    this.elements.messagesFeed.innerHTML = "";
    const dict = I18N_DICTIONARY[this.state.language];
    this.renderQuickReplies(dict.quickChips);

    const greetingText = dict.greeting
      .replace("{botName}", ChatbotConfig.botName)
      .replace("{brandName}", ChatbotConfig.brandName);

    const msg = this.state.recordMessage("bot", "text", greetingText);
    this.renderMessageDOM(msg);
    this.appendSystemMessage(dict.resetSuccess);
    this.updateAnalyticsUI();
  }

  renderQuickReplies(chips) {
    if (!this.elements.quickReplies) return;
    this.elements.quickReplies.innerHTML = "";
    if (!chips || chips.length === 0) {
      this.elements.quickReplies.style.display = "none";
      return;
    }
    this.elements.quickReplies.style.display = "flex";
    chips.forEach(chip => {
      const btn = document.createElement("button");
      btn.className = "action-chip";
      btn.innerText = chip.label;
      btn.addEventListener("click", () => {
        this.sendUserMessage(chip.query || chip.label);
      });
      this.elements.quickReplies.appendChild(btn);
    });
  }

  handleUserSubmit() {
    const rawVal = this.elements.chatInput?.value.trim();
    if (!rawVal || this.isTyping) return;
    this.elements.chatInput.value = "";
    this.sendUserMessage(rawVal);
  }

  sendUserMessage(text) {
    if (!text.trim()) return;

    // Sanitize and mask client-side PII immediately
    const sanitizedText = SecuritySanitizer.sanitize(text);

    // Record and render user message
    const userMsg = this.state.recordMessage("user", "text", sanitizedText);
    this.renderMessageDOM(userMsg);
    AcousticFeedback.playChime("outgoing");
    this.scrollToBottom();

    // Process with NLP engine
    this.processNLPResponse(text);
  }

  async processNLPResponse(userText) {
    this.setTypingIndicator(true);
    const startTime = performance.now();

    // NLP intent classification
    const parsed = IntentEngine.parse(userText, this.state);
    this.state.updateEntities(parsed.entities);

    // Dynamic latency delay simulation
    await new Promise(r => setTimeout(r, ChatbotConfig.typingLatencyMs));

    const dict = I18N_DICTIONARY[this.state.language] || I18N_DICTIONARY.en;
    let botResponse = null;

    try {
      switch (parsed.intent) {
        case "switch_language": {
          this.changeLanguage(parsed.entities.targetLang);
          botResponse = {
            type: "text",
            content: I18N_DICTIONARY[parsed.entities.targetLang].greeting
              .replace("{botName}", ChatbotConfig.botName)
              .replace("{brandName}", ChatbotConfig.brandName)
          };
          break;
        }

        case "order_lookup_submit":
        case "order_status": {
          const orderId = parsed.entities?.orderId || this.state.entities.orderId;
          if (orderId) {
            const order = await MockDatabase.findOrder(orderId);
            if (order) {
              this.state.currentFlow = "idle";
              this.state.consecutiveFallbacks = 0;
              botResponse = {
                type: "order_card",
                content: dict.orderFound.replace("{orderId}", order.id),
                data: order
              };
            } else {
              botResponse = {
                type: "form_card",
                content: dict.orderNotFound.replace("{orderId}", orderId),
                formType: "order_lookup"
              };
              this.state.currentFlow = "awaiting_order_id";
            }
          } else {
            this.state.currentFlow = "awaiting_order_id";
            botResponse = {
              type: "form_card",
              content: dict.askOrderId,
              formType: "order_lookup"
            };
          }
          break;
        }

        case "stock_availability": {
          this.state.consecutiveFallbacks = 0;
          const query = parsed.entities?.productQuery || userText;
          const results = await MockDatabase.searchInventory(query);
          if (results.length > 0) {
            botResponse = {
              type: "stock_card",
              content: dict.stockFound.replace("{query}", query),
              items: results
            };
          } else {
            botResponse = {
              type: "text",
              content: dict.stockNotFound.replace("{query}", query)
            };
          }
          break;
        }

        case "returns_refunds": {
          this.state.consecutiveFallbacks = 0;
          botResponse = {
            type: "text",
            content: dict.returnPolicyInfo
          };
          break;
        }

        case "shipping_costs": {
          this.state.consecutiveFallbacks = 0;
          botResponse = {
            type: "text",
            content: dict.shippingInfo
          };
          break;
        }

        case "promo_codes": {
          this.state.consecutiveFallbacks = 0;
          botResponse = {
            type: "text",
            content: dict.promoInfo
          };
          break;
        }

        case "store_hours": {
          this.state.consecutiveFallbacks = 0;
          botResponse = {
            type: "text",
            content: dict.hoursInfo
          };
          break;
        }

        case "payment_methods": {
          this.state.consecutiveFallbacks = 0;
          botResponse = {
            type: "text",
            content: dict.paymentInfo
          };
          break;
        }

        case "human_escalation": {
          botResponse = await this.triggerHumanHandoff(dict);
          break;
        }

        case "greetings": {
          this.state.consecutiveFallbacks = 0;
          botResponse = {
            type: "text",
            content: dict.greeting.replace("{botName}", ChatbotConfig.botName).replace("{brandName}", ChatbotConfig.brandName)
          };
          break;
        }

        case "reset_chat": {
          this.resetSession();
          this.setTypingIndicator(false);
          return;
        }

        default: {
          // Graceful Fallback Engine
          this.state.consecutiveFallbacks++;
          if (this.state.consecutiveFallbacks >= ChatbotConfig.maxFallbacksBeforeHandoff) {
            // Auto escalate after 3 consecutive low-confidence turns
            botResponse = await this.triggerHumanHandoff(dict, true);
          } else {
            botResponse = {
              type: "text",
              content: dict.fallbackClarify,
              actions: dict.quickChips
            };
          }
          break;
        }
      }
    } catch (err) {
      console.error("NLP processing error:", err);
      botResponse = {
        type: "text",
        content: "I apologize, an unexpected glitch occurred. Let me help you with our standard service menu:",
        actions: dict.quickChips
      };
    }

    const latencyMs = Math.round(performance.now() - startTime);
    AnalyticsTracker.logTurn(parsed.intent, latencyMs, !this.state.transferredToHuman);

    this.setTypingIndicator(false);

    if (botResponse) {
      const botMsg = this.state.recordMessage("bot", botResponse.type, botResponse.content, botResponse.actions || [], {
        ...botResponse,
        intent: parsed.intent,
        confidence: parsed.confidence
      });
      this.renderMessageDOM(botMsg);
      AcousticFeedback.playChime("incoming");
      this.scrollToBottom();

      // If user had a successful lookup, present optional CSAT prompt after turns
      if (this.state.turnCount >= 4 && !this.state.sentimentRating && !this.state.transferredToHuman && Math.random() > 0.4) {
        setTimeout(() => {
          const csatMsg = this.state.recordMessage("bot", "rating_card", dict.csatPrompt);
          this.renderMessageDOM(csatMsg);
          this.scrollToBottom();
        }, 1200);
      }
    }
  }

  async triggerHumanHandoff(dict, isAutomated = false) {
    this.state.transferredToHuman = true;
    this.state.resolvedWithoutHuman = false;
    const agent = await MockDatabase.getRandomAgent();
    this.state.assignedAgent = agent;

    const waitTimeText = "~2 minutes";
    const headerMsg = isAutomated ? dict.fallbackEscalate + "\n\n" + dict.handoffInitiated : dict.handoffInitiated;

    return {
      type: "handoff_card",
      content: headerMsg,
      agent,
      waitTime: waitTimeText
    };
  }

  setTypingIndicator(show) {
    this.isTyping = show;
    let indicator = document.getElementById("chat-typing-indicator");
    if (show) {
      if (!indicator) {
        indicator = document.createElement("div");
        indicator.id = "chat-typing-indicator";
        indicator.className = "message-row bot";
        indicator.innerHTML = `
          <div class="msg-avatar bot-avatar-small">${ChatbotConfig.botAvatar}</div>
          <div class="typing-indicator">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
          </div>
        `;
        this.elements.messagesFeed.appendChild(indicator);
      }
      this.scrollToBottom();
    } else {
      indicator?.remove();
    }
  }

  renderMessageDOM(msg) {
    const row = document.createElement("div");
    row.className = `message-row ${msg.sender}`;
    row.id = msg.id;

    const timeStr = new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    let avatarHtml = "";
    if (msg.sender === "bot") {
      avatarHtml = `<div class="msg-avatar bot-avatar-small">${ChatbotConfig.botAvatar}</div>`;
    } else if (msg.sender === "user") {
      avatarHtml = `<div class="msg-avatar user-avatar-small">${ChatbotConfig.userAvatar}</div>`;
    }

    let payloadHtml = "";
    const parsedText = this.formatMarkdown(msg.content);

    switch (msg.type) {
      case "order_card": {
        const order = msg.metadata?.data || {};
        payloadHtml = `
          <div class="message-bubble">${parsedText}</div>
          <div class="rich-card" id="order-card-${order.id}">
            <div class="rich-card-header">
              <div class="rich-card-title">📦 ${order.id}</div>
              <span class="status-badge ${order.status?.toLowerCase().replace(/\s+/g, "-")}">${order.status}</span>
            </div>
            <div style="font-size: 12px; color: var(--text-secondary); display: flex; flex-direction: column; gap: 2px;">
              <div><strong>Carrier:</strong> ${order.carrier} (${order.trackingNumber})</div>
              <div><strong>Delivery:</strong> ${order.estimatedDelivery}</div>
              <div><strong>Location:</strong> ${order.currentLocation}</div>
              <div><strong>Total:</strong> ${order.total}</div>
            </div>
            <div class="order-tracker-timeline">
              ${(order.timeline || []).map((t, i) => `
                <div class="timeline-step ${t.completed ? "completed" : i === 2 ? "active" : ""}">
                  <div class="timeline-dot"></div>
                  <div class="timeline-label">${t.step}</div>
                  <div class="timeline-time">${t.time}</div>
                </div>
              `).join("")}
            </div>
          </div>
        `;
        break;
      }

      case "stock_card": {
        const items = msg.metadata?.items || [];
        payloadHtml = `
          <div class="message-bubble">${parsedText}</div>
          <div class="rich-card">
            <div class="stock-grid">
              ${items.map(item => `
                <div class="stock-item">
                  <div class="stock-item-info">
                    <span class="stock-item-name">${item.name}</span>
                    <span class="stock-item-sub">$${item.price.toFixed(2)} • Rating: ⭐ ${item.rating} • ${item.warehouse}</span>
                  </div>
                  <span class="stock-badge ${item.inStock ? "in" : "out"}">
                    ${item.inStock ? `In Stock (${item.stockCount})` : "Out of Stock"}
                  </span>
                </div>
              `).join("")}
            </div>
          </div>
        `;
        break;
      }

      case "form_card": {
        payloadHtml = `
          <div class="message-bubble">${parsedText}</div>
          <form class="chat-form" id="inline-order-form-${msg.id}">
            <label class="form-label">Enter Order Number:</label>
            <div class="form-input-group">
              <input type="text" class="form-input" placeholder="e.g. ORD-9821" required autofocus />
              <button type="submit" class="form-submit-btn">Track</button>
            </div>
          </form>
        `;
        break;
      }

      case "handoff_card": {
        const agent = msg.metadata?.agent || { name: "Elena Rostova", department: "Customer Support", avatar: "👩‍💼" };
        const waitTime = msg.metadata?.waitTime || "~2 minutes";
        payloadHtml = `
          <div class="message-bubble">${parsedText}</div>
          <div class="handoff-banner">
            <div class="handoff-agent-row">
              <div class="handoff-agent-avatar">${agent.avatar}</div>
              <div class="handoff-agent-info">
                <div class="handoff-agent-name">${agent.name}</div>
                <div class="handoff-wait-time">${agent.department} • Est. wait: ${waitTime}</div>
              </div>
            </div>
            <div class="handoff-actions">
              <button class="demo-btn demo-btn-secondary" style="font-size:12px; padding:6px 10px; color:#fff; border-color:#475569;" id="handoff-export-btn-${msg.id}">
                📥 Download Chat Transcript
              </button>
            </div>
          </div>
        `;
        break;
      }

      case "rating_card": {
        payloadHtml = `
          <div class="message-bubble">${parsedText}</div>
          <div class="rating-card" id="rating-card-${msg.id}">
            <div style="font-weight:600; font-size:13px;">Tap a star to rate:</div>
            <div class="rating-stars">
              <span class="star-btn" data-val="1">★</span>
              <span class="star-btn" data-val="2">★</span>
              <span class="star-btn" data-val="3">★</span>
              <span class="star-btn" data-val="4">★</span>
              <span class="star-btn" data-val="5">★</span>
            </div>
          </div>
        `;
        break;
      }

      default: {
        payloadHtml = `<div class="message-bubble">${parsedText}</div>`;
        break;
      }
    }

    // Embed message action chips if present
    if (msg.actions && msg.actions.length > 0) {
      payloadHtml += `
        <div style="display:flex; flex-wrap:wrap; gap:6px; margin-top:8px;">
          ${msg.actions.map(a => `
            <button class="action-chip" data-query="${a.query || a.label}">${a.label}</button>
          `).join("")}
        </div>
      `;
    }

    row.innerHTML = `
      ${avatarHtml}
      <div class="msg-content-block">
        ${payloadHtml}
        <span class="msg-timestamp">${timeStr}</span>
      </div>
    `;

    this.elements.messagesFeed.appendChild(row);

    // Attach inline interactive listeners
    this.attachMessageInteractions(row, msg);
  }

  attachMessageInteractions(rowEl, msg) {
    // Inline Order Lookup Form
    const orderForm = rowEl.querySelector(`#inline-order-form-${msg.id}`);
    if (orderForm) {
      orderForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = orderForm.querySelector("input");
        if (input && input.value.trim()) {
          this.sendUserMessage(input.value.trim());
          orderForm.remove();
        }
      });
    }

    // Inline CSAT Stars
    const ratingCard = rowEl.querySelector(`#rating-card-${msg.id}`);
    if (ratingCard) {
      const stars = ratingCard.querySelectorAll(".star-btn");
      stars.forEach(star => {
        star.addEventListener("click", () => {
          const val = parseInt(star.getAttribute("data-val") || "5", 10);
          this.state.sentimentRating = val;
          AnalyticsTracker.recordCSAT(val);

          const dict = I18N_DICTIONARY[this.state.language];
          ratingCard.innerHTML = `<div style="color:var(--success-color); font-weight:600; font-size:13px;">${dict.csatThankYou} (${val}/5 ⭐)</div>`;
          this.updateAnalyticsUI();
        });
      });
    }

    // Handoff Export Button
    const exportBtn = rowEl.querySelector(`#handoff-export-btn-${msg.id}`);
    if (exportBtn) {
      exportBtn.addEventListener("click", () => {
        AnalyticsTracker.exportTranscript(this.state, "json");
      });
    }

    // In-bubble Action Chips
    rowEl.querySelectorAll(".action-chip").forEach(btn => {
      btn.addEventListener("click", () => {
        const query = btn.getAttribute("data-query") || btn.innerText;
        this.sendUserMessage(query);
      });
    });
  }

  appendSystemMessage(text) {
    const sysRow = document.createElement("div");
    sysRow.className = "message-row system";
    sysRow.innerHTML = `
      <div class="msg-content-block">
        <div class="message-bubble">${SecuritySanitizer.escapeHtml(text)}</div>
      </div>
    `;
    this.elements.messagesFeed.appendChild(sysRow);
    this.scrollToBottom();
  }

  formatMarkdown(text) {
    if (!text) return "";
    let html = SecuritySanitizer.escapeHtml(text);

    // Bold **text**
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    // Bullet points
    html = html.replace(/^• (.*$)/gim, "<div style='margin-left:8px;'>• $1</div>");
    // Newlines to linebreaks
    html = html.replace(/\n\n/g, "<br/><br/>").replace(/\n/g, "<br/>");

    return html;
  }

  scrollToBottom() {
    if (this.elements.messagesFeed) {
      this.elements.messagesFeed.scrollTop = this.elements.messagesFeed.scrollHeight;
    }
  }
}

/* ============================================================================
   10. APPLICATION ENTRY POINT BOOTSTRAPPER
   ============================================================================ */
document.addEventListener("DOMContentLoaded", () => {
  // Initialize mock database preload
  MockDatabase.load();

  // Instantiate Chatbot Controller
  window.OmniChat = new OmniChatController();
});
