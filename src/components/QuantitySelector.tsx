import { type FC } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

interface QuantitySelectorProps {
  quantity: number;
  min?: number;
  step?: number;
  unit?: string;
  onChange: (qty: number) => void;
  size?: 'small' | 'medium';
}

export const QuantitySelector: FC<QuantitySelectorProps> = ({
  quantity,
  min = 1,
  step = 1,
  unit = 'KG',
  onChange,
  size = 'medium',
}) => {
  const isSmall = size === 'small';

  const handleDecrement = () => {
    if (quantity - step >= min) {
      onChange(quantity - step);
    }
  };

  const handleIncrement = () => {
    onChange(quantity + step);
  };

  const isMinReached = quantity <= min;

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        border: '1px solid #D1D5DB',
        borderRadius: 1,
        bgcolor: '#FFFDF8',
        p: isSmall ? '2px 4px' : '4px 8px',
        gap: isSmall ? 1 : 1.5,
      }}
    >
      <IconButton
        size="small"
        onClick={handleDecrement}
        disabled={isMinReached}
        sx={{
          color: '#173B28',
          p: isSmall ? 0.3 : 0.6,
          '&.Mui-disabled': { opacity: 0.35, color: '#9CA3AF' },
          '&:hover': { bgcolor: 'rgba(23,59,40,0.08)' },
        }}
        aria-label="Decrease quantity"
      >
        <RemoveIcon sx={{ fontSize: isSmall ? '0.9rem' : '1.1rem' }} />
      </IconButton>

      <Typography
        sx={{
          minWidth: isSmall ? 36 : 48,
          textAlign: 'center',
          fontWeight: 600,
          fontSize: isSmall ? '0.85rem' : '0.95rem',
          color: '#173B28',
          userSelect: 'none',
        }}
      >
        {quantity} {unit}
      </Typography>

      <IconButton
        size="small"
        onClick={handleIncrement}
        sx={{
          color: '#173B28',
          p: isSmall ? 0.3 : 0.6,
          '&:hover': { bgcolor: 'rgba(23,59,40,0.08)' },
        }}
        aria-label="Increase quantity"
      >
        <AddIcon sx={{ fontSize: isSmall ? '0.9rem' : '1.1rem' }} />
      </IconButton>
    </Box>
  );
};

export default QuantitySelector;
