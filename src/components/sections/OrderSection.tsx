import { useEffect, useMemo, useState, type FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import MinQtyButton from '@/features/cart/MinQtyButton';
import SectionLabel from '@/components/layout/SectionLabel';
import { formatINR, type ShopProduct } from '@/content/site';
import { categoryLabel } from '@/lib/catalog';
import { loadSheetProducts } from '@/lib/sheetCatalog';
import { useCart } from '@/features/cart/CartContext';
import { useReveal } from '@/hooks/useReveal';

const preferredCategories = ['mango', 'honey', 'jackfruit'];

const OrderSection: FC = () => {
  const { items, addItem, updateQty, removeItem, openSheet } = useCart();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [draftQty, setDraftQty] = useState<Record<string, number>>({});
  const [catalog, setCatalog] = useState<ShopProduct[]>([]);
  const [ready, setReady] = useState(false);
  const [ref, visible] = useReveal<HTMLDivElement>({ threshold: 0.08 });

  useEffect(() => {
    let active = true;
    const pull = () => {
      loadSheetProducts()
        .then((products) => {
          if (!active) return;
          setCatalog(products);
          setReady(true);
        })
        .catch((err: unknown) => {
          console.error('product sheet failed', err);
          if (active) setReady(true);
        });
    };
    pull();
    const timer = window.setInterval(pull, 8000);
    const onVisible = () => {
      if (document.visibilityState === 'visible') pull();
    };
    window.addEventListener('focus', pull);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      active = false;
      window.clearInterval(timer);
      window.removeEventListener('focus', pull);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  const filters = useMemo(() => {
    const ids = [...new Set(catalog.map((product) => product.category))];
    ids.sort((a, b) => {
      const ai = preferredCategories.indexOf(a);
      const bi = preferredCategories.indexOf(b);
      if (ai === -1 && bi === -1) return a.localeCompare(b);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
    return [{ id: 'all', label: 'All' }, ...ids.map((id) => ({ id, label: categoryLabel(id) }))];
  }, [catalog]);

  const activeFilter = filter !== 'all' && filters.some((item) => item.id === filter) ? filter : 'all';

  const products = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return catalog.filter((product) => {
      if (activeFilter !== 'all' && product.category !== activeFilter) return false;
      if (!needle) return true;
      return `${product.name} ${product.tagline} ${product.category}`.toLowerCase().includes(needle);
    });
  }, [activeFilter, catalog, query]);

  const cartIndex = (product: ShopProduct) =>
    items.findIndex((item) => item.productName === product.name && item.unit === product.unit);

  const qtyFor = (product: ShopProduct) => {
    const inCart = items.find((item) => item.productName === product.name && item.unit === product.unit);
    if (inCart) return inCart.qty;
    return draftQty[product.id] ?? product.minQty;
  };

  const setProductQty = (product: ShopProduct, next: number) => {
    const min = product.minQty;
    const clamped = Math.max(min, next);
    const index = cartIndex(product);
    if (index >= 0) {
      updateQty(index, clamped);
      return;
    }
    setDraftQty((current) => ({ ...current, [product.id]: clamped }));
  };

  const addProductToCart = (product: ShopProduct) => {
    const qty = qtyFor(product);
    const index = cartIndex(product);
    if (index >= 0) {
      updateQty(index, qty);
      return;
    }
    addItem(product.name, product.category, qty, product.unit, product.minQty, product.price);
  };

  const removeProductFromCart = (product: ShopProduct) => {
    const index = cartIndex(product);
    if (index < 0) return;
    removeItem(index);
    setDraftQty((current) => ({ ...current, [product.id]: product.minQty }));
  };

  return (
    <Box
      id="order"
      ref={ref}
      sx={{
        bgcolor: '#FFFDF8',
        py: { xs: 8, md: 12 },
        px: { xs: 3, md: 6, lg: 8 },
        overflowAnchor: 'none',
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        <SectionLabel>Order</SectionLabel>
        <Typography
          variant="h2"
          sx={{
            mb: 1.5,
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 700ms ease, transform 700ms ease',
          }}
        >
          Search, pick, and order.
        </Typography>
        <Typography sx={{ color: '#5B3A24', mb: 4, maxWidth: 560, fontSize: '1.05rem' }}>
          Choose a product and quantity, then open the cart to enter your details and pay on WhatsApp when you place the order.
        </Typography>

        <TextField
          fullWidth
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search mangoes, honey, jackfruit…"
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: '#788267' }} />,
          }}
          sx={{
            mb: 2.5,
            maxWidth: 520,
            '& .MuiOutlinedInput-root': { bgcolor: '#F6F1E7' },
          }}
        />

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 4 }}>
          {filters.map((item) => (
            <Button
              key={item.id}
              size="small"
              variant={activeFilter === item.id ? 'contained' : 'outlined'}
              onClick={() => setFilter(item.id)}
              sx={{ borderRadius: 5, px: 2 }}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr' },
            gap: 2.5,
            mb: 3,
          }}
        >
          {products.map((product) => {
            const inCart = cartIndex(product) >= 0;
            const qty = qtyFor(product);
            const atFloor = qty <= product.minQty;
            return (
              <Box
                key={product.id}
                sx={{
                  border: '1px solid rgba(23,59,40,0.1)',
                  borderRadius: 1.5,
                  overflow: 'hidden',
                  bgcolor: '#FFFDF8',
                  contain: 'layout style',
                  '&:hover img': { transform: 'scale(1.04)' },
                }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  width={800}
                  height={450}
                  loading="lazy"
                  decoding="async"
                  style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block', transition: 'transform 1.1s cubic-bezier(0.22, 1, 0.36, 1)' }}
                />
                <Box sx={{ p: 2 }}>
                  <Typography sx={{ fontWeight: 700, color: '#173B28' }}>{product.name}</Typography>
                  <Typography sx={{ color: '#788267', fontSize: '0.82rem', mb: 1.5 }}>{product.tagline}</Typography>
                  <Typography sx={{ color: '#5B3A24', fontSize: '0.85rem', mb: 1.5, fontWeight: 600 }}>
                    {formatINR(product.price)} per {product.unit}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <MinQtyButton
                        atFloor={atFloor}
                        minQty={product.minQty}
                        unit={product.unit}
                        label={`Decrease ${product.name}`}
                        onDecrease={() => setProductQty(product, qty - 1)}
                      />
                      <Typography sx={{ minWidth: 28, textAlign: 'center', fontWeight: 700 }}>{qty}</Typography>
                      <IconButton
                        size="small"
                        aria-label={`Increase ${product.name}`}
                        onClick={() => setProductQty(product, qty + 1)}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    <Typography sx={{ fontWeight: 700, color: '#173B28', fontSize: '1rem', whiteSpace: 'nowrap' }}>
                      {formatINR(product.price * qty)}
                    </Typography>
                  </Box>
                  {inCart ? (
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mt: 1.5 }}>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={openSheet}
                        sx={{ py: 0.9 }}
                      >
                        In cart
                      </Button>
                      <Button
                        variant="outlined"
                        color="inherit"
                        aria-label={`Remove ${product.name} from cart`}
                        onClick={() => removeProductFromCart(product)}
                        sx={{ py: 0.9, color: '#5B3A24', borderColor: 'rgba(23,59,40,0.2)' }}
                      >
                        Remove
                      </Button>
                    </Box>
                  ) : (
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={() => addProductToCart(product)}
                      sx={{ mt: 1.5, py: 0.9 }}
                    >
                      Add to cart
                    </Button>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>

        {!ready && (
          <Typography sx={{ color: '#5B3A24', mb: 2 }}>Loading varieties…</Typography>
        )}

        {ready && products.length === 0 && (
          <Typography sx={{ color: '#5B3A24', mb: 2 }}>
            {catalog.length === 0 ? 'No varieties are available right now.' : 'No products match that search.'}
          </Typography>
        )}

        {items.length > 0 && (
          <Button variant="contained" color="primary" onClick={openSheet} sx={{ mt: 1, py: 1.2, px: 3 }}>
            Enter details in cart
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default OrderSection;
