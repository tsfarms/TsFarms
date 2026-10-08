import { type FC } from 'react';
import Box from '@mui/material/Box';
import { produceBenefits, type ProduceBenefitCard } from '@/content/site';
import { useAutoCycle } from '@/hooks/useAutoCycle';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useReveal } from '@/hooks/useReveal';
import { coverflowLook, coverflowSlot, isCoverHidden } from '@/lib/coverflow';

const CYCLE_MS = 3000;
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

const benefitFilter: Record<string, string> = {
  mangoes: 'mango',
  honey: 'honey',
  jackfruit: 'jackfruit',
};

interface ProduceBenefitsProps {
  onNavigate: (target: string, options?: { filter?: string }) => void;
}

const ProduceBenefits: FC<ProduceBenefitsProps> = ({ onNavigate }) => {
  const count = produceBenefits.length;
  const reduced = usePrefersReducedMotion();
  const [ref, inView] = useReveal<HTMLDivElement>({ threshold: 0.08, once: true });
  const [active, setActive] = useAutoCycle(count, CYCLE_MS, !reduced);

  const openCategory = (card: ProduceBenefitCard) => {
    onNavigate('order', { filter: benefitFilter[card.id] ?? card.id });
  };

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
            slot={coverflowSlot(index, active, count)}
            reduced={reduced}
            onSelect={() => setActive(index)}
            onOpen={() => openCategory(card)}
          />
        ))}
      </Box>
    </Box>
  );
};

const BenefitCard: FC<{
  card: ProduceBenefitCard;
  slot: ReturnType<typeof coverflowSlot>;
  reduced: boolean;
  onSelect: () => void;
  onOpen: () => void;
}> = ({ card, slot, reduced, onSelect, onOpen }) => {
  const style = coverflowLook(slot, 22);
  const isCenter = slot === 'center';

  return (
    <Box
      aria-hidden={!isCenter}
      role="button"
      tabIndex={isCenter ? 0 : -1}
      onClick={() => {
        onSelect();
        onOpen();
      }}
      onKeyDown={(event) => {
        if (!isCenter) return;
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onOpen();
        }
      }}
      sx={{
        position: 'absolute',
        inset: 0,
        borderRadius: { xs: 2, md: 2.5 },
        overflow: 'hidden',
        bgcolor: '#E8B84A',
        boxShadow: isCenter ? '0 28px 60px rgba(91, 58, 36, 0.28)' : '0 14px 30px rgba(91, 58, 36, 0.16)',
        cursor: 'pointer',
        pointerEvents: isCoverHidden(slot) ? 'none' : 'auto',
        willChange: 'transform, filter',
        WebkitBackfaceVisibility: 'hidden',
        backfaceVisibility: 'hidden',
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
        loading="eager"
        decoding="async"
        draggable={false}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    </Box>
  );
};

export default ProduceBenefits;
