import { type FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SectionLabel from '../SectionLabel';
import { useScrollParallax } from '../../hooks/useScrollParallax';
import { useReveal } from '../../hooks/useReveal';
import { farmImage, farmStoryImage, galleryImages } from '../../data/siteData';

const FarmParallaxSection: FC = () => {
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
        pt: { xs: 6.5, md: 8.5 },
        pb: { xs: 6.5, md: 8.5 },
        px: { xs: 3, sm: 4, md: 6, lg: 9 },
        overflow: 'hidden',
      }}
    >
      {/* ATMOSPHERIC CHAPTER TRANSITION FEATHERING */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: { xs: 32, md: 48 },
          background: 'linear-gradient(180deg, rgba(242,246,237,0.06) 0%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* BACKGROUND ORCHARD TEXTURE (SLOW, SUBTLE PARALLAX) */}
      <Box
        component="img"
        src={farmStoryImage || farmImage}
        alt="Lush mango orchard canopy"
        loading="lazy"
        sx={{
          position: 'absolute',
          top: '-15%',
          left: 0,
          width: '100%',
          height: '130%',
          objectFit: 'cover',
          opacity: 0.15,
          transform: 'translate3d(0, var(--parallax-slow, 0px), 0)',
          willChange: 'transform',
          pointerEvents: 'none',
        }}
      />

      {/* Atmospheric Soft Vignette */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 50% 30%, rgba(23,59,40,0.4) 0%, rgba(15,38,26,0.96) 80%)',
          pointerEvents: 'none',
        }}
      />

      <Box sx={{ maxWidth: 1350, mx: 'auto', position: 'relative', zIndex: 2 }}>
        {/* Section Header */}
        <Box
          ref={textRef}
          sx={{
            textAlign: 'center',
            maxWidth: 760,
            mx: 'auto',
            mb: { xs: 4.5, md: 6 },
            opacity: textVisible ? 1 : 0,
            transform: textVisible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 800ms ease, transform 800ms ease',
          }}
        >
          <SectionLabel color="#D99419">Our Farm & Orchard</SectionLabel>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2.1rem', sm: '2.7rem', md: '3.2rem' },
              color: '#FFFDF8',
              lineHeight: 1.12,
              mb: 1.5,
              fontWeight: 400,
            }}
          >
            Take A Look Around Our Farm
          </Typography>
          <Typography
            sx={{
              color: 'rgba(255,253,248,0.85)',
              fontSize: { xs: '0.98rem', md: '1.1rem' },
              fontFamily: '"Cormorant Garamond", serif',
              fontStyle: 'italic',
              lineHeight: 1.65,
              maxWidth: 680,
              mx: 'auto',
            }}
          >
            TS Mango Farming is a family-owned orchard managed by Thangapandi and family in Tamil Nadu. We cultivate heritage mangoes, pure raw honey, and sweet jackfruit with deep reverence for the soil.
          </Typography>
        </Box>

        {/* ============================================================ */}
        {/* ASYMMETRIC EDITORIAL GALLERY WITH ART-DIRECTED RHYTHM         */}
        {/* ============================================================ */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.2fr 1fr' },
            gap: { xs: 3.5, md: 5 },
            alignItems: 'stretch',
          }}
        >
          {/* DOMINANT HERO MOMENT: Panoramic View of Family Groves */}
          <Box
            sx={{
              position: 'relative',
              borderRadius: { xs: 2, md: 2.5 },
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
              minHeight: { xs: 260, sm: 340, md: 460 },
              transform: { md: 'translate3d(0, var(--parallax-slow, 0px), 0)' },
              willChange: 'transform',
              transition: 'transform 300ms ease-out',
            }}
          >
            <Box
              component="img"
              src={galleryImages[0]?.src || farmImage}
              alt="TS Mango Farming lush orchard trees and fertile soil"
              loading="lazy"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: 20,
                left: 20,
                bgcolor: 'rgba(15,38,26,0.85)',
                backdropFilter: 'blur(8px)',
                px: 2.2,
                py: 0.8,
                borderRadius: 20,
                fontSize: '0.82rem',
                color: '#FFFDF8',
                fontWeight: 600,
                border: '1px solid rgba(255,253,248,0.15)',
              }}
            >
              The Family Orchard Groves · Tamil Nadu
            </Box>
          </Box>

          {/* SUPPORTING MOMENTS: Staggered Pair with Vertical Rhythm */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: { xs: 3, md: 3.5 },
              transform: { md: 'translate3d(0, var(--parallax-mid, 0px), 0)' },
              willChange: 'transform',
              transition: 'transform 300ms ease-out',
            }}
          >
            {/* Supporting 1: Morning Harvest Basket */}
            <Box
              sx={{
                position: 'relative',
                borderRadius: { xs: 2, md: 2.5 },
                overflow: 'hidden',
                boxShadow: '0 18px 45px rgba(0,0,0,0.28)',
                aspectRatio: { xs: '16/10', sm: '16/9' },
              }}
            >
              <Box
                component="img"
                src={galleryImages[1]?.src || farmStoryImage}
                alt="Freshly harvested mangoes in morning basket"
                loading="lazy"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 14,
                  left: 14,
                  bgcolor: 'rgba(15,38,26,0.85)',
                  backdropFilter: 'blur(6px)',
                  px: 2,
                  py: 0.6,
                  borderRadius: 20,
                  fontSize: '0.78rem',
                  color: '#D99419',
                  fontWeight: 600,
                  border: '1px solid rgba(217,148,25,0.3)',
                }}
              >
                Morning Harvest Basket
              </Box>
            </Box>

            {/* Supporting 2: Fruit Ripening on Branch */}
            <Box
              sx={{
                position: 'relative',
                borderRadius: { xs: 2, md: 2.5 },
                overflow: 'hidden',
                boxShadow: '0 18px 45px rgba(0,0,0,0.28)',
                aspectRatio: { xs: '16/10', sm: '16/9' },
              }}
            >
              <Box
                component="img"
                src={galleryImages[3]?.src || galleryImages[2]?.src || farmImage}
                alt="Ripe mango ripening in natural sunlight"
                loading="lazy"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 14,
                  left: 14,
                  bgcolor: 'rgba(15,38,26,0.85)',
                  backdropFilter: 'blur(6px)',
                  px: 2,
                  py: 0.6,
                  borderRadius: 20,
                  fontSize: '0.78rem',
                  color: '#86EFAC',
                  fontWeight: 600,
                  border: '1px solid rgba(134,239,172,0.3)',
                }}
              >
                Tree-Ripening on the Branch
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default FarmParallaxSection;
