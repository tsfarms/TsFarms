import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/theme';
import HomePage from '@/pages/HomePage';
import { CartProvider } from '@/features/cart/CartContext';

const AdminLogin = lazy(() => import('@/pages/admin/AdminLogin'));
const AdminLayout = lazy(() => import('@/pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('@/pages/admin/AdminProducts'));
const AdminMangoVarieties = lazy(() => import('@/pages/admin/AdminMangoVarieties'));
const AdminEnquiries = lazy(() => import('@/pages/admin/AdminEnquiries'));
const AdminOrders = lazy(() => import('@/pages/admin/AdminOrders'));
const AdminSettings = lazy(() => import('@/pages/admin/AdminSettings'));

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CartProvider>
        <BrowserRouter>
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="mango-varieties" element={<AdminMangoVarieties />} />
                <Route path="enquiries" element={<AdminEnquiries />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
