
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TiLocationArrow } from "react-icons/ti";
import Button from "./Button";
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [loadedVideos, setLoadedVideos] = useState(0);
    const [videoUrls, setVideoUrls] = useState([]);

    useEffect(() => {
        setVideoUrls([
            'https://res.cloudinary.com/dqbhvzioe/video/upload/v1744103187/hero-1_hkywag.mp4',
            'https://res.cloudinary.com/dqbhvzioe/video/upload/v1744102941/hero-2_mdxqmv.mp4',
            'https://res.cloudinary.com/dqbhvzioe/video/upload/v1744103237/hero-3_knxbol.mp4',
            'https://res.cloudinary.com/dqbhvzioe/video/upload/v1744103244/hero-4_vvkdgl.mp4'
        ]);
    }, []);

    const handleVideoLoad = () => {
        setLoadedVideos((prev) => prev + 1);
    };

    const goToNextVideo = () => {
        setCurrentIndex((prev) => (prev + 1) % (videoUrls.length || 4));
    };

    useEffect(() => {
        if (loadedVideos >= 1) {
            setIsLoading(false);
        }
    }, [loadedVideos]);

    useGSAP(() => {
        gsap.set('#video-frame', {
            clipPath: 'polygon(14% 0%, 72% 0%, 90% 90%, 0% 100%)',
            borderRadius: '0 0 40% 10%'
        });

        gsap.from('#video-frame', {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            borderRadius: '0 0 0 0',
            ease: 'power1.inOut',
            scrollTrigger: {
                trigger: '#video-frame',
                start: 'center center',
                end: 'bottom center',
                scrub: true,
            }
        });
    });

    const getVideoSrc = (index) => {
        if (videoUrls.length > 0) {
            return videoUrls[index % videoUrls.length];
        }
        return '';
    };

    return (
        <div className="relative h-dvh w-screen overflow-x-hidden bg-marvel-black">
            {/* Loading Spinner */}
            {isLoading && (
                <div className='flex-center absolute z-[100] h-dvh w-screen overflow-hidden bg-black'>
                    <div className='three-body'>
                        <div className='three-body__dot' />
                        <div className='three-body__dot' />
                        <div className='three-body__dot' />
                    </div>
                </div>
            )}

            {/* Main Video Container – videos play one after the other, no hover */}
            <div id="video-frame" className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-marvel-black">
                <video
                    key={currentIndex}
                    src={getVideoSrc(currentIndex)}
                    autoPlay
                    muted
                    playsInline
                    loop={false}
                    onEnded={goToNextVideo}
                    onLoadedData={handleVideoLoad}
                    className="absolute left-0 top-0 size-full object-cover object-center"
                />

                {/* Gradient at top so navbar stays readable */}
                <div className="absolute left-0 top-0 z-30 h-32 w-full bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />

                {/* Gradient at bottom for seamless transition */}
                <div className="absolute left-0 bottom-0 z-30 h-32 w-full bg-gradient-to-t from-marvel-black to-transparent pointer-events-none" />


                {/* Main Content – only the left block is clickable, not the whole screen */}
                <div className="absolute left-0 top-0 z-40 w-full max-w-xl pt-24 px-5 sm:px-10">
                    <h1 className='special-font hero-heading text-white drop-shadow-[0_0_10px_rgba(0,0,0,0.8)] text-glow'>
                        <b>Nexus</b>
                    </h1>

                    <p className='mb-5 max-w-72 font-robert-regular text-white/95 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]'>
                        A Marvel-themed CTF for beginners. <br />
                        No heavy technical stuff—just fun puzzles.
                    </p>

                    <Button
                        id="watch-Trailer"
                        title="Join the event"
                        leftIcon={<TiLocationArrow />}
                        onClick={() => navigate('/login')}
                        containerClass="!bg-marvel-red flex-center gap-1 text-white hover:!bg-marvel-red-dark transition-colors shadow-[0_0_20px_rgba(237,29,36,0.3)]"
                    />
                </div>

                {/* Single overlay line - bottom right */}
                <h1 className='special-font hero-heading absolute bottom-5 right-5 z-40 text-white drop-shadow-[0_0_10px_rgba(0,0,0,0.8)] text-glow'>
                    <b>Heroes Assemble</b>
                </h1>
            </div>
        </div>
    );
};

export default Hero;
