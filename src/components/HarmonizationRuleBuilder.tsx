import React, { useState, useEffect } from 'react';
import { Plus, Minus } from 'lucide-react';

interface MappingRow {
  key: string;
  value: string;
}

interface BinRow {
  lower: string;
  upper: string;
  label: string;
}

interface Parameters {
  // ConvertUnits
  sourceUnit?: string;
  targetUnit?: string;
  
  // Truncate
  maxLength?: number;
  
  // Cast
  sourceType?: string;
  targetType?: string;
  
  // EnumToEnum
  mappingTable?: MappingRow[];
  
  // Bin
  binRows?: BinRow[];
  
  // Reduce
  operation?: string;
  
  // ConvertDate
  sourceFormat?: string;
  targetFormat?: string;
  
  // Round
  precision?: number;
  
  // Threshold
  lowerBound?: number;
  upperBound?: number;
}

interface HarmonizationStep {
  id: number;
  primitive: string;
  parameters: Record<string, any>;
}

interface SelectedStepContext {
  step: HarmonizationStep;
  sourceElement: string;
  sourceType: string;
  targetElement: string;
  targetType: string;
}

interface HarmonizationRuleBuilderProps {
  selectedStep?: SelectedStepContext | null;
  onStepUpdate?: (step: { primitive: string; parameters: Parameters }) => void;
}

const PRIMITIVES = [
  'ConvertUnits',
  'Truncate', 
  'Cast',
  'EnumToEnum',
  'Bin',
  'Reduce',
  'ConvertDate',
  'Round',
  'Threshold'
] as const;

const DATA_TYPES = ['string', 'integer', 'float', 'bool', 'date'];
const REDUCE_OPERATIONS = ['sum', 'any', 'none', 'all', 'one-hot'];

const getExample = (primitive: string, params: Parameters): string => {
  switch (primitive) {
    case 'ConvertUnits':
      return `ConvertUnits(1000) → 1 params: {source: ${params.sourceUnit || 'meters'}, target: ${params.targetUnit || 'kilometers'}}`;
    
    case 'Truncate':
      const length = params.maxLength || 3;
      return `Truncate("94305-2005") → "${'943'.slice(0, length)}" params: {length: ${length}}`;
    
    case 'Cast':
      const sourceType = params.sourceType || 'string';
      const targetType = params.targetType || 'integer';
      let example = 'Cast("1") → 1';
      if (sourceType === 'string' && targetType === 'integer') {
        example = 'Cast("1") → 1';
      } else if (sourceType === 'integer' && targetType === 'string') {
        example = 'Cast(1) → "1"';
      } else if (sourceType === 'string' && targetType === 'bool') {
        example = 'Cast("true") → true';
      }
      return `${example} params: {source: ${sourceType}, target: ${targetType}}`;
    
    case 'EnumToEnum':
      const mappings = params.mappingTable || [];
      const mappingStr = mappings.length > 0 
        ? mappings.map(m => `${m.key} → ${m.value}`).join(', ')
        : '1 → 0, 2 → 1, 3 → 2';
      return `EnumToEnum(2) → 1 params: {mapping: ${mappingStr}}`;
    
    case 'Bin':
      const bins = params.binRows || [];
      const binStr = bins.length > 0
        ? bins.map(b => `[${b.lower}, ${b.upper}] → "${b.label}"`).join(', ')
        : '[MIN, 99] → "normal", [100, 125] → "prediabetes", [126, MAX] → "diabetes"';
      return `Bin(137) → "diabetes" params: {bins: ${binStr}}`;
    
    case 'Reduce':
      const operation = params.operation || 'any';
      return `Reduce([0, 0, 1, 0]) → True params: {operation: ${operation}}`;
    
    case 'ConvertDate':
      const sourceFormat = params.sourceFormat || '%m/%d/%Y';
      const targetFormat = params.targetFormat || '%Y-%m-%d';
      return `ConvertDate("03/14/2025") → "2025-03-14" params: {source: ${sourceFormat}, target: ${targetFormat}}`;
    
    case 'Round':
      const precision = params.precision || 2;
      return `Round(13.226) → 13.${'23'.slice(0, precision)} params: {precision: ${precision}}`;
    
    case 'Threshold':
      const lower = params.lowerBound || 0;
      const upper = params.upperBound || 10;
      return `Threshold(16) → ${upper} params: {lower: ${lower}, upper: ${upper}}`;
    
    default:
      return '';
  }
};

