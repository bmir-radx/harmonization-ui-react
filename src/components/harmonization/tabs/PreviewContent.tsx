import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { CheckCircle, AlertTriangle, Download, Save, Search, X } from 'lucide-react';
import { HarmonizationState } from '../types';
import { useTheme } from '../context/ThemeContext';

interface PreviewContentProps {
  state: HarmonizationState;
}

export function PreviewContent({ state }: PreviewContentProps) {
  const [splitPercentage, setSplitPercentage] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [highlightedCell, setHighlightedCell] = useState<{row: number, col: string} | null>(null);
  const [sourceSearchFilters, setSourceSearchFilters] = useState<Record<string, string>>({});
  const [targetSearchFilters, setTargetSearchFilters] = useState<Record<string, string>>({});
  const sourceTableRef = useRef<HTMLDivElement>(null);
  const targetTableRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useTheme();

  // Handle mouse drag for resizing
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const newPercentage = ((e.clientX - rect.left) / rect.width) * 100;
    
    // Constrain between 30% and 70%
    const constrainedPercentage = Math.min(Math.max(newPercentage, 30), 70);
    setSplitPercentage(constrainedPercentage);
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Get mapped source elements that have harmonization rules
  const mappedSourceElements = state.tableData.filter(row => row.target && !row.hasError && row.isReady);
  
  // Extract actual data from uploaded files
  const originalData = useMemo(() => {
    const dataMap = new Map<string, any[]>();
    
    // Collect all uploaded data files
    state.sourceDatasets.forEach(dataset => {
      dataset.files.forEach(file => {
        if (file.data && file.data.length > 0) {
          // Store data by dataset name for easy access
          const key = `${dataset.name}`;
          if (!dataMap.has(key)) {
            dataMap.set(key, []);
          }
          // Merge data from the same dataset
          const existingData = dataMap.get(key) || [];
          dataMap.set(key, [...existingData, ...file.data]);
        }
      });
    });
    
    return dataMap;
  }, [state.sourceDatasets]);

  // Create unified data rows from actual uploaded data
  const actualData = useMemo(() => {
    if (originalData.size === 0 || mappedSourceElements.length === 0) {
      return [];
    }

    // Find the maximum number of rows across all datasets
    let maxRows = 0;
    const dataArrays: Array<{ dataset: string, element: string, data: any[] }> = [];
    
    mappedSourceElements.forEach(element => {
      const datasetData = originalData.get(element.dataset);
      if (datasetData && datasetData.length > 0) {
        // Extract the specific column data
        const columnData = datasetData.map(row => row[element.element] || '');
        dataArrays.push({
          dataset: element.dataset,
          element: element.element,
          data: columnData
        });
        maxRows = Math.max(maxRows, columnData.length);
      }
    });

    // Create rows by combining data from all mapped elements
    const rows = [];
    for (let i = 0; i < Math.min(maxRows, 1000); i++) { // Limit to 1000 rows for performance
      const row: any = { id: i + 1 };
      
      // Add original data for each mapped element
      dataArrays.forEach(({ dataset, element, data }) => {
        const columnKey = `${dataset}_${element}`;
        row[columnKey] = data[i] !== undefined ? data[i] : '';
      });
      
      rows.push(row);
    }
    
    return rows;
  }, [originalData, mappedSourceElements]);

  // Filter source data based on search filters
  const filteredSourceData = useMemo(() => {
    if (Object.keys(sourceSearchFilters).length === 0) {
      return actualData;
    }

    return actualData.filter(row => {
      return Object.entries(sourceSearchFilters).every(([columnKey, filterValue]) => {
        if (!filterValue.trim()) return true;
        
        const cellValue = String(row[columnKey] || '').toLowerCase();
        return cellValue.includes(filterValue.toLowerCase());
      });
    });
  }, [actualData, sourceSearchFilters]);

  // Create harmonized data (for now, just copy original data - can be enhanced later with actual harmonization logic)
  const harmonizedData = useMemo(() => {
    return filteredSourceData.map(row => {
      const harmonizedRow = { ...row };
      
      // For each mapped element, create harmonized version
      mappedSourceElements.forEach(element => {
        if (element.target) {
          const sourceColumnKey = `${element.dataset}_${element.element}`;
          const originalValue = row[sourceColumnKey];
          
          // Apply simple harmonization (can be enhanced with actual rules)
          harmonizedRow[element.target] = applyHarmonizationRules(
            originalValue, 
            element, 
            state.harmonizationStepsByRow[element.id] || []
          );
        }
      });
      
      return harmonizedRow;
    });
  }, [filteredSourceData, mappedSourceElements, state.harmonizationStepsByRow]);

  // Filter target data based on search filters
  const filteredHarmonizedData = useMemo(() => {
    if (Object.keys(targetSearchFilters).length === 0) {
      return harmonizedData;
    }

    return harmonizedData.filter(row => {
      return Object.entries(targetSearchFilters).every(([columnKey, filterValue]) => {
        if (!filterValue.trim()) return true;
        
        const cellValue = String(row[columnKey] || '').toLowerCase();
        return cellValue.includes(filterValue.toLowerCase());
      });
    });
  }, [harmonizedData, targetSearchFilters]);

  // Get unique target columns
  const targetColumns = useMemo(() => {
    const targets = new Set<string>();
    mappedSourceElements.forEach(element => {
      if (element.target) {
        targets.add(element.target);
      }
    });
    return Array.from(targets);
  }, [mappedSourceElements]);

  // Simple harmonization rule application
  function applyHarmonizationRules(value: any, element: any, steps: any[]): any {
    if (!value || steps.length === 0) return value;
    
    let result = value;
    
    // Apply each harmonization step
    steps.forEach(step => {
      switch (step.primitive) {
        case 'unit_conversion':
          // Simple unit conversion example
          if (typeof result === 'number' && step.parameters?.targetUnit) {
            // This is a placeholder - real conversion would depend on units
            result = result; // Keep same for now
          }
          break;
        case 'data_type_conversion':
          if (step.parameters?.targetType === 'number' && typeof result === 'string') {
            const num = parseFloat(result);
            if (!isNaN(num)) result = num;
          }
          break;
        case 'value_mapping':
          if (step.parameters?.mappingTable) {
            const mapping = step.parameters.mappingTable.find((m: any) => m.key === result);
            if (mapping) result = mapping.value;
          }
          break;
        case 'string_operations':
          if (typeof result === 'string' && step.parameters?.operation === 'uppercase') {
            result = result.toUpperCase();
          } else if (typeof result === 'string' && step.parameters?.operation === 'lowercase') {
            result = result.toLowerCase();
          }
          break;
        default:
          // For unknown primitives, just return the original value
          break;
      }
    });
    
    return result;
  }

  const handleSourceCellClick = (rowIndex: number, columnKey: string) => {
    // Find corresponding target column
    const sourceElement = mappedSourceElements.find(el => `${el.dataset}_${el.element}` === columnKey);
    if (sourceElement?.target) {
      setHighlightedCell({ row: rowIndex, col: sourceElement.target });
      
      // Scroll target table to corresponding cell
      if (targetTableRef.current) {
        const targetCell = targetTableRef.current.querySelector(`[data-row="${rowIndex}"][data-col="${sourceElement.target}"]`);
        if (targetCell) {
          targetCell.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        }
      }
    }
  };

  const handleTargetCellClick = (rowIndex: number, columnKey: string) => {
    // Find corresponding source column
    const sourceElement = mappedSourceElements.find(el => el.target === columnKey);
    if (sourceElement) {
      const sourceColumnKey = `${sourceElement.dataset}_${sourceElement.element}`;
      setHighlightedCell({ row: rowIndex, col: columnKey });
      
      // Scroll source table to corresponding cell
      if (sourceTableRef.current) {
        const sourceCell = sourceTableRef.current.querySelector(`[data-row="${rowIndex}"][data-col="${sourceColumnKey}"]`);
        if (sourceCell) {
          sourceCell.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        }
      }
    }
  };

  const getStatusIcon = (element: any) => {
    if (element.isReady) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    } else {
      return <AlertTriangle className="w-4 h-4 text-orange-500" />;
    }
  };

  const handleSourceSearchChange = (columnKey: string, value: string) => {
    setSourceSearchFilters(prev => ({
      ...prev,
      [columnKey]: value
    }));
  };

  const handleTargetSearchChange = (columnKey: string, value: string) => {
    setTargetSearchFilters(prev => ({
      ...prev,
      [columnKey]: value
    }));
  };

  const clearSourceSearch = (columnKey: string) => {
    setSourceSearchFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[columnKey];
      return newFilters;
    });
  };

  const clearTargetSearch = (columnKey: string) => {
    setTargetSearchFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[columnKey];
      return newFilters;
    });
  };

  const borderClass = isDarkMode ? 'border-[#3c3c3c]' : 'border-[#e5e7eb]';
  const handleColor = isDarkMode ? '#3c3c3c' : '#e5e7eb';

  return (
    <div ref={containerRef} className="h-full flex bg-[#252526]">
      {/* Source Data Half */}
      <div 
        className={`h-full border-r ${borderClass} bg-[#252526] flex flex-col`}
        style={{ width: `${splitPercentage}%` }}
      >
        {/* Source Data Header */}
        <div className="bg-[#2d2d30] border-b border-[#3c3c3c] p-3">
          <h3 className="font-medium text-[#cccccc] text-base">Source Data Elements</h3>
          <p className="text-sm text-[#a0a0a0] mt-1">
            {mappedSourceElements.length} mapped elements from {Array.from(new Set(mappedSourceElements.map(e => e.dataset))).length} datasets
            {actualData.length > 0 && ` • ${filteredSourceData.length} of ${actualData.length} rows`}
          </p>
        </div>

        {/* Source Data Table */}
        <div 
          ref={sourceTableRef}
          className="flex-1 overflow-auto"
          onClick={() => setHighlightedCell(null)}
        >
          {filteredSourceData.length === 0 && actualData.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-[#808080]">
                <p className="text-lg mb-2">No data available</p>
                <p className="text-sm">Upload data files and create mapping rules to see preview</p>
              </div>
            </div>
          ) : filteredSourceData.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-[#808080]">
                <p className="text-lg mb-2">No matching data found</p>
                <p className="text-sm">Try adjusting your search filters</p>
              </div>
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead className="sticky top-0">
                <tr>
                  <th className="bg-[#2d2d30] border-b border-[#3c3c3c] px-3 py-2 text-left text-sm font-medium text-[#cccccc] min-w-[60px]">Row</th>
                  {mappedSourceElements.map((element) => {
                    const columnKey = `${element.dataset}_${element.element}`;
                    return (
                      <th 
                        key={columnKey} 
                        className="bg-[#2d2d30] border-b border-[#3c3c3c] px-3 py-2 text-left text-sm font-medium text-[#cccccc] min-w-[120px]"
                      >
                        <div className="flex items-center gap-1 mb-2">
                          {getStatusIcon(element)}
                          <div>
                            <div className="font-medium">{element.element}</div>
                            <div className="text-sm text-[#808080] font-normal">({element.dataset})</div>
                          </div>
                        </div>
                        {/* Search input */}
                        <div className="relative">
                          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-[#808080]" />
                          <input
                            type="text"
                            placeholder="Search..."
                            value={sourceSearchFilters[columnKey] || ''}
                            onChange={(e) => handleSourceSearchChange(columnKey, e.target.value)}
                            className="w-full pl-7 pr-6 py-1 text-xs bg-[#3c3c3c] border border-[#4c4c4c] rounded text-[#cccccc] placeholder-[#808080] focus:border-[#007fd4] focus:outline-none"
                          />
                          {sourceSearchFilters[columnKey] && (
                            <button
                              onClick={() => clearSourceSearch(columnKey)}
                              className="absolute right-1 top-1/2 transform -translate-y-1/2 text-[#808080] hover:text-[#cccccc] p-0.5"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {filteredSourceData.map((dataRow, rowIndex) => (
                  <tr key={dataRow.id} className={`${rowIndex % 2 === 1 ? 'bg-[#2a2a2c]' : 'bg-[#252526]'} hover:bg-[#2d2d30]`}>
                    <td className="px-3 py-2 text-sm text-[#a0a0a0] border-b border-[#3c3c3c] font-medium">{dataRow.id}</td>
                    {mappedSourceElements.map((element) => {
                      const columnKey = `${element.dataset}_${element.element}`;
                      const value = dataRow[columnKey];
                      const isHighlighted = highlightedCell?.row === rowIndex && highlightedCell?.col === element.target;
                      
                      return (
                        <td 
                          key={columnKey}
                          data-row={rowIndex}
                          data-col={columnKey}
                          className={`px-3 py-2 text-sm text-[#cccccc] border-b border-[#3c3c3c] cursor-pointer hover:bg-[#3c3c3c] ${
                            isHighlighted ? 'bg-[#007fd4] bg-opacity-20 border-[#007fd4]' : ''
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSourceCellClick(rowIndex, columnKey);
                          }}
                        >
                          {value === null || value === undefined || value === '' ? '—' : String(value)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Resizable Handle */}
      <div 
        className={`w-1 cursor-col-resize hover:bg-[#007fd4] transition-colors ${isDragging ? 'bg-[#007fd4]' : ''}`}
        style={{ backgroundColor: isDragging ? '#007fd4' : handleColor }}
        onMouseDown={handleMouseDown}
      />

      {/* Target Data Half */}
      <div 
        className="bg-[#252526] flex flex-col"
        style={{ width: `${100 - splitPercentage}%` }}
      >
        {/* Target Data Header */}
        <div className="bg-[#2d2d30] border-b border-[#3c3c3c] p-3 flex items-center justify-between">
          <div>
            <h3 className="font-medium text-[#cccccc] text-base">Harmonized Data Elements</h3>
            <p className="text-sm text-[#a0a0a0] mt-1">
              {targetColumns.length} harmonized target elements
              {harmonizedData.length > 0 && ` • ${filteredHarmonizedData.length} of ${harmonizedData.length} rows`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              className="bg-[#007fd4] text-white border-none rounded px-3 py-1.5 cursor-pointer text-sm flex items-center gap-1.5 hover:bg-[#005fa3] disabled:bg-[#666] disabled:cursor-not-allowed"
              disabled={filteredHarmonizedData.length === 0}
              onClick={() => {
                // TODO: Implement download functionality
                console.log('Download harmonized data');
              }}
            >
              <Download className="w-3 h-3" />
              Download
            </button>
            <button 
              className="bg-[#4CAF50] text-white border-none rounded px-3 py-1.5 cursor-pointer text-sm flex items-center gap-1.5 hover:bg-[#45a049] disabled:bg-[#666] disabled:cursor-not-allowed"
              disabled={filteredHarmonizedData.length === 0}
              onClick={() => {
                // TODO: Implement save to project functionality
                console.log('Save to project');
              }}
            >
              <Save className="w-3 h-3" />
              Save to project
            </button>
          </div>
        </div>

        {/* Target Data Table */}
        <div 
          ref={targetTableRef}
          className="flex-1 overflow-auto"
          onClick={() => setHighlightedCell(null)}
        >
          {filteredHarmonizedData.length === 0 && harmonizedData.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-[#808080]">
                <p className="text-lg mb-2">No harmonized data available</p>
                <p className="text-sm">Complete mapping rules to see harmonized results</p>
              </div>
            </div>
          ) : filteredHarmonizedData.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-[#808080]">
                <p className="text-lg mb-2">No matching harmonized data found</p>
                <p className="text-sm">Try adjusting your search filters</p>
              </div>
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead className="sticky top-0">
                <tr>
                  <th className="bg-[#2d2d30] border-b border-[#3c3c3c] px-3 py-2 text-left text-sm font-medium text-[#cccccc] min-w-[60px]">Row</th>
                  {targetColumns.map((columnName) => {
                    // Find element info for this target column
                    const sourceElement = mappedSourceElements.find(el => el.target === columnName);
                    return (
                      <th 
                        key={columnName} 
                        className="bg-[#2d2d30] border-b border-[#3c3c3c] px-3 py-2 text-left text-sm font-medium text-[#cccccc] min-w-[120px]"
                      >
                        <div className="mb-2">
                          <div className="font-medium">{columnName}</div>
                          <div className="text-sm text-[#808080] font-normal">
                            {sourceElement ? `(from ${sourceElement.element})` : '(harmonized)'}
                          </div>
                        </div>
                        {/* Search input */}
                        <div className="relative">
                          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-[#808080]" />
                          <input
                            type="text"
                            placeholder="Search..."
                            value={targetSearchFilters[columnName] || ''}
                            onChange={(e) => handleTargetSearchChange(columnName, e.target.value)}
                            className="w-full pl-7 pr-6 py-1 text-xs bg-[#3c3c3c] border border-[#4c4c4c] rounded text-[#cccccc] placeholder-[#808080] focus:border-[#007fd4] focus:outline-none"
                          />
                          {targetSearchFilters[columnName] && (
                            <button
                              onClick={() => clearTargetSearch(columnName)}
                              className="absolute right-1 top-1/2 transform -translate-y-1/2 text-[#808080] hover:text-[#cccccc] p-0.5"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {filteredHarmonizedData.map((dataRow, rowIndex) => (
                  <tr key={dataRow.id} className={`${rowIndex % 2 === 1 ? 'bg-[#2a2a2c]' : 'bg-[#252526]'} hover:bg-[#2d2d30]`}>
                    <td className="px-3 py-2 text-sm text-[#a0a0a0] border-b border-[#3c3c3c] font-medium">{dataRow.id}</td>
                    {targetColumns.map((columnName) => {
                      const value = dataRow[columnName];
                      const isHighlighted = highlightedCell?.row === rowIndex && highlightedCell?.col === columnName;
                      
                      return (
                        <td 
                          key={columnName}
                          data-row={rowIndex}
                          data-col={columnName}
                          className={`px-3 py-2 text-sm text-[#cccccc] border-b border-[#3c3c3c] cursor-pointer hover:bg-[#3c3c3c] ${
                            isHighlighted ? 'bg-[#007fd4] bg-opacity-30 border-[#007fd4] ring-2 ring-[#007fd4] ring-opacity-50' : ''
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTargetCellClick(rowIndex, columnName);
                          }}
                        >
                          {value === null || value === undefined || value === '' ? '—' : String(value)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}