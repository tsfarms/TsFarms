import { type FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { galleryImages } from '@/content/site';
import { useReveal } from '@/hooks/useReveal';
import SectionLabel from '@/components/layout/SectionLabel';

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
            gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
            gap: { xs: 1.5, md: 2.5 },
          }}
        >
          {galleryImages.map((img, i) => (
            <GalleryItem key={img.alt} src={img.src} alt={img.alt} index={i} />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

const GalleryItem: FC<{ src: string; alt: string; index: number }> = ({ src, alt, index }) => {
  const [ref, visible] = useReveal<HTMLDivElement>({ threshold: 0.1 });
  return (
    <Box
      ref={ref}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 1,
        aspectRatio: '4 / 5',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transition: `opacity 1100ms cubic-bezier(0.22, 1, 0.36, 1) ${index * 50}ms, transform 1100ms cubic-bezier(0.22, 1, 0.36, 1) ${index * 50}ms`,
        '&:hover img': { transform: 'scale(1.05)' },
      }}
    >
      <img
        src={src}
        alt={alt}
        width={800}
        height={1000}
        loading="lazy"
        decoding="async"
        style={{
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
