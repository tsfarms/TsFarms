import { useEffect, useState, type FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { testimonials } from '@/content/site';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useReveal } from '@/hooks/useReveal';
import SectionLabel from '@/components/layout/SectionLabel';

const CYCLE_MS = 3500;
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
const CENTER_SCALE = 1.05;
const SIDE_SCALE = 0.8;
const SIDE_OFFSET = `${(CENTER_SCALE / 2 + SIDE_SCALE * 0.35) * 100}%`;

type Slot = 'center' | 'left' | 'right' | 'hidden';

function slotFor(index: number, active: number, count: number): Slot {
  const rel = (index - active + count) % count;
  if (rel === 0) return 'center';
  if (rel === 1) return 'right';
  if (rel === count - 1) return 'left';
  return 'hidden';
}

const slotStyles: Record<Slot, { transform: string; filter: string; opacity: number; zIndex: number }> = {
  center: {
    transform: `perspective(1400px) translateX(0) rotateY(0deg) scale(${CENTER_SCALE})`,
    filter: 'blur(0px)',
    opacity: 1,
    zIndex: 3,
  },
  left: {
    transform: `perspective(1400px) translateX(-${SIDE_OFFSET}) rotateY(-18deg) scale(${SIDE_SCALE})`,
    filter: 'blur(3px)',
    opacity: 0.85,
    zIndex: 2,
  },
  right: {
    transform: `perspective(1400px) translateX(${SIDE_OFFSET}) rotateY(18deg) scale(${SIDE_SCALE})`,
    filter: 'blur(3px)',
    opacity: 0.85,
    zIndex: 2,
  },
  hidden: {
    transform: 'perspective(1400px) translateX(0) scale(0.6)',
    filter: 'blur(6px)',
    opacity: 0,
    zIndex: 1,
  },
};

const Testimonials: FC = () => {
  const count = testimonials.length;
  const [active, setActive] = useState(0);
  const [ref, inView] = useReveal<HTMLDivElement>({ threshold: 0.2, once: false });
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced || !inView || count < 2) return;
    const id = window.setInterval(() => {
      if (document.visibilityState === 'visible') setActive((a) => (a + 1) % count);
    }, CYCLE_MS);
    return () => window.clearInterval(id);
  }, [reduced, inView, count, active]);

  return (
    <Box
      id="testimonials"
      ref={ref}
      component="section"
      aria-roledescription="carousel"
      aria-label="Kind words from customers"
      sx={{
        position: 'relative',
        bgcolor: '#173B28',
        overflow: 'hidden',
        py: { xs: 8, md: 12 },
        px: { xs: 2, md: 4 },
      }}
    >
      <Box sx={{ textAlign: 'center', mb: { xs: 3, md: 5 } }}>
        <SectionLabel color="#788267" align="center">
          Kind Words
        </SectionLabel>
      </Box>

      <Box
        sx={{
          position: 'relative',
          width: { xs: 'min(68vw, 280px)', sm: 320, md: 380 },
          minHeight: { xs: 260, sm: 280, md: 300 },
          mx: 'auto',
          opacity: reduced || inView ? 1 : 0,
          transform: reduced || inView ? 'translateY(0)' : 'translateY(48px)',
          transition: reduced ? 'none' : `opacity 800ms ${EASE}, transform 800ms ${EASE}`,
        }}
      >
        {testimonials.map((item, index) => (
          <QuoteCard
            key={`${item.name}-${index}`}
            quote={item.quote}
            name={item.name}
            location={item.location}
            slot={slotFor(index, active, count)}
            reduced={reduced}
            onSelect={() => setActive(index)}
          />
        ))}
      </Box>
    </Box>
  );
};

const QuoteCard: FC<{
  quote: string;
  name: string;
  location: string;
  slot: Slot;
  reduced: boolean;
  onSelect: () => void;
}> = ({ quote, name, location, slot, reduced, onSelect }) => {
  const style = slotStyles[slot];
  const isCenter = slot === 'center';

  return (
    <Box
      aria-hidden={!isCenter}
      onClick={isCenter ? undefined : onSelect}
      sx={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        px: { xs: 2.25, md: 3 },
        py: { xs: 2.5, md: 3 },
        borderRadius: '14px',
        bgcolor: '#F6F1E7',
        boxShadow: isCenter ? '0 24px 48px rgba(0, 0, 0, 0.28)' : '0 12px 28px rgba(0, 0, 0, 0.18)',
        cursor: isCenter ? 'default' : 'pointer',
        pointerEvents: slot === 'hidden' ? 'none' : 'auto',
        willChange: 'transform, filter',
        transform: style.transform,
        filter: style.filter,
        opacity: style.opacity,
        zIndex: style.zIndex,
        transition: reduced
          ? 'none'
          : `transform 750ms ${EASE}, filter 750ms ${EASE}, opacity 750ms ${EASE}, box-shadow 750ms ${EASE}`,
      }}
    >
      <Typography
        sx={{
          color: '#173B28',
          fontFamily: '"Cormorant Garamond", serif',
          fontStyle: 'italic',
          fontSize: { xs: '1.05rem', sm: '1.2rem', md: '1.35rem' },
          lineHeight: 1.45,
          mb: 2,
        }}
      >
        “{quote}”
      </Typography>
      <Typography
        sx={{
          color: '#5B3A24',
          fontSize: { xs: '0.78rem', md: '0.88rem' },
          fontWeight: 700,
          letterSpacing: '0.04em',
        }}
      >
        {name}
      </Typography>
      <Typography sx={{ color: '#788267', fontSize: { xs: '0.72rem', md: '0.82rem' } }}>{location}</Typography>
    </Box>
  );
};

export default Testimonials;
