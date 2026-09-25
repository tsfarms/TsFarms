import { useState, type FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import VerifiedIcon from '@mui/icons-material/Verified';
import SpaIcon from '@mui/icons-material/Spa';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BoltIcon from '@mui/icons-material/Bolt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SectionLabel from '../SectionLabel';
import { nutritionStoryData, productImages } from '../../data/siteData';

const iconMap = [
  <SpaIcon sx={{ color: '#173B28', fontSize: '1.4rem' }} />,
  <BoltIcon sx={{ color: '#D99419', fontSize: '1.4rem' }} />,
  <VisibilityIcon sx={{ color: '#173B28', fontSize: '1.4rem' }} />,
  <FavoriteIcon sx={{ color: '#B45309', fontSize: '1.4rem' }} />,
];

export const BenefitsStorytelling: FC = () => {
  const [activeTab, setActiveTab] = useState<'mango' | 'honey' | 'jackfruit'>('mango');

  const currentData = nutritionStoryData[activeTab];

  const getImageForTab = () => {
    switch (activeTab) {
      case 'mango':
        return productImages.mangoes;
      case 'honey':
        return productImages.honey;
      case 'jackfruit':
        return productImages.jackfruit;
    }
  };

  return (
    <Box
      id="benefits"
      sx={{
        bgcolor: '#FFFDF8',
        py: { xs: 10, md: 16 },
        px: { xs: 3, md: 6, lg: 8 },
        borderTop: '1px solid rgba(23,59,40,0.06)',
        borderBottom: '1px solid rgba(23,59,40,0.06)',
      }}
    >
      <Box sx={{ maxWidth: 1300, mx: 'auto' }}>
        <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 7 } }}>
          <SectionLabel>Nature's Pure Nutrition</SectionLabel>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2.2rem', md: '3.2rem' },
              color: '#173B28',
              mb: 2,
            }}
          >
            Nourishment directly from our soil.
          </Typography>
          <Typography
            sx={{
              color: '#5B3A24',
              fontSize: '1.1rem',
              maxWidth: 650,
              mx: 'auto',
              fontFamily: '"Cormorant Garamond", serif',
              fontStyle: 'italic',
            }}
          >
            Explore the biological and nutritional vitality packed within every fruit and harvest from TS Mango Farming.
          </Typography>

          {/* Interactive Tab Switcher */}
          <Box
            sx={{
              display: 'inline-flex',
              mt: 4,
              p: 0.6,
              borderRadius: 3,
              bgcolor: '#F6F1E7',
              border: '1px solid rgba(23,59,40,0.1)',
            }}
          >
            <Tabs
              value={activeTab}
              onChange={(_, val) => setActiveTab(val)}
              textColor="primary"
              indicatorColor="primary"
              sx={{
                '& .MuiTabs-indicator': {
                  bgcolor: '#173B28',
                  height: '100%',
                  borderRadius: 2.5,
                  zIndex: 0,
                },
                '& .MuiTab-root': {
                  zIndex: 1,
                  fontWeight: 700,
                  fontSize: { xs: '0.85rem', sm: '0.95rem' },
                  textTransform: 'none',
                  minHeight: 44,
                  px: { xs: 2.5, sm: 4 },
                  borderRadius: 2.5,
                  color: '#5B3A24',
                  transition: 'color 200ms ease',
                  '&.Mui-selected': {
                    color: '#FFFDF8',
                  },
                },
              }}
            >
              <Tab value="mango" label="Sun-Ripened Mangoes" />
              <Tab value="honey" label="Raw Blossom Honey" />
              <Tab value="jackfruit" label="Village Jackfruit" />
            </Tabs>
          </Box>
        </Box>

        {/* Dynamic Storytelling Showcase */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '5fr 7fr' },
            gap: { xs: 5, md: 8 },
            alignItems: 'center',
            p: { xs: 3, md: 6 },
            borderRadius: 3,
            bgcolor: '#F6F1E7',
            border: '1px solid rgba(23,59,40,0.08)',
            boxShadow: '0 8px 30px rgba(23,59,40,0.04)',
          }}
        >
          {/* Feature Image with Tamil Callout */}
          <Box sx={{ position: 'relative' }}>
            <Box
              sx={{
                borderRadius: 2.5,
                overflow: 'hidden',
                aspectRatio: '1/1',
                boxShadow: '0 16px 36px rgba(23,59,40,0.12)',
              }}
            >
              <Box
                component="img"
                src={getImageForTab()}
                alt={currentData.title}
                loading="lazy"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 700ms ease',
                  '&:hover': { transform: 'scale(1.04)' },
                }}
              />
            </Box>

            <Box
              sx={{
                position: 'absolute',
                bottom: -16,
                left: 16,
                right: 16,
                bgcolor: '#FFFDF8',
                borderRadius: 2,
                p: 2,
                boxShadow: '0 8px 24px rgba(23,59,40,0.1)',
                border: '1px solid rgba(23,59,40,0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <VerifiedIcon sx={{ color: '#173B28', fontSize: '1.4rem' }} />
              <Box>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#173B28' }}>
                  {currentData.tamil}
                </Typography>
                <Typography sx={{ fontSize: '0.72rem', color: '#788267' }}>
                  Authentic produce tested by natural farm traditions
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Benefits Grid */}
          <Box>
            <Typography
              variant="overline"
              sx={{ color: '#788267', fontSize: '0.75rem', letterSpacing: '0.15em', fontWeight: 700 }}
            >
              {currentData.subtitle}
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: '1.8rem', md: '2.4rem' },
                color: '#173B28',
                mb: 4,
                mt: 0.5,
              }}
            >
              {currentData.title}
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 3,
              }}
            >
              {currentData.benefits.map((b, idx) => (
                <Box
                  key={b.title}
                  sx={{
                    bgcolor: '#FFFDF8',
                    p: 2.5,
                    borderRadius: 2,
                    border: '1px solid rgba(23,59,40,0.06)',
                    boxShadow: '0 2px 10px rgba(23,59,40,0.03)',
                  }}
                >
                  <Box sx={{ mb: 1.2 }}>{iconMap[idx % iconMap.length]}</Box>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: '#173B28',
                      fontSize: '0.95rem',
                      mb: 0.8,
                    }}
                  >
                    {b.title}
                  </Typography>
                  <Typography
                    sx={{
                      color: '#5B3A24',
                      fontSize: '0.82rem',
                      lineHeight: 1.6,
                    }}
                  >
                    {b.detail}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default BenefitsStorytelling;
