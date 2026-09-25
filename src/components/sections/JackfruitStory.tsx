import { useState, useEffect, type FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import SectionLabel from '../SectionLabel';
import { useScrollParallax } from '../../hooks/useScrollParallax';
import { useReveal } from '../../hooks/useReveal';
import { useCart } from '../../context/CartContext';
import { supabase } from '../../lib/supabase';
import {
  otherFarmProducts,
  jackfruitImage,
  productImages,
  whatsappLink,
  type OtherFarmProduct,
} from '../../data/siteData';

const JackfruitStory: FC = () => {
  const containerRef = useScrollParallax<HTMLDivElement>();
  const [contentRef, visible] = useReveal<HTMLDivElement>({ threshold: 0.15 });
  const { addItem, items } = useCart();

  const defaultJackfruit = otherFarmProducts.find((p) => p.category === 'jackfruit') || otherFarmProducts[2];
  const [product, setProduct] = useState<OtherFarmProduct>(defaultJackfruit);

  useEffect(() => {
    const fetchLiveJackfruit = async () => {
      try {
        const { data } = await supabase
          .from('products')
          .select('*')
          .eq('product_code', 'fresh-jackfruit-bulb')
          .maybeSingle();

        if (data) {
          setProduct((prev) => ({
            ...prev,
            price: Number(data.price) || prev.price,
            unit: data.unit || prev.unit,
            stockStatus: data.stock_status || prev.stockStatus,
          }));
        }
      } catch {
        // use baseline
      }
    };
    fetchLiveJackfruit();
  }, []);

  const isInCart = items.some((i) => i.id === product.id);
  const isOutOfStock = product.stockStatus === 'out_of_stock';

  return (
    <Box
      id="jackfruit"
      ref={containerRef}
      sx={{
        position: 'relative',
        bgcolor: '#FFFDF8',
        py: { xs: 10, md: 16 },
        px: { xs: 3, md: 6, lg: 10 },
        overflow: 'hidden',
        borderTop: '1px solid rgba(23,59,40,0.06)',
      }}
    >
      <Box sx={{ maxWidth: 1300, mx: 'auto' }}>
        <Box
          ref={contentRef}
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1.1fr' },
            gap: { xs: 6, md: 10 },
            alignItems: 'center',
          }}
        >
          {/* Left Column: Product Story */}
          <Box>
            <SectionLabel color="#2E6930">Seasonal Grove Harvest</SectionLabel>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2.4rem', sm: '3rem', md: '3.6rem' },
                color: '#173B28',
                lineHeight: 1.08,
                mb: 2.5,
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 700ms ease 150ms, transform 700ms ease 150ms',
              }}
            >
              Sweet Honey Jackfruit.<br />
              Tree-ripened & freshly packed.
            </Typography>
            <Typography
              sx={{
                color: '#5B3A24',
                fontSize: { xs: '1rem', md: '1.12rem' },
                lineHeight: 1.75,
                mb: 5,
                maxWidth: 520,
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(16px)',
                transition: 'opacity 700ms ease 300ms, transform 700ms ease 300ms',
              }}
            >
              Prized Then-Varikkai jackfruit grown in our village groves. Crunchy, golden bulbs naturally ripened on the tree trunk, carefully deseeded and packed into breathable fresh boxes for pure fruit enjoyment.
            </Typography>

            {/* Direct Order Card */}
            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: '#FAF6EE',
                border: '1px solid rgba(23,59,40,0.08)',
                maxWidth: 480,
                transition: 'all 200ms ease',
                '&:hover': {
                  borderColor: '#2E6930',
                  boxShadow: '0 8px 24px rgba(46,105,48,0.08)',
                },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography sx={{ fontWeight: 700, color: '#173B28', fontSize: '1.15rem' }}>
                    {product.name}
                  </Typography>
                  <Typography sx={{ color: '#788267', fontSize: '0.85rem' }}>
                    {product.unit} • Deseeded Fresh Bulbs
                  </Typography>
                </Box>
                <Typography sx={{ fontWeight: 800, color: '#173B28', fontSize: '1.3rem' }}>
                  ₹{product.price}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 1.5 }}>
                {!isOutOfStock ? (
                  <Button
                    variant={isInCart ? 'outlined' : 'contained'}
                    onClick={() =>
                      addItem(
                        {
                          id: product.id,
                          name: product.name,
                          category: 'jackfruit',
                          price: product.price,
                          unit: product.unit,
                          image: product.image,
                        },
                        1,
                      )
                    }
                    startIcon={
                      isInCart ? (
                        <CheckCircleOutlineIcon sx={{ fontSize: '1.1rem' }} />
                      ) : (
                        <ShoppingBagOutlinedIcon sx={{ fontSize: '1.1rem' }} />
                      )
                    }
                    sx={{
                      flex: 1,
                      bgcolor: isInCart ? 'transparent' : '#173B28',
                      color: isInCart ? '#173B28' : '#FFFDF8',
                      borderColor: '#173B28',
                      fontWeight: 700,
                      py: 1.2,
                      borderRadius: 1.5,
                      '&:hover': {
                        bgcolor: isInCart ? 'rgba(23,59,40,0.06)' : '#234C35',
                      },
                    }}
                  >
                    {isInCart ? 'Add Another Box' : '+ Add 1 KG Box to Cart'}
                  </Button>
                ) : (
                  <Button variant="outlined" disabled sx={{ flex: 1 }}>
                    Sold Out for Season
                  </Button>
                )}

                <Box
                  component="button"
                  onClick={() => {
                    const msg = `Hello TS Mango Farming, I would like to order ${product.name} (₹${product.price}). Please confirm harvest availability.`;
                    window.open(whatsappLink(msg), '_blank', 'noopener,noreferrer');
                  }}
                  sx={{
                    px: 2,
                    border: '1px solid #D1D5DB',
                    borderRadius: 1.5,
                    background: 'none',
                    cursor: 'pointer',
                    color: '#128C7E',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '&:hover': { bgcolor: 'rgba(37,211,102,0.08)' },
                  }}
                  title="Enquire on WhatsApp"
                >
                  <WhatsAppIcon sx={{ fontSize: '1.3rem' }} />
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Right Column: Layered Parallax Jackfruit Imagery */}
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                maxWidth: 500,
                aspectRatio: '4/5',
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: '0 24px 50px rgba(23,59,40,0.14)',
                transform: 'translate3d(0, var(--parallax-slow, 0px), 0)',
                transition: 'transform 200ms ease-out',
                willChange: 'transform',
              }}
            >
              <Box
                component="img"
                src={jackfruitImage || productImages.jackfruit}
                alt="Ripe sweet honey jackfruit bulbs from farm grove"
                loading="lazy"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'saturate(1.06)',
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'scale(1)' : 'scale(1.06)',
                  transition: 'opacity 900ms ease, transform 1100ms ease',
                }}
              />
            </Box>

            {/* Overlapping Stamp */}
            <Box
              sx={{
                position: 'absolute',
                bottom: { xs: -15, md: -20 },
                right: { xs: 15, md: -15 },
                bgcolor: '#173B28',
                color: '#FFFDF8',
                p: { xs: 2.5, md: 3 },
                borderRadius: 2,
                boxShadow: '0 16px 36px rgba(0,0,0,0.15)',
                transform: 'translate3d(0, var(--parallax-fast, 0px), 0)',
                transition: 'transform 200ms ease-out',
                willChange: 'transform',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic', fontSize: '1.4rem', mb: 0.3 }}>
                Tree-Ripened Varikkai
              </Typography>
              <Typography sx={{ fontSize: '0.8rem', opacity: 0.85 }}>
                Crunchy, golden & naturally sweet
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default JackfruitStory;
