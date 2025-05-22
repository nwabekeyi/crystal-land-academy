import React, { useRef, useEffect, useState } from 'react';
import Section from './Section';
import Button from './Button';
import { useNavigate } from 'react-router-dom';

import { curve, heroBackground } from '../assets';
import { BackgroundCircles, BottomLine, Gradient } from './design/Hero';
import Generating from './Generating';

const Hero = () => {
    const navigate = useNavigate();
    const parallaxRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    // Fade-in effect on component load
    useEffect(() => {
        setIsVisible(true); // Trigger the fade-in by setting visibility to true after mount
    }, []);

    return (
        <Section
            className={`pt-[12rem] -mt-[5.25rem] transition-opacity duration-[5000ms] ${isVisible ? 'opacity-100' : 'opacity-0'}`}
            crosses
            crossesOffset='lg:translate-y-[5.25rem]'
            customPaddings
            id='hero'
        >
            <div className='container relative' ref={parallaxRef}>
                <div className='relative z-1 max-w-[62rem] mx-auto text-center mb-[3.875rem] md:mb-20 lg:mb-[6.25rem]'>
                    <h1 className='h1 mb-6'>
                        Transform Your Passion for Technology into Mastery with{` `}
                        <span className='inline-block relative'>
                            Our App {" "}
                            <img src={curve} className='absolute top-full left-0 w-full xl:-mt-2' width={624} height={28} alt='Curve' />
                        </span>
                    </h1>
                    <p className='body-1 text-n-2 max-w-3xl mx-auto mb-6 lg:mb-8'>
                        Unlock Interactive Lessons, Real-Time Support, and Hands-On Projects to Master Essential Tech Skills, All Within One Powerful App!
                    </p>

                    <Button white onClick={() => navigate('/chatbot')}>
                        Get Started
                    </Button>
                </div>

                <div className='relative max-w-[23rem] mx-auto md:max-w-5xl xl:mb-24'>
                    <div className='relative z-1 p-0.5 rounded-2xl bg-conic-gradient '>
                        <div className='relative bg-n-8 rounded-[1rem]'>
                            <div className='h-[1.4rem] bg-n-10 rounded-t-[0.9rem]' />
                            <div className='aspect-[33/40] rounded-b-[0.9rem] overflow-hidden md:aspect-[688/490] lg:aspect-[1024/490]'>
                                <div className="relative group h-[auto]">
                                    <div className="absolute top-0 left-0 right-0 bottom-0 bg-black opacity-50 z-10 group-hover:opacity-30 transition-opacity"></div>
                                    <div className="top-[60%] left-1/2 w-full absolute md:top-[40%] md:left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 text-white text-xl font-semibold text-center px-4 md:text-3xl">
                                        <p>"Empowering you with tech skills for tomorrow's challenges."</p>
                                    </div>

                                    <img
                                        src='https://dl.dropboxusercontent.com/scl/fi/lbpxul04t1alamp6dmnna/techie.jpeg?rlkey=navep0n71tpl463h4tbao7c82&st=i7d4af1u&dl=0'
                                        alt="learners image"
                                        className='w-full h-[100%] scale-[1.7] translate-y-[8%] md:scale-[1] md:-translate-y-[10%] lg:-translate-y-[23%] z-0'
                                        width={1024} height={490}
                                    />

                                    <Generating className='absolute top-[100%] md:top-[60%] left-4 right-4 bottom-2 md:left-1/2 md:right-auto md:bottom-8 md:w-[31rem] md:-translate-x-1/2 z-[10000]' />
                                </div>
                            </div>
                        </div>

                        <Gradient />
                    </div>

                    <div className='absolute top-[54%] left-1/2 w-[234%] -translate-x-1/2 md:-top-[4%] md:w-[138%] lg:-top-[104%]'>
                        <img src={heroBackground} className='w-full' width={1440} height={1800} alt="hero-image" />
                    </div>
                    <BackgroundCircles />
                </div>
            </div>

            <BottomLine />
        </Section>
    );
};

export default Hero;
