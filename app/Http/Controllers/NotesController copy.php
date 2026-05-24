<?php

namespace App\Http\Controllers;

use App\Models\Note;
use App\Models\AiLog;
use App\Services\OpenRouterService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class NotesController extends Controller
{
    /**
     * Display the Summarizer workspace panel.
     * Passes historical summaries down to populate the reference history archive.
     */
    public function index()
    {
        $recentSummaries = Note::where('user_id', Auth::id())
            ->latest()
            ->get(['id', 'title', 'summary', 'created_at']);

        return Inertia::render('Summarizer', [
            'recentSummaries' => $recentSummaries
        ]);
    }

    /**
     * Handle inbound raw educational text blocks, dispatch them to OpenRouter,
     * save records to the database, and return flash states to the frontend template.
     */
    public function store(Request $request, OpenRouterService $aiService)
    {
        // 1. Enforce strict validation policies (Section 7.2 - Input Data Bounds Validation)
        $request->validate([
            'content' => 'required|string|min:20|max:50000',
            'length'  => 'required|string|in:Short,Medium,Long',
        ]);

        $rawText = $request->content;
        $targetLength = $request->length;

        // 2. Engineer the perfect instructional summary prompt
        $systemInstruction = "You are an advanced academic summarization engine built for university students. " .
                             "Your job is to read long course contents and extract crucial concepts into clean, highly readable markdown. " .
                             "Use bold terms, clear subheadings, and bullet points. Avoid conversational filler or introductory phrases.";

        $prompt = "Please provide a highly structured, comprehensively detailed **{$targetLength}** summary of the following material. " .
                  "Organize it logically with key definitions, formulas (if any), and core takeaways:\n\n" . $rawText;

        // 3. Fire request through your OpenRouter API Gateway integration layer
        $summaryResponse = $aiService->askAI($prompt, $systemInstruction);

        if (!$summaryResponse) {
            return back()->withErrors([
                'content' => 'The summarizer engine failed to parse this text. Please re-submit your lecture notes.'
            ]);
        }

        // 4. Generate an intuitive timestamped title using the first few words of the content
        $words = explode(' ', trim($rawText));
        $excerpt = implode(' ', array_slice($words, 0, 4));
        $generatedTitle = 'Summary: ' . ($excerpt ? $excerpt . '...' : now()->format('d M Y'));

        // 5. Commit properties to the primary notes table layout model mapping
        $note = Note::create([
            'user_id' => Auth::id(),
            'title'   => $generatedTitle,
            'content' => $rawText,
            'summary' => $summaryResponse,
        ]);

        // 6. Record interaction parameters to systemic AI Usage Logs (Section 9)
        AiLog::create([
            'user_id'      => Auth::id(),
            'prompt'       => 'Summarized text length (' . strlen($rawText) . ' chars) with parameter setting: ' . $targetLength,
            'response'     => $summaryResponse,
            'feature_type' => 'Summarizer'
        ]);

        // Flash response directly back to single page application state props variables
        return redirect()->route('summarizer')->with('generatedSummary', $summaryResponse);
    }

    /**
     * Fetch a single historical note summary asynchronously if needed.
     */
    public function show(Note $note)
    {
        if ($note->user_id !== Auth::id()) {
            abort(403, 'Unauthorized access to this academic log record.');
        }

        return response()->json($note);
    }

    /**
     * Purge a saved summary block from the user's workspace.
     */
    public function destroy(Note $note)
    {
        if ($note->user_id !== Auth::id()) {
            abort(403);
        }

        $note->delete();

        return redirect()->route('summarizer')->with('message', 'Summary archive successfully removed.');
    }
}