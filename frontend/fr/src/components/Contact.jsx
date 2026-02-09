import React from 'react'
import { useNavigate } from 'react-router-dom'
import Button from "./Button";

const ImageClipBox = ({ src, clipclass, alt = '' }) => (
  <div className={clipclass}>
    <img src={src} alt={alt} className="size-full object-cover" />
  </div>
)

const Contact = () => {
  const navigate = useNavigate()
  return (
    <div id="contact" className='my-16 md:my-20 min-h-96 w-screen px-4 md:px-10'>
      <div className='relative rounded-xl md:rounded-2xl
            bg-marvel-black border border-white/10 py-16 md:py-24 text-white sm:overflow-hidden'>
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-marvel-red/10 blur-[100px] rounded-full pointer-events-none" />

        <div className='absolute -left-20 top-0 hidden h-full w-72
               overflow-hidden sm:block lg:left-20 lg:w-96'>
          <ImageClipBox
            clipclass="contact-clip-path-1"
            src="https://res.cloudinary.com/dqbhvzioe/image/upload/v1744102877/contact-1_uz1ptm.webp"
            alt="Contact"
          />
          <ImageClipBox
            clipclass="contact-clip-path-2 lg:translate-y-5 lg:translate-x-10 translate-y-10"
            src="https://res.cloudinary.com/dqbhvzioe/image/upload/v1744102880/contact-2_hjkj1s.webp"
            alt="Contact"
          />
        </div>

        <div className='absolute -top-40 left-20 w-60
               sm:top-1/2 md:left-auto md:right-10 lg:top-20 lg:w-80'>
          <ImageClipBox
            clipclass="absolute md:scale-125"
            src="https://res.cloudinary.com/dqbhvzioe/image/upload/v1744102882/avenger-partial_yoxjwa.png"
            alt="Avengers"
          />
          <ImageClipBox
            clipclass="sword-man-clip-path md:scale-125"
            src="https://res.cloudinary.com/dqbhvzioe/image/upload/v1744102883/avenger_jptuyn.png"
            alt="Avengers"
          />
        </div>

        <div className='flex flex-col items-center
               text-center relative z-10'>
          <p className='font-general text-[20px] text-marvel-red uppercase tracking-widest'>Join Nexus</p>
          <p className='special-font mt-10 w-full
                font-zentry text-5xl leading-[0.9] md:text-[6rem] text-glow'>
            <b>R</b>egister for the <br />
            <b>e</b>vent & <br /> <b>w</b>in.</p>

          <Button
            title="Register / Contact"
            onClick={() => navigate('/login')}
            containerClass="mt-10 cursor-pointer !bg-marvel-red hover:!bg-marvel-red-dark text-white"
          />
        </div>

      </div>
    </div>
  )
}

export default Contact