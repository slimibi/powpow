interface DataColumn {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  nullable: boolean;
  unique: boolean;
  format?: string;
}

interface DataSource {
  id: string;
  name: string;
  type: 'csv' | 'json' | 'api' | 'database' | 'manual';
  columns: DataColumn[];
  data: Record<string, any>[];
  metadata: {
    rowCount: number;
    createdAt: string;
    updatedAt: string;
    source: string;
  };
}

interface TransformNode {
  id: string;
  type: 'filter' | 'sort' | 'group' | 'join' | 'aggregate' | 'clean' | 'calculate' | 'pivot';
  name: string;
  description: string;
  position: { x: number; y: number };
  config: Record<string, any>;
  inputs: string[];
  outputs: string[];
}

interface ETLPipeline {
  id: string;
  name: string;
  description: string;
  nodes: TransformNode[];
  connections: Array<{
    id: string;
    sourceId: string;
    targetId: string;
    sourcePort: string;
    targetPort: string;
  }>;
  dataSources: DataSource[];
  createdAt: string;
  updatedAt: string;
}

export class ETLPipelineEngine {
  private pipelines: Map<string, ETLPipeline> = new Map();

  // Create a new pipeline
  createPipeline(name: string, description: string = ''): ETLPipeline {
    const pipeline: ETLPipeline = {
      id: `pipeline_${Date.now()}`,
      name,
      description,
      nodes: [],
      connections: [],
      dataSources: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.pipelines.set(pipeline.id, pipeline);
    return pipeline;
  }

  // Add a transform node to the pipeline
  addTransformNode(pipelineId: string, nodeType: TransformNode['type'], position: { x: number; y: number }): TransformNode {
    const pipeline = this.pipelines.get(pipelineId);
    if (!pipeline) throw new Error('Pipeline not found');

    const nodeTemplates = this.getNodeTemplates();
    const template = nodeTemplates[nodeType];
    
    const node: TransformNode = {
      id: `node_${Date.now()}`,
      type: nodeType,
      name: template.name,
      description: template.description,
      position,
      config: { ...template.defaultConfig },
      inputs: [...template.inputs],
      outputs: [...template.outputs]
    };

    pipeline.nodes.push(node);
    pipeline.updatedAt = new Date().toISOString();
    
    return node;
  }

  // Connect two nodes
  connectNodes(pipelineId: string, sourceId: string, targetId: string, sourcePort: string = 'output', targetPort: string = 'input'): void {
    const pipeline = this.pipelines.get(pipelineId);
    if (!pipeline) throw new Error('Pipeline not found');

    const connection = {
      id: `conn_${Date.now()}`,
      sourceId,
      targetId,
      sourcePort,
      targetPort
    };

    pipeline.connections.push(connection);
    pipeline.updatedAt = new Date().toISOString();
  }

  // Execute the pipeline
  async executePipeline(pipelineId: string): Promise<DataSource[]> {
    const pipeline = this.pipelines.get(pipelineId);
    if (!pipeline) throw new Error('Pipeline not found');

    // Build execution graph
    const executionGraph = this.buildExecutionGraph(pipeline);
    
    // Execute nodes in topological order
    const results = new Map<string, DataSource>();
    
    for (const nodeId of executionGraph.executionOrder) {
      const node = pipeline.nodes.find(n => n.id === nodeId);
      if (!node) continue;

      // Get input data
      const inputData = this.getNodeInputData(node, pipeline, results);
      
      // Execute transformation
      const outputData = await this.executeTransformation(node, inputData);
      
      // Store result
      results.set(nodeId, outputData);
    }

    return Array.from(results.values());
  }

  // Get available transformation nodes
  getNodeTemplates(): Record<string, any> {
    return {
      filter: {
        name: 'Filter Rows',
        description: 'Filter data based on conditions',
        inputs: ['input'],
        outputs: ['output'],
        defaultConfig: {
          conditions: [
            { column: '', operator: 'equals', value: '' }
          ]
        }
      },
      sort: {
        name: 'Sort Data',
        description: 'Sort rows by one or more columns',
        inputs: ['input'],
        outputs: ['output'],
        defaultConfig: {
          sortBy: [
            { column: '', direction: 'asc' }
          ]
        }
      },
      group: {
        name: 'Group By',
        description: 'Group data by columns',
        inputs: ['input'],
        outputs: ['output'],
        defaultConfig: {
          groupBy: [],
          aggregations: []
        }
      },
      join: {
        name: 'Join Data',
        description: 'Join two datasets',
        inputs: ['left', 'right'],
        outputs: ['output'],
        defaultConfig: {
          joinType: 'inner',
          leftColumn: '',
          rightColumn: ''
        }
      },
      aggregate: {
        name: 'Aggregate',
        description: 'Calculate aggregations',
        inputs: ['input'],
        outputs: ['output'],
        defaultConfig: {
          aggregations: [
            { column: '', function: 'sum', alias: '' }
          ]
        }
      },
      clean: {
        name: 'Clean Data',
        description: 'Clean and validate data',
        inputs: ['input'],
        outputs: ['output'],
        defaultConfig: {
          operations: [
            { type: 'removeNulls', columns: [] },
            { type: 'removeDuplicates', columns: [] },
            { type: 'trimWhitespace', columns: [] }
          ]
        }
      },
      calculate: {
        name: 'Calculate Column',
        description: 'Add calculated columns',
        inputs: ['input'],
        outputs: ['output'],
        defaultConfig: {
          calculations: [
            { name: '', expression: '', type: 'number' }
          ]
        }
      },
      pivot: {
        name: 'Pivot Table',
        description: 'Pivot data into a cross-tab format',
        inputs: ['input'],
        outputs: ['output'],
        defaultConfig: {
          rowFields: [],
          columnFields: [],
          valueFields: [],
          aggregateFunction: 'sum'
        }
      }
    };
  }

  // Transform operations
  private async executeTransformation(node: TransformNode, inputData: DataSource[]): Promise<DataSource> {
    const input = inputData[0]; // Most transformations work on a single input
    let result = { ...input };

    switch (node.type) {
      case 'filter':
        result.data = this.filterData(input.data, node.config.conditions);
        break;
        
      case 'sort':
        result.data = this.sortData(input.data, node.config.sortBy);
        break;
        
      case 'group':
        result = this.groupData(input, node.config.groupBy, node.config.aggregations);
        break;
        
      case 'join':
        if (inputData.length >= 2) {
          result = this.joinData(inputData[0], inputData[1], node.config);
        }
        break;
        
      case 'aggregate':
        result = this.aggregateData(input, node.config.aggregations);
        break;
        
      case 'clean':
        result.data = this.cleanData(input.data, node.config.operations);
        break;
        
      case 'calculate':
        result = this.calculateColumns(input, node.config.calculations);
        break;
        
      case 'pivot':
        result = this.pivotData(input, node.config);
        break;
    }

    // Update metadata
    result.metadata = {
      ...result.metadata,
      rowCount: result.data.length,
      updatedAt: new Date().toISOString()
    };

    return result;
  }

  // Filter implementation
  private filterData(data: Record<string, any>[], conditions: any[]): Record<string, any>[] {
    return data.filter(row => {
      return conditions.every(condition => {
        const value = row[condition.column];
        const compareValue = condition.value;
        
        switch (condition.operator) {
          case 'equals': return value == compareValue;
          case 'not_equals': return value != compareValue;
          case 'greater_than': return parseFloat(value) > parseFloat(compareValue);
          case 'less_than': return parseFloat(value) < parseFloat(compareValue);
          case 'contains': return String(value).includes(String(compareValue));
          case 'starts_with': return String(value).startsWith(String(compareValue));
          case 'ends_with': return String(value).endsWith(String(compareValue));
          case 'is_null': return value == null || value === '';
          case 'is_not_null': return value != null && value !== '';
          default: return true;
        }
      });
    });
  }

  // Sort implementation
  private sortData(data: Record<string, any>[], sortBy: any[]): Record<string, any>[] {
    return [...data].sort((a, b) => {
      for (const sort of sortBy) {
        const aVal = a[sort.column];
        const bVal = b[sort.column];
        
        let comparison = 0;
        if (aVal < bVal) comparison = -1;
        if (aVal > bVal) comparison = 1;
        
        if (comparison !== 0) {
          return sort.direction === 'desc' ? -comparison : comparison;
        }
      }
      return 0;
    });
  }

  // Group implementation
  private groupData(input: DataSource, groupBy: string[], aggregations: any[]): DataSource {
    const grouped = new Map<string, Record<string, any>[]>();
    
    // Group data
    for (const row of input.data) {
      const key = groupBy.map(col => row[col]).join('|');
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(row);
    }
    
    // Apply aggregations
    const result: Record<string, any>[] = [];
    for (const [key, group] of Array.from(grouped.entries())) {
      const aggregatedRow: Record<string, any> = {};
      
      // Add group by columns
      groupBy.forEach((col, index) => {
        aggregatedRow[col] = key.split('|')[index];
      });
      
      // Apply aggregations
      aggregations.forEach(agg => {
        const values = group.map(row => parseFloat(row[agg.column]) || 0);
        const alias = agg.alias || `${agg.function}_${agg.column}`;
        
        switch (agg.function) {
          case 'sum': aggregatedRow[alias] = values.reduce((a, b) => a + b, 0); break;
          case 'avg': aggregatedRow[alias] = values.reduce((a, b) => a + b, 0) / values.length; break;
          case 'min': aggregatedRow[alias] = Math.min(...values); break;
          case 'max': aggregatedRow[alias] = Math.max(...values); break;
          case 'count': aggregatedRow[alias] = group.length; break;
        }
      });
      
      result.push(aggregatedRow);
    }
    
    return {
      ...input,
      data: result,
      columns: this.inferColumns(result)
    };
  }

  // Join implementation
  private joinData(left: DataSource, right: DataSource, config: any): DataSource {
    const result: Record<string, any>[] = [];
    
    for (const leftRow of left.data) {
      const matches = right.data.filter(rightRow => 
        leftRow[config.leftColumn] === rightRow[config.rightColumn]
      );
      
      if (matches.length > 0 || config.joinType === 'left') {
        for (const match of matches.length > 0 ? matches : [{}]) {
          result.push({ ...leftRow, ...match });
        }
      }
    }
    
    return {
      id: `joined_${Date.now()}`,
      name: `${left.name} ⋈ ${right.name}`,
      type: 'manual' as const,
      data: result,
      columns: this.inferColumns(result),
      metadata: {
        rowCount: result.length,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        source: 'join_operation'
      }
    };
  }

  // Aggregate implementation
  private aggregateData(input: DataSource, aggregations: any[]): DataSource {
    const result: Record<string, any> = {};
    
    aggregations.forEach(agg => {
      const values = input.data.map(row => parseFloat(row[agg.column]) || 0);
      const alias = agg.alias || `${agg.function}_${agg.column}`;
      
      switch (agg.function) {
        case 'sum': result[alias] = values.reduce((a, b) => a + b, 0); break;
        case 'avg': result[alias] = values.reduce((a, b) => a + b, 0) / values.length; break;
        case 'min': result[alias] = Math.min(...values); break;
        case 'max': result[alias] = Math.max(...values); break;
        case 'count': result[alias] = input.data.length; break;
      }
    });
    
    return {
      ...input,
      data: [result],
      columns: this.inferColumns([result])
    };
  }

  // Clean data implementation
  private cleanData(data: Record<string, any>[], operations: any[]): Record<string, any>[] {
    let result = [...data];
    
    for (const operation of operations) {
      switch (operation.type) {
        case 'removeNulls':
          result = result.filter(row => {
            return operation.columns.every((col: string) => 
              row[col] != null && row[col] !== ''
            );
          });
          break;
          
        case 'removeDuplicates':
          const seen = new Set<string>();
          result = result.filter(row => {
            const key = operation.columns.map((col: string) => row[col]).join('|');
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
          break;
          
        case 'trimWhitespace':
          result = result.map(row => {
            const newRow = { ...row };
            operation.columns.forEach((col: string) => {
              if (typeof newRow[col] === 'string') {
                newRow[col] = newRow[col].trim();
              }
            });
            return newRow;
          });
          break;
      }
    }
    
    return result;
  }

  // Calculate columns implementation
  private calculateColumns(input: DataSource, calculations: any[]): DataSource {
    const result = input.data.map(row => {
      const newRow = { ...row };
      
      calculations.forEach(calc => {
        // Simple expression evaluation (in production, use a proper expression parser)
        try {
          const expression = calc.expression.replace(/\[(\w+)\]/g, (match: string, colName: string) => {
            return row[colName] || '0';
          });
          
          // Basic math evaluation (unsafe - use proper parser in production)
          newRow[calc.name] = eval(expression);
        } catch (error) {
          newRow[calc.name] = null;
        }
      });
      
      return newRow;
    });
    
    return {
      ...input,
      data: result,
      columns: this.inferColumns(result)
    };
  }

  // Pivot implementation
  private pivotData(input: DataSource, config: any): DataSource {
    const { rowFields, columnFields, valueFields, aggregateFunction } = config;
    
    // Group by row and column fields
    const pivotMap = new Map<string, Map<string, number[]>>();
    
    input.data.forEach(row => {
      const rowKey = rowFields.map((field: string) => row[field]).join('|');
      const colKey = columnFields.map((field: string) => row[field]).join('|');
      
      if (!pivotMap.has(rowKey)) {
        pivotMap.set(rowKey, new Map());
      }
      
      if (!pivotMap.get(rowKey)!.has(colKey)) {
        pivotMap.get(rowKey)!.set(colKey, []);
      }
      
      valueFields.forEach((field: string) => {
        pivotMap.get(rowKey)!.get(colKey)!.push(parseFloat(row[field]) || 0);
      });
    });
    
    // Build result
    const allColumnKeys = Array.from(new Set(
      Array.from(pivotMap.values()).flatMap(rowMap => Array.from(rowMap.keys()))
    ));
    
    const result: Record<string, any>[] = [];
    
    pivotMap.forEach((rowMap, rowKey) => {
      const resultRow: Record<string, any> = {};
      
      // Add row field values
      rowFields.forEach((field: string, index: number) => {
        resultRow[field] = rowKey.split('|')[index];
      });
      
      // Add pivoted columns
      allColumnKeys.forEach(colKey => {
        const values = rowMap.get(colKey) || [0];
        let aggregatedValue = 0;
        
        switch (aggregateFunction) {
          case 'sum': aggregatedValue = values.reduce((a, b) => a + b, 0); break;
          case 'avg': aggregatedValue = values.reduce((a, b) => a + b, 0) / values.length; break;
          case 'min': aggregatedValue = Math.min(...values); break;
          case 'max': aggregatedValue = Math.max(...values); break;
          case 'count': aggregatedValue = values.length; break;
        }
        
        resultRow[colKey] = aggregatedValue;
      });
      
      result.push(resultRow);
    });
    
    return {
      ...input,
      data: result,
      columns: this.inferColumns(result)
    };
  }

  // Helper methods
  private buildExecutionGraph(pipeline: ETLPipeline): { executionOrder: string[] } {
    // Simple topological sort for execution order
    const visited = new Set<string>();
    const executionOrder: string[] = [];
    
    const visit = (nodeId: string) => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);
      
      // Visit dependencies first
      const dependencies = pipeline.connections
        .filter(conn => conn.targetId === nodeId)
        .map(conn => conn.sourceId);
      
      dependencies.forEach(visit);
      executionOrder.push(nodeId);
    };
    
    pipeline.nodes.forEach(node => visit(node.id));
    
    return { executionOrder };
  }

  private getNodeInputData(node: TransformNode, pipeline: ETLPipeline, results: Map<string, DataSource>): DataSource[] {
    const inputConnections = pipeline.connections.filter(conn => conn.targetId === node.id);
    return inputConnections.map(conn => results.get(conn.sourceId)!).filter(Boolean);
  }

  private inferColumns(data: Record<string, any>[]): DataColumn[] {
    if (data.length === 0) return [];
    
    const sampleRow = data[0];
    return Object.keys(sampleRow).map(key => ({
      name: key,
      type: this.inferColumnType(sampleRow[key]),
      nullable: false,
      unique: false
    }));
  }

  private inferColumnType(value: any): DataColumn['type'] {
    if (typeof value === 'number') return 'number';
    if (typeof value === 'boolean') return 'boolean';
    if (value instanceof Date) return 'date';
    return 'string';
  }

  // Public methods for pipeline management
  getPipeline(id: string): ETLPipeline | undefined {
    return this.pipelines.get(id);
  }

  getAllPipelines(): ETLPipeline[] {
    return Array.from(this.pipelines.values());
  }

  deletePipeline(id: string): boolean {
    return this.pipelines.delete(id);
  }

  updateNode(pipelineId: string, nodeId: string, updates: Partial<TransformNode>): boolean {
    const pipeline = this.pipelines.get(pipelineId);
    if (!pipeline) return false;
    
    const nodeIndex = pipeline.nodes.findIndex(n => n.id === nodeId);
    if (nodeIndex === -1) return false;
    
    pipeline.nodes[nodeIndex] = { ...pipeline.nodes[nodeIndex], ...updates };
    pipeline.updatedAt = new Date().toISOString();
    
    return true;
  }
}

// Singleton instance
export const etlPipelineEngine = new ETLPipelineEngine();