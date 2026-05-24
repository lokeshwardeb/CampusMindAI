<?php

namespace App\Http\Controllers;

use App\Models\Note;
use App\Models\AiLog;
use App\Services\OpenRouterService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Smalot\PdfParser\Parser;
use Inertia\Inertia;

class NotesController extends Controller
{
    public function index()
    {
        $recentSummaries = Note::where('user_id', Auth::id())
            ->latest()
            ->get(['id', 'title', 'summary', 'created_at']);

        return Inertia::render('Summarizer', [
            'recentSummaries' => $recentSummaries
        ]);
    }

    public function store(Request $request, OpenRouterService $aiService)
    {
        // Validate inputs: Now supports either a pasted string or an uploaded document file
        // $request->validate([
        //     // 'content' => 'required_without:document|string|nullable|max:50000',
        //     'content' => 'required_without:document|string|nullable',
        //     // 'document' => 'required_without:content|file|mimes:txt,pdf|max:10240', // Max 10MB file limit
        //     'document' => 'required_without:content|file|mimes:txt,pdf', // Max 10MB file limit
        //     // 'length'  => 'required|string|in:Short,Medium,Long',
        // ]);

            $request->validate([
                'content' => 'required_without:document|string|nullable',
                // 'document' => 'required_without:content|file|mimes:txt,pdf',
                'length'  => 'required|string|in:Short,Medium,Long',
            ]);

        $textToSummarize = '';
        $originalName = null;

        // Check if the student uploaded a physical document file
        if ($request->hasFile('document')) {
            $file = $request->file('document');
            $originalName = $file->getClientOriginalName();
            $extension = $file->getClientOriginalExtension();

            if ($extension === 'txt') {
                // Extract plain text string directly
                $textToSummarize = file_get_contents($file->getRealPath());
            } elseif ($extension === 'pdf') {
                // Extract text characters via the Smalot PDF Parser engine
                try {
                    $parser = new Parser();
                    $pdf = $parser->parseFile($file->getRealPath());
                    $textToSummarize = $pdf->getText();
                } catch (\Exception $e) {
                    return back()->withErrors([
                        'document' => 'Unable to read this specific PDF format structure. Ensure it is not password protected.'
                    ]);
                }
            }
        } else {
            // Fallback to manually pasted clipboard text content string
            $textToSummarize = $request->content;
        }

        // Safety Guard: Ensure text string extracted actually holds measurable information
        $textToSummarize = trim($textToSummarize);
        // if (strlen($textToSummarize) < 20) {
        //     return back()->withErrors([
        //         'content' => 'The extracted text content is too short to summarize (minimum 20 characters required).'
        //     ]);
        // }

        // Send parameters downstream to OpenRouter context prompt matrix layers
        $systemInstruction = "You are an advanced academic summarization engine built for university students. " .
                             "Your job is to read course materials and extract crucial concepts into highly readable markdown. " .
                             "Use bold terms, clear subheadings, and bullet points. Avoid conversational filler.";

        $prompt = "Please provide a highly structured, comprehensively detailed **{$request->length}** summary of the following material. " .
                  "Organize it logically with key definitions and core takeaways:\n\n" . $textToSummarize;

        $summaryResponse = $aiService->askAI($prompt, $systemInstruction);

        if (!$summaryResponse) {
            return back()->withErrors([
                'content' => 'The summarizer engine timed out processing this file. Try a shorter segment.'
            ]);
        }

        // Formulate a recognizable title using the document name or an excerpt summary title
        $generatedTitle = $originalName 
            ? 'Doc: ' . substr($originalName, 0, 25) 
            : 'Summary: ' . implode(' ', array_slice(explode(' ', $textToSummarize), 0, 4)) . '...';

        Note::create([
            'user_id' => Auth::id(),
            'title'   => $generatedTitle,
            'content' => substr($textToSummarize, 0, 10000), // Persist a reasonable sample snippet
            'summary' => $summaryResponse,
        ]);

        AiLog::create([
            'user_id'      => Auth::id(),
            'prompt'       => 'Summarized document processing format event source. Parameter length profile: ' . $request->length,
            'response'     => $summaryResponse,
            'feature_type' => 'Summarizer'
        ]);

        return redirect()->route('summarizer')->with('generatedSummary', $summaryResponse);
    }

    public function destroy(Note $note)
    {
        if ($note->user_id !== Auth::id()) { abort(403); }
        $note->delete();
        return redirect()->route('summarizer');
    }
}