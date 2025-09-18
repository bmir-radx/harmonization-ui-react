import React from 'react';
import { Resizable } from 're-resizable';
import { DataMappingSection } from '../components/DataMappingSection';
import { HarmonizationWorkflowSection } from '../components/HarmonizationWorkflowSection';
import { StepConfiguration } from '../components/StepConfiguration';
import { HarmonizationState } from '../types';
import { useTheme } from '../context/ThemeContext';

interface MappingsContentProps {
  state: HarmonizationState;
  actions: {
    updateTableData: (data: any[]) => void;
    setSelectedRow: (row: any) => void;
    setSelectedRowIds: (ids: Set<string>) => void;
    setSelectedStep: (step: any) => void;
    updateHarmonizationSteps: (rowId: string, steps: any[]) => void;
    addHarmonizationStep: (rowId: string) => void;
    removeHarmonizationStep: (rowId: string, stepId: number) => void;
    updateStepParameters: (primitive: string, parameters: any) => void;
    handleReadyClick: () => void;
    handleTargetSelection: (rowId: string, targetElement: any) => void;
    setTargetDropdownOpen: (state: Record<string, boolean>) => void;
    setTargetSearchTerms: (terms: Record<string, string>) => void;
    handleSaveRule: () => void;
    openPreviewTab: () => void;
  };
}

export function MappingsContent({ state, actions }: MappingsContentProps) {
  const { isDarkMode } = useTheme();

  // Theme-aware colors for resizable handle
  const handleStyles = {
    right: {
      width: '4px',
      backgroundColor: isDarkMode ? '#3c3c3c' : '#e5e7eb',
      cursor: 'col-resize',
      border: 'none',
      borderRadius: '0',
      right: '-2px',
      zIndex: 10,
    },
  };

  const borderClass = isDarkMode ? 'border-[#3c3c3c]' : 'border-[#e5e7eb]';

  return (
    <div className="h-full flex bg-[#252526]">
      {/* Left Side: Data Table - Resizable */}
      <Resizable
        defaultSize={{
          width: '50%',
          height: '100%',
        }}
        minWidth="30%"
        maxWidth="70%"
        enable={{
          top: false,
          right: true,
          bottom: false,
          left: false,
          topRight: false,
          bottomRight: false,
          bottomLeft: false,
          topLeft: false,
        }}
        handleStyles={handleStyles}
        handleClasses={{
          right: 'hover:bg-[#007fd4] transition-colors',
        }}
        className={`h-full border-r ${borderClass}`}
      >
        <DataMappingSection 
          state={state}
          actions={actions}
        />
      </Resizable>

      {/* Right Side: Controls - Flex remaining space, split horizontally */}
      <div className="flex-1 h-full flex flex-col">
        {/* Top: Harmonization Rules - 50% height */}
        <div className={`h-1/2 border-b ${borderClass}`}>
          <HarmonizationWorkflowSection 
            state={state}
            actions={actions}
          />
        </div>

        {/* Bottom: Step Configuration - 50% height */}
        <div className="h-1/2">
          <StepConfiguration 
            state={state}
            actions={actions}
          />
        </div>
      </div>
    </div>
  );
}