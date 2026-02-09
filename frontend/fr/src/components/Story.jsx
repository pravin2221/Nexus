import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import AnimatedTitle from './AnimatedTitle'
import gsap from 'gsap'
import Button from './Button' 

const Story = () => {

    const frameref = useRef('null');

    const handlemouseleave = () => {
        const element = frameref.current;
        gsap.to(element, {
            duration: 0.1,
            rotateX:0,
            rotateY:0,
            ease: 'power1.inOut',
        })
    }

    const handlemousemove = (e) => {
            const {clientX, clientY} = e;
            const element = frameref.current;

            if(!element) return;

            const rect = element.getBoundingClientRect();
            const x = clientX  - rect.left;
            const y = clientY - rect.top;

            const centerX = rect.width/2;
            const centerY = rect.height/2;

            const rotateX = ((y- centerY)/ centerY) * -10;
            const rotateY = ((x- centerX)/centerX) *  10;

            gsap.to(element, {
                duration: 0.1,
                rotateX, rotateY,
                transformPerspective: 500,
                ease: 'power1.inOut',
            })

    }

  return (
    <section id="story" className='min-h-dvh w-screen bg-marvel-black text-white'>
        <div className='flex size-full flex-col 
        items-center py-10 pb-24'>
            <p className='font-general text-sm uppercase tracking-wider text-white/80
            md:text-base'>How it works</p>
            <div className='relative size-full'>
                <AnimatedTitle
                title="<b>Solve</b> · <b>Submit</b> · <b>Climb</b>"
                 sectionId = "#story"
                 containerClass="mt-5 pointer-events-none relative z-10 text-white"/>

                 <div className='story-img-container'>
                    <div className='story-img-mask'>
                        <div className='story-img-content'>
                                <img 
                                ref ={frameref}
                                onMouseLeave={handlemouseleave}
                                onMouseUp={handlemouseleave}
                                onMouseEnter={handlemouseleave}
                                onMouseMove={handlemousemove}
                                src="https://res.cloudinary.com/dqbhvzioe/image/upload/v1744102885/story_uabcoa.webp"
                                alt='Nexus CTF'
                                className='object-contain'/>

                        </div>

                    </div>

                 </div>
            </div>

            <div className='-mt-80 flex w-full
            justify-center md:-mt-64 md:me-44 md:justify-end'>
                <div className='flex h-full w-fit flex-col items-center
                md:items-start'>
                    <p className='mt-3 max-w-sm text-center
                    font-circular-web text-white/90 md:text-start'>
                    Pick a challenge, find the flag, and submit it to score points. 
                    Check the leaderboard to see where you stand. 
                    Team up or go solo—Nexus is built for beginners.
                    </p>

                    <Link to="/challenges">
                      <Button
                        id="realm-button"
                        title="View challenges"
                        containerClass="mt-5"
                      />
                    </Link>

                </div>

            </div>
        </div>
    </section>
  )
}

export default Story