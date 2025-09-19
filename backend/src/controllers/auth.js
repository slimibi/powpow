import { User } from '../models/User.js';
import { asyncHandler } from '../middleware/error.js';
import Joi from 'joi';

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  role: Joi.string().valid('admin', 'user', 'viewer').optional()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const register = asyncHandler(async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message
    });
  }

  const { email, password, firstName, lastName, role } = req.body;

  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      error: 'User already exists with this email'
    });
  }

  const user = await User.create({
    email,
    password,
    firstName,
    lastName,
    role: role || 'user'
  });

  const token = User.generateJWT(user.id);

  res.status(201).json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role
      },
      token
    }
  });
});

export const login = asyncHandler(async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message
    });
  }

  const { email, password } = req.body;

  const user = await User.findByEmail(email);
  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'Invalid credentials'
    });
  }

  if (!user.is_active) {
    return res.status(401).json({
      success: false,
      error: 'Account has been deactivated'
    });
  }

  const isMatch = await User.comparePassword(password, user.password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      error: 'Invalid credentials'
    });
  }

  const token = User.generateJWT(user.id);

  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role
      },
      token
    }
  });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = req.user;

  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role
      }
    }
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = ['firstName', 'lastName'];
  const updateData = {};

  Object.keys(req.body).forEach(key => {
    if (allowedFields.includes(key) && req.body[key]) {
      const dbField = key === 'firstName' ? 'first_name' : 'last_name';
      updateData[dbField] = req.body[key];
    }
  });

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({
      success: false,
      error: 'No valid fields provided for update'
    });
  }

  const user = await User.update(req.user.id, updateData);

  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role
      }
    }
  });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      error: 'Current password and new password are required'
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      error: 'New password must be at least 6 characters long'
    });
  }

  const user = await User.findByEmail(req.user.email);
  const isMatch = await User.comparePassword(currentPassword, user.password);
  
  if (!isMatch) {
    return res.status(400).json({
      success: false,
      error: 'Current password is incorrect'
    });
  }

  await User.updatePassword(req.user.id, newPassword);

  res.status(200).json({
    success: true,
    message: 'Password updated successfully'
  });
});