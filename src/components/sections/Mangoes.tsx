import { useState, useEffect, useMemo, type FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { supabase } from '../../lib/supabase';
import {
  mangoVarieties,
  whatsappLink,
  type MangoVariety,
  type StockStatus,
} from '../../data/siteData';
import { useReveal } from '../../hooks/useReveal';
import SectionLabel from '../SectionLabel';
import { useCart } from '../../context/CartContext';
import QuantitySelector from '../QuantitySelector';

interface MangoesProps {
  onNavigate?: (target: string) => void;
}

const getStockBadge = (status: StockStatus) => {
  switch (status) {
    case 'in_stock':
      return {
        label: 'Harvesting Now',
        bgcolor: '#EBF3ED',
        color: '#173B28',
        border: '1px solid #C4D9CA',
      };
    case 'low_stock':
      return {
        label: 'Limited Harvest',
        bgcolor: '#FEF3C7',
        color: '#92400E',
        border: '1px solid #FCD34D',
      };
    case 'out_of_stock':
      return {
        label: 'Currently Out of Stock',
        bgcolor: '#F3F4F6',
        color: '#6B7280',
        border: '1px solid #E5E7EB',
      };
  }
};

const stockRank = (status: StockStatus): number => {
  switch (status) {
    case 'in_stock':
      return 1;
    case 'low_stock':
      return 2;
    case 'out_of_stock':
      return 3;
    default:
      return 4;
  }
};

const Mangoes: FC<MangoesProps> = () => {
  const [varietiesList, setVarietiesList] = useState<MangoVariety[]>(mangoVarieties);
  const [selected, setSelected] = useState<MangoVariety | null>(null);
  const [filter, setFilter] = useState<'all' | 'available' | 'heirloom'>('all');
  const [detailQty, setDetailQty] = useState(5);
  const [ref, visible] = useReveal<HTMLDivElement>({ threshold: 0.1 });
  const [detailRef, detailVisible] = useReveal<HTMLDivElement>({ threshold: 0.2 });

  const { addItem, items } = useCart();

  useEffect(() => {
    const fetchLiveStock = async () => {
      try {
        const { data } = await supabase.from('mango_varieties').select('*');
        if (data && data.length > 0) {
          setVarietiesList((prev) =>
            prev.map((v) => {
              const dbMatch = data.find(
                (d) => d.id === v.id || d.name?.toLowerCase() === v.name.toLowerCase(),
              );
              if (dbMatch) {
                const status: StockStatus =
                  dbMatch.stock_status || (dbMatch.is_available ? 'in_stock' : 'out_of_stock');
                return {
                  ...v,
                  stockStatus: status,
                  pricePerKg: Number(dbMatch.price) || v.pricePerKg,
                };
              }
              return v;
            }),
          );
        }
      } catch {
        // use static catalogue
      }
    };
    fetchLiveStock();
  }, []);

  const filteredVarieties = useMemo(() => {
    let list = [...varietiesList];
    if (filter === 'available') {
      list = list.filter((v) => v.stockStatus !== 'out_of_stock');
    } else if (filter === 'heirloom') {
      list = list.filter((v) =>
        ['grapes-mango', 'kallamanga', 'himampasanth'].includes(v.id),
      );
    }
    // Strict requirement: AVAILABLE FIRST -> LOW STOCK SECOND -> OUT OF STOCK LAST
    return list.sort((a, b) => stockRank(a.stockStatus) - stockRank(b.stockStatus));
  }, [varietiesList, filter]);

  const handleAskPrice = (varietyName: string) => {
    const message = `Hello, I am interested in fresh ${varietyName} mangoes from TS Mango Farming. Please share today's harvest price. Minimum order 5–6 KG.`;
    window.open(whatsappLink(message), '_blank', 'noopener,noreferrer');
  };

  const handleQuickAdd = (variety: MangoVariety, e: React.MouseEvent) => {
    e.stopPropagation();
    if (variety.stockStatus === 'out_of_stock') return;
    addItem(
      {
        id: variety.id,
        name: variety.name,
        tamilName: variety.tamilName,
        category: 'mango',
        price: variety.pricePerKg,
        unit: 'KG',
        image: variety.image,
      },
      5,
    );
  };

  if (selected) {
    const badge = getStockBadge(selected.stockStatus);
    const existingCartItem = items.find((i) => i.id === selected.id);

    return (
      <Box
        id="mangoes"
        ref={detailRef}
        sx={{
          bgcolor: '#F6F1E7',
          py: { xs: 8, md: 12 },
          px: { xs: 3, md: 6, lg: 8 },
          minHeight: '100vh',
        }}
      >
        <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => setSelected(null)}
            sx={{
              color: '#5B3A24',
              mb: 4,
              fontSize: '0.85rem',
              textTransform: 'none',
              '&:hover': { bgcolor: 'transparent', opacity: 0.7 },
            }}
          >
            Back to All Varieties
          </Button>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: { xs: 4, md: 8 },
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                overflow: 'hidden',
                borderRadius: 2,
                boxShadow: '0 20px 40px rgba(23,59,40,0.12)',
                aspectRatio: '4/5',
                opacity: detailVisible ? 1 : 0,
                transform: detailVisible ? 'scale(1)' : 'scale(1.03)',
                transition: 'opacity 800ms ease, transform 1000ms ease',
                position: 'relative',
              }}
            >
              <Box
                component="img"
                src={selected.image}
                alt={selected.name}
                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 16,
                  left: 16,
                }}
              >
                <Chip
                  label={badge.label}
                  size="small"
                  sx={{
                    bgcolor: badge.bgcolor,
                    color: badge.color,
                    border: badge.border,
                    fontWeight: 600,
                    fontSize: '0.75rem',
                  }}
                />
              </Box>
            </Box>

            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <SectionLabel>{selected.season}</SectionLabel>
                <Typography sx={{ color: '#788267', fontSize: '0.9rem', fontStyle: 'italic' }}>
                  {selected.tamilName}
                </Typography>
              </Box>

              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  mb: 1.5,
                  opacity: detailVisible ? 1 : 0,
                  transform: detailVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'opacity 700ms ease 200ms, transform 700ms ease 200ms',
                }}
              >
                {selected.name}
              </Typography>

              <Typography
                sx={{
                  color: '#D99419',
                  fontWeight: 600,
                  fontSize: '1.05rem',
                  letterSpacing: '0.04em',
                  mb: 2.5,
                  opacity: detailVisible ? 1 : 0,
                  transition: 'opacity 700ms ease 300ms',
                }}
              >
                {selected.tagline}
              </Typography>

              <Typography
                sx={{
                  color: '#5B3A24',
                  fontSize: '1.05rem',
                  lineHeight: 1.8,
                  mb: 4,
                  maxWidth: 500,
                  opacity: detailVisible ? 1 : 0,
                  transform: detailVisible ? 'translateY(0)' : 'translateY(12px)',
                  transition: 'opacity 700ms ease 400ms, transform 700ms ease 400ms',
                }}
              >
                {selected.description}
              </Typography>

              <Box sx={{ display: 'flex', gap: 4, mb: 4, flexWrap: 'wrap' }}>
                <Box>
                  <Typography variant="overline" sx={{ color: '#788267', fontSize: '0.7rem' }}>
                    Taste Profile
                  </Typography>
                  <Typography sx={{ color: '#173B28', fontWeight: 600, fontSize: '0.95rem' }}>
                    {selected.taste.join(' • ')}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="overline" sx={{ color: '#788267', fontSize: '0.7rem' }}>
                    Farm Price
                  </Typography>
                  <Typography sx={{ color: '#173B28', fontWeight: 700, fontSize: '1.2rem' }}>
                    ₹{selected.pricePerKg} <Typography component="span" sx={{ fontSize: '0.8rem', fontWeight: 400 }}>/ KG</Typography>
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="overline" sx={{ color: '#788267', fontSize: '0.7rem' }}>
                    Minimum Box
                  </Typography>
                  <Typography sx={{ color: '#173B28', fontWeight: 600, fontSize: '0.95rem' }}>
                    5 KG
                  </Typography>
                </Box>
              </Box>

              {/* Add to Box or Enquire */}
              {selected.stockStatus !== 'out_of_stock' ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, maxWidth: 460 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography sx={{ fontSize: '0.9rem', color: '#5B3A24', fontWeight: 600 }}>
                      Select KG:
                    </Typography>
                    <QuantitySelector
                      quantity={detailQty}
                      min={5}
                      step={1}
                      unit="KG"
                      onChange={(qty) => setDetailQty(qty || 5)}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<ShoppingBagOutlinedIcon />}
                      onClick={() => {
                        addItem(
                          {
                            id: selected.id,
                            name: selected.name,
                            tamilName: selected.tamilName,
                            category: 'mango',
                            price: selected.pricePerKg,
                            unit: 'KG',
                            image: selected.image,
                          },
                          detailQty,
                        );
                      }}
                      sx={{ py: 1.5, px: 3.5, flex: 1 }}
                    >
                      {existingCartItem
                        ? `Add More (${detailQty} KG · ₹${detailQty * selected.pricePerKg})`
                        : `Add to Box (${detailQty} KG · ₹${detailQty * selected.pricePerKg})`}
                    </Button>

                    <Button
                      variant="outlined"
                      startIcon={<WhatsAppIcon />}
                      onClick={() => handleAskPrice(selected.name)}
                      sx={{
                        py: 1.5,
                        px: 3,
                        borderColor: '#25D366',
                        color: '#128C7E',
                        '&:hover': { borderColor: '#128C7E', bgcolor: 'rgba(37,211,102,0.08)' },
                      }}
                    >
                      Enquire WhatsApp
                    </Button>
                  </Box>
                  <Typography sx={{ fontSize: '0.78rem', color: '#788267' }}>
                    ✓ Direct farm packing · Freshly handpicked in Tamil Nadu · Zero carbide chemical ripening
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <Typography sx={{ color: '#6B7280', mb: 2, fontStyle: 'italic' }}>
                    This variety has concluded its harvest season. Enquire for next season reservations.
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<WhatsAppIcon />}
                    onClick={() => handleAskPrice(selected.name)}
                    sx={{ py: 1.5, px: 4 }}
                  >
                    Reserve for Next Season
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      id="mangoes"
      ref={ref}
      sx={{
        bgcolor: '#F6F1E7',
        py: { xs: 8, md: 14 },
        px: { xs: 3, md: 6, lg: 8 },
      }}
    >
      <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'flex-end' },
            mb: { xs: 5, md: 8 },
            gap: 3,
          }}
        >
          <Box>
            <SectionLabel>Our Mango Orchard Varieties</SectionLabel>
            <Typography
              variant="h2"
              sx={{
                mb: 1.5,
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(16px)',
                transition: 'opacity 700ms ease, transform 700ms ease',
              }}
            >
              Seven varieties. One orchard.
            </Typography>
            <Typography
              sx={{
                color: '#5B3A24',
                fontSize: '1.1rem',
                fontFamily: '"Cormorant Garamond", serif',
                fontStyle: 'italic',
                opacity: visible ? 1 : 0,
                transition: 'opacity 700ms ease 200ms',
              }}
            >
              Each with its own distinct aroma, flesh density, and seasonal window.
            </Typography>
          </Box>

          {/* Filter Chips */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              label="All Varieties (7)"
              clickable
              onClick={() => setFilter('all')}
              sx={{
                bgcolor: filter === 'all' ? '#173B28' : '#FFFDF8',
                color: filter === 'all' ? '#FFFDF8' : '#173B28',
                border: '1px solid',
                borderColor: filter === 'all' ? '#173B28' : 'rgba(23,59,40,0.15)',
                fontWeight: 600,
              }}
            />
            <Chip
              label="Available Now"
              clickable
              onClick={() => setFilter('available')}
              sx={{
                bgcolor: filter === 'available' ? '#173B28' : '#FFFDF8',
                color: filter === 'available' ? '#FFFDF8' : '#173B28',
                border: '1px solid',
                borderColor: filter === 'available' ? '#173B28' : 'rgba(23,59,40,0.15)',
                fontWeight: 600,
              }}
            />
            <Chip
              label="Rare & Heirloom"
              clickable
              onClick={() => setFilter('heirloom')}
              sx={{
                bgcolor: filter === 'heirloom' ? '#173B28' : '#FFFDF8',
                color: filter === 'heirloom' ? '#FFFDF8' : '#173B28',
                border: '1px solid',
                borderColor: filter === 'heirloom' ? '#173B28' : 'rgba(23,59,40,0.15)',
                fontWeight: 600,
              }}
            />
          </Box>
        </Box>

        {/* Horizontal scroll gallery */}
        <Box
          sx={{
            display: 'flex',
            gap: { xs: 3, md: 4 },
            overflowX: 'auto',
            overflowY: 'hidden',
            pb: 3,
            scrollSnapType: 'x mandatory',
            '&::-webkit-scrollbar': { height: '5px' },
            '&::-webkit-scrollbar-track': { bgcolor: 'rgba(23,59,40,0.06)', borderRadius: 2 },
            '&::-webkit-scrollbar-thumb': { bgcolor: '#788267', borderRadius: 2 },
          }}
        >
          {filteredVarieties.map((variety, i) => {
            const badge = getStockBadge(variety.stockStatus);
            const isInCart = items.some((item) => item.id === variety.id);

            return (
              <Box
                key={variety.id}
                onClick={() => {
                  setDetailQty(5);
                  setSelected(variety);
                }}
                sx={{
                  flex: { xs: '0 0 85%', sm: '0 0 48%', md: '0 0 32%', lg: '0 0 26%' },
                  scrollSnapAlign: 'start',
                  cursor: 'pointer',
                  bgcolor: '#FFFDF8',
                  borderRadius: 2,
                  overflow: 'hidden',
                  border: '1px solid rgba(23,59,40,0.08)',
                  boxShadow: '0 4px 16px rgba(23,59,40,0.04)',
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(30px)',
                  transition: `opacity 700ms ease ${i * 60}ms, transform 700ms ease ${i * 60}ms, box-shadow 300ms ease`,
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    boxShadow: '0 12px 28px rgba(23,59,40,0.1)',
                    '& .variety-image': { transform: 'scale(1.05)' },
                  },
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    aspectRatio: '4/3',
                  }}
                >
                  <Box
                    className="variety-image"
                    component="img"
                    src={variety.image}
                    alt={variety.name}
                    loading="lazy"
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 600ms ease',
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 12,
                      left: 12,
                    }}
                  >
                    <Chip
                      label={badge.label}
                      size="small"
                      sx={{
                        bgcolor: badge.bgcolor,
                        color: badge.color,
                        border: badge.border,
                        fontWeight: 600,
                        fontSize: '0.7rem',
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 12,
                      right: 12,
                      bgcolor: 'rgba(23,59,40,0.85)',
                      backdropFilter: 'blur(4px)',
                      color: '#FFFDF8',
                      px: 1.2,
                      py: 0.4,
                      borderRadius: 1,
                      fontSize: '0.8rem',
                      fontWeight: 700,
                    }}
                  >
                    ₹{variety.pricePerKg} <Typography component="span" sx={{ fontSize: '0.68rem', fontWeight: 400 }}>/ KG</Typography>
                  </Box>
                </Box>

                <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                    <Typography
                      variant="h4"
                      sx={{ fontSize: { xs: '1.25rem', md: '1.4rem' }, color: '#173B28' }}
                    >
                      {variety.name}
                    </Typography>
                    <Typography sx={{ color: '#788267', fontSize: '0.78rem' }}>
                      {variety.tamilName}
                    </Typography>
                  </Box>

                  <Typography
                    sx={{
                      color: '#788267',
                      fontSize: '0.8rem',
                      letterSpacing: '0.02em',
                      mb: 1,
                    }}
                  >
                    {variety.tagline}
                  </Typography>

                  <Typography
                    sx={{
                      color: '#5B3A24',
                      fontSize: '0.8rem',
                      mb: 2,
                    }}
                  >
                    Season: {variety.season}
                  </Typography>

                  <Box sx={{ mt: 'auto', display: 'flex', gap: 1, alignItems: 'center' }}>
                    {variety.stockStatus !== 'out_of_stock' ? (
                      <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        startIcon={isInCart ? <CheckCircleOutlineIcon /> : <ShoppingBagOutlinedIcon />}
                        onClick={(e) => handleQuickAdd(variety, e)}
                        sx={{
                          flex: 1,
                          fontSize: '0.78rem',
                          py: 0.8,
                          borderRadius: 1,
                        }}
                      >
                        {isInCart ? 'Add 5 KG More' : '+ Add 5 KG Box'}
                      </Button>
                    ) : (
                      <Button
                        variant="outlined"
                        size="small"
                        disabled
                        sx={{ flex: 1, fontSize: '0.75rem', py: 0.8 }}
                      >
                        Sold Out
                      </Button>
                    )}

                    <Box
                      component="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAskPrice(variety.name);
                      }}
                      sx={{
                        p: 0.8,
                        background: 'none',
                        border: '1px solid #D1D5DB',
                        borderRadius: 1,
                        cursor: 'pointer',
                        color: '#128C7E',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        '&:hover': { bgcolor: 'rgba(37,211,102,0.08)' },
                      }}
                      title="Enquire on WhatsApp"
                    >
                      <WhatsAppIcon sx={{ fontSize: '1.2rem' }} />
                    </Box>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default Mangoes;
