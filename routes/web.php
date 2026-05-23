<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes - CampusMind AI
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->group(function () {

    // 1. Dashboard Panel
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard', [
            // Example of passing live metrics down to your React view
            'stats' => [
                ['label' => 'Chats Today', 'count' => 12, 'icon' => '💬', 'color' => 'bg-indigo-50 text-indigo-600'],
                ['label' => 'Quizzes Solved', 'count' => 8, 'icon' => '📝', 'color' => 'bg-emerald-50 text-emerald-600'],
                ['label' => 'Flashcards Created', 'count' => 36, 'icon' => '🗂️', 'color' => 'bg-amber-50 text-amber-600'],
                ['label' => 'Study Plans', 'count' => 5, 'icon' => '📅', 'color' => 'bg-blue-50 text-blue-600'],
            ]
        ]);
    })->name('dashboard');

    // 2. AI Chat Panel
    Route::get('/ai-chat', function () {
        return Inertia::render('AiChat');
    })->name('ai-chat');

    // 3. Summarizer Panel
    Route::get('/summarizer', function () {
        return Inertia::render('Summarizer');
    })->name('summarizer');

    // 4. Quiz Generator Panel
    Route::get('/quiz-generator', function () {
        return Inertia::render('QuizGenerator');
    })->name('quiz-generator');

    // 5. Flashcards Panel
    Route::get('/flashcards', function () {
        return Inertia::render('Flashcards');
    })->name('flashcards');

    // 6. Study Planner Panel
    Route::get('/study-planner', function () {
        return Inertia::render('StudyPlanner');
    })->name('study-planner');

    // 7. History Panel
    Route::get('/history', function () {
        return Inertia::render('History');
    })->name('history');

    // Placeholders for remaining sidebar items to prevent 404s
    Route::get('/notes', function () { return Inertia::render('Dashboard'); })->name('notes');
    Route::get('/bookmarks', function () { return Inertia::render('Dashboard'); })->name('bookmarks');
    Route::get('/profile', function () { return Inertia::render('Dashboard'); })->name('profile');
    Route::get('/settings', function () { return Inertia::render('Dashboard'); })->name('settings');
});