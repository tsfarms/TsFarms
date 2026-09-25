import { useState, type FC, type FormEvent } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { useCart } from '../context/CartContext';
import { submitOrder } from '../services/orderService';
import type { CustomerDetails } from '../types/cart';

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
}

export const CheckoutModal: FC<CheckoutModalProps> = ({ open, onClose }) => {
  const { items, totalAmount, mangoTotalKg, isMangoMinMet, clearCart } = useCart();

  const [form, setForm] = useState<CustomerDetails>({
    name: '',
    phone: '',
    email: '',
    address: '',
    townCity: '',
    district: '',
    pincode: '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof CustomerDetails) => (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (
      !form.name.trim() ||
      !form.phone.trim() ||
      !form.address.trim() ||
      !form.townCity.trim() ||
      !form.district?.trim()
    ) {
      setError('Please fill in Name, Phone, Address, City/Town, and District.');
      return;
    }

    const cleanPhone = form.phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile phone number.');
      return;
    }

    if (form.pincode?.trim() && !/^\d{6}$/.test(form.pincode.trim())) {
      setError('Please enter a valid 6-digit postal PIN code.');
      return;
    }

    if (!isMangoMinMet) {
      setError('Mango minimum requirement is 5 KG per order. Please add more mangoes to your box.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await submitOrder(items, form);
      if (result.success && result.whatsappUrl) {
        // Only open WhatsApp after successful DB record creation
        window.open(result.whatsappUrl, '_blank', 'noopener,noreferrer');
        clearCart();
        onClose();
      } else {
        setError(result.error || 'Unable to record order in farm database. Please try again.');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to complete order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2.5,
          bgcolor: '#FFFDF8',
          border: '1px solid rgba(23,59,40,0.12)',
          m: { xs: 1.5, sm: 3 },
          width: { xs: 'calc(100% - 24px)', sm: 'auto' },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1,
          px: { xs: 2, sm: 3 },
          borderBottom: '1px solid rgba(23,59,40,0.08)',
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ color: '#173B28', fontWeight: 700, fontSize: { xs: '1.05rem', sm: '1.25rem' } }}>
            Delivery Details
          </Typography>
          <Typography sx={{ fontSize: { xs: '0.74rem', sm: '0.8rem' }, color: '#788267' }}>
            Direct farm dispatch to your doorstep across Tamil Nadu & India
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ minWidth: 44, minHeight: 44 }} aria-label="Close delivery details">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 2.5 }}>
          {!isMangoMinMet && (
            <Alert severity="warning" sx={{ mb: 2.5 }}>
              You currently have <strong>{mangoTotalKg} KG</strong> of mangoes. Our orchard requires a minimum box size of <strong>5 KG</strong> for safe transit packing.
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2.5 }}>
              {error}
            </Alert>
          )}

          {/* Quick Item Summary Preview */}
          <Box
            sx={{
              p: 2,
              mb: 3,
              borderRadius: 1.5,
              bgcolor: '#F6F1E7',
              border: '1px solid rgba(23,59,40,0.06)',
            }}
          >
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#173B28', mb: 1 }}>
              Order Breakdown ({items.length} items):
            </Typography>
            {items.map((i) => (
              <Box
                key={i.id}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.82rem',
                  color: '#5B3A24',
                  mb: 0.5,
                }}
              >
                <span>{i.name} ({i.quantity} {i.unit})</span>
                <span>₹{i.price * i.quantity}</span>
              </Box>
            ))}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                fontWeight: 700,
                color: '#173B28',
                pt: 1,
                mt: 1,
                borderTop: '1px dashed rgba(23,59,40,0.15)',
              }}
            >
              <span>Total Farm Value:</span>
              <span>₹{totalAmount.toLocaleString('en-IN')}</span>
            </Box>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <TextField
              label="Full Name *"
              value={form.name}
              onChange={handleChange('name')}
              size="small"
              required
              fullWidth
            />
            <TextField
              label="WhatsApp Phone Number *"
              value={form.phone}
              onChange={handleChange('phone')}
              placeholder="e.g. 9843823047"
              size="small"
              required
              fullWidth
            />
            <TextField
              label="Town / City *"
              value={form.townCity}
              onChange={handleChange('townCity')}
              placeholder="e.g. Chennai, Madurai, Coimbatore"
              size="small"
              required
              fullWidth
            />
            <TextField
              label="District *"
              value={form.district || ''}
              onChange={handleChange('district')}
              placeholder="e.g. Salem, Dindigul, Krishnagiri"
              size="small"
              required
              fullWidth
            />
            <TextField
              label="PIN Code"
              value={form.pincode}
              onChange={handleChange('pincode')}
              placeholder="e.g. 600001"
              size="small"
              fullWidth
            />
            <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
              <TextField
                label="Full Delivery Address *"
                value={form.address}
                onChange={handleChange('address')}
                placeholder="Door No, Street Name, Landmark"
                multiline
                rows={2}
                size="small"
                required
                fullWidth
              />
            </Box>
            <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
              <TextField
                label="Special Requests / Delivery Notes"
                value={form.notes}
                onChange={handleChange('notes')}
                placeholder="e.g. Preferred ripening level, packing instructions"
                size="small"
                fullWidth
              />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            px: { xs: 2, sm: 3 },
            py: 2,
            borderTop: '1px solid rgba(23,59,40,0.08)',
            display: 'flex',
            flexDirection: { xs: 'column-reverse', sm: 'row' },
            gap: { xs: 1.2, sm: 0 },
            justifyContent: 'space-between',
          }}
        >
          <Button onClick={onClose} sx={{ color: '#5B3A24', width: { xs: '100%', sm: 'auto' }, minHeight: 40 }}>
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading || !isMangoMinMet}
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <WhatsAppIcon />}
            sx={{
              py: 1.2,
              px: 3,
              minHeight: 44,
              width: { xs: '100%', sm: 'auto' },
              bgcolor: '#173B28',
              '&:hover': { bgcolor: '#1e4b33' },
            }}
          >
            {loading ? 'Submitting Order...' : 'Send Order to WhatsApp'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CheckoutModal;
