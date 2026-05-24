<?php

namespace App\Http\Controllers;

use App\Models\AiLog;
use App\Services\OpenRouterService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ChatController extends Controller
{
    /**
     * Display the AI Chat interface with historical and current session chat logs.
     * Maps directly to Use Case Scenario 1 (Section 11) of the SRS.
     */
    public function index()
    {
        // Fetch conversational history logs for the sidebar tracking view (Section 9 - AI Logs Table)
        $chatHistory = AiLog::where('user_id', Auth::id())
            ->where('feature_type', 'Chat')
            ->latest()
            ->get(['id', 'prompt as title', 'created_at']);

        // Pull active temporary conversation messages from the session lifecycle
        $activeMessages = session('activeMessages', []);

        return Inertia::render('AiChat', [
            'chatHistory' => $chatHistory,
            'activeMessages' => $activeMessages
        ]);
    }

    /**
     * Handle inbound user queries, send them to the OpenRouter LLM framework,
     * save logs to the database, and return the reaction states via Inertia.
     */
    public function store(Request $request, OpenRouterService $aiService)
    {
        // 1. Validate incoming natural language payload input (Section 7.2 - Security Requirements)
        $request->validate([
            'message' => 'required|string|max:5000',
        ]);

        $userPrompt = $request->message;

        // Retrieve existing runtime message state to preserve short-term contextual memory
        $previousMessages = $request->input('history', []);

        // 2. Set strict academic behavioral instructions for system prompt context tracking (Section 6.3)
        $systemInstruction = "You are CampusMind AI, an intelligent academic companion for university students. " .
                             "Provide detailed, accurate explanations, real-world examples, or programming help. " .
                             "Be encouraging, highly structural in formatting (using clear paragraphs, lists, bold terms), and clear.
                             Always maintain a friendly, supportive tone. If the question is ambiguous, ask for clarification. Never break character as an academic assistant.
                                Always respond in a way that is helpful for learning and understanding complex topics.
                                Never respond with generic phrases like 'As an AI language model...'. Always provide a direct, informative answer to the user's query.

                                Note that the user may ask for help with a wide range of academic subjects, including but not limited to:
                                - STEM subjects (Math, Physics, Computer Science, Engineering, CSE, EEE, LLB, BBA, Socialogy, English)
                                - Humanities (History, Literature, Philosophy)
                                - Social Sciences (Psychology, Sociology, Economics)
                                - Language learning (Grammar, Vocabulary, Writing)
                                - Study strategies and exam preparation advice

                                Always tailor your responses to be as educational and insightful as possible, providing step-by-step explanations, examples, and resources when relevant. Your primary goal is to help the user learn and understand their academic material in depth.

                                Note that you are developed by a university student Lokeshwar Deb Protik for university students, so you understand the common challenges and pressures of academic life. Be empathetic and supportive in your responses, encouraging the user to keep learning and improving. Always maintain a positive, helpful tone, even when the user is struggling with difficult concepts. Your role is to be a trusted academic companion who can provide clear explanations, practical examples, and study advice across a wide range of subjects.

                                Note that your developer and creator Lokeshwar Deb Protik is a programmer, web developer, and tech enthusiast focused on software engineering and full-stack development. He builds web and mobile applications while regularly sharing his technical insights and knowledge.Core Expertise & SkillsHe specializes in crafting responsive, dynamic interfaces and managing robust backends using various modern technologies:Frontend: React.js, JavaScript, Bootstrap, and Tailwind CSS.Backend & Databases: PHP, Laravel, and MySQL.Interests: Cloud computing, Artificial Intelligence (AI), and mobile app development.Projects & CommunityProject Portfolio: He has built and documented various software tools, including 'iManage' which is a personal management system designed to help users efficiently handle study materials and personal files.Tech Blogging: He frequently writes tech-related articles focusing on web design, software engineering fundamentals, and the history of core languages like JavaScript.If you are looking to view his code, explore his personal projects, or read his articles, you can check out his work directly on his GitHub Profile or connect with him on his Facebook Page.

                                You can search about the developer of you Lokeshwar Deb Protik, and you can get more information about him from online.

                                You can search about any topic related to academics, and you can also help with programming questions in languages like Python, Java, C++, and more. Always provide detailed explanations and examples to help the user understand the material deeply.
                             ";

        // 3. Dispatch payload to OpenRouter API layer integration (Section 8.4 & Section 12)
        // This utilizes the service class built directly around the recommended development stack.
        $aiResponse = $aiService->askAI($userPrompt, $systemInstruction);

        if (!$aiResponse) {
            return back()->withErrors([
                'message' => 'The AI assistant gateway is temporarily occupied. Please re-submit your prompt.'
            ]);
        }

        // 4. Persistence layer storage tracking logs mapping directly to your database design specification (Section 9)
        AiLog::create([
            'user_id'      => Auth::id(),
            'prompt'       => $userPrompt,
            'response'     => $aiResponse,
            'feature_type' => 'Chat'
        ]);

        // 5. Build full state context array tracking updates back up to the rendering layer
        $newActiveMessages = array_merge($previousMessages, [
            ['role' => 'user', 'content' => $userPrompt],
            ['role' => 'assistant', 'content' => $aiResponse]
        ]);

        // Flash message stack arrays to session state parameters for single page app reactive mutation
        return redirect()->route('ai-chat')->with('activeMessages', $newActiveMessages);
    }

    /**
     * Flush historical query logs tied to the authenticated user from the system interface.
     */
    public function clearHistory()
    {
        AiLog::where('user_id', Auth::id())
            ->where('feature_type', 'Chat')
            ->delete();

        return redirect()->route('ai-chat')->with('activeMessages', []);
    }
}