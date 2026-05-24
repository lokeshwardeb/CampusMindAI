import React, { useMemo, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';

export default function Flashcards() {


    const [loading, setLoading] = useState(false);
    // const [aiTopic, setAiTopic] = useState('');

    // ----------------------------
    // SAMPLE FLASHCARDS
    // ----------------------------
    const initialCards = [
        {
            id: 1,
            question: 'What is the powerhouse of the cell?',
            answer: '⚡ Mitochondria',
            subject: 'Biology',
            difficulty: 'Easy',
            mastered: false,
            favorite: true,
        },
        {
            id: 2,
            question: 'What does DBMS stand for?',
            answer: 'Database Management System',
            subject: 'Database',
            difficulty: 'Medium',
            mastered: false,
            favorite: false,
        },
        {
            id: 3,
            question: 'What is React?',
            answer: 'A JavaScript library for building user interfaces.',
            subject: 'Programming',
            difficulty: 'Easy',
            mastered: true,
            favorite: false,
        },
    ];

    // ----------------------------
    // STATES
    // ----------------------------
    const [cards, setCards] = useState(initialCards);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);

    const [search, setSearch] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState('All');

    const [newQuestion, setNewQuestion] = useState('');
    const [newAnswer, setNewAnswer] = useState('');

    const [aiTopic, setAiTopic] = useState('');

    // ----------------------------
    // FILTERED CARDS
    // ----------------------------
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

    // ----------------------------
    // CURRENT CARD
    // ----------------------------
    const currentCard = filteredCards[currentIndex];

    // ----------------------------
    // NEXT CARD
    // ----------------------------
    const nextCard = () => {
        setShowAnswer(false);

        if (currentIndex < filteredCards.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setCurrentIndex(0);
        }
    };

    // ----------------------------
    // PREVIOUS CARD
    // ----------------------------
    const previousCard = () => {
        setShowAnswer(false);

        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        } else {
            setCurrentIndex(filteredCards.length - 1);
        }
    };

    // ----------------------------
    // ADD NEW CARD
    // ----------------------------
    const addFlashcard = () => {

        if (!newQuestion || !newAnswer) return;

        const newCard = {
            id: Date.now(),
            question: newQuestion,
            answer: newAnswer,
            subject: 'General',
            difficulty: 'Medium',
            mastered: false,
            favorite: false,
        };

        setCards([newCard, ...cards]);

        setNewQuestion('');
        setNewAnswer('');
    };

    // ----------------------------
    // DELETE CARD
    // ----------------------------
    const deleteCard = (id) => {

        const updated = cards.filter(card => card.id !== id);

        setCards(updated);

        setCurrentIndex(0);
    };

    // ----------------------------
    // TOGGLE MASTERED
    // ----------------------------
    const toggleMastered = (id) => {

        const updated = cards.map(card =>
            card.id === id
                ? { ...card, mastered: !card.mastered }
                : card
        );

        setCards(updated);
    };

    // ----------------------------
    // TOGGLE FAVORITE
    // ----------------------------
    const toggleFavorite = (id) => {

        const updated = cards.map(card =>
            card.id === id
                ? { ...card, favorite: !card.favorite }
                : card
        );

        setCards(updated);
    };

    // ----------------------------
    // SHUFFLE CARDS
    // ----------------------------
    const shuffleCards = () => {

        const shuffled = [...cards].sort(() => Math.random() - 0.5);

        setCards(shuffled);

        setCurrentIndex(0);

        setShowAnswer(false);
    };

    // ----------------------------
    // AI GENERATE (DEMO)
    // ----------------------------
    // const generateAIFlashcards = () => {

    //     if (!aiTopic) return;

    //     const generated = [
    //         {
    //             id: Date.now(),
    //             question: `What is ${aiTopic}?`,
    //             answer: `${aiTopic} is an important academic topic.`,
    //             subject: aiTopic,
    //             difficulty: 'Easy',
    //             mastered: false,
    //             favorite: false,
    //         },
    //         {
    //             id: Date.now() + 1,
    //             question: `Why is ${aiTopic} important?`,
    //             answer: `${aiTopic} is important for understanding core concepts.`,
    //             subject: aiTopic,
    //             difficulty: 'Medium',
    //             mastered: false,
    //             favorite: false,
    //         },
    //     ];

    //     setCards([...generated, ...cards]);

    //     setAiTopic('');
    // };



    const generateAIFlashcards = () => {
        if (!aiTopic) return;
        
        setLoading(true);
        
        router.post(route('flashcards.store'), { 
            topic: aiTopic,
            count: 5 // You can make this dynamic if you add a count input
        }, {
            onSuccess: () => {
                setAiTopic('');
                setLoading(false);
                // Note: If you want to auto-refresh the list, ensure your 
                // controller returns the updated list or uses inertia-props
            },
            onError: () => {
                setLoading(false);
                alert("Failed to generate flashcards.");
            }
        });
    };



    // ----------------------------
    // STATS
    // ----------------------------
    const masteredCount = cards.filter(card => card.mastered).length;
    const favoriteCount = cards.filter(card => card.favorite).length;

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

                        <button
                            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-sm"
                        >
                            + New Deck
                        </button>
                    </div>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">

                    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                        <p className="text-xs text-slate-400 mb-1">
                            Total Cards
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900">
                            {cards.length}
                        </h2>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                        <p className="text-xs text-slate-400 mb-1">
                            Mastered
                        </p>

                        <h2 className="text-2xl font-bold text-green-600">
                            {masteredCount}
                        </h2>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                        <p className="text-xs text-slate-400 mb-1">
                            Favorites
                        </p>

                        <h2 className="text-2xl font-bold text-yellow-500">
                            {favoriteCount}
                        </h2>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                        <p className="text-xs text-slate-400 mb-1">
                            Study Progress
                        </p>

                        <h2 className="text-2xl font-bold text-blue-600">
                            {Math.round((masteredCount / cards.length) * 100)}%
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
                            className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <select
                            value={selectedDifficulty}
                            onChange={(e) => setSelectedDifficulty(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option>All</option>
                            <option>Easy</option>
                            <option>Medium</option>
                            <option>Hard</option>
                        </select>
                    </div>
                </div>

                {/* AI GENERATOR */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-8">

                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">
                                🤖 AI Flashcard Generator
                            </h2>

                            <p className="text-sm text-slate-500">
                                Generate flashcards automatically using AI.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-3">

                        <input
                            type="text"
                            placeholder="Enter topic or notes..."
                            value={aiTopic}
                            onChange={(e) => setAiTopic(e.target.value)}
                            className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <button
                            onClick={generateAIFlashcards}
                            className="px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-sm"
                        >
                            Generate with AI
                        </button>
                    </div>
                </div>

                {/* ADD FLASHCARD */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-8">

                    <h2 className="text-lg font-bold text-slate-900 mb-4">
                        ➕ Create New Flashcard
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <input
                            type="text"
                            placeholder="Question"
                            value={newQuestion}
                            onChange={(e) => setNewQuestion(e.target.value)}
                            className="rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <input
                            type="text"
                            placeholder="Answer"
                            value={newAnswer}
                            onChange={(e) => setNewAnswer(e.target.value)}
                            className="rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        onClick={addFlashcard}
                        className="mt-4 px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800"
                    >
                        Save Flashcard
                    </button>
                </div>

                {/* FLASHCARD VIEW */}
                {currentCard && (
                    <div className="flex items-center gap-6">

                        {/* PREV */}
                        <button
                            onClick={previousCard}
                            className="w-12 h-12 rounded-full border bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 shadow-sm font-bold"
                        >
                            ❮
                        </button>

                        {/* CARD */}
                        <div className="flex-1 bg-white border border-slate-100 rounded-3xl shadow-sm p-10 min-h-[380px] flex flex-col justify-between items-center text-center">

                            <div className="flex justify-between items-center w-full mb-8">

                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    Card {currentIndex + 1} / {filteredCards.length}
                                </span>

                                <div className="flex gap-2">

                                    <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700 font-semibold">
                                        {currentCard.subject}
                                    </span>

                                    <span className="px-3 py-1 rounded-full text-xs bg-slate-100 text-slate-700 font-semibold">
                                        {currentCard.difficulty}
                                    </span>
                                </div>
                            </div>

                            <div className="my-auto">

                                <h2 className="text-3xl font-bold text-slate-800 max-w-2xl leading-relaxed">

                                    {showAnswer
                                        ? currentCard.answer
                                        : currentCard.question}
                                </h2>
                            </div>

                            {/* ACTIONS */}
                            <div className="w-full border-t border-slate-100 pt-6 flex flex-wrap justify-center gap-3">

                                <button
                                    onClick={() => toggleFavorite(currentCard.id)}
                                    className={`px-4 py-2 rounded-xl text-sm font-semibold border ${
                                        currentCard.favorite
                                            ? 'bg-yellow-100 border-yellow-300 text-yellow-700'
                                            : 'bg-white border-slate-200 text-slate-600'
                                    }`}
                                >
                                    ⭐ Favorite
                                </button>

                                <button
                                    onClick={() => toggleMastered(currentCard.id)}
                                    className={`px-4 py-2 rounded-xl text-sm font-semibold border ${
                                        currentCard.mastered
                                            ? 'bg-green-100 border-green-300 text-green-700'
                                            : 'bg-white border-slate-200 text-slate-600'
                                    }`}
                                >
                                    ✔ Mastered
                                </button>

                                <button
                                    onClick={() => setShowAnswer(!showAnswer)}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700"
                                >
                                    {showAnswer
                                        ? 'Show Question'
                                        : 'Show Answer'}
                                </button>

                                <button
                                    onClick={() => deleteCard(currentCard.id)}
                                    className="px-4 py-2 border border-rose-200 rounded-xl text-sm font-semibold text-rose-500 hover:bg-rose-50"
                                >
                                    🗑 Delete
                                </button>
                            </div>
                        </div>

                        {/* NEXT */}
                        <button
                            onClick={nextCard}
                            className="w-12 h-12 rounded-full border bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 shadow-sm font-bold"
                        >
                            ❯
                        </button>
                    </div>
                )}

            </div>
        </AuthenticatedLayout>
    );
}