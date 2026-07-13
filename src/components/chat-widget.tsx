import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Cpu, MessageCircle, HelpCircle, FileQuestion, ArrowRight } from "lucide-react";
import { useNavigate } from "./router.js";

interface Message {
  sender: "bot" | "user";
  text: string;
  timestamp: Date;
}

export const ChatWidget: React.FC = () => {
  const { navigate } = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "¡Hola! Soy T-Bot, tu asistente tecnológico en Dr Tecno. ⚡ ¿En qué puedo ayudarte hoy?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll messages to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const WHATSAPP_URL = "https://wa.me/541155558326?text=Hola%20Dr%20Tecno,%20necesito%20asistencia%20personalizada%20con%20un%20equipo.";

  const quickReplies = [
    { label: "💳 Métodos de Pago", text: "¿Qué métodos de pago aceptan?" },
    { label: "🚚 Envíos y Entregas", text: "¿Hacen envíos a todo el país?" },
    { label: "🛠️ Consulta Técnica", text: "Necesito asistencia del Servicio Técnico" },
    { label: "🤖 Encontrar mi Equipo Ideal", text: "Quiero hacer el quiz de recomendación", isQuiz: true },
    { label: "🛡️ Garantía de Compra", text: "¿Qué garantía tienen los productos?" },
  ];

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Add user message
    const userMsg: Message = {
      sender: "user",
      text: textToSend,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    // Simulate smart bot response with keyword detection
    setTimeout(() => {
      let botText = "";
      const query = textToSend.toLowerCase();

      if (query.includes("pago") || query.includes("tarjeta") || query.includes("cuotas") || query.includes("mercado")) {
        botText = "En Dr Tecno aceptamos todos los medios de pago: Tarjetas de crédito y débito mediante Mercado Pago, transferencia bancaria directa (con un 10% de descuento adicional) y efectivo contra entrega en nuestra sucursal de Buenos Aires. 💳";
      } else if (query.includes("envío") || query.includes("envio") || query.includes("entreg") || query.includes("correo")) {
        botText = "¡Sí! Hacemos envíos express a toda la Argentina. En CABA y GBA las entregas se realizan en menos de 24 horas hábiles a través de nuestra flota propia. Para el resto de las provincias enviamos por Correo Argentino, con código de seguimiento en tiempo real. 🚚";
      } else if (query.includes("técnico") || query.includes("tecnico") || query.includes("repar") || query.includes("mantenimiento") || query.includes("pantalla") || query.includes("bateria")) {
        botText = "¡Contamos con un laboratorio técnico líder en diagnóstico y reparación! Hacemos cambios de módulos en el acto para celulares y laptops. Podés registrar tu solicitud online en la sección de 'Servicio Técnico' de nuestro menú o traer tu dispositivo directamente. 🛠️";
      } else if (query.includes("quiz") || query.includes("recomend") || query.includes("elegir") || query.includes("ideal") || query.includes("dispositivo")) {
        botText = "¡Gran idea! Diseñamos un Asistente de Recomendación Inteligente para ayudarte a elegir el dispositivo perfecto según tu presupuesto y necesidades. Hacé click aquí para ir al Quiz: /quiz o encontralo en el menú principal. 🤖";
      } else if (query.includes("garant") || query.includes("cambio") || query.includes("devoluc")) {
        botText = "Todos nuestros productos tecnológicos son 100% originales y cuentan con una Garantía Oficial escrita de 12 meses. Además, ofrecemos 10 días de cambio directo si experimentás alguna falla de fábrica. ¡Tu compra está totalmente protegida! 🛡️";
      } else if (query.includes("hola") || query.includes("buenas") || query.includes("buen")) {
        botText = "¡Hola de nuevo! Es un placer saludarte. 👋 Decime qué estás buscando o seleccioná una de las opciones rápidas abajo para guiarte.";
      } else {
        botText = "Entiendo perfectamente tu consulta. Para brindarte una respuesta personalizada de inmediato, te recomiendo hablar directamente con uno de nuestros especialistas humanos a través de WhatsApp. ¿Te gustaría conectarte ahora? 💬";
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: botText,
          timestamp: new Date()
        }
      ]);
      setTyping(false);
    }, 1000);
  };

  const handleQuickReply = (item: typeof quickReplies[0]) => {
    if (item.isQuiz) {
      // Add user message, bot responses and navigate
      setMessages((prev) => [
        ...prev,
        { sender: "user", text: item.text, timestamp: new Date() },
        { sender: "bot", text: "¡Claro! Te estoy redirigiendo a nuestro recomendador inteligente en este instante. 🤖⚡", timestamp: new Date() }
      ]);
      setTimeout(() => {
        setIsOpen(false);
        navigate("/quiz");
      }, 800);
    } else {
      handleSend(item.text);
    }
  };

  return (
    <div id="chat-widget-wrapper" className="fixed bottom-6 right-6 z-40 font-sans">
      
      {/* Floating Action Button */}
      {!isOpen && (
        <div className="flex items-center gap-3">
          <div className="glass px-4 py-2 rounded-2xl border border-border/40 shadow-2xl hidden sm:block animate-pulse-subtle">
            <p className="text-xs font-medium text-foreground">¿Necesitás ayuda profesional? ⚡</p>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 bg-accent hover:bg-accent/90 text-[oklch(0.1_0_0)] rounded-full flex items-center justify-center shadow-lg shadow-accent/25 cursor-pointer hover:scale-105 active:scale-95 transition-all relative"
            title="Soporte Técnico Especializado"
          >
            <MessageSquare className="w-6 h-6" />
            <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 bg-emerald-500 rounded-full border-2 border-background animate-pulse" />
          </button>
        </div>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div 
          id="chat-window" 
          className="w-[340px] sm:w-[380px] h-[500px] bg-card border border-border rounded-xl shadow-2xl flex flex-col overflow-hidden animate-slide-up"
        >
          {/* Header */}
          <div className="bg-muted px-4 py-3 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-accent/10 rounded-lg">
                <Cpu className="w-4 h-4 text-accent animate-spin" style={{ animationDuration: "8s" }} />
              </div>
              <div>
                <h4 className="font-serif text-sm font-semibold text-foreground">Asistencia Dr Tecno</h4>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full" />
                  <span className="text-[10px] text-muted-foreground">T-Bot Online</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-border/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-background/40">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div 
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-xs leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-accent text-accent-foreground font-medium"
                      : "bg-muted text-foreground border border-border"
                  }`}
                >
                  <p>{msg.text}</p>
                  {/* Handle inline router links */}
                  {msg.text.includes("/quiz") && (
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        navigate("/quiz");
                      }}
                      className="mt-2 text-accent-foreground underline block font-semibold hover:opacity-80"
                    >
                      Ir al Recomendador Inteligente →
                    </button>
                  )}
                  {msg.text.includes("WhatsApp") && (
                    <a
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-semibold transition-colors no-underline"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      Contactar por WhatsApp
                    </a>
                  )}
                </div>
              </div>
            ))}
            
            {/* Bot typing simulation */}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-muted text-muted-foreground rounded-lg px-3 py-2 text-xs flex items-center gap-1">
                  <span className="h-1.5 w-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="h-1.5 w-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="h-1.5 w-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick replies slider */}
          <div className="px-3 py-2 bg-muted/30 border-t border-border flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
            {quickReplies.map((reply) => (
              <button
                key={reply.label}
                onClick={() => handleQuickReply(reply)}
                className="inline-block px-2.5 py-1 bg-card hover:bg-muted border border-border text-[10px] text-foreground rounded-full transition-all shrink-0 cursor-pointer"
              >
                {reply.label}
              </button>
            ))}
          </div>

          {/* Input Panel */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="p-3 bg-muted border-t border-border flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Hacé tu pregunta..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-card border border-border rounded-lg px-3 py-1.5 text-xs text-foreground placeholder-muted-foreground outline-none focus:border-accent"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2 bg-accent hover:bg-accent/90 disabled:bg-muted-foreground/30 disabled:text-muted-foreground text-accent-foreground rounded-lg transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
