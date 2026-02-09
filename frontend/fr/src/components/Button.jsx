import React from 'react'

const Button = ({ title, id, rightIcon, leftIcon, containerClass, onClick }) => {
  return (
    <button
      id={id}
      type="button"
      onClick={onClick}
      className={`group relative z-10 w-fit cursor-pointer
    overflow-hidden rounded-full bg-marvel-red px-7 py-3
    text-white transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-marvel-black ${containerClass}`}>

    {leftIcon}

    <span className='relative inline-flex overflow-hidden font-general
    text-xs uppercase'>
        <div>
            {title}
        </div>
    </span>

    {rightIcon}
    </button>

  )
}

export default Button