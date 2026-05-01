import express from 'express';
import multer from 'multer';
import axios from 'axios';
import { authMiddleware, requireCredits } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// Configure multer for memory storage
const upload = multer({ 
  limits: { 
    fileSize: 12 * 1024 * 1024, // 12MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(file.mimetype);
    if (extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files (JPEG, PNG, WEBP) are allowed'));
  }
});

// Demo endpoint (3 free uses)
const demoUsage = new Map();

router.post('/remove-bg-demo', upload.single('image'), async (req, res) => {
  try {
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const usage = demoUsage.get(clientIp) || 0;
    
    if (usage >= 3) {
      return res.status(403).json({ 
        error: 'Demo limit reached. Sign up for free to get 5 credits!' 
      });
    }
    
    const response = await axios.post(process.env.AI_URL, req.file.buffer, {
      responseType: 'arraybuffer',
      timeout: 30000,
      headers: { 'Content-Type': 'application/octet-stream' }
    });
    
    demoUsage.set(clientIp, usage + 1);
    const base64 = Buffer.from(response.data).toString('base64');
    
    res.json({ 
      image: `data:image/png;base64,${base64}`,
      demoUsed: usage + 1,
      demoRemaining: 2 - usage
    });
  } catch (error) {
    console.error('Demo processing error:', error);
    res.status(500).json({ error: 'Processing failed. Please try again.' });
  }
});

// Authenticated endpoint
router.post('/remove-bg', authMiddleware, requireCredits, upload.single('image'), async (req, res) => {
  try {
    const user = req.user;
    
    // Call AI service
    const response = await axios.post(process.env.AI_URL, req.file.buffer, {
      responseType: 'arraybuffer',
      timeout: 30000,
      headers: { 'Content-Type': 'application/octet-stream' }
    });
    
    // Deduct credit
    user.credits -= 1;
    user.totalProcessed += 1;
    
    // Save to history
    const base64 = Buffer.from(response.data).toString('base64');
    const imageUrl = `data:image/png;base64,${base64}`;
    
    user.history.unshift({
      resultUrl: imageUrl,
      createdAt: new Date(),
    });
    
    // Keep only last 50 history items
    if (user.history.length > 50) {
      user.history = user.history.slice(0, 50);
    }
    
    await user.save();
    
    res.json({ 
      image: imageUrl,
      creditsLeft: user.credits,
      totalProcessed: user.totalProcessed
    });
  } catch (error) {
    console.error('Background removal error:', error);
    res.status(500).json({ error: 'Processing failed. Please try again.' });
  }
});

// Get user credits
router.get('/user/credits', authMiddleware, async (req, res) => {
  res.json({ credits: req.user.credits });
});

// Get user history
router.get('/user/history', authMiddleware, async (req, res) => {
  const history = req.user.history.slice(0, 20);
  res.json(history);
});

export default router;