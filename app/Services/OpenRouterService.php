<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OpenRouterService
{
    protected string $apiKey;
    protected string $baseUrl = 'https://openrouter.ai/api/v1/chat/completions';

    public function __construct()
    {
        $this->apiKey = config('services.openrouter.key');
    }

    /**
     * Send a prompt to OpenRouter using a recommended open-source model.
     */
    public function askAI(string $prompt, string $systemInstruction = 'You are a helpful academic assistant.'): ?string
    {
        try {
            // Using meta-llama/llama-3-8b-instruct as an excellent free/low-cost model option
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'HTTP-Referer'  => config('app.url', 'http://localhost'), 
                'X-Title'       => 'CampusMind AI',
                'Content-Type'  => 'application/json',
            ])->post($this->baseUrl, [
                'model' => 'meta-llama/llama-3-8b-instruct:free',
                'messages' => [
                    ['role' => 'system', 'content' => $systemInstruction],
                    ['role' => 'user', 'content' => $prompt]
                ],
                'temperature' => 0.7,
            ]);

            if ($response->successful()) {
                return $response->json('choices.0.message.content');
            }

            Log::error('OpenRouter API Error: ' . $response->body());
            return null;

        } catch (\Exception $e) {
            Log::error('OpenRouter Connection Exception: ' . $e->getMessage());
            return null;
        }
    }
}