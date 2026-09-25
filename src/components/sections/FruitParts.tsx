import { type FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useReveal } from '@/hooks/useReveal';
import SectionLabel from '@/components/layout/SectionLabel';

export type FruitPart = {
  name: string;
  description: string;
  image: string;
};

interface FruitPartsProps {
  id: string;
  label: string;
  heading: string;
  parts: FruitPart[];
  bgcolor?: string;
}

const FruitParts: FC<FruitPartsProps> = ({
  id,
  label,
  heading,
  parts,
  bgcolor = '#FFFDF8',
}) => {
  return (
    <Box
      id={id}
      sx={{
        bgcolor,
        py: { xs: 8, md: 14 },
        px: { xs: 3, md: 6, lg: 8 },
        scrollMarginTop: { xs: 80, md: 96 },
      }}
    >
      <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
        <Box sx={{ mb: { xs: 6, md: 8 }, maxWidth: 720 }}>
          <SectionLabel>{label}</SectionLabel>
          <Typography variant="h2">{heading}</Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
            gap: { xs: 3, md: 4 },
            alignItems: 'stretch',
          }}
        >
          {parts.map((part, i) => (
            <PartCard key={part.name} part={part} index={i} />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

const PartCard: FC<{ part: FruitPart; index: number }> = ({ part, index }) => {
  const [ref, visible] = useReveal<HTMLDivElement>({ threshold: 0.15 });
  return (
    <Box
      ref={ref}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(18px)',
        transition: `opacity 1100ms cubic-bezier(0.22, 1, 0.36, 1) ${index * 90}ms, transform 1100ms cubic-bezier(0.22, 1, 0.36, 1) ${index * 90}ms`,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 1,
          aspectRatio: '3 / 4',
          mb: 2.5,
          '&:hover img': { transform: 'scale(1.04)' },
        }}
      >
        <img
          src={part.image}
          alt={part.name}
          width={800}
          height={1067}
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
      <Typography variant="h5" sx={{ mb: 1, color: '#1C211C' }}>
        {part.name}
      </Typography>
      <Typography
        sx={{
          color: '#5B3A24',
          fontSize: '0.92rem',
          lineHeight: 1.65,
          flexGrow: 1,
        }}
      >
        {part.description}
      </Typography>
    </Box>
  );
};

export default FruitParts;
