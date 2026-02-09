import React from 'react'
import gsap from 'gsap';
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/all';
import AnimatedTitle from './AnimatedTitle';
gsap.registerPlugin(ScrollTrigger)


const About = () => {

    useGSAP(() => {
        const clipAnimation = gsap.timeline({
            scrollTrigger: {
                trigger: '#clip', //triggers when the clip id part comes into view
                start: 'center center', //starts when center of viewport aligns with center of viewport
                end: '+=800 center', //animation continues for 800px downwards frm start, element remains at center while scrolling
                scrub: 0.5, //makes animation smoother
                //animation will catch up with scroll with 0.5 delay
                pin: true, //pins the element and rest of element scrolls but that element is fixed
                //till we reach end value
                pinSpacing: true, //GSAP preserves the space the element 
                // would have taken while scrolling,
                //  keeping everything smooth
            },
        });    //allows to create a trigger, start and end more precisely

        clipAnimation.to('.mask-clip-path', {

            width: '100vw',
            height: '100vh',
            borderRadius: 0,
        });

    });
    return (
        <div id='about' className='min-h-screen w-screen bg-marvel-black'>
            {/* Glow effect behind title */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[500px] bg-marvel-red/10 blur-[150px] rounded-full pointer-events-none" />

            <div className='relative mb-8 mt-24 md:mt-36 flex flex-col
        items-center gap-5 px-4'>
                <p className='font-general text-sm uppercase text-marvel-red tracking-widest
            md:text-[14px] z-10'>
                    Heroes, Assemble!
                </p>

                {/* creates custom titles*/}
                <AnimatedTitle title=" Welcome to <br /> <b>N</b>exus <br />
             where <br /> <b>B</b>eginners become heroes!"
                    containerClass="mt-5 !text-white text-glow
             text-center z-10"/>



                <div className='about-subtext z-10'>
                    <p className="text-white/90">
                        A college CTF with a Marvel twist. Solve challenges, capture flags, and climb the leaderboard.
                    </p>
                    <p className='text-white/60'>
                        New to CTFs? No worries—our challenges are beginner-friendly and fun.
                    </p>
                </div>
            </div>

            <div className='h-dvh w-screen' id='clip'>
                <div className='mask-clip-path about-image relative'>
                    <img
                        src='https://res.cloudinary.com/dqbhvzioe/image/upload/v1744102885/about_jpf4ti.webp'
                        alt='background image'
                        className='absolute left-0 top-0
                    size-full object-cover'
                    />
                    {/* Overlay to blend image into black background */}
                    <div className="absolute inset-0 bg-black/20" />
                </div>
            </div>
        </div>
    )
}

export default About