import React, { useState } from 'react';

// --- MOCK INERTIA / LAYOUT INTEGRATION FOR PREVIEW COMPILATION ---
// This allows the component to preview perfectly in the browser canvas while
// retaining the identical form-state structure of your Laravel backend.

function AuthenticatedLayout({ children }) {
    const navItems = [
        { name: 'Dashboard', icon: '📊', active: false },
        { name: 'AI Chat', icon: '💬', active: false },
        { name: 'Summarizer', icon: '📝', active: false },
        { name: 'Quiz Generator', icon: '🎯', active: false },
        { name: 'Flashcards', icon: '📇', active: false },
        { name: 'Study Planner', icon: '📅', active: true },
        { name: 'Notes', icon: '📓', active: false },
        { name: 'History', icon: '⏳', active: false },
    ];

    return (
        <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans w-full">
            {/* Sidebar */}
            <aside className="w-64 bg-[#0B132B] text-slate-300 flex flex-col justify-between p-4 sticky top-0 h-screen shrink-0 hidden md:flex">
                <div>
                    <div className="flex items-center gap-2 px-3 py-4 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white">C</div>
                        <span className="font-bold text-lg text-white tracking-wide">CampusMind AI</span>
                    </div>
                    <nav className="space-y-1">
                        {navItems.map((item) => (
                            <button
                                key={item.name}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                                    item.active 
                                        ? 'bg-blue-600 text-white shadow-md' 
                                        : 'hover:bg-slate-800 hover:text-white'
                                }`}
                            >
                                <span>{item.icon}</span>
                                {item.name}
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="pt-4 border-t border-slate-800 text-xs text-slate-500">
                    Your Study Companion v1.0
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-8 overflow-y-auto w-full">
                {children}
            </main>
        </div>
    );
}

// Custom simulated Inertia Form helper to satisfy compiler while keeping local previews fully functional
function useSimulatedForm(initialData, onSimulatedSubmit) {
    const [data, setData] = useState(initialData);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    const reset = () => setData(initialData);
    const setSingleData = (key, value) => {
        setData(prev => ({ ...prev, [key]: value }));
    };

    const post = (url, options) => {
        setProcessing(true);
        setTimeout(() => {
            onSimulatedSubmit(data);
            setProcessing(false);
            if (options && options.onSuccess) {
                options.onSuccess();
            }
        }, 600);
    };

    return {
        data,
        setData: setSingleData,
        post,
        processing,
        reset,
        errors,
    };
}

// --- MAIN PREVIEW COMPONENT ---
export default function App() {
    // Initial mock study task blocks to populate the responsive matrix
    const [tasks, setTasks] = useState([
        { id: 1, task_title: 'Data Structures Revision', subject: 'Data Structures', day_of_week: 'Monday', start_time: '09:00', duration_hours: 1.5 },
        { id: 2, task_title: 'Normal Forms Exercises', subject: 'Database Management', day_of_week: 'Wednesday', start_time: '11:00', duration_hours: 1.5 },
        { id: 3, task_title: 'Virtual Memory & Pages', subject: 'Operating Systems', day_of_week: 'Friday', start_time: '09:00', duration_hours: 1.5 },
    ]);

    const [subjects, setSubjects] = useState([
        'Data Structures',
        'Database Management',
        'Operating Systems',
        'Computer Networks',
        'Software Engineering'
    ]);

    const [showModal, setShowModal] = useState(false);

    // Dynamic submission callback to update state locally in visual previewer
    const handleSimulatedSubmit = (formData) => {
        const newBlock = {
            id: Date.now(),
            task_title: formData.task_title,
            subject: formData.subject,
            day_of_week: formData.day_of_week,
            start_time: formData.start_time,
            duration_hours: parseFloat(formData.duration_hours)
        };
        setTasks(prev => [...prev, newBlock]);
    };

    const { data, setData, post, processing, reset, errors } = useSimulatedForm({
        task_title: '',
        subject: '',
        day_of_week: 'Monday',
        start_time: '09:00',
        duration_hours: 1.5,
    }, handleSimulatedSubmit);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00'];

    const handleFormSubmit = (e) => {
        e.preventDefault();
        post('/study-planner/store');
    };

    const handleAddSubjectClick = (subj) => {
        setData('subject', subj);
        setShowModal(true);
    };

    const handleDeleteTask = (id) => {
        if (confirm('Are you sure you want to delete this study block?')) {
            setTasks(prev => prev.filter(task => task.id !== id));
        }
    };

    // Helper: Finds a task block scheduled at a specific day & hour
    const getTaskForSlot = (day, hourString) => {
        return tasks.find(task => {
            return task.day_of_week === day && task.start_time === hourString;
        });
    };

    // Styling generator for colored calendar subject cards matching mockup design
    const getSubjectColorStyles = (subjectName) => {
        const hash = [...subjectName].reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const palette = [
            { bg: 'bg-indigo-50 border-indigo-200 text-indigo-700', textMuted: 'text-indigo-400' },
            { bg: 'bg-emerald-50 border-emerald-200 text-emerald-700', textMuted: 'text-emerald-400' },
            { bg: 'bg-blue-50 border-blue-200 text-blue-700', textMuted: 'text-blue-400' },
            { bg: 'bg-purple-50 border-purple-200 text-purple-700', textMuted: 'text-purple-400' },
            { bg: 'bg-amber-50 border-amber-200 text-amber-700', textMuted: 'text-amber-400' },
        ];
        return palette[hash % palette.length];
    };

    return (
        <AuthenticatedLayout>
            {/* Page Header */}
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Study Planner Workspace</h1>
                    <p className="text-sm text-slate-500">Plan your study schedule, block times, and stay organized.</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold px-3 py-1 bg-blue-50 text-blue-600 rounded-full border border-blue-100">
                        {tasks.length} Blocks Booked
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[500px]">
                {/* Left Side: Subject Drawers */}
                <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 h-fit flex flex-col gap-4">
                    <div>
                        <h2 className="text-base font-bold text-slate-900">Subjects Panel</h2>
                        <p className="text-xs text-slate-400">Click any subject below to auto-fill and schedule a study block.</p>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Active Subjects</h3>
                        <div className="space-y-1.5 max-h-[40vh] overflow-y-auto pr-1">
                            {subjects.map((sub, i) => (
                                <div 
                                    key={i} 
                                    onClick={() => handleAddSubjectClick(sub)}
                                    className="px-3.5 py-2 bg-slate-50 border border-slate-100 hover:border-slate-300 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer hover:bg-blue-50 hover:text-blue-700 transition-all flex justify-between items-center group"
                                >
                                    <span>{sub}</span>
                                    <span className="opacity-0 group-hover:opacity-100 text-[10px] font-bold text-blue-600 transition-opacity">📅 Book Slot</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button 
                        onClick={() => { reset(); setShowModal(true); }}
                        className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-xl text-xs hover:bg-blue-700 transition-all shadow-md shadow-blue-100"
                    >
                        + Create Custom Block
                    </button>
                </div>

                {/* Right Side: Responsive Calendar Grid */}
                <div className="lg:col-span-3 bg-white border border-slate-100 rounded-2xl shadow-sm p-6 flex flex-col overflow-hidden">
                    <div className="flex justify-between items-center mb-6 pb-2 border-b border-slate-100">
                        <h2 className="text-sm font-bold text-slate-800">Weekly Schedule Grid</h2>
                        <span className="text-xs text-slate-400 font-medium bg-slate-50 px-3 py-1 rounded-full">Current Week Outline</span>
                    </div>

                    <div className="flex-1 overflow-x-auto pb-2">
                        <div className="min-w-[650px]">
                            {/* Days Headers */}
                            <div className="grid grid-cols-6 gap-3 text-center border-b border-slate-100 pb-3 mb-3 font-semibold text-slate-400">
                                <span className="text-xxs uppercase tracking-wider">Time</span>
                                {days.map((day) => (
                                    <span key={day} className="text-xxs uppercase tracking-wider text-slate-600">{day}</span>
                                ))}
                            </div>

                            {/* Schedule Grid Rows */}
                            <div className="space-y-3.5">
                                {timeSlots.map((time) => (
                                    <div key={time} className="grid grid-cols-6 gap-3 items-center min-h-[5.5rem]">
                                        <span className="text-xxs font-bold text-slate-400 text-center block">{time}</span>
                                        
                                        {days.map((day) => {
                                            const task = getTaskForSlot(day, time);
                                            if (task) {
                                                const styles = getSubjectColorStyles(task.subject);
                                                return (
                                                    <div 
                                                        key={day} 
                                                        className={`border p-3.5 rounded-2xl text-left h-full flex flex-col justify-between relative group shadow-sm hover:shadow-md transition-all ${styles.bg}`}
                                                    >
                                                        <div>
                                                            <span className="font-extrabold text-xs block leading-tight">{task.subject}</span>
                                                            <span className="text-[11px] font-medium block mt-1 opacity-95">{task.task_title}</span>
                                                        </div>
                                                        <span className={`text-[10px] font-bold mt-2 ${styles.textMuted}`}>
                                                            {time} - {parseInt(time) + Math.floor(task.duration_hours)}:{task.duration_hours % 1 !== 0 ? '30' : '00'}
                                                        </span>

                                                        {/* Actions hover button to trigger live state delete */}
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); handleDeleteTask(task.id); }}
                                                            className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 text-rose-500 hover:bg-rose-50 p-1 rounded-md text-xs transition-all border border-transparent hover:border-rose-100"
                                                            title="Delete Block"
                                                        >
                                                            🗑️
                                                        </button>
                                                    </div>
                                                );
                                            }

                                            return (
                                                <div 
                                                    key={day}
                                                    onClick={() => {
                                                        setData('day_of_week', day);
                                                        setData('start_time', time);
                                                        setShowModal(true);
                                                    }}
                                                    className="bg-slate-50/40 hover:bg-slate-50 border border-dashed border-slate-200 rounded-2xl h-full flex flex-col items-center justify-center cursor-pointer transition-all min-h-[5.5rem] group"
                                                >
                                                    <span className="text-xxs font-bold text-slate-300 group-hover:text-blue-500 transition-colors">+ Book Slot</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Interactive Addition Modal Wrapper */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-150">
                    <div className="bg-white p-6 rounded-3xl border w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-bold text-slate-900">Book Study Plan Block</h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
                        </div>

                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xxs font-bold text-slate-500 uppercase mb-1">Subject</label>
                                <input 
                                    type="text" 
                                    value={data.subject} 
                                    onChange={e => setData('subject', e.target.value)}
                                    className="w-full text-xs p-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500" 
                                    placeholder="e.g., Data Structures"
                                    required
                                />
                                {errors.subject && <span className="text-xxs text-rose-500">{errors.subject}</span>}
                            </div>

                            <div>
                                <label className="block text-xxs font-bold text-slate-500 uppercase mb-1">Session Objective</label>
                                <input 
                                    type="text" 
                                    value={data.task_title} 
                                    onChange={e => setData('task_title', e.target.value)}
                                    className="w-full text-xs p-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500" 
                                    placeholder="e.g., Stack & Queue Revisions"
                                    required
                                />
                                {errors.task_title && <span className="text-xxs text-rose-500">{errors.task_title}</span>}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xxs font-bold text-slate-500 uppercase mb-1">Day of Week</label>
                                    <select 
                                        value={data.day_of_week} 
                                        onChange={e => setData('day_of_week', e.target.value)}
                                        className="w-full text-xs p-3 border border-slate-200 rounded-xl bg-slate-50"
                                    >
                                        <option value="Monday">Monday</option>
                                        <option value="Tuesday">Tuesday</option>
                                        <option value="Wednesday">Wednesday</option>
                                        <option value="Thursday">Thursday</option>
                                        <option value="Friday">Friday</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xxs font-bold text-slate-500 uppercase mb-1">Start Hour</label>
                                    <select 
                                        value={data.start_time} 
                                        onChange={e => setData('start_time', e.target.value)}
                                        className="w-full text-xs p-3 border border-slate-200 rounded-xl bg-slate-50"
                                    >
                                        <option value="09:00">09:00 AM</option>
                                        <option value="10:00">10:00 AM</option>
                                        <option value="11:00">11:00 AM</option>
                                        <option value="12:00">12:00 PM</option>
                                        <option value="13:00">01:00 PM</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xxs font-bold text-slate-500 uppercase mb-1">Duration (Hours)</label>
                                <select 
                                    value={data.duration_hours} 
                                    onChange={e => setData('duration_hours', parseFloat(e.target.value))}
                                    className="w-full text-xs p-3 border border-slate-200 rounded-xl bg-slate-50"
                                >
                                    <option value={1}>1.0 Hour</option>
                                    <option value={1.5}>1.5 Hours</option>
                                    <option value={2}>2.0 Hours</option>
                                    <option value={3}>3.0 Hours</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button 
                                    type="button" 
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2.5 border rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={processing}
                                    className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 shadow-sm"
                                >
                                    {processing ? 'Scheduling...' : 'Schedule Block'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}