import { type FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SectionLabel from '../SectionLabel';
import { useReveal } from '../../hooks/useReveal';
import SpaOutlinedIcon from '@mui/icons-material/SpaOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';

const PROMISES = [
  {
    icon: SpaOutlinedIcon,
    title: 'Tree-Ripened Purity',
    desc: 'Never forced with calcium carbide or chemical hastenings. Handpicked only when mature and fragrant on the branch.',
  },
  {
    icon: Inventory2OutlinedIcon,
    title: 'Cushioned 5 KG Transit Box',
    desc: 'Custom-aerated, corrugated packaging with soft dividers to prevent bruising and preserve farm-fresh integrity.',
  },
  {
    icon: HandshakeOutlinedIcon,
    title: 'Direct Farmer Value',
    desc: 'Zero middlemen or warehouse delays. Harvested by Thangapandi and delivered straight to your home.',
  },
  {
    icon: LocalShippingOutlinedIcon,
    title: 'All Tamil Nadu Delivery',
    desc: 'Prompt door delivery across Chennai, Coimbatore, Madurai, Salem, Tiruchi, and all surrounding districts.',
  },
];

const OurPromise: FC = () => {
  const [ref, visible] = useReveal<HTMLDivElement>({ threshold: 0.15 });

  return (
    <Box
      id="promise"
      sx={{
        bgcolor: '#FAF6EE',
        py: { xs: 12, md: 18 },
        px: { xs: 3, md: 6, lg: 10 },
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
            mb: { xs: 8, md: 12 },
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 700ms ease, transform 700ms ease',
          }}
        >
          <SectionLabel>Our Farm Commitment</SectionLabel>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.5rem' },
              color: '#173B28',
              lineHeight: 1.15,
              mb: 2,
              fontWeight: 400,
            }}
          >
            The TS Mango Promise
          </Typography>
          <Typography
            sx={{
              color: '#5B3A24',
              fontSize: { xs: '1rem', md: '1.15rem' },
              fontFamily: '"Cormorant Garamond", serif',
              fontStyle: 'italic',
              lineHeight: 1.7,
            }}
          >
            Rooted in respect for the soil, transparent harvest standards, and honest farm-direct service.
          </Typography>
        </Box>

        {/* 4 Pillars in Refined Editorial Grid (Generous whitespace, subtle borders, no heavy cards) */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: { xs: 5, md: 6 },
          }}
        >
          {PROMISES.map((item, i) => {
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

export default OurPromise;
