import React from 'react'
import { FaDiscord, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa'

const links = [
  { href: '#', icon: <FaDiscord /> },
  { href: '#', icon: <FaTwitter /> },
  { href: '#', icon: <FaYoutube /> },
  { href: '#', icon: <FaInstagram /> },
]

const Footer = () => {
  return (
    <footer className='w-screen bg-marvel-black py-6 text-white border-t border-white/10 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]'>
      <div className='container mx-auto flex flex-col items-center
            justify-between gap-4 px-4 md:flex-row'>
        <p className='text-center text-sm md:text-left text-white/60 font-circular-web'>
          &copy; Nexus CTF. All rights reserved
        </p>
        <div className='flex justify-center gap-5 md:justify-start'>
          {links.map((link, i) => (
            <a key={i} href={link.href} target="_blank"
              rel='noopener noreferrer' className='text-white/60 text-lg
                                transition-colors duration-300 hover:text-marvel-red hover:text-glow focus:outline-none focus:text-marvel-red' aria-label="Social link">
              {link.icon}
            </a>
          ))}
        </div>

        <a href="#privacy-policy" className='text-center text-sm text-white/60
                    hover:text-marvel-red hover:underline md:text-right transition-colors font-circular-web'>
          Privacy Policy
        </a>
      </div>
    </footer>
  )
}

export default Footer