import { type FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { mangoParts } from '../../data/siteData';
import { useReveal } from '../../hooks/useReveal';
import SectionLabel from '../SectionLabel';

const spanStyles: Record<string, object> = {
  tall: { gridRow: 'span 2', aspectRatio: '3/4' },
  wide: { gridColumn: 'span 2', aspectRatio: '2/1' },
  normal: { aspectRatio: '1/1' },
};

const EveryPart: FC = () => {
  return (
    <Box
      sx={{
        bgcolor: '#FFFDF8',
        py: { xs: 8, md: 14 },
        px: { xs: 3, md: 6, lg: 8 },
      }}
    >
      <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
        <Box sx={{ mb: { xs: 6, md: 10 } }}>
          <SectionLabel>Nothing Goes to Waste</SectionLabel>
          <Typography variant="h2">
            Every part of the mango has a purpose.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gridAutoRows: '200px',
            gap: { xs: 2, md: 3 },
          }}
        >
          {mangoParts.map((part, i) => (
            <PartCard key={part.name} part={part} index={i} />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

const PartCard: FC<{ part: typeof mangoParts[0]; index: number }> = ({ part, index }) => {
  const [ref, visible] = useReveal<HTMLDivElement>({ threshold: 0.2 });
  return (
    <Box
      ref={ref}
      sx={{
        ...spanStyles[part.span],
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 1,
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(1.05)',
        transition: `opacity 800ms ease ${index * 100}ms, transform 1000ms ease ${index * 100}ms`,
      }}
    >
      <Box
        component="img"
        src={part.image}
        alt={part.name}
        loading="lazy"
        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, transparent 40%, rgba(23,59,40,0.7) 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          p: 3,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: '#FFFDF8',
            mb: 1,
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(8px)',
            transition: `opacity 600ms ease ${index * 100 + 400}ms, transform 600ms ease ${index * 100 + 400}ms`,
          }}
        >
          {part.name}
        </Typography>
        <Typography
          sx={{
            color: '#FFFDF8',
            opacity: visible ? 0.8 : 0,
            fontSize: '0.85rem',
            lineHeight: 1.5,
            transition: `opacity 600ms ease ${index * 100 + 500}ms`,
          }}
        >
          {part.description}
        </Typography>
      </Box>
    </Box>
  );
};

export default EveryPart;
