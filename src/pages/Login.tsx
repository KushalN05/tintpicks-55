import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const Login = () => {
  const navigate = useNavigate();
  const [authLoading, setAuthLoading] = useState(false);
  const [authPhase, setAuthPhase] = useState<'signin' | 'signup' | null>(null);
  const [authMessage, setAuthMessage] = useState<string>('');
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    document.title = 'Sign in | TintPicks';

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setAuthPhase('signin');
        setAuthMessage('Preparing your experience...');
        setAuthLoading(true);
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setAuthLoading(false);
        navigate('/app');
      } else if (event === 'SIGNED_OUT') {
        navigate('/login');
      }
    });

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        navigate('/app');
      }
    };

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) {
      console.error('OAuth error:', error.message);
      setGoogleLoading(false);
    }
  };

  // Loading screen during auth processing
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="flex flex-col items-center text-center gap-6">
          <div className="w-12 h-12 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground mb-2">
              {authPhase === 'signup' ? 'Creating your account' : 'Welcome back'}
            </h1>
            <p className="text-sm text-muted-foreground max-w-sm">
              {authMessage || (authPhase === 'signup'
                ? 'Setting up your profile...'
                : 'Loading your preferences...')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Main login screen
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      {/* Login Card */}
      <div className="w-full max-w-md text-center">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-12 h-12 bg-foreground rounded-md flex items-center justify-center">
            <span className="text-background font-bold text-2xl">T</span>
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tighter text-foreground mb-3">
          Welcome to TintPicks
        </h1>
        <p className="text-muted-foreground mb-10 max-w-xs mx-auto leading-relaxed text-sm">
          A precision styling tool for building cohesive, color-matched outfits.
        </p>

        {/* Google Sign-In Button */}
        <button
          id="google-sign-in"
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
          className="group relative w-full flex items-center justify-center gap-3 rounded-md px-6 py-3.5
                     bg-card border border-border shadow-sm
                     hover:shadow-md hover:border-foreground/20
                     active:scale-[0.98]
                     transition-all duration-200 ease-out
                     disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {/* Google "G" icon */}
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>

          <span className="text-sm font-medium text-foreground">
            {googleLoading ? 'Redirecting…' : 'Sign in with Google'}
          </span>
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-8">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground uppercase tracking-widest font-medium">secure login</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Trust signals */}
        <p className="text-xs text-muted-foreground leading-relaxed">
          We use Google's secure authentication.
          <br />
          No passwords to remember — ever.
        </p>
      </div>
    </div>
  );
};

export default Login;