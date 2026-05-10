import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, MapPin, Calendar, Compass } from 'lucide-react';

export default function AIManager() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Namaste! I am your AI Travel Guru. I can help you plan your perfect Indian adventure. Where would you like to go?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newMessages = [...messages, { role: 'user', text: input }];
    setMessages(newMessages);
    setInput('');

    // Simulate AI thinking
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: `That sounds wonderful! Planning a trip to ${input} is a great choice. Should I suggest a 5-day heritage itinerary or focus on food and local experiences?` 
      }]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F5F0EB] p-12">
      <div className="max-w-5xl mx-auto h-[80vh] flex flex-col bg-white rounded-[40px] shadow-2xl overflow-hidden border border-stone-200">
        
        {/* Chat Header */}
        <div className="bg-stone-900 p-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-600/20">
              <Sparkles size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-cinzel text-white">AI Trip Manager</h1>
              <p className="text-stone-400 text-xs uppercase tracking-widest font-bold">Always Online • Powered by Traveloop AI</p>
            </div>
          </div>
          <div className="flex gap-3">
             <div className="px-4 py-2 bg-white/10 rounded-xl text-white text-xs font-inter flex items-center gap-2">
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> Live Agent Ready
             </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-10 space-y-8">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-4 max-w-[70%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${m.role === 'user' ? 'bg-stone-100 text-stone-600' : 'bg-orange-100 text-orange-600'}`}>
                  {m.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                </div>
                <div className={`p-6 rounded-3xl font-inter leading-relaxed ${m.role === 'user' ? 'bg-stone-900 text-white rounded-tr-none shadow-xl' : 'bg-stone-50 text-stone-800 rounded-tl-none border border-stone-100 shadow-sm'}`}>
                  {m.text}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Suggestions */}
        <div className="px-10 pb-6 flex gap-3 overflow-x-auto no-scrollbar">
           {[
             { label: 'Plan a 7-day Kerala trip', icon: Compass },
             { label: 'Best street food in Delhi', icon: MapPin },
             { label: 'Weather in Shimla next week', icon: Calendar },
           ].map((s, i) => (
             <button key={i} className="whitespace-nowrap px-6 py-3 bg-stone-100 hover:bg-stone-200 rounded-2xl text-stone-600 text-sm font-inter transition-colors flex items-center gap-2">
               <s.icon size={14} /> {s.label}
             </button>
           ))}
        </div>

        {/* Chat Input */}
        <div className="p-8 bg-stone-50 border-t border-stone-100">
          <div className="relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything about your trip..." 
              className="w-full bg-white border border-stone-200 rounded-3xl py-6 pl-8 pr-20 focus:ring-2 focus:ring-orange-500/20 outline-none font-inter text-stone-900 shadow-sm"
            />
            <button 
              onClick={handleSend}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-4 bg-orange-600 text-white rounded-2xl hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20"
            >
              <Send size={20} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
