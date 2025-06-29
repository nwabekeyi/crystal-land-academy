// Footer Component
import React from 'react';
import Section from './Section';
import { socials } from '../constants';

const Footer = ({ home }) => {
  return (
    <Section
      crosses
      className={`!px-0 !py-10 ${home ? '' : 'bg-black'}`} // Apply black background if home prop is not passed
    >
      <div className="container flex sm:justify-between justify-center items-center gap-10 max-sm:flex-col">
        <div className="text-center sm:text-left">
          <p className="caption text-n-4">
            © {new Date().getFullYear()}. All rights reserved.
          </p>
          <p className="caption text-n-4 mt-1">
            Developed by <span className="text-[#524B82] font-semibold">BeksTech</span> and{' '}
            <span className="text-[#524B82] font-semibold">Gytech</span>
          </p>
        </div>

        <ul className="flex gap-5 flex-wrap">
          {socials.map((item) => (
            <a
              href={item.url}
              key={item.id}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 bg-n-7 rounded-full transition-colors hover:bg-n-6"
            >
              <item.iconUrl size={16} /> {/* Render the react-icons component directly */}
            </a>
          ))}
        </ul>
      </div>
    </Section>
  );
};

export default Footer;