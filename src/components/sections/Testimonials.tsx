import { useEffect, useState, type FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useAutoCycle } from '@/hooks/useAutoCycle';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useReveal } from '@/hooks/useReveal';
import { coverflowLook, coverflowSlot, isCoverHidden } from '@/lib/coverflow';
import { fallbackReviews, loadSheetReviews, type SheetReview } from '@/lib/sheetReviews';
import SectionLabel from '@/components/layout/SectionLabel';

const CYCLE_MS = 3500;
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

const Testimonials: FC = () => {
  const [reviews, setReviews] = useState<SheetReview[]>(fallbackReviews);
  const count = reviews.length;
  const [ref, inView] = useReveal<HTMLDivElement>({ threshold: 0.12, once: true });
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useAutoCycle(count, CYCLE_MS, !reduced && count > 1);

  useEffect(() => {
    let alive = true;
    loadSheetReviews()
      .then((items) => {
        if (alive && items.length > 0) setReviews(items);
      })
      .catch((err: unknown) => {
        console.error('reviews sheet failed', err);
      });
    return () => {
      alive = false;
    };
  }, []);

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
        {reviews.map((item, index) => (
          <QuoteCard
            key={`${item.name}-${index}`}
            quote={item.quote}
            name={item.name}
            location={item.location}
            slot={coverflowSlot(index, active, count)}
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
  slot: ReturnType<typeof coverflowSlot>;
  reduced: boolean;
  onSelect: () => void;
}> = ({ quote, name, location, slot, reduced, onSelect }) => {
  const style = coverflowLook(slot, 18);
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
