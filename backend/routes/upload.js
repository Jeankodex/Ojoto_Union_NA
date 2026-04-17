// routes/upload.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const { verifyToken } = require('../utils/auth');
const { query } = require('../database/init'); // ← Changed import

// Create uploads directories
const uploadsDir = path.join(__dirname, '../uploads');
const profilePicturesDir = path.join(uploadsDir, 'profile-pictures');
const coverPhotosDir = path.join(uploadsDir, 'cover-photos');

try {
  [uploadsDir, profilePicturesDir, coverPhotosDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ Created directory: ${dir}`);
    }
  });
} catch (err) {
  console.error('❌ Directory creation error:', err.message);
}

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'profilePicture') {
      cb(null, profilePicturesDir);
    } else if (file.fieldname === 'coverPhoto') {
      cb(null, coverPhotosDir);
    } else {
      cb(new Error('Invalid fieldname'));
    }
  },
  filename: function (req, file, cb) {
    const userId = req.userId || 'unknown';
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const filename = `${userId}-${timestamp}${ext}`;
    cb(null, filename);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
  }
});

// Upload profile picture (PostgreSQL version)
router.post('/profile-picture', verifyToken, upload.single('profilePicture'), async (req, res) => {
  try {
    console.log('📤 Profile picture upload for user:', req.userId);
    
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const filename = req.file.filename;
    const userId = req.userId;
    const filePath = `/uploads/profile-pictures/${filename}`;
    
    console.log(`✅ File saved: ${filename} (${req.file.size} bytes)`);

    // Update database (PostgreSQL)
    await query(
      `UPDATE profiles SET profile_picture = $1, updated_at = NOW() WHERE user_id = $2`,
      [filename, userId]
    );
    
    console.log(`✅ Database updated for user ${userId}`);

    res.json({
      success: true,
      message: 'Profile picture uploaded successfully',
      filename: filename,
      url: filePath
    });

  } catch (error) {
    console.error('❌ Profile picture upload error:', error);
    
    // Delete the uploaded file if database update failed
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
      console.log(`🗑️ Deleted file: ${req.file.filename}`);
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Failed to upload profile picture',
      error: error.message 
    });
  }
});

// Upload cover photo (PostgreSQL version)
router.post('/cover-photo', verifyToken, upload.single('coverPhoto'), async (req, res) => {
  try {
    console.log('📤 Cover photo upload for user:', req.userId);
    
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const filename = req.file.filename;
    const userId = req.userId;
    const filePath = `/uploads/cover-photos/${filename}`;
    
    console.log(`✅ File saved: ${filename} (${req.file.size} bytes)`);

    // Update database (PostgreSQL)
    await query(
      `UPDATE profiles SET cover_photo = $1, updated_at = NOW() WHERE user_id = $2`,
      [filename, userId]
    );
    
    console.log(`✅ Database updated for user ${userId}`);

    res.json({
      success: true,
      message: 'Cover photo uploaded successfully',
      filename: filename,
      url: filePath
    });

  } catch (error) {
    console.error('❌ Cover photo upload error:', error);
    
    // Delete the uploaded file if database update failed
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
      console.log(`🗑️ Deleted file: ${req.file.filename}`);
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Failed to upload cover photo',
      error: error.message 
    });
  }
});

// Test if files are being saved
router.get('/list-files', (req, res) => {
  try {
    const profileFiles = fs.existsSync(profilePicturesDir) ? fs.readdirSync(profilePicturesDir) : [];
    const coverFiles = fs.existsSync(coverPhotosDir) ? fs.readdirSync(coverPhotosDir) : [];
    
    res.json({
      success: true,
      profilePictures: {
        count: profileFiles.length,
        files: profileFiles.slice(0, 10)
      },
      coverPhotos: {
        count: coverFiles.length,
        files: coverFiles.slice(0, 10)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Upload route is working',
    directories: {
      profilePictures: fs.existsSync(profilePicturesDir),
      coverPhotos: fs.existsSync(coverPhotosDir)
    }
  });
});

module.exports = router;