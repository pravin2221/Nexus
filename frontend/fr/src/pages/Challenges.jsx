import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TiLocationArrow } from 'react-icons/ti';
import { HiChevronLeft, HiChevronRight, HiX, HiLockClosed } from 'react-icons/hi';
import Button from '../components/Button';
import Footer from '../components/Footer';

// Import images from src/assets so Vite resolves URLs (works in dev and production)
import imgCa from '../assets/img/ca.webp';
import imgThor from '../assets/img/thor2.png';
import imgIronman from '../assets/img/ironman2.png';
import imgHulk from '../assets/img/hulk.png';
import imgDeadpool from '../assets/img/deadpool.png';
import imgBw from '../assets/img/bw.png';

const HERO_CHALLENGES = [
  { id: 'cap', hero: 'Captain America', image: imgCa, title: 'Shield Decode', description: 'Crack the cipher hidden in the shield.', points: 100, difficulty: "Easy" },
  { id: 'thor', hero: 'Thor', image: imgThor, title: 'Stormbreaker Logic', description: 'Find the flag in the storm.', points: 150, difficulty: "Medium" },
  { id: 'ironman', hero: 'Iron Man', image: imgIronman, title: 'Arc Reactor', description: 'Reverse the reactor output.', points: 125, difficulty: "Medium" },
  { id: 'hulk', hero: 'Hulk', image: imgHulk, title: 'Gamma Decode', description: 'Decode the gamma message.', points: 100, difficulty: "Easy" },
  { id: 'deadpool', hero: 'Deadpool', image: imgDeadpool, title: 'Fourth Wall', description: 'Break the fourth wall to find the flag.', points: 175, difficulty: "Hard" },
  { id: 'bw', hero: 'Black Widow', image: imgBw, title: 'Steganography', description: 'Something is hidden in the image.', points: 125, difficulty: "Medium" },
];

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.5,
    rotateY: direction > 0 ? 45 : -45,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
    rotateY: 0,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
      scale: { duration: 0.2 },
      rotateY: { duration: 0.4 }
    },
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.5,
    rotateY: direction < 0 ? 45 : -45,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
      scale: { duration: 0.2 },
      rotateY: { duration: 0.4 }
    },
  }),
};

