const express = require('express');
const router = express.Router();

// Simple POST test endpoint to verify the backend accepts POSTs and returns JSON
router.post('/ping', (req, res) => {
  console.log(`➡️ ${new Date().toISOString()} - test/ping received - Method: ${req.method} - Body keys: ${Object.keys(req.body || {}).join(', ')}`);
  res.status(200).json({ success: true, message: 'pong', echo: req.body });
});

// Simple GET endpoint to verify server is alive
router.get('/ping', (req, res) => {
  res.status(200).json({ success: true, message: 'pong-get' });
});

module.exports = router;
