import { type FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailIcon from '@mui/icons-material/Email';
import {
  whatsappLink,
  WHATSAPP_PRIMARY,
  PHONE,
  PHONE_SECONDARY,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  EMAIL,
} from '@/content/site';
import { useReveal } from '@/hooks/useReveal';
import SectionLabel from '@/components/layout/SectionLabel';

const Contact: FC = () => {
  const [ref, visible] = useReveal<HTMLDivElement>();

  return (
    <Box
      ref={ref}
      id="contact"
      sx={{
        bgcolor: '#F6F1E7',
        py: { xs: 10, md: 16 },
        px: { xs: 3, md: 6, lg: 8 },
      }}
    >
      <Box sx={{ maxWidth: 900, mx: 'auto', textAlign: 'center' }}>
        <SectionLabel align="center">Let's Talk</SectionLabel>
        <Typography
          variant="h2"
          sx={{
            mb: 5,
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 700ms ease, transform 700ms ease',
          }}
        >
          Looking for something fresh from the farm?
        </Typography>
        <Typography
          sx={{
            color: '#5B3A24',
            fontSize: '1.1rem',
            lineHeight: 1.8,
            mb: 6,
            maxWidth: 500,
            mx: 'auto',
            opacity: visible ? 1 : 0,
            transition: 'opacity 700ms ease 200ms',
          }}
        >
          We'd love to hear from you. Reach out on WhatsApp, call, email, or find us on Instagram.
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 2,
            mb: 4,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            startIcon={<WhatsAppIcon />}
            href={whatsappLink('Hello, I would like to enquire about your products from TS Mango Farming.')}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ py: 1.5, px: 4 }}
          >
            WhatsApp {WHATSAPP_PRIMARY}
          </Button>
          <Button
            variant="outlined"
            startIcon={<PhoneIcon />}
            href={`tel:+91${PHONE}`}
            sx={{
              color: '#173B28',
              borderColor: '#173B28',
              borderWidth: '1px',
              py: 1.5,
              px: 4,
              '&:hover': { borderWidth: '1px', bgcolor: 'rgba(23,59,40,0.04)' },
            }}
          >
            Call {PHONE}
          </Button>
          <Button
            variant="outlined"
            startIcon={<InstagramIcon />}
            href={INSTAGRAM_URL}
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
            Instagram @{INSTAGRAM_HANDLE}
          </Button>
          <Button
            variant="outlined"
            startIcon={<EmailIcon />}
            href={`mailto:${EMAIL}`}
            sx={{
              color: '#173B28',
              borderColor: '#173B28',
              borderWidth: '1px',
              py: 1.5,
              px: 4,
              '&:hover': { borderWidth: '1px', bgcolor: 'rgba(23,59,40,0.04)' },
            }}
          >
            {EMAIL}
          </Button>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 3,
            color: '#788267',
            fontSize: '0.85rem',
          }}
        >
          <Box component="a" href={`tel:+91${PHONE_SECONDARY}`} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'inherit', textDecoration: 'none' }}>
            <PhoneIcon sx={{ fontSize: '0.9rem' }} />
            <span>{PHONE_SECONDARY}</span>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Contact;
