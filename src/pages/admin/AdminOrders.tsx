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
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { supabase } from '../../lib/supabase';
import type { CartItem } from '../../types/cart';

interface AdminOrder {
  id: string;
  order_code?: string | null;
  customer_name: string | null;
  phone: string | null;
  product: string | null;
  quantity_kg: number | null;
  order_type: string | null;
  status: string;
  total_amount?: number | null;
  mango_total_kg?: number | null;
  delivery_address?: string | null;
  town_city?: string | null;
  district?: string | null;
  pincode?: string | null;
  notes?: string | null;
  items_json?: CartItem[] | string | null;
  created_at: string;
}

const normalizeStatus = (status: string): string => {
  const upper = (status || '').toUpperCase();
  if (upper === 'PENDING') return 'NEW';
  if (upper === 'DISPATCHED') return 'OUT_FOR_DELIVERY';
  return upper || 'NEW';
};

const getStatusColor = (status: string) => {
  const s = normalizeStatus(status);
  switch (s) {
    case 'CONFIRMED':
      return { bgcolor: '#EBF3ED', color: '#173B28' };
    case 'DELIVERED':
      return { bgcolor: '#E0E7FF', color: '#3730A3' };
    case 'CANCELLED':
      return { bgcolor: '#FEE2E2', color: '#991B1B' };
    case 'CONTACTED':
      return { bgcolor: '#E0F2FE', color: '#0369A1' };
    case 'PREPARING':
      return { bgcolor: '#F3E8FF', color: '#6B21A8' };
    case 'OUT_FOR_DELIVERY':
      return { bgcolor: '#FEF9C3', color: '#854D0E' };
    case 'NEW':
    default:
      return { bgcolor: '#FEF3C7', color: '#92400E' };
  }
};

