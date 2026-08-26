import { useEffect, useRef, useState, type FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { heroImage, whatsappLink } from '../../data/siteData';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface HeroProps {
  onNavigate: (target: string) => void;
}

interface LeafParticle {
  id: number;
  left: string;
  top: string;
  size: number;
  duration: string;
  delay: string;
  opacity: number;
  parallaxSpeed: number;
  swayAmount: number;
}

const Hero: FC<HeroProps> = ({ onNavigate }) => {
  const reduced = usePrefersReducedMotion();
  const [scrollY, setScrollY] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (reduced) return;
    const handleScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => setScrollY(window.scrollY));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [reduced]);

  const getOffset = (speed: number) => (reduced ? 0 : scrollY * speed);

  const leaves: LeafParticle[] = [
    { id: 1, left: '8%', top: '15%', size: 28, duration: '7s', delay: '0s', opacity: 0.35, parallaxSpeed: 0.5, swayAmount: 6 },
    { id: 2, left: '62%', top: '22%', size: 22, duration: '9s', delay: '1.5s', opacity: 0.3, parallaxSpeed: 0.6, swayAmount: 8 },
    { id: 3, left: '85%', top: '45%', size: 18, duration: '8s', delay: '0.8s', opacity: 0.25, parallaxSpeed: 0.7, swayAmount: 5 },
    { id: 4, left: '20%', top: '60%', size: 24, duration: '10s', delay: '2s', opacity: 0.3, parallaxSpeed: 0.55, swayAmount: 7 },
    { id: 5, left: '72%', top: '68%', size: 20, duration: '7.5s', delay: '0.3s', opacity: 0.28, parallaxSpeed: 0.65, swayAmount: 9 },
    { id: 6, left: '45%', top: '35%', size: 16, duration: '11s', delay: '3s', opacity: 0.2, parallaxSpeed: 0.75, swayAmount: 4 },
    { id: 7, left: '92%', top: '75%', size: 26, duration: '8.5s', delay: '1.2s', opacity: 0.3, parallaxSpeed: 0.6, swayAmount: 6 },
    { id: 8, left: '5%', top: '80%', size: 18, duration: '9.5s', delay: '2.5s', opacity: 0.25, parallaxSpeed: 0.7, swayAmount: 8 },
  ];

  return (
    <Box
      id="hero"
      sx={{
        position: 'relative',
        height: '100vh',
        minHeight: { xs: 600, md: 700 },
        overflow: 'hidden',
        bgcolor: '#173B28',
      }}
    >
      {/* === LAYER 1: Background orchard (slowest parallax) === */}
      <Box
        component="img"
        src={heroImage}
        alt="Mango orchard at golden hour"
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '130%',
          objectFit: 'cover',
          transform: `translateY(${getOffset(0.12)}px) scale(1.08)`,
          filter: 'brightness(0.82) saturate(1.1)',
          willChange: 'transform',
        }}
      />

      {/* === LAYER 2: Atmospheric gradient wash === */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(23,59,40,0.2) 0%, rgba(23,59,40,0.05) 35%, rgba(23,59,40,0.4) 70%, rgba(23,59,40,0.65) 100%)',
          transform: `translateY(${getOffset(0.08)}px)`,
        }}
      />

      {/* === LAYER 3: Left-side branch silhouette === */}
      <Box
        component="svg"
        sx={{
          position: 'absolute',
          top: 0,
          left: { xs: '-15%', md: '-8%' },
          width: { xs: '55%', md: '40%' },
          height: '80%',
          opacity: 0.2,
          transform: `translateY(${getOffset(0.22)}px)`,
          pointerEvents: 'none',
        }}
        viewBox="0 0 300 500"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <path d="M10 50 C40 80 60 130 70 200 C80 270 75 340 60 420 C55 450 50 470 45 490" stroke="#173B28" strokeWidth="3" fill="none" />
        <path d="M70 200 C50 190 30 185 10 180 M70 280 C90 270 110 265 130 260 M60 420 C40 410 20 405 5 400" stroke="#173B28" strokeWidth="2" fill="none" />
        <ellipse cx="10" cy="178" rx="16" ry="6" fill="#173B28" opacity="0.5" transform="rotate(-40 10 178)" />
        <ellipse cx="130" cy="258" rx="18" ry="7" fill="#173B28" opacity="0.5" transform="rotate(20 130 258)" />
        <ellipse cx="5" cy="398" rx="14" ry="5" fill="#173B28" opacity="0.4" transform="rotate(-50 5 398)" />
      </Box>

      {/* === LAYER 4: Right-side branch silhouette === */}
      <Box
        component="svg"
        sx={{
          position: 'absolute',
          top: 0,
          right: { xs: '-15%', md: '-8%' },
          width: { xs: '55%', md: '40%' },
          height: '80%',
          opacity: 0.2,
          transform: `translateY(${getOffset(0.28)}px)`,
          pointerEvents: 'none',
        }}
        viewBox="0 0 300 500"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <path d="M290 40 C260 70 240 120 230 200 C220 280 225 360 240 440 C245 460 250 480 255 495" stroke="#173B28" strokeWidth="3" fill="none" />
        <path d="M230 200 C250 190 270 185 290 180 M225 300 C205 290 185 285 165 280 M240 440 C260 430 280 425 295 420" stroke="#173B28" strokeWidth="2" fill="none" />
        <ellipse cx="290" cy="178" rx="16" ry="6" fill="#173B28" opacity="0.5" transform="rotate(40 290 178)" />
        <ellipse cx="165" cy="278" rx="18" ry="7" fill="#173B28" opacity="0.5" transform="rotate(-20 165 278)" />
        <ellipse cx="295" cy="418" rx="14" ry="5" fill="#173B28" opacity="0.4" transform="rotate(50 295 418)" />
      </Box>

      {/* === LAYER 5: Foreground leaf silhouettes (bottom) === */}
      <Box
        component="svg"
        sx={{
          position: 'absolute',
          bottom: -20,
          left: 0,
          width: '100%',
          height: '35%',
          opacity: 0.3,
          transform: `translateY(${getOffset(0.38)}px)`,
          pointerEvents: 'none',
        }}
        viewBox="0 0 1200 200"
        fill="none"
        preserveAspectRatio="xMidYMax slice"
      >
        <path d="M0 200 L0 140 C80 120 150 100 200 80 C260 55 320 40 400 30 C500 18 600 12 700 10 C800 8 900 12 1000 20 C1080 27 1140 35 1200 40 L1200 200 Z" fill="#173B28" opacity="0.4" />
        <path d="M0 200 L0 160 C100 145 200 130 300 120 C400 110 500 105 600 103 C700 101 800 105 900 110 C1000 115 1100 122 1200 128 L1200 200 Z" fill="#173B28" opacity="0.3" />
      </Box>

      {/* === LAYER 6: Rustling leaf particles (fastest parallax) === */}
      {!reduced &&
        leaves.map((leaf) => (
          <Box
            key={leaf.id}
            sx={{
              position: 'absolute',
              left: leaf.left,
              top: leaf.top,
              width: leaf.size,
              height: leaf.size,
              opacity: leaf.opacity,
              transform: `translateY(${getOffset(leaf.parallaxSpeed)}px)`,
              willChange: 'transform',
              pointerEvents: 'none',
            }}
          >
            <Box
              component="svg"
              sx={{
                width: '100%',
                height: '100%',
                animation: `leafRustle-${leaf.id} ${leaf.duration} ease-in-out infinite`,
                animationDelay: leaf.delay,
              }}
              viewBox="0 0 32 32"
              fill="none"
            >
              <path
                d="M16 2 C10 6 6 14 4 24 C3 28 6 30 12 30 C10 22 12 14 18 8 C22 4 26 3 28 2 C22 0 18 0 16 2Z"
                fill="#788267"
              />
              <path d="M14 28 C14 20 16 12 22 6" stroke="#5B3A24" strokeWidth="0.5" opacity="0.3" fill="none" />
            </Box>
            <style>{`
              @keyframes leafRustle-${leaf.id} {
                0%, 100% { transform: rotate(${leaf.swayAmount * -1}deg) translateY(0px); }
                25% { transform: rotate(${leaf.swayAmount}deg) translateY(-${leaf.swayAmount * 0.5}px); }
                50% { transform: rotate(${leaf.swayAmount * 0.5}deg) translateY(-${leaf.swayAmount}px); }
                75% { transform: rotate(${leaf.swayAmount * -0.5}deg) translateY(-${leaf.swayAmount * 0.3}px); }
              }
            `}</style>
          </Box>
        ))}

      {/* === LAYER 7: Golden light particles === */}
      {!reduced && (
        <>
          <Box
            sx={{
              position: 'absolute',
              top: '30%',
              left: '50%',
              width: 3,
              height: 3,
              borderRadius: '50%',
              bgcolor: '#D99419',
              opacity: 0.4,
              transform: `translateY(${getOffset(0.45)}px)`,
              animation: 'lightDrift 12s ease-in-out infinite',
              pointerEvents: 'none',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '30%',
              width: 2,
              height: 2,
              borderRadius: '50%',
              bgcolor: '#D99419',
              opacity: 0.3,
              transform: `translateY(${getOffset(0.55)}px)`,
              animation: 'lightDrift 14s ease-in-out infinite',
              animationDelay: '3s',
              pointerEvents: 'none',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: '65%',
              left: '70%',
              width: 4,
              height: 4,
              borderRadius: '50%',
              bgcolor: '#D99419',
              opacity: 0.25,
              transform: `translateY(${getOffset(0.5)}px)`,
              animation: 'lightDrift 16s ease-in-out infinite',
              animationDelay: '6s',
              pointerEvents: 'none',
            }}
          />
        </>
      )}

      {/* === CONTENT === */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 10,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          maxWidth: 1400,
          mx: 'auto',
          px: { xs: 3, md: 6, lg: 8 },
          transform: `translateY(${getOffset(0.06)}px)`,
        }}
      >
        <Typography
          variant="overline"
          sx={{
            color: '#FFFDF8',
            opacity: 0.8,
            fontSize: { xs: '0.7rem', md: '0.8rem' },
            letterSpacing: '0.25em',
            mb: 3,
          }}
        >
          From Our Farm
        </Typography>
        <Typography
          variant="h1"
          sx={{
            color: '#FFFDF8',
            fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem', lg: '5rem' },
            maxWidth: { xs: '100%', md: '70%', lg: '60%' },
            lineHeight: 1.05,
            mb: 3,
          }}
        >
          Grown with care.<br />Made for the table.
        </Typography>
        <Typography
          sx={{
            color: '#FFFDF8',
            opacity: 0.85,
            fontSize: { xs: '0.95rem', md: '1.1rem' },
            maxWidth: { xs: '100%', md: '50%', lg: '42%' },
            lineHeight: 1.7,
            mb: 4,
            fontFamily: '"Manrope", sans-serif',
          }}
        >
          Fresh mangoes, farm honey and seasonal jackfruit, grown with care and shared from our farm in Tamil Nadu.
        </Typography>
        <Typography
          sx={{
            color: '#FFFDF8',
            opacity: 0.6,
            fontSize: '0.85rem',
            fontStyle: 'italic',
            fontFamily: '"Cormorant Garamond", serif',
            mb: 4,
          }}
        >
          — Thangapandi, TS Mango Farming
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            onClick={() => onNavigate('farm')}
            sx={{
              bgcolor: '#FFFDF8',
              color: '#173B28',
              px: 4,
              py: 1.5,
              borderRadius: 1,
              fontSize: '0.8rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              '&:hover': { bgcolor: '#F6F1E7' },
            }}
          >
            Explore the Farm
          </Button>
          <Button
            variant="outlined"
            href={whatsappLink('Hello, I would like to enquire about your products from TS Mango Farming.')}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: '#FFFDF8',
              borderColor: 'rgba(255,253,248,0.5)',
              px: 4,
              py: 1.5,
              borderRadius: 1,
              fontSize: '0.8rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              '&:hover': {
                borderColor: '#FFFDF8',
                bgcolor: 'transparent',
              },
            }}
          >
            Enquire Now
          </Button>
        </Box>
      </Box>

      {/* Scroll indicator */}
      <Box
        sx={{
          position: 'absolute',
          bottom: { xs: 20, md: 30 },
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Typography
          sx={{
            color: '#FFFDF8',
            opacity: 0.5,
            fontSize: '0.7rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            fontFamily: '"Manrope", sans-serif',
          }}
        >
          Scroll
        </Typography>
        <Box
          sx={{
            width: '1px',
            height: 40,
            bgcolor: '#FFFDF8',
            opacity: 0.3,
            animation: reduced ? 'none' : 'scrollLine 2s ease-in-out infinite',
          }}
        />
      </Box>

      <style>{`
        @keyframes scrollLine {
          0% { transform: scaleY(0); transform-origin: top; }
          50% { transform: scaleY(1); transform-origin: top; }
          51% { transform: scaleY(1); transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }
        @keyframes lightDrift {
          0%, 100% { transform: translate(0, 0); opacity: 0.2; }
          50% { transform: translate(20px, -15px); opacity: 0.5; }
        }
      `}</style>
    </Box>
  );
};

export default Hero;
