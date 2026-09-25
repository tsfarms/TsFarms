import { useRef, useEffect, type FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import NatureOutlinedIcon from '@mui/icons-material/NatureOutlined';
import {
  jackfruitImage,
  otherFarmProducts,
  whatsappLink,
} from '../../data/siteData';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { useCart } from '../../context/CartContext';
import SectionLabel from '../SectionLabel';

export const JackfruitParallax: FC = () => {
  const reduced = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();

  const jackfruit = otherFarmProducts.find((p) => p.id === 'fresh-jackfruit-bulb');

  useEffect(() => {
    if (reduced) return;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (sectionRef.current) {
            const rect = sectionRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            if (rect.top < windowHeight && rect.bottom > 0) {
              const offset = (windowHeight - rect.top) * 0.15;
              sectionRef.current.style.setProperty('--jackfruit-parallax', `${offset}px`);
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

  const handleEnquiry = () => {
    const message = `Hello, I am interested in seasonal fresh Then-Varikkai Jackfruit from TS Mango Farming. Please let me know today's availability and harvest date.`;
    window.open(whatsappLink(message), '_blank', 'noopener,noreferrer');
  };

  return (
    <Box
      id="jackfruit"
      ref={sectionRef}
      sx={{
        position: 'relative',
        bgcolor: '#EAEFE9',
        py: { xs: 10, md: 16 },
        px: { xs: 3, md: 6, lg: 8 },
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          maxWidth: 1300,
          mx: 'auto',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: { xs: 6, md: 10 },
          alignItems: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Left Side: Storytelling & Action */}
        <Box sx={{ order: { xs: 1, md: 1 } }}>
          <SectionLabel>Traditional Tamil Nadu Mukkani (மா · பலா · வாழை)</SectionLabel>

          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2.4rem', md: '3.4rem' },
              color: '#173B28',
              lineHeight: 1.15,
              mb: 1.5,
            }}
          >
            Village Jackfruit (பலாப்பழம்)
          </Typography>

          <Typography
            sx={{
              color: '#4B6B4E',
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: '1.4rem',
              fontStyle: 'italic',
              fontWeight: 600,
              mb: 2.5,
            }}
          >
            தேனின் சுவையுடைய செழுமையான தேன் வரிக்கைப் பலா
          </Typography>

          <Typography
            sx={{
              color: '#5B3A24',
              fontSize: '1.05rem',
              lineHeight: 1.8,
              mb: 4,
            }}
          >
            Among Tamil traditions, Jackfruit holds a sacred place as part of the celebrated <em>Mukkani</em> trio.
            Our farm trees are aged heirloom native varieties producing dense, golden bulbs with a satisfying crunch and honeyed sweetness. 
            Because ripening happens naturally on the tree canopy, each fruit carries unforgettable aroma.
          </Typography>

          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 4 }}>
            <Chip
              icon={<NatureOutlinedIcon style={{ color: '#173B28' }} />}
              label="100% Tree-Ripened"
              sx={{ bgcolor: '#D9E6D8', color: '#173B28', fontWeight: 600 }}
            />
            <Chip
              icon={<NatureOutlinedIcon style={{ color: '#173B28' }} />}
              label="Then-Varikkai Variety"
              sx={{ bgcolor: '#D9E6D8', color: '#173B28', fontWeight: 600 }}
            />
            <Chip
              icon={<NatureOutlinedIcon style={{ color: '#173B28' }} />}
              label="Harvested On Order"
              sx={{ bgcolor: '#D9E6D8', color: '#173B28', fontWeight: 600 }}
            />
          </Box>

          {/* Product Purchase Box */}
          {jackfruit && (
            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: '#FFFDF8',
                border: '1px solid rgba(23,59,40,0.15)',
                boxShadow: '0 6px 20px rgba(23,59,40,0.06)',
                mb: 4,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                <Box>
                  <Typography sx={{ fontWeight: 700, color: '#173B28', fontSize: '1.1rem' }}>
                    {jackfruit.name}
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', color: '#788267' }}>
                    {jackfruit.tamilName} · Freshly deseeded sweet bulbs
                  </Typography>
                </Box>
                <Chip
                  label="Seasonal Batch"
                  size="small"
                  sx={{ bgcolor: '#FEF3C7', color: '#92400E', fontWeight: 700, fontSize: '0.7rem' }}
                />
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                <Box>
                  <Typography sx={{ fontWeight: 800, color: '#173B28', fontSize: '1.35rem' }}>
                    ₹{jackfruit.price}
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: '#5B3A24' }}>
                    Per {jackfruit.unit}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<ShoppingBagOutlinedIcon />}
                    onClick={() =>
                      addItem(
                        {
                          id: jackfruit.id,
                          name: jackfruit.name,
                          tamilName: jackfruit.tamilName,
                          category: 'jackfruit',
                          price: jackfruit.price,
                          unit: jackfruit.unit,
                          image: jackfruit.image,
                        },
                        1,
                      )
                    }
                    sx={{ py: 1, px: 2.5, borderRadius: 1 }}
                  >
                    Add to Cart
                  </Button>
                </Box>
              </Box>
            </Box>
          )}

          <Button
            variant="outlined"
            startIcon={<WhatsAppIcon />}
            onClick={handleEnquiry}
            sx={{
              borderColor: '#25D366',
              color: '#128C7E',
              py: 1.2,
              px: 3,
              '&:hover': { borderColor: '#128C7E', bgcolor: 'rgba(37,211,102,0.08)' },
            }}
          >
            Check Season Harvest Dates
          </Button>
        </Box>

        {/* Right Side: Parallax Image Showcase */}
        <Box
          sx={{
            position: 'relative',
            order: { xs: 2, md: 2 },
          }}
        >
          <Box
            sx={{
              position: 'relative',
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: '0 25px 50px rgba(23, 59, 40, 0.16)',
              aspectRatio: '4/5',
              transform: reduced ? 'none' : 'translate3d(0, calc(var(--jackfruit-parallax, 0px) * -0.2), 0)',
              willChange: 'transform',
              border: '2px solid rgba(120, 130, 103, 0.3)',
            }}
          >
            <Box
              component="img"
              src={jackfruitImage}
              alt="Tree Ripened Tamil Nadu Jackfruit"
              loading="lazy"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'brightness(0.96) saturate(1.1)',
              }}
            />

            <Box
              sx={{
                position: 'absolute',
                bottom: 24,
                left: 24,
                right: 24,
                bgcolor: 'rgba(255, 253, 248, 0.94)',
                backdropFilter: 'blur(8px)',
                p: 2.5,
                borderRadius: 2,
                border: '1px solid rgba(23, 59, 40, 0.15)',
              }}
            >
              <Typography sx={{ fontWeight: 700, color: '#173B28', fontSize: '1rem', mb: 0.5 }}>
                Harvested at Peak Tree-Maturity
              </Typography>
              <Typography sx={{ fontSize: '0.82rem', color: '#5B3A24', lineHeight: 1.5 }}>
                Packed immediately in clean sanitary food-grade boxes, ensuring you receive sweet, non-slimy crisp bulbs with maximum freshness.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default JackfruitParallax;
