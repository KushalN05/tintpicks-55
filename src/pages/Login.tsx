import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Cloud, Wind } from 'lucide-react';
import BlobMascot from '@/components/BlobMascot';

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
        navigate('/');
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
        navigate('/');
      }
    };

    checkSession();

    // Floating clouds effect
    const createCloud = () => {
      const cloud = document.createElement('div');
      cloud.classList.add('ghibli-cloud');
      const size = Math.random() * 100 + 50;
      cloud.style.width = `${size}px`;
      cloud.style.height = `${size / 2}px`;
      const posX = Math.random() * window.innerWidth;
      const posY = Math.random() * (window.innerHeight / 2);
      cloud.style.left = `${posX}px`;
      cloud.style.top = `${posY}px`;
      document.querySelector('.clouds-container')?.appendChild(cloud);
      setTimeout(() => {
        cloud.style.left = `${posX + 300}px`;
        cloud.style.opacity = '0';
        setTimeout(() => cloud.remove(), 20000);
      }, 100);
    };

    const cloudInterval = setInterval(createCloud, 5000);
    for (let i = 0; i < 5; i++) createCloud();

    return () => {
      subscription.unsubscribe();
      clearInterval(cloudInterval);
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
      <div className="min-h-screen bg-ghibli-gradient relative overflow-hidden flex items-center justify-center px-4">
        <div className="clouds-container absolute inset-0 pointer-events-none overflow-hidden" />
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(122, 160, 196, 0.2) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(122, 160, 196, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
        <div className="flex flex-col items-center text-center">
          <div className="w-32 h-32 mb-6 relative animate-float">
            <div className="flex justify-center">
              <BlobMascot size="lg" mood={authPhase === 'signup' ? 'excited' : 'happy'} className="relative z-10" />
            </div>
            <div className="absolute inset-0 bg-white/60 rounded-full blur-xl -z-0" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-ghibli-forest mb-3 font-ghibli">
            {authPhase === 'signup' ? 'Creating your account' : 'Welcome back'}
          </h1>
          <p className="text-lg text-ghibli-forest/80 max-w-xl">
            {authMessage || (authPhase === 'signup'
              ? 'Setting up your personalized color journey...'
              : 'Loading your palettes and preferences...')}
          </p>
        </div>
      </div>
    );
  }

  // Main login screen — centered, single-screen
  return (
    <div className="min-h-screen bg-ghibli-gradient relative overflow-hidden flex items-center justify-center px-4">
      {/* Clouds Container */}
      <div className="clouds-container absolute inset-0 pointer-events-none overflow-hidden" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(122, 160, 196, 0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(122, 160, 196, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 text-ghibli-blue/30 animate-float">
        <Cloud size={80} />
      </div>
      <div
        className="absolute bottom-20 right-10 w-20 h-20 text-ghibli-pink/30 animate-float"
        style={{ animationDelay: '2s' }}
      >
        <Cloud size={60} />
      </div>
      <div className="absolute top-40 right-20 w-16 h-16 text-ghibli-purple/30 animate-sway">
        <Wind size={60} />
      </div>
      <div
        className="absolute bottom-40 left-20 w-12 h-12 text-ghibli-orange/20 animate-float"
        style={{ animationDelay: '4s' }}
      >
        <Cloud size={48} />
      </div>

      {/* ───── Login Card ───── */}
      <div
        className="ghibli-card relative w-full max-w-md p-8 sm:p-10 text-center animate-scale-in"
        style={{ transform: 'rotate(-1deg)' }}
      >
        {/* Shimmer accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-xl bg-ghibli-sunset shimmer-effect overflow-hidden" />

        {/* Mascot */}
        <div className="flex justify-center mb-2">
          <div className="relative animate-float">
            <BlobMascot size="lg" mood="happy" className="relative z-10" />
            <div className="absolute inset-0 bg-white/60 rounded-full blur-xl -z-0" />
          </div>
        </div>

        {/* Greeting pill */}
        <div className="inline-flex items-center gap-1.5 bg-white/60 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-medium text-ghibli-forest border border-ghibli-blue/30 shadow-sm mb-5">
          <span className="animate-wiggle inline-block">👋</span> Meet Tinti!
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl font-bold text-ghibli-forest mb-3 font-ghibli leading-tight">
          Welcome to TintPicks
        </h1>
        <p className="text-ghibli-forest/70 mb-8 max-w-xs mx-auto leading-relaxed">
          Discover complementary colors that make your wardrobe pop. Sign in to get started.
        </p>

        {/* ── Google Sign-In Button ── */}
        <button
          id="google-sign-in"
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
          className="group relative w-full flex items-center justify-center gap-3 rounded-full px-6 py-3.5
                     bg-white border border-ghibli-blue/20 shadow-md
                     hover:shadow-lg hover:border-ghibli-blue/40 hover:scale-[1.02]
                     active:scale-[0.98]
                     transition-all duration-300 ease-out
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

          <span className="text-[15px] font-medium text-gray-700 group-hover:text-ghibli-forest transition-colors">
            {googleLoading ? 'Redirecting…' : 'Sign in with Google'}
          </span>

          {/* Subtle glow on hover */}
          <div className="absolute inset-0 rounded-full bg-ghibli-blue/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-ghibli-blue/15" />
          <span className="text-xs text-ghibli-forest/40 uppercase tracking-wider font-medium">secure login</span>
          <div className="flex-1 h-px bg-ghibli-blue/15" />
        </div>

        {/* Trust signals */}
        <p className="text-xs text-ghibli-forest/50 leading-relaxed">
          We use Google's secure authentication.
          <br />
          No passwords to remember — ever.
        </p>
      </div>
    </div>
  );
};

export default Login;