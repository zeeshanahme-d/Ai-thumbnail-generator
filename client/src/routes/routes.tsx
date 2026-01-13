import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LenisScroll from '../components/LenisScroll';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HomePage from '../pages/home/HomePage';
import Generate from '../pages/generate/Generate';
import MyGeneration from '../pages/my-generation/MyGeneration';
import YtPreview from '../pages/yt-preview/YtPreview';
import ProtectedRoute from './protected-routes';


function AppRoutes() {
    return (
        <BrowserRouter>
            {/* <LenisScroll /> */}
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/generate" element={<Generate />} />
                <Route path="/generate/:Id" element={<Generate />} />
                <Route path="/my-generation" element={
                    <ProtectedRoute>
                        <MyGeneration />
                    </ProtectedRoute>
                } />
                <Route path="/preview" element={<YtPreview />} />
            </Routes>
            <Footer />
        </BrowserRouter>
    );
}

export default AppRoutes;
