import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Flashcards() {
    const [showAnswer, setShowAnswer] = useState(false);

    return (
        <AuthenticatedLayout>
            <Head title="Flashcards" />
            
            <div className="max-w-3xl">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 mb-0.5">Flashcards</h1>
                        <p className="text-xs text-slate-400">Create and study flashcards.</p>
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-blue-700 shadow-sm transition-all">
                        + New Flashcard
                    </button>
                </div>

                {/* Deck Card View */}
                <div className="flex items-center justify-between gap-6">
                    <button className="w-10 h-10 rounded-full border bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 shadow-sm font-bold">❮</button>
                    
                    {/* Active Flashcard Canvas */}
                    <div className="flex-1 bg-white border border-slate-100 rounded-2xl shadow-sm p-8 min-h-64 flex flex-col justify-between items-center text-center relative overflow-hidden">
                        <span className="text-xxs font-bold text-slate-400 uppercase tracking-widest">Card 1 / 10</span>
                        
                        <div className="my-auto py-4">
                            <h2 className="text-base font-bold text-slate-800 max-w-md">
                                {showAnswer ? "⚡ Mitochondria" : "Q. What is the powerhouse of the cell?"}
                            </h2>
                        </div>

                        <div className="flex gap-2 w-full justify-center pt-4 border-t border-slate-50">
                            <button className="px-4 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-50">✏️ Edit</button>
                            <button 
                                onClick={() => setShowAnswer(!showAnswer)}
                                className="px-6 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 shadow-sm"
                            >
                                {showAnswer ? "Show Question" : "Show Answer"}
                            </button>
                            <button className="px-4 py-1.5 border border-rose-200 rounded-lg text-xs font-semibold text-rose-500 hover:bg-rose-50">🗑️ Delete</button>
                        </div>
                    </div>

                    <button className="w-10 h-10 rounded-full border bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 shadow-sm font-bold">❯</button>
                </div>
                
                <div className="flex justify-center mt-6">
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-xl text-xs font-bold shadow-md hover:bg-blue-700">Next</button>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}