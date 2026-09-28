import { useEffect, useState, type FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface PreloaderProps {
  onComplete: () => void;
}

const LEAVES = [
  { left: '8%', delay: '0s', duration: '7s', size: 54, rotate: -20 },
  { left: '22%', delay: '1.1s', duration: '8.5s', size: 36, rotate: 12 },
  { left: '70%', delay: '0.4s', duration: '7.6s', size: 48, rotate: 18 },
  { left: '84%', delay: '1.8s', duration: '9s', size: 32, rotate: -8 },
  { left: '48%', delay: '0.8s', duration: '8s', size: 28, rotate: 24 },
];

const WORD = 'MANGO FARMING'.split('');

const Preloader: FC<PreloaderProps> = ({ onComplete }) => {
  const reduced = usePrefersReducedMotion();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (reduced) {
      onComplete();
      return;
    }
    const timers = [
      setTimeout(() => setPhase(1), 200),
      setTimeout(() => setPhase(2), 700),
      setTimeout(() => setPhase(3), 1200),
      setTimeout(() => setPhase(4), 1700),
      setTimeout(() => {
        setPhase(5);
        onComplete();
      }, 3400),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete, reduced]);

  if (reduced) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        overflow: 'hidden',
        bgcolor: '#10281b',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: phase >= 5 ? 0 : 1,
        transform: phase >= 5 ? 'scale(1.04)' : 'scale(1)',
        transition: 'opacity 700ms ease, transform 700ms ease',
        pointerEvents: phase >= 5 ? 'none' : 'auto',
        '@keyframes leafFall': {
          '0%': { transform: 'translate3d(0, -18vh, 0) rotate(0deg)', opacity: 0 },
          '12%': { opacity: 0.85 },
          '100%': { transform: 'translate3d(46px, 115vh, 0) rotate(240deg)', opacity: 0 },
        },
        '@keyframes glowPulse': {
          '0%, 100%': { opacity: 0.35, transform: 'scale(0.9)' },
          '50%': { opacity: 0.85, transform: 'scale(1.12)' },
        },
        '@keyframes mangoSwing': {
          '0%, 100%': { transform: 'rotate(-8deg) translateY(0)' },
          '50%': { transform: 'rotate(8deg) translateY(6px)' },
        },
        '@keyframes ringSpin': {
          to: { transform: 'rotate(360deg)' },
        },
        '@keyframes letterRise': {
          from: { opacity: 0, transform: 'translateY(16px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        '@keyframes lineGrow': {
          from: { transform: 'scaleX(0)' },
          to: { transform: 'scaleX(1)' },
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          width: { xs: 280, md: 420 },
          height: { xs: 280, md: 420 },
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(217,148,25,0.45) 0%, rgba(23,59,40,0) 68%)',
          animation: 'glowPulse 2.8s ease-in-out infinite',
          opacity: phase >= 1 ? 1 : 0,
        }}
      />

      {LEAVES.map((leaf) => (
        <Box
          key={leaf.left}
          component="svg"
          viewBox="0 0 64 64"
          aria-hidden
          sx={{
            position: 'absolute',
            top: 0,
            left: leaf.left,
            width: leaf.size,
            height: leaf.size,
            animation: `leafFall ${leaf.duration} linear ${leaf.delay} infinite`,
            transformOrigin: 'center',
          }}
        >
          <path
            d="M32 4 C20 8 10 20 8 36 C6 48 14 58 26 60 C24 44 28 28 38 18 C44 12 48 10 52 8 C44 4 38 2 32 4 Z"
            fill="#D99419"
            opacity="0.85"
            transform={`rotate(${leaf.rotate} 32 32)`}
          />
        </Box>
      ))}

      <Box
        sx={{
          position: 'relative',
          width: 92,
          height: 92,
          mb: 2,
          opacity: phase >= 1 ? 1 : 0,
          transition: 'opacity 500ms ease',
        }}
      >
        <Box
          component="svg"
          viewBox="0 0 92 92"
          sx={{
            position: 'absolute',
            inset: 0,
            animation: 'ringSpin 8s linear infinite',
          }}
        >
          <circle cx="46" cy="46" r="40" fill="none" stroke="rgba(255,253,248,0.15)" strokeWidth="1.5" />
          <circle
            cx="46"
            cy="46"
            r="40"
            fill="none"
            stroke="#D99419"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="70 180"
          />
        </Box>
        <Box
          component="img"
          src="/logo.jpg"
          alt="TS Farming"
          width={64}
          height={64}
          sx={{
            position: 'absolute',
            inset: 14,
            width: 64,
            height: 64,
            borderRadius: '50%',
            objectFit: 'cover',
            animation: phase >= 1 ? 'mangoSwing 2.4s ease-in-out infinite' : 'none',
            transformOrigin: '50% 12%',
          }}
        />
      </Box>

      <Typography
        sx={{
          fontFamily: '"Cormorant Garamond", serif',
          fontSize: { xs: '3.6rem', md: '5.2rem' },
          fontWeight: 600,
          color: '#FFFDF8',
          letterSpacing: '0.08em',
          lineHeight: 1,
          opacity: phase >= 2 ? 1 : 0,
          filter: phase >= 2 ? 'blur(0px)' : 'blur(10px)',
          transform: phase >= 2 ? 'scale(1)' : 'scale(0.86)',
          transition: 'opacity 700ms ease, filter 700ms ease, transform 800ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        TS
      </Typography>

      <Box sx={{ display: 'flex', gap: '0.28em', mt: 1.75, minHeight: 18 }} aria-hidden={phase < 3}>
        {WORD.map((char, index) => (
          <Typography
            key={`${char}-${index}`}
            component="span"
            sx={{
              fontFamily: '"Manrope", sans-serif',
              fontSize: { xs: '0.68rem', md: '0.82rem' },
              letterSpacing: '0.22em',
              color: '#D99419',
              fontWeight: 600,
              opacity: phase >= 3 ? 1 : 0,
              animation: phase >= 3 ? `letterRise 500ms ease ${index * 35}ms both` : 'none',
              width: char === ' ' ? '0.4em' : 'auto',
            }}
          >
            {char === ' ' ? '' : char}
          </Typography>
        ))}
      </Box>

      <Box
        sx={{
          mt: 3,
          height: 2,
          width: 140,
          borderRadius: 1,
          bgcolor: 'rgba(255,253,248,0.12)',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            height: '100%',
            width: '100%',
            bgcolor: '#D99419',
            transformOrigin: 'left center',
            transform: phase >= 4 ? 'scaleX(1)' : 'scaleX(0)',
            animation: phase >= 4 && phase < 5 ? 'lineGrow 1.4s ease forwards' : 'none',
          }}
        />
      </Box>
    </Box>
  );
};

export default Preloader;
