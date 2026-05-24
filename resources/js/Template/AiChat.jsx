import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function AiChat() {
    const [message, setMessage] = useState('');

    const suggestions = ['Give real life example', 'Diagram of photosynthesis', 'Short summary'];
    const chatHistory = [
        { title: 'What is Machine Learning?', time: '2 mins ago' },
        { title: 'Explain Photosynthesis', time: '1 hour ago' },
        { title: 'Newton\'s Third Law', time: 'Yesterday' },
        { title: 'What is API?', time: '2 days ago' },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="AI Chat" />
            
            <div className="grid grid-cols-4 gap-6 h-[calc(100vh-8rem)]">
                {/* Chat Playground */}
                <div className="col-span-3 bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col justify-between overflow-hidden">
                    {/* Top Bar */}
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white z-10">
                        <div>
                            <h1 className="text-base font-bold text-slate-900">AI Chat</h1>
                            <p className="text-xs text-slate-400">Ask anything. Get intelligent answers.</p>
                        </div>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-blue-700 transition-all">+ New Chat</button>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50/50">
                        {/* User Bubble */}
                        <div className="flex justify-end">
                            <div className="bg-blue-600 text-white text-xs px-4 py-3 rounded-2xl rounded-tr-none shadow-sm max-w-lg">
                                Explain photosynthesis in detail.
                            </div>
                        </div>

                        {/* AI Bubble */}
                        <div className="flex gap-3 max-w-2xl">
                            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center flex-shrink-0 border border-blue-200">🤖</div>
                            <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none p-4 shadow-sm text-xs text-slate-700 leading-relaxed space-y-3 w-full">
                                <p>Photosynthesis is the process used by green plants, algae, and certain bacteria to convert light energy into chemical energy. It involves:</p>
                                <ol className="list-decimal pl-4 space-y-1.5 font-medium text-slate-800">
                                    <li><strong className="text-slate-900">Light Absorption</strong> – Chlorophyll absorbs sunlight.</li>
                                    <li><strong className="text-slate-900">Conversion</strong> – Light energy is converted to chemical energy.</li>
                                    <li><strong className="text-slate-900">Storage</strong> – Energy is stored in glucose molecules.</li>
                                    <li><strong className="text-slate-900">Byproduct</strong> – Oxygen is released into the atmosphere.</li>
                                </ol>
                                <p className="text-slate-500 pt-1">It occurs in chloroplasts and is essential for life on Earth.</p>
                                
                                {/* Quick Feedback Buttons */}
                                <div className="flex gap-3 text-slate-400 text-xs pt-2 border-t border-slate-100">
                                    <button className="hover:text-slate-600">📋 Copy</button>
                                    <button className="hover:text-slate-600">👍 Like</button>
                                    <button className="hover:text-slate-600">👎 Dislike</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chat Input & Suggested Prompt Action Bar */}
                    <div className="p-4 border-t border-slate-100 bg-white space-y-3">
                        <div className="flex gap-2">
                            {suggestions.map((sug, i) => (
                                <button key={i} className="text-xxs font-semibold text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-all">
                                    {sug}
                                </button>
                            ))}
                        </div>
                        <div className="relative">
                            <input 
                                type="text" 
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Ask anything..." 
                                className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500"
                            />
                            <button className="absolute right-2 top-2 w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs hover:bg-blue-700 transition-all">
                                ➔
                            </button>
                        </div>
                    </div>
                </div>

                {/* Chat History Sidebar */}
                <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-4 flex flex-col justify-between">
                    <div>
                        <h2 className="text-xs font-bold text-slate-900 mb-4 tracking-wider uppercase">Chat History</h2>
                        <div className="space-y-1">
                            {chatHistory.map((chat, idx) => (
                                <button key={idx} className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 transition-all block group">
                                    <span className="text-xs font-bold text-slate-700 block truncate group-hover:text-blue-600">{chat.title}</span>
                                    <span className="text-xxs text-slate-400 mt-0.5 block">{chat.time}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    <button className="w-full py-2 border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 rounded-xl text-xs font-semibold transition-all">
                        Clear History
                    </button>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}