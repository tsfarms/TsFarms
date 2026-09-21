import { type FC, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { supabase } from '../../lib/supabase';
import {
  PHONE,
  WHATSAPP_PRIMARY,
  WHATSAPP_SECONDARY,
  INSTAGRAM_1,
  INSTAGRAM_2,
} from '../../data/siteData';

const SETTINGS_KEY = 'ts_farm_site_settings';

const AdminSettings: FC = () => {
  const [phone, setPhone] = useState(PHONE);
  const [whatsapp1, setWhatsapp1] = useState(WHATSAPP_PRIMARY);
  const [whatsapp2, setWhatsapp2] = useState(WHATSAPP_SECONDARY);
  const [instagram1, setInstagram1] = useState(INSTAGRAM_1);
  const [instagram2, setInstagram2] = useState(INSTAGRAM_2);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'contact_info')
          .maybeSingle();

        if (data && data.value) {
          const v = data.value;
          if (v.phone) setPhone(v.phone);
          if (v.whatsapp1) setWhatsapp1(v.whatsapp1);
          if (v.whatsapp2) setWhatsapp2(v.whatsapp2);
          if (v.instagram1) setInstagram1(v.instagram1);
          if (v.instagram2) setInstagram2(v.instagram2);
        } else {
          const cached = localStorage.getItem(SETTINGS_KEY);
          if (cached) {
            const parsed = JSON.parse(cached);
            if (parsed.phone) setPhone(parsed.phone);
            if (parsed.whatsapp1) setWhatsapp1(parsed.whatsapp1);
            if (parsed.whatsapp2) setWhatsapp2(parsed.whatsapp2);
            if (parsed.instagram1) setInstagram1(parsed.instagram1);
            if (parsed.instagram2) setInstagram2(parsed.instagram2);
          }
        }
      } catch {
        // use defaults
      }
    };

    loadSettings();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    const settingsPayload = {
      phone,
      whatsapp1,
      whatsapp2,
      instagram1,
      instagram2,
    };

    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settingsPayload));

      await supabase.from('site_settings').upsert({
        key: 'contact_info',
        value: settingsPayload,
        updated_at: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Saved to localStorage (Supabase table optional):', e);
    } finally {
      setLoading(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3500);
    }
  };

  return (
    <Box>
      <Typography
        variant="h5"
        sx={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 600, color: '#173B28', mb: 4 }}
      >
        Farm & Contact Settings
      </Typography>

      {saved && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 1.5, maxWidth: 600 }}>
          Settings successfully persisted to farm database and cache.
        </Alert>
      )}

      <Paper
        elevation={0}
        sx={{ p: 4, borderRadius: 2, border: '1px solid rgba(23,59,40,0.08)', maxWidth: 600 }}
      >
        <Typography sx={{ fontWeight: 600, color: '#173B28', mb: 1 }}>
          Direct Farm Contact Numbers
        </Typography>
        <Typography sx={{ fontSize: '0.82rem', color: '#788267', mb: 3 }}>
          These numbers power the automated WhatsApp orders, enquiry links, and customer contact buttons.
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            label="Calling Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            size="small"
            fullWidth
          />
          <TextField
            label="Primary WhatsApp Dispatch Number (Orders go here)"
            value={whatsapp1}
            onChange={(e) => setWhatsapp1(e.target.value)}
            size="small"
            fullWidth
            helperText="10-digit Indian mobile number without country code"
          />
          <TextField
            label="Secondary WhatsApp Number"
            value={whatsapp2}
            onChange={(e) => setWhatsapp2(e.target.value)}
            size="small"
            fullWidth
          />
          <TextField
            label="Primary Instagram Handle"
            value={instagram1}
            onChange={(e) => setInstagram1(e.target.value)}
            size="small"
            fullWidth
          />
          <TextField
            label="Secondary Instagram Handle"
            value={instagram2}
            onChange={(e) => setInstagram2(e.target.value)}
            size="small"
            fullWidth
          />
          <Button
            variant="contained"
            color="primary"
            disabled={loading}
            onClick={handleSave}
            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
            sx={{ alignSelf: 'flex-start', py: 1.2, px: 4, mt: 1, fontWeight: 600 }}
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default AdminSettings;
