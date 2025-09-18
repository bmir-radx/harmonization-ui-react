import React from 'react';
import { TabNavigation } from '../components/TabNavigation';
import { MappingsContent } from '../tabs/MappingsContent';
import { PreviewContent } from '../tabs/PreviewContent';
import { FileViewerContent } from '../tabs/FileViewerContent';
import { DictionaryViewerContent } from '../tabs/DictionaryViewerContent';
import { EmptyState } from '../components/EmptyState';
import { FileTypeDialog } from '../components/FileTypeDialog';
import { HarmonizationState, DataFile, DataDictionary } from '../types';

interface MainContentProps {
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
    setActiveTab: (tab: string | null) => void;
    closeFileTab: (tabId: string) => void;
    closeMappingsTab: (tabType: 'mappings' | 'preview') => void;
    openPreviewTab: () => void;
    handleUploadSourceData?: () => void;
    handleCreateTargetDictionary?: () => void;
    handleFileTypeSelection?: (type: 'data' | 'dictionary' | null) => void;
    closeFileTypeDialog?: () => void;
  };
}

export function MainContent({ state, actions }: MainContentProps) {
  // Check if current active tab is a file/dictionary tab
  const activeFileTab = state.openTabs.find(tab => tab.id === state.activeTab);

  // Handle tab closing with proper fallback to main screen
  const handleCloseTab = (tabId: string) => {
    actions.closeFileTab(tabId);
  };

  const renderTabContent = () => {
    // Show empty state if no mappings tabs are open and no file tabs are open
    if (!state.showMappingsTabs && state.openTabs.length === 0) {
      return (
        <EmptyState 
          onUploadSourceData={actions.handleUploadSourceData}
          onCreateTargetDictionary={actions.handleCreateTargetDictionary}
        />
      );
    }

    // If we have an active file/dictionary tab, show its content
    if (activeFileTab) {
      if (activeFileTab.type === 'file') {
        return (
          <FileViewerContent 
            file={activeFileTab.content as DataFile}
            datasetName={activeFileTab.datasetName}
          />
        );
      } else if (activeFileTab.type === 'dictionary') {
        return (
          <DictionaryViewerContent 
            dictionary={activeFileTab.content as DataDictionary}
            datasetName={activeFileTab.datasetName}
          />
        );
      }
    }

    // If mappings tabs are enabled, show mappings/preview content
    if (state.showMappingsTabs) {
      switch (state.activeTab) {
        case 'mappings':
          return <MappingsContent state={state} actions={actions} />;
        case 'preview':
          return <PreviewContent state={state} />;
        default:
          // Default to mappings if mappings tabs are shown but no specific tab
          return <MappingsContent state={state} actions={actions} />;
      }
    }

    // Fallback to empty state
    return (
      <EmptyState 
        onUploadSourceData={actions.handleUploadSourceData}
        onCreateTargetDictionary={actions.handleCreateTargetDictionary}
      />
    );
  };

  return (
    <div className="h-full flex flex-col bg-[#252526]">
      {/* Tab Navigation - Show if we have mappings tabs enabled or open file tabs */}
      {(state.showMappingsTabs || state.openTabs.length > 0) && (
        <TabNavigation 
          activeTab={state.activeTab}
          onTabChange={actions.setActiveTab}
          openTabs={state.openTabs}
          onCloseTab={handleCloseTab}
          showMappingsTabs={state.showMappingsTabs}
          showPreviewTab={state.showPreviewTab}
          onCloseMappingsTab={actions.closeMappingsTab}
        />
      )}

      {/* Content Area - Constrained to available space with proper overflow handling */}
      <div className="flex-1 overflow-hidden">
        {renderTabContent()}
      </div>

      {/* File Type Selection Dialog */}
      {state.pendingFileUpload && (
        <FileTypeDialog
          isOpen={!!state.pendingFileUpload}
          onClose={() => {
            if (actions.closeFileTypeDialog) {
              actions.closeFileTypeDialog();
            }
          }}
          onSelectType={(type) => {
            if (actions.handleFileTypeSelection) {
              actions.handleFileTypeSelection(type);
            }
          }}
          fileName={state.pendingFileUpload.file.name}
        />
      )}
    </div>
  );
}