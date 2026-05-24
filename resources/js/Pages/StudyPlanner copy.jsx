import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function StudyPlanner() {
    const subjects = ['Data Structures', 'Database Management', 'Operating Systems', 'Computer Networks', 'Software Engineering'];
    
    return (
        <AuthenticatedLayout>
            <Head title="Study Planner" />
            
            <div className="grid grid-cols-4 gap-6">
                {/* Left Drawer Subjects */}
                <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-4 space-y-4 h-fit">
                    <div>
                        <h2 className="text-sm font-bold text-slate-900">Study Planner</h2>
                        <p className="text-xxs text-slate-400">Plan your study schedule and stay organized.</p>
                    </div>
                    <div>
                        <h3 className="text-xxs font-bold text-slate-400 tracking-wider uppercase mb-2">Subjects</h3>
                        <div className="space-y-1.5">
                            {subjects.map((sub, i) => (
                                <div key={i} className="px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer hover:bg-blue-50 hover:text-blue-700 transition-all">
                                    {sub}
                                </div>
                            ))}
                        </div>
                    </div>
                    <button className="w-full py-2 bg-blue-600 text-white font-bold rounded-xl text-xs hover:bg-blue-700 transition-all shadow-sm">
                        + Add Subject
                    </button>
                </div>

                {/* Calendar Board View */}
                <div className="col-span-3 bg-white border border-slate-100 rounded-2xl shadow-sm p-5">
                    {/* Month Picker Top Bar */}
                    <div className="flex justify-between items-center mb-6">
                        <button className="text-slate-400 hover:text-slate-700 font-bold">❮</button>
                        <h2 className="text-sm font-bold text-slate-800">May 2024</h2>
                        <button className="text-slate-400 hover:text-slate-700 font-bold">❯</button>
                    </div>

                    {/* Schedule Blocks Calendar Mapping */}
                    <div className="grid grid-cols-6 gap-2 text-center border-b pb-2 mb-2">
                        <span className="text-xxs font-bold text-slate-400">Time</span>
                        {['Mon 13', 'Tue 14', 'Wed 15', 'Thu 16', 'Fri 17'].map((d, i) => (
                            <span key={i} className="text-xxs font-bold text-slate-700">{d}</span>
                        ))}
                    </div>

                    <div className="space-y-3">
                        {/* Time Row 1 */}
                        <div className="grid grid-cols-6 gap-2 items-center min-h-12">
                            <span className="text-xxs font-bold text-slate-400">09:00 AM</span>
                            <div className="bg-indigo-50 border border-indigo-100 p-2 rounded-xl text-left">
                                <span className="font-bold text-indigo-700 text-xxs block">Data Structures</span>
                                <span className="text-xxs text-indigo-400">9:00 - 10:30</span>
                            </div>
                            <div className="bg-slate-50 rounded-xl h-full border border-dashed border-slate-200"></div>
                            <div className="bg-blue-50 border border-blue-100 p-2 rounded-xl text-left">
                                <span className="font-bold text-blue-700 text-xxs block">DBMS</span>
                                <span className="text-xxs text-blue-400">9:00 - 10:30</span>
                            </div>
                            <div className="bg-slate-50 rounded-xl h-full border border-dashed border-slate-200"></div>
                            <div className="bg-emerald-50 border border-emerald-100 p-2 rounded-xl text-left">
                                <span className="font-bold text-emerald-700 text-xxs block">OS</span>
                                <span className="text-xxs text-emerald-400">9:00 - 10:30</span>
                            </div>
                        </div>

                        {/* Time Row 2 */}
                        <div className="grid grid-cols-6 gap-2 items-center min-h-12">
                            <span className="text-xxs font-bold text-slate-400">11:00 AM</span>
                            <div className="bg-slate-50 rounded-xl h-full border border-dashed border-slate-200"></div>
                            <div className="bg-emerald-50 border border-emerald-100 p-2 rounded-xl text-left">
                                <span className="font-bold text-emerald-700 text-xxs block">CN</span>
                                <span className="text-xxs text-emerald-400">10:45 - 12:15</span>
                            </div>
                            <div className="bg-slate-50 rounded-xl h-full border border-dashed border-slate-200"></div>
                            <div className="bg-amber-50 border border-amber-100 p-2 rounded-xl text-left">
                                <span className="font-bold text-amber-700 text-xxs block">SE</span>
                                <span className="text-xxs text-amber-400">10:45 - 12:15</span>
                            </div>
                            <div className="bg-slate-50 rounded-xl h-full border border-dashed border-slate-200"></div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}