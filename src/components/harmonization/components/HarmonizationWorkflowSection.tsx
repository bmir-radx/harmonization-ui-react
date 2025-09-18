import React from 'react';
import { Save, AlertTriangle } from 'lucide-react';
import { WorkflowVisualization } from './WorkflowVisualization';
import { HarmonizationState } from '../types';

interface HarmonizationWorkflowSectionProps {
  state: HarmonizationState;
  actions: {
    setSelectedStep: (step: any) => void;
    addHarmonizationStep: (rowId: string) => void;
    removeHarmonizationStep: (rowId: string, stepId: number) => void;
    updateStepParameters: (primitive: string, parameters: any) => void;
    handleSaveRule: () => void;
  };
}

export function HarmonizationWorkflowSection({ state, actions }: HarmonizationWorkflowSectionProps) {
  const harmonizationSteps = state.selectedRow ? state.harmonizationStepsByRow[state.selectedRow.id] || [] : [];
  const hasTargetElement = state.selectedRow && state.selectedRow.target && !state.selectedRow.hasError;

  return (
    <div className="h-full flex flex-col bg-[#252526]">
      {/* Header */}
      <div className="bg-[#2d2d30] p-3 border-b border-[#3c3c3c] flex items-center justify-between flex-shrink-0">
        <h3 className="text-[#cccccc] font-medium text-sm">Harmonization Rules</h3>
        {state.selectedRow && hasTargetElement && (
          <button 
            className="bg-[#4CAF50] text-white border-none rounded px-3 py-1.5 cursor-pointer text-sm flex items-center gap-1.5 hover:bg-[#45a049] disabled:bg-[#666] disabled:cursor-not-allowed"
            onClick={actions.handleSaveRule}
            disabled={!harmonizationSteps.some(step => step.primitive)}
          >
            <Save className="w-3 h-3" />
            Save Rule
          </button>
        )}
      </div>
      
      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        {!state.selectedRow ? (
          /* No Row Selected State */
          <div className="h-full flex flex-col items-center justify-center text-[#808080] text-center p-8">
            <div className="text-[#cccccc] text-base mb-2">No Row Selected</div>
            <div className="text-[#606060] text-sm">Select a data row from the table to configure harmonization rules</div>
          </div>
        ) : !hasTargetElement ? (
          /* No Target Element Selected State */
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="flex items-center justify-center w-16 h-16 bg-[#ff6b35] bg-opacity-20 rounded-full mb-4">
              <AlertTriangle className="w-8 h-8 text-[#ff6b35]" />
            </div>
            <div className="text-[#cccccc] text-base mb-2">Target Data Element Required</div>
            <div className="text-[#606060] text-sm max-w-md leading-relaxed">
              Please select a target data element for "<span className="text-[#cccccc] font-medium">{state.selectedRow.element}</span>" 
              from the dropdown in the Target Data Element column to configure harmonization rules.
            </div>
            <div className="mt-4 px-4 py-2 bg-[#2d2d30] border border-[#4c4c4c] rounded text-sm text-[#a0a0a0]">
              <strong className="text-[#cccccc]">Next step:</strong> Click the "Search..." button in the Target Data Element column
            </div>
          </div>
        ) : (
          /* Normal Workflow State - Target Element Selected */
          <div className="p-4">
            <WorkflowVisualization 
              selectedRow={state.selectedRow}
              harmonizationSteps={harmonizationSteps}
              selectedStep={state.selectedStep}
              onStepClick={actions.setSelectedStep}
              onAddStep={() => state.selectedRow && actions.addHarmonizationStep(state.selectedRow.id)}
              onRemoveStep={(stepId) => state.selectedRow && actions.removeHarmonizationStep(state.selectedRow.id, stepId)}
            />
          </div>
        )}
      </div>
    </div>
  );
}