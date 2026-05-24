import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function QuizGenerator({ quizHistory = [] }) {
    const { flash, errors } = usePage().props;
    
    // Core local states to preserve stability during active evaluation sessions
    const [currentQuiz, setCurrentQuiz] = useState(null);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [score, setScore] = useState(null);
    const [showResults, setShowResults] = useState(false);

    const { data, setData, post, processing } = useForm({
        topic: '',
        questions_count: 5
    });

    // Sync mechanism: Captures upcoming Inertia session data safely into React persistence lifecycles
    useEffect(() => {
        if (flash?.activeQuiz) {
            setCurrentQuiz(flash.activeQuiz);
            setSelectedAnswers({});
            setScore(null);
            setShowResults(false);
        }
    }, [flash?.activeQuiz]);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (!data.topic.trim() || processing) return;
        post(route('quiz-generator.store'));
    };

    const handleOptionSelect = (questionIndex, optionKey) => {
        if (showResults) return; // Freeze selections once evaluated
        setSelectedAnswers(prev => ({
            ...prev,
            [questionIndex]: optionKey
        }));
    };

    const handleEvaluateQuiz = () => {
        if (!currentQuiz?.generated_questions) return;
        
        let correctCount = 0;
        currentQuiz.generated_questions.forEach((q, idx) => {
            if (selectedAnswers[idx] === q.correct_answer) {
                correctCount++;
            }
        });

        setScore(correctCount);
        setShowResults(true);
    };

    return (
        <AuthenticatedLayout>
            <Head title="AI MCQ Quiz Generator" />
            
            <div className="max-w-6xl grid grid-cols-5 gap-6 h-[calc(100vh-8rem)]">
                {/* Configuration Panel Console (Left) */}
                <div className="col-span-2 bg-white border border-slate-100 rounded-2xl shadow-sm p-5 h-fit space-y-4">
                    <div>
                        <h2 className="text-base font-bold text-slate-900">Quiz Generator Console</h2>
                        <p className="text-xs text-slate-400">Configure parameters to prompt OpenRouter for structured testing matrix sets.</p>
                    </div>

                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xxs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Target Study Topic</label>
                            <input 
                                type="text" 
                                value={data.topic}
                                onChange={(e) => setData('topic', e.target.value)}
                                disabled={processing}
                                placeholder="e.g., Database Normalization (1NF, 2NF, 3NF)"
                                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 disabled:opacity-60 placeholder:text-slate-400"
                            />
                            {errors.topic && <span className="text-xxs text-rose-500 font-bold block mt-1">⚠️ {errors.topic}</span>}
                        </div>

                        <div>
                            <label className="block text-xxs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Question Volume Allocation</label>
                            <select 
                                value={data.questions_count}
                                onChange={(e) => setData('questions_count', parseInt(e.target.value))}
                                disabled={processing}
                                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none disabled:opacity-60"
                            >
                                <option value={5}>5 Questions</option>
                                <option value={10}>10 Questions</option>
                                <option value={15}>15 Questions</option>
                            </select>
                        </div>

                        <button 
                            type="submit"
                            disabled={processing || !data.topic.trim()}
                            className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 shadow-sm transition-all disabled:bg-slate-300"
                        >
                            {processing ? 'Compiling AI Matrix Arrays...' : 'Generate Smart Quiz'}
                        </button>
                    </form>
                </div>

                {/* Main Interactive Play-field Area (Right) */}
                <div className="col-span-3 bg-white border border-slate-100 rounded-2xl shadow-sm p-6 flex flex-col justify-between overflow-hidden">
                    <div className="p-1 border-b border-slate-100 pb-3 flex justify-between items-center bg-white flex-shrink-0">
                        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                            {currentQuiz ? `Testing Arena: ${currentQuiz.topic}` : 'Active Testing Grid'}
                        </h2>
                        
                        {showResults && (
                            <span className="text-xs font-bold px-3 py-1 bg-blue-50 text-blue-600 rounded-lg border border-blue-100 animate-bounce">
                                Final Score: {score} / {currentQuiz?.generated_questions?.length}
                            </span>
                        )}
                    </div>

                    {/* Active Question Scroll Canvas Container */}
                    <div className="flex-1 my-4 overflow-y-auto pr-1 space-y-6">
                        {processing ? (
                            <div className="space-y-6 pt-2 animate-pulse">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="space-y-3">
                                        <div className="h-4 bg-slate-100 rounded w-2/3"></div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="h-9 bg-slate-50 rounded-xl"></div>
                                            <div className="h-9 bg-slate-50 rounded-xl"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : currentQuiz?.generated_questions ? (
                            currentQuiz.generated_questions.map((q, qIdx) => (
                                <div key={qIdx} className="space-y-3 pb-4 border-b border-slate-50/60 last:border-0">
                                    <h3 className="text-sm font-bold text-slate-800 leading-normal">
                                        {qIdx + 1}. {q.question}
                                    </h3>
                                    
                                    <div className="grid grid-cols-2 gap-3">
                                        {Object.entries(q.options).map(([optKey, optVal]) => {
                                            const isSelected = selectedAnswers[qIdx] === optKey;
                                            const isCorrect = q.correct_answer === optKey;
                                            
                                            let selectionVariant = "border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300";
                                            
                                            if (isSelected) {
                                                selectionVariant = "border-blue-500 bg-blue-50/40 text-blue-800 font-semibold";
                                            }
                                            
                                            // Handle color variations upon hitting Evaluation review
                                            if (showResults) {
                                                if (isCorrect) {
                                                    selectionVariant = "border-emerald-500 bg-emerald-50 text-emerald-800 font-semibold";
                                                } else if (isSelected && !isCorrect) {
                                                    selectionVariant = "border-rose-300 bg-rose-50 text-rose-800 font-medium line-through";
                                                } else {
                                                    selectionVariant = "border-slate-100 bg-slate-50/30 opacity-60 pointer-events-none";
                                                }
                                            }

                                            return (
                                                <button
                                                    key={optKey}
                                                    type="button"
                                                    disabled={showResults}
                                                    onClick={() => handleOptionSelect(qIdx, optKey)}
                                                    className={`p-3 border text-left rounded-xl flex items-center gap-2.5 transition-all text-xs leading-relaxed ${selectionVariant}`}
                                                >
                                                    <span className="w-5 h-5 rounded-md bg-white border flex items-center justify-center font-bold text-slate-500 shadow-xs shrink-0">
                                                        {optKey}
                                                    </span>
                                                    <span>{optVal}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 text-xs italic p-12">
                                <span>No exam schema active. Formulate an inquiry inside the console tab parameters leftward.</span>
                            </div>
                        )}
                    </div>

                    {/* Bottom Dynamic Submittal Operational Bar */}
                    {currentQuiz?.generated_questions && (
                        <div className="pt-3 border-t border-slate-100 flex justify-end bg-white flex-shrink-0">
                            {!showResults ? (
                                <button
                                    type="button"
                                    onClick={handleEvaluateQuiz}
                                    disabled={Object.keys(selectedAnswers).length === 0}
                                    className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-sm disabled:bg-slate-200 disabled:text-slate-400"
                                >
                                    Submit Answers & Evaluate
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setCurrentQuiz(null);
                                        setSelectedAnswers({});
                                        setScore(null);
                                        setShowResults(false);
                                    }}
                                    className="border border-slate-200 text-slate-600 hover:bg-slate-50 px-6 py-2.5 rounded-xl text-xs font-semibold transition-all"
                                >
                                    Clear Current Board
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}