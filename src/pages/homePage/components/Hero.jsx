import React, { useRef, useEffect, useState } from 'react';
import Section from './Section';
import Button from './Button';
import { useNavigate } from 'react-router-dom';

import { curve, heroBackground } from '../assets';
import { Gradient } from './design/Hero';
import Generating from './Generating';
import classImage from "../assets/class.png";

const Hero = () => {
  const navigate = useNavigate();
  const parallaxRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <Section
      className={`relative pt-[12rem] -mt-[5.25rem] transition-opacity duration-[3000ms] ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      crosses
      crossesOffset='lg:translate-y-[5.25rem]'
      customPaddings
      id='hero'
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${heroBackground})` }}
      >
        {/* Optional overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 container" ref={parallaxRef}>
        <div className='max-w-[62rem] mx-auto text-center mb-[3.875rem] md:mb-20 lg:mb-[6.25rem]'>
          <h1 className='h1 mb-6'>
            Inspiring Excellence with Purpose and Lasting{' '}
            <span className='inline-block relative'>
              value{' '}
              <img src={curve} className='absolute top-full left-0 w-full xl:-mt-2' width={624} height={28} alt='Curve' />
            </span>
          </h1>
          <p className='body-1 max-w-3xl mx-auto mb-6 lg:mb-8'>
            A modern learning environment rooted in discipline, respect, and holistic development — where every child is guided to reach their full potential.
          </p>

          <Button white onClick={() => navigate('/code-authenticator')}>
            Get Started
          </Button>
        </div>

        <div className='relative max-w-[23rem] mx-auto md:max-w-5xl xl:mb-24'>
          <div className='relative z-1 p-0.5 rounded-2xl bg-gray'>
            <div className='relative bg-n-8 rounded-[1rem]'>
              <div className='h-[1.4rem] bg-purple rounded-t-[0.9rem]' />
              <div className='aspect-[33/40] rounded-b-[0.9rem] overflow-hidden md:aspect-[688/490] lg:aspect-[1024/490]'>
                <div className="relative group h-[auto]">
                  <div className="absolute top-0 left-0 right-0 bottom-0 bg-black opacity-50 z-10 group-hover:opacity-30 transition-opacity" />
                  <div className="top-[60%] left-1/2 w-full absolute md:top-[40%] md:left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 text-white text-xl font-semibold text-center px-4 md:text-3xl">
                    <p>"we build knowledge, faith, and friendship"</p>
                  </div>

                  <img
                    src={classImage}
                    alt="learners image"
                    className='w-full h-[100%] scale-[1.7] translate-y-[8%] md:scale-[1] md:-translate-y-[10%] lg:-translate-y-[23%] z-0'
                    width={1024}
                    height={490}
                  />

                  <Generating className='absolute top-[100%] md:top-[60%] left-4 right-4 bottom-2 md:left-1/2 md:right-auto md:bottom-8 md:w-[31rem] md:-translate-x-1/2 z-[10000]' />
                </div>
              </div>
            </div>

            <Gradient />
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Hero;
