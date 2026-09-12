import { useEffect, useRef, useState, type FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  mangoVarieties,
  productImages,
  honeyImage,
  jackfruitImage,
  whatsappLink,
  type MangoVariety,
} from '../../data/siteData';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

/* ---------- types ---------- */

interface ProductWorldProps {
  onNavigate: (target: string) => void;
}

type ProductId = 'mango' | 'honey' | 'jackfruit';

interface ProductScene {
  id: ProductId;
  label: string;
  heading: string;
  body: string;
  image: string;
  bg: string;
  accent: string;
  cta: string;
  message: string;
  navTarget: string | null;
}

/* ---------- data ---------- */

const scenes: ProductScene[] = [
  {
    id: 'mango',
    label: 'Mango',
    heading: 'Seven varieties.\nOne farm.',
    body: 'From the rich Alphonsa to the rare Grapes Mango — each variety has its own character, season and story. Grown with care on our farm in Tamil Nadu.',
    image: productImages.mangoes,
    bg: '#173B28',
    accent: '#D99419',
    cta: 'Explore Mangoes',
    message: "Hello, I am interested in fresh mangoes from TS Mango Farming. Please share today's price. Minimum order 5–6 KG.",
    navTarget: 'mangoes',
  },
  {
    id: 'honey',
    label: 'Honey',
    heading: 'Pure sweetness,\nfrom the farm.',
    body: 'Natural farm honey, harvested with care. Available in limited quantities — ask us about available sizes and prices.',
    image: honeyImage,
    bg: '#3d2e10',
    accent: '#e5ab3d',
    cta: 'Enquire About Honey',
    message: 'Hello, I am interested in your farm honey from TS Mango Farming. Please share available sizes and prices.',
    navTarget: null,
  },
  {
    id: 'jackfruit',
    label: 'Jackfruit',
    heading: 'Seasonal\nby nature.',
    body: 'Fresh jackfruit available during the season. Ask us about current availability and pricing.',
    image: jackfruitImage,
    bg: '#2a3818',
    accent: '#b8c84a',
    cta: 'Ask About Availability',
    message: "Hello, I am interested in fresh jackfruit from TS Mango Farming. Please share today's availability and price.",
    navTarget: null,
  },
];

/* ---------- helpers ---------- */

/** Returns 0..1 local progress for scene `i` within the global 0..1 `progress`. */
function localProgress(progress: number, i: number, count: number): number {
  const seg = 1 / count;
  const start = i * seg;
  return Math.max(0, Math.min(1, (progress - start) / seg));
}

/** Eased visibility for a scene: ramps in during first 35%, holds, ramps out during last 35%. */
function sceneVisibility(p: number): number {
  const fadeIn = Math.min(1, p / 0.35);
  const fadeOut = Math.min(1, (1 - p) / 0.35);
  return Math.min(fadeIn, fadeOut);
}

/* ---------- component ---------- */

