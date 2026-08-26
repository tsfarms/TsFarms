import { type FC, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { supabase } from '../../lib/supabase';

interface Order {
  id: string;
  customer_name: string | null;
  phone: string | null;
  product: string | null;
  quantity_kg: number | null;
  order_type: string | null;
  status: string;
  created_at: string;
}

const AdminOrders: FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    setOrders((data ?? []) as Order[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('orders').update({ status }).eq('id', id);
    fetchOrders();
  };

  if (loading) return <Typography sx={{ color: '#788267' }}>Loading...</Typography>;

  return (
    <Box>
      <Typography variant="h5" sx={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 600, color: '#173B28', mb: 4 }}>
        Orders
      </Typography>

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: '1px solid rgba(23,59,40,0.08)' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f0' }}>
              <TableCell sx={{ fontWeight: 600, color: '#173B28' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#173B28' }}>Customer</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#173B28' }}>Phone</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#173B28' }}>Product</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#173B28' }}>Qty (KG)</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#173B28' }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#173B28' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} sx={{ textAlign: 'center', color: '#788267', py: 4 }}>
                  No orders yet
                </TableCell>
              </TableRow>
            ) : (
              orders.map((o) => (
                <TableRow key={o.id} hover>
                  <TableCell sx={{ fontSize: '0.8rem', color: '#788267' }}>
                    {new Date(o.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{o.customer_name ?? '—'}</TableCell>
                  <TableCell>{o.phone ?? '—'}</TableCell>
                  <TableCell>{o.product ?? '—'}</TableCell>
                  <TableCell>{o.quantity_kg ?? '—'}</TableCell>
                  <TableCell sx={{ textTransform: 'capitalize' }}>{o.order_type ?? '—'}</TableCell>
                  <TableCell>
                    <Select
                      size="small"
                      value={o.status}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                      sx={{ minWidth: 120 }}
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="confirmed">Confirmed</MenuItem>
                      <MenuItem value="delivered">Delivered</MenuItem>
                      <MenuItem value="cancelled">Cancelled</MenuItem>
                    </Select>
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

export default AdminOrders;