const Challenges = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [flagInput, setFlagInput] = useState('');

  const goPrev = () => {
    setDirection(-1);
    setCurrentIndex((i) => (i === 0 ? HERO_CHALLENGES.length - 1 : i - 1));
  };
  const goNext = () => {
    setDirection(1);
    setCurrentIndex((i) => (i === HERO_CHALLENGES.length - 1 ? 0 : i + 1));
  };
  const goTo = (i) => {
    setDirection(i > currentIndex ? 1 : -1);
    setCurrentIndex(i);
  };

  const current = HERO_CHALLENGES[currentIndex];

  const openChallenge = () => setSelectedChallenge(current);
  const closeChallenge = () => {
    setSelectedChallenge(null);
    setFlagInput('');
  };

  const handleSubmitFlag = (e) => {
    e.preventDefault();
    alert('Flag submission will be wired to your backend. You entered: ' + flagInput);
  };

  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden bg-marvel-black text-white selection:bg-marvel-red selection:text-white">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-marvel-red/20 via-marvel-black to-marvel-black opacity-40 animate-pulse" />
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-marvel-black to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-marvel-black to-transparent" />
      </div>

      <div className="relative z-10 min-h-dvh pt-24 pb-20 flex flex-col justify-center">
        <div className="container mx-auto px-5 md:px-10">
          <div className="text-center mb-10">
            <p className="font-general text-xs md:text-sm uppercase tracking-[0.2em] text-marvel-red mb-2">
              S.H.I.E.L.D. DATABASE // ACCESS GRANTED
            </p>
            <h1 className="special-font font-zentry text-6xl md:text-8xl lg:text-9xl font-black uppercase text-white leading-[0.8] text-glow mix-blend-screen">
              Challenges
            </h1>
            <p className="mt-6 max-w-lg mx-auto font-circular-web text-white/50 text-sm md:text-base leading-relaxed">
              Select a classified file to begin your mission. Analyze the intel, solve the cipher, and submit the flag to secure the objective.
            </p>
          </div>

          {/* Hero slider */}
          <div className="relative w-full flex flex-col items-center justify-center">
            <div className="relative w-full max-w-6xl mx-auto flex items-center justify-between h-[50vh] md:h-[60vh] perspective-1000">

              {/* Previous Button */}
              <button
                type="button"
                onClick={goPrev}
                className="hidden md:flex z-20 w-16 h-16 rounded-full glass-panel items-center justify-center text-white hover:text-marvel-red hover:bg-white/20 transition-all duration-300 group"
                aria-label="Previous hero"
              >
                <HiChevronLeft className="w-8 h-8 group-hover:-translate-x-1 transition-transform" />
              </button>

              {/* Main Content Area */}
              <div className="flex-1 flex items-center justify-center relative w-full h-full">
                {/* Background Text */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none">
                  <span className="text-[12rem] md:text-[20rem] font-black font-zentry text-white/5 uppercase whitespace-nowrap">
                    {current.hero.split(' ')[0]}
                  </span>
                </div>

                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                  <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="absolute w-full h-full flex items-center justify-center cursor-pointer"
                    onClick={openChallenge}
                  >
                    <div className="relative group">
                      {/* Glow effect behind image */}
                      <div className="absolute inset-0 bg-marvel-red/20 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      <img
                        src={current.image}
                        alt={current.hero}
                        className="relative z-10 max-h-[50vh] md:max-h-[65vh] w-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Interactive hint */}
                      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                        <span className="glass-panel px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-white">
                          Declassify Intel
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Next Button */}
              <button
                type="button"
                onClick={goNext}
                className="hidden md:flex z-20 w-16 h-16 rounded-full glass-panel items-center justify-center text-white hover:text-marvel-red hover:bg-white/20 transition-all duration-300 group"
                aria-label="Next hero"
              >
                <HiChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Mobile Navigation Controls */}
            <div className="flex md:hidden justify-between w-full max-w-xs mt-8 px-4">
              <button onClick={goPrev} className="p-4 glass-panel rounded-full text-white"><HiChevronLeft size={24} /></button>
              <button onClick={openChallenge} className="px-8 py-4 bg-marvel-red text-white font-bold uppercase tracking-wider rounded-lg text-sm">Enter</button>
              <button onClick={goNext} className="p-4 glass-panel rounded-full text-white"><HiChevronRight size={24} /></button>
            </div>

            {/* Info and Indicators */}
            <div className="mt-12 flex flex-col items-center z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`info-${currentIndex}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  <h2 className="text-2xl md:text-4xl font-zentry font-black text-white uppercase tracking-wide">
                    {current.hero}
                  </h2>
                  <div className="flex items-center justify-center gap-4 mt-2">
                    <span className="px-3 py-1 rounded border border-white/20 bg-white/5 text-[10px] font-bold uppercase tracking-widest text-marvel-red">
                      {current.points} PTS
                    </span>
                    <span className="items-center px-3 py-1 rounded border border-white/20 bg-white/5 text-[10px] font-bold uppercase tracking-widest text-white/60">
                      Level: {current.difficulty}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Pagination Dots */}
              <div className="flex gap-3 mt-8">
                {HERO_CHALLENGES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`h-1 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-8 bg-marvel-red' : 'w-2 bg-white/20 hover:bg-white/40'
                      }`}
                    aria-label={`Go to ${HERO_CHALLENGES[i].hero}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-20 flex justify-center">
            <Link to="/">
              <Button
                title="Abort Mission"
                leftIcon={<TiLocationArrow className="rotate-[-135deg]" />}
                containerClass="glass-panel !bg-transparent text-white hover:!bg-white/10"
              />
            </Link>
          </div>
        </div>
      </div>

      <Footer />

      {/* Challenge Modal */}
      <AnimatePresence>
        {selectedChallenge && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md"
              onClick={closeChallenge}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="pointer-events-auto w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[85vh]"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Left Side - Image */}
                <div className="relative w-full md:w-2/5 h-48 md:h-auto overflow-hidden bg-gradient-to-br from-marvel-red/20 to-marvel-black">
                  <img
                    src={selectedChallenge.image}
                    alt={selectedChallenge.hero}
                    className="absolute inset-0 w-full h-full object-cover object-top opacity-60 mix-blend-overlay"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent md:bg-gradient-to-r" />

                  <div className="absolute bottom-4 left-4 z-10">
                    <h3 className="font-zentry text-3xl text-white uppercase leading-none">{selectedChallenge.hero}</h3>
                    <p className="font-general text-xs text-marvel-red mt-1 uppercase tracking-widest">Target Acquired</p>
                  </div>
                </div>

                {/* Right Side - Content */}
                <div className="flex-1 p-6 md:p-8 flex flex-col relative">
                  <button
                    onClick={closeChallenge}
                    className="absolute top-4 right-4 p-2 text-white/40 hover:text-white transition-colors"
                  >
                    <HiX size={24} />
                  </button>

                  <div className="mb-6">
                    <h4 className="font-zentry text-xl text-white uppercase mb-2">Mission Briefing</h4>
                    <div className="h-px w-10 bg-marvel-red mb-4" />
                    <p className="font-circular-web text-white/70 leading-relaxed text-sm md:text-base">
                      {selectedChallenge.description}
                    </p>
                  </div>

                  <div className="mt-auto bg-white/5 rounded-xl p-5 border border-white/10">
                    <div className="flex items-center gap-2 mb-3 text-marvel-red">
                      <HiLockClosed />
                      <span className="text-xs font-bold uppercase tracking-widest">Security Protocol</span>
                    </div>

                    <form onSubmit={handleSubmitFlag} className="relative">
                      <input
                        type="text"
                        value={flagInput}
                        onChange={(e) => setFlagInput(e.target.value)}
                        placeholder="ENTER_PASSKEY..."
                        className="w-full bg-[#050505] border border-white/20 rounded-lg py-3 px-4 text-white font-mono text-sm focus:outline-none focus:border-marvel-red focus:ring-1 focus:ring-marvel-red transition-all placeholder:text-white/20"
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-marvel-red hover:bg-marvel-red-dark text-white text-xs font-bold uppercase rounded-md transition-colors"
                      >
                        Decrypt
                      </button>
                    </form>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
};

export default Challenges;

