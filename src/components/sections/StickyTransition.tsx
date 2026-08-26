import { useEffect, useRef, useState, type FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
  mangoVarieties,
  honeyImage,
  jackfruitImage,
  whatsappLink,
} from '../../data/siteData';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

const sections = [
  {
    id: 'mango-transition',
    label: 'Mangoes',
    heading: 'Seven varieties. One farm.',
    body: 'From the rich Alphonsa to the rare Grapes Mango — each variety has its own character, season and story.',
    image: mangoVarieties[0].image,
    bg: '#F6F1E7',
    cta: 'Explore Mangoes',
    ctaTarget: 'mangoes',
    message: 'Hello, I am interested in fresh mangoes from TS Mango Farming. Please share today\'s price. Minimum order 5–6 KG.',
  },
  {
    id: 'jackfruit',
    label: 'Jackfruit',
    heading: 'Seasonal by nature.',
    body: 'Fresh jackfruit available during the season. Ask us about current availability.',
    image: jackfruitImage,
    bg: '#e8ebe0',
    cta: 'Ask About Availability',
    ctaTarget: null,
    message: 'Hello, I am interested in fresh jackfruit from TS Mango Farming. Please share today\'s availability and price.',
  },
  {
    id: 'honey',
    label: 'Honey',
    heading: 'Pure sweetness, from the farm.',
    body: 'Natural farm honey, harvested with care. Available in limited quantities.',
    image: honeyImage,
    bg: '#f4ead0',
    cta: 'Enquire About Honey',
    ctaTarget: null,
    message: 'Hello, I am interested in your farm honey from TS Mango Farming. Please share available sizes and prices.',
  },
];

const StickyTransition: FC<{ onNavigate: (target: string) => void }> = ({ onNavigate }) => {
  const reduced = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (reduced) {
      setProgress(1);
      return;
    }
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const total = rect.height - windowHeight;
      if (total <= 0) return;
      const scrolled = Math.max(0, -rect.top);
      const p = Math.min(1, Math.max(0, scrolled / total));
      setProgress(p);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [reduced]);

  const sectionCount = sections.length;
  const segmentSize = 1 / sectionCount;

  return (
    <Box
      ref={containerRef}
      sx={{
        height: reduced ? 'auto' : `${sectionCount * 100}vh`,
        position: 'relative',
      }}
    >
      <Box
        sx={{
          position: reduced ? 'relative' : 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        {sections.map((section, i) => {
          const segStart = i * segmentSize;
          const segEnd = (i + 1) * segmentSize;
          const localProgress = Math.max(
            0,
            Math.min(1, (progress - segStart) / segmentSize),
          );

          const isCurrent = progress >= segStart && progress < segEnd + 0.01;
          const isPast = progress >= segEnd;

          let opacity = 0;
          let scale = 1;
          let translateY = '0%';
          let driftX = 0;

          if (i === 0 && progress < segEnd) {
            opacity = 1;
            if (progress > segStart + segmentSize * 0.6) {
              const fadeOut = (progress - segStart - segmentSize * 0.6) / (segmentSize * 0.4);
              opacity = 1 - fadeOut * 0.6;
              scale = 1 - fadeOut * 0.05;
              driftX = -fadeOut * 30;
            }
          } else if (isPast && i < sectionCount - 1) {
            opacity = 0;
          } else if (isCurrent) {
            if (i === 0) {
              opacity = 1;
            } else {
              const incomingProgress = localProgress;
              opacity = Math.min(1, incomingProgress * 2);
              translateY = `${(1 - Math.min(1, incomingProgress * 1.5)) * 20}%`;
              scale = 0.95 + incomingProgress * 0.05;
            }
          } else if (isPast && i === sectionCount - 1) {
            opacity = 1;
          }

          if (reduced) {
            opacity = 1;
            scale = 1;
            translateY = '0%';
            driftX = 0;
          }

          const textDelay = reduced ? 0 : 0.15;
          const textOpacity = Math.max(0, Math.min(1, (opacity - textDelay) * 2));

          return (
            <Box
              key={section.id}
              id={section.id}
              sx={{
                position: 'absolute',
                inset: 0,
                bgcolor: section.bg,
                opacity: reduced ? (i === 0 ? 1 : 0) : opacity,
                transform: reduced
                  ? i === 0
                    ? 'none'
                    : 'none'
                  : `translateY(${translateY}) scale(${scale}) translateX(${driftX}px)`,
                transition: reduced ? 'none' : 'opacity 200ms ease, transform 200ms ease',
                display: 'flex',
                alignItems: 'center',
                px: { xs: 3, md: 6, lg: 8 },
              }}
            >
              <Box
                sx={{
                  maxWidth: 1400,
                  mx: 'auto',
                  width: '100%',
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                  gap: { xs: 4, md: 8 },
                  alignItems: 'center',
                }}
              >
                {/* Image */}
                <Box
                  sx={{
                    order: { xs: 1, md: i % 2 === 0 ? 1 : 2 },
                    overflow: 'hidden',
                    borderRadius: 1,
                    aspectRatio: '4/3',
                    opacity: reduced ? 1 : opacity,
                    transition: 'opacity 300ms ease',
                  }}
                >
                  <Box
                    component="img"
                    src={section.image}
                    alt={section.label}
                    loading="lazy"
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>

                {/* Text */}
                <Box
                  sx={{
                    order: { xs: 2, md: i % 2 === 0 ? 2 : 1 },
                    opacity: reduced ? 1 : textOpacity,
                    transition: 'opacity 400ms ease',
                  }}
                >
                  <Typography
                    variant="overline"
                    sx={{
                      color: '#788267',
                      fontSize: '0.75rem',
                      letterSpacing: '0.2em',
                      display: 'block',
                      mb: 2,
                    }}
                  >
                    {section.label}
                  </Typography>
                  <Typography
                    variant="h2"
                    sx={{
                      mb: 3,
                      fontSize: { xs: '2rem', md: '3rem' },
                    }}
                  >
                    {section.heading}
                  </Typography>
                  <Typography
                    sx={{
                      color: '#5B3A24',
                      fontSize: '1.05rem',
                      lineHeight: 1.8,
                      mb: 4,
                      maxWidth: 450,
                    }}
                  >
                    {section.body}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => {
                      if (section.ctaTarget) {
                        onNavigate(section.ctaTarget);
                      } else {
                        window.open(whatsappLink(section.message), '_blank', 'noopener,noreferrer');
                      }
                    }}
                    sx={{ py: 1.5, px: 4 }}
                  >
                    {section.cta}
                  </Button>
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default StickyTransition;
