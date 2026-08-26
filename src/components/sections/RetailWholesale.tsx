import { type FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { whatsappLink } from '../../data/siteData';
import { useReveal } from '../../hooks/useReveal';

const RetailWholesale: FC = () => {
  const [ref, visible] = useReveal<HTMLDivElement>();

  return (
    <Box
      ref={ref}
      sx={{
        bgcolor: '#F6F1E7',
        py: { xs: 8, md: 14 },
        px: { xs: 3, md: 6, lg: 8 },
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 0,
          borderTop: '1px solid rgba(23,59,40,0.1)',
          borderBottom: '1px solid rgba(23,59,40,0.1)',
        }}
      >
        {/* Retail */}
        <Box
          sx={{
            p: { xs: 5, md: 8 },
            borderRight: { md: '1px solid rgba(23,59,40,0.1)' },
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 700ms ease, transform 700ms ease',
          }}
        >
          <Typography
            variant="overline"
            sx={{ color: '#788267', fontSize: '0.75rem', letterSpacing: '0.2em', display: 'block', mb: 3 }}
          >
            Retail
          </Typography>
          <Typography variant="h3" sx={{ mb: 3, fontSize: { xs: '1.8rem', md: '2.2rem' } }}>
            Fresh produce for your home.
          </Typography>
          <Typography sx={{ color: '#5B3A24', fontSize: '1.05rem', lineHeight: 1.8, mb: 4 }}>
            Minimum order 5–6 KG. Choose your favourite varieties and we'll deliver them fresh to your door.
          </Typography>
          <Button
            variant="outlined"
            endIcon={<ArrowForwardIcon />}
            href={whatsappLink('Hello, I would like to place a retail order from TS Mango Farming. Please share details. Minimum order 5–6 KG.')}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: '#173B28',
              borderColor: '#173B28',
              borderWidth: '1px',
              py: 1.5,
              px: 4,
              '&:hover': { borderWidth: '1px', bgcolor: 'rgba(23,59,40,0.04)' },
            }}
          >
            Retail Enquiry
          </Button>
        </Box>

        {/* Wholesale */}
        <Box
          sx={{
            p: { xs: 5, md: 8 },
            bgcolor: '#173B28',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 700ms ease 120ms, transform 700ms ease 120ms',
          }}
        >
          <Typography
            variant="overline"
            sx={{ color: '#788267', fontSize: '0.75rem', letterSpacing: '0.2em', display: 'block', mb: 3 }}
          >
            Wholesale
          </Typography>
          <Typography variant="h3" sx={{ mb: 3, color: '#FFFDF8', fontSize: { xs: '1.8rem', md: '2.2rem' } }}>
            Bulk quantities for shops, businesses and events.
          </Typography>
          <Typography sx={{ color: 'rgba(255,253,248,0.75)', fontSize: '1.05rem', lineHeight: 1.8, mb: 4 }}>
            Reliable supply, competitive pricing, and fresh quality for your business or event.
          </Typography>
          <Button
            variant="outlined"
            endIcon={<ArrowForwardIcon />}
            href={whatsappLink('Hello, I would like to place a wholesale order from TS Mango Farming. Please share bulk pricing and availability.')}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: '#FFFDF8',
              borderColor: 'rgba(255,253,248,0.5)',
              borderWidth: '1px',
              py: 1.5,
              px: 4,
              '&:hover': { borderColor: '#FFFDF8', borderWidth: '1px', bgcolor: 'transparent' },
            }}
          >
            Wholesale Enquiry
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default RetailWholesale;
