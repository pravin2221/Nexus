import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { TiLocationArrow } from 'react-icons/ti' 


{/*for creating the tilt effect in features cards */}
const BentoTilt =({children, className =''}) => {

    const[transformStyle, setTransformStyle] = useState('');
    const itemref = useRef();

    const handlemousemove = (e) => {
        if(!itemref.current) return;

        const { left, top, width, height } = itemref.current.getBoundingClientRect();

        const relativeX = (e.clientX -left) / width;
        const relativeY = (e.clientY -top) / height;

        const tiltX = (relativeY-0.5) * 30;
        const tiltY = (relativeX-0.5) * -30;

        const newTransform = `perspective(700px) rotateX(${tiltX}deg)
        rotateY(${tiltY}deg) scale3d(0.96,0.96,0.96)`

        setTransformStyle(newTransform)
    }

    const handlemouseleave = () => {
        setTransformStyle('');
    }

    return (
        <div className={className} ref={itemref}
        onMouseMove={handlemousemove} onMouseLeave={handlemouseleave}
        style = {{transform: transformStyle}}>
            {children}
        </div>
    )
}



const BentoCard = ({src, title, description}) => {
    return (
        <div className='relative size-full'>
            <video
            src={src}
            loop
            muted
            type="video/mp4"
            playsInline
            autoPlay
            className='absolute left-0 top-0
            size-full object-cover object-center'
            />

            <div className='relative z-10 flex size-full flex-col
            justify-between p-5 text-white'>
                <div>
                    <h1 className='bento-title special-font'>{title}</h1>
                    {description && (
                        <p className='mt-3 max-w-64 text-xs
                        md:text-base text-white/90'>{description}</p>
                    )}
                </div>
            </div>
        </div>
    )
}

const Features = () => {
  return (
    <section className='bg-marvel-black pb-16 md:pb-24'>
        <div className='container mx-auto px-4 md:px-10'>
        <div className='px-4 py-16 md:py-24'>
                <p className='font-circular-web text-lg 
                text-white'>Into the Nexus</p>

        <p className='max-w-md font-circular-web text-lg text-white/80'>
        A beginner-friendly CTF with a Marvel theme. 
        Solve puzzles across Web, Crypto, Forensics, and Misc—no heavy technical experience needed. 
        Just curiosity, a bit of logic, and the will to capture the flag.
        </p>
        </div>
        

        <BentoTilt className='border-hsla relative mb-7 min-h-[50vh]
        w-full overflow-hidden rounded-lg md:h-[65vh]'>
            <BentoCard
            src= "https://res.cloudinary.com/dqbhvzioe/video/upload/v1744103107/f1_fswysc.mp4"
            title={<>Capture <b>The</b> Flag</>}
            description="Solve challenges, find hidden flags, and submit them to earn points. Perfect for first-timers."
           
            />
        </BentoTilt>

            <div className='grid h-[135vh] grid-cols-2 grid-rows-3
            gap-7'>
                    <BentoTilt className='bento-tilt_1 row-span-1 md:col-span-1
                   md:row-span-2 '>
                                <BentoCard
                                    src="https://res.cloudinary.com/dqbhvzioe/video/upload/v1744103020/f2_kqtilp.mp4"
                                    title={<><b>Web</b> & Crypto</>}
                                    description={"Decode messages, inspect web pages, and crack simple ciphers. Beginner-friendly."}
                                 />
                    </BentoTilt>

                    <BentoTilt className='bento-tilt_1 row-span-1 md:col-span-1'>
                            <BentoCard
                            src="https://res.cloudinary.com/dqbhvzioe/video/upload/v1744102674/feature-3_k3tnrx.mp4"
                            title={<><b>Forensics</b></>}
                            description="Analyze files and images to uncover secrets. No prior experience required."
                            />
                    </BentoTilt>

                    <BentoTilt className='bento-tilt_1 md:col-span-1'>
                            <BentoCard
                            src="https://res.cloudinary.com/dqbhvzioe/video/upload/v1744102652/feature-4_p5nprl.mp4"
                            title={<><b>Misc</b></>}
                            description="Logic puzzles, trivia, and general fun. Something for everyone."
                            />
                    </BentoTilt>

                    <BentoTilt className='bento-tilt_2'>
                        <Link to="/challenges" className='flex size-full flex-col justify-between
                        bg-marvel-red p-5 block'>
                            <h1 className='bento-title
                            special-font max-w-64 text-white'>View <b>Ch</b>allenges</h1>
                            <TiLocationArrow className='m-5 scale-[5] self-end'/>
                        </Link>
                    </BentoTilt>

                    <BentoTilt className='bento-tilt_2'>
                            <video
                            src='https://res.cloudinary.com/dqbhvzioe/video/upload/v1744102683/feature-5_lfdc9j.mp4'
                            loop
                            muted
                            autoPlay
                            className='size-full object-cover object-center'/>
                    </BentoTilt>

            </div>

        </div>
    </section>
  )
}

export default Features