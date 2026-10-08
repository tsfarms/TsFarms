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
import { ORDER_FILTER_EVENT } from '@/hooks/useSmoothNavigate';

const preferredCategories = ['mango', 'honey', 'jackfruit'];

function normalizeFilter(value: string) {
  const id = value.trim().toLowerCase();
  if (id === 'mangoes' || id === 'mango') return 'mango';
  if (id === 'honey') return 'honey';
  if (id === 'jackfruit') return 'jackfruit';
  return id || 'all';
}

function sortCategoryIds(ids: string[]) {
  return [...ids].sort((a, b) => {
    const ai = preferredCategories.indexOf(a);
    const bi = preferredCategories.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}

const OrderSection: FC = () => {
  const { items, addItem, updateQty, removeItem, openSheet } = useCart();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [draftQty, setDraftQty] = useState<Record<string, number>>({});
  const [catalog, setCatalog] = useState<ShopProduct[]>([]);
  const [ready, setReady] = useState(false);
  const [ref, visible] = useReveal<HTMLDivElement>({ threshold: 0.08 });

  useEffect(() => {
    const onFilter = (event: Event) => {
      const next = normalizeFilter((event as CustomEvent<string>).detail || 'all');
      setFilter(next);
    };
    window.addEventListener(ORDER_FILTER_EVENT, onFilter);
    return () => window.removeEventListener(ORDER_FILTER_EVENT, onFilter);
  }, []);

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
    const ids = sortCategoryIds([...new Set(catalog.map((product) => product.category))]);
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

  const groups = useMemo(() => {
    const ids = sortCategoryIds([...new Set(products.map((product) => product.category))]);
    return ids.map((id) => ({
      id,
      label: categoryLabel(id),
      items: products.filter((product) => product.category === id),
    }));
  }, [products]);

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
    addItem(product.name, product.category, qty, product.unit, product.minQty, product.price, product.qtyStep);
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
        px: { xs: 2, md: 6, lg: 8 },
        overflowAnchor: 'none',
        scrollMarginTop: { xs: 72, md: 88 },
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

        {groups.map((group) => (
          <Box key={group.id} sx={{ mb: { xs: 4, md: 5 } }}>
            <Typography
              sx={{
                fontFamily: '"Cormorant Garamond", serif',
                fontSize: { xs: '1.7rem', md: '2.1rem' },
                fontWeight: 600,
                color: '#173B28',
                mb: { xs: 1.5, md: 2 },
              }}
            >
              {group.label}:
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr 1fr', md: '1fr 1fr 1fr' },
                gap: { xs: 1, sm: 1.75, md: 2.5 },
              }}
            >
              {group.items.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  qty={qtyFor(product)}
                  inCart={cartIndex(product) >= 0}
                  onDecrease={() => setProductQty(product, qtyFor(product) - product.qtyStep)}
                  onIncrease={() => setProductQty(product, qtyFor(product) + product.qtyStep)}
                  onAdd={() => addProductToCart(product)}
                  onRemove={() => removeProductFromCart(product)}
                  onOpenCart={openSheet}
                />
              ))}
            </Box>
          </Box>
        ))}

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

