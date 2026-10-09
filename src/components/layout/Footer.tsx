import { type FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailIcon from '@mui/icons-material/Email';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import TSLogo from '@/components/layout/TSLogo';
import { navLinks, PHONE, PHONE_SECONDARY, WHATSAPP_PRIMARY, INSTAGRAM_HANDLE, INSTAGRAM_URL, EMAIL } from '@/content/site';

interface FooterProps {
  onNavigate: (target: string, options?: { filter?: string }) => void;
}

const Footer: FC<FooterProps> = ({ onNavigate }) => {
  return (
    <Box
      component="footer"
      id="contact"
      sx={{
        bgcolor: '#173B28',
        color: '#FFFDF8',
        py: { xs: 5, md: 10 },
        px: { xs: 2.5, sm: 4, md: 6, lg: 8 },
      }}
    >
      <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.5fr 1fr 1fr' },
            gap: { xs: 4, md: 8 },
            mb: { xs: 4, md: 6 },
          }}
        >
          {/* Brand */}
          <Box>
            <TSLogo height={56} />
            <Typography
              sx={{
                mt: 1.5,
                color: 'rgba(255,253,248,0.6)',
                fontFamily: '"Cormorant Garamond", serif',
                fontStyle: 'italic',
                fontSize: '1.05rem',
              }}
            >
              From our farm to your home.
            </Typography>
          </Box>

          {/* Links */}
          <Box>
            <Typography
              variant="overline"
              sx={{
                color: '#D99419',
                fontSize: '0.78rem',
                fontWeight: 800,
                letterSpacing: '0.2em',
                display: 'block',
                mb: { xs: 1.8, md: 3 },
              }}
            >
              Explore
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {navLinks.map((link) => (
                <Box
                  key={`${link.label}-${link.target}-${link.filter ?? 'all'}`}
                  component="button"
                  onClick={() => onNavigate(link.target, link.filter ? { filter: link.filter } : undefined)}
                  sx={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    p: { xs: '4px 0', md: 0 },
                    fontFamily: '"Manrope", sans-serif',
                    fontSize: '0.92rem',
                    color: 'rgba(255,253,248,0.75)',
                    '&:hover': { color: '#FFFDF8' },
                  }}
                >
                  {link.label}
                </Box>
              ))}
            </Box>
          </Box>

          {/* Contact */}
          <Box>
            <Typography
              variant="overline"
              sx={{
                color: '#D99419',
                fontSize: '0.78rem',
                fontWeight: 800,
                letterSpacing: '0.2em',
                display: 'block',
                mb: 3,
              }}
            >
              Contact
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, fontSize: '0.9rem' }}>
              <Box component="a" href={`tel:${PHONE}`} sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'rgba(255,253,248,0.75)', textDecoration: 'none' }}>
                <PhoneIcon sx={{ fontSize: '0.9rem' }} /> {PHONE}
              </Box>
              <Box component="a" href={`tel:${PHONE_SECONDARY}`} sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'rgba(255,253,248,0.75)', textDecoration: 'none' }}>
                <PhoneIcon sx={{ fontSize: '0.9rem' }} /> {PHONE_SECONDARY}
              </Box>
              <Box component="a" href={`https://wa.me/91${WHATSAPP_PRIMARY}`} target="_blank" rel="noopener noreferrer" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'rgba(255,253,248,0.75)', textDecoration: 'none' }}>
                <WhatsAppIcon sx={{ fontSize: '0.9rem' }} /> {WHATSAPP_PRIMARY}
              </Box>
              <Box component="a" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'rgba(255,253,248,0.75)', textDecoration: 'none' }}>
                <InstagramIcon sx={{ fontSize: '0.9rem' }} /> @{INSTAGRAM_HANDLE}
              </Box>
              <Box component="a" href={`mailto:${EMAIL}`} sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'rgba(255,253,248,0.75)', textDecoration: 'none' }}>
                <EmailIcon sx={{ fontSize: '0.9rem' }} /> {EMAIL}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'rgba(255,253,248,0.75)' }}>
                <LocalShippingOutlinedIcon sx={{ fontSize: '1rem' }} /> All over India
              </Box>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            borderTop: '1px solid rgba(255,253,248,0.1)',
            pt: 4,
            textAlign: 'center',
          }}
        >
          <Typography
            sx={{
              fontFamily: '"Cormorant Garamond", serif',
              fontStyle: 'italic',
              fontSize: '1.1rem',
              color: '#D99419',
              mb: 2,
            }}
          >
            Thank you for supporting local farming
          </Typography>
          <Typography sx={{ fontSize: '0.8rem', color: 'rgba(255,253,248,0.4)' }}>
            © 2025 TS Farms. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
