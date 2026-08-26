import { type FC, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import { PHONE, WHATSAPP_PRIMARY, WHATSAPP_SECONDARY, INSTAGRAM_1, INSTAGRAM_2 } from '../../data/siteData';

const AdminSettings: FC = () => {
  const [phone, setPhone] = useState(PHONE);
  const [whatsapp1, setWhatsapp1] = useState(WHATSAPP_PRIMARY);
  const [whatsapp2, setWhatsapp2] = useState(WHATSAPP_SECONDARY);
  const [instagram1, setInstagram1] = useState(INSTAGRAM_1);
  const [instagram2, setInstagram2] = useState(INSTAGRAM_2);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 600, color: '#173B28', mb: 4 }}>
        Settings
      </Typography>

      {saved && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 1 }}>
          Settings saved successfully.
        </Alert>
      )}

      <Paper elevation={0} sx={{ p: 4, borderRadius: 2, border: '1px solid rgba(23,59,40,0.08)', maxWidth: 600 }}>
        <Typography sx={{ fontWeight: 600, color: '#173B28', mb: 3 }}>Contact Information</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} size="small" fullWidth />
          <TextField label="WhatsApp (Primary)" value={whatsapp1} onChange={(e) => setWhatsapp1(e.target.value)} size="small" fullWidth />
          <TextField label="WhatsApp (Secondary)" value={whatsapp2} onChange={(e) => setWhatsapp2(e.target.value)} size="small" fullWidth />
          <TextField label="Instagram (Primary)" value={instagram1} onChange={(e) => setInstagram1(e.target.value)} size="small" fullWidth />
          <TextField label="Instagram (Secondary)" value={instagram2} onChange={(e) => setInstagram2(e.target.value)} size="small" fullWidth />
          <Button variant="contained" color="primary" onClick={handleSave} sx={{ alignSelf: 'flex-start', py: 1, px: 4, mt: 1 }}>
            Save Changes
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default AdminSettings;