const AdminOrders: FC = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  const fetchOrders = async () => {
    try {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      setOrders((data ?? []) as AdminOrder[]);
    } catch (e) {
      console.error('Error fetching admin orders', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('orders').update({ status }).eq('id', id);
    fetchOrders();
  };

  const parseItems = (order: AdminOrder): CartItem[] => {
    if (!order.items_json) return [];
    if (typeof order.items_json === 'string') {
      try {
        return JSON.parse(order.items_json);
      } catch {
        return [];
      }
    }
    return order.items_json;
  };

  if (loading) return <Typography sx={{ color: '#788267', p: 4 }}>Loading orders...</Typography>;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography
          variant="h5"
          sx={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 600, color: '#173B28' }}
        >
          Farm Orders & Dispatches ({orders.length})
        </Typography>
        <Button variant="outlined" size="small" onClick={fetchOrders}>
          Refresh
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ borderRadius: 2, border: '1px solid rgba(23,59,40,0.08)' }}
      >
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f0' }}>
              <TableCell sx={{ fontWeight: 600, color: '#173B28' }}>Order Code</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#173B28' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#173B28' }}>Customer</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#173B28' }}>Phone</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#173B28' }}>Town/City</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#173B28' }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#173B28' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#173B28', textAlign: 'right' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} sx={{ textAlign: 'center', color: '#788267', py: 4 }}>
                  No orders yet
                </TableCell>
              </TableRow>
            ) : (
              orders.map((o) => {
                const statusStyle = getStatusColor(o.status);
                const orderNumber = o.order_code || o.id.slice(0, 8).toUpperCase();

                return (
                  <TableRow key={o.id} hover>
                    <TableCell sx={{ fontWeight: 700, color: '#173B28', fontSize: '0.85rem' }}>
                      {orderNumber}
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.8rem', color: '#788267' }}>
                      {new Date(o.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{o.customer_name ?? '—'}</TableCell>
                    <TableCell>
                      {o.phone ? (
                        <Box
                          component="a"
                          href={`https://wa.me/91${o.phone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 0.5,
                            color: '#128C7E',
                            textDecoration: 'none',
                            fontWeight: 600,
                            fontSize: '0.82rem',
                          }}
                        >
                          <WhatsAppIcon sx={{ fontSize: '1rem' }} />
                          {o.phone}
                        </Box>
                      ) : (
                        '—'
                      )}
                    </TableCell>
                    <TableCell>{o.town_city || '—'}</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#173B28' }}>
                      {o.total_amount ? `₹${o.total_amount}` : '—'}
                    </TableCell>
                    <TableCell>
                      <Select
                        size="small"
                        value={normalizeStatus(o.status)}
                        onChange={(e) => updateStatus(o.id, e.target.value)}
                        sx={{
                          minWidth: 120,
                          fontSize: '0.8rem',
                          height: 32,
                          bgcolor: statusStyle.bgcolor,
                          color: statusStyle.color,
                          fontWeight: 600,
                        }}
                      >
                        <MenuItem value="NEW">New</MenuItem>
                        <MenuItem value="CONTACTED">Contacted</MenuItem>
                        <MenuItem value="CONFIRMED">Confirmed</MenuItem>
                        <MenuItem value="PREPARING">Preparing</MenuItem>
                        <MenuItem value="OUT_FOR_DELIVERY">Out for Delivery</MenuItem>
                        <MenuItem value="DELIVERED">Delivered</MenuItem>
                        <MenuItem value="CANCELLED">Cancelled</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'right' }}>
                      <IconButton
                        size="small"
                        onClick={() => setSelectedOrder(o)}
                        title="View Full Order Breakdown"
                      >
                        <VisibilityOutlinedIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Order Details Dialog */}
      {selectedOrder && (
        <Dialog
          open={Boolean(selectedOrder)}
          onClose={() => setSelectedOrder(null)}
          maxWidth="sm"
          fullWidth
          PaperProps={{ sx: { borderRadius: 2 } }}
        >
          <DialogTitle
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid rgba(23,59,40,0.08)',
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#173B28' }}>
                Order Details: {selectedOrder.order_code || selectedOrder.id}
              </Typography>
              <Typography sx={{ fontSize: '0.78rem', color: '#788267' }}>
                Placed on {new Date(selectedOrder.created_at).toLocaleString('en-IN')}
              </Typography>
            </Box>
            <IconButton onClick={() => setSelectedOrder(null)} size="small">
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ pt: 2.5 }}>
            {/* Customer Contact Card */}
            <Box sx={{ p: 2, mb: 3, bgcolor: '#F6F1E7', borderRadius: 1.5 }}>
              <Typography sx={{ fontWeight: 700, color: '#173B28', mb: 1, fontSize: '0.9rem' }}>
                Customer & Shipping Info:
              </Typography>
              <Typography sx={{ fontSize: '0.85rem', color: '#173B28' }}>
                <strong>Name:</strong> {selectedOrder.customer_name}
              </Typography>
              <Typography sx={{ fontSize: '0.85rem', color: '#173B28' }}>
                <strong>Phone:</strong> {selectedOrder.phone}
              </Typography>
              <Typography sx={{ fontSize: '0.85rem', color: '#173B28' }}>
                <strong>Address:</strong> {selectedOrder.delivery_address || '—'}
              </Typography>
              <Typography sx={{ fontSize: '0.85rem', color: '#173B28' }}>
                <strong>City / Town:</strong> {selectedOrder.town_city || '—'}
              </Typography>
              <Typography sx={{ fontSize: '0.85rem', color: '#173B28' }}>
                <strong>District:</strong> {selectedOrder.district || '—'} {selectedOrder.pincode ? `(${selectedOrder.pincode})` : ''}
              </Typography>
              {selectedOrder.notes && (
                <Typography sx={{ fontSize: '0.85rem', color: '#92400E', mt: 1 }}>
                  <strong>Special Note:</strong> {selectedOrder.notes}
                </Typography>
              )}
            </Box>

            {/* Itemized breakdown */}
            <Typography sx={{ fontWeight: 700, color: '#173B28', mb: 1.5, fontSize: '0.9rem' }}>
              Itemized Items:
            </Typography>
            {parseItems(selectedOrder).length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}>
                {parseItems(selectedOrder).map((item) => (
                  <Box
                    key={item.id}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 1.5,
                      border: '1px solid rgba(23,59,40,0.08)',
                      borderRadius: 1,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      {item.image && (
                        <Box
                          component="img"
                          src={item.image}
                          alt={item.name}
                          sx={{ width: 40, height: 40, borderRadius: 1, objectFit: 'cover' }}
                        />
                      )}
                      <Box>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: '#173B28' }}>
                          {item.name}
                        </Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: '#788267' }}>
                          ₹{item.price} per {item.unit}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography sx={{ fontWeight: 700, color: '#173B28', fontSize: '0.9rem' }}>
                        {item.quantity} {item.unit}
                      </Typography>
                      <Typography sx={{ fontSize: '0.78rem', color: '#788267' }}>
                        ₹{item.price * item.quantity}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography sx={{ color: '#5B3A24', fontSize: '0.85rem', mb: 2 }}>
                {selectedOrder.product} ({selectedOrder.quantity_kg} KG)
              </Typography>
            )}

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                p: 1.5,
                bgcolor: '#EBF3ED',
                borderRadius: 1,
                fontWeight: 700,
                color: '#173B28',
              }}
            >
              <span>Total Farm Amount:</span>
              <span>₹{selectedOrder.total_amount || '—'}</span>
            </Box>
          </DialogContent>

          <DialogActions sx={{ px: 3, py: 2 }}>
            {selectedOrder.phone && (
              <Button
                variant="contained"
                startIcon={<WhatsAppIcon />}
                href={`https://wa.me/91${selectedOrder.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                  `Hello ${selectedOrder.customer_name}, regarding your order ${selectedOrder.order_code || ''} from TS Mango Farming...`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ bgcolor: '#25D366', color: '#FFF', '&:hover': { bgcolor: '#128C7E' } }}
              >
                Chat on WhatsApp
              </Button>
            )}
            <Button onClick={() => setSelectedOrder(null)}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default AdminOrders;
