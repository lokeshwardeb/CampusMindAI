import React from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function AuthenticatedLayout({ children }) {
    const { url } = usePage();

    const navItems = [
        { name: 'Dashboard', icon: '📊', route: 'dashboard' },
        { name: 'AI Chat', icon: '💬', route: 'ai-chat' },
        { name: 'Summarizer', icon: '📝', route: 'summarizer' },
        { name: 'Quiz Generator', icon: '🎯', route: 'quiz-generator' },
        { name: 'Flashcards', icon: '📇', route: 'flashcards' },
        { name: 'Study Planner', icon: '📅', route: 'study-planner' },
        { name: 'Notes', icon: '📓', route: 'notes' },
        { name: 'History', icon: '⏳', route: 'history' },
        { name: 'Bookmarks', icon: '🔖', route: 'bookmarks' },
    ];

    const bottomNavItems = [
        { name: 'Profile', icon: '👤', route: 'profile' },
        { name: 'Settings', icon: '⚙️', route: 'settings' },
    ];

    return (
        <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-[#0B132B] text-slate-300 flex flex-col justify-between p-4 sticky top-0 h-screen">
                <div>
                    {/* Brand */}
                    <div className="flex items-center gap-2 px-3 py-4 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white">C</div>
                        <span className="font-bold text-lg text-white tracking-wide">CampusMind AI</span>
                    </div>

                    {/* Main Nav */}
                    <nav className="space-y-1">
                        {navItems.map((item) => {
                            const isActive = url.startsWith(`/${item.route}`);
                            return (
                                <Link
                                    key={item.name}
                                    href={`/${item.route}`}
                                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                                        isActive 
                                            ? 'bg-blue-600 text-white shadow-md' 
                                            : 'hover:bg-slate-800 hover:text-white'
                                    }`}
                                >
                                    <span>{item.icon}</span>
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Bottom Nav & Logout */}
                <div className="space-y-1 pt-4 border-t border-slate-800">
                    {bottomNavItems.map((item) => (
                        <Link
                            key={item.name}
                            href={`/${item.route}`}
                            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800 hover:text-white transition-all"
                        >
                            <span>{item.icon}</span>
                            {item.name}
                        </Link>
                    ))}
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-950/30 transition-all text-left"
                    >
                        <span>logout_icon</span>
                        Logout
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-8 overflow-y-auto max-w-7xl mx-auto w-full">
                {children}
            </main>
        </div>
    );
}