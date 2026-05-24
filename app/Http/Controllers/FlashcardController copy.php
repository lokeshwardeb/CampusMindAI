<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
namespace App\Http\Controllers;

use App\Models\Flashcard;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FlashcardController extends Controller
{
    public function index()
    {
        // Only get cards belonging to the logged-in user
        $cards = Flashcard::where('user_id', auth()->id())->get();
        return Inertia::render('Flashcards', ['cards' => $cards]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'question' => 'required|string',
            'answer' => 'required|string',
        ]);

        $request->user()->flashcards()->create($validated);
        return back();
    }
}