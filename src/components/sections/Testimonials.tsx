import { type FC, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { testimonials } from '../../data/siteData';
import { useReveal } from '../../hooks/useReveal';
import SectionLabel from '../SectionLabel';

const Testimonials: FC = () => {
  const [index, setIndex] = useState(0);
  const [ref] = useReveal<HTMLDivElement>({ threshold: 0.3 });

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box
      ref={ref}
      sx={{
        bgcolor: '#173B28',
        py: { xs: 10, md: 16 },
        px: { xs: 3, md: 6, lg: 8 },
      }}
    >
      <Box sx={{ maxWidth: 900, mx: 'auto', textAlign: 'center' }}>
        <SectionLabel color="#788267" align="center">
          Kind Words
        </SectionLabel>

        <Box
          sx={{
            position: 'relative',
            minHeight: { xs: 220, md: 200 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          {testimonials.map((t, i) => (
            <Box
              key={i}
              sx={{
                position: i === index ? 'relative' : 'absolute',
                inset: 0,
                opacity: i === index ? 1 : 0,
                transform: i === index ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 700ms ease, transform 700ms ease',
                pointerEvents: i === index ? 'auto' : 'none',
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  color: '#FFFDF8',
                  fontFamily: '"Cormorant Garamond", serif',
                  fontStyle: 'italic',
                  fontSize: { xs: '1.5rem', md: '2rem' },
                  lineHeight: 1.5,
                  mb: 3,
                }}
              >
                "{t.quote}"
              </Typography>
              <Typography
                sx={{
                  color: '#D99419',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                }}
              >
                {t.name}
              </Typography>
              <Typography
                sx={{
                  color: 'rgba(255,253,248,0.5)',
                  fontSize: '0.85rem',
                }}
              >
                {t.location}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 4 }}>
          {testimonials.map((_, i) => (
            <Box
              key={i}
              onClick={() => setIndex(i)}
              sx={{
                width: i === index ? 24 : 8,
                height: 4,
                bgcolor: i === index ? '#D99419' : 'rgba(255,253,248,0.25)',
                borderRadius: 2,
                cursor: 'pointer',
                transition: 'width 300ms ease, background-color 300ms ease',
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Testimonials;
