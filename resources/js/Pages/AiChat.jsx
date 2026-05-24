import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, router } from '@inertiajs/react';

import ReactMarkdown from 'react-markdown';

export default function AiChat({ chatHistory = [], activeMessages = [] }) {
    const { errors } = usePage().props;

    const { data, setData, post, processing, reset } = useForm({
        message: '',
        history: activeMessages // Sends ongoing thread back to backend to preserve memory context
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (processing || !data.message.trim()) return;

        post(route('ai-chat.store'), {
            onSuccess: () => reset('message'),
        });
    };

    const handleClearHistory = () => {
        if (confirm('Are you sure you want to clear your chat logs?')) {
            router.post(route('ai-chat.clear'));
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="AI Chat" />

            <div className="grid grid-cols-4 gap-6 h-[calc(100vh-8rem)]">
                {/* Chat Interaction Workspace */}
                <div className="col-span-3 bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col justify-between overflow-hidden">

                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white">
                        <div>
                            <h1 className="text-base font-bold text-slate-900">AI Chat Workspace</h1>
                            <p className="text-xs text-slate-400">Ask academic queries. Powered by OpenRouter APIs.</p>
                        </div>
                    </div>

                    {/* Chat Bubble Feed Container */}
                    <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50/50">
                        {activeMessages.length === 0 && (
                            <div className="text-center text-slate-400 text-xs mt-12">
                                Start a new academic dialog by typing your prompt down below.
                            </div>
                        )}

                        {activeMessages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'gap-3 max-w-2xl'}`}>
                                {msg.role !== 'user' && (
                                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center flex-shrink-0 border border-blue-200">🤖</div>
                                )}
                               {/* Replace the broken <ReactMarkdown> block with this structure */}
<div className={`text-xs p-4 rounded-2xl leading-relaxed max-w-lg shadow-sm ${
    msg.role === 'user' 
        ? 'bg-blue-600 text-white rounded-tr-none' 
        : 'bg-white border border-slate-100 rounded-tl-none text-slate-700'
    }`}
>
    {msg.role === 'user' ? (
        <p className="whitespace-pre-line">{msg.content}</p>
    ) : (
        /* The container div now handles the markdown styling classes safely */
        <div className="prose text-lg max-w-none prose-slate  text-slate-700">
            <ReactMarkdown>
                {msg.content}
            </ReactMarkdown>
        </div>
    )}
</div>
                            </div>
                        ))}

                        {/* Processing Loading Pulse State */}
                        {processing && (
                            <div className="flex gap-3 max-w-2xl animate-pulse">
                                <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center text-xs">⏳</div>
                                <div className="bg-slate-100 text-slate-500 rounded-2xl rounded-tl-none p-3 text-xs font-medium">
                                    CampusMind AI is compiling response...
                                </div>
                            </div>
                        )}

                        {errors.message && (
                            <div className="text-xs font-bold text-rose-500 bg-rose-50 p-3 rounded-xl border border-rose-100">
                                ⚠️ {errors.message}
                            </div>
                        )}
                    </div>

                    {/* Interactive Input Trigger Form */}
                    <form onSubmit={handleSubmit} className="p-4 border-t border-slate-100 bg-white">
                        <div className="relative">
                            <input
                                type="text"
                                value={data.message}
                                onChange={(e) => setData('message', e.target.value)}
                                disabled={processing}
                                placeholder={processing ? "Awaiting OpenRouter engine reply..." : "Ask your intelligent academic companion anything..."}
                                className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 disabled:opacity-60"
                            />
                            <button
                                type="submit"
                                disabled={processing || !data.message.trim()}
                                className="absolute right-2 top-2 w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs hover:bg-blue-700 transition-all disabled:bg-slate-300"
                            >
                                ➔
                            </button>
                        </div>
                    </form>
                </div>

                {/* DB-driven Conversational Logs Sidebar */}
                <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-4 flex flex-col justify-between">
                    <div>
                        <h2 className="text-xs font-bold text-slate-900 mb-4 tracking-wider uppercase">Saved Conversations</h2>
                        <div className="space-y-1 max-h-[60vh] overflow-y-auto pr-1">
                            {chatHistory.length > 0 ? (
                                chatHistory.map((chat) => (
                                    <div key={chat.id} className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 transition-all block group cursor-pointer border border-transparent hover:border-slate-100">
                                        <span className="text-xs font-bold text-slate-700 block truncate group-hover:text-blue-600">{chat.title}</span>
                                        <span className="text-xxs text-slate-400 mt-0.5 block">
                                            {new Date(chat.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <span className="text-xxs text-slate-400 block p-2">No historical logs captured yet.</span>
                            )}
                        </div>
                    </div>
                    {chatHistory.length > 0 && (
                        <button
                            onClick={handleClearHistory}
                            className="w-full py-2 border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 rounded-xl text-xs font-semibold transition-all"
                        >
                            Clear Conversation Log
                        </button>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}