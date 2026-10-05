import { useEffect, useState, type FC } from 'react';
import Box from '@mui/material/Box';
import { produceBenefits, type ProduceBenefitCard } from '@/content/site';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useReveal } from '@/hooks/useReveal';
import { NAVIGATE_EVENT } from '@/hooks/useSmoothNavigate';

const CYCLE_MS = 3000;
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

// Tuned so about 10% of each tilted side card's visible width sits behind the center card.
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
    transform: `perspective(1400px) translateX(-${SIDE_OFFSET}) rotateY(-22deg) scale(${SIDE_SCALE})`,
    filter: 'blur(3px)',
    opacity: 0.85,
    zIndex: 2,
  },
  right: {
    transform: `perspective(1400px) translateX(${SIDE_OFFSET}) rotateY(22deg) scale(${SIDE_SCALE})`,
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

const ProduceBenefits: FC = () => {
  const count = produceBenefits.length;
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

  useEffect(() => {
    const onNavigate = (event: Event) => {
      const index = produceBenefits.findIndex((card) => card.id === (event as CustomEvent<string>).detail);
      if (index >= 0) setActive(index);
    };
    window.addEventListener(NAVIGATE_EVENT, onNavigate);
    return () => window.removeEventListener(NAVIGATE_EVENT, onNavigate);
  }, []);

  return (
    <Box
      ref={ref}
      component="section"
      aria-roledescription="carousel"
      aria-label="Benefits of our produce"
      sx={{
        position: 'relative',
        bgcolor: '#F6F1E7',
        overflow: 'hidden',
        pt: { xs: 8, md: 14 },
        pb: { xs: 10, md: 16 },
      }}
    >
      {produceBenefits.map((card) => (
        <Box
          key={card.id}
          id={card.id}
          aria-hidden
          sx={{ position: 'absolute', top: 0, left: 0, width: 1, height: 1, scrollMarginTop: { xs: 72, md: 88 } }}
        />
      ))}

      <Box
        sx={{
          position: 'relative',
          width: { xs: 'min(58vw, 260px)', sm: 290, md: 330, lg: 360 },
          aspectRatio: '2 / 3',
          mx: 'auto',
          opacity: reduced || inView ? 1 : 0,
          transform: reduced || inView ? 'translateY(0)' : 'translateY(48px)',
          transition: reduced ? 'none' : `opacity 800ms ${EASE}, transform 800ms ${EASE}`,
        }}
      >
        {produceBenefits.map((card, index) => (
          <BenefitCard
            key={card.id}
            card={card}
            slot={slotFor(index, active, count)}
            reduced={reduced}
            onSelect={() => setActive(index)}
          />
        ))}
      </Box>
    </Box>
  );
};

const BenefitCard: FC<{
  card: ProduceBenefitCard;
  slot: Slot;
  reduced: boolean;
  onSelect: () => void;
}> = ({ card, slot, reduced, onSelect }) => {
  const style = slotStyles[slot];
  const isCenter = slot === 'center';

  return (
    <Box
      aria-hidden={!isCenter}
      onClick={isCenter ? undefined : onSelect}
      sx={{
        position: 'absolute',
        inset: 0,
        borderRadius: { xs: 2, md: 2.5 },
        overflow: 'hidden',
        bgcolor: '#E8B84A',
        boxShadow: isCenter ? '0 28px 60px rgba(91, 58, 36, 0.28)' : '0 14px 30px rgba(91, 58, 36, 0.16)',
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
      <img
        src={card.image}
        alt={`Benefits of ${card.product} for nutrition and health`}
        width={720}
        height={1080}
        loading="lazy"
        decoding="async"
        draggable={false}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    </Box>
  );
};

export default ProduceBenefits;
