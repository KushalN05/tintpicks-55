import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { SessionContextProvider, useSessionContext } from '@supabase/auth-helpers-react';
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import React from "react";
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
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-foreground border-t-transparent rounded-full animate-spin" />
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
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-foreground border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (session) {
    return <Navigate to="/app" replace />;
  }

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
                path="/"
                element={
                  <RedirectIfAuthed>
                    <LandingPage />
                  </RedirectIfAuthed>
                }
              />
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
                <Route path="/app" element={<Index />} />
              </Route>

              {/* Catch-all → root */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </SessionContextProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;