import React, { useState, useMemo, useRef, useEffect } from 'react';
import { DataDictionary, DataDictionaryEntry } from '../types';
import { Filter, ArrowUpDown, X } from 'lucide-react';
import { Input } from '../../ui/input';

interface DictionaryViewerContentProps {
  dictionary: DataDictionary;
  datasetName: string;
}

interface ColumnConfig {
  key: string;
  label: string;
  width: string;
  filterable: boolean;
  sortable: boolean;
}

// Get column configuration preserving EXACT CSV file structure
function getColumnConfig(entries: DataDictionaryEntry[]): ColumnConfig[] {
  if (entries.length === 0) {
    return [];
  }

  // Get all unique properties from the first entry (assuming all entries have same structure)
  const firstEntry = entries[0];
  const allProps: string[] = [];
  const seenProps = new Set<string>();
  
  // Get properties in the order they appear in the first entry
  Object.keys(firstEntry).forEach(key => {
    // Only skip truly internal properties, but keep 'name' and other CSV columns
    if (['id'].includes(key)) {
      return;
    }
    
    if (!seenProps.has(key)) {
      seenProps.add(key);
      allProps.push(key);
    }
  });

  // Create columns for all properties found, with 'name' first if it exists
  const columns: ColumnConfig[] = [];
  
  // If 'name' exists, put it first
  if (allProps.includes('name')) {
    const nameIndex = allProps.indexOf('name');
    allProps.splice(nameIndex, 1); // Remove from current position
    allProps.unshift('name'); // Add to beginning
  }
  
  allProps.forEach(prop => {
    let width = '200px'; // Increased default width for better visibility
    
    // Adjust width based on content length and column names
    if (prop.toLowerCase().includes('description') || prop.toLowerCase().includes('notes')) {
      width = '400px';
    } else if (prop.toLowerCase().includes('additional missing value codes')) {
      width = '300px';
    } else if (prop.toLowerCase().includes('enumeration') || prop.toLowerCase().includes('values')) {
      width = '250px';
    } else if (prop.toLowerCase().includes('pattern')) {
      width = '180px';
    } else if (prop.toLowerCase() === 'name' || prop.toLowerCase().includes('variable')) {
      width = '200px';
    } else if (prop.toLowerCase().includes('unit')) {
      width = '120px';
    } else if (prop.toLowerCase().includes('id')) {
      width = '150px';
    } else if (prop.toLowerCase().includes('label') || prop.toLowerCase().includes('terms')) {
      width = '200px';
    } else if (prop.toLowerCase().includes('datatype') || prop.toLowerCase() === 'type') {
      width = '150px';
    } else if (prop.toLowerCase().includes('required') || prop.toLowerCase().includes('mandatory')) {
      width = '120px';
    } else if (prop.toLowerCase().includes('format')) {
      width = '160px';
    } else if (prop.toLowerCase().includes('minimum') || prop.toLowerCase().includes('maximum') || prop.toLowerCase().includes('min') || prop.toLowerCase().includes('max')) {
      width = '120px';
    }
    
    columns.push({
      key: prop,
      label: prop, // Use exact column name from CSV
      width: width,
      filterable: true,
      sortable: true
    });
  });

  return columns;
}

