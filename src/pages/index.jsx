import React, { useState } from 'react';
import HeroSection from '../components/HeroSection';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import InfoSection from '../components/InfoSection';
import { homeObjOne, homeObjTwo, homeObjFour } from '../components/InfoSection/Data';
import Footer from '../components/Footer';
import Testimonials from '../components/Testimonials';
import Courses from '../components/courses';



const Home = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => {
        let abortController = new AbortController();
        setIsOpen(!isOpen);
        return () => {
            abortController.abort();
        }
    }

    return (
        <>
            <Sidebar isOpen={isOpen} toggle={toggle} />
            <Navbar toggle={toggle} />
            <HeroSection />
            <Courses />
            <InfoSection {...homeObjTwo}/>
            <InfoSection {...homeObjFour} />
            <InfoSection {...homeObjOne} />
            <Testimonials />
            <Footer />
        </>
    )
}

export default Home;
