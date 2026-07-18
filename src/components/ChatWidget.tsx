'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Wrench } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: 1,
    text: "👋 Bonjour ! Je suis l'assistant virtuel de Diesel Turbo Injection. Comment puis-je vous aider aujourd'hui ?",
    sender: 'bot',
    timestamp: new Date(),
  },
];

const quickReplies = [
  "Je cherche un turbo",
  "Prix injecteur",
  "Délai livraison",
  "Garantie pièces",
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const getBotResponse = (userText: string): string => {
    const lowerText = userText.toLowerCase();
    
    if (lowerText.includes('turbo') || lowerText.includes('turbos')) {
      return "🔧 Nous avons un large choix de turbos reconditionnés ! Pour vous aider au mieux, pourriez-vous me donner :\n\n• La marque et modèle de votre véhicule\n• L'année de mise en circulation\n• La puissance du moteur\n\nOu appelez-nous au 06 12 42 98 80 pour une assistance immédiate.";
    }
    
    if (lowerText.includes('injecteur') || lowerText.includes('injecteurs') || lowerText.includes('prix')) {
      return "💰 Nos injecteurs reconditionnés commencent à 79€ (garantie 2 ans incluse).\n\nLes prix varient selon :\n• La marque du véhicule\n• Le type de moteur\n• Échange standard (reconditionné)\n\nConsultez notre catalogue ou demandez un devis personnalisé !";
    }
    
    if (lowerText.includes('livraison') || lowerText.includes('délai') || lowerText.includes('expédition')) {
      return "🚚 Livraison ultra-rapide :\n\n• France métropolitaine : 24-48h\n• Express (chronopost) : 24h garanti\n• International : 3-5 jours\n\n✓ Gratuite dès 150€ d'achat\n✓ Suivi en temps réel\n✓ Assurée et traçable";
    }
    
    if (lowerText.includes('garantie') || lowerText.includes('retour')) {
      return "🛡️ Garantie satisfait ou remboursé :\n\n✓ 2 ans sur toutes les pièces\n✓ 30 jours pour retourner (sous emballage d'origine)\n✓ Échange standard disponible\n✓ SAV technique gratuit\n\nNous sommes sûrs de la qualité de nos pièces !";
    }
    
    if (lowerText.includes('bonjour') || lowerText.includes('salut') || lowerText.includes('hello')) {
      return "👋 Bonjour ! Prêt à vous aider avec :\n\n• Recherche de pièces compatible\n• Devis personnalisé\n• Conseils techniques\n• Suivi de commande\n\nQue puis-je faire pour vous ?";
    }
    
    if (lowerText.includes('contact') || lowerText.includes('téléphone') || lowerText.includes('email')) {
      return "📞 Nos coordonnées :\n\n• Tél : +33 1 23 45 67 89\n• Email : contact@injection-diesel.fr\n• Chat : Disponible 24/7\n\nHoraires : Lun-Ven 8h-19h, Sam 9h-17h\nRéponse garantie sous 2h !";
    }
    
    return "🤔 Je comprends. Pour vous aider au mieux, pourriez-vous préciser :\n\n• Le type de pièce recherchée (turbo, injecteur, pompe...)\n• Les informations de votre véhicule (marque, modèle, année)\n• Ou contactez directement un expert au +33 1 23 45 67 89\n\nNous sommes là pour vous !";
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: getBotResponse(userMessage.text),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
    }, 1500);
  };

  const handleQuickReply = (text: string) => {
    setInputValue(text);
    setTimeout(() => handleSend(), 100);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 group"
      >
        <div className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-3 sm:py-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 ${isOpen ? 'bg-gray-800' : 'bg-linear-to-r from-blue-600 to-cyan-600 shadow-blue-600/30'}`}>
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <>
              <div className="relative">
                <MessageCircle className="w-6 h-6 text-white" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              </div>
              <span className="font-semibold text-white hidden sm:inline">Chat</span>
            </>
          )}
        </div>
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-20 sm:bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 max-w-[calc(100vw-3rem)] transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <div className="bg-slate-900 rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-blue-600 to-cyan-600 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Assistant ID</h3>
                <div className="flex items-center gap-1.5 text-xs text-white/80">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span>En ligne - Réponse instantanée</span>
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-4 bg-slate-900/95">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-2 max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    message.sender === 'user' 
                      ? 'bg-blue-600' 
                      : 'bg-linear-to-br from-blue-500 to-cyan-500'
                  }`}>
                    {message.sender === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Wrench className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className={`rounded-2xl px-4 py-3 text-sm ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-md'
                      : 'bg-white/10 text-gray-200 rounded-bl-md border border-white/10'
                  }`}>
                    <p className="whitespace-pre-line">{message.text}</p>
                    {isClient && (
                      <span className={`text-xs mt-1 block ${
                        message.sender === 'user' ? 'text-blue-200' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Wrench className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white/10 rounded-2xl rounded-bl-md px-4 py-3 border border-white/10">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          <div className="px-4 py-2 bg-slate-800/50 border-t border-white/5">
            <div className="flex flex-wrap gap-2">
              {quickReplies.map((reply) => (
                <button
                  key={reply}
                  onClick={() => handleQuickReply(reply)}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/50 rounded-full text-xs text-gray-300 hover:text-white transition"
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 bg-slate-900 border-t border-white/10">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Écrivez votre message..."
                className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:bg-white/10 transition outline-none text-sm"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="p-3 bg-linear-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-600/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-center text-xs text-gray-500 mt-2">
              Réponse automatique • Contactez-nous pour une expertise personnalisée
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
