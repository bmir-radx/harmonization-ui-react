import React, { useState } from 'react';
import { Resizable } from 're-resizable';
import { HeaderBar } from './HeaderBar';
import { LeftSidebar } from './LeftSidebar';
import { RightSidebar } from './RightSidebar';
import { MainContent } from './MainContent';
import { HarmonizationState } from '../types';

interface MappingsLayoutProps {
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
    handleTabClick: (tabId: string) => void;
    handleReadyClick: () => void;
    handleTargetSelection: (rowId: string, targetElement: any) => void;
    setTargetDropdownOpen: (state: Record<string, boolean>) => void;
    setTargetSearchTerms: (terms: Record<string, string>) => void;
    handleSaveRule: () => void;
  };
}

export function MappingsLayout({ state, actions }: MappingsLayoutProps) {
  const [leftPanelWidth, setLeftPanelWidth] = useState(346);
  const [rightPanelWidth, setRightPanelWidth] = useState(346);

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-[#cccccc]">
      <HeaderBar />
      
      <div className="flex h-[calc(100vh-40px)]">
        {/* Left Sidebar - Resizable */}
        <Resizable
          size={{ width: leftPanelWidth, height: '100%' }}
          onResizeStop={(e, direction, ref, d) => {
            setLeftPanelWidth(leftPanelWidth + d.width);
          }}
          minWidth={200}
          maxWidth={500}
          enable={{ right: true }}
          handleStyles={{
            right: { 
              backgroundColor: '#3c3c3c', 
              width: '2px',
              right: '-1px',
              cursor: 'col-resize'
            }
          }}
          className="bg-[#252526] border-r border-[#3c3c3c] flex flex-col relative"
        >
          <div className="absolute top-1/2 right-[-4px] transform -translate-y-1/2 w-2 h-5 bg-[#565656] border border-[#404040] rounded-sm z-10 pointer-events-none"></div>
          <LeftSidebar />
        </Resizable>

        {/* Main Content */}
        <div className="flex-1 bg-[#252526] border-r border-[#3c3c3c] flex flex-col">
          <MainContent state={state} actions={actions} />
        </div>

        {/* Right Sidebar - Resizable */}
        <Resizable
          size={{ width: rightPanelWidth, height: '100%' }}
          onResizeStop={(e, direction, ref, d) => {
            setRightPanelWidth(rightPanelWidth + d.width);
          }}
          minWidth={200}
          maxWidth={500}
          enable={{ left: true }}
          handleStyles={{
            left: { 
              backgroundColor: '#3c3c3c', 
              width: '2px',
              left: '-1px',
              cursor: 'col-resize'
            }
          }}
          className="bg-[#252526] border-l border-[#3c3c3c] flex flex-col relative"
        >
          <div className="absolute top-1/2 left-[-4px] transform -translate-y-1/2 w-2 h-5 bg-[#565656] border border-[#404040] rounded-sm z-10 pointer-events-none"></div>
          <RightSidebar />
        </Resizable>
      </div>
    </div>
  );
}