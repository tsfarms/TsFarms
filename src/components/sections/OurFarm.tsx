import { type FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { farmImage } from '@/content/site';
import { useReveal } from '@/hooks/useReveal';
import SectionLabel from '@/components/layout/SectionLabel';

const OurFarm: FC = () => {
  const [imgRef, imgVisible] = useReveal<HTMLDivElement>();
  const [textRef, textVisible] = useReveal<HTMLDivElement>();

  return (
    <Box
      id="farm"
      sx={{
        bgcolor: '#F6F1E7',
        py: { xs: 8, md: 14 },
        px: { xs: 3, md: 6, lg: 8 },
      }}
    >
      <Box
        sx={{
          maxWidth: 1400,
          mx: 'auto',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1.2fr 1fr' },
          gap: { xs: 6, md: 10 },
          alignItems: 'center',
        }}
      >
        {/* Image */}
        <Box
          ref={imgRef}
          sx={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 1,
            aspectRatio: '4/3',
            opacity: imgVisible ? 1 : 0,
            transform: imgVisible ? 'scale(1)' : 'scale(1.05)',
            transition: 'opacity 1000ms ease, transform 1200ms ease',
          }}
        >
          <img
            src={farmImage}
            alt="TS Mango Farming — the farm"
            width={1200}
            height={900}
            loading="lazy"
            decoding="async"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: imgVisible ? 'scale(1)' : 'scale(1.08)',
              transition: 'transform 2000ms ease-out',
            }}
          />
        </Box>

        {/* Text */}
        <Box ref={textRef}>
          <SectionLabel>Our Farm</SectionLabel>
          <Typography
            variant="h2"
            sx={{
              mb: 4,
              opacity: textVisible ? 1 : 0,
              transform: textVisible ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 700ms ease 200ms, transform 700ms ease 200ms',
            }}
          >
            A little closer to where it grows.
          </Typography>
          <Typography
            sx={{
              color: '#5B3A24',
              fontSize: '1.1rem',
              lineHeight: 1.8,
              mb: 3,
              opacity: textVisible ? 1 : 0,
              transform: textVisible ? 'translateY(0)' : 'translateY(12px)',
              transition: 'opacity 700ms ease 400ms, transform 700ms ease 400ms',
            }}
          >
            TS Mango Farming is a family-owned farm run by Thangapandi. We grow fresh mangoes, farm honey and seasonal jackfruit, and deliver them across Tamil Nadu.
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Cormorant Garamond", serif',
              fontStyle: 'italic',
              fontSize: '1.5rem',
              color: '#788267',
              opacity: textVisible ? 1 : 0,
              transition: 'opacity 700ms ease 600ms',
            }}
          >
            grown with care
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default OurFarm;
