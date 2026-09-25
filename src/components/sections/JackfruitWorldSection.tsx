import { useState, useEffect, type FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import SectionLabel from '../SectionLabel';
import { useCart } from '../../context/CartContext';
import { supabase } from '../../lib/supabase';
import { otherFarmProducts, jackfruitImage, type OtherFarmProduct } from '../../data/siteData';

const JackfruitWorldSection: FC = () => {
  const defaultJackfruit =
    otherFarmProducts.find((p) => p.category === 'jackfruit') || otherFarmProducts[2];
  const [product, setProduct] = useState<OtherFarmProduct>(defaultJackfruit);
  const { addItem, items } = useCart();

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
        // baseline
      }
    };
    fetchLiveJackfruit();
  }, []);

  const isInCart = items.some((i) => i.id === product.id);
  const isOutOfStock = product.stockStatus === 'out_of_stock';

  return (
    <Box
      id="jackfruit"
      sx={{
        bgcolor: '#F2F6ED',
        background: 'radial-gradient(ellipse at 85% 45%, rgba(46,105,48,0.06) 0%, #F2F6ED 65%)',
        pt: { xs: 4, md: 5.5 },
        pb: { xs: 4, md: 5.5 },
        px: { xs: 3, md: 6, lg: 8 },
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid rgba(46,105,48,0.08)',
      }}
    >
      <Box sx={{ maxWidth: 1220, mx: 'auto' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.08fr 1fr' },
            gap: { xs: 4, md: 6 },
            alignItems: 'center',
          }}
        >
          {/* REAL NATURAL PHOTOGRAPHY */}
          <Box
            sx={{
              position: 'relative',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 20px 48px -12px rgba(23,59,40,0.12)',
              border: '1px solid rgba(46,105,48,0.1)',
              aspectRatio: { xs: '4/3', sm: '16/11', md: '16/12' },
              bgcolor: '#DEE8D6',
            }}
          >
            <Box
              component="img"
              src={jackfruitImage}
              alt="Fresh honey jackfruit bulbs"
              loading="lazy"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: 16,
                left: 16,
                bgcolor: 'rgba(23,59,40,0.85)',
                backdropFilter: 'blur(8px)',
                px: 1.8,
                py: 0.6,
                borderRadius: 20,
                fontSize: '0.74rem',
                color: '#FFFDF8',
                fontWeight: 600,
              }}
            >
              Village Groves · Tree-Ripened Then-Varikkai
            </Box>
          </Box>

          {/* PRODUCT DETAILS & PURCHASE */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              <SectionLabel color="#2E6930">Village Grove Harvest</SectionLabel>
              <Typography
                component="span"
                sx={{
                  fontSize: '0.8rem',
                  color: '#2E6930',
                  opacity: 0.85,
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                }}
              >
                தேன் பலாப்பழம்
              </Typography>
            </Box>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2.1rem', sm: '2.6rem', md: '3rem' },
                color: '#173B28',
                lineHeight: 1.12,
                mb: { xs: 2, md: 2.5 },
                fontWeight: 400,
              }}
            >
              Sweet Honey Jackfruit
            </Typography>

            {/* Packaging Note */}
            <Box
              sx={{
                bgcolor: '#FFFDF8',
                p: 2,
                borderRadius: 2,
                border: '1px solid rgba(23,59,40,0.1)',
                mb: { xs: 2.2, md: 2.8 },
              }}
            >
              <Typography sx={{ fontSize: '0.82rem', color: '#173B28', fontWeight: 700, mb: 0.3 }}>
                Farm Pack: 1 KG Fresh Bulbs Box
              </Typography>
              <Typography sx={{ fontSize: '0.78rem', color: '#788267' }}>
                Hand-cleaned and deseeded fresh bulbs, ready to enjoy at home.
              </Typography>
            </Box>

            {/* Live Pricing & Single Primary CTA (No Individual WhatsApp Button) */}
            <Box
              sx={{
                pt: 2,
                borderTop: '1px solid rgba(23,59,40,0.08)',
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', sm: 'center' },
                gap: 2,
              }}
            >
              <Box>
                <Typography sx={{ fontSize: '0.72rem', color: '#788267', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Live Farm Price
                </Typography>
                <Typography sx={{ fontSize: '1.85rem', fontWeight: 800, color: '#173B28', lineHeight: 1 }}>
                  ₹{product.price}
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: '#788267', mt: 0.3 }}>
                  Per 1 KG Fresh Pack
                </Typography>
              </Box>

              <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
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
                    startIcon={isInCart ? <CheckCircleOutlineIcon /> : <ShoppingBagOutlinedIcon />}
                    sx={{
                      width: { xs: '100%', sm: 'auto' },
                      minHeight: 44,
                      bgcolor: isInCart ? 'transparent' : '#173B28',
                      color: isInCart ? '#173B28' : '#FFFDF8',
                      px: 3.5,
                      py: 1.15,
                      fontWeight: 700,
                      fontSize: '0.84rem',
                      borderRadius: '10px',
                      border: isInCart ? '1.5px solid #173B28' : 'none',
                      '&:hover': {
                        bgcolor: isInCart ? 'rgba(23,59,40,0.08)' : '#26543C',
                      },
                    }}
                  >
                    {isInCart ? 'In Cart' : 'Add to Cart'}
                  </Button>
                ) : (
                  <Button disabled variant="contained" sx={{ width: { xs: '100%', sm: 'auto' }, px: 3, py: 1.15, bgcolor: '#E5E7EB', color: '#9CA3AF', borderRadius: '10px' }}>
                    Currently Out of Stock
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default JackfruitWorldSection;
