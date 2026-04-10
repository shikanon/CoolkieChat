import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { Suspense, lazy } from "react";
import Home from "@/pages/Home";
import Chat from "@/pages/Chat";

// Lazy load Birthday components
const BirthdayGlobalLayout = lazy(() => import("@/pages/Birthday/BirthdayGlobalLayout"));
const BirthdayLayout = lazy(() => import("@/pages/Birthday/BirthdayLayout"));
const BirthdayHome = lazy(() => import("@/pages/Birthday/pages/BirthdayHome"));
const AlbumPage = lazy(() => import("@/pages/Birthday/pages/AlbumPage"));
const BlessingsPage = lazy(() => import("@/pages/Birthday/pages/BlessingsPage"));
const WelcomePage = lazy(() => import("@/pages/Birthday/pages/WelcomePage"));
const MosaicPage = lazy(() => import("@/pages/Birthday/pages/MosaicPage"));

// Simple loading fallback
const LoadingFallback = () => (
  <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center">
    <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin mb-4"></div>
    <p className="text-pink-600 font-bold animate-pulse tracking-widest">琦琦公主的惊喜正在路上...</p>
  </div>
);

export default function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          
          {/* Birthday Routes */}
          <Route path="/birthday" element={<BirthdayGlobalLayout />}>
            <Route index element={<WelcomePage />} />
            <Route path="mosaic" element={<MosaicPage />} />
            <Route element={<BirthdayLayout />}>
              <Route path="home" element={<BirthdayHome />} />
              <Route path="album" element={<AlbumPage />} />
              <Route path="blessings" element={<BlessingsPage />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}
