import { useState, useEffect, useRef, useMemo, type FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import SectionLabel from '../SectionLabel';
import { useCart } from '../../context/CartContext';
import { supabase } from '../../lib/supabase';
import {
  mangoVarieties,
  otherFarmProducts,
  productImages,
  honeyImage,
  jackfruitImage,
  whatsappLink,
  type MangoVariety,
  type OtherFarmProduct,
  type StockStatus,
} from '../../data/siteData';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface ProductStoryStageProps {
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

const ProductStoryStage: FC<ProductStoryStageProps> = () => {
  const reduced = usePrefersReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeStage, setActiveStage] = useState<0 | 1 | 2>(0);

  // Live Catalog State from Supabase
  const [varietiesList, setVarietiesList] = useState<MangoVariety[]>(mangoVarieties);
  const [selectedVariety, setSelectedVariety] = useState<MangoVariety>(mangoVarieties[0]);
  const [honeyProducts, setHoneyProducts] = useState<OtherFarmProduct[]>(
    otherFarmProducts.filter((p) => p.category === 'honey'),
  );
  const [selectedHoneyId, setSelectedHoneyId] = useState<string>(honeyProducts[0]?.id || 'farm-honey-500g');
  const [jackfruitProduct, setJackfruitProduct] = useState<OtherFarmProduct>(
    otherFarmProducts.find((p) => p.category === 'jackfruit') || otherFarmProducts[2],
  );

  const { addItem, items } = useCart();

  // Fetch authoritative DB prices & stock
  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const [varRes, prodRes] = await Promise.all([
          supabase.from('mango_varieties').select('*'),
          supabase.from('products').select('*').eq('is_active', true),
        ]);

        if (varRes.data && varRes.data.length > 0) {
          setVarietiesList((prev) => {
            const updated = prev.map((v) => {
              const match = varRes.data.find(
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
            });
            return updated;
          });
        }

        if (prodRes.data && prodRes.data.length > 0) {
          setHoneyProducts((prev) =>
            prev.map((item) => {
              const match = prodRes.data.find((d) => d.product_code === item.id);
              if (match) {
                return {
                  ...item,
                  price: Number(match.price) || item.price,
                  unit: match.unit || item.unit,
                  stockStatus: match.stock_status || item.stockStatus,
                };
              }
              return item;
            }),
          );

          const jackMatch = prodRes.data.find((d) => d.product_code === 'fresh-jackfruit-bulb');
          if (jackMatch) {
            setJackfruitProduct((prev) => ({
              ...prev,
              price: Number(jackMatch.price) || prev.price,
              unit: jackMatch.unit || prev.unit,
              stockStatus: jackMatch.stock_status || prev.stockStatus,
            }));
          }
        }
      } catch {
        // use baseline
      }
    };

    fetchCatalog();
  }, []);

  // Update selected variety when list changes
  useEffect(() => {
    setSelectedVariety((prev) => {
      const match = varietiesList.find((v) => v.id === prev.id);
      return match || varietiesList[0];
    });
  }, [varietiesList]);

  // Scroll Progress Engine: RAF + zero re-render CSS variable driving
  useEffect(() => {
    if (reduced) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!trackRef.current) {
            ticking = false;
            return;
          }
          const rect = trackRef.current.getBoundingClientRect();
          const winH = window.innerHeight;
          const totalScroll = rect.height - winH;

          if (totalScroll > 0) {
            const progress = Math.max(0, Math.min(1, -rect.top / totalScroll));
            trackRef.current.style.setProperty('--product-progress', progress.toString());

            // Determine active stage based on scroll depth
            if (progress < 0.38) {
              setActiveStage((curr) => (curr !== 0 ? 0 : curr));
            } else if (progress < 0.72) {
              setActiveStage((curr) => (curr !== 1 ? 1 : curr));
            } else {
              setActiveStage((curr) => (curr !== 2 ? 2 : curr));
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [reduced]);

  // Active honey selection
  const currentHoney = useMemo(() => {
    return honeyProducts.find((h) => h.id === selectedHoneyId) || honeyProducts[0];
  }, [honeyProducts, selectedHoneyId]);

  // Cart Status checks
  const isMangoInCart = items.some((i) => i.id === selectedVariety.id);
  const isHoneyInCart = items.some((i) => i.id === currentHoney.id);
  const isJackfruitInCart = items.some((i) => i.id === jackfruitProduct.id);

  const mangoBadge = getStockBadge(selectedVariety.stockStatus);
  const honeyBadge = getStockBadge(currentHoney.stockStatus);
  const jackfruitBadge = getStockBadge(jackfruitProduct.stockStatus);

  const handleStageJump = (index: 0 | 1 | 2) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const winH = window.innerHeight;
    const totalScroll = rect.height - winH;
    const targetScrollRatio = index === 0 ? 0.05 : index === 1 ? 0.52 : 0.92;
    const targetY = window.scrollY + rect.top + targetScrollRatio * totalScroll;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  return (
    <Box
      id="products"
      ref={trackRef}
      sx={{
        position: 'relative',
        height: { xs: 'auto', md: '360vh' },
        bgcolor:
          activeStage === 0 ? '#F6F1E7' : activeStage === 1 ? '#FBF6EA' : '#F1F6ED',
        transition: 'background-color 700ms ease',
      }}
    >
      {/* Sticky Viewport Stage on Desktop; Normal Vertical Flow on Mobile */}
      <Box
        sx={{
          position: { xs: 'relative', md: 'sticky' },
          top: 0,
          minHeight: { xs: 'auto', md: '100vh' },
          height: { xs: 'auto', md: '100vh' },
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          py: { xs: 8, md: 0 },
          px: { xs: 3, md: 6, lg: 10 },
        }}
      >
        <Box sx={{ maxWidth: 1400, mx: 'auto', width: '100%', position: 'relative' }}>
          {/* Top Progress & Stage Switcher Pills */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: { xs: 4, md: 6 },
              borderBottom: '1px solid rgba(23,59,40,0.08)',
              pb: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <SectionLabel>Direct From Our Farm</SectionLabel>
              <Typography
                sx={{
                  color: '#788267',
                  fontSize: '0.85rem',
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                Retail & Wholesale across Tamil Nadu
              </Typography>
            </Box>

            {/* Product World Indicator Tabs */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              {[
                { label: '1. Fresh Mangoes', idx: 0 as const },
                { label: '2. Farm Honey', idx: 1 as const },
                { label: '3. Fresh Jackfruit', idx: 2 as const },
              ].map((item) => (
                <Chip
                  key={item.idx}
                  label={item.label}
                  clickable
                  onClick={() => handleStageJump(item.idx)}
                  sx={{
                    bgcolor: activeStage === item.idx ? '#173B28' : 'rgba(23,59,40,0.06)',
                    color: activeStage === item.idx ? '#FFFDF8' : '#173B28',
                    fontWeight: activeStage === item.idx ? 700 : 500,
                    fontSize: { xs: '0.72rem', sm: '0.82rem' },
                    transition: 'all 300ms ease',
                    '&:hover': {
                      bgcolor: activeStage === item.idx ? '#173B28' : 'rgba(23,59,40,0.12)',
                    },
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* ============================================================ */}
          {/* MAIN PRODUCT WORLD STAGE: MANGO / HONEY / JACKFRUIT TRANSITION */}
          {/* ============================================================ */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1.15fr 1fr' },
              gap: { xs: 5, md: 8 },
              alignItems: 'center',
              minHeight: { xs: 'auto', md: '65vh' },
            }}
          >
            {/* LEFT COLUMN: Large Hero Product Visual with smooth Cross-Fade & Scale */}
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                aspectRatio: { xs: '4/3', sm: '16/10', md: '5/4' },
                borderRadius: { xs: 2, md: 3 },
                overflow: 'hidden',
                boxShadow: '0 24px 60px rgba(23,59,40,0.12)',
                bgcolor: '#EAE3D2',
              }}
            >
              {/* Image 1: Mango Visual */}
              <Box
                component="img"
                src={selectedVariety.image || productImages.mangoes}
                alt={selectedVariety.name}
                sx={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: activeStage === 0 ? 1 : 0,
                  transform: activeStage === 0 ? 'scale(1)' : 'scale(1.06)',
                  transition: 'opacity 700ms ease, transform 900ms ease',
                }}
              />

              {/* Image 2: Honey Visual */}
              <Box
                component="img"
                src={honeyImage || productImages.honey}
                alt={currentHoney.name}
                sx={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: activeStage === 1 ? 1 : 0,
                  transform: activeStage === 1 ? 'scale(1)' : 'scale(1.06)',
                  transition: 'opacity 700ms ease, transform 900ms ease',
                }}
              />

              {/* Image 3: Jackfruit Visual */}
              <Box
                component="img"
                src={jackfruitImage || productImages.jackfruit}
                alt={jackfruitProduct.name}
                sx={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: activeStage === 2 ? 1 : 0,
                  transform: activeStage === 2 ? 'scale(1)' : 'scale(1.06)',
                  transition: 'opacity 700ms ease, transform 900ms ease',
                }}
              />

              {/* In-Image Floating Stock Badge */}
              <Box sx={{ position: 'absolute', top: 20, left: 20, zIndex: 2 }}>
                <Chip
                  label={
                    activeStage === 0
                      ? mangoBadge.label
                      : activeStage === 1
                      ? honeyBadge.label
                      : jackfruitBadge.label
                  }
                  size="small"
                  sx={{
                    bgcolor:
                      activeStage === 0
                        ? mangoBadge.bgcolor
                        : activeStage === 1
                        ? honeyBadge.bgcolor
                        : jackfruitBadge.bgcolor,
                    color:
                      activeStage === 0
                        ? mangoBadge.color
                        : activeStage === 1
                        ? honeyBadge.color
                        : jackfruitBadge.color,
                    border:
                      activeStage === 0
                        ? mangoBadge.border
                        : activeStage === 1
                        ? honeyBadge.border
                        : jackfruitBadge.border,
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                />
              </Box>

              {/* In-Image Floating Minimum Order / Unit Badge */}
              <Box sx={{ position: 'absolute', bottom: 20, right: 20, zIndex: 2 }}>
                <Box
                  sx={{
                    bgcolor: 'rgba(23,59,40,0.85)',
                    backdropFilter: 'blur(8px)',
                    color: '#FFFDF8',
                    px: 2,
                    py: 0.8,
                    borderRadius: 20,
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                  }}
                >
                  {activeStage === 0
                    ? 'Minimum Order: 5 KG'
                    : activeStage === 1
                    ? currentHoney.unit
                    : jackfruitProduct.unit}
                </Box>
              </Box>
            </Box>

            {/* RIGHT COLUMN: Product Information, Variety Selector, and Live Pricing */}
            <Box>
              {/* -------------------- STAGE 0: MANGO -------------------- */}
              {activeStage === 0 && (
                <Box
                  sx={{
                    animation: 'fadeIn 500ms ease',
                    '@keyframes fadeIn': {
                      from: { opacity: 0, transform: 'translateY(12px)' },
                      to: { opacity: 1, transform: 'translateY(0)' },
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, mb: 1 }}>
                    <Typography
                      sx={{
                        color: '#D99419',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.15em',
                      }}
                    >
                      {selectedVariety.season}
                    </Typography>
                    <Typography sx={{ color: '#788267', fontSize: '0.95rem', fontStyle: 'italic' }}>
                      {selectedVariety.tamilName}
                    </Typography>
                  </Box>

                  <Typography
                    variant="h1"
                    sx={{
                      fontSize: { xs: '2.4rem', sm: '3.2rem', md: '3.8rem' },
                      color: '#173B28',
                      lineHeight: 1.08,
                      mb: 1.5,
                      fontWeight: 500,
                    }}
                  >
                    {selectedVariety.name}
                  </Typography>

                  <Typography
                    sx={{
                      color: '#5B3A24',
                      fontSize: '1.05rem',
                      lineHeight: 1.7,
                      mb: 3,
                      maxWidth: 520,
                    }}
                  >
                    {selectedVariety.description}
                  </Typography>

                  {/* Variety Selector Carousel / Pills */}
                  <Box sx={{ mb: 3.5 }}>
                    <Typography
                      sx={{
                        fontSize: '0.78rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.12em',
                        color: '#788267',
                        fontWeight: 600,
                        mb: 1.5,
                      }}
                    >
                      Select Mango Variety (7 Varieties Available)
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 1,
                        flexWrap: 'wrap',
                      }}
                    >
                      {varietiesList.map((v) => {
                        const isSelected = v.id === selectedVariety.id;
                        const isOut = v.stockStatus === 'out_of_stock';
                        return (
                          <Chip
                            key={v.id}
                            label={`${v.name} · ₹${v.pricePerKg}/kg`}
                            clickable
                            onClick={() => setSelectedVariety(v)}
                            sx={{
                              bgcolor: isSelected
                                ? '#173B28'
                                : isOut
                                ? '#F3F4F6'
                                : '#FFFDF8',
                              color: isSelected
                                ? '#FFFDF8'
                                : isOut
                                ? '#9CA3AF'
                                : '#173B28',
                              border: '1px solid',
                              borderColor: isSelected
                                ? '#173B28'
                                : isOut
                                ? '#E5E7EB'
                                : 'rgba(23,59,40,0.18)',
                              fontWeight: isSelected ? 700 : 500,
                              fontSize: '0.8rem',
                              transition: 'all 200ms ease',
                            }}
                          />
                        );
                      })}
                    </Box>
                  </Box>

                  {/* Live Price & CTAs */}
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      gap: 3,
                      pt: 2,
                      borderTop: '1px solid rgba(23,59,40,0.08)',
                    }}
                  >
                    <Box>
                      <Typography sx={{ fontSize: '0.75rem', color: '#788267', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Live Farm Price
                      </Typography>
                      <Typography sx={{ fontSize: '2rem', fontWeight: 800, color: '#173B28', lineHeight: 1 }}>
                        ₹{selectedVariety.pricePerKg}
                        <Typography component="span" sx={{ fontSize: '1rem', fontWeight: 500, color: '#5B3A24', ml: 0.5 }}>
                          / KG
                        </Typography>
                      </Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: '#788267', mt: 0.3 }}>
                        Min order 5 KG (₹{selectedVariety.pricePerKg * 5} per 5 KG box)
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1.5, flex: { xs: '1 1 100%', sm: 'auto' } }}>
                      {selectedVariety.stockStatus !== 'out_of_stock' ? (
                        <Button
                          variant={isMangoInCart ? 'outlined' : 'contained'}
                          onClick={() =>
                            addItem(
                              {
                                id: selectedVariety.id,
                                name: selectedVariety.name,
                                tamilName: selectedVariety.tamilName,
                                category: 'mango',
                                price: selectedVariety.pricePerKg,
                                unit: 'KG',
                                image: selectedVariety.image,
                              },
                              5,
                            )
                          }
                          startIcon={
                            isMangoInCart ? (
                              <CheckCircleOutlineIcon />
                            ) : (
                              <ShoppingBagOutlinedIcon />
                            )
                          }
                          sx={{
                            bgcolor: isMangoInCart ? 'transparent' : '#173B28',
                            color: isMangoInCart ? '#173B28' : '#FFFDF8',
                            px: 3.5,
                            py: 1.5,
                            fontWeight: 700,
                            borderRadius: 2,
                            '&:hover': {
                              bgcolor: isMangoInCart ? 'rgba(23,59,40,0.08)' : '#26543C',
                            },
                          }}
                        >
                          {isMangoInCart ? 'In Cart (5 KG)' : 'Add 5 KG Box'}
                        </Button>
                      ) : (
                        <Button
                          disabled
                          variant="contained"
                          sx={{ px: 3, py: 1.5, bgcolor: '#E5E7EB', color: '#9CA3AF' }}
                        >
                          Currently Out of Stock
                        </Button>
                      )}

                      <Button
                        variant="outlined"
                        startIcon={<WhatsAppIcon />}
                        onClick={() => {
                          const msg = `Hello, I want to order fresh ${selectedVariety.name} mangoes from TS Mango Farming. Please confirm availability.`;
                          window.open(whatsappLink(msg), '_blank');
                        }}
                        sx={{
                          borderColor: 'rgba(23,59,40,0.3)',
                          color: '#173B28',
                          px: 2.5,
                          py: 1.5,
                          borderRadius: 2,
                        }}
                      >
                        WhatsApp Order
                      </Button>
                    </Box>
                  </Box>
                </Box>
              )}

              {/* -------------------- STAGE 1: HONEY -------------------- */}
              {activeStage === 1 && (
                <Box
                  sx={{
                    animation: 'fadeIn 500ms ease',
                    '@keyframes fadeIn': {
                      from: { opacity: 0, transform: 'translateY(12px)' },
                      to: { opacity: 1, transform: 'translateY(0)' },
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, mb: 1 }}>
                    <Typography
                      sx={{
                        color: '#B45309',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.15em',
                      }}
                    >
                      Single-Origin Farm Apiary
                    </Typography>
                    <Typography sx={{ color: '#788267', fontSize: '0.95rem', fontStyle: 'italic' }}>
                      {currentHoney.tamilName}
                    </Typography>
                  </Box>

                  <Typography
                    variant="h1"
                    sx={{
                      fontSize: { xs: '2.4rem', sm: '3.2rem', md: '3.8rem' },
                      color: '#173B28',
                      lineHeight: 1.08,
                      mb: 1.5,
                      fontWeight: 500,
                    }}
                  >
                    Raw Farm Honey
                  </Typography>

                  <Typography
                    sx={{
                      color: '#5B3A24',
                      fontSize: '1.05rem',
                      lineHeight: 1.7,
                      mb: 3,
                      maxWidth: 520,
                    }}
                  >
                    {currentHoney.description}
                  </Typography>

                  {/* Honey Size Selector */}
                  <Box sx={{ mb: 3.5 }}>
                    <Typography
                      sx={{
                        fontSize: '0.78rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.12em',
                        color: '#788267',
                        fontWeight: 600,
                        mb: 1.5,
                      }}
                    >
                      Choose Available Jar Size
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                      {honeyProducts.map((h) => {
                        const isSelected = h.id === selectedHoneyId;
                        return (
                          <Chip
                            key={h.id}
                            label={`${h.name} · ₹${h.price}`}
                            clickable
                            onClick={() => setSelectedHoneyId(h.id)}
                            sx={{
                              bgcolor: isSelected ? '#B45309' : '#FFFDF8',
                              color: isSelected ? '#FFFDF8' : '#173B28',
                              border: '1px solid',
                              borderColor: isSelected ? '#B45309' : 'rgba(23,59,40,0.18)',
                              fontWeight: isSelected ? 700 : 500,
                              fontSize: '0.85rem',
                              py: 2.2,
                              px: 1,
                              transition: 'all 200ms ease',
                            }}
                          />
                        );
                      })}
                    </Box>
                  </Box>

                  {/* Price & Cart Actions */}
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      gap: 3,
                      pt: 2,
                      borderTop: '1px solid rgba(23,59,40,0.08)',
                    }}
                  >
                    <Box>
                      <Typography sx={{ fontSize: '0.75rem', color: '#788267', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Bottle Price
                      </Typography>
                      <Typography sx={{ fontSize: '2rem', fontWeight: 800, color: '#B45309', lineHeight: 1 }}>
                        ₹{currentHoney.price}
                      </Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: '#788267', mt: 0.3 }}>
                        {currentHoney.unit}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1.5, flex: { xs: '1 1 100%', sm: 'auto' } }}>
                      {currentHoney.stockStatus !== 'out_of_stock' ? (
                        <Button
                          variant={isHoneyInCart ? 'outlined' : 'contained'}
                          onClick={() =>
                            addItem(
                              {
                                id: currentHoney.id,
                                name: currentHoney.name,
                                category: 'honey',
                                price: currentHoney.price,
                                unit: currentHoney.unit,
                                image: currentHoney.image,
                              },
                              1,
                            )
                          }
                          startIcon={
                            isHoneyInCart ? (
                              <CheckCircleOutlineIcon />
                            ) : (
                              <ShoppingBagOutlinedIcon />
                            )
                          }
                          sx={{
                            bgcolor: isHoneyInCart ? 'transparent' : '#173B28',
                            color: isHoneyInCart ? '#173B28' : '#FFFDF8',
                            px: 3.5,
                            py: 1.5,
                            fontWeight: 700,
                            borderRadius: 2,
                            '&:hover': {
                              bgcolor: isHoneyInCart ? 'rgba(23,59,40,0.08)' : '#26543C',
                            },
                          }}
                        >
                          {isHoneyInCart ? 'In Cart' : 'Add to Cart'}
                        </Button>
                      ) : (
                        <Button disabled variant="contained" sx={{ px: 3, py: 1.5, bgcolor: '#E5E7EB', color: '#9CA3AF' }}>
                          Currently Out of Stock
                        </Button>
                      )}

                      <Button
                        variant="outlined"
                        startIcon={<WhatsAppIcon />}
                        onClick={() => {
                          const msg = `Hello, I want to order ${currentHoney.name} from TS Mango Farming.`;
                          window.open(whatsappLink(msg), '_blank');
                        }}
                        sx={{
                          borderColor: 'rgba(23,59,40,0.3)',
                          color: '#173B28',
                          px: 2.5,
                          py: 1.5,
                          borderRadius: 2,
                        }}
                      >
                        WhatsApp Order
                      </Button>
                    </Box>
                  </Box>
                </Box>
              )}

              {/* -------------------- STAGE 2: JACKFRUIT -------------------- */}
              {activeStage === 2 && (
                <Box
                  sx={{
                    animation: 'fadeIn 500ms ease',
                    '@keyframes fadeIn': {
                      from: { opacity: 0, transform: 'translateY(12px)' },
                      to: { opacity: 1, transform: 'translateY(0)' },
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, mb: 1 }}>
                    <Typography
                      sx={{
                        color: '#2E6930',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.15em',
                      }}
                    >
                      Village Grove Harvest
                    </Typography>
                    <Typography sx={{ color: '#788267', fontSize: '0.95rem', fontStyle: 'italic' }}>
                      {jackfruitProduct.tamilName}
                    </Typography>
                  </Box>

                  <Typography
                    variant="h1"
                    sx={{
                      fontSize: { xs: '2.4rem', sm: '3.2rem', md: '3.8rem' },
                      color: '#173B28',
                      lineHeight: 1.08,
                      mb: 1.5,
                      fontWeight: 500,
                    }}
                  >
                    Fresh Honey Jackfruit
                  </Typography>

                  <Typography
                    sx={{
                      color: '#5B3A24',
                      fontSize: '1.05rem',
                      lineHeight: 1.7,
                      mb: 3,
                      maxWidth: 520,
                    }}
                  >
                    {jackfruitProduct.description}
                  </Typography>

                  {/* Jackfruit Detail Note */}
                  <Box
                    sx={{
                      bgcolor: '#FFFDF8',
                      p: 2,
                      borderRadius: 2,
                      border: '1px solid rgba(23,59,40,0.1)',
                      mb: 3.5,
                    }}
                  >
                    <Typography sx={{ fontSize: '0.82rem', color: '#173B28', fontWeight: 600 }}>
                      Seasonal Pack: 1 KG Fresh Bulbs Box
                    </Typography>
                    <Typography sx={{ fontSize: '0.78rem', color: '#788267' }}>
                      Naturally tree-ripened Then-Varikkai jackfruit with crunchy, golden bulbs.
                    </Typography>
                  </Box>

                  {/* Price & Cart Actions */}
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      gap: 3,
                      pt: 2,
                      borderTop: '1px solid rgba(23,59,40,0.08)',
                    }}
                  >
                    <Box>
                      <Typography sx={{ fontSize: '0.75rem', color: '#788267', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Fresh Box Price
                      </Typography>
                      <Typography sx={{ fontSize: '2rem', fontWeight: 800, color: '#173B28', lineHeight: 1 }}>
                        ₹{jackfruitProduct.price}
                      </Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: '#788267', mt: 0.3 }}>
                        Per 1 KG Pack
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1.5, flex: { xs: '1 1 100%', sm: 'auto' } }}>
                      {jackfruitProduct.stockStatus !== 'out_of_stock' ? (
                        <Button
                          variant={isJackfruitInCart ? 'outlined' : 'contained'}
                          onClick={() =>
                            addItem(
                              {
                                id: jackfruitProduct.id,
                                name: jackfruitProduct.name,
                                category: 'jackfruit',
                                price: jackfruitProduct.price,
                                unit: jackfruitProduct.unit,
                                image: jackfruitProduct.image,
                              },
                              1,
                            )
                          }
                          startIcon={
                            isJackfruitInCart ? (
                              <CheckCircleOutlineIcon />
                            ) : (
                              <ShoppingBagOutlinedIcon />
                            )
                          }
                          sx={{
                            bgcolor: isJackfruitInCart ? 'transparent' : '#173B28',
                            color: isJackfruitInCart ? '#173B28' : '#FFFDF8',
                            px: 3.5,
                            py: 1.5,
                            fontWeight: 700,
                            borderRadius: 2,
                            '&:hover': {
                              bgcolor: isJackfruitInCart ? 'rgba(23,59,40,0.08)' : '#26543C',
                            },
                          }}
                        >
                          {isJackfruitInCart ? 'In Cart' : 'Add to Cart'}
                        </Button>
                      ) : (
                        <Button disabled variant="contained" sx={{ px: 3, py: 1.5, bgcolor: '#E5E7EB', color: '#9CA3AF' }}>
                          Currently Out of Stock
                        </Button>
                      )}

                      <Button
                        variant="outlined"
                        startIcon={<WhatsAppIcon />}
                        onClick={() => {
                          const msg = `Hello, I want to order fresh Jackfruit from TS Mango Farming.`;
                          window.open(whatsappLink(msg), '_blank');
                        }}
                        sx={{
                          borderColor: 'rgba(23,59,40,0.3)',
                          color: '#173B28',
                          px: 2.5,
                          py: 1.5,
                          borderRadius: 2,
                        }}
                      >
                        WhatsApp Order
                      </Button>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProductStoryStage;
