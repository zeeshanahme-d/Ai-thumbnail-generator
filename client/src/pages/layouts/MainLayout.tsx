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

    // Every public page shares one look (styles/public-theme.css) across its navbar, page and footer.
    return (
        <div className="public-theme">
            <Navbar />
            <Suspense fallback={<PageLoader />}>
                <Outlet />
            </Suspense>
            <Footer />
        </div>
    );
}
