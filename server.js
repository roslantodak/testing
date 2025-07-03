import { createClient } from '@supabase/supabase-js';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import 'dotenv/config';

const supabaseUrl = 'https://akiopcfdbgmbypxoszco.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.')); // Serve static files

// Routes
app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/index.html');
});

// Insert visitor via POST /add-visitor
app.post('/add-visitor', async (req, res) => {
  try {
    const { ip, country, country_code } = req.body;
    const { data, error } = await supabase
      .from('visitors')
      .insert([{ ip, country, country_code, datetime: new Date().toISOString() }]);
    if (error) return res.status(500).json({ success: false, error: error.message });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Fetch all visitors via GET /get-visitors
app.get('/get-visitors', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('visitors')
      .select('*')
      .order('datetime', { ascending: false });
    if (error) return res.status(500).json({ success: false, error: error.message });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
