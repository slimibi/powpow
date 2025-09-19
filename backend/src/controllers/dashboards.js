import { Dashboard } from '../models/Dashboard.js';
import { Chart } from '../models/Chart.js';
import { User } from '../models/User.js';
import { asyncHandler } from '../middleware/error.js';
import Joi from 'joi';

const createDashboardSchema = Joi.object({
  title: Joi.string().min(1).max(255).required(),
  description: Joi.string().max(1000).optional(),
  isPublic: Joi.boolean().optional()
});

const updateDashboardSchema = Joi.object({
  title: Joi.string().min(1).max(255).optional(),
  description: Joi.string().max(1000).optional(),
  layout: Joi.array().optional(),
  filters: Joi.object().optional(),
  isPublic: Joi.boolean().optional()
});

const shareSchema = Joi.object({
  email: Joi.string().email().required(),
  permission: Joi.string().valid('view', 'edit').default('view')
});

export const createDashboard = asyncHandler(async (req, res) => {
  const { error } = createDashboardSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message
    });
  }

  const dashboard = await Dashboard.create({
    title: req.body.title,
    description: req.body.description,
    userId: req.user.id,
    isPublic: req.body.isPublic || false
  });

  res.status(201).json({
    success: true,
    data: { dashboard }
  });
});

export const getDashboards = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const result = await Dashboard.findByUserId(req.user.id, page, limit);

  res.status(200).json({
    success: true,
    data: result
  });
});

export const getDashboard = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const includeCharts = req.query.include === 'charts';

  const dashboard = await Dashboard.findById(id);
  if (!dashboard) {
    return res.status(404).json({
      success: false,
      error: 'Dashboard not found'
    });
  }

  const accessCheck = await Dashboard.checkAccess(id, req.user?.id);
  if (!accessCheck.hasAccess) {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to access this dashboard'
    });
  }

  const responseData = { dashboard, permission: accessCheck.permission };

  if (includeCharts) {
    const charts = await Chart.findByDashboardId(id);
    responseData.charts = charts;
  }

  res.status(200).json({
    success: true,
    data: responseData
  });
});

export const updateDashboard = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const { error } = updateDashboardSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message
    });
  }

  const accessCheck = await Dashboard.checkAccess(id, req.user.id);
  if (!accessCheck.hasAccess || accessCheck.permission === 'view') {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to modify this dashboard'
    });
  }

  const allowedFields = ['title', 'description', 'layout', 'filters', 'isPublic'];
  const updateData = {};

  Object.keys(req.body).forEach(key => {
    if (allowedFields.includes(key)) {
      if (key === 'isPublic') {
        updateData['is_public'] = req.body[key];
      } else {
        updateData[key] = req.body[key];
      }
    }
  });

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({
      success: false,
      error: 'No valid fields provided for update'
    });
  }

  const dashboard = await Dashboard.update(id, req.user.id, updateData);
  if (!dashboard) {
    return res.status(404).json({
      success: false,
      error: 'Dashboard not found or not authorized'
    });
  }

  res.status(200).json({
    success: true,
    data: { dashboard }
  });
});

export const deleteDashboard = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const ownershipCheck = await Dashboard.checkOwnership(id, req.user.id);
  if (!ownershipCheck) {
    return res.status(403).json({
      success: false,
      error: 'Only dashboard owners can delete dashboards'
    });
  }

  const result = await Dashboard.delete(id, req.user.id);
  if (!result) {
    return res.status(404).json({
      success: false,
      error: 'Dashboard not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Dashboard deleted successfully'
  });
});

export const shareDashboard = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const { error } = shareSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message
    });
  }

  const targetUser = await User.findByEmail(req.body.email);
  if (!targetUser) {
    return res.status(404).json({
      success: false,
      error: 'User not found with this email'
    });
  }

  if (targetUser.id === req.user.id) {
    return res.status(400).json({
      success: false,
      error: 'Cannot share dashboard with yourself'
    });
  }

  try {
    const share = await Dashboard.shareWith(id, req.user.id, targetUser.id, req.body.permission);

    res.status(201).json({
      success: true,
      data: {
        share: {
          id: share.id,
          userId: targetUser.id,
          userEmail: targetUser.email,
          userName: `${targetUser.first_name} ${targetUser.last_name}`,
          permission: share.permission,
          createdAt: share.created_at
        }
      }
    });
  } catch (error) {
    res.status(403).json({
      success: false,
      error: error.message
    });
  }
});

export const getDashboardShares = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const shares = await Dashboard.getShares(id, req.user.id);

    res.status(200).json({
      success: true,
      data: { shares }
    });
  } catch (error) {
    res.status(403).json({
      success: false,
      error: error.message
    });
  }
});

export const removeDashboardShare = asyncHandler(async (req, res) => {
  const { id, userId } = req.params;

  try {
    const result = await Dashboard.removeShare(id, req.user.id, userId);
    
    if (!result) {
      return res.status(404).json({
        success: false,
        error: 'Share not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Share removed successfully'
    });
  } catch (error) {
    res.status(403).json({
      success: false,
      error: error.message
    });
  }
});

export const getPublicDashboards = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const result = await Dashboard.findPublic(page, limit);

  res.status(200).json({
    success: true,
    data: result
  });
});

export const getSharedDashboards = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const result = await Dashboard.getSharedWithMe(req.user.id, page, limit);

  res.status(200).json({
    success: true,
    data: result
  });
});

export const duplicateDashboard = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const accessCheck = await Dashboard.checkAccess(id, req.user.id);
  if (!accessCheck.hasAccess) {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to access this dashboard'
    });
  }

  const originalDashboard = await Dashboard.findById(id);
  const originalCharts = await Chart.findByDashboardId(id);

  const newDashboard = await Dashboard.create({
    title: `${originalDashboard.title} (Copy)`,
    description: originalDashboard.description,
    userId: req.user.id,
    layout: JSON.parse(originalDashboard.layout),
    filters: JSON.parse(originalDashboard.filters),
    isPublic: false
  });

  const newCharts = [];
  for (const chart of originalCharts) {
    const newChart = await Chart.duplicate(chart.id, newDashboard.id);
    newCharts.push(newChart);
  }

  res.status(201).json({
    success: true,
    data: {
      dashboard: newDashboard,
      charts: newCharts
    }
  });
});