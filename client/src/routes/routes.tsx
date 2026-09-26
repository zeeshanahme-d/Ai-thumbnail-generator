import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './protected-routes';
import GuestRoute from './guest-route';
import HomePage from '../pages/home/HomePage';
import MainLayout from '../pages/layouts/MainLayout';
import ErrorBoundary from '../components/ErrorBoundary';
import PageLoader from '../components/PageLoader';

// The homepage loads up front; every other page downloads the first time it is visited.
const DashboardLayout = lazy(() => import('../pages/layouts/DashboardLayout'));
const YtPreview = lazy(() => import('../pages/yt-preview/YtPreview'));
const Community = lazy(() => import('../pages/community/Community'));
const Login = lazy(() => import('../pages/auth/Login'));
const Signup = lazy(() => import('../pages/auth/Signup'));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'));
const VerifyOtp = lazy(() => import('../pages/auth/VerifyOtp'));
const ResetPassword = lazy(() => import('../pages/auth/ResetPassword'));
const DashboardGenerate = lazy(() => import('../pages/dashboard/generate/DashboardGenerate'));
const Recreate = lazy(() => import('../pages/dashboard/recreate/Recreate'));
const Settings = lazy(() => import('../pages/dashboard/settings/Settings'));
const RecycleBin = lazy(() => import('../pages/dashboard/recycle-bin/RecycleBin'));
const PublicProfile = lazy(() => import('../pages/profile/Profile'));
const MyGallery = lazy(() => import('../pages/dashboard/gallery/MyGallery'));
const ThumbnailPreview = lazy(() => import('../pages/thumbnail-preview/ThumbnailPreview'));
const NotFound = lazy(() => import('../pages/not-found/NotFound'));

function AppRoutes() {
    return (
        <BrowserRouter>
            <ErrorBoundary>
                <Suspense fallback={<PageLoader fullScreen />}>
                    <Routes>
                        {/* Auth screens — signed-in users are redirected away */}
                        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
                        <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />
                        <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />
                        <Route path="/verify-otp" element={<GuestRoute><VerifyOtp /></GuestRoute>} />
                        <Route path="/reset-password" element={<GuestRoute><ResetPassword /></GuestRoute>} />
                        {/* Email verification works signed in or out */}
                        <Route path="/verify-email" element={<VerifyOtp mode="verify-email" />} />

                        {/* Full-screen YouTube mockup, without the site navbar */}
                        <Route path="/youtube-style-preview" element={<YtPreview />} />

                        {/* Dashboard (sidebar) — requires login */}
                        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                            <Route index element={<Navigate to="/dashboard/generate" replace />} />
                            <Route path="generate" element={<DashboardGenerate />} />
                            <Route path="recreate" element={<Recreate />} />
                            <Route path="community" element={<Community />} />
                            <Route path="gallery" element={<MyGallery />} />
                            <Route path="settings" element={<Settings />} />
                            <Route path="recycle-bin" element={<RecycleBin />} />
                        </Route>

                        {/* Marketing site (navbar + footer) */}
                        <Route element={<MainLayout />}>
                            {/* Public */}
                            <Route path="/" element={<HomePage />} />
                            <Route path="/community" element={<Community />} />
                            <Route path="/profile/:username" element={<PublicProfile />} />
                            <Route path="/profile" element={<PublicProfile />} />
                            {/* Thumbnail preview — public, shareable */}
                            <Route path="/thumbnail/:id" element={<ThumbnailPreview />} />

                            {/* Catch-all 404 Route */}
                            <Route path="*" element={<NotFound />} />
                        </Route>
                    </Routes>
                </Suspense>
            </ErrorBoundary>
        </BrowserRouter>
    );
}

export default AppRoutes;

