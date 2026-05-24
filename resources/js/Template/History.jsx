import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function History() {
    const logs = [
        { type: 'Chat', title: 'Explain Newton\'s Laws', preview: 'Newton\'s three laws of motion...', date: '12 May 2024, 10:30 AM', color: 'bg-blue-50 text-blue-600' },
        { type: 'Summary', title: 'Photosynthesis', preview: '• Light absorption by chlorophyll...', date: '12 May 2024, 09:15 AM', color: 'bg-purple-50 text-purple-600' },
        { type: 'Quiz', title: 'Data Structures MCQ', preview: '1. Which data structure uses LIFO...', date: '11 May 2024, 07:45 PM', color: 'bg-emerald-50 text-emerald-600' },
        { type: 'Flashcard', title: 'Biology Basics', preview: 'Q. What is DNA? A. Deoxyribo...', date: '11 May 2024, 06:20 PM', color: 'bg-amber-50 text-amber-600' },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="History" />
            
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
                <div className="mb-6">
                    <h1 className="text-base font-bold text-slate-900 mb-0.5">History</h1>
                    <p className="text-xs text-slate-400">View your past activities with AI.</p>
                </div>

                {/* Filter Sub-nav Tab Bar */}
                <div className="flex gap-2 border-b border-slate-100 pb-3 mb-4">
                    {['All', 'Chats', 'Summaries', 'Quizzes', 'Flashcards', 'Plans'].map((tab, i) => (
                        <button key={i} className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${i === 0 ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Log List View Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="text-slate-400 font-bold border-b border-slate-100">
                                <th className="pb-3 pl-2">Type</th>
                                <th className="pb-3">Title / Topic</th>
                                <th className="pb-3">Preview</th>
                                <th className="pb-3">Date & Time</th>
                                <th className="pb-3 text-right pr-2">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                            {logs.map((log, index) => (
                                <tr key={index} className="hover:bg-slate-50/50 transition-all">
                                    <td className="py-3.5 pl-2">
                                        <span className={`px-2 py-0.5 rounded text-xxs font-bold ${log.color}`}>
                                            {log.type}
                                        </span>
                                    </td>
                                    <td className="py-3.5 font-bold text-slate-900">{log.title}</td>
                                    <td className="py-3.5 text-slate-400 font-normal truncate max-w-xs">{log.preview}</td>
                                    <td className="py-3.5 text-slate-500">{log.date}</td>
                                    <td className="py-3.5 text-right pr-2">
                                        <button className="text-rose-400 hover:text-rose-600 font-bold">🗑️</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}