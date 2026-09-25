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
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { createProduct, getAllProducts, updateProduct } from '@/services/firebase';

interface Product {
  id: string;
  name: string;
  category: string;
  description: string | null;
  is_active: boolean;
  stock_status: string;
}

const AdminProducts: FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('mango');
  const [description, setDescription] = useState('');
  const [stockStatus, setStockStatus] = useState('in_stock');
  const [isActive, setIsActive] = useState(true);

  const fetchProducts = async () => {
    const data = await getAllProducts();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    getAllProducts().then(setProducts).finally(() => setLoading(false));
  }, []);

  const startEdit = (p: Product) => {
    setEditing(p);
    setName(p.name);
    setCategory(p.category);
    setDescription(p.description ?? '');
    setStockStatus(p.stock_status);
    setIsActive(p.is_active);
  };

  const handleSave = async () => {
    if (!editing) return;
    await updateProduct(editing.id, { name, category, description, stock_status: stockStatus, is_active: isActive });
    setEditing(null);
    fetchProducts();
  };

  const handleAdd = async () => {
    await createProduct({
      name,
      category,
      description,
      stock_status: stockStatus,
      is_active: isActive,
    });
    setName('');
    setDescription('');
    fetchProducts();
  };

  const stockColor = (stock: string): 'default' | 'warning' | 'error' | 'success' => {
    switch (stock) {
      case 'in_stock': return 'success';
      case 'low_stock': return 'warning';
      case 'out_of_stock': return 'error';
      default: return 'default';
    }
  };

  if (loading) return <Typography sx={{ color: '#788267' }}>Loading...</Typography>;

  return (
    <Box>
      <Typography variant="h5" sx={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 600, color: '#173B28', mb: 4 }}>
        Products
      </Typography>

      <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid rgba(23,59,40,0.08)', mb: 4 }}>
        <Typography sx={{ fontWeight: 600, color: '#173B28', mb: 2 }}>
          {editing ? 'Edit Product' : 'Add Product'}
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'flex-start' }}>
          <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} size="small" sx={{ minWidth: 200 }} />
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Category</InputLabel>
            <Select value={category} label="Category" onChange={(e) => setCategory(e.target.value)}>
              <MenuItem value="mango">Mango</MenuItem>
              <MenuItem value="honey">Honey</MenuItem>
              <MenuItem value="jackfruit">Jackfruit</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Stock Status</InputLabel>
            <Select value={stockStatus} label="Stock Status" onChange={(e) => setStockStatus(e.target.value)}>
              <MenuItem value="in_stock">In Stock</MenuItem>
              <MenuItem value="low_stock">Low Stock</MenuItem>
              <MenuItem value="out_of_stock">Out of Stock</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Active</InputLabel>
            <Select value={isActive ? 'yes' : 'no'} label="Active" onChange={(e) => setIsActive(e.target.value === 'yes')}>
              <MenuItem value="yes">Yes</MenuItem>
              <MenuItem value="no">No</MenuItem>
            </Select>
          </FormControl>
          <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} size="small" sx={{ minWidth: 300 }} />
          {editing ? (
            <>
              <Button variant="contained" color="primary" onClick={handleSave} sx={{ py: 1 }}>Save</Button>
              <Button variant="outlined" onClick={() => setEditing(null)} sx={{ py: 1 }}>Cancel</Button>
            </>
          ) : (
            <Button variant="contained" color="primary" onClick={handleAdd} sx={{ py: 1 }}>Add</Button>
          )}
        </Box>
      </Paper>

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: '1px solid rgba(23,59,40,0.08)' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f0' }}>
              <TableCell sx={{ fontWeight: 600, color: '#173B28' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#173B28' }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#173B28' }}>Stock</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#173B28' }}>Active</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#173B28' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id} hover>
                <TableCell>{p.name}</TableCell>
                <TableCell sx={{ textTransform: 'capitalize' }}>{p.category}</TableCell>
                <TableCell><Chip label={p.stock_status.replace('_', ' ')} size="small" color={stockColor(p.stock_status)} /></TableCell>
                <TableCell>{p.is_active ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => startEdit(p)}>Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminProducts;
