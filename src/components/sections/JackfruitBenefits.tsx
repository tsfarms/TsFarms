import { type FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SectionLabel from '../SectionLabel';
import { useScrollParallax } from '../../hooks/useScrollParallax';
import { useReveal } from '../../hooks/useReveal';
import { productImages } from '../../data/siteData';

const JACKFRUIT_BENEFITS = [
  {
    title: 'Wholesome Dietary Fiber',
    desc: 'Crisp, crunchy Then-Varikkai bulbs naturally packed with plant fiber that promotes gentle, satisfying satiety.',
  },
  {
    title: 'Vitamin C & Potassium',
    desc: 'Delivers natural seasonal micronutrients nurtured under abundant tropical sunshine and clean groundwater.',
  },
  {
    title: 'Sacred Mukkani Heritage',
    desc: 'Treasured across Tamil history as one of the three royal fruits alongside Mango and Banana.',
  },
  {
    title: 'Tree-Ripened Integrity',
    desc: 'Matured slowly on the grove tree trunk to develop natural honey fragrance with zero artificial hastenings.',
  },
];

const JackfruitBenefits: FC = () => {
  const containerRef = useScrollParallax<HTMLDivElement>();
  const [contentRef, visible] = useReveal<HTMLDivElement>({ threshold: 0.15 });

  return (
    <Box
      id="jackfruit-benefits"
      ref={containerRef}
      sx={{
        position: 'relative',
        bgcolor: '#FAF6EE',
        py: { xs: 10, md: 16 },
        px: { xs: 3, md: 6, lg: 10 },
        overflow: 'hidden',
        borderTop: '1px solid rgba(46,105,48,0.08)',
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
          {/* Left Column: Layered Parallax Image Composition */}
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
                boxShadow: '0 20px 44px rgba(23,59,40,0.12)',
                transform: 'translate3d(0, var(--parallax-slow, 0px), 0)',
                transition: 'transform 200ms ease-out',
                willChange: 'transform',
              }}
            >
              <Box
                component="img"
                src={productImages.jackfruit}
                alt="Freshly harvested jackfruit bulbs with natural golden glow"
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

            {/* Overlapping Floating Badge */}
            <Box
              sx={{
                position: 'absolute',
                bottom: { xs: -15, md: -25 },
                left: { xs: 15, md: -20 },
                bgcolor: '#FFFDF8',
                border: '1px solid rgba(46,105,48,0.15)',
                p: { xs: 2.5, md: 3 },
                borderRadius: 2,
                maxWidth: 240,
                boxShadow: '0 14px 32px rgba(23,59,40,0.12)',
                transform: 'translate3d(0, var(--parallax-fast, 0px), 0)',
                transition: 'transform 200ms ease-out',
                willChange: 'transform',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              <Typography sx={{ fontWeight: 800, color: '#173B28', fontSize: '1rem', mb: 0.5 }}>
                Harvested at Peak
              </Typography>
              <Typography sx={{ fontSize: '0.8rem', color: '#5B3A24', lineHeight: 1.5 }}>
                Deseeded and box-packed the same morning of dispatch.
              </Typography>
            </Box>
          </Box>

          {/* Right Column: Editorial Copy */}
          <Box>
            <SectionLabel color="#2E6930">Wholesome Village Harvest</SectionLabel>
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
              Wholesome nourishment, straight from the tree.
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
              Jackfruit is celebrated across Tamil culture for its substantial texture, satisfying natural sweetness, and rich mineral profile. Enjoyed fresh as crunchy fruit bulbs or in beloved traditional desserts.
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3.5 }}>
              {JACKFRUIT_BENEFITS.map((item, idx) => (
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
                    <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#2E6930' }} />
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

export default JackfruitBenefits;
