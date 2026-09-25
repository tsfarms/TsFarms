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
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { supabase } from '../../lib/supabase';
import { mangoVarieties, type StockStatus } from '../../data/siteData';

interface VarietyRecord {
  id: string;
  variety_code?: string | null;
  name: string;
  tamil_name?: string | null;
  tagline: string | null;
  season: string | null;
  price: number;
  stock_status: StockStatus;
  display_order: number;
}

const statusOptions: { value: StockStatus; label: string; bgcolor: string; color: string }[] = [
  { value: 'in_stock', label: 'In Stock (Harvesting)', bgcolor: '#EBF3ED', color: '#173B28' },
  { value: 'low_stock', label: 'Limited Stock', bgcolor: '#FEF3C7', color: '#92400E' },
  { value: 'out_of_stock', label: 'Out of Season', bgcolor: '#F3F4F6', color: '#6B7280' },
];

const AdminMangoVarieties: FC = () => {
  const [varieties, setVarieties] = useState<VarietyRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVarieties = async () => {
    try {
      const { data } = await supabase.from('mango_varieties').select('*').order('display_order');
      if (data && data.length > 0) {
        setVarieties(
          data.map((v, i) => ({
            id: v.id,
            variety_code: v.variety_code,
            name: v.name,
            tagline: v.tagline,
            season: v.season,
            price: Number(v.price) || mangoVarieties[i]?.pricePerKg || 150,
            stock_status: v.stock_status || (v.is_available ? 'in_stock' : 'out_of_stock'),
            display_order: v.display_order ?? i + 1,
          })),
        );
      } else {
        // Fallback to local 7 varieties catalog
        setVarieties(
          mangoVarieties.map((v, idx) => ({
            id: v.id,
            variety_code: v.id,
            name: v.name,
            tamil_name: v.tamilName,
            tagline: v.tagline,
            season: v.season,
            price: v.pricePerKg,
            stock_status: v.stockStatus,
            display_order: idx + 1,
          })),
        );
      }
    } catch {
      setVarieties(
        mangoVarieties.map((v, idx) => ({
          id: v.id,
          variety_code: v.id,
          name: v.name,
          tamil_name: v.tamilName,
          tagline: v.tagline,
          season: v.season,
          price: v.pricePerKg,
          stock_status: v.stockStatus,
          display_order: idx + 1,
        })),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVarieties();
  }, []);

  const handleStatusChange = async (id: string, newStatus: StockStatus) => {
    setVarieties((prev) =>
      prev.map((v) => (v.id === id ? { ...v, stock_status: newStatus } : v)),
    );

    try {
      await supabase
        .from('mango_varieties')
        .update({
          stock_status: newStatus,
          is_available: newStatus !== 'out_of_stock',
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);
    } catch (e) {
      console.warn('Status updated locally (Supabase table update optional):', e);
    }
  };

  const handlePriceChange = async (id: string, newPrice: number) => {
    setVarieties((prev) =>
      prev.map((v) => (v.id === id ? { ...v, price: newPrice } : v)),
    );

    try {
      await supabase
        .from('mango_varieties')
        .update({
          price: newPrice,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);
    } catch (e) {
      console.warn('Price update failed:', e);
    }
  };

  if (loading) return <Typography sx={{ color: '#788267', p: 4 }}>Loading varieties...</Typography>;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography
          variant="h5"
          sx={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 600, color: '#173B28' }}
        >
          Mango Varieties & Stock Levels ({varieties.length})
        </Typography>
        <Button variant="outlined" size="small" onClick={fetchVarieties}>
          Refresh
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ borderRadius: 2, border: '1px solid rgba(23,59,40,0.08)' }}
      >
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f0' }}>
              <TableCell sx={{ fontWeight: 600, color: '#173B28' }}>#</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#173B28' }}>Variety Name</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#173B28' }}>Price (₹/KG)</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#173B28' }}>Tagline</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#173B28' }}>Season Window</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#173B28' }}>Current Harvest Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {varieties.map((v) => {
              const currentOption = statusOptions.find((o) => o.value === v.stock_status) || statusOptions[0];

              return (
                <TableRow key={v.id} hover>
                  <TableCell sx={{ color: '#788267' }}>{v.display_order}</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#173B28' }}>
                    {v.name}
                    {v.tamil_name && (
                      <Typography component="span" sx={{ display: 'block', fontSize: '0.75rem', color: '#788267' }}>
                        {v.tamil_name}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#173B28' }}>₹</Typography>
                      <input
                        type="number"
                        value={v.price}
                        onChange={(e) => handlePriceChange(v.id, Number(e.target.value) || 0)}
                        style={{
                          width: '70px',
                          padding: '4px 6px',
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          color: '#173B28',
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: '#5B3A24', fontSize: '0.82rem' }}>{v.tagline ?? '—'}</TableCell>
                  <TableCell sx={{ fontSize: '0.82rem' }}>{v.season ?? '—'}</TableCell>
                  <TableCell>
                    <Select
                      size="small"
                      value={v.stock_status}
                      onChange={(e) => handleStatusChange(v.id, e.target.value as StockStatus)}
                      sx={{
                        minWidth: 170,
                        fontSize: '0.8rem',
                        height: 32,
                        bgcolor: currentOption.bgcolor,
                        color: currentOption.color,
                        fontWeight: 600,
                      }}
                    >
                      {statusOptions.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value} sx={{ fontSize: '0.8rem' }}>
                          {opt.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminMangoVarieties;
