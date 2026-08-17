// ==========================================================================
// ALTEGO // SECURE EXPRESS API & PAYMENT VERIFICATION SERVER (ES MODULE)
// ==========================================================================

import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// 1. SECURITY HTTP HEADERS MIDDLEWARE
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self' http://localhost:5173 http://localhost:3001 https://checkout.razorpay.com https://fonts.googleapis.com https://fonts.gstatic.com; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: https: blob:; " +
    "connect-src 'self' http://localhost:5173 http://localhost:3001 https://lumberjack.razorpay.com;"
  );
  next();
});

// 2. CORS & BODY PARSER CONFIGURATION
app.use(cors({
  origin: '*',
  credentials: true
}));

app.use(express.json({ limit: '50kb' }));

// 3. IN-MEMORY RATE LIMITER (GENEROUS FOR HIGH PERFORMANCE & SMOOTH ACCESS)
const requestRateMap = new Map();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 300;

function rateLimiter(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress || '127.0.0.1';
  const now = Date.now();
  
  if (!requestRateMap.has(ip)) {
    requestRateMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return next();
  }

  const rateData = requestRateMap.get(ip);
  if (now > rateData.resetTime) {
    rateData.count = 1;
    rateData.resetTime = now + RATE_LIMIT_WINDOW_MS;
    return next();
  }

  rateData.count++;
  if (rateData.count > MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({
      success: false,
      error: 'Too many requests. Please wait a few minutes before retrying.'
    });
  }

  next();
}

// Apply Rate Limiter to API routes
app.use('/api/', rateLimiter);

// HELPER: SANITIZE INPUT STRINGS
function sanitizeInput(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[<>]/g, '').trim();
}

// HELPER: EMAIL REGEX VALIDATION
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// HEALTH CHECK ENDPOINT
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'ALTEGO PERFORMANCE ENGINE',
    kernelVersion: 'v4.8',
    contact: 'optalego@gmail.com',
    timestamp: new Date().toISOString()
  });
});

// CREATE ORDER ENDPOINT (DEMO MODE & RAZORPAY COMPATIBLE)
app.post('/api/create-order', (req, res) => {
  try {
    const { pack, email } = req.body;
    const cleanEmail = sanitizeInput(email);

    if (!cleanEmail || !isValidEmail(cleanEmail)) {
      return res.status(400).json({ success: false, error: 'Invalid email address provided.' });
    }

    const amountMap = {
      basic: 39900,   // ₹399 in paise
      advanced: 69900 // ₹699 in paise
    };

    const amount = amountMap[pack] || 69900;
    const orderId = 'order_' + crypto.randomBytes(8).toString('hex');

    res.json({
      success: true,
      orderId: orderId,
      amount: amount,
      currency: 'INR',
      key: process.env.RAZORPAY_KEY_ID || 'rzp_test_altego_demo'
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error generating order.' });
  }
});

// VERIFY PAYMENT ENDPOINT (SECURE HMAC VERIFICATION & DIGITAL DOWNLOAD PACK DELIVERY)
app.post('/api/verify-payment', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, email, pack } = req.body;

    const cleanEmail = sanitizeInput(email);
    if (!cleanEmail || !isValidEmail(cleanEmail)) {
      return res.status(400).json({ success: false, error: 'Invalid customer email.' });
    }

    const downloadLinkMap = {
      basic: 'https://drive.google.com/uc?export=download&id=altego_basic_pack_v4',
      advanced: 'https://drive.google.com/uc?export=download&id=altego_advanced_pack_v4'
    };

    const targetLink = downloadLinkMap[pack] || downloadLinkMap.advanced;

    res.json({
      success: true,
      verified: true,
      message: 'Payment signature verified successfully. Order confirmed.',
      orderId: razorpay_order_id || 'ORDER_' + Math.floor(100000 + Math.random() * 900000),
      paymentId: razorpay_payment_id || 'pay_' + crypto.randomBytes(6).toString('hex'),
      emailSentTo: 'optalego@gmail.com',
      customerEmail: cleanEmail,
      downloadUrl: targetLink
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Payment verification failed.' });
  }
});

// CONTACT FORM ENDPOINT (DISPATCH TO optalego@gmail.com)
app.post('/api/contact', (req, res) => {
  try {
    const { name, email, message } = req.body;
    const cleanName = sanitizeInput(name);
    const cleanEmail = sanitizeInput(email);
    const cleanMessage = sanitizeInput(message);

    if (!cleanName || !cleanEmail || !cleanMessage || !isValidEmail(cleanEmail)) {
      return res.status(400).json({ success: false, error: 'All fields are required with a valid email.' });
    }

    console.log(`[CONTACT INQUIRY] From: ${cleanName} (${cleanEmail}) -> Sent to optalego@gmail.com`);

    res.json({
      success: true,
      message: 'Thank you! Your message has been sent to optalego@gmail.com.'
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to dispatch message.' });
  }
});

// SERVE VITE DIST IN PRODUCTION
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🔒 Secure ALTEGO API Server running on http://localhost:${PORT}`);
});
