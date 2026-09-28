import { useState, type FC } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import TSLogo from './TSLogo';
import { navLinks, whatsappLink } from '@/content/site';
import { useCart } from '@/features/cart/CartContext';

interface NavbarProps {
  scrolled: boolean;
  onNavigate: (target: string) => void;
}

const Navbar: FC<NavbarProps> = ({ scrolled, onNavigate }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { items, openSheet } = useCart();

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
          transform: scrolled ? 'translateY(-110%)' : 'translateY(0)',
          pointerEvents: scrolled ? 'none' : 'auto',
          transition: 'background-color 700ms cubic-bezier(0.22, 1, 0.36, 1), border-color 700ms cubic-bezier(0.22, 1, 0.36, 1), transform 420ms cubic-bezier(0.22, 1, 0.36, 1)',
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
            sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <TSLogo height={isMobile ? 44 : 52} />
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

          {/* Right: Cart Button & Enquire */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1, md: 2 } }}>
            <IconButton
              onClick={() => {
                if (items.length === 0) return;
                openSheet();
              }}
              disabled={items.length === 0}
              sx={{
                color: logoColor,
                p: 1,
                minWidth: 44,
                minHeight: 44,
                border: '1px solid',
                borderColor: scrolled ? 'rgba(23, 59, 40, 0.15)' : 'rgba(255, 253, 248, 0.25)',
                bgcolor: scrolled ? 'rgba(23, 59, 40, 0.04)' : 'rgba(255, 253, 248, 0.08)',
                opacity: items.length === 0 ? 0.45 : 1,
                '&:hover': {
                  bgcolor: scrolled ? 'rgba(23, 59, 40, 0.08)' : 'rgba(255, 253, 248, 0.15)',
                },
              }}
              aria-label={items.length === 0 ? 'Cart is empty' : 'Enter order details'}
            >
              <Badge
                badgeContent={items.length}
                sx={{
                  '& .MuiBadge-badge': {
                    bgcolor: '#D99419',
                    color: '#FFFDF8',
                    fontWeight: 700,
                    fontSize: '0.72rem',
                  },
                }}
              >
                <ShoppingBagOutlinedIcon sx={{ fontSize: '1.3rem' }} />
              </Badge>
            </IconButton>

            {!isMobile ? (
              <Button
                variant="outlined"
                onClick={() => handleNav('order')}
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
                Order
              </Button>
            ) : (
              <IconButton
                onClick={() => setDrawerOpen(true)}
                sx={{ color: logoColor, minWidth: 44, minHeight: 44, p: 1 }}
                aria-label="Open menu"
              >
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Box>
      </Box>

      {/* Mobile drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: '#F6F1E7',
            width: { xs: '82vw', sm: 300 },
            maxWidth: 340,
            pt: 2.5,
            pb: 4,
            px: 2.5,
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, pb: 1.5, borderBottom: '1px solid rgba(23,59,40,0.1)' }}>
          <TSLogo height={40} />
          <IconButton
            onClick={() => setDrawerOpen(false)}
            sx={{ color: '#173B28', minWidth: 44, minHeight: 44 }}
            aria-label="Close menu"
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <List sx={{ py: 0 }}>
          {navLinks.map((link) => (
            <ListItem key={link.target} disablePadding>
              <ListItemButton
                onClick={() => handleNav(link.target)}
                sx={{
                  py: 1.4,
                  px: 1.5,
                  minHeight: 48,
                  borderRadius: 1.5,
                  '&:hover': { bgcolor: 'rgba(23,59,40,0.06)' },
                }}
              >
                <ListItemText
                  primary={link.label}
                  primaryTypographyProps={{
                    sx: {
                      fontFamily: '"Cormorant Garamond", serif',
                      fontSize: '1.35rem',
                      fontWeight: 600,
                      color: '#173B28',
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
          {/* Enquire navigation item */}
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleNav('order')}
              sx={{
                py: 1.4,
                px: 1.5,
                minHeight: 48,
                borderRadius: 1.5,
                '&:hover': { bgcolor: 'rgba(23,59,40,0.06)' },
              }}
            >
              <ListItemText
                primary="Order"
                primaryTypographyProps={{
                  sx: {
                    fontFamily: '"Cormorant Garamond", serif',
                    fontSize: '1.35rem',
                    fontWeight: 600,
                    color: '#D99419',
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
        <Box sx={{ mt: 'auto', pt: 3 }}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            href={whatsappLink('Hello, I would like to enquire about your products from TS Mango Farming.')}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              py: 1.4,
              minHeight: 44,
              fontWeight: 700,
              fontSize: '0.85rem',
              borderRadius: 1.5,
            }}
          >
            Order on WhatsApp
          </Button>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
