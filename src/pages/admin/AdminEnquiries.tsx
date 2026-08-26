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
import { supabase } from '../../lib/supabase';

interface Enquiry {
  id: string;
  customer_name: string | null;
  phone: string | null;
  product_interest: string | null;
  message: string | null;
  status: string;
  created_at: string;
}

const AdminEnquiries: FC = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEnquiries = async () => {
    const { data } = await supabase.from('enquiries').select('*').order('created_at', { ascending: false });
    setEnquiries((data ?? []) as Enquiry[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('enquiries').update({ status }).eq('id', id);
    fetchEnquiries();
  };

  if (loading) return <Typography sx={{ color: '#788267' }}>Loading...</Typography>;

  return (
    <Box>
      <Typography variant="h5" sx={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 600, color: '#173B28', mb: 4 }}>
        Enquiries
      </Typography>

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: '1px solid rgba(23,59,40,0.08)' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f0' }}>
              <TableCell sx={{ fontWeight: 600, color: '#173B28' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#173B28' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#173B28' }}>Phone</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#173B28' }}>Interest</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#173B28' }}>Message</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#173B28' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {enquiries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center', color: '#788267', py: 4 }}>
                  No enquiries yet
                </TableCell>
              </TableRow>
            ) : (
              enquiries.map((enq) => (
                <TableRow key={enq.id} hover>
                  <TableCell sx={{ fontSize: '0.8rem', color: '#788267' }}>
                    {new Date(enq.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{enq.customer_name ?? '—'}</TableCell>
                  <TableCell>{enq.phone ?? '—'}</TableCell>
                  <TableCell>{enq.product_interest ?? '—'}</TableCell>
                  <TableCell sx={{ maxWidth: 200, fontSize: '0.8rem', color: '#5B3A24' }}>
                    {enq.message ?? '—'}
                  </TableCell>
                  <TableCell>
                    <Select
                      size="small"
                      value={enq.status}
                      onChange={(e) => updateStatus(enq.id, e.target.value)}
                      sx={{ minWidth: 120 }}
                    >
                      <MenuItem value="new">New</MenuItem>
                      <MenuItem value="contacted">Contacted</MenuItem>
                      <MenuItem value="closed">Closed</MenuItem>
                    </Select>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminEnquiries;
