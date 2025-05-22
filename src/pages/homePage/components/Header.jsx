import { useLocation, useNavigate, Link } from 'react-router-dom';
import { disablePageScroll, enablePageScroll } from 'scroll-lock';
import { navigation } from '../constants';
import { HamburgerMenu } from '../components/design/Header';
import { useState, useEffect } from 'react';
import Button from './Button';
import MenuSvg from '../assets/svg/MenuSvg';

const Header = () => {
    const location = useLocation(); // Get the current location
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

    // Handle scrolling on location change (e.g., when user navigates)
    useEffect(() => {
        if (location.hash) {
            const element = document.getElementById(location.hash.substring(1));
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [location]);

    return (
        <div className={`fixed top-0 left-0 w-full z-50
                         border-b border-n-6
                       lg:bg-n-8/90 lg:backdrop-blur-sm
                         ${openNavigation ? 'bg-n-8' : 'bg-n-8/90 backdrop-blur-sm'}
                        ${location.pathname !== '/' && 'h-[10%] flex item-center'}

                       `}>
            <div className='flex items-center px-5 lg:px-7.5 xl:px-10 max-lg:py-4'>
                {/* Conditionally render the "Babtech e-learning" link */}
                    <Link to="/" className='block w-[20rem] xl:mr-8'>
                        <p className='font-extrabold lg:text-[1.7em]'>Beks e-learning</p>
                    </Link>
            {
               location.pathname === '/' && 
               <div className='flex items-center justify-stretch w-full'>
                  <nav className={` ${openNavigation ? 'flex' : 'hidden'} fixed top-[5rem]
                                 left-0 right-0 bottom-0
                               bg-n-8 lg:static lg:flex 
                                 lg:mx-auto lg:bg-transparent`}>
                    <div className='relative z-2 flex flex-col items-center justify-center m-auto lg:flex-row'>
                        {navigation.map((item) => (
                            <a key={item.id} href={item.url}
                               onClick={() => handleClick(item.url)}
                               className={`block relative font-code
                                              text-2xl uppercase text-n-1 transition-colors hover:text-color-1 ${item.onlyMobile ? 'lg:hidden' : ''}
                                              px-6 py-6 md:py-8 lg-mr-0.25
                                              lg:text-xs lg:font-semibold
                                              ${item.url === location.pathname ? 'z-2 lg:text-n-1' : 'lg:text-n-1/50 lg:leading-5 lg:hover:text-n-1 xl:px-12'}
                                  `}>
                                {item.title}
                            </a>
                        ))}
                    </div>
                    <HamburgerMenu />
                </nav>

                <Button onClick={() => navigate('/code-authenticator')} className='button hidden mr-8 text-n-1/50  transition-colors hover:text-n-1 lg:block '>
                    Sign up
                </Button>
                <Button className='hidden lg:flex' onClick={() => navigate('/signin')}>
                    Sign in
                </Button>
                
                <Button className='ml-auto lg:hidden px-3' onClick={toggleNavigation}>
                    <MenuSvg openNavigation={openNavigation} />
                </Button>

               </div>
            }
                
            </div>
        </div>
    );
};

export default Header;
