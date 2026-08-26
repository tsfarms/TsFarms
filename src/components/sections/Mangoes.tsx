import { useState, type FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { mangoVarieties, whatsappLink, type MangoVariety } from '../../data/siteData';
import { useReveal } from '../../hooks/useReveal';
import SectionLabel from '../SectionLabel';

interface MangoesProps {
  onNavigate: (target: string) => void;
}

const Mangoes: FC<MangoesProps> = () => {
  const [selected, setSelected] = useState<MangoVariety | null>(null);
  const [ref, visible] = useReveal<HTMLDivElement>({ threshold: 0.1 });
  const [detailRef, detailVisible] = useReveal<HTMLDivElement>({ threshold: 0.2 });

  const handleAskPrice = (varietyName: string) => {
    const message = `Hello, I am interested in ${varietyName} mangoes from TS Mango Farming. Please share today's price. Minimum order 5–6 KG.`;
    window.open(whatsappLink(message), '_blank', 'noopener,noreferrer');
  };

  if (selected) {
    return (
      <Box
        id="mangoes"
        ref={detailRef}
        sx={{
          bgcolor: '#F6F1E7',
          py: { xs: 8, md: 12 },
          px: { xs: 3, md: 6, lg: 8 },
          minHeight: '100vh',
        }}
      >
        <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => setSelected(null)}
            sx={{
              color: '#5B3A24',
              mb: 4,
              fontSize: '0.85rem',
              textTransform: 'none',
              '&:hover': { bgcolor: 'transparent', opacity: 0.7 },
            }}
          >
            Back to Varieties
          </Button>

          <Box
            sx={{
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
                aspectRatio: '4/5',
                opacity: detailVisible ? 1 : 0,
                transform: detailVisible ? 'scale(1)' : 'scale(1.05)',
                transition: 'opacity 800ms ease, transform 1000ms ease',
              }}
            >
              <Box
                component="img"
                src={selected.image}
                alt={selected.name}
                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </Box>

            <Box>
              <SectionLabel>{selected.season}</SectionLabel>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  mb: 2,
                  opacity: detailVisible ? 1 : 0,
                  transform: detailVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'opacity 700ms ease 200ms, transform 700ms ease 200ms',
                }}
              >
                {selected.name}
              </Typography>
              <Typography
                sx={{
                  color: '#788267',
                  fontSize: '1rem',
                  letterSpacing: '0.05em',
                  mb: 3,
                  opacity: detailVisible ? 1 : 0,
                  transition: 'opacity 700ms ease 300ms',
                }}
              >
                {selected.tagline}
              </Typography>
              <Typography
                sx={{
                  color: '#5B3A24',
                  fontSize: '1.05rem',
                  lineHeight: 1.8,
                  mb: 4,
                  maxWidth: 450,
                  opacity: detailVisible ? 1 : 0,
                  transform: detailVisible ? 'translateY(0)' : 'translateY(12px)',
                  transition: 'opacity 700ms ease 400ms, transform 700ms ease 400ms',
                }}
              >
                {selected.description}
              </Typography>

              <Box sx={{ display: 'flex', gap: 4, mb: 4, flexWrap: 'wrap' }}>
                <Box>
                  <Typography variant="overline" sx={{ color: '#788267', fontSize: '0.7rem' }}>
                    Taste Profile
                  </Typography>
                  <Typography sx={{ color: '#173B28', fontWeight: 600, fontSize: '0.95rem' }}>
                    {selected.taste.join(' • ')}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="overline" sx={{ color: '#788267', fontSize: '0.7rem' }}>
                    Unit
                  </Typography>
                  <Typography sx={{ color: '#173B28', fontWeight: 600, fontSize: '0.95rem' }}>
                    {selected.unit}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="overline" sx={{ color: '#788267', fontSize: '0.7rem' }}>
                    Price
                  </Typography>
                  <Typography sx={{ color: '#173B28', fontWeight: 600, fontSize: '0.95rem' }}>
                    On Enquiry
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="contained"
                color="primary"
                endIcon={<ArrowForwardIcon />}
                onClick={() => handleAskPrice(selected.name)}
                sx={{ py: 1.5, px: 4 }}
              >
                Ask Today's Price
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      id="mangoes"
      ref={ref}
      sx={{
        bgcolor: '#F6F1E7',
        py: { xs: 8, md: 14 },
        px: { xs: 3, md: 6, lg: 8 },
      }}
    >
      <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
        <Box sx={{ mb: { xs: 6, md: 10 } }}>
          <SectionLabel>Our Mangoes</SectionLabel>
          <Typography
            variant="h2"
            sx={{
              mb: 2,
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 700ms ease, transform 700ms ease',
            }}
          >
            Our mangoes.
          </Typography>
          <Typography
            sx={{
              color: '#5B3A24',
              fontSize: '1.1rem',
              fontFamily: '"Cormorant Garamond", serif',
              fontStyle: 'italic',
              opacity: visible ? 1 : 0,
              transition: 'opacity 700ms ease 200ms',
            }}
          >
            Different varieties. Different character. One farm.
          </Typography>
        </Box>

        {/* Horizontal scroll gallery */}
        <Box
          sx={{
            display: 'flex',
            gap: { xs: 3, md: 5 },
            overflowX: 'auto',
            overflowY: 'hidden',
            pb: 3,
            scrollSnapType: 'x mandatory',
            '&::-webkit-scrollbar': { height: '4px' },
            '&::-webkit-scrollbar-track': { bgcolor: 'rgba(23,59,40,0.05)' },
            '&::-webkit-scrollbar-thumb': { bgcolor: '#788267', borderRadius: 2 },
          }}
        >
          {mangoVarieties.map((variety, i) => (
            <Box
              key={variety.id}
              onClick={() => setSelected(variety)}
              sx={{
                flex: { xs: '0 0 75%', sm: '0 0 45%', md: '0 0 35%', lg: '0 0 28%' },
                scrollSnapAlign: 'start',
                cursor: 'pointer',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(30px)',
                transition: `opacity 700ms ease ${i * 80}ms, transform 700ms ease ${i * 80}ms`,
                '&:hover .variety-image': { transform: 'scale(1.04)' },
              }}
            >
              <Box
                className="variety-image"
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: 1,
                  aspectRatio: '3/4',
                  mb: 3,
                  transition: 'transform 600ms ease',
                }}
              >
                <Box
                  component="img"
                  src={variety.image}
                  alt={variety.name}
                  loading="lazy"
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, transparent 60%, rgba(23,59,40,0.3) 100%)',
                  }}
                />
              </Box>
              <Typography
                variant="h4"
                sx={{ mb: 0.5, fontSize: { xs: '1.5rem', md: '1.75rem' } }}
              >
                {variety.name}
              </Typography>
              <Typography
                sx={{
                  color: '#788267',
                  fontSize: '0.85rem',
                  letterSpacing: '0.03em',
                  mb: 1,
                }}
              >
                {variety.tagline}
              </Typography>
              <Typography
                sx={{
                  color: '#5B3A24',
                  fontSize: '0.85rem',
                  mb: 1.5,
                }}
              >
                {variety.season} · Price on enquiry
              </Typography>
              <Box
                component="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAskPrice(variety.name);
                }}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: '"Manrope", sans-serif',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#173B28',
                  '&:hover': { opacity: 0.7 },
                }}
              >
                Ask today's price
                <ArrowForwardIcon sx={{ fontSize: '0.9rem' }} />
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Mangoes;
