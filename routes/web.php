<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\FlashcardController;
use App\Http\Controllers\NotesController;
use App\Http\Controllers\QuizController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// 1. Public Routes
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'), // This checks if the route exists
        'canRegister' => Route::has('register'),
        'laravelVersion' => "12.0",
        'phpVersion' => PHP_VERSION,
    ]);
});

// 2. Authentication Routes (Include this early to ensure login/register exist)
require __DIR__.'/auth.php';

// 3. Protected Routes
Route::middleware(['auth', 'verified'])->group(function () {
    
    Route::get('/dashboard', fn() => Inertia::render('Dashboard'))->name('dashboard');

    // AI Features (Single source of truth)
    Route::get('/ai-chat', [ChatController::class, 'index'])->name('ai-chat');
    Route::post('/ai-chat', [ChatController::class, 'store'])->name('ai-chat.store');

    Route::get('/summarizer', [NotesController::class, 'index'])->name('summarizer');
    Route::post('/summarizer', [NotesController::class, 'store'])->name('summarizer.store');

    Route::get('/quiz-generator', [QuizController::class, 'index'])->name('quiz-generator');
    Route::post('/quiz-generator', [QuizController::class, 'store'])->name('quiz-generator.store');

    // Other pages
    Route::get('/flashcards', fn() => Inertia::render('Flashcards'))->name('flashcards');


    Route::get('/flashcards', [FlashcardController::class, 'index'])->name('flashcards');


    // Route::post('/flashcards', [FlashcardController::class, 'generate_flashcards'])->name('flashcards.store');
    Route::post('/flashcards/generate', [FlashcardController::class, 'get_generate_flashcards'])->name('flashcards.generate');
    // Route::post('/flashcards/generate', [FlashcardController::class, 'generate'])->name('flashcards.generate');
    Route::delete('/flashcards/{id}', [FlashcardController::class, 'destroy'])->name('flashcards.destroy');


    Route::get('/notes', [NotesController::class, 'notes_index'])->name('notes.index');
    Route::post('/notes', [NotesController::class, 'notes_store'])->name('notes.store');
    Route::post('/notes/generate', [NotesController::class, 'notes_generate'])->name('notes.generate');
    Route::delete('/notes/{note}', [NotesController::class, 'notes_destroy'])->name('notes.destroy');




    Route::get('/study-planner', fn() => Inertia::render('StudyPlanner'))->name('study-planner');
    Route::get('/history', fn() => Inertia::render('History'))->name('history');
    
    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});