import { type FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailIcon from '@mui/icons-material/Email';
import { whatsappLink, PHONE, INSTAGRAM_URL, EMAIL } from '@/content/site';
import { useReveal } from '@/hooks/useReveal';
import SectionLabel from '@/components/layout/SectionLabel';

const channels = [
  {
    label: 'WhatsApp',
    href: whatsappLink('Hello, I would like to enquire about your products from TS Farms.'),
    icon: WhatsAppIcon,
    external: true,
  },
  {
    label: 'Call',
    href: `tel:+91${PHONE}`,
    icon: PhoneIcon,
    external: false,
  },
  {
    label: 'Instagram',
    href: INSTAGRAM_URL,
    icon: InstagramIcon,
    external: true,
  },
  {
    label: 'Email',
    href: `mailto:${EMAIL}`,
    icon: EmailIcon,
    external: false,
  },
];

const Contact: FC = () => {
  const [ref, visible] = useReveal<HTMLDivElement>();

  return (
    <Box
      ref={ref}
      sx={{
        bgcolor: '#F6F1E7',
        py: { xs: 10, md: 16 },
        px: { xs: 3, md: 6, lg: 8 },
      }}
    >
      <Box sx={{ maxWidth: 720, mx: 'auto', textAlign: 'center' }}>
        <SectionLabel align="center">Let's Talk</SectionLabel>
        <Typography
          variant="h2"
          sx={{
            mb: 2,
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
            fontSize: { xs: '0.95rem', md: '1.05rem' },
            lineHeight: 1.7,
            mb: { xs: 4, md: 5 },
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
            justifyContent: 'center',
            alignItems: 'center',
            gap: { xs: 2, md: 3 },
          }}
        >
          {channels.map((item) => {
            const Icon = item.icon;
            return (
              <IconButton
                key={item.label}
                component="a"
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                aria-label={item.label}
                sx={{
                  width: { xs: 56, md: 64 },
                  height: { xs: 56, md: 64 },
                  bgcolor: '#173B28',
                  color: '#FFFDF8',
                  borderRadius: '50%',
                  boxShadow: '0 10px 22px rgba(23, 59, 40, 0.18)',
                  '&:hover': {
                    bgcolor: '#122C1E',
                    color: '#FFFDF8',
                  },
                }}
              >
                <Icon sx={{ fontSize: { xs: 24, md: 28 } }} />
              </IconButton>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default Contact;
