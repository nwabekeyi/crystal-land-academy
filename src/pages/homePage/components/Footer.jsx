import React from 'react'
import Section from './Section'
import { socials } from '../constants'

const Footer = ({ home }) => {
  return (
    <Section 
      crosses 
      className={`!px-0 !py-10 ${home ? '' : 'bg-black'}`} // Apply black background if home prop is not passed
    >
      <div className='container flex sm:justify-between justify-center items-center gap-10 max-sm:flex-col'>
        <p className='caption lg:block text-n-4'>
          © { new Date().getFullYear()}. All rights reserved.
        </p>

        <ul className='flex gap-5 flex-wrap'>
          {socials.map((item) => (
            <a href={item.id} key={item.id} target='_blank' 
               className='flex items-center justify-center w-10 h-10 
                          bg-n-7 rounded-full transition-colors hover:bg-n-6 '>
              <img src={item.iconUrl} width={16} height={16} alt={item.title} />
            </a>
          ))}
        </ul>
      </div>
    </Section>
  )
}

export default Footer
