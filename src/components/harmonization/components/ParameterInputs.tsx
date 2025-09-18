import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { DATA_TYPES, REDUCE_OPERATIONS } from '../constants';
import { Parameters } from '../types';

interface ParameterInputsProps {
  primitive: string;
  parameters: Parameters;
  onUpdateParameter: (key: keyof Parameters, value: any) => void;
}

export function ParameterInputs({ primitive, parameters, onUpdateParameter }: ParameterInputsProps) {
  const addMappingRow = () => {
    const current = parameters.mappingTable || [];
    onUpdateParameter('mappingTable', [...current, { key: '', value: '' }]);
  };

  const removeMappingRow = (index: number) => {
    const current = parameters.mappingTable || [];
    onUpdateParameter('mappingTable', current.filter((_, i) => i !== index));
  };

  const updateMappingRow = (index: number, field: 'key' | 'value', value: string) => {
    const current = parameters.mappingTable || [];
    const updated = current.map((row, i) => 
      i === index ? { ...row, [field]: value } : row
    );
    onUpdateParameter('mappingTable', updated);
  };

  const addBinRow = () => {
    const current = parameters.binRows || [];
    onUpdateParameter('binRows', [...current, { lower: '', upper: '', label: '' }]);
  };

  const removeBinRow = (index: number) => {
    const current = parameters.binRows || [];
    onUpdateParameter('binRows', current.filter((_, i) => i !== index));
  };

  const updateBinRow = (index: number, field: 'lower' | 'upper' | 'label', value: string) => {
    const current = parameters.binRows || [];
    const updated = current.map((row, i) => 
      i === index ? { ...row, [field]: value } : row
    );
    onUpdateParameter('binRows', updated);
  };

  switch (primitive) {
    case 'ConvertUnits':
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#cccccc] mb-2">Source unit</label>
            <input
              type="text"
              value={parameters.sourceUnit || ''}
              onChange={(e) => onUpdateParameter('sourceUnit', e.target.value)}
              placeholder="meters"
              className="w-full px-3 py-2 bg-[#3c3c3c] border border-[#4c4c4c] rounded text-[#cccccc] text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#cccccc] mb-2">Target unit</label>
            <input
              type="text"
              value={parameters.targetUnit || ''}
              onChange={(e) => onUpdateParameter('targetUnit', e.target.value)}
              placeholder="kilometers"
              className="w-full px-3 py-2 bg-[#3c3c3c] border border-[#4c4c4c] rounded text-[#cccccc] text-sm"
            />
          </div>
        </div>
      );

    case 'Truncate':
      return (
        <div>
          <label className="block text-sm font-medium text-[#cccccc] mb-2">Max length</label>
          <input
            type="number"
            value={parameters.maxLength || ''}
            onChange={(e) => onUpdateParameter('maxLength', parseInt(e.target.value) || 0)}
            placeholder="3"
            className="w-full px-3 py-2 bg-[#3c3c3c] border border-[#4c4c4c] rounded text-[#cccccc] text-sm"
          />
        </div>
      );

    case 'Cast':
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#cccccc] mb-2">Source type</label>
            <select
              value={parameters.sourceType || ''}
              onChange={(e) => onUpdateParameter('sourceType', e.target.value)}
              className="w-full px-3 py-2 bg-[#3c3c3c] border border-[#4c4c4c] rounded text-[#cccccc] text-sm"
            >
              {DATA_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#cccccc] mb-2">Target type</label>
            <select
              value={parameters.targetType || ''}
              onChange={(e) => onUpdateParameter('targetType', e.target.value)}
              className="w-full px-3 py-2 bg-[#3c3c3c] border border-[#4c4c4c] rounded text-[#cccccc] text-sm"
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
          <label className="block text-sm font-medium text-[#cccccc] mb-2">Mapping table</label>
          <div className="space-y-3">
            {(parameters.mappingTable || []).map((row, index) => (
              <div key={index} className="flex gap-3 items-center">
                <input
                  type="text"
                  value={row.key}
                  onChange={(e) => updateMappingRow(index, 'key', e.target.value)}
                  placeholder="Key"
                  className="flex-1 px-3 py-2 bg-[#3c3c3c] border border-[#4c4c4c] rounded text-[#cccccc] text-sm"
                />
                <span className="text-[#808080] text-sm">→</span>
                <input
                  type="text"
                  value={row.value}
                  onChange={(e) => updateMappingRow(index, 'value', e.target.value)}
                  placeholder="Value"
                  className="flex-1 px-3 py-2 bg-[#3c3c3c] border border-[#4c4c4c] rounded text-[#cccccc] text-sm"
                />
                <button
                  onClick={() => removeMappingRow(index)}
                  className="p-2 text-red-500 hover:text-red-700"
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={addMappingRow}
              className="flex items-center gap-2 px-3 py-2 text-[#007fd4] hover:text-[#005fa3] text-sm"
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
          <label className="block text-sm font-medium text-[#cccccc] mb-2">Bin ranges</label>
          <div className="space-y-3">
            {(parameters.binRows || []).map((row, index) => (
              <div key={index} className="flex gap-3 items-center">
                <input
                  type="text"
                  value={row.lower}
                  onChange={(e) => updateBinRow(index, 'lower', e.target.value)}
                  placeholder="Lower"
                  className="w-20 px-3 py-2 bg-[#3c3c3c] border border-[#4c4c4c] rounded text-[#cccccc] text-sm"
                />
                <span className="text-[#808080] text-sm">-</span>
                <input
                  type="text"
                  value={row.upper}
                  onChange={(e) => updateBinRow(index, 'upper', e.target.value)}
                  placeholder="Upper"
                  className="w-20 px-3 py-2 bg-[#3c3c3c] border border-[#4c4c4c] rounded text-[#cccccc] text-sm"
                />
                <span className="text-[#808080] text-sm">→</span>
                <input
                  type="text"
                  value={row.label}
                  onChange={(e) => updateBinRow(index, 'label', e.target.value)}
                  placeholder="Label"
                  className="flex-1 px-3 py-2 bg-[#3c3c3c] border border-[#4c4c4c] rounded text-[#cccccc] text-sm"
                />
                <button
                  onClick={() => removeBinRow(index)}
                  className="p-2 text-red-500 hover:text-red-700"
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={addBinRow}
              className="flex items-center gap-2 px-3 py-2 text-[#007fd4] hover:text-[#005fa3] text-sm"
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
          <label className="block text-sm font-medium text-[#cccccc] mb-2">Operation</label>
          <select
            value={parameters.operation || ''}
            onChange={(e) => onUpdateParameter('operation', e.target.value)}
            className="w-full px-3 py-2 bg-[#3c3c3c] border border-[#4c4c4c] rounded text-[#cccccc] text-sm"
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
            <label className="block text-sm font-medium text-[#cccccc] mb-2">Source format</label>
            <input
              type="text"
              value={parameters.sourceFormat || ''}
              onChange={(e) => onUpdateParameter('sourceFormat', e.target.value)}
              placeholder="%m/%d/%Y"
              className="w-full px-3 py-2 bg-[#3c3c3c] border border-[#4c4c4c] rounded text-[#cccccc] text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#cccccc] mb-2">Target format</label>
            <input
              type="text"
              value={parameters.targetFormat || ''}
              onChange={(e) => onUpdateParameter('targetFormat', e.target.value)}
              placeholder="%Y-%m-%d"
              className="w-full px-3 py-2 bg-[#3c3c3c] border border-[#4c4c4c] rounded text-[#cccccc] text-sm"
            />
          </div>
        </div>
      );

    case 'Round':
      return (
        <div>
          <label className="block text-sm font-medium text-[#cccccc] mb-2">Precision</label>
          <input
            type="number"
            value={parameters.precision || ''}
            onChange={(e) => onUpdateParameter('precision', parseInt(e.target.value) || 0)}
            placeholder="2"
            className="w-full px-3 py-2 bg-[#3c3c3c] border border-[#4c4c4c] rounded text-[#cccccc] text-sm"
          />
        </div>
      );

    case 'Threshold':
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#cccccc] mb-2">Lower bound</label>
            <input
              type="number"
              value={parameters.lowerBound || ''}
              onChange={(e) => onUpdateParameter('lowerBound', parseInt(e.target.value) || 0)}
              placeholder="0"
              className="w-full px-3 py-2 bg-[#3c3c3c] border border-[#4c4c4c] rounded text-[#cccccc] text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#cccccc] mb-2">Upper bound</label>
            <input
              type="number"
              value={parameters.upperBound || ''}
              onChange={(e) => onUpdateParameter('upperBound', parseInt(e.target.value) || 0)}
              placeholder="10"
              className="w-full px-3 py-2 bg-[#3c3c3c] border border-[#4c4c4c] rounded text-[#cccccc] text-sm"
            />
          </div>
        </div>
      );

    default:
      return null;
  }
}