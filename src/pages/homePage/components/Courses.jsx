import React, { useEffect, useRef } from 'react';
import { courses } from '../constants';
import Heading from './Heading';
import Section from './Section';
import Arrow from '../assets/svg/Arrow';
import ClipPath from '../assets/svg/ClipPath';
import { GradientLight } from './design/Benefits';

const Courses = () => {
  const courseRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('slide-in');
        } else {
          entry.target.classList.remove('slide-in');
        }
      });
    });

    courseRefs.current.forEach((courseRef) => {
      if (courseRef) {
        observer.observe(courseRef);
      }
    });

    return () => {
      courseRefs.current.forEach((courseRef) => {
        if (courseRef) {
          observer.unobserve(courseRef);
        }
      });
    };
  }, []);

  return (
    <Section id='courses'>
      <div className='container relative z-2'>
        <Heading className='md:max-w-md lg:max-w-2xl' title='Take a look at our array of courses' />

        <div className='flex flex-wrap gap-10 mb-10'>
          {courses.map((item, index) => (
            <div
              ref={(el) => (courseRefs.current[index] = el)}
              className='course-item block relative p-0.5 bg-no-repeat bg-[length:100%_100%] md:max-w-[24rem] opacity-0 transform translate-y-[50px] transition-all duration-700 ease-out'
              style={{ backgroundImage: `url(${item.backgroundUrl})` }}
              key={item.id}
            >
              <div className='relative z-2 flex flex-col min-h-[22rem] p-[2.4rem] pointer-events-none'>
                <h5 className='h5 mb-5'>{item.title}</h5>
                <p className='body-2 mb-6 text-n-3'>{item.text}</p>
                <div className='flex items-center mt-auto'>
                  <img src={item.iconUrl} width={48} height={48} alt={item.title} />
                  <p className='ml-auto font-code text-xs font-bold text-n-1 uppercase tracking-wider'>
                    Explore more
                  </p>
                  <Arrow />
                </div>
              </div>
              {item.light && <GradientLight />}

              <div className='absolute inset-0.5 bg-n-8' style={{ clipPath: 'url(#benefits)' }}>
                <div className='absolute inset-0 opacity-0 transition-opacity hover:opacity-10'>
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      width={380}
                      height={362}
                      alt={item.title}
                      className='w-full h-full object-cover'
                    />
                  )}
                </div>
              </div>
              <ClipPath />
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default Courses;
