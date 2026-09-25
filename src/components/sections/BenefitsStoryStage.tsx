import { type FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SectionLabel from '../SectionLabel';
import { useScrollParallax } from '../../hooks/useScrollParallax';
import { useReveal } from '../../hooks/useReveal';
import {
  nutritionStoryData,
  benefitsImage,
  honeyTextureImage,
  productImages,
} from '../../data/siteData';

const BenefitsStoryStage: FC = () => {
  const containerRef = useScrollParallax<HTMLDivElement>();

  const [mangoRef, mangoVisible] = useReveal<HTMLDivElement>({ threshold: 0.15 });
  const [honeyRef, honeyVisible] = useReveal<HTMLDivElement>({ threshold: 0.15 });
  const [jackRef, jackVisible] = useReveal<HTMLDivElement>({ threshold: 0.15 });

  return (
    <Box
      id="benefits"
      ref={containerRef}
      sx={{
        bgcolor: '#FAF6EE',
        py: { xs: 12, md: 20 },
        px: { xs: 3, md: 6, lg: 10 },
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid rgba(23,59,40,0.06)',
      }}
    >
      {/* Background ambient depth glow */}
      <Box
        sx={{
          position: 'absolute',
          top: '25%',
          right: '-8%',
          width: { xs: 320, md: 650 },
          height: { xs: 320, md: 650 },
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(217,148,25,0.06) 0%, transparent 70%)',
          transform: 'translate3d(0, var(--parallax-slow, 0px), 0)',
          pointerEvents: 'none',
        }}
      />

      <Box sx={{ maxWidth: 1350, mx: 'auto' }}>
        {/* Section Header */}
        <Box
          sx={{
            textAlign: 'center',
            maxWidth: 720,
            mx: 'auto',
            mb: { xs: 8, md: 16 },
          }}
        >
          <SectionLabel>Natural Nutrition</SectionLabel>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.6rem' },
              color: '#173B28',
              lineHeight: 1.15,
              mb: 2,
              fontWeight: 400,
            }}
          >
            Nourishment From The Soil
          </Typography>
          <Typography
            sx={{
              color: '#5B3A24',
              fontSize: { xs: '1rem', md: '1.2rem' },
              fontFamily: '"Cormorant Garamond", serif',
              fontStyle: 'italic',
              lineHeight: 1.7,
            }}
          >
            Freshly harvested whole foods nurtured under abundant Tamil Nadu sunshine.
          </Typography>
        </Box>

        {/* ============================================================ */}
        {/* 1. MANGO BENEFITS STORY */}
        {/* ============================================================ */}
        <Box
          ref={mangoRef}
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.1fr 1fr' },
            gap: { xs: 6, md: 10 },
            alignItems: 'center',
            mb: { xs: 14, md: 22 },
            opacity: mangoVisible ? 1 : 0,
            transform: mangoVisible ? 'translateY(0)' : 'translateY(28px)',
            transition: 'opacity 800ms ease, transform 800ms ease',
          }}
        >
          {/* Visual with Scroll Parallax Layering */}
          <Box
            sx={{
              position: 'relative',
              borderRadius: { xs: 2, md: 3 },
              overflow: 'hidden',
              boxShadow: '0 24px 56px rgba(23,59,40,0.12)',
              aspectRatio: '4/5',
              transform: 'translate3d(0, var(--parallax-slow, 0px), 0)',
              transition: 'transform 200ms ease-out',
            }}
          >
            <Box
              component="img"
              src={benefitsImage || productImages.mangoes}
              alt="Sun-kissed mangoes on branch"
              loading="lazy"
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: 24,
                left: 24,
                right: 24,
                bgcolor: 'rgba(23,59,40,0.85)',
                backdropFilter: 'blur(8px)',
                p: 2.5,
                borderRadius: 2,
                color: '#FFFDF8',
              }}
            >
              <Typography sx={{ fontSize: '0.75rem', color: '#D99419', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700 }}>
                Mango Nutrition
              </Typography>
              <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.3rem', fontStyle: 'italic' }}>
                Rich in natural vitamins & carotenoids.
              </Typography>
            </Box>
          </Box>

          {/* Points from nutritionStoryData.mango */}
          <Box>
            <SectionLabel>{nutritionStoryData.mango.subtitle}</SectionLabel>
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: '2rem', md: '2.8rem' },
                color: '#173B28',
                mb: 4,
                fontWeight: 500,
              }}
            >
              {nutritionStoryData.mango.title}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
              {nutritionStoryData.mango.benefits.map((b) => (
                <Box key={b.title}>
                  <Typography
                    sx={{
                      fontFamily: '"Cormorant Garamond", serif',
                      fontSize: '1.25rem',
                      fontWeight: 600,
                      color: '#173B28',
                      mb: 0.6,
                    }}
                  >
                    {b.title}
                  </Typography>
                  <Typography sx={{ fontSize: '0.92rem', color: '#5B3A24', lineHeight: 1.65 }}>
                    {b.detail}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* ============================================================ */}
        {/* 2. HONEY BENEFITS STORY */}
        {/* ============================================================ */}
        <Box
          ref={honeyRef}
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1.1fr' },
            gap: { xs: 6, md: 10 },
            alignItems: 'center',
            mb: { xs: 14, md: 22 },
            opacity: honeyVisible ? 1 : 0,
            transform: honeyVisible ? 'translateY(0)' : 'translateY(28px)',
            transition: 'opacity 800ms ease, transform 800ms ease',
          }}
        >
          {/* Points from nutritionStoryData.honey (Left on desktop) */}
          <Box sx={{ order: { xs: 2, md: 1 } }}>
            <SectionLabel>{nutritionStoryData.honey.subtitle}</SectionLabel>
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: '2rem', md: '2.8rem' },
                color: '#173B28',
                mb: 4,
                fontWeight: 500,
              }}
            >
              {nutritionStoryData.honey.title}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
              {nutritionStoryData.honey.benefits.map((b) => (
                <Box key={b.title}>
                  <Typography
                    sx={{
                      fontFamily: '"Cormorant Garamond", serif',
                      fontSize: '1.25rem',
                      fontWeight: 600,
                      color: '#B45309',
                      mb: 0.6,
                    }}
                  >
                    {b.title}
                  </Typography>
                  <Typography sx={{ fontSize: '0.92rem', color: '#5B3A24', lineHeight: 1.65 }}>
                    {b.detail}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Honey Visual (Right on desktop) */}
          <Box
            sx={{
              order: { xs: 1, md: 2 },
              position: 'relative',
              borderRadius: { xs: 2, md: 3 },
              overflow: 'hidden',
              boxShadow: '0 24px 56px rgba(180,83,9,0.14)',
              aspectRatio: '4/5',
              transform: 'translate3d(0, var(--parallax-mid, 0px), 0)',
              transition: 'transform 200ms ease-out',
            }}
          >
            <Box
              component="img"
              src={honeyTextureImage || productImages.honey}
              alt="Raw honeycomb and blossom nectar"
              loading="lazy"
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: 24,
                left: 24,
                right: 24,
                bgcolor: 'rgba(23,59,40,0.85)',
                backdropFilter: 'blur(8px)',
                p: 2.5,
                borderRadius: 2,
                color: '#FFFDF8',
              }}
            >
              <Typography sx={{ fontSize: '0.75rem', color: '#FCD34D', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700 }}>
                Apiary Purity
              </Typography>
              <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.3rem', fontStyle: 'italic' }}>
                Cold-extracted raw honey with active floral pollen.
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* ============================================================ */}
        {/* 3. JACKFRUIT BENEFITS STORY */}
        {/* ============================================================ */}
        <Box
          ref={jackRef}
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.1fr 1fr' },
            gap: { xs: 6, md: 10 },
            alignItems: 'center',
            opacity: jackVisible ? 1 : 0,
            transform: jackVisible ? 'translateY(0)' : 'translateY(28px)',
            transition: 'opacity 800ms ease, transform 800ms ease',
          }}
        >
          {/* Jackfruit Visual */}
          <Box
            sx={{
              position: 'relative',
              borderRadius: { xs: 2, md: 3 },
              overflow: 'hidden',
              boxShadow: '0 24px 56px rgba(46,105,48,0.12)',
              aspectRatio: '4/5',
              transform: 'translate3d(0, var(--parallax-slow, 0px), 0)',
              transition: 'transform 200ms ease-out',
            }}
          >
            <Box
              component="img"
              src={productImages.jackfruit}
              alt="Fresh sweet honey jackfruit"
              loading="lazy"
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: 24,
                left: 24,
                right: 24,
                bgcolor: 'rgba(23,59,40,0.85)',
                backdropFilter: 'blur(8px)',
                p: 2.5,
                borderRadius: 2,
                color: '#FFFDF8',
              }}
            >
              <Typography sx={{ fontSize: '0.75rem', color: '#86EFAC', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700 }}>
                Mukkani Heritage
              </Typography>
              <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.3rem', fontStyle: 'italic' }}>
                Wholesome dietary fiber & potassium.
              </Typography>
            </Box>
          </Box>

          {/* Points from nutritionStoryData.jackfruit */}
          <Box>
            <SectionLabel>{nutritionStoryData.jackfruit.subtitle}</SectionLabel>
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: '2rem', md: '2.8rem' },
                color: '#173B28',
                mb: 4,
                fontWeight: 500,
              }}
            >
              {nutritionStoryData.jackfruit.title}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
              {nutritionStoryData.jackfruit.benefits.map((b) => (
                <Box key={b.title}>
                  <Typography
                    sx={{
                      fontFamily: '"Cormorant Garamond", serif',
                      fontSize: '1.25rem',
                      fontWeight: 600,
                      color: '#2E6930',
                      mb: 0.6,
                    }}
                  >
                    {b.title}
                  </Typography>
                  <Typography sx={{ fontSize: '0.92rem', color: '#5B3A24', lineHeight: 1.65 }}>
                    {b.detail}
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

export default BenefitsStoryStage;
