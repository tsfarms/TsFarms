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
  productImages,
  honeyImage,
  whatsappLink,
  type OtherFarmProduct,
} from '../../data/siteData';

const HoneyStory: FC = () => {
  const containerRef = useScrollParallax<HTMLDivElement>();
  const [contentRef, visible] = useReveal<HTMLDivElement>({ threshold: 0.15 });
  const { addItem, items } = useCart();

  const initialHoneyProducts = otherFarmProducts.filter((p) => p.category === 'honey');
  const [honeyList, setHoneyList] = useState<OtherFarmProduct[]>(initialHoneyProducts);

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
        // use baseline
      }
    };
    fetchLiveHoney();
  }, []);

  return (
    <Box
      id="honey"
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
          {/* Left Column: Story & Products */}
          <Box>
            <SectionLabel color="#B45309">Farm Apiary Harvest</SectionLabel>
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
              Raw Blossom Honey.<br />
              Straight from our hives.
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
              Cold-extracted directly from bee colonies situated among our seasonal mango blossoms. Never pasteurized, ultra-filtered, or adulterated with sugar syrups. Pure, unheated liquid gold.
            </Typography>

            {/* Pack Size Selectors / Direct Order Cards */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, maxWidth: 480 }}>
              {honeyList.map((honey) => {
                const isInCart = items.some((i) => i.id === honey.id);
                const isOutOfStock = honey.stockStatus === 'out_of_stock';

                return (
                  <Box
                    key={honey.id}
                    sx={{
                      p: 2.5,
                      borderRadius: 2,
                      bgcolor: '#FAF6EE',
                      border: '1px solid rgba(23,59,40,0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 2,
                      transition: 'all 200ms ease',
                      '&:hover': {
                        borderColor: '#D99419',
                        boxShadow: '0 8px 24px rgba(217,148,25,0.08)',
                      },
                    }}
                  >
                    <Box>
                      <Typography sx={{ fontWeight: 700, color: '#173B28', fontSize: '1.05rem', mb: 0.3 }}>
                        {honey.name}
                      </Typography>
                      <Typography sx={{ color: '#788267', fontSize: '0.82rem' }}>
                        {honey.unit} • Single-Origin Harvest
                      </Typography>
                      <Typography sx={{ fontWeight: 800, color: '#B45309', fontSize: '1.15rem', mt: 0.5 }}>
                        ₹{honey.price}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {!isOutOfStock ? (
                        <Button
                          variant={isInCart ? 'outlined' : 'contained'}
                          size="small"
                          onClick={() =>
                            addItem(
                              {
                                id: honey.id,
                                name: honey.name,
                                category: 'honey',
                                price: honey.price,
                                unit: honey.unit,
                                image: honey.image,
                              },
                              1,
                            )
                          }
                          startIcon={
                            isInCart ? (
                              <CheckCircleOutlineIcon sx={{ fontSize: '1rem' }} />
                            ) : (
                              <ShoppingBagOutlinedIcon sx={{ fontSize: '1rem' }} />
                            )
                          }
                          sx={{
                            bgcolor: isInCart ? 'transparent' : '#173B28',
                            color: isInCart ? '#173B28' : '#FFFDF8',
                            borderColor: '#173B28',
                            fontWeight: 700,
                            fontSize: '0.82rem',
                            px: 2,
                            py: 1,
                            borderRadius: 1.5,
                            '&:hover': {
                              bgcolor: isInCart ? 'rgba(23,59,40,0.06)' : '#234C35',
                            },
                          }}
                        >
                          {isInCart ? 'Add Another' : '+ Add to Cart'}
                        </Button>
                      ) : (
                        <Button variant="outlined" size="small" disabled sx={{ fontSize: '0.75rem' }}>
                          Out of Stock
                        </Button>
                      )}

                      <Box
                        component="button"
                        onClick={() => {
                          const msg = `Hello TS Mango Farming, I would like to order ${honey.name} (₹${honey.price}). Please confirm availability.`;
                          window.open(whatsappLink(msg), '_blank', 'noopener,noreferrer');
                        }}
                        sx={{
                          p: 1,
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
                        <WhatsAppIcon sx={{ fontSize: '1.2rem' }} />
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>

          {/* Right Column: Layered Parallax Honey Imagery */}
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
                boxShadow: '0 24px 50px rgba(180,83,9,0.14)',
                transform: 'translate3d(0, var(--parallax-slow, 0px), 0)',
                transition: 'transform 200ms ease-out',
                willChange: 'transform',
              }}
            >
              <Box
                component="img"
                src={honeyImage || productImages.honey}
                alt="Raw blossom honey jar in golden orchard light"
                loading="lazy"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'saturate(1.08)',
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'scale(1)' : 'scale(1.06)',
                  transition: 'opacity 900ms ease, transform 1100ms ease',
                }}
              />
            </Box>

            {/* Overlapping Parallax Stamp */}
            <Box
              sx={{
                position: 'absolute',
                top: { xs: 20, md: 30 },
                right: { xs: 10, md: -20 },
                bgcolor: 'rgba(255, 253, 248, 0.94)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(180,83,9,0.2)',
                p: 2,
                borderRadius: 2,
                boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
                transform: 'translate3d(0, var(--parallax-fast, 0px), 0)',
                transition: 'transform 200ms ease-out',
                willChange: 'transform',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              <Typography sx={{ fontWeight: 800, color: '#B45309', fontSize: '0.85rem' }}>
                100% Unheated & Raw
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#5B3A24' }}>
                Rich in live floral pollen
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default HoneyStory;
