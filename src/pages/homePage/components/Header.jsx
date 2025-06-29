import { useLocation, useNavigate, Link } from 'react-router-dom';
import { disablePageScroll, enablePageScroll } from 'scroll-lock';
import { navigation } from '../constants';
import { useState, useEffect } from 'react';
import Button from './Button';
import MenuSvg from '../assets/svg/MenuSvg';
import logo from '../assets/crystal-land-log-removebg.png';

// MobileNav Component for Mobile and Tablet
const MobileNav = ({ open, onLinkClick, navigation, onClose }) => {
  return (
    <>
      {/* Overlay for clickaway */}
      {open && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent dark overlay
            zIndex: 50, // Below MobileNav, above header
          }}
          className="lg:hidden"
          onClick={onClose} // Close navigation on overlay click
        />
      )}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          width: '80%',
          maxWidth: '300px',
          backgroundColor: '#070B21', // Solid dark blue background
          backdropFilter: 'blur(10px)', // Subtle glassmorphism
          borderRight: '1px solid rgba(255, 255, 255, 0.2)', // Subtle border
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease-in-out',
          zIndex: 51, // Above overlay
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '2px 0 8px rgba(0, 0, 0, 0.3)', // Subtle shadow
        }}
        className="lg:hidden"
        onClick={(e) => e.stopPropagation()} // Prevent clicks on nav from closing it
      >
        {navigation.map((item) => (
          <a
            key={item.id}
            href={item.url}
            onClick={(e) => {
              e.stopPropagation(); // Prevent overlay close on link click
              e.currentTarget.style.transform = 'scale(0.95)';
              setTimeout(() => {
                e.currentTarget.style.transform = 'scale(1)';
                onLinkClick(item.url);
              }, 150); // Brief click animation
            }}
            style={{
              fontFamily: 'monospace',
              fontSize: '1rem', // Reduced font size from 1.5rem
              fontWeight: '600',
              textTransform: 'uppercase',
              color: '#ffffff',
              padding: '1.5rem',
              margin: '0.5rem 0',
              width: '90%',
              textAlign: 'center',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)', // Subtle background
              transition: 'background-color 0.3s, transform 0.3s, color 0.3s',
            }}
            className="hover:bg-[#1a2a44] hover:scale-105 active:scale-95"
          >
            {item.title}
          </a>
        ))}
      </nav>
    </>
  );
};

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openNavigation, setOpenNavigation] = useState(false);

  const toggleNavigation = () => {
    if (openNavigation) {
      setOpenNavigation(false);
      enablePageScroll();
    } else {
      setOpenNavigation(true);
      disablePageScroll();
    }
  };

  const handleClose = () => {
    setOpenNavigation(false);
    enablePageScroll();
  };

  const handleClick = (url) => {
    if (url.startsWith('#')) {
      const elementId = url.substring(1);
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(url);
    }

    if (openNavigation) {
      setOpenNavigation(false);
      enablePageScroll();
    }
  };

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 border-b border-n-6 bg-n-8/30 backdrop-blur-md
        ${location.pathname !== '/' && 'h-[10%] flex items-center'}`}
    >
      <div className="flex items-center px-5 lg:px-7.5 xl:px-10 max-lg:py-4">
        <Link to="/" className="flex items-center w-[20rem] xl:mr-8">
          <img src={logo} alt="Crystal Land Academy Logo" className="w-12 h-12 mr-2" />
          <p className="font-extrabold lg:text-[1em]">Crystal Land Academy</p>
        </Link>
        {location.pathname === '/' && (
          <div className="flex items-center justify-end w-full">
            {/* Desktop Navigation (lg and above) */}
            <nav className="hidden lg:flex lg:static lg:bg-transparent lg:backdrop-blur-none">
              <div className="relative z-2 flex flex-row">
                {navigation.map((item) => (
                  <a
                    key={item.id}
                    href={item.url}
                    onClick={() => handleClick(item.url)}
                    className={`block relative font-code text-xs font-semibold
                      transition-colors hover:text-color-1 px-6 py-6 md:py-8 lg-mr-0.25
                      ${item.onlyMobile ? 'lg:hidden' : ''}
                      ${item.url === location.pathname ? 'z-2 text-n-1' : 'text-n-1/50 leading-5 hover:text-n-1 xl:px-12'}`}
                  >
                    {item.title}
                  </a>
                ))}
              </div>
            </nav>

            {/* Mobile/Tablet Navigation (below lg) */}
            <MobileNav
              open={openNavigation}
              onLinkClick={handleClick}
              onClose={handleClose}
              navigation={navigation}
            />

            <Button
              onClick={() => navigate('/code-authenticator')}
              className="button hidden mr-8 text-n-1/50 transition-colors hover:text-n-1 lg:block"
            >
              Sign up
            </Button>
            <Button white className="hidden lg:flex" onClick={() => navigate('/signin')}>
              Sign in
            </Button>

            <Button
              className="ml-auto lg:hidden px-3"
              onClick={toggleNavigation}
              aria-label="Toggle navigation"
            >
              <MenuSvg openNavigation={openNavigation} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;