import React from 'react';
import { AlertTriangle, Settings } from 'lucide-react';
import { PRIMITIVES } from '../constants';
import { ParameterInputs } from './ParameterInputs';
import { getExample } from '../utils';
import { HarmonizationState, HarmonizationStep, Parameters } from '../types';

interface StepConfigurationProps {
  state: HarmonizationState;
  actions: {
    setSelectedStep: (step: any) => void;
    updateStepParameters: (primitive: string, parameters: any) => void;
  };
}

export function StepConfiguration({ state, actions }: StepConfigurationProps) {
  // Get the selected step from the state
  const selectedStep = state.selectedStep;
  const selectedPrimitive = selectedStep?.primitive || '';
  const parameters = selectedStep?.parameters || {};
  const harmonizationSteps = state.selectedRow?.harmonizationSteps || [];
  const hasTargetElement = state.selectedRow && state.selectedRow.target && !state.selectedRow.hasError;

  const handlePrimitiveChange = (primitive: string) => {
    let newParameters: Parameters = {};
    
    // Reset parameters based on primitive and context
    switch (primitive) {
      case 'ConvertUnits':
        newParameters = { sourceUnit: 'meters', targetUnit: 'kilometers' };
        break;
      case 'Truncate':
        newParameters = { maxLength: 3 };
        break;
      case 'Cast':
        newParameters = { sourceType: 'string', targetType: 'integer' };
        break;
      case 'EnumToEnum':
        newParameters = { mappingTable: [{ key: '1', value: '0' }] };
        break;
      case 'Bin':
        newParameters = { binRows: [{ lower: 'MIN', upper: '99', label: 'normal' }] };
        break;
      case 'Reduce':
        newParameters = { operation: 'sum' };
        break;
      case 'ConvertDate':
        newParameters = { sourceFormat: '%m/%d/%Y', targetFormat: '%Y-%m-%d' };
        break;
      case 'Round':
        newParameters = { precision: 2 };
        break;
      case 'Threshold':
        newParameters = { lowerBound: 0, upperBound: 10 };
        break;
    }
    
    actions.updateStepParameters(primitive, newParameters);
  };

  const updateParameter = (key: keyof Parameters, value: any) => {
    actions.updateStepParameters(selectedPrimitive, { ...parameters, [key]: value });
  };

  return (
    <div className="h-full flex flex-col bg-[#252526]">
      {/* Header */}
      <div className="bg-[#2d2d30] p-3 border-b border-[#3c3c3c] flex-shrink-0">
        <h3 className="text-[#cccccc] font-medium text-sm flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Step Configuration
        </h3>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {!state.selectedRow ? (
          /* No Row Selected State */
          <div className="h-full flex flex-col items-center justify-center text-[#808080] text-center p-8">
            <div className="text-[#cccccc] text-base mb-2">No Row Selected</div>
            <div className="text-[#606060] text-sm">Select a data row to configure transformation steps</div>
          </div>
        ) : !hasTargetElement ? (
          /* No Target Element Selected State */
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="flex items-center justify-center w-12 h-12 bg-[#ff6b35] bg-opacity-20 rounded-full mb-3">
              <AlertTriangle className="w-6 h-6 text-[#ff6b35]" />
            </div>
            <div className="text-[#cccccc] text-sm mb-2">Target Required</div>
            <div className="text-[#606060] text-xs max-w-xs leading-relaxed">
              Select a target data element first to configure transformation steps
            </div>
          </div>
        ) : !selectedStep ? (
          /* No Step Selected State */
          <div className="h-full flex flex-col items-center justify-center text-[#808080] text-center p-8">
            <div className="text-[#cccccc] text-base mb-2">No Step Selected</div>
            <div className="text-[#606060] text-sm">Select a transformation step from the harmonization rules to configure its parameters</div>
          </div>
        ) : (
          /* Normal Configuration State */
          <div className="p-4">
            <div className="text-[#cccccc] font-medium text-sm mb-4">
              Configure Step {harmonizationSteps.findIndex(s => s.id === selectedStep.id) + 1}
            </div>
            
            {/* Primitive Selector */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-[#cccccc] mb-2">Primitive</label>
              <select
                value={selectedPrimitive}
                onChange={(e) => handlePrimitiveChange(e.target.value)}
                className="w-full px-3 py-2 bg-[#3c3c3c] border border-[#4c4c4c] rounded text-[#cccccc] text-sm"
              >
                <option value="">Select transformation...</option>
                {PRIMITIVES.map(primitive => (
                  <option key={primitive} value={primitive}>{primitive}</option>
                ))}
              </select>
            </div>

            {/* Parameters */}
            {selectedPrimitive && (
              <div className="mb-5">
                <label className="block text-sm font-medium text-[#cccccc] mb-3">Parameters</label>
                <ParameterInputs 
                  primitive={selectedPrimitive}
                  parameters={parameters}
                  onUpdateParameter={updateParameter}
                />
              </div>
            )}

            {/* Example */}
            {selectedPrimitive && (
              <div>
                <label className="block text-sm font-medium text-[#cccccc] mb-2">Example</label>
                <div className="bg-[#2d2d30] border border-[#4c4c4c] rounded p-3">
                  <code className="text-sm text-[#4ec9b0] font-mono">
                    {getExample(selectedPrimitive, parameters)}
                  </code>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}