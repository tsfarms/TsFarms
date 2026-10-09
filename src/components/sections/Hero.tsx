import { useEffect, useRef, type FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { heroImage } from '@/content/site';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface HeroProps {
  onNavigate: (target: string, options?: { filter?: string }) => void;
}

interface LeafParticle {
  id: number;
  left: string;
  top: string;
  size: number;
  duration: string;
  delay: string;
  opacity: number;
  speed: number;
  swayAmount: number;
}

const LEAVES: LeafParticle[] = [
  { id: 1, left: '8%', top: '15%', size: 28, duration: '7s', delay: '0s', opacity: 0.35, speed: 0.5, swayAmount: 6 },
  { id: 2, left: '62%', top: '22%', size: 22, duration: '9s', delay: '1.5s', opacity: 0.3, speed: 0.6, swayAmount: 8 },
  { id: 3, left: '85%', top: '45%', size: 18, duration: '8s', delay: '0.8s', opacity: 0.25, speed: 0.7, swayAmount: 5 },
  { id: 4, left: '20%', top: '60%', size: 24, duration: '10s', delay: '2s', opacity: 0.3, speed: 0.55, swayAmount: 7 },
  { id: 5, left: '72%', top: '68%', size: 20, duration: '7.5s', delay: '0.3s', opacity: 0.28, speed: 0.65, swayAmount: 9 },
  { id: 6, left: '45%', top: '35%', size: 16, duration: '11s', delay: '3s', opacity: 0.2, speed: 0.75, swayAmount: 4 },
  { id: 7, left: '92%', top: '75%', size: 26, duration: '8.5s', delay: '1.2s', opacity: 0.3, speed: 0.6, swayAmount: 6 },
  { id: 8, left: '5%', top: '80%', size: 18, duration: '9.5s', delay: '2.5s', opacity: 0.25, speed: 0.7, swayAmount: 8 },
];

const Hero: FC<HeroProps> = ({ onNavigate }) => {
  const reduced = usePrefersReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    let ticking = false;
    const updateScroll = () => {
      const el = heroRef.current;
      if (!el) {
        ticking = false;
        return;
      }
      const top = window.scrollY;
      if (top < window.innerHeight) {
        el.style.setProperty('--hero-scroll', `${top}px`);
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [reduced]);

  return (
    <Box
      id="hero"
      ref={heroRef}
      sx={{
        position: 'relative',
        height: { xs: 'auto', md: '100vh' },
        minHeight: { xs: '100svh', md: 700 },
        overflow: 'hidden',
        bgcolor: '#173B28',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      {/* === LAYER 1: Background orchard (slowest parallax) === */}
      <img
        src={heroImage}
        alt="Mango orchard at golden hour"
        width={1920}
        height={1080}
        decoding="async"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '130%',
          objectFit: 'cover',
          transform: reduced ? 'none' : 'translate3d(0, calc(var(--hero-scroll, 0px) * 0.1), 0) scale(1.06)',
          willChange: reduced ? 'auto' : 'transform',
          filter: 'brightness(0.72) saturate(1.1)',
        }}
      />

      {/* === LAYER 2: Atmospheric gradient wash === */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: [
            'linear-gradient(90deg, rgba(23,59,40,0.42) 0%, rgba(23,59,40,0.22) 48%, rgba(23,59,40,0.08) 100%)',
            'linear-gradient(180deg, rgba(23,59,40,0.38) 0%, rgba(23,59,40,0.26) 40%, rgba(23,59,40,0.48) 75%, rgba(23,59,40,0.7) 100%)',
          ].join(', '),
        }}
      />

      {/* === LAYER 3: Left-side branch silhouette === */}
      <Box
        component="svg"
        sx={{
          position: 'absolute',
          top: 0,
          left: { xs: '-15%', md: '-8%' },
          width: { xs: '55%', md: '40%' },
          height: '80%',
          opacity: 0.2,
          pointerEvents: 'none',
        }}
        viewBox="0 0 300 500"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <path d="M10 50 C40 80 60 130 70 200 C80 270 75 340 60 420 C55 450 50 470 45 490" stroke="#173B28" strokeWidth="3" fill="none" />
        <path d="M70 200 C50 190 30 185 10 180 M70 280 C90 270 110 265 130 260 M60 420 C40 410 20 405 5 400" stroke="#173B28" strokeWidth="2" fill="none" />
        <ellipse cx="10" cy="178" rx="16" ry="6" fill="#173B28" opacity="0.5" transform="rotate(-40 10 178)" />
        <ellipse cx="130" cy="258" rx="18" ry="7" fill="#173B28" opacity="0.5" transform="rotate(20 130 258)" />
        <ellipse cx="5" cy="398" rx="14" ry="5" fill="#173B28" opacity="0.4" transform="rotate(-50 5 398)" />
      </Box>

      {/* === LAYER 4: Right-side branch silhouette === */}
      <Box
        component="svg"
        sx={{
          position: 'absolute',
          top: 0,
          right: { xs: '-15%', md: '-8%' },
          width: { xs: '55%', md: '40%' },
          height: '80%',
          opacity: 0.2,
          pointerEvents: 'none',
        }}
        viewBox="0 0 300 500"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <path d="M290 40 C260 70 240 120 230 200 C220 280 225 360 240 440 C245 460 250 480 255 495" stroke="#173B28" strokeWidth="3" fill="none" />
        <path d="M230 200 C250 190 270 185 290 180 M225 300 C205 290 185 285 165 280 M240 440 C260 430 280 425 295 420" stroke="#173B28" strokeWidth="2" fill="none" />
        <ellipse cx="290" cy="178" rx="16" ry="6" fill="#173B28" opacity="0.5" transform="rotate(40 290 178)" />
        <ellipse cx="165" cy="278" rx="18" ry="7" fill="#173B28" opacity="0.5" transform="rotate(-20 165 278)" />
        <ellipse cx="295" cy="418" rx="14" ry="5" fill="#173B28" opacity="0.4" transform="rotate(50 295 418)" />
      </Box>

      {/* === LAYER 5: Foreground leaf silhouettes (bottom) === */}
      <Box
        component="svg"
        sx={{
          position: 'absolute',
          bottom: -20,
          left: 0,
          width: '100%',
          height: '35%',
          opacity: 0.3,
          pointerEvents: 'none',
        }}
        viewBox="0 0 1200 200"
        fill="none"
        preserveAspectRatio="xMidYMax slice"
      >
        <path d="M0 200 L0 140 C80 120 150 100 200 80 C260 55 320 40 400 30 C500 18 600 12 700 10 C800 8 900 12 1000 20 C1080 27 1140 35 1200 40 L1200 200 Z" fill="#173B28" opacity="0.4" />
        <path d="M0 200 L0 160 C100 145 200 130 300 120 C400 110 500 105 600 103 C700 101 800 105 900 110 C1000 115 1100 122 1200 128 L1200 200 Z" fill="#173B28" opacity="0.3" />
      </Box>

      {/* === LAYER 6: Rustling leaf particles (fastest parallax) === */}
      {!reduced &&
        LEAVES.map((leaf) => (
          <Box
            key={leaf.id}
            sx={{
              position: 'absolute',
              left: leaf.left,
              top: leaf.top,
              width: leaf.size,
              height: leaf.size,
              opacity: leaf.opacity,
              pointerEvents: 'none',
            }}
          >
            <Box
              component="svg"
              sx={{
                width: '100%',
                height: '100%',
                animation: `leafRustle-${leaf.id} ${leaf.duration} ease-in-out infinite`,
                animationDelay: leaf.delay,
              }}
              viewBox="0 0 32 32"
              fill="none"
            >
              <path
                d="M16 2 C10 6 6 14 4 24 C3 28 6 30 12 30 C10 22 12 14 18 8 C22 4 26 3 28 2 C22 0 18 0 16 2Z"
                fill="#788267"
              />
              <path d="M14 28 C14 20 16 12 22 6" stroke="#5B3A24" strokeWidth="0.5" opacity="0.3" fill="none" />
            </Box>
          </Box>
        ))}

      {/* === LAYER 7: Golden light particles === */}
      {!reduced && (
        <>
          <Box
            sx={{
              position: 'absolute',
              top: '30%',
              left: '50%',
              width: 3,
              height: 3,
              borderRadius: '50%',
              bgcolor: '#D99419',
              opacity: 0.4,
              animation: 'lightDrift 12s ease-in-out infinite',
              pointerEvents: 'none',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '30%',
              width: 2,
              height: 2,
              borderRadius: '50%',
              bgcolor: '#D99419',
              opacity: 0.3,
              animation: 'lightDrift 14s ease-in-out infinite',
              animationDelay: '3s',
              pointerEvents: 'none',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: '65%',
              left: '70%',
              width: 4,
              height: 4,
              borderRadius: '50%',
              bgcolor: '#D99419',
              opacity: 0.25,
              animation: 'lightDrift 16s ease-in-out infinite',
              animationDelay: '6s',
              pointerEvents: 'none',
            }}
          />
        </>
      )}

      {/* === CONTENT === */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 10,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          maxWidth: 1400,
          mx: 'auto',
          width: '100%',
          px: { xs: 3, sm: 4, md: 6, lg: 8 },
          pt: { xs: 11, sm: 10, md: 0 },
          pb: { xs: 8, sm: 6, md: 0 },
        }}
      >
        <Typography
          sx={{
            display: 'inline-block',
            width: 'fit-content',
            color: '#FFFDF8',
            bgcolor: 'rgba(23, 59, 40, 0.15)',
            fontFamily: '"Manrope", sans-serif',
            fontWeight: 700,
            fontSize: { xs: '0.72rem', md: '0.85rem' },
            textTransform: 'uppercase',
            letterSpacing: '0.18em',
            mb: { xs: 1.5, md: 2.5 },
            px: { xs: 1.2, md: 1.6 },
            py: { xs: 0.55, md: 0.7 },
            borderRadius: 1,
            textShadow: '0 1px 8px rgba(0, 0, 0, 0.45)',
          }}
        >
          Natural • Fresh • Farm Direct
        </Typography>
        <Typography
          variant="h1"
          sx={{
            color: '#FFFDF8',
            fontSize: { xs: '2.3rem', sm: '3.4rem', md: '4.8rem', lg: '5.4rem' },
            maxWidth: { xs: '100%', md: '75%', lg: '65%' },
            lineHeight: { xs: 1.08, md: 1.04 },
            fontWeight: 600,
            letterSpacing: '-0.02em',
            mb: { xs: 2, md: 3 },
          }}
        >
          Pure Goodness<br />From Our Farm
        </Typography>
        <Typography
          sx={{
            color: '#FFFDF8',
            opacity: 0.9,
            fontSize: { xs: '0.92rem', sm: '1.05rem', md: '1.2rem' },
            maxWidth: { xs: '100%', md: '60%', lg: '52%' },
            lineHeight: { xs: 1.55, md: 1.65 },
            mb: { xs: 3.5, md: 4.5 },
            fontFamily: '"Manrope", sans-serif',
            fontWeight: 400,
          }}
        >
          Premium mangoes, natural honey and fresh jackfruit delivered from our farm to your home.
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 1.5, sm: 2 },
            width: { xs: '100%', sm: 'auto' },
            maxWidth: { xs: 360, sm: 'none' },
          }}
        >
          <Button
            variant="contained"
            onClick={() => onNavigate('order')}
            sx={{
              bgcolor: '#FFFDF8',
              color: '#173B28',
              px: { xs: 3, sm: 4 },
              py: 1.5,
              minHeight: 44,
              borderRadius: 1.5,
              fontSize: '0.85rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              boxShadow: 'none',
              filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.18))',
              '&:hover': { bgcolor: '#F6F1E7', transform: 'translateY(-1px)' },
              transition: 'all 250ms ease',
            }}
          >
            Order now
          </Button>
          <Button
            variant="outlined"
            onClick={() => onNavigate('/our-farm')}
            sx={{
              color: '#FFFDF8',
              borderColor: 'rgba(255,253,248,0.4)',
              px: { xs: 3, sm: 4 },
              py: 1.5,
              minHeight: 44,
              borderRadius: 1.5,
              fontSize: '0.85rem',
              fontWeight: 600,
              letterSpacing: '0.04em',
              '&:hover': {
                borderColor: '#FFFDF8',
                bgcolor: 'rgba(255,253,248,0.06)',
              },
              transition: 'all 250ms ease',
            }}
          >
            Our Farm Story
          </Button>
        </Box>
      </Box>
      <style>{`
        @keyframes lightDrift {
          0%, 100% { transform: translate(0, 0); opacity: 0.2; }
          50% { transform: translate(20px, -15px); opacity: 0.5; }
        }
        @keyframes leafRustle-1 { 0%, 100% { transform: rotate(-6deg) translateY(0); } 50% { transform: rotate(3deg) translateY(-6px); } }
        @keyframes leafRustle-2 { 0%, 100% { transform: rotate(-8deg) translateY(0); } 50% { transform: rotate(4deg) translateY(-8px); } }
        @keyframes leafRustle-3 { 0%, 100% { transform: rotate(-5deg) translateY(0); } 50% { transform: rotate(2.5deg) translateY(-5px); } }
        @keyframes leafRustle-4 { 0%, 100% { transform: rotate(-7deg) translateY(0); } 50% { transform: rotate(3.5deg) translateY(-7px); } }
        @keyframes leafRustle-5 { 0%, 100% { transform: rotate(-9deg) translateY(0); } 50% { transform: rotate(4.5deg) translateY(-9px); } }
        @keyframes leafRustle-6 { 0%, 100% { transform: rotate(-4deg) translateY(0); } 50% { transform: rotate(2deg) translateY(-4px); } }
        @keyframes leafRustle-7 { 0%, 100% { transform: rotate(-6deg) translateY(0); } 50% { transform: rotate(3deg) translateY(-6px); } }
        @keyframes leafRustle-8 { 0%, 100% { transform: rotate(-8deg) translateY(0); } 50% { transform: rotate(4deg) translateY(-8px); } }
      `}</style>
    </Box>
  );
};

export default Hero;
