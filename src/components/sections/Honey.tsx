import { type FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { honeyImage } from '@/content/site';
import { useReveal } from '@/hooks/useReveal';
import SectionLabel from '@/components/layout/SectionLabel';

const Honey: FC = () => {
  const [ref, visible] = useReveal<HTMLDivElement>();

  return (
    <Box
      id="honey"
      sx={{
        bgcolor: '#FFFDF8',
        py: { xs: 8, md: 14 },
        px: { xs: 3, md: 6, lg: 8 },
        scrollMarginTop: { xs: 80, md: 96 },
      }}
    >
      <Box
        ref={ref}
        sx={{
          maxWidth: 1400,
          mx: 'auto',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: { xs: 4, md: 8 },
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            overflow: 'hidden',
            borderRadius: 1,
            aspectRatio: { xs: '4 / 3', md: '5 / 4' },
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 700ms ease, transform 700ms ease',
          }}
        >
          <img
            src={honeyImage}
            alt="Farm honey from TS Mango Farming"
            width={1200}
            height={960}
            loading="lazy"
            decoding="async"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </Box>
        <Box
          sx={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 700ms ease 120ms, transform 700ms ease 120ms',
          }}
        >
          <SectionLabel>Honey</SectionLabel>
          <Typography variant="h2" sx={{ mb: 2.5 }}>
            Pure sweetness, from the farm.
          </Typography>
          <Typography sx={{ color: '#5B3A24', maxWidth: 480, fontSize: { xs: '0.98rem', md: '1.05rem' } }}>
            Stingless bee honey and mountain honey, harvested with care. Both are sold by the kilogram, with a
            minimum order of 1 KG.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Honey;
