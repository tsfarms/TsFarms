import { useState, type FC } from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Alert from '@mui/material/Alert';
import { useCart } from '../context/CartContext';
import QuantitySelector from './QuantitySelector';
import CheckoutModal from './CheckoutModal';

export const CartDrawer: FC = () => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeItem,
    clearCart,
    mangoTotalKg,
    isMangoMinMet,
    totalAmount,
  } = useCart();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const mangoItems = items.filter((i) => i.category === 'mango');
  const otherItems = items.filter((i) => i.category !== 'mango');

  const mangoProgress = Math.min(100, (mangoTotalKg / 5) * 100);

  const handleOpenCheckout = () => {
    setIsCheckoutOpen(true);
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 440 },
            bgcolor: '#FFFDF8',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        {/* Drawer Header */}
        <Box
          sx={{
            p: 2.5,
            borderBottom: '1px solid rgba(23,59,40,0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <ShoppingBagOutlinedIcon sx={{ color: '#173B28' }} />
            <Typography variant="h6" sx={{ color: '#173B28', fontWeight: 700 }}>
              Your Farm Box
            </Typography>
          </Box>
          <IconButton onClick={() => setIsCartOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* 5 KG Mango Box Rule Progress */}
        {mangoItems.length > 0 && (
          <Box
            sx={{
              p: 2,
              bgcolor: isMangoMinMet ? '#EBF3ED' : '#FEF3C7',
              borderBottom: '1px solid',
              borderColor: isMangoMinMet ? '#C4D9CA' : '#FCD34D',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
              <Typography
                sx={{
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: isMangoMinMet ? '#173B28' : '#92400E',
                }}
              >
                {isMangoMinMet
                  ? `✓ Mango Box Verified (${mangoTotalKg} KG)`
                  : `Mango Minimum: ${mangoTotalKg} / 5 KG`}
              </Typography>
              <Typography sx={{ fontSize: '0.8rem', color: isMangoMinMet ? '#173B28' : '#92400E' }}>
                {isMangoMinMet ? 'Ready to Pack' : `Add ${5 - mangoTotalKg} KG more`}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={mangoProgress}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: 'rgba(0,0,0,0.08)',
                '& .MuiLinearProgress-bar': {
                  bgcolor: isMangoMinMet ? '#173B28' : '#D99419',
                },
              }}
            />
            {!isMangoMinMet && (
              <Typography sx={{ fontSize: '0.74rem', color: '#92400E', mt: 0.8 }}>
                Mangoes ship safely in cushioned 5–6 KG master farm boxes to avoid transit bruise.
              </Typography>
            )}
          </Box>
        )}

        {/* Items List */}
        <Box sx={{ flex: 1, overflowY: 'auto', p: 2.5 }}>
          {items.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <ShoppingBagOutlinedIcon sx={{ fontSize: '3.5rem', color: '#D1D5DB', mb: 2 }} />
              <Typography variant="h6" sx={{ color: '#5B3A24', mb: 1 }}>
                Your farm box is empty
              </Typography>
              <Typography sx={{ fontSize: '0.85rem', color: '#788267', mb: 3 }}>
                Explore our seven signature mango varieties, pure wild honey, and sweet jackfruit.
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  setIsCartOpen(false);
                  const el = document.getElementById('mangoes');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Browse Mango Varieties
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Mango Section */}
              {mangoItems.length > 0 && (
                <Box>
                  <Typography
                    variant="overline"
                    sx={{ color: '#788267', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.1em' }}
                  >
                    Fresh Harvest Mangoes
                  </Typography>
                  {mangoItems.map((item) => (
                    <Box
                      key={item.id}
                      sx={{
                        display: 'flex',
                        gap: 2,
                        py: 1.5,
                        borderBottom: '1px solid rgba(23,59,40,0.06)',
                        alignItems: 'center',
                      }}
                    >
                      <Box
                        component="img"
                        src={item.image}
                        alt={item.name}
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: 1.5,
                          objectFit: 'cover',
                        }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontWeight: 700, color: '#173B28', fontSize: '0.9rem' }}>
                          {item.name}
                        </Typography>
                        <Typography sx={{ fontSize: '0.78rem', color: item.price > 0 ? '#788267' : '#92400E' }}>
                          {item.price > 0 ? `₹${item.price} / KG` : 'Price on Enquiry'}
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          <QuantitySelector
                            quantity={item.quantity}
                            min={5}
                            step={1}
                            unit="KG"
                            size="small"
                            onChange={(qty) => updateQuantity(item.id, qty)}
                          />
                        </Box>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography sx={{ fontWeight: 700, color: '#173B28', fontSize: '0.95rem' }}>
                          {item.price > 0 ? `₹${item.price * item.quantity}` : 'On Enquiry'}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => removeItem(item.id)}
                          sx={{ color: '#9CA3AF', mt: 0.5, '&:hover': { color: '#EF4444' } }}
                          aria-label={`Remove ${item.name}`}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}

              {/* Other Items Section */}
              {otherItems.length > 0 && (
                <Box sx={{ mt: mangoItems.length > 0 ? 2 : 0 }}>
                  <Typography
                    variant="overline"
                    sx={{ color: '#788267', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.1em' }}
                  >
                    Farm Honey & Jackfruit
                  </Typography>
                  {otherItems.map((item) => (
                    <Box
                      key={item.id}
                      sx={{
                        display: 'flex',
                        gap: 2,
                        py: 1.5,
                        borderBottom: '1px solid rgba(23,59,40,0.06)',
                        alignItems: 'center',
                      }}
                    >
                      <Box
                        component="img"
                        src={item.image}
                        alt={item.name}
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: 1.5,
                          objectFit: 'cover',
                        }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontWeight: 700, color: '#173B28', fontSize: '0.9rem' }}>
                          {item.name}
                        </Typography>
                        <Typography sx={{ fontSize: '0.78rem', color: item.price > 0 ? '#788267' : '#92400E' }}>
                          {item.price > 0 ? `₹${item.price} · ${item.unit}` : 'Price on Enquiry'}
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          <QuantitySelector
                            quantity={item.quantity}
                            min={1}
                            step={1}
                            unit="Qty"
                            size="small"
                            onChange={(qty) => updateQuantity(item.id, qty)}
                          />
                        </Box>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography sx={{ fontWeight: 700, color: '#173B28', fontSize: '0.95rem' }}>
                          {item.price > 0 ? `₹${item.price * item.quantity}` : 'On Enquiry'}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => removeItem(item.id)}
                          sx={{ color: '#9CA3AF', mt: 0.5, '&:hover': { color: '#EF4444' } }}
                          aria-label={`Remove ${item.name}`}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          )}
        </Box>

        {/* Drawer Footer */}
        {items.length > 0 && (
          <Box
            sx={{
              p: 2.5,
              borderTop: '1px solid rgba(23,59,40,0.08)',
              bgcolor: '#F6F1E7',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
              <Box>
                <Typography sx={{ color: '#5B3A24', fontSize: '0.88rem', fontWeight: 600 }}>
                  {totalAmount > 0 ? 'Estimated Farm Total:' : 'Total Items:'}
                </Typography>
                <Typography sx={{ fontSize: '0.78rem', color: '#788267' }}>
                  Total Quantity: {items.reduce((sum, i) => sum + i.quantity, 0)} {mangoTotalKg > 0 ? 'KG' : 'Units'}
                </Typography>
              </Box>
              <Typography sx={{ fontWeight: 850, color: '#173B28', fontSize: totalAmount > 0 ? '1.3rem' : '1.05rem' }}>
                {totalAmount > 0 ? `₹${totalAmount.toLocaleString('en-IN')}` : 'Price on Enquiry'}
              </Typography>
            </Box>

            {!isMangoMinMet && (
              <Alert severity="warning" sx={{ mb: 2, fontSize: '0.78rem', py: 0 }}>
                Please reach 5 KG of mangoes to enable checkout.
              </Alert>
            )}

            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Button
                variant="outlined"
                onClick={clearCart}
                sx={{
                  color: '#5B3A24',
                  borderColor: 'rgba(23,59,40,0.2)',
                  fontSize: '0.8rem',
                }}
              >
                Clear
              </Button>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                disabled={!isMangoMinMet}
                endIcon={<ArrowForwardIcon />}
                onClick={handleOpenCheckout}
                sx={{ py: 1.2, fontSize: '0.9rem', fontWeight: 600 }}
              >
                Proceed to Checkout
              </Button>
            </Box>

            <Button
              variant="text"
              onClick={() => setIsCartOpen(false)}
              fullWidth
              sx={{
                mt: 1.5,
                color: '#5B3A24',
                fontSize: '0.8rem',
                textTransform: 'none',
                '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' },
              }}
            >
              ← Continue Shopping
            </Button>
          </Box>
        )}
      </Drawer>

      <CheckoutModal open={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
    </>
  );
};

export default CartDrawer;