// Column header with integrated filtering
function ColumnHeader({ 
  column, 
  onSort, 
  sortField, 
  sortDirection, 
  onFilter, 
  filterValue,
  uniqueValues 
}: {
  column: ColumnConfig;
  onSort: (field: string) => void;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  onFilter: (field: string, value: string) => void;
  filterValue: string;
  uniqueValues: string[];
}) {
  const [showFilter, setShowFilter] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close filter dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilter(false);
      }
    }

    if (showFilter) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showFilter]);

  const getSortIcon = () => {
    if (sortField !== column.key) return <ArrowUpDown className="w-4 h-4 text-[#666666]" />;
    return (
      <ArrowUpDown 
        className={`w-4 h-4 ${sortDirection === 'asc' ? 'text-[#007fd4]' : 'text-[#007fd4] rotate-180'}`}
      />
    );
  };

  return (
    <th 
      className="sticky top-0 bg-[#3c3c3c] border-r border-[#3c3c3c] text-left text-[#cccccc] font-medium relative group"
      style={{ 
        minWidth: column.width,
        width: column.width,
        maxWidth: column.width
      }}
    >
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <button 
            onClick={() => onSort(column.key)}
            className="flex items-center gap-2 hover:text-[#007fd4] transition-colors min-w-0 flex-1"
            title={column.label}
          >
            <span className="truncate">{column.label}</span>
            {getSortIcon()}
          </button>
        </div>
        
        <div className="relative shrink-0" ref={filterRef}>
          <button
            onClick={() => setShowFilter(!showFilter)}
            className={`p-1 rounded hover:bg-[#4c4c4c] transition-colors ${
              filterValue ? 'text-[#007fd4]' : 'text-[#808080]'
            }`}
          >
            <Filter className="w-4 h-4" />
          </button>
          
          {showFilter && (
            <div className="filter-dropdown">
              <div className="p-2">
                <Input
                  placeholder={`Filter ${column.label.toLowerCase()}...`}
                  value={filterValue}
                  onChange={(e) => onFilter(column.key, e.target.value)}
                  className="bg-[#252526] border-[#3c3c3c] text-[#cccccc] text-sm"
                />
                {filterValue && (
                  <button
                    onClick={() => onFilter(column.key, '')}
                    className="mt-2 text-xs text-[#808080] hover:text-[#cccccc] flex items-center gap-1"
                  >
                    <X className="w-3 h-3" />
                    Clear filter
                  </button>
                )}
              </div>
              
              {/* Quick filter options for common values */}
              {uniqueValues.length > 0 && uniqueValues.length <= 20 && (
                <div className="border-t border-[#3c3c3c] p-2">
                  <div className="text-xs text-[#808080] mb-1">Quick filters:</div>
                  <div className="max-h-32 overflow-y-auto">
                    {uniqueValues.map(value => (
                      <button
                        key={value}
                        onClick={() => {
                          onFilter(column.key, value);
                          setShowFilter(false);
                        }}
                        className="block w-full text-left px-2 py-1 text-xs text-[#cccccc] hover:bg-[#3c3c3c] rounded truncate"
                      >
                        {value || '(empty)'}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </th>
  );
}

export function DictionaryViewerContent({ dictionary, datasetName }: DictionaryViewerContentProps) {
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});

  // Get column configuration based on the exact CSV structure
  const columns = useMemo(() => getColumnConfig(dictionary.entries), [dictionary.entries]);

  // Calculate total minimum width for horizontal scrolling
  const totalMinWidth = useMemo(() => {
    return columns.reduce((total, column) => {
      return total + parseInt(column.width.replace('px', ''));
    }, 0);
  }, [columns]);

  // Get unique values for each filterable column
  const columnUniqueValues = useMemo(() => {
    const uniqueValues: Record<string, string[]> = {};
    
    columns.forEach(column => {
      const values = new Set<string>();
      dictionary.entries.forEach(entry => {
        const value = (entry as any)[column.key]?.toString() || '';
        if (value) values.add(value);
      });
      uniqueValues[column.key] = Array.from(values).sort();
    });
    
    return uniqueValues;
  }, [dictionary.entries, columns]);

  // Filter and sort entries - maintain original CSV order when no sorting applied
  const filteredAndSortedEntries = useMemo(() => {
    let filtered = dictionary.entries.filter(entry => {
      return Object.entries(columnFilters).every(([field, filterValue]) => {
        if (!filterValue) return true;
        
        const entryValue = (entry as any)[field]?.toString().toLowerCase() || '';
        return entryValue.includes(filterValue.toLowerCase());
      });
    });

    // Only sort if a sort field is selected, otherwise maintain original CSV order
    if (sortField) {
      filtered.sort((a, b) => {
        const aValue = (a as any)[sortField]?.toString() || '';
        const bValue = (b as any)[sortField]?.toString() || '';
        
        const comparison = aValue.localeCompare(bValue);
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return filtered;
  }, [dictionary.entries, columnFilters, sortField, sortDirection]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleFilter = (field: string, value: string) => {
    setColumnFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getCellValue = (entry: DataDictionaryEntry, columnKey: string) => {
    const value = (entry as any)[columnKey];
    
    // Handle null/undefined/empty values
    if (value === null || value === undefined || value === '') {
      return '';
    }
    
    // Handle arrays
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(', ') : '';
    }
    
    // Handle objects
    if (value && typeof value === 'object') {
      return JSON.stringify(value);
    }
    
    // Display value exactly as it appears in the CSV
    return value.toString();
  };

  return (
    <div className="h-full flex flex-col bg-[#252526]">
      {/* Table Container - Force Horizontal Scrolling */}
      <div className="flex-1 overflow-auto" style={{ overflowX: 'scroll', overflowY: 'auto' }}>
        <div style={{ minWidth: `${totalMinWidth}px`, width: 'max-content' }}>
          <table 
            className="text-sm border-collapse w-full" 
            style={{ 
              width: 'max-content',
              minWidth: `${totalMinWidth}px`,
              tableLayout: 'auto'
            }}
          >
          {/* Table Header - Show exact CSV column names */}
          <thead>
            <tr>
              {columns.map((column) => (
                <ColumnHeader
                  key={column.key}
                  column={column}
                  onSort={handleSort}
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onFilter={handleFilter}
                  filterValue={columnFilters[column.key] || ''}
                  uniqueValues={columnUniqueValues[column.key] || []}
                />
              ))}
            </tr>
          </thead>
          
          {/* Table Body - Show exact CSV data */}
          <tbody>
            {filteredAndSortedEntries.map((entry, index) => (
              <tr 
                key={entry.id || index} 
                className={`border-b border-[#3c3c3c] hover:bg-[#3c3c3c] hover:bg-opacity-30 transition-colors ${
                  index % 2 === 0 ? 'bg-[#252526]' : 'bg-[#2d2d30]'
                }`}
              >
                {columns.map((column) => (
                  <td 
                    key={column.key}
                    className="px-4 py-3 border-r border-[#3c3c3c] text-[#cccccc] overflow-hidden"
                    style={{ 
                      width: column.width,
                      maxWidth: column.width,
                      minWidth: column.width
                    }}
                    title={getCellValue(entry, column.key)}
                  >
                    <div className="truncate">
                      {getCellValue(entry, column.key)}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          </table>
          
          {filteredAndSortedEntries.length === 0 && (
            <div className="text-center py-8 bg-[#252526]">
              <div className="text-[#808080] text-sm">
                {Object.values(columnFilters).some(filter => filter) 
                  ? 'No entries match your filter criteria'
                  : 'No entries found in this dictionary'
                }
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}