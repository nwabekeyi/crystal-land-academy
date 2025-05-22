import React from 'react'
import { about } from '../constants'

const About = () => {
  return (
    <div className='flex gap-[1rem] max-lg:flex-wrap'>
      {about.map((item, index) => (
        <div 
          key={item.id}
          className={`about-container w-[19rem] max-lg:w-full border
                     border-n-6 bg-n-8 rounded-[2rem] h-full px-6 
                     lg:w-[33.33%] even:py-14 odd:py-8 odd:my-4
                     [&>h4]:first:text-color-2 [&>h4]:even:text-color-1 [&>h4]:last:text-color-3 
                     animate-dwindle-${index % 3}`} // Assign different animation class based on index
        >
          <h4 className='h4 mb-4'>{item.title}</h4>
          
          {/* Image below the title */}
          <img 
            src={item.pictureUrl} 
            alt={item.title} 
            className='w-full h-[200px] object-cover rounded-[1rem] mb-4' 
          />
          <p className='body-2 min-h-[4rem] mb-3 text-n-1/50'>{item.description}</p>
        </div>
      ))}
    </div>
  )
}

export default About
