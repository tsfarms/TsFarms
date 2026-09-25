import { type FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SectionLabel from '../SectionLabel';
import { useScrollParallax } from '../../hooks/useScrollParallax';
import { useReveal } from '../../hooks/useReveal';
import { productImages, benefitsImage } from '../../data/siteData';

const MANGO_POINTS = [
  {
    title: 'Naturally Rich in Vitamin C',
    desc: 'Abundant in tree-ripened summer fruits, delivering fresh dietary nutrition in every slice.',
  },
  {
    title: 'Tree-Ripened Purity',
    desc: 'Matured naturally on the branch with zero calcium carbide, chemical hastenings, or artificial dips.',
  },
  {
    title: 'Provitamin A & Carotenoids',
    desc: 'Dense in natural beta-carotene pigments that lend our South Indian varieties their vibrant saffron glow.',
  },
  {
    title: 'Wholesome Dietary Fiber',
    desc: 'Satisfying natural fruit fiber that supports everyday digestive balance and whole-food nourishment.',
  },
];

const MangoBenefits: FC = () => {
  const containerRef = useScrollParallax<HTMLDivElement>();
  const [contentRef, visible] = useReveal<HTMLDivElement>({ threshold: 0.15 });

  return (
    <Box
      id="mango-benefits"
      ref={containerRef}
      sx={{
        position: 'relative',
        bgcolor: '#FAF6EE',
        py: { xs: 10, md: 16 },
        px: { xs: 3, md: 6, lg: 10 },
        overflow: 'hidden',
        borderTop: '1px solid rgba(23,59,40,0.06)',
      }}
    >
      {/* Background ambient depth glow */}
      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          right: '-5%',
          width: { xs: 300, md: 600 },
          height: { xs: 300, md: 600 },
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(217,148,25,0.08) 0%, transparent 70%)',
          transform: 'translate3d(0, var(--parallax-slow, 0px), 0)',
          pointerEvents: 'none',
        }}
      />

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
          {/* Left Column: Layered Parallax Visual Composition */}
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {/* Main Focal Mango Image */}
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                maxWidth: 520,
                aspectRatio: '4/5',
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: '0 20px 48px rgba(23,59,40,0.12)',
                transform: 'translate3d(0, var(--parallax-slow, 0px), 0)',
                transition: 'transform 200ms ease-out',
                willChange: 'transform',
              }}
            >
              <Box
                component="img"
                src={benefitsImage || productImages.mangoes}
                alt="Fresh sun-kissed organic mangoes on branch"
                loading="lazy"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'saturate(1.06)',
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'scale(1)' : 'scale(1.06)',
                  transition: 'opacity 900ms ease, transform 1100ms ease',
                }}
              />
            </Box>

            {/* Overlapping Secondary Floating Accent Card */}
            <Box
              sx={{
                position: 'absolute',
                bottom: { xs: -20, md: -30 },
                left: { xs: 10, md: -25 },
                bgcolor: '#173B28',
                color: '#FFFDF8',
                p: { xs: 2.5, md: 3.5 },
                borderRadius: 2,
                maxWidth: { xs: 220, md: 260 },
                boxShadow: '0 16px 36px rgba(23,59,40,0.22)',
                transform: 'translate3d(0, var(--parallax-fast, 0px), 0)',
                transition: 'transform 200ms ease-out',
                willChange: 'transform',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              <Typography
                sx={{
                  fontFamily: '"Cormorant Garamond", serif',
                  fontSize: { xs: '1.4rem', md: '1.7rem' },
                  lineHeight: 1.15,
                  mb: 1,
                  fontStyle: 'italic',
                }}
              >
                100% Tree-Ripened
              </Typography>
              <Typography sx={{ fontSize: '0.82rem', opacity: 0.85, lineHeight: 1.5 }}>
                Harvested at optimal brix sweetness directly from our family grove.
              </Typography>
            </Box>
          </Box>

          {/* Right Column: Editorial Nutrition Story */}
          <Box>
            <SectionLabel>Nature's Pure Nutrition</SectionLabel>
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
              Pure goodness, nurtured by nature.
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
              Real mangoes are more than just sweet fruit — they are a seasonal celebration of vital nutrients, fragrant volatile oils, and sun-drenched hydration.
            </Typography>

            {/* Benefit Highlights List */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3.5 }}>
              {MANGO_POINTS.map((item, idx) => (
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
                    <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#D99419' }} />
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

export default MangoBenefits;
