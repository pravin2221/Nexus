import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { TiLocationArrow } from 'react-icons/ti';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import Button from './Button';
import { useWindowScroll } from 'react-use';
import gsap from 'gsap';
import { useAuth } from '../context/AuthContext';

const allNavItems = [
  { label: 'Home', to: '/' },
  { label: 'Challenges', to: '/challenges', authOnly: true },
  { label: 'Leaderboard', to: '/leaderboard', authOnly: true },
  { label: 'About us', to: '/#about' },
  { label: 'Contact', to: '/#contact' },
  { label: 'Login', to: '/login', guestOnly: true },
];

const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isIndicatorActive, setIsIndicatorActive] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navcontainerref = useRef(null);
  const audioelementref = useRef(null);
  const mobileMenuref = useRef(null);
  const { pathname, hash } = useLocation();
  const { y: currentScrollY } = useWindowScroll();
  const isInnerPage = pathname !== '/' && pathname !== '/login';

  const navitems = allNavItems.filter((item) => {
    if (item.authOnly && !isLoggedIn) return false;
    if (item.guestOnly && isLoggedIn) return false;
    return true;
  });

  const isActive = (item) => {
    if (item.to === '/') return pathname === '/';
    if (item.to.startsWith('/#')) return pathname === '/' && (hash || '').replace('#', '') === item.to.slice(2);
    return pathname === item.to;
  };

  useEffect(() => {
    if (isInnerPage) {
      setIsNavVisible(true);
      navcontainerref.current?.classList.add('floating-nav');
      return;
    }
    if (currentScrollY === 0) {
      setIsNavVisible(true);
      navcontainerref.current?.classList.remove('floating-nav');
    } else if (currentScrollY > lastScrollY) {
      setIsNavVisible(false);
      navcontainerref.current?.classList.add('floating-nav');
    } else if (currentScrollY < lastScrollY) {
      setIsNavVisible(true);
      navcontainerref.current?.classList.add('floating-nav');
    }
    setLastScrollY(currentScrollY);
  }, [currentScrollY, lastScrollY, isInnerPage]);

  useEffect(() => {
    if (!navcontainerref.current) return;
    gsap.to(navcontainerref.current, {
      y: isNavVisible ? 0 : -100,
      opacity: isNavVisible ? 1 : 0,
      duration: 0.25,
      ease: 'power2.out',
    });
  }, [isNavVisible]);

  useEffect(() => {
    if (isInnerPage && navcontainerref.current) {
      navcontainerref.current.classList.add('floating-nav');
    }
  }, [pathname, isInnerPage]);

  const toggleAudio = () => {
    setIsAudioPlaying((prev) => !prev);
    setIsIndicatorActive((prev) => !prev);
  };

  useEffect(() => {
    if (!audioelementref.current) return;
    if (isAudioPlaying) {
      audioelementref.current.play().catch(() => { });
    } else {
      audioelementref.current.pause();
    }
  }, [isAudioPlaying]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const handleEscape = (e) => e.key === 'Escape' && closeMobileMenu();
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const navContent = (
    <>
      <div className="flex items-center gap-7">
        <Link to="/" className="flex items-center gap-2.5" onClick={closeMobileMenu}>
          <img
            src="https://res.cloudinary.com/dqbhvzioe/image/upload/v1744102878/logo_acef5r.png"
            alt="Nexus CTF"
            className="h-9 w-9 sm:h-10 sm:w-10 object-contain hover:scale-110 transition-transform duration-300"
          />
          <span className="font-zentry font-bold text-lg uppercase tracking-tight text-white hidden sm:inline">
            Nexus
          </span>
        </Link>

      </div>

      <div className="flex h-full items-center gap-6">
        <div className="hidden md:flex md:items-center md:gap-8">
          {navitems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              onClick={closeMobileMenu}
              className={`nav-hover-btn ${isActive(item) ? 'nav-active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {isLoggedIn && (
          <button
            type="button"
            onClick={() => { closeMobileMenu(); logout(); navigate('/'); }}
            className="nav-hover-btn hidden md:block"
          >
            Logout
          </button>
        )}
        <button
          type="button"
          onClick={toggleAudio}
          className="flex items-center gap-1 p-1.5 rounded-full text-white hover:bg-white/10 transition-all border border-white/20"
          aria-label={isAudioPlaying ? 'Mute' : 'Play music'}
        >
          <audio
            ref={audioelementref}
            className="hidden"
            src="https://res.cloudinary.com/dqbhvzioe/video/upload/v1744122520/loop_vmragj.mp3"
            loop
          />
          {[1, 2, 3, 4].map((bar) => (
            <div
              key={bar}
              className={`indicator-line ${isIndicatorActive ? 'active' : ''}`}
              style={{ animationDelay: `${bar * 0.1}s` }}
            />
          ))}
        </button>

        <button
          type="button"
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-white hover:bg-marvel-red/20 transition-colors"
          onClick={() => setIsMobileMenuOpen((o) => !o)}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <HiX className="w-6 h-6" /> : <HiMenuAlt3 className="w-6 h-6" />}
        </button>
      </div>
    </>
  );

  return (
    <>
      <div
        ref={navcontainerref}
        className={`fixed inset-x-0 top-4 z-50 h-14 sm:h-16 border-none transition-[box-shadow,background-color] duration-300 sm:inset-x-6 ${isInnerPage ? 'floating-nav' : ''
          }`}
      >
        <header className="absolute top-1/2 w-full -translate-y-1/2">
          <nav className="flex size-full items-center justify-between px-4 sm:px-5">
            {navContent}
          </nav>
        </header>
      </div>

      {/* Mobile menu overlay */}
      <div
        ref={mobileMenuref}
        className={`fixed inset-0 z-40 bg-black/80 backdrop-blur-md md:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        onClick={closeMobileMenu}
        aria-hidden="true"
      />

      {/* Mobile menu panel */}
      <div
        className={`fixed top-0 right-0 z-40 h-full w-[min(100vw,320px)] bg-marvel-black backdrop-blur-xl border-l border-white/10 shadow-2xl md:hidden transition-transform duration-300 ease-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        role="dialog"
        aria-label="Navigation menu"
      >
        <div className="flex flex-col pt-24 px-6 gap-1">
          {navitems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              onClick={closeMobileMenu}
              className={`py-3 px-2 font-general text-sm uppercase tracking-wider rounded-lg transition-colors ${isActive(item)
                  ? 'text-marvel-red bg-white/10'
                  : 'text-white hover:bg-white/5'
                }`}
            >
              {item.label}
            </Link>
          ))}
          {isLoggedIn && (
            <Link to="/challenges" onClick={closeMobileMenu} className="mt-4">
              <Button
                title="Challenges"
                rightIcon={<TiLocationArrow />}
                containerClass="w-full justify-center !bg-marvel-red text-white"
              />
            </Link>
          )}
          {isLoggedIn && (
            <button
              type="button"
              onClick={() => { closeMobileMenu(); logout(); navigate('/'); }}
              className="mt-3 py-3 px-2 font-general text-sm uppercase text-marvel-red hover:bg-white/5 rounded-lg text-left w-full"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
