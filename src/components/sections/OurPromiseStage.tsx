import { type FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SectionLabel from '../SectionLabel';
import { useReveal } from '../../hooks/useReveal';
import ParkOutlinedIcon from '@mui/icons-material/ParkOutlined';
import ScaleOutlinedIcon from '@mui/icons-material/ScaleOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';

const PROMISE_FACTS = [
  {
    icon: ParkOutlinedIcon,
    title: 'Direct From Our Farm',
    desc: 'Fresh mangoes, natural honey and seasonal jackfruit harvested directly from our family farm run by Thangapandi.',
  },
  {
    icon: ScaleOutlinedIcon,
    title: '5 KG Minimum Mango Order',
    desc: 'Carefully packed directly at our farm for fresh delivery to homes and families.',
  },
  {
    icon: StorefrontOutlinedIcon,
    title: 'Retail & Wholesale',
    desc: 'We supply fresh harvests for both individual family orders and bulk wholesale requirements.',
  },
  {
    icon: LocalShippingOutlinedIcon,
    title: 'Delivery Across Tamil Nadu',
    desc: 'Fresh harvest delivery to homes and businesses across all districts in Tamil Nadu.',
  },
];

const OurPromiseStage: FC = () => {
  const [ref, visible] = useReveal<HTMLDivElement>({ threshold: 0.15 });

  return (
    <Box
      id="promise"
      sx={{
        bgcolor: '#FAF6EE',
        py: { xs: 5.5, md: 7.5 },
        px: { xs: 3, md: 6, lg: 9 },
        borderTop: '1px solid rgba(23,59,40,0.06)',
      }}
    >
      <Box sx={{ maxWidth: 1300, mx: 'auto' }}>
        {/* Header */}
        <Box
          ref={ref}
          sx={{
            textAlign: 'center',
            maxWidth: 720,
            mx: 'auto',
            mb: { xs: 4, md: 5.5 },
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 700ms ease, transform 700ms ease',
          }}
        >
          <SectionLabel>TS Mango Farming</SectionLabel>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2.1rem', sm: '2.6rem', md: '3rem' },
              color: '#173B28',
              lineHeight: 1.15,
              mb: 1.5,
              fontWeight: 400,
            }}
          >
            From Our Farm To Your Home
          </Typography>
          <Typography
            sx={{
              color: '#5B3A24',
              fontSize: { xs: '0.98rem', md: '1.1rem' },
              fontFamily: '"Cormorant Garamond", serif',
              fontStyle: 'italic',
              lineHeight: 1.6,
            }}
          >
            Pure goodness from our farm delivered directly to your doorstep.
          </Typography>
        </Box>

        {/* 4 Pillars in Refined Editorial Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: { xs: 3.5, md: 4.5 },
          }}
        >
          {PROMISE_FACTS.map((item, i) => {
            const IconComponent = item.icon;
            return (
              <Box
                key={item.title}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: { xs: 'center', sm: 'flex-start' },
                  textAlign: { xs: 'center', sm: 'left' },
                  p: { xs: 2, sm: 0 },
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(24px)',
                  transition: `opacity 700ms ease ${i * 100}ms, transform 700ms ease ${i * 100}ms`,
                }}
              >
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    bgcolor: 'rgba(23,59,40,0.06)',
                    color: '#173B28',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2.5,
                  }}
                >
                  <IconComponent sx={{ fontSize: '1.6rem' }} />
                </Box>
                <Typography
                  sx={{
                    fontFamily: '"Cormorant Garamond", serif',
                    fontSize: { xs: '1.25rem', md: '1.35rem' },
                    color: '#173B28',
                    fontWeight: 600,
                    lineHeight: 1.3,
                    mb: 1,
                  }}
                >
                  {item.title}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '0.88rem',
                    color: '#5B3A24',
                    lineHeight: 1.65,
                  }}
                >
                  {item.desc}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default OurPromiseStage;
