import { type FC, useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { benefitsImage, mangoBenefits } from '../../data/siteData';
import { useReveal } from '../../hooks/useReveal';
import SectionLabel from '../SectionLabel';

const BenefitsOfMango: FC = () => {
  const [ref, visible] = useReveal<HTMLDivElement>({ threshold: 0.3 });
  const [arrowsDrawn, setArrowsDrawn] = useState(0);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (!visible) return;
    mangoBenefits.forEach((_, i) => {
      timersRef.current.push(
        setTimeout(() => setArrowsDrawn(i + 1), 400 + i * 150),
      );
    });
    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [visible]);

  return (
    <Box
      ref={ref}
      sx={{
        bgcolor: '#F6F1E7',
        py: { xs: 10, md: 16 },
        px: { xs: 3, md: 6, lg: 8 },
      }}
    >
      <Box sx={{ maxWidth: 1400, mx: 'auto', textAlign: 'center', mb: { xs: 6, md: 10 } }}>
        <SectionLabel align="center">Why Mango</SectionLabel>
        <Typography
          variant="h2"
          sx={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 700ms ease, transform 700ms ease',
          }}
        >
          Nature's own multivitamin.
        </Typography>
      </Box>

      <Box
        sx={{
          position: 'relative',
          maxWidth: 800,
          mx: 'auto',
          aspectRatio: '1/1',
        }}
      >
        {/* Center mango image */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: visible
              ? 'translate(-50%, -50%) scale(1)'
              : 'translate(-50%, -50%) scale(0.85)',
            width: { xs: '55%', md: '45%' },
            aspectRatio: '1/1',
            borderRadius: '50%',
            overflow: 'hidden',
            transition: 'transform 1000ms ease',
            boxShadow: '0 8px 40px rgba(23,59,40,0.12)',
          }}
        >
          <Box
            component="img"
            src={benefitsImage}
            alt="Cut mango cubes in natural light"
            loading="lazy"
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Box>

        {/* SVG arrows */}
        <Box
          component="svg"
          sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {mangoBenefits.map((benefit, i) => {
            const isDrawn = i < arrowsDrawn;
            const cx = 50;
            const cy = 50;
            const midX = (cx + benefit.x) / 2 + (i % 2 === 0 ? 5 : -5);
            const midY = (cy + benefit.y) / 2 + (i % 2 === 0 ? -8 : 8);
            return (
              <path
                key={i}
                d={`M ${cx} ${cy} Q ${midX} ${midY} ${benefit.x} ${benefit.y}`}
                stroke="#173B28"
                strokeWidth="0.4"
                fill="none"
                opacity={isDrawn ? 0.5 : 0}
                strokeDasharray={200}
                strokeDashoffset={isDrawn ? 0 : 200}
                style={{ transition: 'stroke-dashoffset 500ms ease, opacity 300ms ease' }}
              />
            );
          })}
        </Box>

        {/* Benefit labels */}
        {mangoBenefits.map((benefit, i) => {
          const isShown = i < arrowsDrawn;
          return (
            <Typography
              key={i}
              sx={{
                position: 'absolute',
                left: `${benefit.x}%`,
                top: `${benefit.y}%`,
                transform: isShown
                  ? 'translate(-50%, -50%) scale(1)'
                  : 'translate(-50%, -50%) scale(0.9)',
                opacity: isShown ? 1 : 0,
                transition: 'opacity 400ms ease, transform 400ms ease',
                fontFamily: '"Manrope", sans-serif',
                fontSize: { xs: '0.75rem', md: '0.9rem' },
                fontWeight: 600,
                color: '#173B28',
                bgcolor: '#FFFDF8',
                px: 1.5,
                py: 0.8,
                borderRadius: 0.5,
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 12px rgba(23,59,40,0.08)',
              }}
            >
              {benefit.label}
            </Typography>
          );
        })}
      </Box>
    </Box>
  );
};

export default BenefitsOfMango;
