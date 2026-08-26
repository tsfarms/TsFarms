import { type FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { productImages } from '../../data/siteData';
import { useReveal } from '../../hooks/useReveal';
import SectionLabel from '../SectionLabel';

const products = [
  { name: 'Mangoes', image: productImages.mangoes, label: 'Seven varieties' },
  { name: 'Honey', image: productImages.honey, label: 'Pure and natural' },
  { name: 'Jackfruit', image: productImages.jackfruit, label: 'Seasonal fresh' },
];

const WhatWeGrow: FC = () => {
  const [ref, visible] = useReveal<HTMLDivElement>();

  return (
    <Box
      sx={{
        bgcolor: '#173B28',
        py: { xs: 8, md: 14 },
        px: { xs: 3, md: 6, lg: 8 },
      }}
    >
      <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 10 } }}>
          <SectionLabel color="#788267" align="center">
            What We Grow
          </SectionLabel>
          <Typography
            variant="h2"
            sx={{
              color: '#FFFDF8',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 700ms ease, transform 700ms ease',
            }}
          >
            From the orchard to your home.
          </Typography>
        </Box>

        <Box
          ref={ref}
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: { xs: 4, md: 6 },
          }}
        >
          {products.map((product, i) => (
            <Box
              key={product.name}
              sx={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(30px)',
                transition: `opacity 700ms ease ${300 + i * 120}ms, transform 700ms ease ${300 + i * 120}ms`,
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: 1,
                  aspectRatio: '3/4',
                  mb: 3,
                  '&:hover img': { transform: 'scale(1.04)' },
                }}
              >
                <Box
                  component="img"
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 800ms ease',
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, transparent 50%, rgba(23,59,40,0.5) 100%)',
                  }}
                />
              </Box>
              <Typography
                variant="h4"
                sx={{ color: '#FFFDF8', mb: 0.5 }}
              >
                {product.name}
              </Typography>
              <Typography
                sx={{
                  color: '#788267',
                  fontSize: '0.9rem',
                  letterSpacing: '0.05em',
                }}
              >
                {product.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default WhatWeGrow;
