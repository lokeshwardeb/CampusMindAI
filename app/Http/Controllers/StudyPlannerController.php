<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class StudyPlannerController extends Controller
{
    /**
     * Display the weekly schedule block planner.
     */
    public function index()
    {
        // Fetch all task blocks mapped for the current user
        $tasks = Task::where('user_id', Auth::id())
            ->orderBy('deadline', 'asc')
            ->get()
            ->map(function ($task) {
                return [
                    'id' => $task->id,
                    'task_title' => $task->task_title,
                    'subject' => $task->subject ?? 'General',
                    'deadline' => $task->deadline->toIso8601String(),
                    'duration_hours' => $task->duration_hours ?? 1,
                    'status' => $task->status,
                ];
            });

        // Pull distinct subject names from the student's task database to populate the sidebar list
        $subjects = Task::where('user_id', Auth::id())
            ->whereNotNull('subject')
            ->distinct()
            ->pluck('subject')
            ->toArray();

        // Fallback default list matching mockup design if database is empty
        if (empty($subjects)) {
            $subjects = ['Data Structures', 'Database Management', 'Operating Systems', 'Computer Networks', 'Software Engineering'];
        }

        return Inertia::render('StudyPlanner', [
            'scheduleTasks' => $tasks,
            'subjects' => $subjects
        ]);
    }

    /**
     * Store a newly scheduled study task block.
     */
    public function store(Request $request)
    {
        $request->validate([
            'task_title' => 'required|string|max:255',
            'subject' => 'required|string|max:100',
            'day_of_week' => 'required|string|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
            'start_time' => 'required|string|regex:/^[0-9]{2}:[0-9]{2}$/', // Format: HH:MM (e.g. 09:00)
            'duration_hours' => 'required|numeric|min:0.5|max:6',
        ]);

        // Calculate target deadline timestamp using the current week day mapping
        $timeParts = explode(':', $request->start_time);
        $deadline = Carbon::now()
            ->startOfWeek()
            ->modify($request->day_of_week)
            ->setTime($timeParts[0], $timeParts[1], 0);

        // Access custom field support via a simple dynamic column additions pattern
        $task = new Task();
        $task->user_id = Auth::id();
        $task->task_title = $request->task_title;
        $task->subject = $request->subject;
        $task->deadline = $deadline;
        $task->duration_hours = $request->duration_hours;
        $task->status = 'Pending';
        $task->save();

        return redirect()->route('study-planner')->with('message', 'Study block successfully scheduled!');
    }

    /**
     * Remove a scheduled block from the planner.
     */
    public function destroy(Task $task)
    {
        if ($task->user_id !== Auth::id()) {
            abort(403);
        }

        $task->delete();

        return redirect()->route('study-planner')->with('message', 'Study block deleted.');
    }
}