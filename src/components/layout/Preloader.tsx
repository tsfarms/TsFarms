import { useEffect, useState, type FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

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
    const timers = [
      setTimeout(() => setPhase(1), 160),
      setTimeout(() => setPhase(2), 720),
      setTimeout(() => setPhase(3), 1180),
      setTimeout(() => {
        setPhase(4);
        onComplete();
      }, 2600),
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
        opacity: phase >= 4 ? 0 : 1,
        transition: 'opacity 600ms ease',
        pointerEvents: phase >= 4 ? 'none' : 'auto',
        '@keyframes lineGrow': {
          from: { transform: 'scaleX(0)' },
          to: { transform: 'scaleX(1)' },
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          width: { xs: 240, md: 360 },
          height: { xs: 240, md: 360 },
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(217,148,25,0.28) 0%, rgba(16,40,27,0) 70%)',
          opacity: phase >= 1 ? 1 : 0,
          transition: 'opacity 700ms ease',
        }}
      />

      <Typography
        sx={{
          fontFamily: '"Cormorant Garamond", serif',
          fontSize: { xs: '3.2rem', md: '4.8rem' },
          fontWeight: 600,
          color: '#FFFDF8',
          letterSpacing: '0.12em',
          lineHeight: 1,
          opacity: phase >= 1 ? 1 : 0,
          filter: phase >= 1 ? 'blur(0px)' : 'blur(8px)',
          transform: phase >= 1 ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 700ms ease, filter 700ms ease, transform 700ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        TS Farms
      </Typography>

      <Box
        sx={{
          mt: 3,
          height: 1.5,
          width: 120,
          borderRadius: 1,
          bgcolor: 'rgba(255,253,248,0.12)',
          overflow: 'hidden',
          opacity: phase >= 2 ? 1 : 0,
          transition: 'opacity 400ms ease',
        }}
      >
        <Box
          sx={{
            height: '100%',
            width: '100%',
            bgcolor: '#D99419',
            transformOrigin: 'left center',
            animation: phase >= 2 && phase < 4 ? 'lineGrow 1.2s ease forwards' : 'none',
            transform: phase >= 3 ? 'scaleX(1)' : 'scaleX(0)',
          }}
        />
      </Box>
    </Box>
  );
};

export default Preloader;
