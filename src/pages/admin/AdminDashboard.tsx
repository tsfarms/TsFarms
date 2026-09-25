import { type FC, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import {
  getAllProducts,
  getDashboardCounts,
  getEnquiries,
  getOrders,
  type Enquiry,
  type Order,
  type Product,
} from '@/services/firebase';

const AdminDashboard: FC = () => {
  const [totalEnquiries, setTotalEnquiries] = useState(0);
  const [todayEnquiries, setTodayEnquiries] = useState(0);
  const [activeProducts, setActiveProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [lowStock, setLowStock] = useState(0);
  const [recentEnquiries, setRecentEnquiries] = useState<Enquiry[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [counts, enquiries, orders, prods] = await Promise.all([
        getDashboardCounts(),
        getEnquiries(),
        getOrders(),
        getAllProducts(),
      ]);
      setTotalEnquiries(counts.totalEnquiries);
      setTodayEnquiries(counts.todayEnquiries);
      setActiveProducts(counts.activeProducts);
      setTotalOrders(counts.totalOrders);
      setPendingOrders(counts.pendingOrders);
      setRecentEnquiries(enquiries.slice(0, 5));
      setRecentOrders(orders.slice(0, 5));
      setProducts(prods);
      setLowStock(prods.filter((p) => p.stock_status === 'low_stock').length);
      setLoading(false);
    })();
  }, []);

  const metrics = [
    { label: 'Total Orders', value: totalOrders },
    { label: 'Pending Orders', value: pendingOrders },
    { label: 'Total Enquiries', value: totalEnquiries },
    { label: "Today's Enquiries", value: todayEnquiries },
    { label: 'Active Products', value: activeProducts },
    { label: 'Low Stock', value: lowStock },
  ];

  const statusColor = (status: string): 'default' | 'warning' | 'success' | 'error' => {
    switch (status) {
      case 'new': return 'warning';
      case 'pending': return 'warning';
      case 'contacted': return 'success';
      case 'confirmed': return 'success';
      case 'closed': return 'default';
      case 'delivered': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const stockColor = (stock: string): 'default' | 'warning' | 'error' | 'success' => {
    switch (stock) {
      case 'in_stock': return 'success';
      case 'low_stock': return 'warning';
      case 'out_of_stock': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return <Typography sx={{ color: '#788267' }}>Loading...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 600, color: '#173B28', mb: 4 }}>
        Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {metrics.map((m) => (
          <Grid size={{ xs: 6, md: 4 }} key={m.label}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid rgba(23,59,40,0.08)' }}>
              <Typography sx={{ color: '#788267', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', mb: 1 }}>
                {m.label}
              </Typography>
              <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.5rem', fontWeight: 600, color: '#173B28' }}>
                {m.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Typography sx={{ color: '#173B28', fontWeight: 600, fontSize: '1rem', mb: 2 }}>
            Recent Enquiries
          </Typography>
          <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: '1px solid rgba(23,59,40,0.08)' }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f5f0' }}>
                  <TableCell sx={{ fontWeight: 600, color: '#173B28' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#173B28' }}>Phone</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#173B28' }}>Interest</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#173B28' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentEnquiries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} sx={{ textAlign: 'center', color: '#788267', py: 3 }}>
                      No enquiries yet
                    </TableCell>
                  </TableRow>
                ) : (
                  recentEnquiries.map((enq) => (
                    <TableRow key={enq.id} hover>
                      <TableCell>{enq.customer_name ?? '—'}</TableCell>
                      <TableCell>{enq.phone ?? '—'}</TableCell>
                      <TableCell>{enq.product_interest ?? '—'}</TableCell>
                      <TableCell>
                        <Chip label={enq.status} size="small" color={statusColor(enq.status)} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Typography sx={{ color: '#173B28', fontWeight: 600, fontSize: '1rem', mb: 2 }}>
            Product Availability
          </Typography>
          <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: '1px solid rgba(23,59,40,0.08)' }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f5f0' }}>
                  <TableCell sx={{ fontWeight: 600, color: '#173B28' }}>Product</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#173B28' }}>Stock</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((p) => (
                  <TableRow key={p.id} hover>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>
                      <Chip
                        label={p.stock_status.replace('_', ' ')}
                        size="small"
                        color={stockColor(p.stock_status)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      <Typography sx={{ color: '#173B28', fontWeight: 600, fontSize: '1rem', mb: 2 }}>
        Recent Orders
      </Typography>
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: '1px solid rgba(23,59,40,0.08)' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f0' }}>
              <TableCell sx={{ fontWeight: 600, color: '#173B28' }}>Customer</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#173B28' }}>Item</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#173B28' }}>Total</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#173B28' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#173B28' }}>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recentOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} sx={{ textAlign: 'center', color: '#788267', py: 3 }}>
                  No orders yet
                </TableCell>
              </TableRow>
            ) : (
              recentOrders.map((o) => (
                <TableRow key={o.id} hover>
                  <TableCell>{o.customer_name ?? '—'}</TableCell>
                  <TableCell>{o.items[0]?.productName ?? '—'}</TableCell>
                  <TableCell>{o.total_amount}</TableCell>
                  <TableCell>
                    <Chip label={o.status} size="small" color={statusColor(o.status)} />
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.8rem', color: '#788267' }}>
                    {o.created_at ? new Date(o.created_at).toLocaleDateString() : '—'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminDashboard;
