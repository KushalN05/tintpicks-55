import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { SessionContextProvider, useSessionContext } from '@supabase/auth-helpers-react';
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import Login from "./pages/Login";
import React from "react";
import BlobMascot from "@/components/BlobMascot";
import ErrorBoundary from "@/components/ErrorBoundary";

const OnboardingLazy = React.lazy(() => import("./pages/Onboarding"));

const queryClient = new QueryClient();

/**
 * Auth guard: renders children only if a Supabase session exists.
 * Otherwise redirects to /login.
 */
const RequireAuth = () => {
  const { session, isLoading } = useSessionContext();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ghibli-gradient flex flex-col items-center justify-center">
        <div className="w-32 h-32 relative animate-float mb-6">
          <div className="absolute inset-0 bg-white/60 rounded-full blur-xl -z-0" />
          <BlobMascot size="lg" mood="happy" className="relative z-10" />
        </div>
        <div className="brand-glow animate-pulse-glow w-16 h-2 bg-ghibli-blue/50 rounded-full" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

/**
 * Redirect guard: if user is already signed in, bounce them away from /login.
 */
const RedirectIfAuthed = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading } = useSessionContext();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ghibli-gradient flex flex-col items-center justify-center">
        <div className="w-32 h-32 relative animate-float mb-6">
          <div className="absolute inset-0 bg-white/60 rounded-full blur-xl -z-0" />
          <BlobMascot size="lg" mood="happy" className="relative z-10" />
        </div>
        <div className="brand-glow animate-pulse-glow w-16 h-2 bg-ghibli-blue/50 rounded-full" />
      </div>
    );
  }

  // If logged in already, Login.tsx's own checkSession will handle routing
  // to / or /onboarding, so we let it render.
  return <>{children}</>;
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public route */}
              <Route
                path="/login"
                element={
                  <RedirectIfAuthed>
                    <Login />
                  </RedirectIfAuthed>
                }
              />

              {/* Protected routes */}
              <Route element={<RequireAuth />}>
                <Route
                  path="/onboarding"
                  element={
                    <React.Suspense fallback={null}>
                      <OnboardingLazy />
                    </React.Suspense>
                  }
                />
                <Route path="/" element={<Index />} />
              </Route>

              {/* Catch-all → login */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </SessionContextProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;