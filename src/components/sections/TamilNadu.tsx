import { type FC, useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useReveal } from '../../hooks/useReveal';
import SectionLabel from '../SectionLabel';

const TamilNadu: FC = () => {
  const [ref, visible] = useReveal<HTMLDivElement>({ threshold: 0.3 });
  const [drawProgress, setDrawProgress] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!visible) return;
    let start: number | null = null;
    const animate = (ts: number) => {
      if (start === null) start = ts;
      const elapsed = ts - start;
      const p = Math.min(1, elapsed / 2000);
      setDrawProgress(p);
      if (p < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [visible]);

  const pathLength = 1000;
  const dashOffset = pathLength * (1 - drawProgress);

  return (
    <Box
      ref={ref}
      sx={{
        bgcolor: '#FFFDF8',
        py: { xs: 8, md: 14 },
        px: { xs: 3, md: 6, lg: 8 },
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: { xs: 6, md: 10 },
          alignItems: 'center',
        }}
      >
        <Box>
          <SectionLabel>Delivery</SectionLabel>
          <Typography
            variant="h2"
            sx={{
              mb: 4,
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 700ms ease, transform 700ms ease',
            }}
          >
            Fresh produce, delivered across Tamil Nadu.
          </Typography>
          <Typography
            sx={{
              color: '#5B3A24',
              fontSize: '1.05rem',
              lineHeight: 1.8,
              opacity: visible ? 1 : 0,
              transition: 'opacity 700ms ease 200ms',
            }}
          >
            From Chennai to Coimbatore, Madurai to Trichy — we deliver our farm-fresh mangoes, honey and jackfruit across the state. Minimum order 5–6 KG.
          </Typography>
        </Box>

        {/* Tamil Nadu map outline */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            maxWidth: 400,
            mx: 'auto',
            opacity: visible ? 1 : 0,
            transition: 'opacity 1000ms ease 300ms',
          }}
        >
          <Box
            component="svg"
            viewBox="0 0 300 380"
            sx={{ width: '100%', height: 'auto' }}
            fill="none"
          >
            {/* Simplified Tamil Nadu outline */}
            <path
              d="M150 10 C170 15 185 30 190 50 C195 70 185 85 175 95 C170 100 175 110 180 120 C190 140 195 160 185 180 C175 200 160 220 155 250 C150 280 145 310 140 340 C138 355 135 370 130 375 M150 10 C130 15 115 30 110 50 C105 70 115 85 125 95 C130 100 125 110 120 120 C110 140 105 160 115 180 C125 200 140 220 145 250 C150 280 155 310 160 340 C162 355 165 370 170 375 M150 10 L150 380"
              stroke="#173B28"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={pathLength}
              strokeDashoffset={dashOffset}
              style={{ transition: 'stroke-dashoffset 50ms linear' }}
            />
            {/* Location pin */}
            <circle
              cx="150"
              cy="180"
              r="5"
              fill="#D99419"
              opacity={drawProgress >= 1 ? 1 : 0}
              style={{ transition: 'opacity 400ms ease' }}
            />
            <circle
              cx="150"
              cy="180"
              r="12"
              fill="none"
              stroke="#D99419"
              strokeWidth="1.5"
              opacity={drawProgress >= 1 ? 0.4 : 0}
              style={{ transition: 'opacity 400ms ease 200ms' }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default TamilNadu;
