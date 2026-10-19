import { Suspense, useEffect } from 'react';
import { Outlet, useLocation, useNavigationType } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import PageLoader from '../../components/PageLoader';

// Marketing/app chrome. Auth pages render outside this so they stay full-screen.
export default function MainLayout() {
    const { pathname, hash } = useLocation();
    const navigationType = useNavigationType();

    // A new page opens at the top; back/forward and #anchor links keep their own position.
    useEffect(() => {
        if (navigationType !== 'POP' && !hash) window.scrollTo(0, 0);
    }, [pathname, hash, navigationType]);

    // The homepage theme (styles/home-theme.css) covers the navbar, page and footer together.
    // Elsewhere the wrapper is display: contents, so it adds no box and changes no layout.
    return (
        <div className={pathname === '/' ? 'home-theme' : 'contents'}>
            <Navbar />
            <Suspense fallback={<PageLoader />}>
                <Outlet />
            </Suspense>
            <Footer />
        </div>
    );
}
