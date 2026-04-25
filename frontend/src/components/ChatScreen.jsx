import { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, CheckCircle } from 'lucide-react';

const ChatScreen = ({ config, onFinish }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const fetchAIResponse = async (currentMessages) => {
    setIsLoading(true);
    
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          position: config.position,
          level: config.level,
          cv: config.cv,
          messages: currentMessages,
        })
      });

      if (!response.ok) throw new Error('API request failed');

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let aiResponseText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n\n');

        for (const line of lines) {
          if (line.trim() === 'data: [DONE]') { break; }
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.replace('data: ', ''));
              aiResponseText += data.text;
              
              setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                  role: 'assistant',
                  content: aiResponseText
                };
                return newMessages;
              });

            } catch (e) {
               // Ignore partial chunk merges for naive stream implementation
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev.slice(0, -1), { role: 'assistant', content: 'Üzgünüm, bir hatayla karşılaştım. Arka uç ve LM Studio çalışıyor mu?' }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (messages.length === 0) {
      fetchAIResponse([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const newUserMessage = { role: 'user', content: inputMessage };
    const updatedMessages = [...messages, newUserMessage];
    
    setMessages(updatedMessages);
    setInputMessage('');
    
    await fetchAIResponse(updatedMessages);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm z-10 w-full shrink-0">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Görüşülen Pozisyon: {config.position}</h2>
          <p className="text-sm text-slate-500">Seviye: {config.level}</p>
        </div>
        <button
          onClick={() => onFinish(messages)}
          disabled={isLoading}
          className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold rounded-lg transition-colors"
        >
          <CheckCircle className="w-5 h-5 mr-2" /> Bitir ve Değerlendir
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, idx) => (
          msg.content && (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === 'user' ? 'bg-blue-600 ml-4' : 'bg-slate-800 mr-4'
                }`}>
                  {msg.role === 'user' ? <User className="text-white w-6 h-6" /> : <Bot className="text-white w-6 h-6" />}
                </div>
                <div className={`p-4 rounded-2xl shadow-sm ${
                  msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none whitespace-pre-wrap'
                }`}>
                  {msg.content}
                </div>
              </div>
            </div>
          )
        ))}
        {isLoading && (
          <div className="flex justify-start items-center space-x-1 pl-16 text-slate-400 py-4">
            <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce"></span>
            <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
            <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      <footer className="bg-white border-t border-slate-200 p-4 shrink-0 w-full">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex space-x-4">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isLoading}
            placeholder={isLoading ? "Yapay zeka yazıyor..." : "Cevabınızı yazın..."}
            className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
          />
          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 disabled:bg-slate-300 transition-colors"
          >
            <Send className="w-6 h-6" />
          </button>
        </form>
      </footer>
    </div>
  );
};

export default ChatScreen;
