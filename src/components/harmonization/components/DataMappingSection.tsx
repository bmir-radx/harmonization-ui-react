import React, { useRef, useEffect } from 'react';
import { Button } from '../../ui/button';
import { Search, ChevronDown, Sparkles } from 'lucide-react';
import { HarmonizationState } from '../types';
import { TargetElement } from '../types';

interface DataMappingSectionProps {
  state: HarmonizationState;
  actions: {
    setSelectedRow: (row: any) => void;
    setSelectedRowIds: (ids: Set<string>) => void;
    handleTargetSelection: (rowId: string, targetElement: any) => void;
    setTargetDropdownOpen: (state: Record<string, boolean>) => void;
    setTargetSearchTerms: (terms: Record<string, string>) => void;
    handleReadyClick: () => void;
    openPreviewTab: () => void;
  };
}

export function DataMappingSection({ state, actions }: DataMappingSectionProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectableRows = state.tableData.filter(row => row.target && !row.hasError);
  const totalSourceElements = state.tableData.length;
  const harmonizationRulesCount = state.tableData.filter(row => row.isReady).length;
  
  // Check if there are any uploaded data files in source datasets
  const hasUploadedDataFiles = state.sourceDatasets.some(dataset => 
    dataset.files && dataset.files.length > 0
  );

  // Check if at least one row has ready status
  const hasReadyRows = harmonizationRulesCount > 0;

  // Get target elements from target datasets instead of hardcoded constants
  const getTargetElements = (): TargetElement[] => {
    const targetElements: TargetElement[] = [];
    
    state.targetDatasets.forEach(dataset => {
      if (dataset.dictionary && dataset.dictionary.entries) {
        dataset.dictionary.entries.forEach(entry => {
          targetElements.push({
            id: entry.id,
            name: entry.name,
            type: entry.type,
            description: entry.description
          });
        });
      }
    });
    
    // If no target datasets are available, return empty array
    // This will show "No targets available" in the dropdown
    return targetElements;
  };

  const TARGET_ELEMENTS = getTargetElements();

  // Click outside handler for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        const hasOpenDropdowns = Object.values(state.targetDropdownOpen).some(isOpen => isOpen);
        if (hasOpenDropdowns) {
          actions.setTargetDropdownOpen({});
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [state.targetDropdownOpen, actions]);

  const handleRowSelect = (rowId: string, checked: boolean) => {
    const newSelectedRows = new Set(state.selectedRowIds);
    if (checked) {
      newSelectedRows.add(rowId);
    } else {
      newSelectedRows.delete(rowId);
    }
    actions.setSelectedRowIds(newSelectedRows);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      actions.setSelectedRowIds(new Set(selectableRows.map(row => row.id)));
    } else {
      actions.setSelectedRowIds(new Set());
    }
  };

  // Handle row click for selection (separate from checkbox)
  const handleRowClick = (row: any) => {
    // Allow selection of any row, regardless of target status
    actions.setSelectedRow(row);
  };

  // Enhanced target selection that also selects the row
  const handleTargetSelectionWithRowSelect = (rowId: string, targetElement: TargetElement) => {
    // First, handle the target selection
    actions.handleTargetSelection(rowId, targetElement);
    
    // Find the updated row and select it
    const updatedRow = state.tableData.find(row => row.id === rowId);
    if (updatedRow) {
      // Create the updated row object with the new target
      const rowWithTarget = {
        ...updatedRow,
        target: targetElement.name,
        targetType: targetElement.type,
        hasError: false
      };
      
      // Select the row so harmonization workflow shows on the right
      actions.setSelectedRow(rowWithTarget);
      
      // Do NOT automatically check the checkbox - let user decide
      // Remove the automatic checkbox selection
    }
  };

  const filteredTargetElements = (searchTerm: string) => {
    if (!searchTerm) return TARGET_ELEMENTS;
    return TARGET_ELEMENTS.filter(element => 
      element.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const renderStatusIcon = (row: any) => {
    if (row.isReady) {
      return (
        <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
        </svg>
      );
    }
    
    return (
      <svg className="w-4 h-4 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
      </svg>
    );
  };

  return (
    <div ref={dropdownRef} className="h-full flex flex-col bg-[#252526]">
      {/* Header Controls */}
      <div className="bg-[#2d2d30] backdrop-blur p-3 flex items-center gap-3 border-b border-[#3c3c3c] flex-shrink-0">
        <button className="bg-[#3c3c3c] border border-[#4c4c4c] rounded px-2.5 py-1.5 cursor-pointer shadow-sm hover:bg-[#4c4c4c]">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M13.79 2.62C14.3 1.96 13.84 1 13 1H3C2.17 1 1.7 1.96 2.21 2.62L7.04 8.73C7.18 8.9 7.25 9.12 7.25 9.34V14.8C7.25 14.97 7.47 15.06 7.59 14.94L8.61 13.93C8.7 13.83 8.75 13.7 8.75 13.57V9.34C8.75 9.12 8.83 8.9 8.96 8.73L13.79 2.62Z" fill="#cccccc"/>
          </svg>
        </button>
        <div className="bg-[#3c3c3c] border border-[#4c4c4c] rounded px-2.5 py-1 flex-1 flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M10.68 11.75C9.67 12.54 8.39 13.01 7 13.01C3.69 13.01 1 10.32 1 7C1 3.69 3.69 1 7 1C10.32 1 13 3.69 13 7C13 8.39 12.53 9.67 11.74 10.68L14.78 13.72C15.07 14.01 15.07 14.49 14.78 14.78C14.49 15.07 14.01 15.07 13.72 14.78L10.68 11.75Z" fill="#868FA0"/>
          </svg>
          <input type="text" placeholder="Search..." className="flex-1 border-none outline-none text-[#cccccc] text-sm bg-transparent placeholder-[#808080]" />
        </div>
      </div>

      {/* Statistics Bar */}
      <div className="bg-[#2d2d30] px-3 py-2 border-b border-[#3c3c3c] flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3 text-sm text-[#cccccc]">
          <div className="flex items-center gap-1">
            <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
              <path d="M2 2h12v12H2V2zm1 1v10h10V3H3z"/>
              <path d="M5 5h6v1H5V5zm0 2h6v1H5V7zm0 2h4v1H5V9z"/>
            </svg>
            <span>{totalSourceElements} elements</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-3 h-3 text-green-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
            </svg>
            <span>{harmonizationRulesCount} rules</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            className="ai-button border-none rounded px-2 py-1.5 text-sm text-white cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            onClick={() => {
              // Dummy AI button - no functionality for now
              console.log('AI button clicked');
            }}
            title="AI Assistant (Coming Soon)"
          >
            <div className="flex items-center gap-1">
              <Sparkles className="sparkles-icon w-3 h-3" />
              <span className="text-xs font-medium">AI</span>
            </div>
          </Button>

          <Button 
            className={`border-none rounded px-3 py-1.5 text-sm transition-colors ${
              hasReadyRows 
                ? 'bg-[#007fd4] text-white cursor-pointer hover:bg-[#005fa3]' 
                : 'bg-[#4c4c4c] text-[#808080] cursor-not-allowed'
            }`}
            onClick={() => {
              if (hasReadyRows) {
                actions.handleReadyClick();
                actions.openPreviewTab();
              }
            }}
            disabled={!hasReadyRows}
            title={hasReadyRows ? 'Generate harmonization preview' : 'Complete at least one mapping rule to enable harmonization'}
          >
            Ready
          </Button>
        </div>
      </div>

      {/* Data Table - Scrollable Container */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 z-10">
              <tr>
                <th className="bg-[#2d2d30] h-8 text-left text-sm font-semibold text-[#cccccc] uppercase tracking-wide px-3 border-b border-[#3c3c3c] w-10">
                  <input 
                    type="checkbox" 
                    className="w-3.5 h-3.5 bg-[#3c3c3c] border border-[#4c4c4c] rounded accent-[#007fd4]"
                    checked={state.selectedRowIds.size === selectableRows.length && selectableRows.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
                <th className="bg-[#2d2d30] h-8 text-left text-sm font-semibold text-[#cccccc] uppercase tracking-wide px-3 border-b border-[#3c3c3c]">#</th>
                <th className="bg-[#2d2d30] h-8 text-left text-sm font-semibold text-[#cccccc] uppercase tracking-wide px-3 border-b border-[#3c3c3c]">Data Set</th>
                <th className="bg-[#2d2d30] h-8 text-left text-sm font-semibold text-[#cccccc] uppercase tracking-wide px-3 border-b border-[#3c3c3c]">Source Data Element</th>
                <th className="bg-[#2d2d30] h-8 text-left text-sm font-semibold text-[#cccccc] uppercase tracking-wide px-3 border-b border-[#3c3c3c]">Target Data Element</th>
                <th className="bg-[#2d2d30] h-8 text-left text-sm font-semibold text-[#cccccc] uppercase tracking-wide px-3 border-b border-[#3c3c3c] w-10">Status</th>
              </tr>
            </thead>
            <tbody>
              {state.tableData.map((row, index) => {
              const isCheckboxDisabled = !row.target || row.hasError;
              return (
                <tr 
                  key={row.id} 
                  className={`h-8 border-b border-[#3c3c3c] cursor-pointer hover:bg-[#2d2d30] ${
                    state.selectedRow?.id === row.id ? 'bg-[#007fd4] bg-opacity-20' : index % 2 === 1 ? 'bg-[#2a2a2c]' : 'bg-[#252526]'
                  }`}
                  onClick={() => handleRowClick(row)}
                >
                  <td className="px-3 text-[#cccccc] text-sm">
                    <input 
                      type="checkbox" 
                      className="w-3.5 h-3.5 bg-[#3c3c3c] border border-[#4c4c4c] rounded accent-[#007fd4] cursor-pointer"
                      disabled={isCheckboxDisabled}
                      checked={state.selectedRowIds.has(row.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        if (!isCheckboxDisabled) {
                          handleRowSelect(row.id, e.target.checked);
                        }
                      }}
                    />
                  </td>
                  <td className="px-3 text-[#cccccc] text-sm font-medium">{parseInt(row.id)}</td>
                  <td className="px-3 text-[#cccccc] text-sm font-medium">{row.dataset}</td>
                  <td className="px-3 text-[#a0a0a0] text-sm">{row.element}</td>
                  <td className="px-3 text-[#a0a0a0] text-sm relative">
                    {row.hasError && !row.target ? (
                      <div className="relative">
                        <button
                          className="bg-[#3c3c3c] border border-[#4c4c4c] rounded px-2 py-0.5 inline-flex items-center gap-1.5 cursor-pointer hover:border-[#007fd4] w-full text-left"
                          onClick={(e) => {
                            e.stopPropagation();
                            actions.setTargetDropdownOpen({ ...state.targetDropdownOpen, [row.id]: !state.targetDropdownOpen[row.id] });
                          }}
                        >
                          <Search width="12" height="12" className="text-[#868FA0]" />
                          <span className="text-[#808080] text-sm">Search...</span>
                          <ChevronDown className="w-3 h-3 text-[#868FA0] ml-auto" />
                        </button>
                        
                        {state.targetDropdownOpen[row.id] && (
                          <div className="absolute top-full left-0 right-0 z-50 bg-[#2d2d30] border border-[#4c4c4c] rounded-md shadow-lg max-h-40 overflow-y-auto">
                            <div className="p-2 border-b border-[#3c3c3c]">
                              <input
                                type="text"
                                placeholder="Search targets..."
                                value={state.targetSearchTerms[row.id] || ''}
                                onChange={(e) => actions.setTargetSearchTerms({ ...state.targetSearchTerms, [row.id]: e.target.value })}
                                className="w-full px-2 py-1 border border-[#4c4c4c] rounded text-sm bg-[#3c3c3c] text-[#cccccc] placeholder-[#808080]"
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                            {filteredTargetElements(state.targetSearchTerms[row.id] || '').length > 0 ? (
                              filteredTargetElements(state.targetSearchTerms[row.id] || '').map(element => (
                                <button
                                  key={element.id}
                                  className="w-full px-2 py-1 text-left hover:bg-[#3c3c3c] text-sm flex items-center gap-2 text-[#cccccc]"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleTargetSelectionWithRowSelect(row.id, element);
                                  }}
                                >
                                  <span className="text-[#4ec9b0]">s</span>
                                  <div className="flex flex-col">
                                    <span>{element.name}</span>
                                    {element.description && (
                                      <span className="text-xs text-[#808080]">{element.description}</span>
                                    )}
                                  </div>
                                </button>
                              ))
                            ) : (
                              <div className="px-2 py-3 text-sm text-[#808080] text-center">
                                {TARGET_ELEMENTS.length === 0 
                                  ? "No target datasets available. Please add target datasets to the left panel."
                                  : "No matching target elements found."
                                }
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-[#cccccc]">{row.target}</span>
                    )}
                  </td>
                  <td className="px-3 text-center">
                    {renderStatusIcon(row)}
                  </td>
                </tr>
              );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}