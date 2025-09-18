import React from 'react';
import { HARMONIZATION_PRIMITIVES } from '../constants';
import { TableRow, HarmonizationStep } from '../types';

interface WorkflowVisualizationProps {
  selectedRow: TableRow | null;
  harmonizationSteps: HarmonizationStep[];
  selectedStep: HarmonizationStep | null;
  onStepClick: (step: HarmonizationStep) => void;
  onAddStep: () => void;
  onRemoveStep: (stepId: number) => void;
}

export function WorkflowVisualization({ 
  selectedRow, 
  harmonizationSteps, 
  selectedStep, 
  onStepClick, 
  onAddStep, 
  onRemoveStep 
}: WorkflowVisualizationProps) {
  if (!selectedRow) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-[#808080] text-base text-center p-8">
        <svg className="w-16 h-16 fill-[#404040] mb-4" viewBox="0 0 48 48">
          <path d="M24 4C12.96 4 4 12.96 4 24C4 35.04 12.96 44 24 44C35.04 44 44 35.04 44 24C44 12.96 35.04 4 24 4ZM24 26C22.9 26 22 25.1 22 24C22 22.9 22.9 22 24 22C25.1 22 26 22.9 26 24C26 25.1 25.1 26 24 26ZM26 18H22V10H26V18Z"/>
        </svg>
        <div>Select a row with a target mapping to configure harmonization steps</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      {/* Source → Steps → Target Header - 12 Column Grid Layout */}
      <div className="mb-6">
        <div className="grid grid-cols-12 gap-4 items-center mb-4">
          {/* Source Element - 3 columns */}
          <div className="col-span-3 text-center">
            <div className="bg-[#2d2d30] border border-[#3c3c3c] rounded p-4 mb-2">
              <div 
                className="text-[#4ec9b0] font-medium text-base px-1 leading-tight" 
                style={{ 
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                  hyphens: 'auto'
                }}
                title={selectedRow.element}
              >
                {selectedRow.element}
              </div>
              <div className="text-[#808080] text-sm px-1 mt-1">({selectedRow.elementType})</div>
              <div 
                className="text-[#808080] text-sm mt-1 px-1 leading-tight"
                style={{ 
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word'
                }}
              >
                {selectedRow.dataset}
              </div>
            </div>
            <div className="text-[#cccccc] text-sm font-medium">SOURCE</div>
          </div>
          
          {/* Steps Container - 6 columns */}
          <div className="col-span-6 text-center">
            <div className="min-h-[100px] p-4 flex items-center justify-center">
              {harmonizationSteps.length > 0 ? (
                <div className="flex flex-wrap items-center gap-3 justify-center">
                  {/* Initial arrow */}
                  <svg className="w-5 h-3 flex-shrink-0" viewBox="0 0 16 8">
                    <line x1="0" y1="4" x2="12" y2="4" stroke="#007FD4" strokeWidth="2"/>
                    <polygon points="9,1 15,4 9,7" fill="#007FD4"/>
                  </svg>
                  
                  {harmonizationSteps.map((step, index) => (
                    <React.Fragment key={step.id}>
                      <div 
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm cursor-pointer transition-colors flex-shrink-0 ${
                          selectedStep?.id === step.id 
                            ? 'bg-[#007fd4] text-white ring-2 ring-blue-300' 
                            : step.primitive 
                              ? 'bg-[#4ec9b0] text-white' 
                              : 'bg-[#3c3c3c] text-[#808080]'
                        }`}
                        onClick={() => onStepClick(step)}
                        title={step.primitive || 'Click to configure'}
                      >
                        {step.primitive && HARMONIZATION_PRIMITIVES[step.primitive as keyof typeof HARMONIZATION_PRIMITIVES] 
                          ? HARMONIZATION_PRIMITIVES[step.primitive as keyof typeof HARMONIZATION_PRIMITIVES].icon 
                          : index + 1}
                      </div>
                      
                      {/* Arrow between steps */}
                      {index < harmonizationSteps.length - 1 && (
                        <svg className="w-4 h-3 flex-shrink-0" viewBox="0 0 12 8">
                          <line x1="0" y1="4" x2="8" y2="4" stroke="#3c3c3c" strokeWidth="2"/>
                          <polygon points="5,1 11,4 5,7" fill="#3c3c3c"/>
                        </svg>
                      )}
                    </React.Fragment>
                  ))}
                  
                  {/* Final arrow */}
                  <svg className="w-5 h-3 flex-shrink-0" viewBox="0 0 16 8">
                    <line x1="4" y1="4" x2="16" y2="4" stroke="#007FD4" strokeWidth="2"/>
                    <polygon points="13,1 19,4 13,7" fill="#007FD4"/>
                  </svg>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <svg className="w-full max-w-[240px] h-3" viewBox="0 0 100 8">
                    <line x1="0" y1="4" x2="94" y2="4" stroke="#007FD4" strokeWidth="2"/>
                    <polygon points="91,1 97,4 91,7" fill="#007FD4"/>
                  </svg>
                </div>
              )}
            </div>
            <div className="text-[#cccccc] text-sm font-medium">STEPS</div>
          </div>
          
          {/* Target Element - 3 columns */}
          <div className="col-span-3 text-center">
            <div className="bg-[#2d2d30] border border-[#3c3c3c] rounded p-4 mb-2">
              <div 
                className="text-[#4ec9b0] font-medium text-base px-1 leading-tight" 
                style={{ 
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                  hyphens: 'auto'
                }}
                title={selectedRow.target}
              >
                {selectedRow.target}
              </div>
              <div className="text-[#808080] text-sm px-1 mt-1">({selectedRow.targetType})</div>
              <div className="text-[#808080] text-sm mt-1 px-1">Target Schema</div>
            </div>
            <div className="text-[#cccccc] text-sm font-medium">TARGET</div>
          </div>
        </div>
      </div>

      {/* Step Management */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="text-[#cccccc] font-medium text-base">Transformation Steps</div>
          <button 
            className="bg-[#007fd4] text-white border-none rounded px-4 py-2 cursor-pointer text-sm flex items-center gap-2 hover:bg-[#005fa3]"
            onClick={onAddStep}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 2.92V11.08" stroke="currentColor" strokeWidth="1.17" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2.92 7H11.08" stroke="currentColor" strokeWidth="1.17" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Add Step
          </button>
        </div>

        {/* Step List */}
        <div className="flex-1 overflow-y-auto">
          {harmonizationSteps.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-[#808080] text-base mb-2">No transformation steps</div>
              <div className="text-[#606060] text-sm">Click "Add Step" to create your first transformation</div>
            </div>
          ) : (
            <div className="space-y-3">
              {harmonizationSteps.map((step, index) => (
                <div 
                  key={step.id} 
                  className={`bg-[#2d2d30] border rounded p-4 cursor-pointer transition-colors ${
                    selectedStep?.id === step.id 
                      ? 'border-[#007fd4] bg-[#1e2837]' 
                      : 'border-[#3c3c3c] hover:border-[#4c4c4c]'
                  }`}
                  onClick={() => onStepClick(step)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#007fd4] text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">
                        {step.primitive && HARMONIZATION_PRIMITIVES[step.primitive as keyof typeof HARMONIZATION_PRIMITIVES] 
                          ? HARMONIZATION_PRIMITIVES[step.primitive as keyof typeof HARMONIZATION_PRIMITIVES].icon 
                          : index + 1}
                      </div>
                      <div>
                        <div className="text-[#cccccc] text-base font-medium">
                          {step.primitive ? 
                            HARMONIZATION_PRIMITIVES[step.primitive as keyof typeof HARMONIZATION_PRIMITIVES]?.name || step.primitive
                            : `Step ${index + 1}`
                          }
                        </div>
                        <div className="text-[#808080] text-sm">
                          {step.primitive ? 'Configured' : 'Click to configure'}
                        </div>
                      </div>
                    </div>
                    <button 
                      className="text-[#808080] hover:text-[#ff6b6b] text-lg p-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveStep(step.id);
                      }}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}