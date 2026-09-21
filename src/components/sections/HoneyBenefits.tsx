import { type FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SectionLabel from '../SectionLabel';
import { useScrollParallax } from '../../hooks/useScrollParallax';
import { useReveal } from '../../hooks/useReveal';
import { honeyTextureImage, productImages } from '../../data/siteData';

const HONEY_BENEFITS = [
  {
    title: 'Cold-Extracted & Unheated',
    desc: 'Harvested without boiling or heat pasteurization, preserving raw aromatic floral compounds and vital enzymes.',
  },
  {
    title: 'Floral Pollen & Propolis',
    desc: 'Retains all fine micro-pollen particles gathered by bees from wild mango blossoms and orchard flora.',
  },
  {
    title: 'Balanced Natural Sweetness',
    desc: 'Smooth natural fructose and glucose that provide clean, wholesome food energy with zero refined sugar.',
  },
  {
    title: 'Cherished Culinary Heritage',
    desc: 'Traditionally enjoyed in morning warm beverages, herbal infusions, and wholesome South Indian kitchen recipes.',
  },
];

const HoneyBenefits: FC = () => {
  const containerRef = useScrollParallax<HTMLDivElement>();
  const [contentRef, visible] = useReveal<HTMLDivElement>({ threshold: 0.15 });

  return (
    <Box
      id="honey-benefits"
      ref={containerRef}
      sx={{
        position: 'relative',
        bgcolor: '#FBF8F1',
        py: { xs: 10, md: 16 },
        px: { xs: 3, md: 6, lg: 10 },
        overflow: 'hidden',
        borderTop: '1px solid rgba(180,83,9,0.08)',
      }}
    >
      <Box sx={{ maxWidth: 1300, mx: 'auto' }}>
        <Box
          ref={contentRef}
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.1fr 1fr' },
            gap: { xs: 6, md: 10 },
            alignItems: 'center',
          }}
        >
          {/* Left Column: Parallax Image Layer */}
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                maxWidth: 520,
                aspectRatio: '4/5',
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: '0 20px 44px rgba(180,83,9,0.14)',
                transform: 'translate3d(0, var(--parallax-slow, 0px), 0)',
                transition: 'transform 200ms ease-out',
                willChange: 'transform',
              }}
            >
              <Box
                component="img"
                src={honeyTextureImage || productImages.honey}
                alt="Golden raw honey with natural honeycomb texture"
                loading="lazy"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'scale(1)' : 'scale(1.06)',
                  transition: 'opacity 900ms ease, transform 1100ms ease',
                }}
              />
            </Box>

            {/* Accent Floating Badge */}
            <Box
              sx={{
                position: 'absolute',
                bottom: { xs: -15, md: -25 },
                left: { xs: 15, md: -20 },
                bgcolor: '#FFFDF8',
                border: '1px solid rgba(180,83,9,0.2)',
                p: { xs: 2.5, md: 3 },
                borderRadius: 2,
                maxWidth: 240,
                boxShadow: '0 14px 32px rgba(180,83,9,0.12)',
                transform: 'translate3d(0, var(--parallax-fast, 0px), 0)',
                transition: 'transform 200ms ease-out',
                willChange: 'transform',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              <Typography sx={{ fontWeight: 800, color: '#B45309', fontSize: '1rem', mb: 0.5 }}>
                Zero Additives
              </Typography>
              <Typography sx={{ fontSize: '0.8rem', color: '#5B3A24', lineHeight: 1.5 }}>
                100% natural bee harvest straight from farm bloom to glass jar.
              </Typography>
            </Box>
          </Box>

          {/* Right Column: Nutrition Story */}
          <Box>
            <SectionLabel color="#B45309">Raw Apiary Nutrition</SectionLabel>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.4rem' },
                color: '#173B28',
                lineHeight: 1.1,
                mb: 2.5,
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 700ms ease 200ms, transform 700ms ease 200ms',
              }}
            >
              Authentic sweetness, pure and unadulterated.
            </Typography>
            <Typography
              sx={{
                color: '#5B3A24',
                fontSize: { xs: '1rem', md: '1.1rem' },
                lineHeight: 1.75,
                mb: 5,
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(16px)',
                transition: 'opacity 700ms ease 350ms, transform 700ms ease 350ms',
              }}
            >
              Commercial honey is often heated and blended. Our single-origin apiary honey retains every delicate botanical ester, natural pollen grain, and natural enzyme created by our orchard bees.
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3.5 }}>
              {HONEY_BENEFITS.map((item, idx) => (
                <Box
                  key={item.title}
                  sx={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateY(0)' : 'translateY(18px)',
                    transition: `opacity 600ms ease ${450 + idx * 80}ms, transform 600ms ease ${450 + idx * 80}ms`,
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: '#173B28',
                      fontSize: '0.98rem',
                      mb: 0.8,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#B45309' }} />
                    {item.title}
                  </Typography>
                  <Typography sx={{ color: '#6A5647', fontSize: '0.88rem', lineHeight: 1.6 }}>
                    {item.desc}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default HoneyBenefits;
