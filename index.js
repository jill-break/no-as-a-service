const express = require('express');
const cors = require("cors");
const rateLimit = require('express-rate-limit');
const fs = require('fs');

const app = express();
app.use(cors());
app.set('trust proxy', true);
const PORT = process.env.PORT || 3000;

// Load reasons from JSON
const reasons = JSON.parse(fs.readFileSync('./reasons.json', 'utf-8'));

// Rate limiter: 120 requests per minute per IP
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 120,
  keyGenerator: (req, res) => {
    return req.headers['cf-connecting-ip'] || req.ip; // Fallback if header missing (or for non-CF)
  },
  message: { error: "Too many requests, please try again later. (120 reqs/min/IP)" }
});

app.use(limiter);

// Select a random rejection reason
function generateReason(reasons) {
  return reasons[Math.floor(Math.random() * reasons.length)];
}

// Random rejection reason endpoint
app.get('/no', (req, res) => {
  const reason = generateReason(reasons);
  res.json({ reason });
});

// Specific rejection reason by ID (0-indexed)
app.get('/no/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id < 0 || id >= reasons.length) {
    return res.status(404).json({ error: 'Reason not found.' });
  }
  res.json({ reason: reasons[id] });
});

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`No-as-a-Service is running on port ${PORT}`);
  });
}

module.exports = { app, generateReason };
