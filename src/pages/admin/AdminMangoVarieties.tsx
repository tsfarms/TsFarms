import { type FC, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import Switch from '@mui/material/Switch';
import { getAllMangoVarieties, updateMangoVariety } from '@/services/firebase';

interface Variety {
  id: string;
  name: string;
  tagline: string | null;
  season: string | null;
  is_available: boolean;
  display_order: number;
}

const AdminMangoVarieties: FC = () => {
  const [varieties, setVarieties] = useState<Variety[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    const data = await getAllMangoVarieties();
    setVarieties(data as Variety[]);
    setLoading(false);
  };

  useEffect(() => {
    getAllMangoVarieties()
      .then((data) => setVarieties(data as Variety[]))
      .finally(() => setLoading(false));
  }, []);

  const toggleAvailability = async (id: string, current: boolean) => {
    await updateMangoVariety(id, { is_available: !current });
    fetch();
  };

  if (loading) return <Typography sx={{ color: '#788267' }}>Loading...</Typography>;

  return (
    <Box>
      <Typography variant="h5" sx={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 600, color: '#173B28', mb: 4 }}>
        Mango Varieties
      </Typography>

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: '1px solid rgba(23,59,40,0.08)' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f0' }}>
              <TableCell sx={{ fontWeight: 600, color: '#173B28' }}>Order</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#173B28' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#173B28' }}>Tagline</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#173B28' }}>Season</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#173B28' }}>Available</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {varieties.map((v) => (
              <TableRow key={v.id} hover>
                <TableCell>{v.display_order}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{v.name}</TableCell>
                <TableCell sx={{ color: '#788267', fontSize: '0.85rem' }}>{v.tagline ?? '—'}</TableCell>
                <TableCell>{v.season ?? '—'}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Switch
                      size="small"
                      checked={v.is_available}
                      onChange={() => toggleAvailability(v.id, v.is_available)}
                    />
                    <Chip
                      label={v.is_available ? 'Available' : 'Unavailable'}
                      size="small"
                      color={v.is_available ? 'success' : 'default'}
                    />
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminMangoVarieties;
