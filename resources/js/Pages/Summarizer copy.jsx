import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import ReactMarkdown from 'react-markdown';

export default function Summarizer({ recentSummaries = [] }) {
    const { flash, errors } = usePage().props;
    
    // Manage which summary is currently active on the visual canvas board
    const [viewingSummary, setViewingSummary] = useState(null);

    const { data, setData, post, processing, reset } = useForm({
        content: '',
        length: 'Medium',
    });

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (!data.content.trim() || processing) return;
        
        // Clear active selection to show the upcoming fresh loading state
        setViewingSummary(null); 
        
        post(route('summarizer.store'), {
            onSuccess: () => reset('content')
        });
    };

    const handleDeleteSummary = (id, e) => {
        e.stopPropagation(); // Stop parent click event from firing selection state
        if (confirm('Are you sure you want to permanently delete this saved summary archive?')) {
            router.delete(route('summarizer.destroy', id), {
                onSuccess: () => setViewingSummary(null)
            });
        }
    };

    // Determine what text content should stream into the reading canvas layout
    const activeDisplaySummary = viewingSummary || flash?.generatedSummary;

    return (
        <AuthenticatedLayout>
            <Head title="Smart Note Summarizer" />
            
            <div className="grid grid-cols-4 gap-6 h-[calc(100vh-8rem)]">
                {/* Left Side: Input Form Console */}
                <div className="col-span-3 flex flex-col gap-6 overflow-hidden">
                    <div>
                        <h1 className="text-base font-bold text-slate-900">Smart Note Summarizer</h1>
                        <p className="text-xs text-slate-400">Convert long lecture text, modules, or PDFs into structured reference breakdowns.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 flex-1 overflow-hidden">
                        {/* Editor Slate Form Wrapper */}
                        <form onSubmit={handleFormSubmit} className="bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col justify-between overflow-hidden">
                            <div className="p-4 border-b border-slate-100 bg-white">
                                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Source Material</h2>
                            </div>
                            
                            <div className="flex-1 p-4 bg-slate-50/30">
                                <textarea 
                                    value={data.content}
                                    onChange={(e) => setData('content', e.target.value)}
                                    disabled={processing}
                                    placeholder="Paste comprehensive text files, study modules, or assignment prompts here (minimum 20 characters)..."
                                    className="w-full h-full p-4 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 resize-none leading-relaxed disabled:opacity-60 placeholder:text-slate-400"
                                />
                            </div>

                            <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-white">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold text-slate-500">Length:</span>
                                    <select 
                                        value={data.length} 
                                        onChange={(e) => setData('length', e.target.value)}
                                        disabled={processing}
                                        className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 font-semibold text-slate-700 focus:outline-none"
                                    >
                                        <option value="Short">Short</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Long">Long</option>
                                    </select>
                                </div>
                                <button 
                                    type="submit"
                                    disabled={processing || !data.content.trim()}
                                    className="bg-blue-600 text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 shadow-sm transition-all disabled:bg-slate-300"
                                >
                                    {processing ? 'Processing AI...' : 'Summarize'}
                                </button>
                            </div>
                        </form>

                        {/* Right Side: Output Render Canvas Panel */}
                        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col overflow-hidden">
                            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white">
                                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Abstract Generation Board</h2>
                                {viewingSummary && (
                                    <button 
                                        onClick={() => setViewingSummary(null)}
                                        className="text-xxs font-bold text-blue-600 hover:underline"
                                    >
                                        Clear Selection
                                    </button>
                                )}
                            </div>

                            <div className="flex-1 p-5 overflow-y-auto bg-white">
                                {processing ? (
                                    <div className="space-y-4 animate-pulse pt-2">
                                        <div className="h-3.5 bg-slate-100 rounded w-3/4"></div>
                                        <div className="h-3.5 bg-slate-100 rounded w-5/6"></div>
                                        <div className="h-3.5 bg-slate-100 rounded w-2/3"></div>
                                        <div className="h-3.5 bg-slate-100 rounded w-1/2"></div>
                                    </div>
                                ) : errors.content ? (
                                    <div className="text-xs text-rose-500 bg-rose-50 p-3 rounded-xl border border-rose-100 font-medium">
                                        ⚠️ {errors.content}
                                    </div>
                                ) : activeDisplaySummary ? (
                                    /* Safe wrapper element holding typography config overrides for custom Markdown styles */
                                    <div className="prose prose-base max-w-none prose-slate text-sm text-slate-700 leading-relaxed">
                                        <ReactMarkdown>{activeDisplaySummary}</ReactMarkdown>
                                    </div>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-center text-slate-400 text-xs italic p-4">
                                        Your generated abstractions and core concepts will populate here dynamically.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Saved Logs Archive History Panel */}
                <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-4 flex flex-col overflow-hidden">
                    <h2 className="text-xs font-bold text-slate-900 mb-4 tracking-wider uppercase">Saved Summaries</h2>
                    
                    <div className="flex-1 space-y-2 overflow-y-auto pr-1">
                        {recentSummaries.length > 0 ? (
                            recentSummaries.map((note) => {
                                const isSelected = viewingSummary === note.summary;
                                return (
                                    <div 
                                        key={note.id} 
                                        onClick={() => setViewingSummary(note.summary)}
                                        className={`w-full text-left p-3 rounded-xl transition-all block cursor-pointer border group relative ${
                                            isSelected 
                                                ? 'bg-blue-50/50 border-blue-200' 
                                                : 'bg-white border-transparent hover:bg-slate-50/80 hover:border-slate-100'
                                        }`}
                                    >
                                        <div className="flex justify-between items-start gap-2 pr-6">
                                            <span className={`text-xs font-bold block truncate ${isSelected ? 'text-blue-600' : 'text-slate-700'}`}>
                                                {note.title}
                                            </span>
                                        </div>
                                        <span className="text-xxs text-slate-400 mt-1 block">
                                            {new Date(note.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        
                                        {/* Hidden Delete Button that pops out on list hover */}
                                        <button 
                                            onClick={(e) => handleDeleteSummary(note.id, e)}
                                            className="absolute right-2 top-3 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 text-xs p-1 transition-all rounded-md hover:bg-slate-100"
                                            title="Delete Summary"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                );
                            })
                        ) : (
                            <span className="text-xxs text-slate-400 block p-2">No historical summaries captured yet.</span>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}