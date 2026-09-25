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
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { httpsCallable } from 'firebase/functions';
import { functions, getOrders, updateOrderStatus, type Order } from '@/services/firebase';

const confirmDelivery = functions
  ? httpsCallable(functions, 'sendDeliveryConfirmation')
  : null;

const AdminOrders: FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [snack, setSnack] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchOrders = async () => {
    const data = await getOrders();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    if (status === 'delivered') {
      await markDelivered(id);
      return;
    }
    await updateOrderStatus(id, status);
    fetchOrders();
  };

  async function markDelivered(orderId: string) {
    try {
      if (!confirmDelivery) throw new Error('Firebase is not configured.');
      await confirmDelivery({ orderId });
      setSnack({ open: true, message: 'Delivered! WhatsApp confirmation sent.', severity: 'success' });
      fetchOrders();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Could not mark delivered.';
      setSnack({ open: true, message, severity: 'error' });
    }
  }

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
              <TableCell sx={{ fontWeight: 600, color: '#173B28' }}>Item</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#173B28' }}>Total</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#173B28' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#173B28' }}>Actions</TableCell>
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
                    {o.created_at ? new Date(o.created_at).toLocaleDateString() : '—'}
                  </TableCell>
                  <TableCell>{o.customer_name ?? '—'}</TableCell>
                  <TableCell>{o.customer_phone ?? '—'}</TableCell>
                  <TableCell>{o.items[0]?.productName ?? '—'}</TableCell>
                  <TableCell>{o.total_amount}</TableCell>
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
                  <TableCell>
                    <Button
                      size="small"
                      disabled={o.status === 'delivered'}
                      onClick={() => markDelivered(o.id)}
                    >
                      Mark Delivered
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack((current) => ({ ...current, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snack.severity}
          onClose={() => setSnack((current) => ({ ...current, open: false }))}
          sx={{ borderRadius: 1 }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminOrders;
