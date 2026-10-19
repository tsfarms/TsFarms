import { useState, useRef, useEffect, useMemo, type FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import SectionLabel from '@/components/layout/SectionLabel';
import { farmMediaItems, type FarmMediaItem } from '@/content/farmMedia';
import { useReveal } from '@/hooks/useReveal';

const INITIAL_VISIBLE_COUNT = 15; // 3 full blocks of 5

const Gallery: FC = () => {
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_VISIBLE_COUNT);
  const [activeItem, setActiveItem] = useState<FarmMediaItem | null>(null);
  const [isModalMuted, setIsModalMuted] = useState(false);
  const [isModalPlaying, setIsModalPlaying] = useState(true);
  const modalVideoRef = useRef<HTMLVideoElement>(null);

  const displayedItems = useMemo(() => {
    return farmMediaItems.slice(0, visibleCount);
  }, [visibleCount]);

  const hasMore = visibleCount < farmMediaItems.length;

  const handleOpenModal = (item: FarmMediaItem) => {
    setActiveItem(item);
    setIsModalPlaying(true);
    setIsModalMuted(false);
  };

  const handleCloseModal = () => {
    setActiveItem(null);
  };

  const toggleModalPlay = () => {
    const v = modalVideoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
      setIsModalPlaying(true);
    } else {
      v.pause();
      setIsModalPlaying(false);
    }
  };

  const toggleModalMute = () => {
    const v = modalVideoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setIsModalMuted(v.muted);
  };

  const handlePrev = () => {
    if (!activeItem) return;
    const currentIndex = farmMediaItems.findIndex((item) => item.id === activeItem.id);
    const prevIndex = (currentIndex - 1 + farmMediaItems.length) % farmMediaItems.length;
    setActiveItem(farmMediaItems[prevIndex]);
    setIsModalPlaying(true);
  };

  const handleNext = () => {
    if (!activeItem) return;
    const currentIndex = farmMediaItems.findIndex((item) => item.id === activeItem.id);
    const nextIndex = (currentIndex + 1) % farmMediaItems.length;
    setActiveItem(farmMediaItems[nextIndex]);
    setIsModalPlaying(true);
  };

  // Keyboard navigation for modal
  useEffect(() => {
    if (!activeItem) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleCloseModal();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === ' ' && activeItem.type === 'video') {
        e.preventDefault();
        toggleModalPlay();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  return (
    <Box
      id="gallery"
      component="section"
      sx={{
        bgcolor: '#10281b',
        color: '#FFFDF8',
        py: { xs: 8, md: 14 },
        px: { xs: 2, sm: 3, md: 6, lg: 8 },
        scrollMarginTop: { xs: 80, md: 96 },
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        {/* Section Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 7 } }}>
          <SectionLabel color="#D99419" align="center">
            Our Farm in Motion
          </SectionLabel>
          <Typography
            variant="h2"
            sx={{
              color: '#FFFDF8',
              fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.4rem' },
              fontWeight: 500,
              mb: 2,
            }}
          >
            Authentic Farm Moments
          </Typography>
          <Typography
            sx={{
              color: 'rgba(255, 253, 248, 0.75)',
              fontSize: { xs: '0.95rem', md: '1.1rem' },
              maxWidth: 620,
              mx: 'auto',
              lineHeight: 1.7,
            }}
          >
            Real glimpse into our orchards, pure spring water channels, beekeeping frames, and harvesting devotion at Devadanapatti.
          </Typography>
        </Box>

        {/* Clean, Uniform 2-Column Grid matching Wireframe Layout:
            Slot 0: Portrait (col 1)
            Slot 1: Portrait (col 2)
            Slot 2: Landscape / Wide (col 1-2, span 2)
            Slot 3: Portrait (col 1)
            Slot 4: Portrait (col 2)
        */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: { xs: 2, sm: 2.5, md: 3 },
          }}
        >
          {displayedItems.map((item, index) => {
            const isWide = index % 5 === 2;
            return (
              <CollageCard
                key={item.id}
                item={item}
                isWide={isWide}
                onClick={() => handleOpenModal(item)}
              />
            );
          })}
        </Box>

        {/* Load More Button */}
        {hasMore && (
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button
              variant="outlined"
              onClick={() => setVisibleCount((prev) => prev + 10)}
              sx={{
                color: '#FFFDF8',
                borderColor: 'rgba(217, 148, 25, 0.6)',
                borderRadius: '30px',
                px: 5,
                py: 1.4,
                fontSize: '0.9rem',
                fontWeight: 600,
                letterSpacing: '0.04em',
                bgcolor: 'rgba(23, 59, 40, 0.3)',
                backdropFilter: 'blur(8px)',
                '&:hover': {
                  borderColor: '#D99419',
                  bgcolor: 'rgba(217, 148, 25, 0.15)',
                },
              }}
            >
              Explore More Farm Moments ({farmMediaItems.length - visibleCount} more)
            </Button>
          </Box>
        )}
      </Box>

      {/* Lightbox / Media Player Dialog */}
      <Dialog
        open={Boolean(activeItem)}
        onClose={handleCloseModal}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'rgba(10, 24, 16, 0.98)',
            backgroundImage: 'none',
            borderRadius: { xs: '16px', md: '24px' },
            overflow: 'hidden',
            boxShadow: '0 24px 60px rgba(0,0,0,0.8)',
            border: '1px solid rgba(255, 253, 248, 0.12)',
            m: { xs: 1, md: 3 },
            maxHeight: '94vh',
          },
        }}
      >
        {activeItem && (
          <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
            {/* Top Close Button */}
            <Box
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                zIndex: 10,
              }}
            >
              <IconButton
                onClick={handleCloseModal}
                sx={{
                  color: '#FFFDF8',
                  bgcolor: 'rgba(16, 40, 27, 0.7)',
                  backdropFilter: 'blur(8px)',
                  '&:hover': { bgcolor: '#D99419', color: '#173B28' },
                }}
                aria-label="Close dialog"
              >
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Media Content */}
            <Box
              sx={{
                position: 'relative',
                bgcolor: '#040d08',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: { xs: 320, md: 540 },
                maxHeight: { xs: '75vh', md: '82vh' },
                overflow: 'hidden',
              }}
            >
              {activeItem.type === 'video' ? (
                <Box sx={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center' }}>
                  <video
                    ref={modalVideoRef}
                    src={activeItem.src}
                    poster={activeItem.poster}
                    autoPlay
                    playsInline
                    loop
                    muted={isModalMuted}
                    style={{
                      maxHeight: '82vh',
                      maxWidth: '100%',
                      objectFit: 'contain',
                    }}
                  />
                  {/* Floating Play / Mute controls */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 24,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      display: 'flex',
                      gap: 2,
                      bgcolor: 'rgba(16, 40, 27, 0.85)',
                      backdropFilter: 'blur(12px)',
                      p: 1,
                      px: 2,
                      borderRadius: '30px',
                      border: '1px solid rgba(255, 253, 248, 0.15)',
                    }}
                  >
                    <IconButton size="small" onClick={toggleModalPlay} sx={{ color: '#FFFDF8' }}>
                      {isModalPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                    </IconButton>
                    <IconButton size="small" onClick={toggleModalMute} sx={{ color: '#FFFDF8' }}>
                      {isModalMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
                    </IconButton>
                  </Box>
                </Box>
              ) : (
                <img
                  src={activeItem.src}
                  alt={activeItem.title}
                  style={{
                    maxHeight: '82vh',
                    maxWidth: '100%',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                />
              )}

              {/* Prev / Next Nav Buttons */}
              <IconButton
                onClick={handlePrev}
                aria-label="Previous item"
                sx={{
                  position: 'absolute',
                  left: { xs: 8, md: 24 },
                  top: '50%',
                  transform: 'translateY(-50%)',
                  bgcolor: 'rgba(16, 40, 27, 0.7)',
                  color: '#FFFDF8',
                  backdropFilter: 'blur(8px)',
                  '&:hover': { bgcolor: '#D99419', color: '#173B28' },
                  width: { xs: 40, md: 50 },
                  height: { xs: 40, md: 50 },
                }}
              >
                <ArrowBackIosNewIcon sx={{ fontSize: { xs: 18, md: 22 } }} />
              </IconButton>
              <IconButton
                onClick={handleNext}
                aria-label="Next item"
                sx={{
                  position: 'absolute',
                  right: { xs: 8, md: 24 },
                  top: '50%',
                  transform: 'translateY(-50%)',
                  bgcolor: 'rgba(16, 40, 27, 0.7)',
                  color: '#FFFDF8',
                  backdropFilter: 'blur(8px)',
                  '&:hover': { bgcolor: '#D99419', color: '#173B28' },
                  width: { xs: 40, md: 50 },
                  height: { xs: 40, md: 50 },
                }}
              >
                <ArrowForwardIosIcon sx={{ fontSize: { xs: 18, md: 22 } }} />
              </IconButton>
            </Box>
          </Box>
        )}
      </Dialog>
    </Box>
  );
};

