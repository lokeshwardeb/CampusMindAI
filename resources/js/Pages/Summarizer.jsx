import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import ReactMarkdown from 'react-markdown';

export default function Summarizer({ recentSummaries = [] }) {
    const { flash, errors } = usePage().props;
    const [viewingSummary, setViewingSummary] = useState(null);
    const [inputMode, setInputMode] = useState('paste'); // Tracking options: 'paste' or 'upload'

    const { data, setData, post, processing, reset } = useForm({
        content: '',
        document: null,
        length: 'Medium',
    });

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setViewingSummary(null);

        // Inertia natively handles multipart/form-data conversions when file data handles are passed
        post(route('summarizer.store'), {
            onSuccess: () => {
                reset('content', 'document');
                // Reset file element safely if visible on standard HTML DOM tree
                const fileInput = document.getElementById('document-file');
                if (fileInput) fileInput.value = '';
            }
        });
    };

    const handleDeleteSummary = (id, e) => {
        e.stopPropagation();
        if (confirm('Delete this saved summary archive permanently?')) {
            router.delete(route('summarizer.destroy', id), {
                onSuccess: () => setViewingSummary(null)
            });
        }
    };

    const activeDisplaySummary = viewingSummary || flash?.generatedSummary;

    return (
        <AuthenticatedLayout>
            <Head title="Smart Note Summarizer" />
            
            <div className="grid grid-cols-4 gap-6 h-[calc(100vh-8rem)]">
                {/* Left Side Input Block Workspace Console */}
                <div className="col-span-3 flex flex-col gap-4 overflow-hidden">
                    <div>
                        <h1 className="text-base font-bold text-slate-900">Smart Note Summarizer</h1>
                        <p className="text-xs text-slate-400">Convert text payloads or physical documents into optimized study references[cite: 13, 142].</p>
                    </div>

                    {/* Mode Toggler Navigation Bar Tabs */}
                    <div className="flex gap-2 border-b border-slate-100 pb-1">
                        <button 
                            type="button"
                            onClick={() => { setInputMode('paste'); setData('document', null); }}
                            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${inputMode === 'paste' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            📋 Paste Lecture Text
                        </button>
                        <button 
                            type="button"
                            onClick={() => { setInputMode('upload'); setData('content', ''); }}
                            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${inputMode === 'upload' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            📁 Upload Document (.pdf, .txt)
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-6 flex-1 overflow-hidden">
                        {/* Editor Form Context Shell */}
                        <form onSubmit={handleFormSubmit} className="bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col justify-between overflow-hidden">
                            <div className="flex-1 p-5 bg-slate-50/20 flex flex-col justify-center">
                                {inputMode === 'paste' ? (
                                    <textarea 
                                        value={data.content || ''}
                                        onChange={(e) => setData('content', e.target.value)}
                                        disabled={processing}
                                        placeholder="Paste study materials or transcript text chunks here..."
                                        className="w-full h-full p-4 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 resize-none leading-relaxed disabled:opacity-60 placeholder:text-slate-400"
                                    />
                                ) : (
                                    <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 bg-white rounded-xl p-8 text-center transition-all relative group flex flex-col items-center justify-center h-full">
                                        <div className="text-3xl mb-2 text-slate-400 group-hover:scale-110 transition-transform">📄</div>
                                        <span className="text-xs font-bold text-slate-700 block">Drag & Drop Study Document Here</span>
                                        <span className="text-xxs text-slate-400 block mt-0.5">Supports PDF and TXT up to 10MB</span>
                                        
                                        <input 
                                            id="document-file"
                                            type="file" 
                                            accept=".pdf,.txt"
                                            onChange={(e) => setData('document', e.target.files[0])}
                                            disabled={processing}
                                            className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                                        />

                                        {data.document && (
                                            <div className="mt-4 px-4 py-2 bg-blue-50/50 border border-blue-100 rounded-xl text-xxs font-bold text-blue-600 animate-in fade-in zoom-in-95">
                                                Selected: {data.document.name} ({(data.document.size / 1024 / 1024).toFixed(2)} MB)
                                            </div>
                                        )}
                                    </div>
                                )}
                                {errors.content && <span className="text-xxs text-rose-500 font-bold mt-1 block">⚠️ {errors.content}</span>}
                                {errors.document && <span className="text-xxs text-rose-500 font-bold mt-1 block">⚠️ {errors.document}</span>}
                            </div>

                            {/* Actions Control Utility Footer */}
                            <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-white">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold text-slate-500">Target Scale:</span>
                                    <select 
                                        value={data.length} 
                                        onChange={(e) => setData('length', e.target.value)}
                                        disabled={processing}
                                        className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 font-semibold text-slate-700 focus:outline-none"
                                    >
                                        <option value="Short">Short Summary</option>
                                        <option value="Medium">Medium Summary</option>
                                        <option value="Long">Long Summary</option>
                                    </select>
                                </div>
                                <button 
                                    type="submit"
                                    disabled={processing || (inputMode === 'paste' ? !data.content?.trim() : !data.document)}
                                    className="bg-blue-600 text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 shadow-sm transition-all disabled:bg-slate-300"
                                >
                                    {processing ? 'Extracting & Parsing...' : 'Summarize File'}
                                </button>
                            </div>
                        </form>

                        {/* Summary Interactive Display Board */}
                        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col overflow-hidden">
                            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white">
                                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Generated Summarization</h2>
                                {viewingSummary && (
                                    <button onClick={() => setViewingSummary(null)} className="text-xxs font-bold text-blue-600 hover:underline">
                                        Clear Board view
                                    </button>
                                )}
                            </div>

                            <div className="flex-1 p-5 overflow-y-auto bg-white">
                                {processing ? (
                                    <div className="space-y-4 animate-pulse pt-2">
                                        <div className="h-3.5 bg-slate-100 rounded w-3/4"></div>
                                        <div className="h-3.5 bg-slate-100 rounded w-5/6"></div>
                                        <div className="h-3.5 bg-slate-100 rounded w-2/3"></div>
                                    </div>
                                ) : activeDisplaySummary ? (
                                    <div className="prose prose-base max-w-none prose-slate text-sm text-slate-700 leading-relaxed">
                                        <ReactMarkdown>{activeDisplaySummary}</ReactMarkdown>
                                    </div>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-center text-slate-400 text-xs italic p-4">
                                        Parsed abstractions and analytical reference indicators will build out here automatically[cite: 142].
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column Sidebar Log Index */}
                <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-4 flex flex-col overflow-hidden">
                    <h2 className="text-xs font-bold text-slate-900 mb-4 tracking-wider uppercase">Saved Documents</h2>
                    <div className="flex-1 space-y-2 overflow-y-auto pr-1">
                        {recentSummaries.length > 0 ? (
                            recentSummaries.map((note) => {
                                const isSelected = viewingSummary === note.summary;
                                return (
                                    <div 
                                        key={note.id} 
                                        onClick={() => setViewingSummary(note.summary)}
                                        className={`w-full text-left p-3 rounded-xl transition-all block cursor-pointer border group relative ${isSelected ? 'bg-blue-50/50 border-blue-200' : 'bg-white border-transparent hover:bg-slate-50/80 hover:border-slate-100'}`}
                                    >
                                        <span className={`text-xs font-bold block truncate pr-4 ${isSelected ? 'text-blue-600' : 'text-slate-700'}`}>{note.title}</span>
                                        <span className="text-xxs text-slate-400 mt-1 block">
                                            {new Date(note.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        <button 
                                            onClick={(e) => handleDeleteSummary(note.id, e)}
                                            className="absolute right-2 top-3 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 text-xs p-1 transition-all rounded-md"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                );
                            })
                        ) : (
                            <span className="text-xxs text-slate-400 block p-2">No historical uploads captured yet.</span>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}