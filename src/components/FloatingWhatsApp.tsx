import { type FC } from 'react';
import Box from '@mui/material/Box';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { whatsappLink } from '../data/siteData';

const FloatingWhatsApp: FC = () => {
  return (
    <Box
      component="a"
      href={whatsappLink('Hello, I would like to enquire about your products from TS Mango Farming.')}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      sx={{
        position: 'fixed',
        bottom: { xs: 16, md: 24 },
        right: { xs: 16, md: 24 },
        zIndex: 1100,
        width: { xs: 52, md: 56 },
        height: { xs: 52, md: 56 },
        borderRadius: '50%',
        bgcolor: '#25D366',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 20px rgba(37, 211, 102, 0.3)',
        transition: 'transform 300ms ease',
        '&:hover': { transform: 'scale(1.08)' },
      }}
    >
      <WhatsAppIcon sx={{ color: '#FFF', fontSize: { xs: 28, md: 30 } }} />
    </Box>
  );
};

export default FloatingWhatsApp;
