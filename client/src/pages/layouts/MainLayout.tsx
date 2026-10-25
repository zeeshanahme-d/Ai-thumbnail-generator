import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import PageLoader from '../../components/PageLoader';

// Marketing/app chrome. Auth pages render outside this so they stay full-screen.
export default function MainLayout() {
    return (
        <>
            <Navbar />
            <Suspense fallback={<PageLoader />}>
                <Outlet />
            </Suspense>
            <Footer />
        </>
    );
}
