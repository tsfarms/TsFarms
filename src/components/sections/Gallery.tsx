import { type FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { galleryImages } from '@/content/site';
import { useReveal } from '@/hooks/useReveal';
import SectionLabel from '@/components/layout/SectionLabel';

type Span = 'large' | 'tall' | 'wide' | 'normal';

const mixedRadii = [
  '22px 8px 28px 10px',
  '10px 26px 8px 22px',
  '28px 14px 10px 24px',
  '8px 8px 30px 18px',
  '24px 24px 8px 8px',
  '14px 30px 16px 8px',
  '26px 8px 26px 12px',
  '8px 20px 28px 14px',
];

function packRowSpans(kinds: Span[], columns: number): number[] {
  const prefer: Record<Span, number> = {
    large: Math.max(2, Math.round(columns * 0.42)),
    tall: Math.max(2, Math.round(columns * 0.25)),
    wide: Math.max(2, Math.round(columns * 0.33)),
    normal: Math.max(2, Math.round(columns * 0.28)),
  };
  const min = 2;
  const out: number[] = [];
  let used = 0;

  kinds.forEach((kind, i) => {
    if (used >= columns) used = 0;
    const leftover = columns - used;
    const last = i === kinds.length - 1;
    let take = Math.min(prefer[kind], leftover);

    if (last) {
      take = leftover;
    } else {
      const rest = leftover - take;
      if (rest > 0 && rest < min) take = leftover;
      if (take < min) take = leftover;
    }

    out.push(take);
    used += take;
  });

  return out;
}

const desktopSpans = packRowSpans(
  galleryImages.map((img) => img.span),
  12,
);

const Gallery: FC = () => {
  return (
    <Box
      id="gallery"
      sx={{
        bgcolor: '#F6F1E7',
        py: { xs: 8, md: 14 },
        px: { xs: 3, md: 6, lg: 8 },
        scrollMarginTop: { xs: 80, md: 96 },
      }}
    >
      <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
        <Box sx={{ mb: { xs: 6, md: 8 } }}>
          <SectionLabel>Gallery</SectionLabel>
          <Typography variant="h2">A look around the farm.</Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: { xs: 1.5, md: 2 },
            gridAutoRows: { xs: 170, sm: 200, md: 250 },
          }}
        >
          {galleryImages.map((img, i) => (
            <GalleryItem
              key={img.alt}
              src={img.src}
              alt={img.alt}
              colSpan={desktopSpans[i] ?? 3}
              index={i}
              lastOdd={i === galleryImages.length - 1 && galleryImages.length % 2 === 1}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

const GalleryItem: FC<{
  src: string;
  alt: string;
  colSpan: number;
  index: number;
  lastOdd: boolean;
}> = ({ src, alt, colSpan, index, lastOdd }) => {
  const [ref, visible] = useReveal<HTMLDivElement>({ threshold: 0.05 });
  return (
    <Box
      ref={ref}
      sx={{
        position: 'relative',
        gridColumn: { xs: lastOdd ? 'span 12' : 'span 6', md: `span ${colSpan}` },
        overflow: 'hidden',
        borderRadius: mixedRadii[index % mixedRadii.length],
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transition: `opacity 1100ms cubic-bezier(0.22, 1, 0.36, 1) ${index * 50}ms, transform 1100ms cubic-bezier(0.22, 1, 0.36, 1) ${index * 50}ms`,
        '&:hover img': { transform: 'scale(1.05)' },
      }}
    >
      <Box
        component="img"
        src={src}
        alt={alt}
        width={800}
        height={1000}
        loading="lazy"
        decoding="async"
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          transition: 'transform 1.15s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      />
    </Box>
  );
};

export default Gallery;
