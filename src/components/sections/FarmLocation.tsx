import { type FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import { FARM_LOCATION, farmMapEmbedUrl } from '@/content/site';
import { useReveal } from '@/hooks/useReveal';
import SectionLabel from '@/components/layout/SectionLabel';

const FarmLocation: FC = () => {
  const [ref, visible] = useReveal<HTMLDivElement>();

  return (
    <Box
      id="location"
      ref={ref}
      sx={{
        bgcolor: '#FFFDF8',
        py: { xs: 8, md: 12 },
        px: { xs: 3, md: 6, lg: 8 },
      }}
    >
      <Box
        sx={{
          maxWidth: 1400,
          mx: 'auto',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1.4fr' },
          gap: { xs: 4, md: 8 },
          alignItems: 'center',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 700ms ease, transform 700ms ease',
        }}
      >
        <Box>
          <SectionLabel>Visit Us</SectionLabel>
          <Typography variant="h2" sx={{ mb: 2 }}>
            Find the farm.
          </Typography>
          <Typography
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: '#5B3A24',
              fontSize: { xs: '1rem', md: '1.1rem' },
              mb: 3,
            }}
          >
            <PlaceOutlinedIcon sx={{ color: '#173B28' }} /> {FARM_LOCATION.label}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            href={FARM_LOCATION.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ py: 1.2, px: 3 }}
          >
            Open in Google Maps
          </Button>
        </Box>
        <Box
          sx={{
            borderRadius: { xs: '12px', md: '16px' },
            overflow: 'hidden',
            boxShadow: '0 12px 28px rgba(23, 59, 40, 0.12)',
            aspectRatio: { xs: '4 / 3', md: '16 / 9' },
            bgcolor: '#E8E2D4',
          }}
        >
          <Box
            component="iframe"
            title="TS Farms location on Google Maps"
            src={farmMapEmbedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            sx={{ width: '100%', height: '100%', border: 0, display: 'block' }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default FarmLocation;
