import { type FC, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import { PHONE, WHATSAPP_PRIMARY, WHATSAPP_SECONDARY, INSTAGRAM_1, INSTAGRAM_2 } from '@/content/site';
import { getSettings, saveSettings } from '@/services/firebase';

const AdminSettings: FC = () => {
  const [farmName, setFarmName] = useState('TS Mango Farming');
  const [phone, setPhone] = useState(PHONE);
  const [whatsapp1, setWhatsapp1] = useState(WHATSAPP_PRIMARY);
  const [whatsapp2, setWhatsapp2] = useState(WHATSAPP_SECONDARY);
  const [instagram1, setInstagram1] = useState(INSTAGRAM_1);
  const [instagram2, setInstagram2] = useState(INSTAGRAM_2);
  const [upiId, setUpiId] = useState('');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const settings = await getSettings();
      if (!active) return;
      if ('farm_name' in settings) setFarmName(settings.farm_name);
      if ('phone' in settings) setPhone(settings.phone);
      if ('whatsapp_primary' in settings) setWhatsapp1(settings.whatsapp_primary);
      if ('whatsapp_secondary' in settings) setWhatsapp2(settings.whatsapp_secondary);
      if ('instagram_1' in settings) setInstagram1(settings.instagram_1);
      if ('instagram_2' in settings) setInstagram2(settings.instagram_2);
      if ('upi_id' in settings) setUpiId(settings.upi_id);
      setReady(true);
    })();
    return () => {
      active = false;
    };
  }, []);

  const handleSave = async () => {
    setError('');
    setSaved(false);
    setSaving(true);
    try {
      await saveSettings({
        farm_name: farmName,
        phone,
        whatsapp_primary: whatsapp1,
        whatsapp_secondary: whatsapp2,
        instagram_1: instagram1,
        instagram_2: instagram2,
        upi_id: upiId,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('save settings failed', err);
      setError(err instanceof Error ? err.message : 'Could not save settings.');
    } finally {
      setSaving(false);
    }
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
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 1 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={0} sx={{ p: 4, borderRadius: 2, border: '1px solid rgba(23,59,40,0.08)', maxWidth: 600 }}>
        <Typography sx={{ fontWeight: 600, color: '#173B28', mb: 3 }}>Contact Information</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField label="Farm name" value={farmName} onChange={(e) => setFarmName(e.target.value)} size="small" fullWidth />
          <TextField label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} size="small" fullWidth />
          <TextField label="WhatsApp (Primary)" value={whatsapp1} onChange={(e) => setWhatsapp1(e.target.value)} size="small" fullWidth />
          <TextField label="WhatsApp (Secondary)" value={whatsapp2} onChange={(e) => setWhatsapp2(e.target.value)} size="small" fullWidth />
          <TextField label="Instagram (Primary)" value={instagram1} onChange={(e) => setInstagram1(e.target.value)} size="small" fullWidth />
          <TextField label="Instagram (Secondary)" value={instagram2} onChange={(e) => setInstagram2(e.target.value)} size="small" fullWidth />
          <TextField label="UPI ID" value={upiId} onChange={(e) => setUpiId(e.target.value)} size="small" fullWidth />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={!ready || saving}
            sx={{ alignSelf: 'flex-start', py: 1, px: 4, mt: 1 }}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default AdminSettings;
