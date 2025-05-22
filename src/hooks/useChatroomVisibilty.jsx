import { useState, useEffect } from 'react';

export const useChatroomVisibility = (chatroomRef, currentChat) => {
  const [isInView, setIsInView] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const rect = chatroomRef.current?.getBoundingClientRect();
      const isVisible = rect && rect.top >= 0 && rect.bottom <= window.innerHeight;
      setIsInView(isVisible);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check for visibility

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [chatroomRef]);

  return isInView ? currentChat.name : null;
};
