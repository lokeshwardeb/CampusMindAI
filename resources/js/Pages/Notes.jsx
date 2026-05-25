import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';

import ReactMarkdown from 'react-markdown';


export default function Notes({ notes }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [topic, setTopic] = useState('');
    const [loading, setLoading] = useState(false);

    const saveNote = () => {
        router.post(route('notes.store'), { title, content }, {
            onSuccess: () => { setTitle(''); setContent(''); }
        });
    };

    const generateAI = () => {
        let check_ai_notes_prompt = document.getElementById('ai_notes_prompt').value;

        if(!check_ai_notes_prompt) {
            alert('Please enter a topic for the AI-generated notes.');
            return;
        }

        setLoading(true);
        router.post(route('notes.generate'), { topic }, {
            onSuccess: () => { setTopic(''); setLoading(false); }
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Notes" />
            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-6">Study Notes</h1>

                {/* AI Generator */}
                <div className="bg-white p-4 rounded-lg shadow mb-6 border">
                    <input className="w-full mb-2 p-2 border rounded" id='ai_notes_prompt' placeholder="AI Topic..." value={topic} onChange={e => setTopic(e.target.value)} />
                    {/* <button onClick={generateAI} disabled={loading} className="bg-purple-600 text-white px-4 py-2 rounded"> */}
                    <button onClick={generateAI} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded mt-2">
                        {loading ? 'Generating...' : 'Generate with AI'}
                    </button>
                </div>

                {/* Manual Note Editor */}
                <div className="bg-white p-4 rounded-lg shadow mb-8 border">
                    <input className="w-full mb-2 p-2 border rounded" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
                    <textarea className="w-full h-32 p-2 border rounded" placeholder="Content" value={content} onChange={e => setContent(e.target.value)} />
                    <button onClick={saveNote} className="bg-blue-600 text-white px-4 py-2 rounded mt-2">Save Note</button>
                </div>

                {/* List Notes */}
                <div className="grid gap-4">
                    {notes.map(note => (
                        <div key={note.id} className="bg-white p-4 rounded shadow border">
                            <h3 className="font-bold text-lg mb-4 text-blue-600 ">{note.title}</h3>
                            {/* <p className="text-gray-600 whitespace-pre-wrap">{note.content}</p> */}
                            <ReactMarkdown>{note.content}</ReactMarkdown>
                            <button onClick={() => router.delete(route('notes.destroy', note.id))} className="text-red-500 text-sm">Delete</button>
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}