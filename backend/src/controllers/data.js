import { DataSource } from '../models/DataSource.js';
import { DataProcessor } from '../services/dataProcessor.js';
import { asyncHandler } from '../middleware/error.js';
import fs from 'fs';
import path from 'path';
import Joi from 'joi';

const uploadSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  description: Joi.string().max(1000).optional(),
  isPublic: Joi.boolean().optional()
});

const transformSchema = Joi.object({
  transformations: Joi.object().optional(),
  groupBy: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())).optional(),
  aggregations: Joi.object().optional()
});

export const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: 'No file uploaded'
    });
  }

  const { error } = uploadSchema.validate(req.body);
  if (error) {
    fs.unlinkSync(req.file.path);
    return res.status(400).json({
      success: false,
      error: error.details[0].message
    });
  }

  try {
    const processedData = await DataProcessor.processFile(req.file.path);
    
    const metadata = {
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      columns: processedData.columns,
      rowCount: processedData.rowCount,
      dataType: processedData.type,
      public: req.body.isPublic || false,
      description: req.body.description || ''
    };

    if (processedData.sheetNames) {
      metadata.sheetNames = processedData.sheetNames;
    }

    const dataSource = await DataSource.create({
      name: req.body.name,
      type: 'file',
      filePath: req.file.path,
      userId: req.user.id,
      metadata
    });

    const cacheKey = `full_data_${dataSource.id}`;
    await DataSource.storeDataCache(dataSource.id, cacheKey, processedData.data, 1440);

    res.status(201).json({
      success: true,
      data: {
        dataSource: {
          id: dataSource.id,
          name: dataSource.name,
          type: dataSource.type,
          metadata: dataSource.metadata,
          createdAt: dataSource.created_at
        },
        preview: processedData.data.slice(0, 10)
      }
    });

  } catch (error) {
    fs.unlinkSync(req.file.path);
    
    res.status(500).json({
      success: false,
      error: `File processing failed: ${error.message}`
    });
  }
});

export const getDataSources = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const result = await DataSource.findByUserId(req.user.id, page, limit);

  res.status(200).json({
    success: true,
    data: result
  });
});

export const getDataSource = asyncHandler(async (req, res) => {
  const dataSource = await DataSource.findById(req.params.id);

  if (!dataSource) {
    return res.status(404).json({
      success: false,
      error: 'Data source not found'
    });
  }

  if (dataSource.user_id !== req.user.id) {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to access this data source'
    });
  }

  res.status(200).json({
    success: true,
    data: { dataSource }
  });
});

export const getDataSourceData = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { page = 1, limit = 100, transform } = req.query;

  const dataSource = await DataSource.findById(id);

  if (!dataSource) {
    return res.status(404).json({
      success: false,
      error: 'Data source not found'
    });
  }

  if (dataSource.user_id !== req.user.id) {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to access this data source'
    });
  }

  try {
    const cacheKey = `data_${id}_${page}_${limit}_${transform || 'none'}`;
    let data = await DataSource.getDataCache(id, cacheKey);

    if (!data) {
      const fullDataCacheKey = `full_data_${id}`;
      let fullData = await DataSource.getDataCache(id, fullDataCacheKey);

      if (!fullData) {
        if (dataSource.type === 'file' && dataSource.file_path) {
          const processedData = await DataProcessor.processFile(dataSource.file_path);
          fullData = processedData.data;
          await DataSource.storeDataCache(id, fullDataCacheKey, fullData, 1440);
        } else {
          return res.status(500).json({
            success: false,
            error: 'Unable to retrieve data'
          });
        }
      }

      data = fullData;

      if (transform) {
        try {
          const transformConfig = JSON.parse(transform);
          const { error } = transformSchema.validate(transformConfig);
          
          if (!error) {
            if (transformConfig.transformations) {
              data = DataProcessor.transformData(data, transformConfig.transformations);
            }
            
            if (transformConfig.groupBy && transformConfig.aggregations) {
              data = DataProcessor.aggregateData(data, transformConfig.groupBy, transformConfig.aggregations);
            }
          }
        } catch (transformError) {
          console.log('Transform error:', transformError);
        }
      }

      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + parseInt(limit);
      data = data.slice(startIndex, endIndex);

      await DataSource.storeDataCache(id, cacheKey, data, 60);
    }

    res.status(200).json({
      success: true,
      data: {
        data,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: data.length
        }
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Data retrieval failed: ${error.message}`
    });
  }
});

export const updateDataSource = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const allowedFields = ['name', 'metadata'];
  const updateData = {};

  Object.keys(req.body).forEach(key => {
    if (allowedFields.includes(key)) {
      updateData[key] = req.body[key];
    }
  });

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({
      success: false,
      error: 'No valid fields provided for update'
    });
  }

  const dataSource = await DataSource.update(id, req.user.id, updateData);

  if (!dataSource) {
    return res.status(404).json({
      success: false,
      error: 'Data source not found or not authorized'
    });
  }

  res.status(200).json({
    success: true,
    data: { dataSource }
  });
});

export const deleteDataSource = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const dataSource = await DataSource.findById(id);
  if (!dataSource) {
    return res.status(404).json({
      success: false,
      error: 'Data source not found'
    });
  }

  if (dataSource.user_id !== req.user.id) {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to delete this data source'
    });
  }

  if (dataSource.file_path && fs.existsSync(dataSource.file_path)) {
    fs.unlinkSync(dataSource.file_path);
  }

  await DataSource.delete(id, req.user.id);

  res.status(200).json({
    success: true,
    message: 'Data source deleted successfully'
  });
});

export const getPublicDataSources = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const result = await DataSource.getPublicDataSources(page, limit);

  res.status(200).json({
    success: true,
    data: result
  });
});