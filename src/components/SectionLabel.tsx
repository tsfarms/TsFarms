import type { FC, ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useReveal } from '../hooks/useReveal';

interface SectionLabelProps {
  children: ReactNode;
  color?: string;
  align?: 'left' | 'center';
}

const SectionLabel: FC<SectionLabelProps> = ({
  children,
  color = '#788267',
  align = 'left',
}) => {
  const [ref, visible] = useReveal<HTMLDivElement>();
  return (
    <Box
      ref={ref}
      sx={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 600ms ease, transform 600ms ease',
        mb: 2,
        textAlign: align,
      }}
    >
      <Typography
        variant="overline"
        sx={{
          color,
          fontSize: { xs: '0.7rem', md: '0.75rem' },
          letterSpacing: '0.2em',
          fontWeight: 600,
        }}
      >
        {children}
      </Typography>
    </Box>
  );
};

export default SectionLabel;
