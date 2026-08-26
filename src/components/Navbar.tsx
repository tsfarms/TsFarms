import { useState, type FC } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import TSLogo from './TSLogo';
import { navLinks, whatsappLink } from '../data/siteData';

interface NavbarProps {
  scrolled: boolean;
  onNavigate: (target: string) => void;
}

const Navbar: FC<NavbarProps> = ({ scrolled, onNavigate }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const bgColor = scrolled ? '#F6F1E7' : 'transparent';
  const logoColor = scrolled ? '#173B28' : '#FFFDF8';
  const linkColor = scrolled ? '#1C211C' : '#FFFDF8';
  const borderColor = scrolled ? 'rgba(23, 59, 40, 0.1)' : 'rgba(255, 253, 248, 0.15)';

  const handleNav = (target: string) => {
    onNavigate(target);
    setDrawerOpen(false);
  };

  return (
    <>
      <Box
        component="nav"
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1200,
          bgcolor: bgColor,
          borderBottom: `1px solid ${borderColor}`,
          transition: 'background-color 400ms ease, border-color 400ms ease',
          px: { xs: 2, md: 4, lg: 6 },
          py: { xs: 1.5, md: 2 },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxWidth: 1400,
            mx: 'auto',
          }}
        >
          {/* Logo */}
          <Box
            onClick={() => handleNav('hero')}
            sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', '& svg text': { fill: logoColor } }}
          >
            <TSLogo variant="full" color={logoColor} height={isMobile ? 28 : 34} />
          </Box>

          {/* Desktop nav links */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 4 }}>
              {navLinks.map((link) => (
                <Box
                  key={link.target}
                  component="button"
                  onClick={() => handleNav(link.target)}
                  sx={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: '"Manrope", sans-serif',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    color: linkColor,
                    letterSpacing: '0.03em',
                    opacity: 0.85,
                    transition: 'opacity 200ms ease',
                    '&:hover': { opacity: 1 },
                  }}
                >
                  {link.label}
                </Box>
              ))}
            </Box>
          )}

          {/* Right: Enquire button or mobile menu */}
          {!isMobile ? (
            <Button
              variant="outlined"
              onClick={() => handleNav('contact')}
              sx={{
                color: logoColor,
                borderColor: scrolled ? '#173B28' : 'rgba(255,253,248,0.5)',
                borderWidth: '1px',
                fontSize: '0.8rem',
                px: 3,
                py: 1,
                '&:hover': {
                  borderColor: scrolled ? '#173B28' : '#FFFDF8',
                  bgcolor: 'transparent',
                  borderWidth: '1px',
                },
              }}
            >
              Enquire
            </Button>
          ) : (
            <IconButton
              onClick={() => setDrawerOpen(true)}
              sx={{ color: logoColor }}
              aria-label="Open menu"
            >
              <MenuIcon />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Mobile drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { bgcolor: '#F6F1E7', width: 280, pt: 2 } }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2, mb: 1 }}>
          <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: '#173B28' }} aria-label="Close menu">
            <CloseIcon />
          </IconButton>
        </Box>
        <List>
          {navLinks.map((link) => (
            <ListItem key={link.target} disablePadding>
              <ListItemButton onClick={() => handleNav(link.target)}>
                <ListItemText
                  primary={link.label}
                  primaryTypographyProps={{
                    sx: {
                      fontFamily: '"Cormorant Garamond", serif',
                      fontSize: '1.4rem',
                      fontWeight: 500,
                      color: '#173B28',
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Box sx={{ px: 2, mt: 2 }}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            href={whatsappLink('Hello, I would like to enquire about your products from TS Mango Farming.')}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ py: 1.5 }}
          >
            Enquire Now
          </Button>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
