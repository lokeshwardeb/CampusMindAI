import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Summarizer() {
    const [text, setText] = useState('');
    const [length, setLength] = useState('Medium');

    return (
        <AuthenticatedLayout>
            <Head title="Summarize Text" />
            
            <div className="max-w-4xl">
                <h1 className="text-xl font-bold text-slate-900 mb-1">Summarize Text</h1>
                <p className="text-xs text-slate-400 mb-6">Paste your text below and get a concise summary.</p>

                <div className="grid grid-cols-2 gap-6">
                    {/* Input Area */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-2">Enter Text</label>
                            <textarea 
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Paste or type long operational or context educational texts here..."
                                className="w-full h-80 p-4 bg-white border border-slate-200 rounded-2xl text-xs focus:outline-none focus:border-blue-500 resize-none leading-relaxed"
                            />
                        </div>

                        {/* Controls Container */}
                        <div className="flex items-center justify-between bg-white p-3 border border-slate-100 rounded-xl shadow-sm">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-500">Summary Length</span>
                                <select 
                                    value={length} 
                                    onChange={(e) => setLength(e.target.value)}
                                    className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 font-semibold text-slate-700 focus:outline-none"
                                >
                                    <option>Short</option>
                                    <option>Medium</option>
                                    <option>Long</option>
                                </select>
                            </div>
                            <button className="bg-blue-600 text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 shadow-sm transition-all">
                                Summarize
                            </button>
                        </div>
                    </div>

                    {/* Output Summary Area */}
                    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-50">
                                <h3 className="text-xs font-bold text-slate-900">Summary</h3>
                                <button className="text-slate-400 hover:text-slate-600 text-xs">📋</button>
                            </div>
                            <div className="text-xs text-slate-600 leading-relaxed space-y-2">
                                <p>• AI is the simulation of human intelligence in machines.</p>
                                <p>• It can learn from data, recognize patterns, and make decisions.</p>
                                <p>• Works without human intervention.</p>
                                <p>• Used in healthcare, finance, education, transportation, and more.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}