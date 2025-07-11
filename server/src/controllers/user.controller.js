import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { asyncHandler } from '../utils/helpers.js';
import multer from 'multer';
import sharp from 'sharp';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype) {
      return cb(null, true);
    }
    cb(new Error('File type not supported. Please upload JPG, PNG, or WEBP.'));
  },
}).single('profilePicture');

export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  const user = new User({ username, email, password });
  await user.save();

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    message: 'User registered successfully',
    user: { id: user._id, username, email, profilePicture: user.profilePicture },
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    message: 'Login successful',
    user: {
      id: user._id,
      username: user.username,
      email,
      profilePicture: user.profilePicture,
    },
  });
});

export const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logout successful' });
});

export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select('-password')
    .populate({
      path: 'posts',
      populate: {
        path: 'author',
        select: 'username profilePicture',
      },
    });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user);
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
    .select('-password')
    .populate({
      path: 'posts',
      populate: {
        path: 'author',
        select: 'username profilePicture',
      },
    });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user);
});

export const updateUser = asyncHandler(async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.log('Multer error:', err.message);
      return res.status(400).json({ message: err.message });
    }
    try {
      const { username, email, password } = req.body;
      console.log('Update user request:', { username, email, hasFile: !!req.file });
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      let profilePicture = user.profilePicture;
      let profilePicturePublicId = user.profilePicturePublicId;

      if (req.file) {
        console.log('Processing file:', {
          name: req.file.originalname,
          size: req.file.size,
          mimetype: req.file.mimetype,
        });
        const buffer = await sharp(req.file.buffer)
          .resize(256, 256, { fit: 'fill', position: 'center' })
          .toBuffer();
        console.log('Sharp buffer created:', buffer.length, 'bytes');
        const result = await uploadToCloudinary(buffer);
        console.log('Cloudinary upload result:', {
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
        if (user.profilePicturePublicId) {
          await deleteFromCloudinary(user.profilePicturePublicId);
        }
        profilePicture = result.secure_url;
        profilePicturePublicId = result.public_id;
      }

      user.username = username || user.username;
      user.email = email || user.email;
      if (password) user.password = password;
      user.profilePicture = profilePicture;
      user.profilePicturePublicId = profilePicturePublicId;

      await user.save();
      console.log('User updated:', {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
      });

      res.json({
        message: 'User updated successfully',
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profilePicture: user.profilePicture,
        },
      });
    } catch (error) {
      console.log('Update user error:', error.message);
      res.status(400).json({ message: error.message });
    }
  });
});