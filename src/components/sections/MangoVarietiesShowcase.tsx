import { useState, useEffect, useMemo, useRef, type FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import SectionLabel from '../SectionLabel';
import { useCart } from '../../context/CartContext';
import { supabase } from '../../lib/supabase';
import {
  mangoVarieties,
  type MangoVariety,
  type StockStatus,
} from '../../data/siteData';

interface MangoVarietiesShowcaseProps {
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
        label: 'Out of Stock',
        bgcolor: '#F3F4F6',
        color: '#6B7280',
        border: '1px solid #E5E7EB',
      };
  }
};

const MangoVarietiesShowcase: FC<MangoVarietiesShowcaseProps> = () => {
  const [varietiesList, setVarietiesList] = useState<MangoVariety[]>(mangoVarieties);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { addItem, items } = useCart();

  // Live Supabase stock & price binding
  useEffect(() => {
    const fetchLiveStock = async () => {
      try {
        const { data } = await supabase.from('mango_varieties').select('*');
        if (data && data.length > 0) {
          setVarietiesList((prev) =>
            prev.map((v) => {
              const match = data.find(
                (d) => d.id === v.id || d.name?.toLowerCase() === v.name.toLowerCase(),
              );
              if (match) {
                const status: StockStatus =
                  match.stock_status || (match.is_available ? 'in_stock' : 'out_of_stock');
                return {
                  ...v,
                  stockStatus: status,
                  pricePerKg: Number(match.price) || v.pricePerKg,
                };
              }
              return v;
            }),
          );
        }
      } catch {
        // baseline static catalogue
      }
    };
    fetchLiveStock();
  }, []);

  // Sort: Available items first in canonical sequence, Out-of-Stock items last
  const sortedVarieties = useMemo(() => {
    const available = varietiesList.filter((v) => v.stockStatus !== 'out_of_stock');
    const outOfStock = varietiesList.filter((v) => v.stockStatus === 'out_of_stock');
    return [...available, ...outOfStock];
  }, [varietiesList]);

  const handleArrowScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 260;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <Box
      id="mangoes"
      sx={{
        bgcolor: '#F6F1E7',
        scrollMarginTop: { xs: '76px', md: '88px' },
        pt: { xs: 4, md: 5 },
        pb: { xs: 3, md: 4 },
        px: { xs: 2.5, sm: 3.5, md: 5, lg: 7 },
        overflow: 'hidden',
        position: 'relative',
        borderTop: '1px solid rgba(23,59,40,0.06)',
      }}
    >
      <Box sx={{ maxWidth: 1380, mx: 'auto', width: '100%' }}>
        {/* Compact, Proportional Section Header */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'flex-end' },
            mb: { xs: 2.5, md: 3 },
            gap: 1.5,
          }}
        >
          <Box sx={{ maxWidth: 680 }}>
            <SectionLabel>Mango World · 7 Orchard Varieties</SectionLabel>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.75rem', sm: '2.1rem', md: '2.35rem' },
                color: '#173B28',
                lineHeight: 1.15,
                mb: 0.5,
                fontWeight: 500,
              }}
            >
              Seven Varieties. One Orchard.
            </Typography>
            <Typography
              sx={{
                color: '#5B3A24',
                fontSize: { xs: '0.88rem', md: '0.96rem' },
                fontFamily: '"Cormorant Garamond", serif',
                fontStyle: 'italic',
                lineHeight: 1.45,
              }}
            >
              Hand-tended in Tamil Nadu and harvested at peak ripeness. Explore our seven varieties in one continuous harvest row.
            </Typography>
          </Box>

          {/* Desktop/Tablet Row Navigation Buttons */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.2,
            }}
          >
            <IconButton
              onClick={() => handleArrowScroll('left')}
              aria-label="Scroll mangoes left"
              size="small"
              sx={{
                border: '1px solid rgba(23,59,40,0.2)',
                color: '#173B28',
                bgcolor: '#FFFDF8',
                width: 38,
                height: 38,
                '&:hover': { bgcolor: 'rgba(23,59,40,0.08)', borderColor: '#173B28' },
                transition: 'all 200ms ease',
              }}
            >
              <ArrowBackIcon fontSize="small" />
            </IconButton>
            <IconButton
              onClick={() => handleArrowScroll('right')}
              aria-label="Scroll mangoes right"
              size="small"
              sx={{
                border: '1px solid rgba(23,59,40,0.2)',
                color: '#173B28',
                bgcolor: '#FFFDF8',
                width: 38,
                height: 38,
                '&:hover': { bgcolor: 'rgba(23,59,40,0.08)', borderColor: '#173B28' },
                transition: 'all 200ms ease',
              }}
            >
              <ArrowForwardIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {/* ============================================================ */}
        {/* NATIVE HORIZONTAL SCROLL CONTAINER: 1 CONTINUOUS ROW        */}
        {/* - Vertical wheel/swipe: Scrolls the PAGE down (untouched)   */}
        {/* - Horizontal trackpad/touch swipe: Scrolls the MANGO ROW    */}
        {/* - ZERO JavaScript scroll-jacking or deltaY conversion       */}
        {/* ============================================================ */}
        <Box
          ref={scrollContainerRef}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: { xs: 2.5, sm: 3, md: 3.5 },
            overflowX: 'auto',
            overflowY: 'hidden',
            overscrollBehaviorX: 'contain',
            overscrollBehaviorY: 'auto',
            WebkitOverflowScrolling: 'touch',
            scrollSnapType: 'x proximity',
            pb: 2.5,
            pt: 0.5,
            px: { xs: 0.5, md: 0 },
            '&::-webkit-scrollbar': { height: 5 },
            '&::-webkit-scrollbar-track': { bgcolor: 'rgba(23,59,40,0.05)', borderRadius: 3 },
            '&::-webkit-scrollbar-thumb': { bgcolor: '#788267', borderRadius: 3 },
          }}
        >
          {sortedVarieties.map((variety, idx) => {
            const badge = getStockBadge(variety.stockStatus);
            const isInCart = items.some((i) => i.id === variety.id);
            const isOutOfStock = variety.stockStatus === 'out_of_stock';
            const boxPrice = variety.pricePerKg * 5;

            return (
              <Box
                key={variety.id}
                sx={{
                  flex: {
                    xs: '0 0 min(72vw, 230px)',
                    sm: '0 0 215px',
                    md: '0 0 225px',
                    lg: '0 0 235px',
                  },
                  scrollSnapAlign: 'start',
                  display: 'flex',
                  flexDirection: 'column',
                  bgcolor: '#FFFDF8',
                  borderRadius: '18px',
                  overflow: 'hidden',
                  border: '1px solid rgba(23,59,40,0.08)',
                  boxShadow: '0 8px 24px rgba(23,59,40,0.04)',
                  transition: 'transform 250ms ease, box-shadow 250ms ease',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 14px 30px rgba(23,59,40,0.08)',
                  },
                }}
              >
                {/* 1. GENUINE 3:4 PORTRAIT MANGO IMAGE (COMPACT, HIGH-IMPACT) */}
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '3 / 4',
                    bgcolor: '#EAE4D6',
                    overflow: 'hidden',
                    borderRadius: '18px 18px 0 0',
                  }}
                >
                  <Box
                    component="img"
                    src={variety.image}
                    alt={`${variety.name} mango`}
                    loading="lazy"
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center',
                      display: 'block',
                      transition: 'transform 600ms ease',
                      '&:hover': {
                        transform: isOutOfStock ? 'none' : 'scale(1.03)',
                      },
                    }}
                  />

                  {/* Harvest badge on available items */}
                  {!isOutOfStock && (
                    <Box sx={{ position: 'absolute', top: 10, left: 10 }}>
                      <Chip
                        label={badge.label}
                        size="small"
                        sx={{
                          bgcolor: badge.bgcolor,
                          color: badge.color,
                          border: badge.border,
                          fontWeight: 700,
                          fontSize: '0.64rem',
                          height: 20,
                          backdropFilter: 'blur(4px)',
                        }}
                      />
                    </Box>
                  )}

                  {/* Variety Sequence Index */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      bgcolor: 'rgba(23,59,40,0.85)',
                      backdropFilter: 'blur(6px)',
                      color: '#FFFDF8',
                      px: 1,
                      py: 0.2,
                      borderRadius: 10,
                      fontSize: '0.64rem',
                      fontWeight: 600,
                      letterSpacing: '0.04em',
                    }}
                  >
                    0{idx + 1}
                  </Box>

                  {/* OUT OF STOCK BLACKOUT OVERLAY OVER IMAGE AREA */}
                  {isOutOfStock && (
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        bgcolor: 'rgba(15, 23, 18, 0.72)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 1.5,
                        pointerEvents: 'none',
                      }}
                    >
                      <Box
                        sx={{
                          border: '1.5px solid rgba(255, 253, 248, 0.85)',
                          px: 1.8,
                          py: 0.6,
                          borderRadius: 1.5,
                          bgcolor: 'rgba(0, 0, 0, 0.45)',
                          backdropFilter: 'blur(4px)',
                        }}
                      >
                        <Typography
                          sx={{
                            color: '#FFFDF8',
                            fontWeight: 700,
                            fontSize: '0.72rem',
                            letterSpacing: '0.16em',
                            textTransform: 'uppercase',
                            textAlign: 'center',
                          }}
                        >
                          OUT OF STOCK
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Box>

                {/* PRODUCT DETAILS: NAME, TAGLINE, PRICE, ADD TO CART (TIGHT, UNIFIED) */}
                <Box
                  sx={{
                    p: { xs: 1.4, sm: 1.6 },
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                  }}
                >
                  {/* 2. MANGO VARIETY NAME (CLEAN ENGLISH-FIRST) */}
                  <Typography
                    variant="h3"
                    sx={{
                      fontSize: { xs: '1.2rem', sm: '1.3rem' },
                      color: '#173B28',
                      lineHeight: 1.15,
                      fontWeight: 600,
                      mb: 0.3,
                    }}
                  >
                    {variety.name}
                  </Typography>

                  {/* Tagline / Character (Concise 2-line descriptor) */}
                  <Typography
                    sx={{
                      color: '#5B3A24',
                      fontSize: '0.72rem',
                      lineHeight: 1.3,
                      mt: 0.2,
                      mb: 1.1,
                      minHeight: '2.5em',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {variety.tagline}
                  </Typography>

                  {/* 3. LIVE PRICE (Simplified, clean hierarchy) */}
                  <Box
                    sx={{
                      pt: 1,
                      borderTop: '1px solid rgba(23,59,40,0.07)',
                      mb: 1.2,
                      display: 'flex',
                      alignItems: 'baseline',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                      <Typography
                        sx={{
                          fontSize: '1.28rem',
                          fontWeight: 800,
                          color: '#173B28',
                          lineHeight: 1,
                        }}
                      >
                        ₹{variety.pricePerKg}
                      </Typography>
                      <Typography
                        component="span"
                        sx={{
                          fontSize: '0.74rem',
                          fontWeight: 600,
                          color: '#5B3A24',
                          ml: 0.3,
                        }}
                      >
                        / KG
                      </Typography>
                    </Box>
                    <Typography
                      sx={{
                        fontSize: '0.68rem',
                        color: '#788267',
                        fontWeight: 500,
                      }}
                    >
                      Min. 5 KG · ₹{boxPrice}
                    </Typography>
                  </Box>

                  {/* 4. ADD TO CART BUTTON (COMPACT, ACCESSIBLE) */}
                  {!isOutOfStock ? (
                    <Button
                      variant={isInCart ? 'outlined' : 'contained'}
                      onClick={() =>
                        addItem(
                          {
                            id: variety.id,
                            name: variety.name,
                            category: 'mango',
                            price: variety.pricePerKg,
                            unit: 'KG',
                            image: variety.image,
                          },
                          5,
                        )
                      }
                      startIcon={
                        isInCart ? (
                          <CheckCircleOutlineIcon sx={{ fontSize: '0.95rem' }} />
                        ) : (
                          <ShoppingBagOutlinedIcon sx={{ fontSize: '0.95rem' }} />
                        )
                      }
                      sx={{
                        width: '100%',
                        bgcolor: isInCart ? 'transparent' : '#173B28',
                        color: isInCart ? '#173B28' : '#FFFDF8',
                        py: 0.8,
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        borderRadius: '8px',
                        border: isInCart ? '1.5px solid #173B28' : 'none',
                        '&:hover': {
                          bgcolor: isInCart ? 'rgba(23,59,40,0.08)' : '#26543C',
                        },
                      }}
                    >
                      {isInCart ? 'In Cart (5 KG)' : 'Add 5 KG Box'}
                    </Button>
                  ) : (
                    <Button
                      disabled
                      variant="contained"
                      sx={{
                        width: '100%',
                        py: 0.8,
                        bgcolor: '#E5E7EB !important',
                        color: '#9CA3AF !important',
                        fontWeight: 600,
                        fontSize: '0.76rem',
                        borderRadius: '8px',
                        cursor: 'not-allowed',
                      }}
                    >
                      Currently Out of Stock
                    </Button>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default MangoVarietiesShowcase;
