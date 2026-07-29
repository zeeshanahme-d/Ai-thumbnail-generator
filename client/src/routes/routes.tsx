import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import DashboardLayout from '../pages/layouts/DashboardLayout';
import ProtectedRoute from './protected-routes';
import GuestRoute from './guest-route';
import HomePage from '../pages/home/HomePage';
import Generate from '../pages/generate/Generate';
import MyGeneration from '../pages/my-generation/MyGeneration';
import YtPreview from '../pages/yt-preview/YtPreview';
import Community from '../pages/community/Community';
import Login from '../pages/auth/Login';
import Signup from '../pages/auth/Signup';
import ForgotPassword from '../pages/auth/ForgotPassword';
import VerifyOtp from '../pages/auth/VerifyOtp';
import ResetPassword from '../pages/auth/ResetPassword';
import DashboardGenerate from '../pages/dashboard/generate/DashboardGenerate';
import Recreate from '../pages/dashboard/recreate/Recreate';
import Profile from '../pages/dashboard/profile/Profile';
import Settings from '../pages/dashboard/settings/Settings';
import RecycleBin from '../pages/dashboard/recycle-bin/RecycleBin';
import PublicProfile from '../pages/profile/Profile';
import MainLayout from '../pages/layouts/MainLayout';
function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Auth screens — signed-in users are redirected away */}
                <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
                <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />
                <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />
                <Route path="/verify-otp" element={<GuestRoute><VerifyOtp /></GuestRoute>} />
                <Route path="/reset-password" element={<GuestRoute><ResetPassword /></GuestRoute>} />

                {/* Dashboard (sidebar) — requires login */}
                <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                    <Route index element={<Navigate to="/dashboard/generate" replace />} />
                    <Route path="generate" element={<DashboardGenerate />} />
                    <Route path="recreate" element={<Recreate />} />
                    <Route path="community" element={<Community />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="recycle-bin" element={<RecycleBin />} />
                </Route>

                {/* Marketing site (navbar + footer) */}
                <Route element={<MainLayout />}>
                    {/* Public */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/community" element={<Community />} />
                    <Route path="/generate" element={<Generate />} />
                    <Route path="/generate/:Id" element={<Generate />} />
                    <Route path="/preview" element={<YtPreview />} />
                    <Route path="/profile" element={<PublicProfile />} />

                    {/* Requires login */}
                    <Route path="/my-generation" element={<ProtectedRoute> <MyGeneration /></ProtectedRoute>}
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;
