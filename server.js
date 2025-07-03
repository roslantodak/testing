import { createClient } from '@supabase/supabase-js';

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const supabaseUrl = 'https://akiopcfdbgmbypxoszco.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(".")); // Serve static files

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Save visitor data
app.post("/save-visitor", (req, res) => {
  try {
    const { ip, country, datetime } = req.body;
    
    // Read existing visitors
    let visitors = [];
    if (fs.existsSync("visitors.json")) {
      visitors = JSON.parse(fs.readFileSync("visitors.json", "utf8"));
    }
    
    // Add new visitor
    visitors.push({ ip, country, datetime });
    
    // Save back to file
    fs.writeFileSync("visitors.json", JSON.stringify(visitors, null, 2));
    
    res.json({ success: true, message: "Visitor saved" });
  } catch (error) {
    console.error("Error saving visitor:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get visitors data
app.get("/api/visitors", (req, res) => {
  try {
    if (fs.existsSync("visitors.json")) {
      const visitors = JSON.parse(fs.readFileSync("visitors.json", "utf8"));
      res.json(visitors);
    } else {
      res.json([]);
    }
  } catch (error) {
    console.error("Error reading visitors:", error);
    res.status(500).json({ error: error.message });
  }
});

// Example: Insert a visitor (call this function where needed)
async function insertVisitor(ip, country, country_code) {
  const { data, error } = await supabase
    .from('visitors')
    .insert([{ ip, country, country_code, datetime: new Date().toISOString() }]);
  if (error) console.error('Supabase insert error:', error);
  else console.log('Visitor inserted:', data);
}

// Example: Fetch all visitors (call this function where needed)
async function getVisitors() {
  const { data, error } = await supabase
    .from('visitors')
    .select('*')
    .order('datetime', { ascending: false });
  if (error) console.error('Supabase fetch error:', error);
  else console.log('Visitors:', data);
  return data;
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
