<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class AIService
{
    public function generate($type, $input)
    {
        $prompt = $this->buildPrompt($type, $input);

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . env('OPENROUTER_API_KEY'),
            'Content-Type' => 'application/json',
        ])->post('https://openrouter.ai/api/v1/chat/completions', [
            'model' => 'openai/gpt-4o-mini',
            'messages' => [
                [
                    'role' => 'system',
                    'content' => 'You are CampusMind AI, an intelligent academic assistant. Always respond in structured, simple, exam-friendly format.'
                ],
                [
                    'role' => 'user',
                    'content' => $prompt
                ]
            ],
            'temperature' => 0.7,
        ]);

        return $response->json();
    }

    private function buildPrompt($type, $input)
    {
        return match ($type) {

            'chat' =>
                $input,

            'summary' =>
                "Summarize the following text into bullet points:\n\n" . $input,

            'quiz' =>
                "Generate 5 MCQs with answers from this topic:\n\n" . $input,

            'flashcards' =>
                "Create 10 flashcards with Question and Answer format:\n\n" . $input,

            'planner' =>
                "Create a structured study plan based on this:\n\n" . $input,

            default =>
                $input
        };
    }
}