import { useState, useEffect, type FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import SectionLabel from '../SectionLabel';
import { useCart } from '../../context/CartContext';
import { supabase } from '../../lib/supabase';
import { otherFarmProducts, type OtherFarmProduct } from '../../data/siteData';

const HoneyWorldSection: FC = () => {
  const initialHoney = otherFarmProducts.filter((p) => p.category === 'honey');
  const [honeyList, setHoneyList] = useState<OtherFarmProduct[]>(initialHoney);
  const [selectedId, setSelectedId] = useState<string>(initialHoney[0]?.id || 'farm-honey-500g');
  const { addItem, items } = useCart();

  useEffect(() => {
    const fetchLiveHoney = async () => {
      try {
        const { data } = await supabase
          .from('products')
          .select('*')
          .eq('category', 'honey')
          .eq('is_active', true);
        if (data && data.length > 0) {
          setHoneyList((prev) =>
            prev.map((item) => {
              const match = data.find((d) => d.product_code === item.id);
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
        }
      } catch {
        // baseline
      }
    };
    fetchLiveHoney();
  }, []);

  const activeHoney = honeyList.find((h) => h.id === selectedId) || honeyList[0];
  const isInCart = items.some((i) => i.id === activeHoney.id);
  const isOutOfStock = activeHoney.stockStatus === 'out_of_stock';

  return (
    <Box
      id="honey"
      sx={{
        bgcolor: '#FAF4E8',
        background: 'radial-gradient(ellipse at 15% 45%, rgba(217,148,25,0.06) 0%, #FAF4E8 65%)',
        pt: { xs: 4, md: 5.5 },
        pb: { xs: 4, md: 5.5 },
        px: { xs: 3, md: 6, lg: 8 },
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid rgba(180,83,9,0.08)',
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
          {/* REAL NATURAL PHOTOGRAPHY (NO ARTIFICIAL GLOW OR 3D RENDERS) */}
          <Box
            sx={{
              position: 'relative',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 20px 48px -12px rgba(91,58,36,0.12)',
              border: '1px solid rgba(180,83,9,0.1)',
              aspectRatio: { xs: '4/3', sm: '16/11', md: '16/12' },
              bgcolor: '#EAE1D0',
            }}
          >
            <Box
              component="img"
              src={activeHoney.image || "https://images.pexels.com/photos/9106164/pexels-photo-9106164.jpeg?auto=compress&cs=tinysrgb&w=1200"}
              alt={activeHoney.name}
              loading="lazy"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                transition: 'opacity 300ms ease',
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
              Farm Apiary · Pure Blossom Honey
            </Box>
          </Box>

          {/* PRODUCT INFORMATION & PURCHASE */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              <SectionLabel color="#B45309">Single-Origin Farm Apiary</SectionLabel>
              <Typography
                component="span"
                sx={{
                  fontSize: '0.8rem',
                  color: '#B45309',
                  opacity: 0.85,
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                }}
              >
                இயற்கை தேன்
              </Typography>
            </Box>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2.1rem', sm: '2.6rem', md: '3rem' },
                color: '#173B28',
                lineHeight: 1.12,
                mb: 1.5,
                fontWeight: 400,
              }}
            >
              Natural Farm Honey
            </Typography>

            <Typography
              sx={{
                color: '#5B3A24',
                fontSize: '0.98rem',
                lineHeight: 1.7,
                mb: 2.8,
                maxWidth: 520,
              }}
            >
              Cold-extracted raw honey collected directly from bee colonies situated in our mango blossoms and orchard flora. Pure and unheated, retaining natural aroma and floral character.
            </Typography>

            {/* Size Selector */}
            <Box sx={{ mb: 2.8 }}>
              <Typography sx={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#788267', fontWeight: 600, mb: 1.2 }}>
                Available Glass Jar Sizes
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.2, flexWrap: 'wrap' }}>
                {honeyList.map((h) => {
                  const isSelected = h.id === selectedId;
                  return (
                    <Chip
                      key={h.id}
                      label={`${h.name} · ₹${h.price}`}
                      clickable
                      onClick={() => setSelectedId(h.id)}
                      sx={{
                        bgcolor: isSelected ? '#173B28' : '#FFFDF8',
                        color: isSelected ? '#FFFDF8' : '#173B28',
                        border: '1px solid',
                        borderColor: isSelected ? '#173B28' : 'rgba(23,59,40,0.2)',
                        fontWeight: isSelected ? 700 : 500,
                        fontSize: '0.82rem',
                        py: 1.8,
                        px: 1,
                      }}
                    />
                  );
                })}
              </Box>
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
                  ₹{activeHoney.price}
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: '#788267', mt: 0.3 }}>
                  {activeHoney.unit}
                </Typography>
              </Box>

              <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
                {!isOutOfStock ? (
                  <Button
                    variant={isInCart ? 'outlined' : 'contained'}
                    onClick={() =>
                      addItem(
                        {
                          id: activeHoney.id,
                          name: activeHoney.name,
                          category: 'honey',
                          price: activeHoney.price,
                          unit: activeHoney.unit,
                          image: activeHoney.image,
                        },
                        1,
                      )
                    }
                    startIcon={isInCart ? <CheckCircleOutlineIcon /> : <ShoppingBagOutlinedIcon />}
                    sx={{
                      width: { xs: '100%', sm: 'auto' },
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

export default HoneyWorldSection;
