import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Save,
  Download,
  Upload,
  Settings,
  Trash2,
  Plus,
  Filter,
  ArrowUpDown,
  Group,
  Merge,
  Calculator,
  Shuffle,
  RotateCcw,
  Database,
  FileText,
  Zap,
  Eye,
  Edit,
  Copy
} from 'lucide-react';
import { etlPipelineEngine } from '../../services/etlPipeline';

interface Node {
  id: string;
  type: string;
  name: string;
  position: { x: number; y: number };
  data: any;
}

interface Connection {
  id: string;
  source: string;
  target: string;
}

const NODE_TYPES = {
  filter: { icon: Filter, color: 'blue', name: 'Filter' },
  sort: { icon: ArrowUpDown, color: 'green', name: 'Sort' },
  group: { icon: Group, color: 'purple', name: 'Group By' },
  join: { icon: Merge, color: 'orange', name: 'Join' },
  aggregate: { icon: Calculator, color: 'red', name: 'Aggregate' },
  clean: { icon: RotateCcw, color: 'cyan', name: 'Clean' },
  calculate: { icon: Calculator, color: 'indigo', name: 'Calculate' },
  pivot: { icon: Shuffle, color: 'pink', name: 'Pivot' }
};

const ETLNode: React.FC<{
  node: Node;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onMove: (position: { x: number; y: number }) => void;
}> = ({ node, isSelected, onSelect, onDelete, onMove }) => {
  const nodeType = NODE_TYPES[node.type as keyof typeof NODE_TYPES];
  const Icon = nodeType?.icon || Database;
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - node.position.x,
      y: e.clientY - node.position.y
    });
    onSelect();
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      onMove({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  }, [isDragging, dragStart, onMove]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <motion.div
      className={`absolute bg-white rounded-lg shadow-lg border-2 cursor-move select-none ${
        isSelected ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
      }`}
      style={{
        left: node.position.x,
        top: node.position.y,
        width: 180,
        zIndex: isSelected ? 10 : 1
      }}
      onMouseDown={handleMouseDown}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Header */}
      <div className={`p-3 rounded-t-lg bg-${nodeType?.color}-50 border-b border-gray-200`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon className={`h-4 w-4 text-${nodeType?.color}-600`} />
            <span className="font-medium text-gray-900 text-sm">{node.name}</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-3">
        <div className="text-xs text-gray-600 mb-2">
          {nodeType?.name || 'Unknown'} Operation
        </div>
        
        {/* Input/Output Ports */}
        <div className="flex justify-between items-center">
          <div className="flex flex-col space-y-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full" title="Input" />
          </div>
          <div className="flex flex-col space-y-1">
            <div className="w-2 h-2 bg-green-400 rounded-full" title="Output" />
          </div>
        </div>
      </div>

      {/* Connection Points */}
      <div className="absolute left-0 top-1/2 w-2 h-2 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute right-0 top-1/2 w-2 h-2 bg-green-500 rounded-full transform translate-x-1/2 -translate-y-1/2" />
    </motion.div>
  );
};

