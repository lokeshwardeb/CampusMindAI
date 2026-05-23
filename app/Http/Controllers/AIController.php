<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\AIService;

class AIController extends Controller
{
    protected $ai;

    public function __construct(AIService $ai)
    {
        $this->ai = $ai;
    }

    public function handle(Request $request)
    {
        $request->validate([
            'type' => 'required|string',
            'input' => 'required|string',
        ]);

        $response = $this->ai->generate(
            $request->type,
            $request->input
        );

        return response()->json([
            'result' =>
                $response['choices'][0]['message']['content'] ?? 'No response'
        ]);
    }
}