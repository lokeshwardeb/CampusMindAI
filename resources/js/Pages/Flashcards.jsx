import React, { useMemo, useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';

export default function Flashcards({ flashcards }) {
    const [loading, setLoading] = useState(false);
    const [cards, setCards] = useState(flashcards || []);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState('All');
    const [newQuestion, setNewQuestion] = useState('');
    const [newAnswer, setNewAnswer] = useState('');
    const [aiTopic, setAiTopic] = useState('');

    const shuffleCards = () => {
        const shuffled = [...cards].sort(() => Math.random() - 0.5);
        setCards(shuffled);
        setCurrentIndex(0);
        setShowAnswer(false);
    };

    // Sync state when flashcards prop changes
    useEffect(() => {
        setCards(flashcards || []);
        setCurrentIndex(0); // FIX: reset index
    }, [flashcards]);

    const filteredCards = useMemo(() => {
        return cards.filter((card) => {
            const matchSearch =
                card.question.toLowerCase().includes(search.toLowerCase()) ||
                card.answer.toLowerCase().includes(search.toLowerCase());

            const matchDifficulty =
                selectedDifficulty === 'All'
                    ? true
                    : card.difficulty === selectedDifficulty;

            return matchSearch && matchDifficulty;
        });
    }, [cards, search, selectedDifficulty]);

    const currentCard = filteredCards[currentIndex];

    const nextCard = () => {
        setShowAnswer(false);
        setCurrentIndex((prev) =>
            prev < filteredCards.length - 1 ? prev + 1 : 0
        );
    };

    const previousCard = () => {
        setShowAnswer(false);
        setCurrentIndex((prev) =>
            prev > 0 ? prev - 1 : filteredCards.length - 1
        );
    };

    const addFlashcard = () => {
        if (!newQuestion || !newAnswer) return;

        router.post(route('flashcards.store'), {
            question: newQuestion,
            answer: newAnswer,
            deck_name: 'General',
            difficulty: 'Medium'
        }, {
            onSuccess: () => {
                setNewQuestion('');
                setNewAnswer('');
            }
        });
    };

    const deleteCard = (id) => {
        router.delete(route('flashcards.destroy', id), {
            onSuccess: () => setCurrentIndex(0)
        });
    };

    const generateAIFlashcards = () => {
        if (!aiTopic) return;

        setLoading(true);

        router.post(route('flashcards.generate'), { topic: aiTopic }, {
            onSuccess: () => {
                setAiTopic('');
                setLoading(false);

                // FIX: reload updated flashcards from backend
                router.reload({ only: ['flashcards'] });
            },
            onError: (e) => {setLoading(false)

                console.log('error flashcvard')
                console.log(e)
            }
        });
    };

    const masteredCount = cards.filter(card => card.mastered).length;
    const favoriteCount = cards.filter(card => card.favorite).length;

    const progress =
        cards.length === 0
            ? 0
            : Math.round((masteredCount / cards.length) * 100);

    return (
        <AuthenticatedLayout>
            <Head title="Flashcards" />

            <div className="max-w-6xl mx-auto">

                {/* HEADER */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">
                            Flashcards
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            AI-powered smart revision system for students.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={shuffleCards}
                            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-50 shadow-sm"
                        >
                            🔀 Shuffle
                        </button>

                        <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-sm">
                            + New Deck
                        </button>
                    </div>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                        <p className="text-xs text-slate-400 mb-1">Total Cards</p>
                        <h2 className="text-2xl font-bold">{cards.length}</h2>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                        <p className="text-xs text-slate-400 mb-1">Mastered</p>
                        <h2 className="text-2xl font-bold text-green-600">
                            {masteredCount}
                        </h2>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                        <p className="text-xs text-slate-400 mb-1">Favorites</p>
                        <h2 className="text-2xl font-bold text-yellow-500">
                            {favoriteCount}
                        </h2>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                        <p className="text-xs text-slate-400 mb-1">Study Progress</p>
                        <h2 className="text-2xl font-bold text-blue-600">
                            {progress}%
                        </h2>
                    </div>
                </div>

                {/* FILTERS */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Search flashcards..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
                        />

                        <select
                            value={selectedDifficulty}
                            onChange={(e) => setSelectedDifficulty(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
                        >
                            <option>All</option>
                            <option>Easy</option>
                            <option>Medium</option>
                            <option>Hard</option>
                        </select>
                    </div>
                </div>

                {/* AI */}
                <div className="bg-white rounded-2xl border p-6 mb-8">
                    <h2 className="text-lg font-bold mb-3">
                        🤖 AI Flashcard Generator
                    </h2>

                    <div className="flex gap-3">
                        <input
                            value={aiTopic}
                            onChange={(e) => setAiTopic(e.target.value)}
                            placeholder="Enter topic..."
                            className="flex-1 border rounded-xl px-4 py-3 text-sm"
                        />

                        <button
                            onClick={generateAIFlashcards}
                            className="px-6 py-3 bg-blue-600 text-white rounded-xl"
                        >
                            Generate
                        </button>
                    </div>
                </div>

                {/* FLASHCARD */}
                {currentCard && (
                    <div className="flex items-center gap-6">

                        <button onClick={previousCard}>❮</button>

                        <div className="flex-1 bg-white p-10 rounded-3xl text-center">

                            <h2 className="text-3xl font-bold">
                                {showAnswer ? currentCard.answer : currentCard.question}
                            </h2>

                            <div className="mt-6 flex gap-3 justify-center">

                                <button onClick={() => setShowAnswer(!showAnswer)}>
                                    {showAnswer ? 'Show Question' : 'Show Answer'}
                                </button>

                                <button onClick={() => deleteCard(currentCard.id)}>
                                    Delete
                                </button>
                            </div>

                        </div>

                        <button onClick={nextCard}>❯</button>
                    </div>
                )}

            </div>
        </AuthenticatedLayout>
    );
}