import { type FC, useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
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
import TSLogo from '../../components/TSLogo';
import { supabase } from '../../lib/supabase';

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
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');

  const checkUserAuthorization = async (userId: string, email: string, appMetadataRole?: string) => {
    setUserEmail(email);
    // 1. Direct role check in app_metadata
    if (appMetadataRole === 'admin') {
      setAuthorized(true);
      return;
    }

    try {
      // 2. Call server-side check_is_admin RPC
      const { data: rpcIsAdmin, error: rpcError } = await supabase.rpc('check_is_admin');
      if (!rpcError && typeof rpcIsAdmin === 'boolean') {
        setAuthorized(rpcIsAdmin);
        return;
      }

      // 3. Fallback: Query admin_users allowlist directly
      const { data, error } = await supabase
        .from('admin_users')
        .select('user_id')
        .eq('user_id', userId)
        .maybeSingle();

      if (!error && data) {
        setAuthorized(true);
        return;
      }

      setAuthorized(false);
    } catch {
      setAuthorized(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate('/admin/login', { replace: true });
        return;
      }
      setAuthed(true);
      const user = data.session.user;
      await checkUserAuthorization(
        user.id,
        user.email || '',
        (user.app_metadata as Record<string, unknown>)?.role as string | undefined,
      );
    };
    checkAuth();

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session) {
        navigate('/admin/login', { replace: true });
      } else {
        setAuthed(true);
        const user = session.user;
        await checkUserAuthorization(
          user.id,
          user.email || '',
          (user.app_metadata as Record<string, unknown>)?.role as string | undefined,
        );
      }
    });

    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login', { replace: true });
  };

  if (authed === null || authorized === null) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f0' }}>
        <Typography sx={{ color: '#788267', fontSize: '0.9rem' }}>Verifying administrator credentials...</Typography>
      </Box>
    );
  }

  if (authorized === false) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f0', p: 3 }}>
        <Box
          sx={{
            p: 4,
            borderRadius: 2,
            border: '1px solid rgba(23,59,40,0.12)',
            maxWidth: 480,
            textAlign: 'center',
            bgcolor: '#FFFDF8',
            boxShadow: '0 8px 30px rgba(0,0,0,0.05)',
          }}
        >
          <Typography variant="h5" sx={{ color: '#991B1B', fontWeight: 700, mb: 1.5, fontFamily: '"Cormorant Garamond", serif' }}>
            Access Denied
          </Typography>
          <Typography sx={{ color: '#5B3A24', fontSize: '0.9rem', mb: 1 }}>
            Signed in as <strong>{userEmail || 'authenticated user'}</strong>.
          </Typography>
          <Typography sx={{ color: '#788267', fontSize: '0.82rem', mb: 3, lineHeight: 1.6 }}>
            This account does not have administrator authorization. Farm orders, stock levels, and customer records require verified administrative privileges.
          </Typography>
          <Button variant="contained" color="primary" onClick={handleLogout} sx={{ bgcolor: '#173B28' }}>
            Sign Out
          </Button>
        </Box>
      </Box>
    );
  }

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#173B28' }}>
      <Box sx={{ p: 2.5, pb: 3 }}>
        <TSLogo variant="full" color="#FFFDF8" height={28} />
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
            TS Mango Admin
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
