import { type FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { farmStoryImage } from '../../data/siteData';
import { useReveal } from '../../hooks/useReveal';

const FarmStory: FC = () => {
  const [ref, visible] = useReveal<HTMLDivElement>({ threshold: 0.2 });

  return (
    <Box
      ref={ref}
      sx={{
        position: 'relative',
        height: { xs: '60vh', md: '80vh' },
        overflow: 'hidden',
      }}
    >
      <Box
        component="img"
        src={farmStoryImage}
        alt="Where every mango begins — the farm"
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
          background: 'linear-gradient(180deg, rgba(23,59,40,0.3) 0%, rgba(23,59,40,0.6) 100%)',
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
            mb: 3,
            fontSize: { xs: '2.2rem', md: '3.5rem' },
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 800ms ease, transform 800ms ease',
          }}
        >
          Where every mango begins.
        </Typography>
        <Typography
          sx={{
            color: 'rgba(255,253,248,0.85)',
            fontSize: { xs: '1rem', md: '1.15rem' },
            maxWidth: 500,
            lineHeight: 1.8,
            mb: 4,
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 800ms ease 200ms, transform 800ms ease 200ms',
          }}
        >
          Every mango that reaches your home starts here — on our farm, tended by our family.
        </Typography>
        <Button
          variant="outlined"
          sx={{
            color: '#FFFDF8',
            borderColor: 'rgba(255,253,248,0.5)',
            borderRadius: 25,
            px: 4,
            py: 1.5,
            fontSize: '0.8rem',
            letterSpacing: '0.1em',
            '&:hover': { borderColor: '#FFFDF8', bgcolor: 'transparent' },
          }}
        >
          Our Story
        </Button>
      </Box>
    </Box>
  );
};

export default FarmStory;
