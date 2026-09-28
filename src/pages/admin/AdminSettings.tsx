import { type FC, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import { EMAIL, INSTAGRAM_HANDLE, PHONE, PHONE_SECONDARY, WHATSAPP_PRIMARY } from '@/content/site';
import { getSettings, saveSettings } from '@/services/firebase';

const AdminSettings: FC = () => {
  const [farmName, setFarmName] = useState('TS Mango Farming');
  const [phone, setPhone] = useState(PHONE);
  const [phone2, setPhone2] = useState(PHONE_SECONDARY);
  const [whatsapp1, setWhatsapp1] = useState(WHATSAPP_PRIMARY);
  const [instagram1, setInstagram1] = useState(INSTAGRAM_HANDLE);
  const [email, setEmail] = useState(EMAIL);
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
      if ('phone_secondary' in settings) setPhone2(settings.phone_secondary);
      if ('instagram' in settings) setInstagram1(settings.instagram);
      if ('email' in settings) setEmail(settings.email);
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
        phone_secondary: phone2,
        whatsapp_primary: whatsapp1,
        instagram: instagram1,
        email,
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
          <TextField label="Phone 2" value={phone2} onChange={(e) => setPhone2(e.target.value)} size="small" fullWidth />
          <TextField label="WhatsApp" value={whatsapp1} onChange={(e) => setWhatsapp1(e.target.value)} size="small" fullWidth />
          <TextField label="Instagram" value={instagram1} onChange={(e) => setInstagram1(e.target.value)} size="small" fullWidth />
          <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} size="small" fullWidth />
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
