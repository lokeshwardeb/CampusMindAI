import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth, stats, recentActivities }) {
    // Fallback static data mapping directly to the mockup values if props aren't passed yet
    const currentStats = stats || [
        { label: 'Chats Today', count: 12, icon: '💬', color: 'bg-indigo-50 text-indigo-600' },
        { label: 'Quizzes Solved', count: 8, icon: '📝', color: 'bg-emerald-50 text-emerald-600' },
        { label: 'Flashcards Created', count: 36, icon: '🗂️', color: 'bg-amber-50 text-amber-600' },
        { label: 'Study Plans', count: 5, icon: '📅', color: 'bg-blue-50 text-blue-600' },
    ];

    const quickAccess = [
        { name: 'AI Chat', desc: 'Get instant answers', icon: '💬', route: 'ai-chat' },
        { name: 'Summarize Text', desc: 'Summarize any content', icon: '📝', route: 'summarizer' },
        { name: 'Generate Quiz', desc: 'Create MCQs instantly', icon: '🎯', route: 'quiz-generator' },
        { name: 'Study Planner', desc: 'Plan your study schedule', icon: '📅', route: 'study-planner' },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />
            
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Welcome back, Arjun! 👋</h1>
                    <p className="text-sm text-slate-500">Your AI Study Companion</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <input type="text" placeholder="Search anything..." className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 w-64" />
                        <span className="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
                    </div>
                    <button className="p-2 bg-white border border-slate-200 rounded-xl relative">🔔</button>
                    <img src="https://ui-avatars.com/api/?name=Arjun&background=3b82f6&color=fff" className="w-9 h-9 rounded-full border" alt="Profile" />
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-5 mb-8">
                {currentStats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                        <div>
                            <span className="block text-3xl font-bold text-slate-900 mb-1">{stat.count}</span>
                            <span className="text-xs font-medium text-slate-500">{stat.label}</span>
                        </div>
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg ${stat.color}`}>
                            {stat.icon}
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Access & Main Layout Split */}
            <div className="grid grid-cols-3 gap-8">
                <div className="col-span-2 space-y-8">
                    {/* Quick Access */}
                    <div>
                        <h2 className="text-sm font-semibold text-slate-900 mb-3">Quick Access</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {quickAccess.map((item, idx) => (
                                <Link key={idx} href={`/${item.route}`} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:border-blue-200 hover:shadow-md transition-all flex gap-4 items-center group">
                                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-base font-semibold group-hover:bg-blue-600 group-hover:text-white transition-all">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-800">{item.name}</h3>
                                        <p className="text-xs text-slate-400">{item.desc}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-sm font-semibold text-slate-900">Recent Activity</h2>
                            <button className="text-xs font-bold text-blue-600 hover:underline">View All</button>
                        </div>
                        <div className="space-y-3">
                            {[
                                { title: 'Photosynthesis – Summary', time: '2 mins ago', type: '📄', bg: 'bg-blue-50 text-blue-600' },
                                { title: 'Data Structures – Quiz', time: '1 hour ago', type: '📝', bg: 'bg-emerald-50 text-emerald-600' },
                                { title: 'Biology – Flashcards', time: '3 hours ago', type: '🗂️', bg: 'bg-amber-50 text-amber-600' },
                                { title: 'Study Plan – Mid Sem', time: '5 hours ago', type: '📅', bg: 'bg-purple-50 text-purple-600' },
                            ].map((act, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs ${act.bg}`}>{act.type}</div>
                                        <span className="text-xs font-semibold text-slate-700">{act.title}</span>
                                    </div>
                                    <span className="text-xxs text-slate-400">{act.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side Column: Study Streak */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                    <div>
                        <h2 className="text-sm font-semibold text-slate-900 mb-4">Study Streak</h2>
                        <div className="text-center py-6">
                            <span className="text-4xl block mb-2">🔥</span>
                            <span className="text-2xl font-black text-slate-900 block">7 Days</span>
                            <p className="text-xs text-slate-500 font-medium mt-1">Keep it up! You are doing great.</p>
                        </div>
                    </div>
                    
                    {/* Week Tracker */}
                    <div className="grid grid-cols-7 gap-1 text-center border-t pt-4">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                            <div key={idx} className="space-y-2">
                                <span className="text-xxs font-bold text-slate-400 block">{day}</span>
                                <div className="w-6 h-6 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center text-xxs font-bold">✓</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}