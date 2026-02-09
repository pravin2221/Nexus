import React from 'react';
import { Link } from 'react-router-dom';
import { TiLocationArrow } from 'react-icons/ti';
import Button from '../components/Button';
import Footer from '../components/Footer';

const Leaderboard = () => {
  const placeholderRows = [
    { rank: 1, name: '—', points: '—' },
    { rank: 2, name: '—', points: '—' },
    { rank: 3, name: '—', points: '—' },
    { rank: 4, name: '—', points: '—' },
    { rank: 5, name: '—', points: '—' },
  ];

  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden bg-marvel-black text-white selection:bg-marvel-red selection:text-white">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-marvel-red/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-blue-500/5 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 min-h-dvh pt-24 pb-20">
        <div className="container mx-auto px-5 md:px-10">
          <div className="text-center mb-12">
            <p className="font-general text-xs uppercase tracking-[0.2em] text-marvel-red mb-2">
              LIVE RANKINGS
            </p>
            <h1 className="special-font font-zentry text-5xl md:text-7xl lg:text-8xl font-black uppercase text-white text-glow">
              Leaderboard
            </h1>
            <p className="mt-4 max-w-xl mx-auto font-circular-web text-white/50 text-sm md:text-base">
              Elite agents competing for top clearance. Solve challenges to climb the ranks.
            </p>
          </div>


          <div className="mt-8 glass-panel rounded-xl overflow-hidden border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            {/* Table Header Decoration */}
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-marvel-red to-transparent opacity-50" />

            <div className="overflow-x-auto">
              <table className="w-full text-left font-general text-white">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-white/60">Rank</th>
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-white/60">Agent</th>
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-white/60 text-right">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {placeholderRows.map((row) => (
                    <tr
                      key={row.rank}
                      className="hover:bg-white/5 transition-colors group"
                    >
                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-black font-zentry text-sm ${row.rank === 1 ? 'bg-yellow-500/20 text-yellow-500 ring-1 ring-yellow-500/50' :
                            row.rank === 2 ? 'bg-zinc-400/20 text-zinc-400 ring-1 ring-zinc-400/50' :
                              row.rank === 3 ? 'bg-amber-700/20 text-amber-700 ring-1 ring-amber-700/50' :
                                'text-white/40'
                          }`}>
                          {row.rank}
                        </span>
                      </td>
                      <td className="px-6 py-5 font-medium tracking-wide group-hover:text-white transition-colors text-white/80">{row.name}</td>
                      <td className="px-6 py-5 text-right font-zentry font-black text-xl text-marvel-red group-hover:text-glow transition-all">{row.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-white/5 border-t border-white/10 flex items-center justify-center gap-2 text-white/40">
              <div className="w-2 h-2 rounded-full bg-marvel-red animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-widest">System Status: Awaiting Data Feed</span>
            </div>
          </div>

          <div className="mt-16 flex justify-center">
            <Link to="/">
              <Button
                title="Return to Base"
                leftIcon={<TiLocationArrow className="rotate-[-135deg]" />}
                containerClass="glass-panel !bg-transparent text-white hover:!bg-white/10"
              />
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default Leaderboard;
