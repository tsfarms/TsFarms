import { useState, type FC } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import RemoveIcon from '@mui/icons-material/Remove';

interface MinQtyButtonProps {
  atFloor: boolean;
  minQty: number;
  unit: string;
  label: string;
  onDecrease: () => void;
}

const MinQtyButton: FC<MinQtyButtonProps> = ({ atFloor, minQty, unit, label, onDecrease }) => {
  const [open, setOpen] = useState(false);
  const message = `Minimum order is ${minQty} ${unit}`;

  return (
    <Tooltip
      title={message}
      arrow
      placement="top"
      open={atFloor && open}
      onClose={() => setOpen(false)}
      disableHoverListener
      disableFocusListener
      disableTouchListener
      slotProps={{
        tooltip: {
          sx: {
            bgcolor: '#173B28',
            color: '#FFFDF8',
            fontFamily: '"Manrope", sans-serif',
            fontSize: '0.78rem',
            fontWeight: 600,
            lineHeight: 1.4,
            px: 1.25,
            py: 0.75,
            maxWidth: 220,
          },
        },
        arrow: { sx: { color: '#173B28' } },
      }}
    >
      <Box
        component="span"
        onMouseEnter={() => atFloor && setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => atFloor && setOpen(true)}
        onBlur={() => setOpen(false)}
        sx={{ display: 'inline-flex' }}
      >
        <IconButton
          size="small"
          aria-label={atFloor ? `${label}. ${message}` : label}
          aria-disabled={atFloor}
          onClick={() => {
            if (atFloor) {
              setOpen(true);
              return;
            }
            onDecrease();
          }}
          sx={{
            color: atFloor ? 'rgba(23,59,40,0.38)' : '#173B28',
            cursor: atFloor ? 'not-allowed' : 'pointer',
          }}
        >
          <RemoveIcon fontSize="small" />
        </IconButton>
      </Box>
    </Tooltip>
  );
};

export default MinQtyButton;
