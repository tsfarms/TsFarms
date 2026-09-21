import { useRef, useEffect, type FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import {
  honeyImage,
  honeyTextureImage,
  otherFarmProducts,
  whatsappLink,
} from '../../data/siteData';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { useCart } from '../../context/CartContext';
import SectionLabel from '../SectionLabel';

export const HoneyParallax: FC = () => {
  const reduced = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();

  const honey500g = otherFarmProducts.find((p) => p.id === 'farm-honey-500g');
  const honey1kg = otherFarmProducts.find((p) => p.id === 'farm-honey-1kg');

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
              sectionRef.current.style.setProperty('--honey-parallax', `${offset}px`);
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
    const message = `Hello, I am interested in pure raw farm honey from TS Mango Farming. Please share availability and current batch details.`;
    window.open(whatsappLink(message), '_blank', 'noopener,noreferrer');
  };

  return (
    <Box
      id="honey"
      ref={sectionRef}
      sx={{
        position: 'relative',
        bgcolor: '#FAF5EA',
        py: { xs: 10, md: 16 },
        px: { xs: 3, md: 6, lg: 8 },
        overflow: 'hidden',
      }}
    >
      {/* Background ambient warm textures & parallax glow */}
      <Box
        sx={{
          position: 'absolute',
          top: '-15%',
          right: '-5%',
          width: { xs: '80%', md: '50%' },
          height: '130%',
          opacity: 0.12,
          backgroundImage: `url(${honeyTextureImage})`,
          backgroundSize: 'cover',
          transform: reduced ? 'none' : 'translate3d(0, calc(var(--honey-parallax, 0px) * -0.6), 0)',
          willChange: 'transform',
          pointerEvents: 'none',
          borderRadius: '50%',
          filter: 'blur(30px)',
        }}
      />

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
        {/* Left Side: Parallax Image Showcase */}
        <Box
          sx={{
            position: 'relative',
            order: { xs: 2, md: 1 },
          }}
        >
          <Box
            sx={{
              position: 'relative',
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: '0 25px 50px rgba(180, 83, 9, 0.18)',
              aspectRatio: '4/5',
              transform: reduced ? 'none' : 'translate3d(0, calc(var(--honey-parallax, 0px) * 0.25), 0)',
              willChange: 'transform',
              border: '2px solid rgba(217, 148, 25, 0.25)',
            }}
          >
            <Box
              component="img"
              src={honeyImage}
              alt="TS Farm Raw Wild Blossom Honey"
              loading="lazy"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'brightness(0.96) contrast(1.05)',
              }}
            />

            {/* Gradient overlay for text contrast */}
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(23,59,40,0.1) 0%, rgba(23,59,40,0.5) 100%)',
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
                border: '1px solid rgba(217, 148, 25, 0.3)',
              }}
            >
              <Typography sx={{ fontWeight: 700, color: '#173B28', fontSize: '1rem', mb: 0.5 }}>
                Apiary from Our Mango Orchards
              </Typography>
              <Typography sx={{ fontSize: '0.82rem', color: '#5B3A24', lineHeight: 1.5 }}>
                Harvested without boiling or micro-filtering to retain precious bee pollen, propolis, and living enzymes.
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Right Side: Editorial Storytelling & Cart Selection */}
        <Box sx={{ order: { xs: 1, md: 2 } }}>
          <SectionLabel>100% Single-Origin Farm Apiary</SectionLabel>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2.4rem', md: '3.4rem' },
                color: '#173B28',
                lineHeight: 1.15,
              }}
            >
              Pure Blossom Honey
            </Typography>
          </Box>

          <Typography
            sx={{
              color: '#B45309',
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: '1.4rem',
              fontStyle: 'italic',
              fontWeight: 600,
              mb: 2.5,
            }}
          >
            இயற்கை காட்டுத் தேன் · Raw, Unpasteurized & Liquid Gold
          </Typography>

          <Typography
            sx={{
              color: '#5B3A24',
              fontSize: '1.05rem',
              lineHeight: 1.8,
              mb: 4,
            }}
          >
            Our beehives thrive right amidst blooming mango trees, drumstick flowers, and wild herbs on the farm. 
            Because we never heat or adulterate our honey with high-fructose corn syrups, you experience the genuine thick, floral bouquet of Tamil Nadu flora in every spoonful.
          </Typography>

          {/* Quality Badges */}
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 4 }}>
            <Chip
              icon={<VerifiedOutlinedIcon style={{ color: '#B45309' }} />}
              label="No Artificial Sugar Feeds"
              sx={{ bgcolor: '#FEF3C7', color: '#92400E', fontWeight: 600 }}
            />
            <Chip
              icon={<VerifiedOutlinedIcon style={{ color: '#B45309' }} />}
              label="Cold-Extracted & Raw"
              sx={{ bgcolor: '#FEF3C7', color: '#92400E', fontWeight: 600 }}
            />
            <Chip
              icon={<VerifiedOutlinedIcon style={{ color: '#B45309' }} />}
              label="Rich in Active Pollen"
              sx={{ bgcolor: '#FEF3C7', color: '#92400E', fontWeight: 600 }}
            />
          </Box>

          {/* Product Purchase Cards */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mb: 4 }}>
            {honey500g && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 2.5,
                  borderRadius: 2,
                  bgcolor: '#FFFDF8',
                  border: '1px solid rgba(217, 148, 25, 0.3)',
                  boxShadow: '0 4px 14px rgba(217, 148, 25, 0.08)',
                }}
              >
                <Box>
                  <Typography sx={{ fontWeight: 700, color: '#173B28', fontSize: '1.05rem' }}>
                    {honey500g.name}
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', color: '#788267' }}>
                    {honey500g.unit} · Freshly sealed glass jar
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography sx={{ fontWeight: 800, color: '#173B28', fontSize: '1.25rem' }}>
                    ₹{honey500g.price}
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    startIcon={<ShoppingBagOutlinedIcon />}
                    onClick={() =>
                      addItem(
                        {
                          id: honey500g.id,
                          name: honey500g.name,
                          tamilName: honey500g.tamilName,
                          category: 'honey',
                          price: honey500g.price,
                          unit: honey500g.unit,
                          image: honey500g.image,
                        },
                        1,
                      )
                    }
                    sx={{ py: 0.9, px: 2, borderRadius: 1 }}
                  >
                    Add to Cart
                  </Button>
                </Box>
              </Box>
            )}

            {honey1kg && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 2.5,
                  borderRadius: 2,
                  bgcolor: '#FFFDF8',
                  border: '1px solid rgba(217, 148, 25, 0.4)',
                  boxShadow: '0 6px 18px rgba(217, 148, 25, 0.12)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bgcolor: '#D99419',
                    color: '#FFFDF8',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    letterSpacing: '0.1em',
                    px: 1.5,
                    py: 0.3,
                    borderBottomLeftRadius: 6,
                  }}
                >
                  FAMILY PACK VALUE
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 700, color: '#173B28', fontSize: '1.05rem' }}>
                    {honey1kg.name}
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', color: '#788267' }}>
                    {honey1kg.unit} · Best savings for regular consumers
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography sx={{ fontWeight: 800, color: '#173B28', fontSize: '1.25rem' }}>
                    ₹{honey1kg.price}
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    startIcon={<ShoppingBagOutlinedIcon />}
                    onClick={() =>
                      addItem(
                        {
                          id: honey1kg.id,
                          name: honey1kg.name,
                          tamilName: honey1kg.tamilName,
                          category: 'honey',
                          price: honey1kg.price,
                          unit: honey1kg.unit,
                          image: honey1kg.image,
                        },
                        1,
                      )
                    }
                    sx={{ py: 0.9, px: 2, borderRadius: 1 }}
                  >
                    Add to Cart
                  </Button>
                </Box>
              </Box>
            )}
          </Box>

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
            Enquire via WhatsApp
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default HoneyParallax;
