<?php

namespace App\Http\Controllers;

use App\Models\Quiz;
use App\Services\OpenRouterService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class QuizController extends Controller
{
    public function index()
    {
        return Inertia::render('QuizGenerator', [
            'quizHistory' => Quiz::where('user_id', Auth::id())->latest()->get()
        ]);
    }

    public function store(Request $request, OpenRouterService $aiService)
    {
        $request->validate([
            'topic' => 'required|string|max:255',
            'questions_count' => 'required|integer|min:1|max:15'
        ]);

        // Prompt engineering targeting formatted structured JSON responses
        $systemInstruction = "You are an academic test generator. You must respond ONLY with a raw, valid JSON array containing exactly the requested amount of multiple-choice questions. Do not include markdown formatting code blocks, explanation or extra text outside the JSON output.";
        
        $prompt = "Generate exactly {$request->questions_count} multiple choice questions about '{$request->topic}'. Each item object inside the array must match this exact structure: 
        {
            \"question\": \"The question text\",
            \"options\": {\"A\": \"Option text\", \"B\": \"Option text\", \"C\": \"Option text\", \"D\": \"Option text\"},
            \"correct_answer\": \"C\"
        }";

        $aiOutput = $aiService->askAI($prompt, $systemInstruction);
        
        // Sanitize response from standard markdown wrappers if generated accidentally
        $cleanJson = trim(str_replace(['```json', '```'], '', $aiOutput));
        $questionsData = json_decode($cleanJson, true);

        if (!is_array($questionsData)) {
            return back()->withErrors(['topic' => 'AI response was busy or unstructured. Please try clicking generate again.']);
        }

        $quiz = Quiz::create([
            'user_id' => Auth::id(),
            'topic' => $request->topic,
            'generated_questions' => $questionsData
        ]);

        return back()->with('activeQuiz', $quiz);
    }
}