const ProductWorld: FC<ProductWorldProps> = ({ onNavigate }) => {
  const reduced = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [activeScene, setActiveScene] = useState(0);
  const [activeVariety, setActiveVariety] = useState(0);
  const rafRef = useRef<number>(0);
  const lastThresholdRef = useRef(-1);

  // --- scroll-driven progress (rAF-throttled, no per-frame React renders) ---
  useEffect(() => {
    if (reduced) {
      setProgress(1);
      setActiveScene(scenes.length - 1);
      return;
    }

    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      rafRef.current = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height - vh;
      if (total <= 0) return;
      const scrolled = Math.max(0, -rect.top);
      const p = Math.min(1, Math.max(0, scrolled / total));

      // Write CSS variables directly on the element — no React render.
      el.style.setProperty('--scroll-p', p.toFixed(4));

      // Only setState when the active scene changes (every ~33% of scroll)
      const sceneIdx = Math.min(scenes.length - 1, Math.floor(p * scenes.length * 0.999));
      if (sceneIdx !== lastThresholdRef.current) {
        lastThresholdRef.current = sceneIdx;
        setActiveScene(sceneIdx);
        setProgress(p);
      }
    };

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reduced]);

  // --- auto-advance variety indicator based on mango-scene progress ---
  useEffect(() => {
    if (activeScene !== 0) return;
    const seg = 1 / scenes.length;
    const mangoStart = 0;
    const mangoEnd = seg;
    const localP = Math.max(0, Math.min(1, (progress - mangoStart) / (mangoEnd - mangoStart)));
    const vIdx = Math.min(mangoVarieties.length - 1, Math.floor(localP * mangoVarieties.length * 0.999));
    setActiveVariety(vIdx);
  }, [progress, activeScene]);

  const handleAskPrice = (name: string) => {
    window.open(
      whatsappLink(`Hello, I am interested in ${name} mangoes from TS Mango Farming. Please share today's price. Minimum order 5–6 KG.`),
      '_blank',
      'noopener,noreferrer',
    );
  };

  const sceneCount = scenes.length;
  const tallHeight = reduced ? 'auto' : `${sceneCount * 120}vh`;

  return (
    <Box
      ref={containerRef}
      id="products"
      sx={{
        position: 'relative',
        height: tallHeight,
        bgcolor: '#0e2a1c',
      }}
    >
      {/* Sticky stage */}
      <Box
        sx={{
          position: reduced ? 'relative' : 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        {scenes.map((scene, i) => {
          const lp = localProgress(progress, i, sceneCount);
          const vis = reduced ? 1 : sceneVisibility(lp);
          const isActive = i === activeScene;

          // Parallax offsets (driven by progress, applied as inline styles)
          const bgOffset = reduced ? 0 : lp * 30; // background drifts down as scene progresses
          const imgOffset = reduced ? 0 : (lp - 0.5) * 60; // product image shifts horizontally
          const textOffset = reduced ? 0 : (1 - vis) * 40; // text slides up from below

          return (
            <Box
              key={scene.id}
              data-scene={scene.id}
              sx={{
                position: 'absolute',
                inset: 0,
                opacity: reduced ? (i === 0 ? 1 : 0) : vis,
                transform: reduced ? 'none' : `translateZ(0)`,
                transition: 'opacity 300ms ease',
                display: 'flex',
                alignItems: 'center',
                bgcolor: scene.bg,
                overflow: 'hidden',
                pointerEvents: isActive ? 'auto' : 'none',
              }}
            >
              {/* === Background texture layer (slowest parallax) === */}
              <Box
                sx={{
                  position: 'absolute',
                  inset: '-10%',
                  opacity: 0.15,
                  transform: reduced ? 'none' : `translate3d(0, ${bgOffset}px, 0)`,
                  willChange: 'transform',
                  background: `radial-gradient(ellipse at 50% 40%, ${scene.accent}22 0%, transparent 60%)`,
                }}
              />

              {/* === Large product image (medium parallax) === */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: { xs: '-20%', md: '-5%' },
                  width: { xs: '80%', md: '55%' },
                  height: '100%',
                  transform: reduced
                    ? 'none'
                    : `translate3d(${imgOffset}%, 0, 0) scale(1.05)`,
                  willChange: 'transform',
                  transition: 'transform 200ms ease-out',
                }}
              >
                <Box
                  component="img"
                  src={scene.image}
                  alt={scene.label}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'brightness(0.7) saturate(1.1)',
                  }}
                />
                {/* Gradient wash for text legibility */}
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    background: `linear-gradient(90deg, ${scene.bg} 0%, ${scene.bg}dd 40%, transparent 100%)`,
                  }}
                />
              </Box>

              {/* === Text content (stable, slight vertical parallax) === */}
              <Box
                sx={{
                  position: 'relative',
                  zIndex: 10,
                  maxWidth: 1400,
                  mx: 'auto',
                  width: '100%',
                  px: { xs: 3, md: 6, lg: 8 },
                  transform: reduced ? 'none' : `translate3d(0, ${textOffset}px, 0)`,
                  willChange: 'transform',
                }}
              >
                <Typography
                  variant="overline"
                  sx={{
                    color: scene.accent,
                    fontSize: { xs: '0.7rem', md: '0.8rem' },
                    letterSpacing: '0.25em',
                    display: 'block',
                    mb: 2,
                    opacity: reduced ? 1 : vis,
                  }}
                >
                  {scene.label}
                </Typography>
                <Typography
                  variant="h1"
                  sx={{
                    color: '#FFFDF8',
                    fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                    maxWidth: { xs: '100%', md: '60%' },
                    lineHeight: 1.05,
                    mb: 3,
                    whiteSpace: 'pre-line',
                    opacity: reduced ? 1 : vis,
                  }}
                >
                  {scene.heading}
                </Typography>
                <Typography
                  sx={{
                    color: 'rgba(255,253,248,0.8)',
                    fontSize: { xs: '0.95rem', md: '1.1rem' },
                    maxWidth: { xs: '100%', md: '45%' },
                    lineHeight: 1.7,
                    mb: 4,
                    fontFamily: '"Manrope", sans-serif',
                    opacity: reduced ? 1 : vis,
                  }}
                >
                  {scene.body}
                </Typography>

                {/* Mango varieties strip — only for mango scene */}
                {scene.id === 'mango' && (
                  <Box
                    sx={{
                      display: 'flex',
                      gap: { xs: 1.5, md: 3 },
                      alignItems: 'center',
                      mb: 3,
                      maxWidth: { md: '70%' },
                      overflow: 'hidden',
                      opacity: reduced ? 1 : vis,
                    }}
                  >
                    {mangoVarieties.map((v, vi) => {
                      const isCurrent = vi === activeVariety;
                      return (
                        <Box
                          key={v.id}
                          onClick={() => handleAskPrice(v.name)}
                          sx={{
                            cursor: 'pointer',
                            flex: '0 0 auto',
                            opacity: isCurrent ? 1 : 0.4,
                            transform: isCurrent ? 'scale(1)' : 'scale(0.92)',
                            transition: 'opacity 300ms ease, transform 300ms ease',
                            '&:hover': { opacity: 1 },
                          }}
                        >
                          <Box
                            component="img"
                            src={v.image}
                            alt={v.name}
                            loading="lazy"
                            sx={{
                              width: { xs: 48, md: 64 },
                              height: { xs: 48, md: 64 },
                              borderRadius: '50%',
                              objectFit: 'cover',
                              border: isCurrent ? `2px solid ${scene.accent}` : '2px solid transparent',
                              transition: 'border-color 300ms ease',
                            }}
                          />
                          <Typography
                            sx={{
                              fontSize: '0.65rem',
                              color: isCurrent ? '#FFFDF8' : 'rgba(255,253,248,0.5)',
                              textAlign: 'center',
                              mt: 0.5,
                              fontWeight: isCurrent ? 600 : 400,
                              transition: 'color 300ms ease',
                              fontFamily: '"Manrope", sans-serif',
                            }}
                          >
                            {v.name}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                )}

                {/* Price + CTA */}
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                  <Button
                    variant="contained"
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => {
                      if (scene.navTarget) {
                        onNavigate(scene.navTarget);
                      } else {
                        window.open(whatsappLink(scene.message), '_blank', 'noopener,noreferrer');
                      }
                    }}
                    sx={{
                      bgcolor: scene.accent,
                      color: '#1C211C',
                      px: 4,
                      py: 1.5,
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      '&:hover': { bgcolor: scene.accent, opacity: 0.9 },
                    }}
                  >
                    {scene.cta}
                  </Button>
                  <Typography
                    sx={{
                      color: 'rgba(255,253,248,0.5)',
                      fontSize: '0.8rem',
                      fontFamily: '"Manrope", sans-serif',
                    }}
                  >
                    {scene.id === 'mango' ? 'Price on enquiry · Min 5 KG' : 'Price on enquiry'}
                  </Typography>
                </Box>
              </Box>

              {/* === Scene progress indicator (right edge) === */}
              <Box
                sx={{
                  position: 'absolute',
                  right: { xs: 2, md: 4 },
                  top: '50%',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.5,
                  zIndex: 20,
                  opacity: reduced ? 0 : vis * 0.6,
                }}
              >
                {scenes.map((s, si) => (
                  <Box
                    key={s.id}
                    sx={{
                      width: si === i ? 3 : 3,
                      height: si === i ? 24 : 8,
                      bgcolor: si === i ? scene.accent : 'rgba(255,253,248,0.2)',
                      borderRadius: 2,
                      transition: 'height 300ms ease, background-color 300ms ease',
                    }}
                  />
                ))}
              </Box>
            </Box>
          );
        })}

        {/* === Mango variety detail overlay === */}
        {activeScene === 0 && !reduced && (
          <VarietyDetail
            variety={mangoVarieties[activeVariety]}
            onAskPrice={handleAskPrice}
            onNavigate={onNavigate}
          />
        )}
      </Box>
    </Box>
  );
};

