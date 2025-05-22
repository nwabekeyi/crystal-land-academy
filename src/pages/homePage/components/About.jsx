import React from 'react'
import Section from './Section'
import { smallSphere, stars } from '../assets'
import Heading from './Heading'
import PricingList from './AboutList'
import {LeftLine, RightLine } from './design/About'

const About = () => {
  return (
    <Section className='overflow-hidden' id='About'>
        <div className='container relative z-2'>
        <Heading 
               tag="Get the best tech learning experience"
               title="Bring learning to the comfort of your home"
               />
            <div className='hidden  relative justify-center mb-[2rem] lg:flex'>

             <div className='absolute top-1/2 left-1/2 w-[60rem]
                            -translate-x-1/2 -translate-y-1/2 pointer-events-none' >
                <img src={stars} className='w-full'
                     width={950} height={400} 
                     alt="stars" />
             </div>
            </div>

            <div className='relative'>
                 <PricingList/>
                 <LeftLine/>
                 <RightLine/>
            </div>
        </div>
    </Section>
  )
}

export default About