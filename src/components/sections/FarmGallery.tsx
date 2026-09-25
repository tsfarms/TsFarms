import { type FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SectionLabel from '../SectionLabel';
import { useScrollParallax } from '../../hooks/useScrollParallax';
import { useReveal } from '../../hooks/useReveal';
import { farmImage, farmStoryImage, galleryImages } from '../../data/siteData';

const FarmGallery: FC = () => {
  const containerRef = useScrollParallax<HTMLDivElement>();
  const [headerRef, headerVisible] = useReveal<HTMLDivElement>({ threshold: 0.15 });

  return (
    <Box
      id="farm"
      ref={containerRef}
      sx={{
        position: 'relative',
        bgcolor: '#F6F1E7',
        py: { xs: 12, md: 20 },
        px: { xs: 3, md: 6, lg: 10 },
        overflow: 'hidden',
        borderTop: '1px solid rgba(23,59,40,0.06)',
      }}
    >
      {/* Background Decorative Parallax Blur */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '-10%',
          width: { xs: 350, md: 700 },
          height: { xs: 350, md: 700 },
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(23,59,40,0.05) 0%, transparent 70%)',
          transform: 'translate3d(0, var(--parallax-slow, 0px), 0)',
          pointerEvents: 'none',
        }}
      />

      <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
        {/* Section Header */}
        <Box
          ref={headerRef}
          sx={{
            textAlign: 'center',
            maxWidth: 780,
            mx: 'auto',
            mb: { xs: 8, md: 14 },
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 800ms ease, transform 800ms ease',
          }}
        >
          <SectionLabel>Our Farm & Orchard</SectionLabel>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.6rem' },
              color: '#173B28',
              lineHeight: 1.15,
              mb: 2.5,
              fontWeight: 400,
            }}
          >
            Take a look around our farm.
          </Typography>
          <Typography
            sx={{
              color: '#5B3A24',
              fontSize: { xs: '1rem', md: '1.2rem' },
              fontFamily: '"Cormorant Garamond", serif',
              fontStyle: 'italic',
              lineHeight: 1.7,
              maxWidth: 640,
              mx: 'auto',
            }}
          >
            Lush orchards, natural farming and a passion for quality. Run with generational care by
            Thangapandi and family in the fertile soils of Tamil Nadu.
          </Typography>
        </Box>

        {/* Panoramic Cinematic Orchard Banner with Multi-Speed Parallax */}
        <Box
          sx={{
            position: 'relative',
            height: { xs: '320px', sm: '420px', md: '540px' },
            borderRadius: { xs: 2, md: 3 },
            overflow: 'hidden',
            mb: { xs: 6, md: 10 },
            boxShadow: '0 24px 60px rgba(23,59,40,0.12)',
          }}
        >
          {/* Background Layer: Slower movement */}
          <Box
            component="img"
            src={farmStoryImage || farmImage}
            alt="TS Mango Farming lush orchard canopy"
            loading="lazy"
            sx={{
              position: 'absolute',
              top: '-15%',
              left: 0,
              width: '100%',
              height: '130%',
              objectFit: 'cover',
              transform: 'translate3d(0, var(--parallax-slow, 0px), 0) scale(1.04)',
              willChange: 'transform',
              transition: 'transform 200ms ease-out',
            }}
          />

          {/* Vignette Overlay for Depth */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(180deg, rgba(23,59,40,0.15) 0%, rgba(23,59,40,0.45) 70%, rgba(23,59,40,0.85) 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* Editorial Overlay Caption */}
          <Box
            sx={{
              position: 'absolute',
              bottom: { xs: 24, md: 48 },
              left: { xs: 24, md: 48 },
              right: { xs: 24, md: 48 },
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'flex-end' },
              gap: 2,
              color: '#FFFDF8',
              zIndex: 2,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: { xs: '0.75rem', md: '0.85rem' },
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#F4C542',
                  fontWeight: 600,
                  mb: 0.5,
                }}
              >
                Orchard Atmosphere
              </Typography>
              <Typography
                sx={{
                  fontFamily: '"Cormorant Garamond", serif',
                  fontSize: { xs: '1.4rem', sm: '1.8rem', md: '2.4rem' },
                  fontStyle: 'italic',
                  lineHeight: 1.2,
                }}
              >
                Where every tree has a history.
              </Typography>
            </Box>
            <Typography
              sx={{
                fontSize: { xs: '0.8rem', md: '0.9rem' },
                color: 'rgba(255,253,248,0.8)',
                maxWidth: 360,
                textAlign: { xs: 'left', sm: 'right' },
              }}
            >
              Hand-tended trees, natural blossom pollination, and calm morning sunlight nurture every fruit.
            </Typography>
          </Box>
        </Box>

        {/* Asymmetrical Parallax Photographic Gallery Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: { xs: 4, md: 6 },
            alignItems: 'start',
          }}
        >
          {/* Column 1: Slower parallax speed */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: { xs: 4, md: 6 },
              transform: { md: 'translate3d(0, var(--parallax-slow, 0px), 0)' },
              willChange: 'transform',
              transition: 'transform 200ms ease-out',
            }}
          >
            <Box
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: '0 16px 36px rgba(23,59,40,0.08)',
                aspectRatio: '4/5',
                bgcolor: '#EAE4D6',
              }}
            >
              <Box
                component="img"
                src={galleryImages[0]?.src || farmImage}
                alt={galleryImages[0]?.alt || 'Mango orchard golden hour'}
                loading="lazy"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 600ms ease',
                  '&:hover': { transform: 'scale(1.04)' },
                }}
              />
            </Box>
            <Box sx={{ px: 1 }}>
              <Typography
                sx={{
                  fontFamily: '"Cormorant Garamond", serif',
                  fontSize: '1.25rem',
                  fontStyle: 'italic',
                  color: '#173B28',
                  mb: 0.5,
                }}
              >
                Morning Harvest Rituals
              </Typography>
              <Typography sx={{ fontSize: '0.85rem', color: '#788267', lineHeight: 1.6 }}>
                Handpicked at first light when the fruit skin is cool and firm, preserving pristine aroma and stem latex.
              </Typography>
            </Box>
          </Box>

          {/* Column 2: Mid parallax speed (elevated composition) */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: { xs: 4, md: 6 },
              mt: { md: -4 },
              transform: { md: 'translate3d(0, var(--parallax-mid, 0px), 0)' },
              willChange: 'transform',
              transition: 'transform 200ms ease-out',
            }}
          >
            <Box
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: '0 20px 44px rgba(23,59,40,0.12)',
                aspectRatio: '1/1',
                bgcolor: '#EAE4D6',
              }}
            >
              <Box
                component="img"
                src={galleryImages[1]?.src || farmStoryImage}
                alt={galleryImages[1]?.alt || 'Freshly harvested mangoes in basket'}
                loading="lazy"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 600ms ease',
                  '&:hover': { transform: 'scale(1.04)' },
                }}
              />
            </Box>
            <Box
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: '0 16px 36px rgba(23,59,40,0.08)',
                aspectRatio: '16/10',
                bgcolor: '#EAE4D6',
              }}
            >
              <Box
                component="img"
                src={galleryImages[2]?.src || farmImage}
                alt={galleryImages[2]?.alt || 'Mango tree laden with fruit'}
                loading="lazy"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 600ms ease',
                  '&:hover': { transform: 'scale(1.04)' },
                }}
              />
            </Box>
          </Box>

          {/* Column 3: Reverse/Fast parallax speed */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: { xs: 4, md: 6 },
              transform: { md: 'translate3d(0, var(--parallax-reverse, 0px), 0)' },
              willChange: 'transform',
              transition: 'transform 200ms ease-out',
            }}
          >
            <Box
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: '0 16px 36px rgba(23,59,40,0.08)',
                aspectRatio: '4/5',
                bgcolor: '#EAE4D6',
              }}
            >
              <Box
                component="img"
                src={galleryImages[3]?.src || galleryImages[7]?.src || farmImage}
                alt="Ripe fruit ripening in orchard"
                loading="lazy"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 600ms ease',
                  '&:hover': { transform: 'scale(1.04)' },
                }}
              />
            </Box>
            <Box sx={{ px: 1 }}>
              <Typography
                sx={{
                  fontFamily: '"Cormorant Garamond", serif',
                  fontSize: '1.25rem',
                  fontStyle: 'italic',
                  color: '#173B28',
                  mb: 0.5,
                }}
              >
                Generations of Devotion
              </Typography>
              <Typography sx={{ fontSize: '0.85rem', color: '#788267', lineHeight: 1.6 }}>
                Every branch is cultivated with reverence for the soil and living harmony of our apiary colonies.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default FarmGallery;
