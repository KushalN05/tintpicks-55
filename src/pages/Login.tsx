import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { motion, type Variants } from 'framer-motion';

// Google SVG Icon
const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...props}>
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

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
        navigate('/');
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

      setGoogleLoading(false);
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
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

  return (
    <div className="flex min-h-screen w-full flex-col bg-background font-sans text-foreground antialiased lg:flex-row">
      
      {/* Left Image Panel */}
      <div className="relative hidden w-full flex-col p-4 lg:flex lg:min-h-screen lg:w-1/2">
        <div className="relative h-full w-full overflow-hidden rounded-[24px] bg-card shadow-xl">
          <img
            src="/login-mockup.png"
            alt="TintPicks App Preview"
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Logo overlay */}
          <div className="absolute top-8 left-8 flex items-center gap-2">
            <div className="w-10 h-10 rounded-md flex items-center justify-center overflow-hidden bg-background/80 backdrop-blur-sm shadow-lg">
              <img src="/favicon.png" alt="TintPicks" className="w-full h-full object-cover" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white drop-shadow-lg">TintPicks</span>
          </div>
          {/* Bottom tagline overlay */}
          <div className="absolute bottom-8 left-8 right-8">
            <div className="bg-background/80 backdrop-blur-md rounded-2xl p-6 border border-border/50">
              <p className="text-foreground font-semibold text-lg tracking-tight mb-1">See a color. Wear the fit.</p>
              <p className="text-muted-foreground text-sm">Capture. Style. Shop. All in one seamless workflow.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex w-full flex-col items-center justify-center p-6 sm:p-12 lg:w-1/2">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-[400px]"
        >
          {/* Title */}
          <motion.div variants={itemVariants} className="mb-10">
            <h1 className="mb-4 text-[48px] font-semibold leading-[1.05] tracking-tight text-foreground">
              Welcome
              <br />
              back
            </h1>
            <p className="text-[15px] text-muted-foreground text-balance">
              Sign in to access your wardrobe and continue styling.
            </p>
          </motion.div>

          {/* Google Sign-In Button (primary action) */}
          <motion.div variants={itemVariants}>
            <button
              id="google-sign-in"
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="flex w-full items-center justify-center gap-2.5 rounded-md border border-border bg-card py-3.5 text-[14px] font-medium text-foreground transition-all active:scale-[0.98] hover:bg-card/80 hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <GoogleIcon className="w-[18px] h-[18px]" />
              {googleLoading ? 'Redirecting…' : 'Sign in with Google'}
            </button>
          </motion.div>

          {/* Divider */}
          <motion.div variants={itemVariants} className="flex items-center gap-3 my-8">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground uppercase tracking-widest font-medium">secure login</span>
            <div className="flex-1 h-px bg-border" />
          </motion.div>

          {/* Trust signals */}
          <motion.div variants={itemVariants} className="text-center text-[14px] text-muted-foreground">
            <p className="leading-relaxed">
              We use Google's secure authentication.
              <br />
              No passwords to remember — ever.
            </p>
          </motion.div>

          {/* Footer */}
          <motion.div variants={itemVariants} className="mt-10 text-center text-[14px] text-muted-foreground">
            New to TintPicks?{" "}
            <button 
              onClick={handleGoogleSignIn}
              className="font-semibold text-foreground underline decoration-foreground underline-offset-4 transition-colors hover:text-foreground/80"
            >
              Sign up
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;