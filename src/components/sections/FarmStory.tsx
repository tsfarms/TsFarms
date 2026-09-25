import { type FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { farmStoryImage } from '../../data/siteData';
import { useReveal } from '../../hooks/useReveal';

interface FarmStoryProps {
  onNavigate?: (target: string) => void;
}

const FarmStory: FC<FarmStoryProps> = ({ onNavigate }) => {
  const [ref, visible] = useReveal<HTMLDivElement>({ threshold: 0.2 });

  return (
    <Box
      ref={ref}
      sx={{
        position: 'relative',
        height: { xs: '60vh', md: '75vh' },
        overflow: 'hidden',
      }}
    >
      <Box
        component="img"
        src={farmStoryImage}
        alt="Where every mango begins — our family farm in Tamil Nadu"
        loading="lazy"
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: visible ? 'scale(1)' : 'scale(1.08)',
          transition: 'transform 2000ms ease-out',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(23,59,40,0.35) 0%, rgba(23,59,40,0.7) 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          px: 3,
        }}
      >
        <Typography
          variant="h2"
          sx={{
            color: '#FFFDF8',
            mb: 2.5,
            fontSize: { xs: '2.2rem', md: '3.5rem' },
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 800ms ease, transform 800ms ease',
          }}
        >
          Rooted in Tamil Soil.
        </Typography>
        <Typography
          sx={{
            color: 'rgba(255,253,248,0.9)',
            fontSize: { xs: '1rem', md: '1.15rem' },
            maxWidth: 560,
            lineHeight: 1.8,
            mb: 4,
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 800ms ease 200ms, transform 800ms ease 200ms',
            fontFamily: '"Manrope", sans-serif',
          }}
        >
          Every mango, jar of raw honey, and sweet jackfruit bulb that arrives at your doorstep begins right here — nurtured by natural farming methods and decades of farming devotion.
        </Typography>
        <Button
          variant="outlined"
          onClick={() => onNavigate?.('farm')}
          sx={{
            color: '#FFFDF8',
            borderColor: 'rgba(255,253,248,0.7)',
            borderRadius: 25,
            px: 4,
            py: 1.4,
            fontSize: '0.85rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            '&:hover': {
              borderColor: '#FFFDF8',
              bgcolor: 'rgba(255,253,248,0.1)',
            },
          }}
        >
          Discover Our Orchard Heritage
        </Button>
      </Box>
    </Box>
  );
};

export default FarmStory;
