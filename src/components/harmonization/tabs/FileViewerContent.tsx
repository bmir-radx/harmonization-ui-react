import React, { useState, useMemo, useEffect, useRef } from 'react';
import { DataFile } from '../types';
import { Filter, ArrowUpDown, X } from 'lucide-react';
import { Input } from '../../ui/input';

interface FileViewerContentProps {
  file: DataFile;
  datasetName: string;
}

interface ColumnConfig {
  key: string;
  label: string;
  width: string;
  filterable: boolean;
  sortable: boolean;
}

// Get column configuration from actual CSV data
function getColumnConfig(data: any[]): ColumnConfig[] {
  if (data.length === 0) {
    return [];
  }

  // Get all unique properties from the first row (assuming all rows have same structure)
  const firstRow = data[0];
  const allProps = Object.keys(firstRow);

  // Create columns for all properties found, preserving exact order from CSV
  const columns: ColumnConfig[] = [];
  
  allProps.forEach(prop => {
    let width = '150px'; // Default width
    
    // Adjust width based on content type and column names
    if (prop.toLowerCase().includes('description') || prop.toLowerCase().includes('notes') || prop.toLowerCase().includes('comment')) {
      width = '300px';
    } else if (prop.toLowerCase().includes('id')) {
      width = '100px';
    } else if (prop.toLowerCase().includes('name') || prop.toLowerCase().includes('label')) {
      width = '200px';
    } else if (prop.toLowerCase().includes('date') || prop.toLowerCase().includes('time')) {
      width = '150px';
    } else if (prop.toLowerCase().includes('email') || prop.toLowerCase().includes('address')) {
      width = '250px';
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

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilter(false);
      }
    };

    if (showFilter) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilter]);

  const getSortIcon = () => {
    if (sortField !== column.key) return <ArrowUpDown className="w-4 h-4 text-muted-foreground" />;
    return (
      <ArrowUpDown 
        className={`w-4 h-4 ${sortDirection === 'asc' ? 'text-primary' : 'text-primary rotate-180'}`}
      />
    );
  };

  return (
    <th 
      className="sticky top-0 bg-muted border-r border-border text-left text-foreground font-medium relative group"
      style={{ 
        minWidth: column.width,
        width: column.width
      }}
    >
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <button 
            onClick={() => onSort(column.key)}
            className="flex items-center gap-2 hover:text-primary transition-colors min-w-0 flex-1"
            title={column.label}
          >
            <span className="truncate">{column.label}</span>
            {getSortIcon()}
          </button>
        </div>
        
        <div className="relative shrink-0" ref={filterRef}>
          <button
            onClick={() => setShowFilter(!showFilter)}
            className={`p-1 rounded hover:bg-accent transition-colors ${
              filterValue ? 'text-primary' : 'text-muted-foreground'
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
                  className="bg-input-background border-border text-foreground text-sm"
                />
                {filterValue && (
                  <button
                    onClick={() => onFilter(column.key, '')}
                    className="mt-2 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                  >
                    <X className="w-3 h-3" />
                    Clear filter
                  </button>
                )}
              </div>
              
              {/* Quick filter options for common values */}
              {uniqueValues.length > 0 && uniqueValues.length <= 20 && (
                <div className="border-t border-border p-2">
                  <div className="text-xs text-muted-foreground mb-1">Quick filters:</div>
                  <div className="max-h-32 overflow-y-auto">
                    {uniqueValues.map(value => (
                      <button
                        key={value}
                        onClick={() => {
                          onFilter(column.key, value);
                          setShowFilter(false);
                        }}
                        className="block w-full text-left px-2 py-1 text-xs text-foreground hover:bg-muted rounded truncate transition-colors"
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

export function FileViewerContent({ file, datasetName }: FileViewerContentProps) {
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});

  // Use actual data from file if available, otherwise generate sample data
  const generateCsvData = () => {
    // If file has actual data, use it
    if (file.data && file.data.length > 0) {
      return file.data;
    }
    
    // Otherwise generate sample data based on columns
    const columns = file.columns || ['id', 'name', 'value'];
    const data = [];
    
    for (let i = 1; i <= Math.min(100, file.rowCount || 100); i++) {
      const row: Record<string, any> = {};
      columns.forEach((col, index) => {
        if (col.toLowerCase().includes('id')) {
          row[col] = `ID_${i.toString().padStart(4, '0')}`;
        } else if (col.toLowerCase().includes('name')) {
          row[col] = `Sample Name ${i}`;
        } else if (col.toLowerCase().includes('age')) {
          row[col] = Math.floor(Math.random() * 80) + 20;
        } else if (col.toLowerCase().includes('date')) {
          row[col] = new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0];
        } else if (col.toLowerCase().includes('email')) {
          row[col] = `user${i}@example.com`;
        } else if (col.toLowerCase().includes('score')) {
          row[col] = (Math.random() * 100).toFixed(2);
        } else if (col.toLowerCase().includes('active') || col.toLowerCase().includes('enabled')) {
          row[col] = Math.random() > 0.5 ? 'true' : 'false';
        } else {
          row[col] = `Value ${i}_${index}`;
        }
      });
      data.push(row);
    }
    
    return data;
  };

  const csvData = useMemo(() => generateCsvData(), [file]);
  const columns = useMemo(() => getColumnConfig(csvData), [csvData]);

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
      csvData.forEach(row => {
        const value = row[column.key]?.toString() || '';
        if (value) values.add(value);
      });
      uniqueValues[column.key] = Array.from(values).sort();
    });
    
    return uniqueValues;
  }, [csvData, columns]);

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = csvData.filter(row => {
      return Object.entries(columnFilters).every(([field, filterValue]) => {
        if (!filterValue) return true;
        
        const rowValue = row[field]?.toString().toLowerCase() || '';
        return rowValue.includes(filterValue.toLowerCase());
      });
    });

    // Only sort if a sort field is selected, otherwise maintain original order
    if (sortField) {
      filtered.sort((a, b) => {
        const aValue = a[sortField]?.toString() || '';
        const bValue = b[sortField]?.toString() || '';
        
        const comparison = aValue.localeCompare(bValue);
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return filtered;
  }, [csvData, columnFilters, sortField, sortDirection]);

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

  const getCellValue = (row: any, columnKey: string) => {
    const value = row[columnKey];
    
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
    
    // Display value as string
    return value.toString();
  };

  return (
    <div className="h-full flex flex-col bg-card">
      {/* CSV Data Table - Direct table display without header */}
      <div className="flex-1 table-scroll-container table-container">
        <table 
          className="text-sm border-collapse" 
          style={{ 
            minWidth: `${Math.max(totalMinWidth, 1000)}px`,
            width: `${Math.max(totalMinWidth, 1000)}px`
          }}
        >
          {/* Table Header */}
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
          
          {/* Table Body */}
          <tbody>
            {filteredAndSortedData.map((row, index) => (
              <tr 
                key={index} 
                className={`border-b border-border hover:bg-muted hover:bg-opacity-30 transition-colors ${
                  index % 2 === 0 ? 'bg-card' : 'bg-accent'
                }`}
              >
                {columns.map((column) => (
                  <td 
                    key={column.key}
                    className="px-4 py-3 border-r border-border text-foreground overflow-hidden"
                    style={{ 
                      width: column.width,
                      maxWidth: column.width,
                      minWidth: column.width
                    }}
                    title={getCellValue(row, column.key)}
                  >
                    <div className="truncate">
                      {getCellValue(row, column.key)}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredAndSortedData.length === 0 && (
          <div className="text-center py-8 bg-card">
            <div className="text-muted-foreground text-sm">
              {Object.values(columnFilters).some(filter => filter) 
                ? 'No entries match your filter criteria'
                : 'No data found in this file'
              }
            </div>
          </div>
        )}
      </div>
      
      {/* Footer with filtering info */}
      {Object.values(columnFilters).some(filter => filter) && (
        <div className="px-4 py-2 border-t border-border bg-muted text-xs text-muted-foreground shrink-0">
          Showing {filteredAndSortedData.length} of {csvData.length} rows
          {Object.values(columnFilters).some(filter => filter) && ' (filtered)'}
        </div>
      )}
    </div>
  );
}