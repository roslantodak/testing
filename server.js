const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