const ProductCard: FC<{
  product: ShopProduct;
  qty: number;
  inCart: boolean;
  onDecrease: () => void;
  onIncrease: () => void;
  onAdd: () => void;
  onRemove: () => void;
  onOpenCart: () => void;
}> = ({ product, qty, inCart, onDecrease, onIncrease, onAdd, onRemove, onOpenCart }) => {
  const atFloor = qty <= product.minQty;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid rgba(23,59,40,0.08)',
        borderRadius: { xs: '12px', md: '14px' },
        overflow: 'hidden',
        bgcolor: '#FFFDF8',
        contain: 'layout style',
        boxShadow: '0 8px 20px rgba(91, 58, 36, 0.06)',
        '&:hover img': { transform: 'scale(1.04)' },
      }}
    >
      <Box
        component="img"
        src={product.image}
        alt={product.name}
        width={800}
        height={450}
        loading="lazy"
        decoding="async"
        sx={{
          width: '100%',
          height: { xs: 92, sm: 132, md: 168 },
          objectFit: 'cover',
          display: 'block',
          transition: 'transform 1.1s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      />
      <Box sx={{ p: { xs: 0.9, sm: 1.4, md: 2 }, display: 'flex', flexDirection: 'column', flex: 1, gap: { xs: 0.35, md: 0 } }}>
        <Typography
          sx={{
            fontWeight: 700,
            color: '#173B28',
            fontSize: { xs: '0.74rem', sm: '0.9rem', md: '1rem' },
            lineHeight: 1.2,
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {product.name}
        </Typography>
        <Typography
          sx={{
            display: { xs: 'none', sm: '-webkit-box' },
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            color: '#788267',
            fontSize: '0.82rem',
            mt: 0.5,
            mb: 1,
          }}
        >
          {product.tagline}
        </Typography>
        <Typography
          sx={{
            color: '#5B3A24',
            fontSize: { xs: '0.62rem', md: '0.85rem' },
            mb: { xs: 0.15, md: 1.5 },
            fontWeight: 600,
          }}
        >
          {formatINR(product.price)} / {product.unit}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 0.4, mt: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0, sm: 0.5 } }}>
            <MinQtyButton
              atFloor={atFloor}
              minQty={product.minQty}
              unit={product.unit}
              label={`Decrease ${product.name}`}
              onDecrease={onDecrease}
            />
            <Typography sx={{ minWidth: { xs: 16, md: 28 }, textAlign: 'center', fontWeight: 700, fontSize: { xs: '0.72rem', md: '1rem' } }}>
              {qty}
            </Typography>
            <IconButton
              size="small"
              aria-label={`Increase ${product.name}`}
              onClick={onIncrease}
              sx={{ width: { xs: 26, md: 34 }, height: { xs: 26, md: 34 }, p: { xs: 0.15, md: 0.5 } }}
            >
              <AddIcon sx={{ fontSize: { xs: 16, md: 20 } }} />
            </IconButton>
          </Box>
          <Typography sx={{ fontWeight: 700, color: '#173B28', fontSize: { xs: '0.68rem', md: '1rem' }, whiteSpace: 'nowrap' }}>
            {formatINR(product.price * qty)}
          </Typography>
        </Box>
        {inCart ? (
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: { xs: 0.45, md: 1 }, mt: { xs: 0.7, md: 1.5 } }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={onOpenCart}
              sx={{
                minHeight: { xs: 26, md: 40 },
                py: { xs: 0.15, md: 0.9 },
                px: { xs: 0.4, md: 1.5 },
                minWidth: 0,
                fontSize: { xs: '0.58rem', md: '0.875rem' },
                borderRadius: '8px',
              }}
            >
              In cart
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              aria-label={`Remove ${product.name} from cart`}
              onClick={onRemove}
              sx={{
                minHeight: { xs: 26, md: 40 },
                py: { xs: 0.15, md: 0.9 },
                px: { xs: 0.4, md: 1.5 },
                minWidth: 0,
                fontSize: { xs: '0.58rem', md: '0.875rem' },
                borderRadius: '8px',
                color: '#5B3A24',
                borderColor: 'rgba(23,59,40,0.2)',
              }}
            >
              Remove
            </Button>
          </Box>
        ) : (
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={onAdd}
            sx={{
              mt: { xs: 0.7, md: 1.5 },
              minHeight: { xs: 26, md: 40 },
              py: { xs: 0.15, md: 0.9 },
              px: { xs: 0.75, md: 2 },
              fontSize: { xs: '0.62rem', md: '0.875rem' },
              borderRadius: '8px',
            }}
          >
            <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>Add</Box>
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Add to cart</Box>
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default OrderSection;
