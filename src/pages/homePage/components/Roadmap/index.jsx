import React, { useEffect, useRef } from 'react';
import Section from '../Section';
import Heading from '../Heading';
import { roadmap } from '../../constants';
import { grid } from '../../assets';
import { Gradient } from '../design/Roadmap';
import './roadmaps.css';

const Roadmap = () => {
  const itemsRef = useRef([]);

  useEffect(() => {
    const options = {
      root: null,
      threshold: 0.1,
    };

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('slide-in'); // Add the animation class
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, options);

    itemsRef.current.forEach((item) => {
      if (item) observer.observe(item);
    });

    return () => {
      itemsRef.current.forEach((item) => {
        if (item) observer.unobserve(item);
      });
    };
  }, []);

  return (
    <Section className='overflow-hidden' id='roadmap'>
        <div className='container md:pb-10'>
            <Heading title='Our learning app features' tag='Ready to get started' />
           
            <div className="relative grid gap-6 md:grid-cols-2 md:gap-4 md:pb-[7rem]">
                 {roadmap.map((item, index) => {
                    const status = item.status === 'done' ? 'Done' : 'In Progress';

                    return(
                      <div 
                        ref={(el) => (itemsRef.current[index] = el)} 
                        key={item.id} 
                        className={`md:flex even:md:translate-y-[7rem] p-0.25 rounded-[2.5rem] 
                                   ${item.colorful ? 'bg-conic-gradient' : 'bg-n-6' }`}>
                        <div className='relative p-8 bg-n-8 rounded-[2.4375rem] overflow-hidden xl:p-15' >
                         
                          <div className='absolute top-0 left-0 max-w-full '>
                             <img src={grid}
                                 className='w-full'
                                 width={550} height={550}
                                 alt="grid" />
                          </div>

                            <div className='mb-10 -mt-0-mx-15'>
                                <div className="relative w-full">
                                  <img src={item.imageUrl}
                                       className='w-full'
                                       width={630 } height={420}
                                       alt={item.title} />
                                  {/* Overlay */}
                                  <div className="absolute inset-0 bg-black opacity-30 rounded-[2.4375rem]"></div>
                                </div>
                            </div>

                            <h4 className='h4 mb-4'>{item.title}</h4>
                            <p className='body-2 text-n-4'>{item.text}</p>

                        </div>
                      </div>
                    );
                 })}
                 <Gradient />
            </div>
        </div>
    </Section>
  );
};

export default Roadmap;
