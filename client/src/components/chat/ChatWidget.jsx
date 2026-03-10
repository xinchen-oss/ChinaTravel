import { useState, useRef, useEffect } from 'react';
import api from '../../api/axios';
import './ChatWidget.css';

const QUICK_QUESTIONS = [
  '¿Necesito visa para China?',
  '¿Qué moneda se usa?',
  '¿Cuál es la mejor época?',
  '¿Cómo es el internet en China?',
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '¡Hola! 👋 Soy tu asistente de viajes a China. Puedo ayudarte con información sobre visas, clima, moneda, transporte, gastronomía y nuestros circuitos. ¿En qué puedo ayudarte?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [contactForm, setContactForm] = useState({ nombre: '', email: '', mensaje: '' });
  const [contactSent, setContactSent] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showContact]);

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;

    const userMsg = { sender: 'user', text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/chat/message', { message: text.trim() });
      const { reply, type } = res.data.data;
      setMessages((prev) => [...prev, { sender: 'bot', text: reply, type }]);
      if (type === 'fallback') {
        setShowContact(true);
      }
    } catch {
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Lo siento, hubo un error. Por favor intenta de nuevo.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactForm.email || !contactForm.mensaje) return;

    try {
      await api.post('/chat/contact', {
        ...contactForm,
        historial: messages,
      });
      setContactSent(true);
      setShowContact(false);
      setMessages((prev) => [...prev, { sender: 'bot', text: '✅ ¡Tu consulta ha sido enviada! Nuestro equipo te contactará por email lo antes posible.' }]);
    } catch {
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Error al enviar. Intenta de nuevo o escríbenos directamente a soporte@chinatravel.com' }]);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        className={`chat-fab ${open ? 'chat-fab--open' : ''}`}
        onClick={() => setOpen(!open)}
        aria-label="Abrir chat"
      >
        {open ? '✕' : '💬'}
      </button>

      {/* Chat window */}
      {open && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-header__info">
              <div className="chat-header__avatar">🇨🇳</div>
              <div>
                <h4>ChinaTravel Asistente</h4>
                <span className="chat-header__status">En línea</span>
              </div>
            </div>
            <button className="chat-header__close" onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg chat-msg--${msg.sender}`}>
                {msg.sender === 'bot' && <span className="chat-msg__avatar">🤖</span>}
                <div className="chat-msg__bubble">{msg.text}</div>
              </div>
            ))}

            {loading && (
              <div className="chat-msg chat-msg--bot">
                <span className="chat-msg__avatar">🤖</span>
                <div className="chat-msg__bubble chat-msg__typing">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}

            {/* Quick questions (show only at start) */}
            {messages.length === 1 && !loading && (
              <div className="chat-quick">
                {QUICK_QUESTIONS.map((q, i) => (
                  <button key={i} className="chat-quick__btn" onClick={() => sendMessage(q)}>{q}</button>
                ))}
              </div>
            )}

            {/* Contact form */}
            {showContact && !contactSent && (
              <div className="chat-contact">
                <p className="chat-contact__title">Contactar con un agente</p>
                <form onSubmit={handleContactSubmit} className="chat-contact__form">
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    value={contactForm.nombre}
                    onChange={(e) => setContactForm({ ...contactForm, nombre: e.target.value })}
                  />
                  <input
                    type="email"
                    placeholder="Tu email *"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    required
                  />
                  <textarea
                    placeholder="Tu consulta *"
                    value={contactForm.mensaje}
                    onChange={(e) => setContactForm({ ...contactForm, mensaje: e.target.value })}
                    required
                    rows={3}
                  />
                  <button type="submit" className="chat-contact__submit">Enviar a agente</button>
                </form>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form className="chat-input" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Escribe tu pregunta..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button type="submit" disabled={loading || !input.trim()}>➤</button>
          </form>
        </div>
      )}
    </>
  );
}
