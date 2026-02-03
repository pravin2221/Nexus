import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import FlagSubmission from '../components/FlagSubmission';
import Leaderboard from '../components/Leaderboard';
import SubmissionHistory from '../components/SubmissionHistory';
import { LogOut, Terminal, Target, Trophy, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('submission'); // 'submission', 'leaderboard', 'history'
    const [refreshKey, setRefreshKey] = useState(0);

    const handleSuccess = () => {
        setRefreshKey(prev => prev + 1);
    };

    const tabs = [
        { id: 'submission', label: 'TARGET UPLINK', icon: Target },
        { id: 'leaderboard', label: 'ELITE RANKINGS', icon: Trophy },
        { id: 'history', label: 'EVENT LOG', icon: History },
    ];

    return (
        <div className="min-h-screen bg-cyber-black text-gray-100 p-4 md:p-8 relative overflow-hidden flex flex-col">
            <div className="scanline" />

            {/* Background Grid is handled by body CSS */}

            {/* Decorative Top Bar */}
            <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-green to-transparent opacity-50 z-50"></div>

            {/* Header */}
            <header className="flex justify-between items-center mb-8 border-b-2 border-neon-green/20 pb-4 relative z-10 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <Terminal className="text-neon-green ml-2 animate-pulse" size={32} />
                    <div>
                        <h1 className="text-3xl font-cyber font-bold text-white tracking-widest glitches drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                            neXus_CORE
                        </h1>
                        <p className="text-xs text-neon-green font-mono tracking-widest flex items-center gap-2">
                            <span className="w-2 h-2 bg-neon-green rounded-full animate-ping"></span>
                            OPERATOR: {user?.email} [ONLINE]
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex flex-col items-end text-[10px] text-gray-500 font-mono">
                        <span>NET_SPEED: 450 TB/s</span>
                        <span>ENCRYPTION: QUANTUM-256</span>
                    </div>
                    <button
                        onClick={logout}
                        className="cyber-button flex items-center gap-2 text-xs text-neon-red border-neon-red hover:bg-neon-red hover:text-white"
                    >
                        <LogOut size={14} /> Terminate
                    </button>
                </div>
            </header>

            {/* Tab Navigation */}
            <div className="max-w-4xl mx-auto mb-10 relative z-10 w-full">
                <div className="flex justify-center items-center gap-4">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    flex-1 py-4 px-2 flex items-center justify-center gap-2 font-mono font-bold tracking-wider transition-all duration-300 relative clip-path-slant
                                    ${isActive ? 'text-neon-green scale-105' : 'text-gray-600 hover:text-gray-400'}
                                `}
                            >
                                <Icon size={18} className={isActive ? 'animate-spin-slow' : ''} />
                                <span className="hidden md:inline">{tab.label}</span>
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTabIndicator"
                                        className="absolute bottom-0 left-0 w-full h-1 bg-neon-green shadow-[0_0_15px_#00ff41]"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-5xl mx-auto relative z-10 w-full flex-1 flex items-start justify-center">
                {/* Decorative Side Lines */}
                <div className="hidden lg:block absolute left-[-40px] top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-neon-green/30 to-transparent"></div>
                <div className="hidden lg:block absolute right-[-40px] top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-neon-green/30 to-transparent"></div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
                        transition={{ duration: 0.4, ease: "circOut" }}
                        className="w-full relative"
                    >
                        {/* Corner HUD Markers for Content Area */}
                        <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-neon-green opacity-50"></div>
                        <div className="absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 border-neon-green opacity-50"></div>
                        <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-2 border-l-2 border-neon-green opacity-50"></div>
                        <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-neon-green opacity-50"></div>

                        {activeTab === 'submission' && (
                            <div className="cyber-box p-12 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-2 opacity-20 font-mono text-[10px] text-neon-green">
                                    SECURE_CHANNEL_ESTABLISHED
                                </div>
                                <FlagSubmission onSubmitSuccess={handleSuccess} />
                            </div>
                        )}

                        {activeTab === 'leaderboard' && (
                            <div className="w-full cyber-box p-6">
                                <Leaderboard refreshTrigger={refreshKey} />
                            </div>
                        )}

                        {activeTab === 'history' && (
                            <div className="w-full cyber-box p-6">
                                <SubmissionHistory refreshTrigger={refreshKey} />
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Footer Info */}
            <div className="fixed bottom-4 right-4 text-[10px] font-mono text-gray-600 z-0 flex flex-col items-end opacity-70 hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-neon-green animate-pulse"></span>
                    SYSTEM STATUS: STABLE
                </div>
                <div>ENCRYPTION: 256-BIT AES-GCM</div>
                <div>SERVER: NEXUS_NODE_01</div>
            </div>
        </div>
    );
};

export default Dashboard;