const ETLPipelineBuilder: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [showNodeLibrary, setShowNodeLibrary] = useState(true);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Sample data for demonstration
  const sampleData = [
    { id: 1, name: 'John Doe', age: 30, department: 'Engineering', salary: 75000 },
    { id: 2, name: 'Jane Smith', age: 28, department: 'Marketing', salary: 65000 },
    { id: 3, name: 'Bob Johnson', age: 35, department: 'Engineering', salary: 85000 },
    { id: 4, name: 'Alice Brown', age: 32, department: 'Sales', salary: 70000 },
    { id: 5, name: 'Charlie Wilson', age: 29, department: 'Marketing', salary: 60000 }
  ];

  const addNode = (nodeType: string) => {
    const newNode: Node = {
      id: `node_${Date.now()}`,
      type: nodeType,
      name: NODE_TYPES[nodeType as keyof typeof NODE_TYPES]?.name || nodeType,
      position: { 
        x: Math.random() * 300 + 100, 
        y: Math.random() * 200 + 100 
      },
      data: {}
    };
    
    setNodes([...nodes, newNode]);
  };

  const deleteNode = (nodeId: string) => {
    setNodes(nodes.filter(n => n.id !== nodeId));
    setConnections(connections.filter(c => c.source !== nodeId && c.target !== nodeId));
    if (selectedNode === nodeId) {
      setSelectedNode(null);
    }
  };

  const moveNode = (nodeId: string, position: { x: number; y: number }) => {
    setNodes(nodes.map(n => 
      n.id === nodeId ? { ...n, position } : n
    ));
  };

  const executePipeline = async () => {
    setIsExecuting(true);
    
    try {
      // Create a pipeline
      const pipeline = etlPipelineEngine.createPipeline('Test Pipeline');
      
      // Add sample data source
      const dataSource = {
        id: 'sample_data',
        name: 'Sample Employee Data',
        type: 'manual' as const,
        columns: [
          { name: 'id', type: 'number' as const, nullable: false, unique: true },
          { name: 'name', type: 'string' as const, nullable: false, unique: false },
          { name: 'age', type: 'number' as const, nullable: false, unique: false },
          { name: 'department', type: 'string' as const, nullable: false, unique: false },
          { name: 'salary', type: 'number' as const, nullable: false, unique: false }
        ],
        data: sampleData,
        metadata: {
          rowCount: sampleData.length,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          source: 'manual_input'
        }
      };

      pipeline.dataSources.push(dataSource);

      // Add nodes to pipeline
      for (const node of nodes) {
        etlPipelineEngine.addTransformNode(pipeline.id, node.type as any, node.position);
      }

      // Execute pipeline (simplified - in reality, you'd need proper node configuration)
      const results = await etlPipelineEngine.executePipeline(pipeline.id);
      
      console.log('Pipeline execution results:', results);
      
      // Show results in a modal or side panel
      alert(`Pipeline executed successfully! Processed ${results.length} datasets.`);
      
    } catch (error) {
      console.error('Pipeline execution failed:', error);
      alert('Pipeline execution failed. Check console for details.');
    } finally {
      setIsExecuting(false);
    }
  };

  const savePipeline = () => {
    const pipelineData = {
      nodes,
      connections,
      metadata: {
        name: 'My ETL Pipeline',
        createdAt: new Date().toISOString()
      }
    };
    
    // Save to localStorage for demo
    localStorage.setItem('etl_pipeline', JSON.stringify(pipelineData));
    alert('Pipeline saved successfully!');
  };

  const loadPipeline = () => {
    const saved = localStorage.getItem('etl_pipeline');
    if (saved) {
      const pipelineData = JSON.parse(saved);
      setNodes(pipelineData.nodes || []);
      setConnections(pipelineData.connections || []);
      alert('Pipeline loaded successfully!');
    } else {
      alert('No saved pipeline found.');
    }
  };

  return (
    <div className="flex h-full bg-gray-50">
      {/* Node Library Sidebar */}
      {showNodeLibrary && (
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          className="w-80 bg-white border-r border-gray-200 flex flex-col"
        >
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Transformation Nodes</h3>
              <button
                onClick={() => setShowNodeLibrary(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <p className="text-sm text-gray-600">Drag and drop nodes to build your ETL pipeline</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-3">
              {Object.entries(NODE_TYPES).map(([type, config]) => {
                const Icon = config.icon;
                return (
                  <motion.div
                    key={type}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => addNode(type)}
                    className={`p-3 rounded-lg border-2 border-dashed border-${config.color}-300 hover:border-${config.color}-400 cursor-pointer transition-colors bg-${config.color}-50`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`h-5 w-5 text-${config.color}-600`} />
                      <div>
                        <p className="font-medium text-gray-900">{config.name}</p>
                        <p className="text-xs text-gray-600">Click to add to canvas</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Sample Data Preview */}
            <div className="mt-6 p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Sample Data Preview</h4>
              <div className="text-xs text-gray-600 space-y-1">
                <p>• 5 employee records</p>
                <p>• Columns: ID, Name, Age, Department, Salary</p>
                <p>• Ready for transformation</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-blue-600" />
                <h1 className="text-xl font-semibold text-gray-900">ETL Pipeline Builder</h1>
              </div>
              {!showNodeLibrary && (
                <button
                  onClick={() => setShowNodeLibrary(true)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Show Node Library
                </button>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={loadPipeline}
                className="flex items-center px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Upload className="h-4 w-4 mr-2" />
                Load
              </button>
              <button
                onClick={savePipeline}
                className="flex items-center px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={executePipeline}
                disabled={isExecuting || nodes.length === 0}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExecuting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Executing...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Execute Pipeline
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div 
          ref={canvasRef}
          className="flex-1 relative overflow-hidden bg-gray-100"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,.05) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        >
          {/* Nodes */}
          {nodes.map(node => (
            <ETLNode
              key={node.id}
              node={node}
              isSelected={selectedNode === node.id}
              onSelect={() => setSelectedNode(node.id)}
              onDelete={() => deleteNode(node.id)}
              onMove={(position) => moveNode(node.id, position)}
            />
          ))}

          {/* Empty State */}
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Build Your ETL Pipeline</h3>
                <p className="text-gray-600 mb-4">
                  Add transformation nodes from the sidebar to get started
                </p>
                <button
                  onClick={() => setShowNodeLibrary(true)}
                  className="flex items-center mx-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Open Node Library
                </button>
              </div>
            </div>
          )}

          {/* Node Count Indicator */}
          {nodes.length > 0 && (
            <div className="absolute top-4 right-4 bg-white rounded-lg shadow-sm border border-gray-200 p-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Zap className="h-4 w-4" />
                <span>{nodes.length} nodes</span>
              </div>
            </div>
          )}
        </div>

        {/* Properties Panel */}
        {selectedNode && (
          <motion.div
            initial={{ y: 300 }}
            animate={{ y: 0 }}
            className="bg-white border-t border-gray-200 p-4 h-64"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Node Properties</h3>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Node Name
                </label>
                <input
                  type="text"
                  value={nodes.find(n => n.id === selectedNode)?.name || ''}
                  onChange={(e) => {
                    setNodes(nodes.map(n => 
                      n.id === selectedNode ? { ...n, name: e.target.value } : n
                    ));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Node Type
                </label>
                <p className="text-sm text-gray-600">
                  {NODE_TYPES[nodes.find(n => n.id === selectedNode)?.type as keyof typeof NODE_TYPES]?.name || 'Unknown'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Configuration
                </label>
                <p className="text-xs text-gray-500">
                  Node configuration would go here (filters, conditions, etc.)
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ETLPipelineBuilder;