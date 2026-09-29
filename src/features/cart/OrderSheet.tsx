import { useState, type FC } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import MinQtyButton from '@/features/cart/MinQtyButton';
import { useCart } from '@/features/cart/CartContext';
import { buildOrderMessage, openOrderWhatsApp } from '@/features/cart/orderWhatsApp';
import { formatINR, getUpiId } from '@/content/site';

const OrderSheet: FC = () => {
  const {
    items,
    customer,
    sheetOpen,
    removeItem,
    updateQty,
    setCustomer,
    openSheet,
    closeSheet,
  } = useCart();
  const [errors, setErrors] = useState<{ name?: string; phone?: string; address?: string }>({});
  const cartTotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleOrder = () => {
    const next: { name?: string; phone?: string; address?: string } = {};
    if (!customer.name.trim()) next.name = 'Name is required';
    if (!/^\d{10}$/.test(customer.phone.trim())) next.phone = 'Enter a 10-digit WhatsApp number';
    if (!customer.address.trim()) next.address = 'Delivery address is required';
    setErrors(next);
    if (Object.keys(next).length > 0 || items.length === 0) return;

    const message = buildOrderMessage({
      farmName: 'TS Farms',
      name: customer.name,
      phone: customer.phone,
      address: customer.address,
      items,
    });
    openOrderWhatsApp(message);
  };

  return (
    <>
      {items.length > 0 && (
        <IconButton
          aria-label="Enter order details"
          onClick={openSheet}
          sx={{
            position: 'fixed',
            bottom: { xs: 80, md: 96 },
            right: { xs: 16, md: 24 },
            zIndex: 1100,
            width: { xs: 52, md: 56 },
            height: { xs: 52, md: 56 },
            bgcolor: '#173B28',
            color: '#FFFDF8',
            boxShadow: 'none',
            filter: 'drop-shadow(0 4px 12px rgba(23, 59, 40, 0.28))',
            '&:hover': { bgcolor: '#0e2a1c' },
          }}
        >
          <Badge badgeContent={items.length} color="secondary">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
      )}

      <Drawer
        anchor="bottom"
        open={sheetOpen}
        onClose={closeSheet}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            maxHeight: '85vh',
            bgcolor: '#FFFDF8',
            overflowAnchor: 'none',
          },
        }}
      >
        <Box sx={{ maxWidth: 720, mx: 'auto', width: '100%', p: { xs: 2.5, md: 4 }, pb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.6rem', color: '#173B28' }}>
              Your details
            </Typography>
            <IconButton aria-label="Close order" onClick={closeSheet} sx={{ color: '#173B28' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {items.length === 0 ? (
            <Typography sx={{ color: '#5B3A24', mb: 2 }}>Your order is empty. Search a product and add quantity.</Typography>
          ) : (
            items.map((item, index) => (
              <Box
                key={`${item.productName}-${index}`}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 2,
                  py: 1.5,
                  borderBottom: '1px solid rgba(23,59,40,0.08)',
                }}
              >
                <Box>
                  <Typography sx={{ color: '#173B28', fontWeight: 600 }}>{item.productName}</Typography>
                  <Typography sx={{ color: '#788267', fontSize: '0.85rem' }}>
                    {item.qty} {item.unit} · {formatINR(item.price)} per {item.unit}
                  </Typography>
                  <Typography sx={{ color: '#173B28', fontSize: '0.9rem', fontWeight: 700 }}>
                    {formatINR(item.price * item.qty)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <MinQtyButton
                    atFloor={item.qty <= item.minQty}
                    minQty={item.minQty}
                    unit={item.unit}
                    label="Decrease quantity"
                    onDecrease={() => updateQty(index, item.qty - 1)}
                  />
                  <Typography sx={{ minWidth: 20, textAlign: 'center' }}>{item.qty}</Typography>
                  <IconButton size="small" aria-label="Increase quantity" onClick={() => updateQty(index, item.qty + 1)}>
                    <AddIcon fontSize="small" />
                  </IconButton>
                  <Button size="small" color="inherit" onClick={() => removeItem(index)}>
                    Remove
                  </Button>
                </Box>
              </Box>
            ))
          )}

          {items.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
              <Typography sx={{ color: '#5B3A24' }}>Total</Typography>
              <Typography sx={{ fontWeight: 700, color: '#173B28', fontSize: '1.15rem' }}>
                {formatINR(cartTotal)}
              </Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
            <TextField
              label="Name"
              value={customer.name}
              onChange={(e) => setCustomer('name', e.target.value)}
              required
              fullWidth
              size="small"
              error={Boolean(errors.name)}
              helperText={errors.name}
            />
            <TextField
              label="Your WhatsApp number"
              value={customer.phone}
              onChange={(e) => setCustomer('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
              required
              fullWidth
              size="small"
              inputProps={{ inputMode: 'numeric', maxLength: 10 }}
              error={Boolean(errors.phone)}
              helperText={errors.phone || '10 digits'}
            />
            <TextField
              label="Delivery address"
              value={customer.address}
              onChange={(e) => setCustomer('address', e.target.value)}
              required
              fullWidth
              multiline
              minRows={3}
              size="small"
              error={Boolean(errors.address)}
              helperText={errors.address}
            />
            <Typography sx={{ color: '#5B3A24', fontSize: '0.9rem' }}>
              Pay the full amount via UPI when you send this order on WhatsApp. UPI ID: {getUpiId()}. Share the payment
              screenshot in the chat.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              disabled={items.length === 0}
              onClick={handleOrder}
              sx={{ py: 1.2, px: 4, alignSelf: 'flex-start' }}
            >
              Pay & order on WhatsApp
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default OrderSheet;
