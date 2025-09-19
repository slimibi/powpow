import fs from 'fs';
import csv from 'csv-parser';
import XLSX from 'xlsx';
import path from 'path';

export class DataProcessor {
  static async processCSV(filePath) {
    return new Promise((resolve, reject) => {
      const results = [];
      const columns = [];
      let isFirstRow = true;

      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => {
          if (isFirstRow) {
            Object.keys(data).forEach(key => {
              columns.push({
                name: key,
                type: this.inferDataType(data[key]),
                nullable: true
              });
            });
            isFirstRow = false;
          }
          results.push(data);
        })
        .on('end', () => {
          resolve({
            data: results,
            columns: columns,
            rowCount: results.length,
            type: 'csv'
          });
        })
        .on('error', (error) => {
          reject(new Error(`CSV processing error: ${error.message}`));
        });
    });
  }

  static async processExcel(filePath) {
    try {
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      if (jsonData.length === 0) {
        throw new Error('Excel file is empty or has no data');
      }

      const columns = Object.keys(jsonData[0]).map(key => ({
        name: key,
        type: this.inferDataType(jsonData[0][key]),
        nullable: true
      }));

      return {
        data: jsonData,
        columns: columns,
        rowCount: jsonData.length,
        type: 'excel',
        sheetNames: workbook.SheetNames
      };
    } catch (error) {
      throw new Error(`Excel processing error: ${error.message}`);
    }
  }

  static async processJSON(filePath) {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const jsonData = JSON.parse(fileContent);
      
      let data, columns;

      if (Array.isArray(jsonData)) {
        data = jsonData;
        if (data.length > 0) {
          columns = Object.keys(data[0]).map(key => ({
            name: key,
            type: this.inferDataType(data[0][key]),
            nullable: true
          }));
        } else {
          columns = [];
        }
      } else {
        data = [jsonData];
        columns = Object.keys(jsonData).map(key => ({
          name: key,
          type: this.inferDataType(jsonData[key]),
          nullable: true
        }));
      }

      return {
        data: data,
        columns: columns,
        rowCount: data.length,
        type: 'json'
      };
    } catch (error) {
      throw new Error(`JSON processing error: ${error.message}`);
    }
  }

  static inferDataType(value) {
    if (value === null || value === undefined || value === '') {
      return 'string';
    }

    if (typeof value === 'boolean') {
      return 'boolean';
    }

    if (typeof value === 'number') {
      return Number.isInteger(value) ? 'integer' : 'decimal';
    }

    if (typeof value === 'string') {
      if (!isNaN(Date.parse(value)) && value.length > 8) {
        return 'datetime';
      }
      
      if (!isNaN(value) && !isNaN(parseFloat(value))) {
        return value.includes('.') ? 'decimal' : 'integer';
      }
    }

    return 'string';
  }

  static async processFile(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    
    switch (ext) {
      case '.csv':
        return await this.processCSV(filePath);
      case '.xlsx':
      case '.xls':
        return await this.processExcel(filePath);
      case '.json':
        return await this.processJSON(filePath);
      default:
        throw new Error(`Unsupported file type: ${ext}`);
    }
  }

  static validateData(data, columns) {
    const errors = [];
    
    if (!Array.isArray(data) || data.length === 0) {
      errors.push('Data must be a non-empty array');
      return errors;
    }

    data.forEach((row, index) => {
      columns.forEach(column => {
        const value = row[column.name];
        
        if (!column.nullable && (value === null || value === undefined || value === '')) {
          errors.push(`Row ${index + 1}: ${column.name} cannot be null`);
        }

        if (value !== null && value !== undefined && value !== '') {
          const actualType = this.inferDataType(value);
          if (actualType !== column.type && column.type !== 'string') {
            errors.push(`Row ${index + 1}: ${column.name} expected ${column.type}, got ${actualType}`);
          }
        }
      });
    });

    return errors;
  }

  static transformData(data, transformations = {}) {
    if (!transformations || Object.keys(transformations).length === 0) {
      return data;
    }

    return data.map(row => {
      const transformedRow = { ...row };
      
      Object.entries(transformations).forEach(([column, transformation]) => {
        if (transformedRow[column] !== undefined) {
          switch (transformation.type) {
            case 'uppercase':
              transformedRow[column] = String(transformedRow[column]).toUpperCase();
              break;
            case 'lowercase':
              transformedRow[column] = String(transformedRow[column]).toLowerCase();
              break;
            case 'trim':
              transformedRow[column] = String(transformedRow[column]).trim();
              break;
            case 'multiply':
              if (!isNaN(transformedRow[column])) {
                transformedRow[column] = parseFloat(transformedRow[column]) * (transformation.factor || 1);
              }
              break;
            case 'date_format':
              const date = new Date(transformedRow[column]);
              if (!isNaN(date.getTime())) {
                transformedRow[column] = date.toISOString().split('T')[0];
              }
              break;
          }
        }
      });

      return transformedRow;
    });
  }

  static aggregateData(data, groupBy, aggregations) {
    if (!groupBy || !aggregations) return data;

    const grouped = {};
    
    data.forEach(row => {
      const key = Array.isArray(groupBy) 
        ? groupBy.map(field => row[field]).join('|')
        : row[groupBy];
      
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(row);
    });

    return Object.entries(grouped).map(([key, group]) => {
      const result = {};
      
      if (Array.isArray(groupBy)) {
        groupBy.forEach((field, index) => {
          result[field] = key.split('|')[index];
        });
      } else {
        result[groupBy] = key;
      }

      Object.entries(aggregations).forEach(([field, aggType]) => {
        const values = group.map(row => parseFloat(row[field])).filter(v => !isNaN(v));
        
        switch (aggType) {
          case 'sum':
            result[`${field}_sum`] = values.reduce((sum, val) => sum + val, 0);
            break;
          case 'avg':
            result[`${field}_avg`] = values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0;
            break;
          case 'count':
            result[`${field}_count`] = group.length;
            break;
          case 'min':
            result[`${field}_min`] = values.length > 0 ? Math.min(...values) : 0;
            break;
          case 'max':
            result[`${field}_max`] = values.length > 0 ? Math.max(...values) : 0;
            break;
        }
      });

      return result;
    });
  }
}