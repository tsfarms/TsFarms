import { useEffect, useRef, useState, type FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SectionLabel from '../SectionLabel';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export interface BenefitImageItem {
  src: string;
  alt: string;
  badge?: string;
}

interface StickyBenefitsParallaxProps {
  id: string;
  title: string;
  subtitle: string;
  images: BenefitImageItem[];
  bgColor?: string;
  accentColor?: string;
}

export const StickyBenefitsParallax: FC<StickyBenefitsParallaxProps> = ({
  id,
  title,
  subtitle,
  images,
  bgColor = '#FAF6EE',
  accentColor = '#173B28',
}) => {
  const reduced = usePrefersReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (reduced) return;

    let ticking = false;
    const count = images.length;

    const updateParallax = () => {
      if (!trackRef.current) {
        ticking = false;
        return;
      }

      const rect = trackRef.current.getBoundingClientRect();
      const winH = window.innerHeight;
      const totalScroll = rect.height - winH;

      if (totalScroll <= 0) {
        ticking = false;
        return;
      }

      // Progress through this sticky section (0 to 1)
      const p = Math.max(0, Math.min(1, -rect.top / totalScroll));

      // Calculate which image is active based on scroll progress
      const segment = 1 / count;
      let currentActive = Math.floor(p / segment);
      if (currentActive >= count) currentActive = count - 1;
      if (currentActive < 0) currentActive = 0;

      setActiveIdx((prev) => (prev !== currentActive ? currentActive : prev));

      // Continuous, buttery-smooth GPU transform on each image layer
      images.forEach((_, i) => {
        const el = imageRefs.current[i];
        if (!el) return;

        // Center point of this image in progress space
        const centerP = (i + 0.5) * segment;
        const delta = (p - centerP) / segment; // 0 when perfectly centered, -1 when below, +1 when above

        const absDelta = Math.abs(delta);

        if (absDelta < 0.4) {
          // ACTIVE: Sharp, clear, dominant
          const focusRatio = 1 - absDelta / 0.4;
          const y = delta * -30; // slight subtle drift
          const blur = Math.max(0, (1 - focusRatio) * 3);
          const opacity = 0.85 + focusRatio * 0.15;
          const scale = 0.98 + focusRatio * 0.04;

          el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
          el.style.filter = `blur(${blur.toFixed(1)}px)`;
          el.style.opacity = opacity.toFixed(2);
          el.style.zIndex = '3';
        } else if (delta < -0.4) {
          // BELOW / ENTERING: Blurred, lower opacity, shifted downward
          const enterProgress = Math.min(1.5, Math.abs(delta) - 0.4);
          const y = enterProgress * 90;
          const blur = Math.min(10, 3 + enterProgress * 7);
          const opacity = Math.max(0.15, 0.85 - enterProgress * 0.6);
          const scale = Math.max(0.88, 0.98 - enterProgress * 0.08);

          el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
          el.style.filter = `blur(${blur.toFixed(1)}px)`;
          el.style.opacity = opacity.toFixed(2);
          el.style.zIndex = '1';
        } else {
          // ABOVE / EXITING: Blurred, lower opacity, shifted upward
          const exitProgress = Math.min(1.5, delta - 0.4);
          const y = -exitProgress * 90;
          const blur = Math.min(10, 3 + exitProgress * 7);
          const opacity = Math.max(0.15, 0.85 - exitProgress * 0.6);
          const scale = Math.max(0.88, 0.98 - exitProgress * 0.08);

          el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
          el.style.filter = `blur(${blur.toFixed(1)}px)`;
          el.style.opacity = opacity.toFixed(2);
          el.style.zIndex = '1';
        }
      });

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateParallax();

    return () => window.removeEventListener('scroll', onScroll);
  }, [images, reduced]);

  return (
    <Box
      id={id}
      ref={trackRef}
      sx={{
        position: 'relative',
        height: { xs: 'auto', md: '250vh' },
        bgcolor: bgColor,
        borderTop: '1px solid rgba(23,59,40,0.06)',
      }}
    >
      {/* Sticky Parallax Stage */}
      <Box
        sx={{
          position: { xs: 'relative', md: 'sticky' },
          top: 0,
          height: { xs: 'auto', md: '100vh' },
          minHeight: { xs: 'auto', md: '100vh' },
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          py: { xs: 10, md: 0 },
          px: { xs: 3, md: 6 },
        }}
      >
        <Box sx={{ maxWidth: 1200, mx: 'auto', width: '100%', textAlign: 'center' }}>
          {/* STABLE, CALM EDITORIAL HEADER (NO LONG DESCRIPTIONS) */}
          <Box sx={{ mb: { xs: 4, md: 5 } }}>
            <SectionLabel color={accentColor}>{subtitle}</SectionLabel>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2.4rem', sm: '3.2rem', md: '4rem' },
                color: '#173B28',
                lineHeight: 1.1,
                mb: 1.5,
                fontWeight: 400,
              }}
            >
              {title}
            </Typography>

            {/* Subtle Active Indicator */}
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1.5,
                bgcolor: 'rgba(23,59,40,0.06)',
                px: 2,
                py: 0.5,
                borderRadius: 20,
              }}
            >
              {images.map((_, i) => (
                <Box
                  key={i}
                  sx={{
                    width: activeIdx === i ? 24 : 8,
                    height: 8,
                    borderRadius: 4,
                    bgcolor: activeIdx === i ? accentColor : 'rgba(23,59,40,0.2)',
                    transition: 'all 300ms ease',
                  }}
                />
              ))}
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#173B28', ml: 0.5 }}>
                0{activeIdx + 1} / 0{images.length}
              </Typography>
            </Box>
          </Box>

          {/* ============================================================ */}
          {/* THE STACK OF BENEFIT IMAGES (IMAGE IS THE PRIMARY MOVING ELEMENT) */}
          {/* Active = Sharp & Dominant; Inactive = Blurred & De-emphasized */}
          {/* ============================================================ */}
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              maxWidth: { xs: '92vw', sm: '80vw', md: '820px' },
              height: { xs: '52vh', sm: '56vh', md: '60vh' },
              mx: 'auto',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {images.map((item, i) => (
              <Box
                key={i}
                ref={(el: HTMLDivElement | null) => {
                  imageRefs.current[i] = el;
                }}
                sx={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  borderRadius: { xs: 2, md: 3 },
                  overflow: 'hidden',
                  boxShadow: '0 28px 64px rgba(23,59,40,0.14)',
                  bgcolor: '#EAE4D6',
                  willChange: 'transform, filter, opacity',
                  transition: reduced ? 'opacity 400ms ease, filter 400ms ease' : 'none',
                  opacity: i === 0 ? 1 : 0.25,
                  filter: i === 0 ? 'none' : 'blur(8px)',
                  transform: i === 0 ? 'translate3d(0,0,0) scale(1)' : 'translate3d(0,80px,0) scale(0.92)',
                }}
              >
                <Box
                  component="img"
                  src={item.src}
                  alt={item.alt}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />

                {item.badge && (
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: { xs: 16, md: 24 },
                      left: { xs: 16, md: 24 },
                      bgcolor: 'rgba(23,59,40,0.85)',
                      backdropFilter: 'blur(8px)',
                      color: '#FFFDF8',
                      px: 2.2,
                      py: 0.8,
                      borderRadius: 20,
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      letterSpacing: '0.04em',
                    }}
                  >
                    {item.badge}
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default StickyBenefitsParallax;
