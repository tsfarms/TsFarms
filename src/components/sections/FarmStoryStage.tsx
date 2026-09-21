import { type FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SectionLabel from '../SectionLabel';
import { useScrollParallax } from '../../hooks/useScrollParallax';
import { useReveal } from '../../hooks/useReveal';
import { farmImage, farmStoryImage, galleryImages } from '../../data/siteData';

const FarmStoryStage: FC = () => {
  const containerRef = useScrollParallax<HTMLDivElement>();
  const [textRef, textVisible] = useReveal<HTMLDivElement>({ threshold: 0.15 });

  return (
    <Box
      id="farm"
      ref={containerRef}
      sx={{
        position: 'relative',
        bgcolor: '#173B28',
        color: '#FFFDF8',
        py: { xs: 12, md: 22 },
        px: { xs: 3, md: 6, lg: 10 },
        overflow: 'hidden',
      }}
    >
      {/* ============================================================ */}
      {/* LAYER 1: BACKGROUND ORCHARD LANDSCAPE (SLOWEST PARALLAX) */}
      {/* ============================================================ */}
      <Box
        component="img"
        src={farmStoryImage || farmImage}
        alt="Lush mango orchard canopy"
        loading="lazy"
        sx={{
          position: 'absolute',
          top: '-20%',
          left: 0,
          width: '100%',
          height: '140%',
          objectFit: 'cover',
          opacity: 0.22,
          transform: 'translate3d(0, var(--parallax-slow, 0px), 0)',
          willChange: 'transform',
          transition: 'transform 200ms ease-out',
          pointerEvents: 'none',
        }}
      />

      {/* Atmospheric Radial Gradient Overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 50% 50%, rgba(23,59,40,0.4) 0%, rgba(15,38,26,0.92) 80%)',
          pointerEvents: 'none',
        }}
      />

      <Box sx={{ maxWidth: 1400, mx: 'auto', position: 'relative', zIndex: 2 }}>
        {/* Editorial Text Reveal */}
        <Box
          ref={textRef}
          sx={{
            textAlign: 'center',
            maxWidth: 780,
            mx: 'auto',
            mb: { xs: 8, md: 14 },
            opacity: textVisible ? 1 : 0,
            transform: textVisible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 800ms ease, transform 800ms ease',
          }}
        >
          <SectionLabel color="#D99419">Our Farm & Heritage</SectionLabel>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2.4rem', sm: '3.2rem', md: '4rem' },
              color: '#FFFDF8',
              lineHeight: 1.1,
              mb: 2.5,
              fontWeight: 400,
            }}
          >
            Take a look around our farm.
          </Typography>
          <Typography
            sx={{
              color: 'rgba(255,253,248,0.85)',
              fontSize: { xs: '1.05rem', md: '1.25rem' },
              fontFamily: '"Cormorant Garamond", serif',
              fontStyle: 'italic',
              lineHeight: 1.7,
              maxWidth: 680,
              mx: 'auto',
            }}
          >
            TS Mango Farming is a family-owned farm run by Thangapandi. We grow fresh mangoes, farm
            honey and seasonal jackfruit, and deliver them across Tamil Nadu.
          </Typography>
        </Box>

        {/* ============================================================ */}
        {/* LAYER 2 & 3: MULTIPLANE PHOTOGRAPHIC PARALLAX DISCOVERY */}
        {/* ============================================================ */}
        <Box
          sx={{
            position: 'relative',
            minHeight: { xs: 'auto', md: '680px' },
            display: { xs: 'flex', md: 'block' },
            flexDirection: 'column',
            gap: 4,
          }}
        >
          {/* Plane A (Middle depth, Center Large Image) */}
          <Box
            sx={{
              position: { xs: 'relative', md: 'absolute' },
              top: { md: '0%' },
              left: { md: '20%' },
              width: { xs: '100%', md: '55%' },
              aspectRatio: '16/10',
              borderRadius: { xs: 2, md: 3 },
              overflow: 'hidden',
              boxShadow: '0 28px 60px rgba(0,0,0,0.35)',
              transform: { md: 'translate3d(0, var(--parallax-mid, 0px), 0)' },
              willChange: 'transform',
              transition: 'transform 200ms ease-out',
            }}
          >
            <Box
              component="img"
              src={farmImage}
              alt="Orchard trees and fertile soil"
              loading="lazy"
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: 20,
                left: 20,
                bgcolor: 'rgba(15,38,26,0.8)',
                backdropFilter: 'blur(8px)',
                px: 2,
                py: 0.8,
                borderRadius: 20,
                fontSize: '0.8rem',
                color: '#FFFDF8',
              }}
            >
              The Orchard Groves · Tamil Nadu
            </Box>
          </Box>

          {/* Plane B (Foreground Left, rising faster) */}
          <Box
            sx={{
              position: { xs: 'relative', md: 'absolute' },
              top: { md: '30%' },
              left: { md: '2%' },
              width: { xs: '100%', md: '30%' },
              aspectRatio: '4/5',
              borderRadius: { xs: 2, md: 3 },
              overflow: 'hidden',
              boxShadow: '0 24px 50px rgba(0,0,0,0.4)',
              transform: { md: 'translate3d(calc(var(--parallax-slow, 0px) * -0.2), var(--parallax-fast, 0px), 0)' },
              willChange: 'transform',
              transition: 'transform 200ms ease-out',
              zIndex: 3,
            }}
          >
            <Box
              component="img"
              src={galleryImages[1]?.src || farmStoryImage}
              alt="Freshly harvested fruit in basket"
              loading="lazy"
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: 16,
                left: 16,
                bgcolor: 'rgba(15,38,26,0.8)',
                backdropFilter: 'blur(8px)',
                px: 1.8,
                py: 0.6,
                borderRadius: 20,
                fontSize: '0.75rem',
                color: '#D99419',
                fontWeight: 600,
              }}
            >
              Morning Harvest
            </Box>
          </Box>

          {/* Plane C (Foreground Right, rising and drifting) */}
          <Box
            sx={{
              position: { xs: 'relative', md: 'absolute' },
              top: { md: '20%' },
              right: { md: '2%' },
              width: { xs: '100%', md: '32%' },
              aspectRatio: '4/5',
              borderRadius: { xs: 2, md: 3 },
              overflow: 'hidden',
              boxShadow: '0 24px 50px rgba(0,0,0,0.4)',
              transform: { md: 'translate3d(calc(var(--parallax-slow, 0px) * 0.2), var(--parallax-reverse, 0px), 0)' },
              willChange: 'transform',
              transition: 'transform 200ms ease-out',
              zIndex: 3,
            }}
          >
            <Box
              component="img"
              src={galleryImages[0]?.src || galleryImages[3]?.src || farmImage}
              alt="Golden sunlight filtering through orchard"
              loading="lazy"
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: 16,
                left: 16,
                bgcolor: 'rgba(15,38,26,0.8)',
                backdropFilter: 'blur(8px)',
                px: 1.8,
                py: 0.6,
                borderRadius: 20,
                fontSize: '0.75rem',
                color: '#86EFAC',
                fontWeight: 600,
              }}
            >
              Sun-Kissed Fruit
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default FarmStoryStage;
