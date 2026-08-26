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
import { supabase } from '../../lib/supabase';

interface Enquiry {
  id: string;
  customer_name: string | null;
  phone: string | null;
  product_interest: string | null;
  status: string;
  created_at: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  stock_status: string;
  is_active: boolean;
}

const AdminDashboard: FC = () => {
  const [totalEnquiries, setTotalEnquiries] = useState(0);
  const [todayEnquiries, setTodayEnquiries] = useState(0);
  const [activeProducts, setActiveProducts] = useState(0);
  const [lowStock, setLowStock] = useState(0);
  const [recentEnquiries, setRecentEnquiries] = useState<Enquiry[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { count: total } = await supabase
        .from('enquiries')
        .select('*', { count: 'exact', head: true });
      setTotalEnquiries(total ?? 0);

      const today = new Date().toISOString().split('T')[0];
      const { count: todayCount } = await supabase
        .from('enquiries')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', `${today}T00:00:00`);
      setTodayEnquiries(todayCount ?? 0);

      const { data: prodData } = await supabase.from('products').select('*');
      const prods = (prodData ?? []) as Product[];
      setProducts(prods);
      setActiveProducts(prods.filter((p) => p.is_active).length);
      setLowStock(prods.filter((p) => p.stock_status === 'low_stock').length);

      const { data: enqData } = await supabase
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      setRecentEnquiries((enqData ?? []) as Enquiry[]);

      setLoading(false);
    })();
  }, []);

  const metrics = [
    { label: 'Total Enquiries', value: totalEnquiries },
    { label: "Today's Enquiries", value: todayEnquiries },
    { label: 'Active Products', value: activeProducts },
    { label: 'Low Stock', value: lowStock },
  ];

  const statusColor = (status: string): 'default' | 'warning' | 'success' | 'error' => {
    switch (status) {
      case 'new': return 'warning';
      case 'contacted': return 'success';
      case 'closed': return 'default';
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
          <Grid size={{ xs: 6, md: 3 }} key={m.label}>
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

      <Grid container spacing={3}>
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
    </Box>
  );
};

export default AdminDashboard;