/* ---------- Variety detail panel (appears within mango scene) ---------- */

const VarietyDetail: FC<{
  variety: MangoVariety;
  onAskPrice: (name: string) => void;
  onNavigate: (target: string) => void;
}> = ({ variety, onAskPrice }) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: { xs: 20, md: 40 },
        left: { xs: 3, md: 6, lg: 8 },
        maxWidth: { xs: 'calc(100% - 24px)', md: 400 },
        bgcolor: 'rgba(14,42,28,0.85)',
        backdropFilter: 'blur(8px)',
        borderRadius: 2,
        p: { xs: 2, md: 3 },
        zIndex: 15,
        transition: 'opacity 400ms ease',
      }}
    >
      <Typography
        sx={{
          color: '#D99419',
          fontSize: '0.7rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          mb: 1,
          fontFamily: '"Manrope", sans-serif',
          fontWeight: 600,
        }}
      >
        {variety.season}
      </Typography>
      <Typography
        variant="h5"
        sx={{ color: '#FFFDF8', mb: 0.5, fontSize: { xs: '1.3rem', md: '1.6rem' } }}
      >
        {variety.name}
      </Typography>
      <Typography
        sx={{
          color: 'rgba(255,253,248,0.6)',
          fontSize: '0.8rem',
          mb: 2,
          fontFamily: '"Manrope", sans-serif',
        }}
      >
        {variety.tagline}
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <Button
          size="small"
          variant="outlined"
          endIcon={<ArrowForwardIcon />}
          onClick={() => onAskPrice(variety.name)}
          sx={{
            color: '#FFFDF8',
            borderColor: 'rgba(255,253,248,0.4)',
            borderWidth: '1px',
            fontSize: '0.75rem',
            px: 2,
            py: 0.8,
            '&:hover': { borderColor: '#FFFDF8', borderWidth: '1px', bgcolor: 'transparent' },
          }}
        >
          Ask Price
        </Button>
        <Typography sx={{ color: 'rgba(255,253,248,0.4)', fontSize: '0.75rem' }}>
          {variety.unit} · Min 5 KG
        </Typography>
      </Box>
    </Box>
  );
};

export default ProductWorld;