interface CollageCardProps {
  item: FarmMediaItem;
  isWide: boolean;
  onClick: () => void;
}

const CollageCard: FC<CollageCardProps> = ({ item, isWide, onClick }) => {
  const [cardRef, visible] = useReveal<HTMLDivElement>({ threshold: 0.1 });
  const videoRef = useRef<HTMLVideoElement>(null);

  // Play video silently when in view
  useEffect(() => {
    if (item.type !== 'video') return;
    const v = videoRef.current;
    if (!v) return;

    if (visible) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [visible, item.type]);

  const handleMouseEnter = () => {
    if (item.type !== 'video') return;
    const v = videoRef.current;
    if (v && v.paused) {
      v.play().catch(() => {});
    }
  };

  return (
    <Box
      ref={cardRef}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      sx={{
        gridColumn: isWide ? '1 / -1' : 'span 1',
        aspectRatio: isWide
          ? { xs: '16 / 9', sm: '16 / 8.5', md: '16 / 8' }
          : { xs: '3 / 4', sm: '4 / 5', md: '3 / 4' },
        borderRadius: { xs: '20px', sm: '24px', md: '28px' }, // Generous rounded corners like wireframe
        overflow: 'hidden',
        position: 'relative',
        cursor: 'pointer',
        bgcolor: '#0a1a11',
        border: '1px solid rgba(255, 253, 248, 0.08)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 700ms cubic-bezier(0.22, 1, 0.36, 1), transform 700ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 300ms ease, border-color 300ms ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 16px 36px rgba(0, 0, 0, 0.55)',
          borderColor: 'rgba(217, 148, 25, 0.4)',
          '& .media-bg': {
            transform: 'scale(1.05)',
          },
        },
      }}
    >
      {/* Clean Media: No overlays, no text, no badges */}
      {item.type === 'video' ? (
        <video
          ref={videoRef}
          src={item.src}
          poster={item.poster}
          muted
          playsInline
          loop
          preload="none"
          className="media-bg"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transition: 'transform 800ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        />
      ) : (
        <img
          src={item.src}
          alt={item.title}
          loading="lazy"
          decoding="async"
          className="media-bg"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transition: 'transform 800ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        />
      )}
    </Box>
  );
};

export default Gallery;
