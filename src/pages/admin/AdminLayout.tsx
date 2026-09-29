import { type FC, useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import EmailIcon from '@mui/icons-material/Email';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import TSLogo from '@/components/layout/TSLogo';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/services/firebase';

const drawerWidth = 240;

const navItems = [
  { label: 'Dashboard', path: '/admin', icon: <DashboardIcon /> },
  { label: 'Products', path: '/admin/products', icon: <InventoryIcon /> },
  { label: 'Mango Varieties', path: '/admin/mango-varieties', icon: <CategoryIcon /> },
  { label: 'Enquiries', path: '/admin/enquiries', icon: <EmailIcon /> },
  { label: 'Orders', path: '/admin/orders', icon: <ShoppingCartIcon /> },
  { label: 'Settings', path: '/admin/settings', icon: <SettingsIcon /> },
];

const AdminLayout: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    if (!auth) {
      navigate('/admin/login', { replace: true });
      return;
    }
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setAuthed(false);
        navigate('/admin/login', { replace: true });
        return;
      }
      setAuthed(true);
    });
    return unsub;
  }, [navigate]);

  const handleLogout = () => {
    if (!auth) {
      navigate('/admin/login');
      return;
    }
    signOut(auth).then(() => navigate('/admin/login'));
  };

  if (authed === null) return null;

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#173B28' }}>
      <Box sx={{ p: 2.5, pb: 3 }}>
        <TSLogo height={40} />
      </Box>
      <List sx={{ flex: 1, px: 1.5 }}>
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  setMobileOpen(false);
                }}
                sx={{
                  borderRadius: 1,
                  bgcolor: active ? 'rgba(255,253,248,0.1)' : 'transparent',
                  '&:hover': { bgcolor: 'rgba(255,253,248,0.06)' },
                  py: 1.2,
                }}
              >
                <ListItemIcon sx={{ color: active ? '#D99419' : 'rgba(255,253,248,0.6)', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    sx: {
                      fontSize: '0.85rem',
                      fontWeight: active ? 600 : 500,
                      color: active ? '#FFFDF8' : 'rgba(255,253,248,0.7)',
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Box sx={{ p: 1.5 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{ borderRadius: 1, '&:hover': { bgcolor: 'rgba(255,253,248,0.06)' }, py: 1.2 }}
        >
          <ListItemIcon sx={{ color: 'rgba(255,253,248,0.6)', minWidth: 40 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{ sx: { fontSize: '0.85rem', fontWeight: 500, color: 'rgba(255,253,248,0.7)' } }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f0' }}>
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { width: drawerWidth, border: 'none' },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { width: drawerWidth, border: 'none', boxSizing: 'border-box' },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box sx={{ flex: 1, width: { md: `calc(100% - ${drawerWidth}px)` } }}>
        <Box
          sx={{
            display: { xs: 'flex', md: 'none' },
            alignItems: 'center',
            p: 2,
            bgcolor: '#FFFDF8',
            borderBottom: '1px solid rgba(23,59,40,0.08)',
          }}
        >
          <IconButton onClick={() => setMobileOpen(true)} sx={{ color: '#173B28' }}>
            <MenuIcon />
          </IconButton>
          <Typography sx={{ ml: 2, fontFamily: '"Cormorant Garamond", serif', fontSize: '1.2rem', fontWeight: 600, color: '#173B28' }}>
            TS Farms Admin
          </Typography>
        </Box>
        <Box sx={{ p: { xs: 2, md: 4 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;
