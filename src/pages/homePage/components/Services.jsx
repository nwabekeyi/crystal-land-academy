import React from 'react'
import Section from './Section'
import Heading from './Heading'
import { check, service1 } from '../assets'
import { services, servicesIcons } from '../constants'
import Generating from './Generating'
import { Gradient } from './design/Services'

const Services = () => {
  return (
    <Section id='services'>
      <div className='container'>
        <Heading
          className='text-center'
          title='Build Your Tech Career with Virtual Classes'
          text='We empower you to master essential tech skills through hands-on, application-based learning from top-notch instructors.'
        />

        <div className='relative'>
          <div className='relative h-[39rem] z-1 border border-n-1/10
                             flex items-center overflow-hidden p-8
                             mb-5 rounded-3xl lg:p-20 xl:h-[46rem]'>
            <div className='absolute top-0 left-0 w-full h-full pointer-events-none md:w-3/5 xl:w-auto'>
              <img
                className='w-full h-full object-cover md:object-right'
                width={800} height={730}
                src={service1}
                alt="Virtual Tech Classes"
              />
            </div>

            <div className='relative z-1 max-w-[17rem] ml-auto'>
              <h4 className='h4 mb-4'>Let's guide you to the future</h4>
              <p className='body-2 mb-[3rem] text-n-3'>
                Learn cutting-edge technology skills through virtual classrooms led by industry experts. Gain practical experience and accelerate your career growth.
              </p>
              <ul className='body-2'>
                {services.map((item, index) => (
                  <li key={index} className='flex items-start py-4 border-t border-n-6'>
                    <img
                      src={check}
                      alt="check"
                      height={24} width={24}
                    />
                    <p className='ml-4'>{item}</p>
                  </li>
                ))}
              </ul>
            </div>
            <Generating className='absolute left-4 right-4 bottom-4 border-n-1/10 border lg:left-1/2 lg:bottom-8 lg:-translate-x-1/2' />
          </div>

          <div className='relative grid z-1 gap-4 lg:grid-cols-2'>
            <div className='relative min-h-[39rem] z-1 border border-n-1/10 rounded-3xl overflow-hidden'>
              <div className='absolute inset-0'>
                <img
                  src='https://dl.dropboxusercontent.com/scl/fi/1yrtqv2ejdjncq64t47z0/tech-edu.jpeg?rlkey=onq7xtgbftss42pgrt66wkqsv&st=zjrch1ub&dl=0'
                  alt="Tech Education"
                  className='h-full w-full object-cover'
                  width={630} height={750}
                />
              </div>

              <div className='absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-b from-n-8/0 to-n-8/90'>
                <h4 className='h4 mb-4'>Top-Level Tech Education</h4>
                <p className='body-2 mb-[3rem] text-n-3'>
                  Master the latest in-demand tech skills through virtual classes taught by leading professionals. Learn by doing, with real-world projects and practical applications.
                </p>
              </div>
            </div>

            <div className='p-4 bg-n-7 lg:min-h-[46rem] rounded-3xl overflow-hidden'>
              <div className='py-12 px-4 xl:px-8'>
                <h4 className='h4 mb-4'>Application-Based Learning</h4>
                <p className='body-2 mb-[2rem] text-n-3'>
                  Experience hands-on learning through projects and challenges designed to build your skills in software development, cloud computing, data analysis, and more.
                </p>
                <ul className='flex items-center justify-between'>
                  {servicesIcons.map((item, index) => (
                    <li
                      key={index}
                      className={`flex items-center justify-center rounded-2xl ${
                        index === 2
                          ? 'w-[3rem] h-[3rem] p-0.25 bg-conic-gradient md:w-[4.5rem] md:h-[4.5rem]'
                          : 'flex w-10 h-10 bg-n-6 md:h-15 md:w-15'
                      }`}
                    >
                      <div className={index === 2 ? 'flex items-center justify-center bg-n-7 h-full w-full rounded-[1rem]' : ''}>
                        <img
                          src={item}
                          width={24} height={24}
                          alt='service icon'
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className='relative h-[20rem] bg-n-8 rounded-xl md:h-[25rem] overflow-hidden'>
                <img
                  src='https://dl.dropboxusercontent.com/scl/fi/ps31gtjgyblmrhaobv2fk/computer.jpeg?rlkey=0u2ozn88mz30g81022odzbgys&st=x7j2sw7k&dl=0'
                  className='w-full h-full object-cover'
                  width={520} height={400}
                  alt="Tech Tools"
                />
              </div>
            </div>
          </div>

          <Gradient />
        </div>
      </div>
    </Section>
  )
}

export default Services
