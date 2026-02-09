import React, { useEffect, useRef } from 'react'
import gsap from 'gsap';

import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const AnimatedTitle = ({title, containerClass}) => {

    const  containerRef = useRef(null);


    useEffect(() => {
        {/*context ensures animations only apply to elements inside containerRef*/}
        const ctx = gsap.context(() => {

            const titleAnimation = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current, //animation starts when containerRef reaches viewport
                    start: '100 bottom',
                    end: 'center bottom',
                    toggleActions: 'play none none reverse', //scroll down, leave forward, enter back, leave back
                }
            });

            {/*This animates elements with class animated-word*/}
            titleAnimation.to( '.animated-word', {
                opacity: 1,
                transform: 'translate3d(0, 0, 0) rotateY(0deg) rotateX(0deg)', //rotates back to its normal position
                ease: 'power2.inOut',
                stagger: 0.02,
            })
            
        }, containerRef)

        return () => ctx.revert(); //Cleanup function that runs when the component unmounts
    }, []);


  return (
    
    <div 
    ref={containerRef}
    className={`animated-title ${containerClass}`}> 
    {/*Has base class animated-title and also other classes passed thru containerClass prop*/}
         {/*.map() is used to loop through each split line with index*/} 
            {title.split('<br />').map((line, index) => (
                
                <div key={index} className='flex-center max-w-full
               flex-wrap gap-2 px-10 md:gap-3'>
                {/*This loops thru each word with i*/}
                    {line.split(' ').map((word, i) => (
                        <span key={i} className='animated-word'
                        dangerouslySetInnerHTML={{ __html: word}}/>
                    ))}
                </div>
            ))}
     </div>             
  )
}

export default AnimatedTitle