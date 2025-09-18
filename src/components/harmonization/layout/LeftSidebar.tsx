import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { ChevronDown, ChevronRight, FolderOpen, FileText, Database, Upload, Plus, Table } from 'lucide-react';
import { Dataset, DataDictionary, DataDictionaryEntry, DataFile, FileTab } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui/tooltip';
import DictionaryIcon from '../../../imports/Component1-92-1321';
import Margin from '../../../imports/Margin';
import svgPaths from "../../../imports/svg-3qayjgztbr";
import { SearchAndControls } from '../components/SearchAndControls';
import { type SortOption } from '../components/SortingControls';
import { type DataType } from '../components/FilteringControls';
import { useTheme } from '../context/ThemeContext';

interface LeftSidebarProps {
  datasets: Dataset[];
  dataDictionaries: Record<string, DataDictionary>;
  onAddDataset: (dataset: Dataset) => void;
  onAddDataDictionary: (datasetId: string, dictionary: DataDictionary) => void;
  onUpdateDataset?: (updatedDataset: Dataset) => void;
  onOpenFileTab?: (tab: FileTab) => void;
  onUploadSourceData?: (selectedDatasetId?: string) => void;
}

interface PendingFile {
  file: File;
  index: number;
}

// String type icon component
function StringTypeIcon() {
  return (
    <div className="relative w-4 h-4" data-name="StringType">
      <div className="relative w-full h-full">
        <div className="box-border content-stretch flex flex-col items-center justify-center relative w-full h-full">
          <div className="font-['Inter:Bold',_sans-serif] font-bold leading-[0] not-italic relative shrink-0 text-[#4ec9b0] text-[14px] text-center">
            <p className="block leading-[normal] whitespace-pre">s</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Integer type icon component (changed from i to n)
function IntegerTypeIcon() {
  return (
    <div className="relative w-4 h-4" data-name="IntegerType">
      <div className="relative w-full h-full">
        <div className="box-border content-stretch flex flex-col items-center justify-center relative w-full h-full">
          <div className="font-['Inter:Bold',_sans-serif] font-bold leading-[0] not-italic relative shrink-0 text-[#007fd4] text-[14px] text-center">
            <p className="block leading-[normal] whitespace-pre">n</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Decimal type icon component with distinct orange color
function DecimalTypeIcon() {
  return (
    <div className="relative w-4 h-4" data-name="DecimalType">
      <div className="relative w-full h-full">
        <div className="box-border content-stretch flex flex-col items-center justify-center relative w-full h-full">
          <div className="font-['Inter:Bold',_sans-serif] font-bold leading-[0] not-italic relative shrink-0 text-[#ff9500] text-[14px] text-center">
            <p className="block leading-[normal] whitespace-pre">d</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// DateTime type icon component
function DateTimeTypeIcon() {
  return (
    <div className="relative w-4 h-4" data-name="DateTimeType">
      <div className="relative w-full h-full">
        <div className="box-border content-stretch flex flex-col items-center justify-center relative w-full h-full">
          <div className="font-['Inter:Bold',_sans-serif] font-bold leading-[0] not-italic relative shrink-0 text-[#c586c0] text-[14px] text-center">
            <p className="block leading-[normal] whitespace-pre">t</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Boolean type icon component with distinctive color
function BooleanTypeIcon() {
  return (
    <div className="relative w-4 h-4" data-name="BooleanType">
      <div className="relative w-full h-full">
        <div className="box-border content-stretch flex flex-col items-center justify-center relative w-full h-full">
          <div className="font-['Inter:Bold',_sans-serif] font-bold leading-[0] not-italic relative shrink-0 text-[#ff6b6b] text-[14px] text-center">
            <p className="block leading-[normal] whitespace-pre">b</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Fixed Type indicator component that properly reads datatype from each entry
function TypeIndicator({ entry }: { entry: DataDictionaryEntry }) {
  const getDatatypeFromEntry = (entry: DataDictionaryEntry): string => {
    // Debug: Log the entire entry to see what fields are available
    const entryFields = Object.keys(entry);
    console.log(`Entry "${entry.name}" has fields:`, entryFields);
    
    // List of possible datatype column names to check (case-insensitive)
    const possibleDatatypeFields = [
      'datatype', 'data_type', 'type', 'dtype', 'DataType', 'Data_Type', 
      'field_type', 'column_type', 'var_type', 'variable_type'
    ];
    
    // Check each possible field name (case-insensitive)
    for (const field of possibleDatatypeFields) {
      // First check exact match
      if (entry.hasOwnProperty(field)) {
        const value = (entry as any)[field];
        if (value && typeof value === 'string' && value.trim()) {
          console.log(`✅ Found datatype "${value}" in exact field "${field}" for entry "${entry.name}"`);
          return value.toLowerCase().trim();
        }
      }
      
      // Then check case-insensitive match
      const foundField = entryFields.find(f => f.toLowerCase() === field.toLowerCase());
      if (foundField) {
        const value = (entry as any)[foundField];
        if (value && typeof value === 'string' && value.trim()) {
          console.log(`✅ Found datatype "${value}" in case-insensitive field "${foundField}" for entry "${entry.name}"`);
          return value.toLowerCase().trim();
        }
      }
    }
    
    // If no datatype field found, log what we have and return default
    console.log(`❌ No datatype field found for entry "${entry.name}". Available fields:`, entryFields);
    return 'string'; // Default fallback
  };

  const getTypeIcon = (entry: DataDictionaryEntry) => {
    const dataType = getDatatypeFromEntry(entry);
    console.log(`🎯 Entry "${entry.name}" has datatype "${dataType}"`);
    
    // More precise type checking with exact matches first
    switch (dataType) {
      case 'string':
      case 'text':
      case 'varchar':
      case 'char':
      case 'str':
      case 'categorical':
        console.log(`📝 Using STRING icon for "${entry.name}" (${dataType})`);
        return <StringTypeIcon />;
        
      case 'integer':
      case 'int':
      case 'number':
      case 'numeric':
      case 'whole':
        console.log(`🔢 Using INTEGER icon for "${entry.name}" (${dataType})`);
        return <IntegerTypeIcon />;
        
      case 'decimal':
      case 'float':
      case 'double':
      case 'real':
      case 'currency':
      case 'money':
        console.log(`💰 Using DECIMAL icon for "${entry.name}" (${dataType})`);
        return <DecimalTypeIcon />;
        
      case 'date':
      case 'time':
      case 'datetime':
      case 'timestamp':
      case 'temporal':
        console.log(`📅 Using DATETIME icon for "${entry.name}" (${dataType})`);
        return <DateTimeTypeIcon />;
        
      case 'boolean':
      case 'bool':
      case 'logical':
      case 'binary':
      case 'flag':
      case 'indicator':
        console.log(`✅ Using BOOLEAN icon for "${entry.name}" (${dataType})`);
        return <BooleanTypeIcon />;
        
      default:
        // Fallback to partial matches
        if (dataType.includes('string') || dataType.includes('text') || dataType.includes('char')) {
          console.log(`📝 Using STRING icon for "${entry.name}" (partial match: ${dataType})`);
          return <StringTypeIcon />;
        } else if (dataType.includes('int') || dataType.includes('number') || dataType.includes('numeric')) {
          console.log(`🔢 Using INTEGER icon for "${entry.name}" (partial match: ${dataType})`);
          return <IntegerTypeIcon />;
        } else if (dataType.includes('decimal') || dataType.includes('float') || dataType.includes('double')) {
          console.log(`💰 Using DECIMAL icon for "${entry.name}" (partial match: ${dataType})`);
          return <DecimalTypeIcon />;
        } else if (dataType.includes('date') || dataType.includes('time')) {
          console.log(`📅 Using DATETIME icon for "${entry.name}" (partial match: ${dataType})`);
          return <DateTimeTypeIcon />;
        } else if (dataType.includes('bool') || dataType.includes('flag')) {
          console.log(`✅ Using BOOLEAN icon for "${entry.name}" (partial match: ${dataType})`);
          return <BooleanTypeIcon />;
        } else {
          console.log(`❓ Unknown datatype "${dataType}" for entry "${entry.name}", using STRING icon`);
          return <StringTypeIcon />; // Default to string for unknown types
        }
    }
  };

  return (
    <div className="w-4 h-4 shrink-0 flex items-center justify-center">
      {getTypeIcon(entry)}
    </div>
  );
}

// Helper function to normalize data type for filtering
function normalizeDataType(entry: DataDictionaryEntry): DataType {
  // Look for datatype in various possible column names from CSV
  const possibleDatatypeFields = [
    'datatype', 'data_type', 'type', 'dtype', 'DataType', 'Data_Type',
    'field_type', 'column_type', 'var_type', 'variable_type'
  ];
  
  let dataType = 'string';
  for (const field of possibleDatatypeFields) {
    const value = (entry as any)[field];
    if (value && typeof value === 'string' && value.trim()) {
      dataType = value.toLowerCase().trim();
      break;
    }
  }
  
  // If no datatype field found, fallback to internal type
  if (dataType === 'string' && entry.type) {
    dataType = entry.type.toLowerCase();
  }
  
  if (dataType.includes('int') || dataType.includes('integer') || dataType.includes('number') || dataType.includes('numeric')) {
    return 'integer';
  } else if (dataType.includes('decimal') || dataType.includes('float') || dataType.includes('double') || dataType.includes('real')) {
    return 'decimal';
  } else if (dataType.includes('date') || dataType.includes('time') || dataType.includes('timestamp')) {
    return 'datetime';
  } else if (dataType.includes('bool') || dataType.includes('boolean') || dataType.includes('logical')) {
    return 'boolean';
  } else {
    return 'string';
  }
}

// Dictionary entry component with proper indenting and dynamic type icons
function DictionaryEntryComponent({ 
  entry, 
  isSelected, 
  onSelect,
  level = 2
}: { 
  entry: DataDictionaryEntry;
  isSelected: boolean;
  onSelect: () => void;
  level?: number;
}) {
  const { isDarkMode } = useTheme();
  const leftMargin = (level + 1) * 24; // 72px for dictionary entries (level 2 = 72px)
  
  const selectedClass = isSelected ? (isDarkMode ? 'bg-[#094771]' : 'bg-[#e3f2fd]') : '';
  
  return (
    <div 
      className={`flex items-center gap-3 py-1 px-2 text-sm whitespace-nowrap cursor-pointer ${selectedClass}`}
      style={{ marginLeft: `${leftMargin}px` }}
      onClick={onSelect}
    >
      <TypeIndicator entry={entry} />
      <span className="text-[#cccccc] flex-1 truncate">{entry.name}</span>
    </div>
  );
}

// Data file component with different icon and double-click tab opening
function DataFileComponent({ 
  file,
  datasetName,
  isSelected, 
  onSelect,
  onOpenTab
}: { 
  file: DataFile;
  datasetName: string;
  isSelected: boolean;
  onSelect: () => void;
  onOpenTab?: (tab: FileTab) => void;
}) {
  const { isDarkMode } = useTheme();
  
  const handleClick = () => {
    onSelect();
  };

  const handleDoubleClick = () => {
    if (onOpenTab) {
      const tab: FileTab = {
        id: `file-${file.id}`,
        type: 'file',
        title: file.name,
        datasetName: datasetName,
        content: file
      };
      onOpenTab(tab);
    }
  };

  const selectedClass = isSelected ? (isDarkMode ? 'bg-[#094771]' : 'bg-[#e3f2fd]') : '';

  return (
    <div 
      className={`flex items-center gap-2 p-2 whitespace-nowrap cursor-pointer sidebar-file-item ${selectedClass}`}
      style={{ marginLeft: '48px' }} // Level 1 indenting (48px)
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {/* Different icon for data files - using Table icon */}
      <Table className="w-4 h-4 text-[#569cd6] shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-[#cccccc] text-sm truncate">{file.name}</div>
      </div>
    </div>
  );
}

// Dictionary file component with proper indenting and double-click tab opening
function DictionaryFileComponent({ 
  dictionary,
  datasetName,
  isExpanded, 
  onToggle, 
  isSelected, 
  onSelect,
  selectedEntryId,
  onSelectEntry,
  filteredEntries,
  onOpenTab
}: { 
  dictionary: DataDictionary;
  datasetName: string;
  isExpanded: boolean; 
  onToggle: () => void;
  isSelected: boolean;
  onSelect: () => void;
  selectedEntryId: string | null;
  onSelectEntry: (entryId: string) => void;
  filteredEntries: DataDictionaryEntry[];
  onOpenTab?: (tab: FileTab) => void;
}) {
  const { isDarkMode } = useTheme();
  
  const handleChevronClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle(); // Only toggle, don't select
  };

  const handleDictionaryClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(); // Select the dictionary
  };

  const handleDictionaryDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onOpenTab) {
      const tab: FileTab = {
        id: `dictionary-${dictionary.id}`,
        type: 'dictionary',
        title: dictionary.name,
        datasetName: datasetName,
        content: dictionary
      };
      onOpenTab(tab);
    }
  };

  const selectedClass = isSelected ? (isDarkMode ? 'bg-[#094771]' : 'bg-[#e3f2fd]') : '';
  const hoverClass = isDarkMode ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#f3f4f6]';

  return (
    <div>
      <div 
        className={`flex items-center gap-2 p-2 cursor-pointer whitespace-nowrap sidebar-dictionary-item ${selectedClass}`}
        style={{ marginLeft: '48px' }} // Level 1 indenting (48px)
        onClick={handleDictionaryClick}
        onDoubleClick={handleDictionaryDoubleClick}
      >
        <div 
          className={`w-4 h-4 shrink-0 flex items-center justify-center cursor-pointer ${hoverClass} rounded`}
          onClick={handleChevronClick}
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-[#808080]" />
          ) : (
            <ChevronRight className="w-4 h-4 text-[#808080]" />
          )}
        </div>
        <div className="w-4 h-4 shrink-0">
          <DictionaryIcon />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[#cccccc] text-sm truncate">{dictionary.name}</div>
        </div>
        {filteredEntries.length !== dictionary.entries.length && (
          <div className="text-xs text-[#808080] shrink-0">
            {filteredEntries.length}/{dictionary.entries.length}
          </div>
        )}
      </div>
      
      {isExpanded && (
        <div>
          {filteredEntries.map((entry) => (
            <DictionaryEntryComponent 
              key={entry.id} 
              entry={entry}
              isSelected={selectedEntryId === entry.id}
              onSelect={() => onSelectEntry(entry.id)}
              level={2} // Dictionary entries are at level 2
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Dataset component with proper indenting
function DatasetComponent({ 
  dataset, 
  isExpanded, 
  onToggle, 
  dictionaryExpanded, 
  onDictionaryToggle,
  selectedItemId,
  selectedItemType,
  onSelectItem,
  filteredEntries,
  onOpenTab
}: { 
  dataset: Dataset; 
  isExpanded: boolean; 
  onToggle: () => void;
  dictionaryExpanded: boolean;
  onDictionaryToggle: () => void;
  selectedItemId: string | null;
  selectedItemType: string | null;
  onSelectItem: (itemId: string, itemType: 'dataset' | 'file' | 'dictionary' | 'entry') => void;
  filteredEntries: DataDictionaryEntry[];
  onOpenTab?: (tab: FileTab) => void;
}) {
  const { isDarkMode } = useTheme();
  
  const handleChevronClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle(); // Only toggle, don't select
  };

  const handleDatasetClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectItem(dataset.id, 'dataset'); // Only select, don't toggle
  };

  const isDatasetSelected = selectedItemId === dataset.id && selectedItemType === 'dataset';
  const selectedClass = isDatasetSelected ? (isDarkMode ? 'bg-[#094771]' : 'bg-[#e3f2fd]') : '';
  const hoverClass = isDarkMode ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#f3f4f6]';

  return (
    <div>
      <div 
        className={`flex items-center gap-2 p-2 cursor-pointer whitespace-nowrap sidebar-dataset-item ${selectedClass}`}
        style={{ marginLeft: '24px' }} // Level 0 indenting (24px)
        onClick={handleDatasetClick}
      >
        <div 
          className={`w-4 h-4 shrink-0 flex items-center justify-center cursor-pointer ${hoverClass} rounded`}
          onClick={handleChevronClick}
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-[#808080]" />
          ) : (
            <ChevronRight className="w-4 h-4 text-[#808080]" />
          )}
        </div>
        <FolderOpen className="w-5 h-5 text-[#007FD4] shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-[#cccccc] font-medium truncate">{dataset.name}</div>
        </div>
      </div>

      {isExpanded && (
        <div>
          {/* Data Files */}
          {dataset.files.map((file) => (
            <DataFileComponent 
              key={file.id} 
              file={file}
              datasetName={dataset.name}
              isSelected={selectedItemId === file.id && selectedItemType === 'file'}
              onSelect={() => onSelectItem(file.id, 'file')}
              onOpenTab={onOpenTab}
            />
          ))}
          
          {/* Data Dictionary */}
          {dataset.dictionary && (
            <DictionaryFileComponent 
              dictionary={dataset.dictionary}
              datasetName={dataset.name}
              isExpanded={dictionaryExpanded}
              onToggle={onDictionaryToggle}
              isSelected={selectedItemId === dataset.dictionary.id && selectedItemType === 'dictionary'}
              onSelect={() => onSelectItem(dataset.dictionary!.id, 'dictionary')}
              selectedEntryId={selectedItemType === 'entry' ? selectedItemId : null}
              onSelectEntry={(entryId) => onSelectItem(entryId, 'entry')}
              filteredEntries={filteredEntries}
              onOpenTab={onOpenTab}
            />
          )}
        </div>
      )}
    </div>
  );
}

export function LeftSidebar({ datasets, dataDictionaries, onAddDataset, onAddDataDictionary, onUpdateDataset, onOpenFileTab, onUploadSourceData }: LeftSidebarProps) {
  const [expandedDatasets, setExpandedDatasets] = useState<Set<string>>(new Set());
  const [expandedDictionaries, setExpandedDictionaries] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [currentSort, setCurrentSort] = useState<SortOption>('name-asc');
  const [selectedTypes, setSelectedTypes] = useState<Set<DataType>>(new Set(['string', 'integer', 'decimal', 'datetime', 'boolean']));
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedItemType, setSelectedItemType] = useState<'dataset' | 'file' | 'dictionary' | 'entry' | null>(null);

  // Track previous datasets to detect new files and dictionaries
  const [prevDatasets, setPrevDatasets] = useState<Dataset[]>([]);

  // Handle upload source data - use the centralized function from useHarmonizationState
  const handleUploadClick = useCallback(() => {
    if (onUploadSourceData) {
      // Pass the selected dataset ID if a dataset is selected
      const selectedDatasetId = selectedItemType === 'dataset' && selectedItemId ? selectedItemId : undefined;
      onUploadSourceData(selectedDatasetId);
    }
  }, [onUploadSourceData, selectedItemType, selectedItemId]);

  // Auto-expand when files or dictionaries are added
  useEffect(() => {
    if (prevDatasets.length > 0) {
      const newExpandedDatasets = new Set(expandedDatasets);
      const newExpandedDictionaries = new Set(expandedDictionaries);
      
      datasets.forEach(dataset => {
        const prevDataset = prevDatasets.find(prev => prev.id === dataset.id);
        
        // Check if this is a completely new dataset
        if (!prevDataset) {
          newExpandedDatasets.add(dataset.id);
          // If new dataset has a dictionary, expand it too
          if (dataset.dictionary) {
            newExpandedDictionaries.add(dataset.dictionary.id);
          }
          return;
        }
        
        // Check if new files were added to existing dataset
        if (dataset.files.length > prevDataset.files.length) {
          newExpandedDatasets.add(dataset.id);
        }
        
        // Check if dictionary was added or changed
        if (dataset.dictionary) {
          if (!prevDataset.dictionary || prevDataset.dictionary.id !== dataset.dictionary.id) {
            newExpandedDatasets.add(dataset.id);
            newExpandedDictionaries.add(dataset.dictionary.id);
          }
        }
      });
      
      setExpandedDatasets(newExpandedDatasets);
      setExpandedDictionaries(newExpandedDictionaries);
    } else if (datasets.length > 0 && prevDatasets.length === 0) {
      // Initial load - expand all datasets and dictionaries
      const newExpandedDatasets = new Set<string>();
      const newExpandedDictionaries = new Set<string>();
      
      datasets.forEach(dataset => {
        newExpandedDatasets.add(dataset.id);
        if (dataset.dictionary) {
          newExpandedDictionaries.add(dataset.dictionary.id);
        }
      });
      
      setExpandedDatasets(newExpandedDatasets);
      setExpandedDictionaries(newExpandedDictionaries);
    }
    
    setPrevDatasets(datasets);
  }, [datasets, expandedDatasets, expandedDictionaries]);

  // Find the currently selected dataset
  const selectedDataset = useMemo(() => {
    if (selectedItemType === 'dataset' && selectedItemId) {
      return datasets.find(d => d.id === selectedItemId);
    }
    return null;
  }, [selectedItemId, selectedItemType, datasets]);

  // Memoized filtered and sorted entries for each dataset's dictionary
  const processedDatasets = useMemo(() => {
    return datasets.map(dataset => {
      if (!dataset.dictionary) return { dataset, filteredEntries: [] };

      // Filter entries based on search term and selected types
      let filteredEntries = dataset.dictionary.entries.filter(entry => {
        const matchesSearch = searchTerm === '' || 
          entry.name.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesType = selectedTypes.has(normalizeDataType(entry));
        
        return matchesSearch && matchesType;
      });

      // Sort entries
      filteredEntries.sort((a, b) => {
        switch (currentSort) {
          case 'name-asc':
            return a.name.localeCompare(b.name);
          case 'name-desc':
            return b.name.localeCompare(a.name);
          case 'type-asc':
            return normalizeDataType(a).localeCompare(normalizeDataType(b));
          case 'type-desc':
            return normalizeDataType(b).localeCompare(normalizeDataType(a));
          default:
            return 0;
        }
      });

      return { dataset, filteredEntries };
    });
  }, [datasets, searchTerm, selectedTypes, currentSort]);

  const toggleDataset = (datasetId: string) => {
    setExpandedDatasets(prev => {
      const newSet = new Set(prev);
      if (newSet.has(datasetId)) {
        newSet.delete(datasetId);
      } else {
        newSet.add(datasetId);
      }
      return newSet;
    });
  };

  const toggleDictionary = (dictionaryId: string) => {
    setExpandedDictionaries(prev => {
      const newSet = new Set(prev);
      if (newSet.has(dictionaryId)) {
        newSet.delete(dictionaryId);
      } else {
        newSet.add(dictionaryId);
      }
      return newSet;
    });
  };

  const handleItemSelection = (itemId: string, itemType: 'dataset' | 'file' | 'dictionary' | 'entry') => {
    // If the same item is clicked again, deselect it
    if (selectedItemId === itemId && selectedItemType === itemType) {
      setSelectedItemId(null);
      setSelectedItemType(null);
    } else {
      setSelectedItemId(itemId);
      setSelectedItemType(itemType);
    }
  };

  // Handle clicks outside the sidebar to deselect
  const handleSidebarClick = (e: React.MouseEvent) => {
    // If clicking on the sidebar background (not on any item), deselect
    if (e.target === e.currentTarget) {
      setSelectedItemId(null);
      setSelectedItemType(null);
    }
  };

  return (
    <div className="w-full h-full bg-[#2d2d30] border-r border-[#3c3c3c] flex flex-col" onClick={handleSidebarClick}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#3c3c3c] shrink-0" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="text-base font-medium text-[#cccccc] truncate">Source Datasets</h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleUploadClick}
                  className="p-1 text-[#007fd4] hover:bg-[#3c3c3c] rounded transition-colors shrink-0"
                >
                  <Upload className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Upload Source Data Files</p>
                <p className="text-xs text-muted-foreground">Supports CSV, Excel (.xlsx)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Search and Controls Section */}
      <div onClick={(e) => e.stopPropagation()}>
        <SearchAndControls
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          currentSort={currentSort}
          onSortChange={setCurrentSort}
          selectedTypes={selectedTypes}
          onTypesChange={setSelectedTypes}
        />
      </div>

      {/* Datasets Container */}
      <div className="flex-1 overflow-auto">
        <div className="min-w-max">
          {datasets.length === 0 ? (
            /* Empty State */
            <div className="text-center py-8 px-3" onClick={(e) => e.stopPropagation()}>
              <div className="w-12 h-12 bg-[#3c3c3c] rounded-full flex items-center justify-center mx-auto mb-3">
                <Database className="w-6 h-6 text-[#007fd4]" />
              </div>
              <h3 className="text-[#cccccc] font-medium mb-2 text-sm">No Source Datasets</h3>
              <p className="text-[#808080] text-xs mb-4 break-words leading-relaxed px-1">
                Upload your source data files to get started
              </p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={handleUploadClick}
                      className="bg-[#007fd4] text-white px-3 py-2 rounded text-xs hover:bg-[#005fa3] transition-colors flex items-center gap-1 mx-auto"
                    >
                      <Upload className="w-3 h-3" />
                      Upload Dataset
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Upload Source Data Files</p>
                    <p className="text-xs text-muted-foreground">Supports CSV, Excel (.xlsx)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ) : (
            <div className="space-y-1 min-w-max pt-2">
              {processedDatasets.map(({ dataset, filteredEntries }) => (
                <DatasetComponent
                  key={dataset.id}
                  dataset={dataset}
                  isExpanded={expandedDatasets.has(dataset.id)}
                  onToggle={() => toggleDataset(dataset.id)}
                  dictionaryExpanded={dataset.dictionary ? expandedDictionaries.has(dataset.dictionary.id) : false}
                  onDictionaryToggle={() => dataset.dictionary && toggleDictionary(dataset.dictionary.id)}
                  selectedItemId={selectedItemId}
                  selectedItemType={selectedItemType}
                  onSelectItem={handleItemSelection}
                  filteredEntries={filteredEntries}
                  onOpenTab={onOpenFileTab}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}