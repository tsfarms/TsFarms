import { type FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { galleryImages } from '../../data/siteData';
import { useReveal } from '../../hooks/useReveal';
import SectionLabel from '../SectionLabel';

const spanMap: Record<string, object> = {
  large: { gridColumn: { md: 'span 2' }, gridRow: { md: 'span 2' }, aspectRatio: '1/1' },
  tall: { gridRow: { md: 'span 2' }, aspectRatio: '3/4' },
  wide: { gridColumn: { md: 'span 2' }, aspectRatio: '2/1' },
  normal: { aspectRatio: '1/1' },
};

const Gallery: FC = () => {
  return (
    <Box
      id="gallery"
      sx={{
        bgcolor: '#F6F1E7',
        py: { xs: 8, md: 14 },
        px: { xs: 3, md: 6, lg: 8 },
      }}
    >
      <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
        <Box sx={{ mb: { xs: 6, md: 10 } }}>
          <SectionLabel>Gallery</SectionLabel>
          <Typography variant="h2">A look around the farm.</Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gridAutoRows: '180px',
            gap: { xs: 2, md: 3 },
          }}
        >
          {galleryImages.map((img, i) => (
            <GalleryItem key={i} src={img.src} alt={img.alt} span={img.span} index={i} />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

const GalleryItem: FC<{ src: string; alt: string; span: string; index: number }> = ({
  src,
  alt,
  span,
  index,
}) => {
  const [ref, visible] = useReveal<HTMLDivElement>({ threshold: 0.1 });
  return (
    <Box
      ref={ref}
      sx={{
        ...spanMap[span],
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 1,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 700ms ease ${index * 60}ms, transform 700ms ease ${index * 60}ms`,
        '&:hover img': { transform: 'scale(1.05)' },
      }}
    >
      <Box
        component="img"
        src={src}
        alt={alt}
        loading="lazy"
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'transform 800ms ease',
        }}
      />
    </Box>
  );
};

export default Gallery;
