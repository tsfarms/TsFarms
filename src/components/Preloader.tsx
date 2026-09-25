import { useEffect, useState, type FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface PreloaderProps {
  onComplete: () => void;
}

const Preloader: FC<PreloaderProps> = ({ onComplete }) => {
  const reduced = usePrefersReducedMotion();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (reduced) {
      onComplete();
      return;
    }
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setPhase(1), 300));
    timers.push(setTimeout(() => setPhase(2), 700));
    timers.push(setTimeout(() => setPhase(3), 1100));
    timers.push(setTimeout(() => setPhase(4), 1500));
    timers.push(setTimeout(() => {
      setPhase(5);
      onComplete();
    }, 2000));
    return () => timers.forEach(clearTimeout);
  }, [onComplete, reduced]);

  if (reduced) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        bgcolor: '#F6F1E7',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: phase >= 5 ? 0 : 1,
        transition: 'opacity 600ms ease',
        pointerEvents: phase >= 5 ? 'none' : 'auto',
      }}
    >
      {/* Drifting leaf */}
      <Box
        component="svg"
        sx={{
          position: 'absolute',
          width: { xs: 60, md: 80 },
          height: { xs: 60, md: 80 },
          top: { xs: '30%', md: '25%' },
          left: { xs: '15%', md: '20%' },
          opacity: phase >= 1 ? 0.35 : 0,
          transform: phase >= 1 ? 'translate(0, 0) rotate(15deg)' : 'translate(-60px, 20px) rotate(0deg)',
          transition: 'opacity 800ms ease, transform 1200ms ease-out',
        }}
        viewBox="0 0 64 64"
        fill="none"
      >
        <path
          d="M32 4 C20 8 10 20 8 36 C6 48 14 58 26 60 C24 44 28 28 38 18 C44 12 48 10 52 8 C44 4 38 2 32 4 Z"
          fill="#788267"
        />
        <path d="M30 56 C30 40 34 26 44 16" stroke="#5B3A24" strokeWidth="1" opacity="0.3" fill="none" />
      </Box>

      {/* TS monogram */}
      <Typography
        sx={{
          fontFamily: '"Cormorant Garamond", serif',
          fontSize: { xs: '3.5rem', md: '5rem' },
          fontWeight: 600,
          color: '#173B28',
          letterSpacing: '0.05em',
          opacity: phase >= 2 ? 1 : 0,
          filter: phase >= 2 ? 'blur(0px)' : 'blur(8px)',
          transform: phase >= 2 ? 'scale(1)' : 'scale(0.95)',
          transition: 'opacity 700ms ease, filter 700ms ease, transform 700ms ease',
        }}
      >
        TS
      </Typography>

      {/* MANGO FARMING */}
      <Typography
        variant="overline"
        sx={{
          mt: 1.5,
          fontSize: { xs: '0.7rem', md: '0.85rem' },
          letterSpacing: '0.35em',
          color: '#5B3A24',
          fontWeight: 500,
          opacity: phase >= 3 ? 1 : 0,
          transform: phase >= 3 ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 600ms ease, transform 600ms ease',
        }}
      >
        MANGO FARMING
      </Typography>

      {/* Expanding line */}
      <Box
        sx={{
          mt: 3,
          height: '1px',
          width: phase >= 4 ? '120px' : '0px',
          bgcolor: '#788267',
          transition: 'width 500ms ease',
        }}
      />
    </Box>
  );
};

export default Preloader;
