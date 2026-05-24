import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function QuizGenerator() {
    const [topic, setTopic] = useState('Photosynthesis in Plants');
    const [questionsCount, setQuestionsCount] = useState(5);

    return (
        <AuthenticatedLayout>
            <Head title="Quiz Generator" />
            
            <div className="max-w-4xl grid grid-cols-5 gap-6">
                {/* Configurations Panel */}
                <div className="col-span-2 bg-white border border-slate-100 rounded-2xl shadow-sm p-4 h-fit space-y-4">
                    <div>
                        <h2 className="text-sm font-bold text-slate-900">Quiz Generator</h2>
                        <p className="text-xxs text-slate-400">Generate MCQs from any topic or text.</p>
                    </div>

                    <div>
                        <label className="block text-xxs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Topic / Text</label>
                        <input 
                            type="text" 
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xxs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Number of Questions</label>
                        <select 
                            value={questionsCount}
                            onChange={(e) => setQuestionsCount(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none"
                        >
                            <option>5</option>
                            <option>10</option>
                            <option>15</option>
                        </select>
                    </div>

                    <button className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 shadow-sm transition-all">
                        Generate Quiz
                    </button>
                </div>

                {/* Generated Quiz View Layout */}
                <div className="col-span-3 bg-white border border-slate-100 rounded-2xl shadow-sm p-5 space-y-6">
                    {/* Question Item 1 */}
                    <div className="space-y-2.5">
                        <h3 className="text-xs font-bold text-slate-900">1. Which pigment is mainly responsible for photosynthesis?</h3>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <label className="p-2.5 border border-slate-100 rounded-xl flex items-center gap-2 cursor-pointer bg-slate-50">
                                <input type="radio" name="q1" className="text-blue-600 focus:ring-0" /> A) Carotene
                            </label>
                            <label className="p-2.5 border border-slate-100 rounded-xl flex items-center gap-2 cursor-pointer bg-slate-50">
                                <input type="radio" name="q1" className="text-blue-600 focus:ring-0" /> B) Xanthophyll
                            </label>
                            <label className="p-2.5 border-blue-500 border bg-blue-50/50 rounded-xl flex items-center gap-2 cursor-pointer font-semibold text-blue-700">
                                <input type="radio" name="q1" checked readOnly className="text-blue-600 focus:ring-0" /> C) Chlorophyll
                            </label>
                            <label className="p-2.5 border border-slate-100 rounded-xl flex items-center gap-2 cursor-pointer bg-slate-50">
                                <input type="radio" name="q1" className="text-blue-600 focus:ring-0" /> D) Anthocyanin
                            </label>
                        </div>
                        <p className="text-xxs font-bold text-emerald-600 bg-emerald-50 w-fit px-2 py-0.5 rounded">Answer: C) Chlorophyll</p>
                    </div>

                    {/* Question Item 2 */}
                    <div className="space-y-2.5 pt-4 border-t border-slate-100">
                        <h3 className="text-xs font-bold text-slate-900">2. Where does photosynthesis occur in plant cells?</h3>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <label className="p-2.5 border border-slate-100 rounded-xl flex items-center gap-2 cursor-pointer bg-slate-50">
                                <input type="radio" name="q2" className="text-blue-600 focus:ring-0" /> A) Nucleus
                            </label>
                            <label className="p-2.5 border-blue-500 border bg-blue-50/50 rounded-xl flex items-center gap-2 cursor-pointer font-semibold text-blue-700">
                                <input type="radio" name="q2" checked readOnly className="text-blue-600 focus:ring-0" /> B) Chloroplast
                            </label>
                            <label className="p-2.5 border border-slate-100 rounded-xl flex items-center gap-2 cursor-pointer bg-slate-50">
                                <input type="radio" name="q2" className="text-blue-600 focus:ring-0" /> C) Mitochondria
                            </label>
                            <label className="p-2.5 border border-slate-100 rounded-xl flex items-center gap-2 cursor-pointer bg-slate-50">
                                <input type="radio" name="q2" className="text-blue-600 focus:ring-0" /> D) Ribosome
                            </label>
                        </div>
                        <p className="text-xxs font-bold text-emerald-600 bg-emerald-50 w-fit px-2 py-0.5 rounded">Answer: B) Chloroplast</p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}