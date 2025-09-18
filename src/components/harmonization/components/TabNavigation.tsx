import React from 'react';
import { FileTab } from '../types';
import { Layers, Eye, FileText, BookOpen, X, Table } from 'lucide-react';
import DictionaryIcon from '../../../imports/Component1-92-1321';

interface TabNavigationProps {
  activeTab: string | null;
  onTabChange: (tab: string | null) => void;
  openTabs: FileTab[];
  onCloseTab: (tabId: string) => void;
  showMappingsTabs: boolean; // New prop to control when to show mappings/preview tabs
  showPreviewTab?: boolean; // New prop to control when to show preview tab
  onCloseMappingsTab?: (tabType: 'mappings' | 'preview') => void; // New prop for closing mappings/preview tabs
}

export function TabNavigation({ activeTab, onTabChange, openTabs, onCloseTab, showMappingsTabs, showPreviewTab = false, onCloseMappingsTab }: TabNavigationProps) {
  const handleCloseTab = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    onCloseTab(tabId);
  };

  const handleCloseMappingsTab = (e: React.MouseEvent, tabType: 'mappings' | 'preview') => {
    e.stopPropagation();
    if (onCloseMappingsTab) {
      onCloseMappingsTab(tabType);
    }
  };

  return (
    <div className="bg-[#252526] border-b border-[#3c3c3c] flex h-[34px] overflow-x-auto">
      {/* Mappings tabs - only show when explicitly enabled */}
      {showMappingsTabs && (
        <>
          <div 
            className={`px-3 py-2 border-r border-[#3c3c3c] cursor-pointer text-sm flex items-center gap-2 whitespace-nowrap group relative ${
              activeTab === 'mappings'
                ? 'bg-[#252526] text-[#cccccc] border-b-2 border-[#007fd4]' 
                : 'bg-[#252526] text-[#808080] hover:text-[#cccccc]'
            }`}
            onClick={() => onTabChange('mappings')}
          >
            <Layers className="w-4 h-4" />
            <span className="truncate max-w-[120px]">Mappings</span>
            {/* Close button - always visible */}
            <button
              className="ml-1 p-0.5 hover:bg-[#3c3c3c] rounded transition-colors opacity-100"
              onClick={(e) => handleCloseMappingsTab(e, 'mappings')}
              title="Close tab"
            >
              <X className="w-3 h-3 text-[#cccccc] hover:text-[#ffffff]" />
            </button>
          </div>
          {showPreviewTab && (
            <div 
              className={`px-3 py-2 border-r border-[#3c3c3c] cursor-pointer text-sm flex items-center gap-2 whitespace-nowrap group relative ${
                activeTab === 'preview'
                  ? 'bg-[#252526] text-[#cccccc] border-b-2 border-[#007fd4]' 
                  : 'bg-[#252526] text-[#808080] hover:text-[#cccccc]'
              }`}
              onClick={() => onTabChange('preview')}
            >
              <Eye className="w-4 h-4" />
              <span className="truncate max-w-[120px]">Preview</span>
              {/* Close button - always visible */}
              <button
                className="ml-1 p-0.5 hover:bg-[#3c3c3c] rounded transition-colors opacity-100"
                onClick={(e) => handleCloseMappingsTab(e, 'preview')}
                title="Close tab"
              >
                <X className="w-3 h-3 text-[#cccccc] hover:text-[#ffffff]" />
              </button>
            </div>
          )}
        </>
      )}

      {/* File/Dictionary tabs with permanent close buttons */}
      {openTabs.map((tab) => (
        <div 
          key={tab.id}
          className={`px-3 py-2 border-r border-[#3c3c3c] cursor-pointer text-sm flex items-center gap-2 whitespace-nowrap group relative ${
            activeTab === tab.id
              ? 'bg-[#252526] text-[#cccccc] border-b-2 border-[#007fd4]' 
              : 'bg-[#252526] text-[#808080] hover:text-[#cccccc]'
          }`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.type === 'file' ? (
            <Table className="w-4 h-4 text-[#569cd6]" />
          ) : (
            <div className="w-4 h-4">
              <DictionaryIcon />
            </div>
          )}
          <span className="truncate max-w-[120px]" title={tab.title}>
            {tab.title}
          </span>
          {/* Permanent close button - always visible */}
          <button
            className="ml-1 p-0.5 hover:bg-[#3c3c3c] rounded transition-colors opacity-100"
            onClick={(e) => handleCloseTab(e, tab.id)}
            title="Close tab"
          >
            <X className="w-3 h-3 text-[#cccccc] hover:text-[#ffffff]" />
          </button>
        </div>
      ))}
    </div>
  );
}