export function HarmonizationRuleBuilder({ selectedStep, onStepUpdate }: HarmonizationRuleBuilderProps) {
  const [selectedPrimitive, setSelectedPrimitive] = useState<string>('');
  const [parameters, setParameters] = useState<Parameters>({});

  // Initialize state when step is selected
  useEffect(() => {
    if (selectedStep) {
      setSelectedPrimitive(selectedStep.step.primitive || '');
      setParameters(selectedStep.step.parameters || {});
    } else {
      setSelectedPrimitive('');
      setParameters({});
    }
  }, [selectedStep]);

  // Notify parent component when rule changes
  useEffect(() => {
    if (onStepUpdate && selectedPrimitive) {
      onStepUpdate({ primitive: selectedPrimitive, parameters });
    }
  }, [selectedPrimitive, parameters, onStepUpdate]);

  const handlePrimitiveChange = (primitive: string) => {
    setSelectedPrimitive(primitive);
    
    // Reset parameters based on primitive and context
    switch (primitive) {
      case 'ConvertUnits':
        setParameters({ sourceUnit: 'meters', targetUnit: 'kilometers' });
        break;
      case 'Truncate':
        setParameters({ maxLength: 3 });
        break;
      case 'Cast':
        setParameters({ 
          sourceType: selectedStep?.sourceType || 'string', 
          targetType: selectedStep?.targetType || 'integer' 
        });
        break;
      case 'EnumToEnum':
        setParameters({ mappingTable: [{ key: '1', value: '0' }] });
        break;
      case 'Bin':
        setParameters({ binRows: [{ lower: 'MIN', upper: '99', label: 'normal' }] });
        break;
      case 'Reduce':
        setParameters({ operation: 'sum' });
        break;
      case 'ConvertDate':
        setParameters({ sourceFormat: '%m/%d/%Y', targetFormat: '%Y-%m-%d' });
        break;
      case 'Round':
        setParameters({ precision: 2 });
        break;
      case 'Threshold':
        setParameters({ lowerBound: 0, upperBound: 10 });
        break;
      default:
        setParameters({});
    }
  };

  const updateParameter = (key: keyof Parameters, value: any) => {
    setParameters(prev => ({ ...prev, [key]: value }));
  };

  const addMappingRow = () => {
    const current = parameters.mappingTable || [];
    updateParameter('mappingTable', [...current, { key: '', value: '' }]);
  };

  const removeMappingRow = (index: number) => {
    const current = parameters.mappingTable || [];
    updateParameter('mappingTable', current.filter((_, i) => i !== index));
  };

  const updateMappingRow = (index: number, field: 'key' | 'value', value: string) => {
    const current = parameters.mappingTable || [];
    const updated = current.map((row, i) => 
      i === index ? { ...row, [field]: value } : row
    );
    updateParameter('mappingTable', updated);
  };

  const addBinRow = () => {
    const current = parameters.binRows || [];
    updateParameter('binRows', [...current, { lower: '', upper: '', label: '' }]);
  };

  const removeBinRow = (index: number) => {
    const current = parameters.binRows || [];
    updateParameter('binRows', current.filter((_, i) => i !== index));
  };

  const updateBinRow = (index: number, field: 'lower' | 'upper' | 'label', value: string) => {
    const current = parameters.binRows || [];
    const updated = current.map((row, i) => 
      i === index ? { ...row, [field]: value } : row
    );
    updateParameter('binRows', updated);
  };

  const renderParameterInputs = () => {
    switch (selectedPrimitive) {
      case 'ConvertUnits':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Source unit</label>
              <input
                type="text"
                value={parameters.sourceUnit || ''}
                onChange={(e) => updateParameter('sourceUnit', e.target.value)}
                placeholder="meters"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Target unit</label>
              <input
                type="text"
                value={parameters.targetUnit || ''}
                onChange={(e) => updateParameter('targetUnit', e.target.value)}
                placeholder="kilometers"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              />
            </div>
          </div>
        );

      case 'Truncate':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Max length</label>
            <input
              type="number"
              value={parameters.maxLength || ''}
              onChange={(e) => updateParameter('maxLength', parseInt(e.target.value) || 0)}
              placeholder="3"
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            />
          </div>
        );

      case 'Cast':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Source type</label>
              <select
                value={parameters.sourceType || ''}
                onChange={(e) => updateParameter('sourceType', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              >
                {DATA_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Target type</label>
              <select
                value={parameters.targetType || ''}
                onChange={(e) => updateParameter('targetType', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              >
                {DATA_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        );

      case 'EnumToEnum':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Mapping table</label>
            <div className="space-y-2">
              {(parameters.mappingTable || []).map((row, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={row.key}
                    onChange={(e) => updateMappingRow(index, 'key', e.target.value)}
                    placeholder="Key"
                    className="flex-1 px-2 py-1 bg-white border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 text-sm"
                  />
                  <span className="text-gray-500">→</span>
                  <input
                    type="text"
                    value={row.value}
                    onChange={(e) => updateMappingRow(index, 'value', e.target.value)}
                    placeholder="Value"
                    className="flex-1 px-2 py-1 bg-white border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 text-sm"
                  />
                  <button
                    onClick={() => removeMappingRow(index)}
                    className="p-1 text-red-500 hover:text-red-700"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={addMappingRow}
                className="flex items-center gap-1 px-2 py-1 text-blue-600 hover:text-blue-800 text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Row
              </button>
            </div>
          </div>
        );

      case 'Bin':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Bin ranges</label>
            <div className="space-y-2">
              {(parameters.binRows || []).map((row, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={row.lower}
                    onChange={(e) => updateBinRow(index, 'lower', e.target.value)}
                    placeholder="Lower"
                    className="w-20 px-2 py-1 bg-white border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 text-sm"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="text"
                    value={row.upper}
                    onChange={(e) => updateBinRow(index, 'upper', e.target.value)}
                    placeholder="Upper"
                    className="w-20 px-2 py-1 bg-white border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 text-sm"
                  />
                  <span className="text-gray-500">→</span>
                  <input
                    type="text"
                    value={row.label}
                    onChange={(e) => updateBinRow(index, 'label', e.target.value)}
                    placeholder="Label"
                    className="flex-1 px-2 py-1 bg-white border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 text-sm"
                  />
                  <button
                    onClick={() => removeBinRow(index)}
                    className="p-1 text-red-500 hover:text-red-700"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={addBinRow}
                className="flex items-center gap-1 px-2 py-1 text-blue-600 hover:text-blue-800 text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Row
              </button>
            </div>
          </div>
        );

      case 'Reduce':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Operation</label>
            <select
              value={parameters.operation || ''}
              onChange={(e) => updateParameter('operation', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            >
              {REDUCE_OPERATIONS.map(op => (
                <option key={op} value={op}>{op}</option>
              ))}
            </select>
          </div>
        );

      case 'ConvertDate':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Source format</label>
              <input
                type="text"
                value={parameters.sourceFormat || ''}
                onChange={(e) => updateParameter('sourceFormat', e.target.value)}
                placeholder="%m/%d/%Y"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Target format</label>
              <input
                type="text"
                value={parameters.targetFormat || ''}
                onChange={(e) => updateParameter('targetFormat', e.target.value)}
                placeholder="%Y-%m-%d"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              />
            </div>
          </div>
        );

      case 'Round':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Precision</label>
            <input
              type="number"
              value={parameters.precision || ''}
              onChange={(e) => updateParameter('precision', parseInt(e.target.value) || 0)}
              placeholder="2"
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            />
          </div>
        );

      case 'Threshold':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Lower bound</label>
              <input
                type="number"
                value={parameters.lowerBound || ''}
                onChange={(e) => updateParameter('lowerBound', parseInt(e.target.value) || 0)}
                placeholder="0"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Upper bound</label>
              <input
                type="number"
                value={parameters.upperBound || ''}
                onChange={(e) => updateParameter('upperBound', parseInt(e.target.value) || 0)}
                placeholder="10"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!selectedStep) {
    return (
      <div className="w-[480px] bg-white p-4 border-l border-gray-200 flex flex-col items-center justify-center min-h-screen">
        <div className="text-center text-gray-500">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No step selected</h3>
          <p className="text-sm">Select a transformation step to configure its harmonization rule</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[480px] bg-white p-4 border-l border-gray-200 flex flex-col space-y-6 min-h-screen">
      {/* Context Header */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Step Configuration</h3>
        <div className="text-sm text-gray-600">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium">Source:</span>
            <span className="font-mono bg-white px-2 py-1 rounded border">{selectedStep.sourceElement}</span>
            <span className="text-gray-400">({selectedStep.sourceType})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Target:</span>
            <span className="font-mono bg-white px-2 py-1 rounded border">{selectedStep.targetElement}</span>
            <span className="text-gray-400">({selectedStep.targetType})</span>
          </div>
        </div>
      </div>
      
      {/* Primitive Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-500 mb-2">Primitive</label>
        <select
          value={selectedPrimitive}
          onChange={(e) => handlePrimitiveChange(e.target.value)}
          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
        >
          <option value="">Select a transformation...</option>
          {PRIMITIVES.map(primitive => (
            <option key={primitive} value={primitive}>{primitive}</option>
          ))}
        </select>
      </div>

      {/* Dynamic Parameters Section */}
      {selectedPrimitive && (
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-3">Parameters</h4>
          {renderParameterInputs()}
        </div>
      )}

      {/* Example Card */}
      {selectedPrimitive && (
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-3">Example</h4>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
            <code className="text-sm text-gray-900 font-mono whitespace-pre-wrap break-all">
              {getExample(selectedPrimitive, parameters)}
            </code>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4 border-t border-gray-200 mt-auto">
        <button 
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300"
          disabled={!selectedPrimitive}
        >
          Apply Changes
        </button>
        <button 
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          onClick={() => {
            setSelectedPrimitive('');
            setParameters({});
          }}
        >
          Clear
        </button>
      </div>
    </div>
  );
}