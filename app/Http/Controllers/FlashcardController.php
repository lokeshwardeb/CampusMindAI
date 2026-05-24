<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
namespace App\Http\Controllers;

use App\Models\Flashcard;
use Illuminate\Http\Request;
use Inertia\Inertia;
namespace App\Http\Controllers;

use App\Models\Flashcard;
use App\Services\OpenRouterService;
use Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;
use OpenAI\Laravel\Facades\OpenAI;

class FlashcardController extends Controller
{
    public function index()
    {
        return Inertia::render('Flashcards', [
            'flashcards' => auth()->user()->flashcards()->latest()->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'question' => 'required|string',
            'answer' => 'required|string',
        ]);

        auth()->user()->flashcards()->create($validated);
        return back();
    }

    public function generate(Request $request)
    {
        $topic = $request->input('topic');
        
        $result = OpenAI::chat()->create([
            'model' => 'gpt-4o',
            'messages' => [
                ['role' => 'system', 'content' => 'Generate 3 flashcards in JSON format: [{"question":"...", "answer":"..."}]'],
                ['role' => 'user', 'content' => "Topic: $topic"],
            ],
            'response_format' => ['type' => 'json_object'],
        ]);

        $data = json_decode($result->choices[0]->message->content, true);
        
        foreach ($data['cards'] as $card) {
            auth()->user()->flashcards()->create($card);
        }

        return back();
    }



    public function get_generate_flashcards(Request $request, OpenRouterService $aiService)
{
    // $request->validate([
    //     'topic' => 'required|string|max:255',
    //     'count' => 'required|integer|min:1|max:10'
    // ]);

    $systemInstruction = "You are a study assistant. You must respond ONLY with a raw, valid JSON array containing exactly the requested amount of flashcards. Do not include markdown formatting, explanations, or extra text.";

    $prompt = "Generate {$request->count} flashcards about '{$request->topic}'. Match this exact JSON structure:
    [
        {\"question\": \"Question text\", \"answer\": \"Answer text\"}
    ]";

    $aiOutput = $aiService->askAI($prompt, $systemInstruction);

    // safer JSON extraction
    preg_match('/\[[\s\S]*\]/', $aiOutput, $matches);
    $cleanJson = $matches[0] ?? null;

    $cardsData = json_decode($cleanJson, true);

    // if (!is_array($cardsData)) {
    //     return back()->withErrors(['topic' => 'AI generation failed. Please try again.']);
    // }

    foreach ($cardsData as $card) {
        if (!isset($card['question'], $card['answer'])) {
            continue;
        }

        Flashcard::create([
            'user_id'   => Auth::id(),
            'question'  => $card['question'],
            'answer'    => $card['answer'],
            'deck_name' => $request->topic,
        ]);
    }

    return redirect()->back()->with([
        'flashcards' => Flashcard::where('user_id', Auth::id())->get()
    ]);
}


    //   public function generate_flashcards(Request $request, OpenRouterService $aiService)
    // {
    //     $request->validate([
    //         'topic' => 'required|string|max:255',
    //         'count' => 'required|integer|min:1|max:10'
    //     ]);

    //     $systemInstruction = "You are a study assistant. You must respond ONLY with a raw, valid JSON array containing exactly the requested amount of flashcards. Do not include markdown formatting, explanations, or extra text.";
        
    //     $prompt = "Generate {$request->count} flashcards about '{$request->topic}'. Match this exact JSON structure: 
    //     [
    //         {\"question\": \"Question text\", \"answer\": \"Answer text\"}
    //     ]";

    //     $aiOutput = $aiService->askAI($prompt, $systemInstruction);
        
    //     // Clean potential markdown or extra whitespace
    //     $cleanJson = trim(str_replace(['```json', '```'], '', $aiOutput));
    //     $cardsData = json_decode($cleanJson, true);

    //     if (!is_array($cardsData)) {
    //         return back()->withErrors(['topic' => 'AI generation failed. Please try again.']);
    //     }

    //     foreach ($cardsData as $card) {
    //         Flashcard::create([
    //             'user_id'   => Auth::id(),
    //             'question'  => $card['question'],
    //             'answer'    => $card['answer'],
    //             'deck_name' => $request->topic,
    //         ]);
    //     }

    //     // return back()->with('success', 'Flashcards generated successfully!');

    //     return redirect()->back();
    // }
}