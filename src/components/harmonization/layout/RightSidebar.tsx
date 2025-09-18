import React, { useState, useRef, useMemo } from 'react';
import { ChevronDown, ChevronRight, FolderOpen, FileText, Database, Upload, Plus, PlusCircle, Table, ArrowRight, Edit, Pencil } from 'lucide-react';
import { Dataset, DataDictionary, DataDictionaryEntry, FileTab } from '../types';
import { Button } from '../../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui/tooltip';
import DictionaryIcon from '../../../imports/Component1-92-1321';
import { SearchAndControls } from '../components/SearchAndControls';
import { type SortOption } from '../components/SortingControls';
import { type DataType } from '../components/FilteringControls';
import { useTheme } from '../context/ThemeContext';

interface RightSidebarProps {
  datasets: Dataset[];
  dataDictionaries: Record<string, DataDictionary>;
  onAddDataset: (dataset: Dataset) => void;
  onAddDataDictionary: (datasetId: string, dictionary: DataDictionary) => void;
  onUpdateDataset?: (updatedDataset: Dataset) => void;
  onOpenFileTab?: (tab: FileTab) => void;
  onTriggerMappings?: () => void;
  sourceDatasets?: Dataset[];
}

// Type icon components (same as left sidebar)
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

// Type indicator component (same logic as left sidebar)
function TypeIndicator({ entry }: { entry: DataDictionaryEntry }) {
  const getDatatypeFromEntry = (entry: DataDictionaryEntry): string => {
    const entryFields = Object.keys(entry);
    const possibleDatatypeFields = [
      'datatype', 'data_type', 'type', 'dtype', 'DataType', 'Data_Type', 
      'field_type', 'column_type', 'var_type', 'variable_type'
    ];
    
    for (const field of possibleDatatypeFields) {
      if (entry.hasOwnProperty(field)) {
        const value = (entry as any)[field];
        if (value && typeof value === 'string' && value.trim()) {
          return value.toLowerCase().trim();
        }
      }
      
      const foundField = entryFields.find(f => f.toLowerCase() === field.toLowerCase());
      if (foundField) {
        const value = (entry as any)[foundField];
        if (value && typeof value === 'string' && value.trim()) {
          return value.toLowerCase().trim();
        }
      }
    }
    
    return 'string';
  };

  const getTypeIcon = (entry: DataDictionaryEntry) => {
    const dataType = getDatatypeFromEntry(entry);
    
    switch (dataType) {
      case 'string':
      case 'text':
      case 'varchar':
      case 'char':
      case 'str':
      case 'categorical':
        return <StringTypeIcon />;
      case 'integer':
      case 'int':
      case 'number':
      case 'numeric':
      case 'whole':
        return <IntegerTypeIcon />;
      case 'decimal':
      case 'float':
      case 'double':
      case 'real':
      case 'currency':
      case 'money':
        return <DecimalTypeIcon />;
      case 'date':
      case 'time':
      case 'datetime':
      case 'timestamp':
      case 'temporal':
        return <DateTimeTypeIcon />;
      case 'boolean':
      case 'bool':
      case 'logical':
      case 'binary':
      case 'flag':
      case 'indicator':
        return <BooleanTypeIcon />;
      default:
        if (dataType.includes('string') || dataType.includes('text') || dataType.includes('char')) {
          return <StringTypeIcon />;
        } else if (dataType.includes('int') || dataType.includes('number') || dataType.includes('numeric')) {
          return <IntegerTypeIcon />;
        } else if (dataType.includes('decimal') || dataType.includes('float') || dataType.includes('double')) {
          return <DecimalTypeIcon />;
        } else if (dataType.includes('date') || dataType.includes('time')) {
          return <DateTimeTypeIcon />;
        } else if (dataType.includes('bool') || dataType.includes('flag')) {
          return <BooleanTypeIcon />;
        } else {
          return <StringTypeIcon />;
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

// Dictionary entry component with update button
function DictionaryEntryComponent({ 
  entry, 
  isSelected, 
  onSelect,
  onUpdate
}: { 
  entry: DataDictionaryEntry;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: () => void;
}) {
  const { isDarkMode } = useTheme();
  
  const selectedClass = isSelected ? (isDarkMode ? 'bg-[#094771]' : 'bg-[#e3f2fd]') : '';
  
  return (
    <div 
      className={`flex items-center gap-3 py-1 px-3 text-sm cursor-pointer ${selectedClass} hover:bg-[#3c3c3c]`}
      onClick={onSelect}
    >
      <TypeIndicator entry={entry} />
      <span className="text-[#cccccc] flex-1 truncate pr-2">{entry.name}</span>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUpdate();
              }}
              className="p-1.5 text-[#808080] hover:text-[#007fd4] hover:bg-[#3c3c3c] rounded transition-colors shrink-0"
            >
              <Pencil className="w-4 h-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Update data element</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

// Dictionary component with create new elements button
function DictionaryComponent({ 
  dictionary,
  isExpanded, 
  onToggle, 
  isSelected, 
  onSelect,
  selectedEntryId,
  onSelectEntry,
  filteredEntries,
  onOpenTab,
  onUpdateEntry,
  onCreateNewElement
}: { 
  dictionary: DataDictionary;
  isExpanded: boolean; 
  onToggle: () => void;
  isSelected: boolean;
  onSelect: () => void;
  selectedEntryId: string | null;
  onSelectEntry: (entryId: string) => void;
  filteredEntries: DataDictionaryEntry[];
  onOpenTab?: (tab: FileTab) => void;
  onUpdateEntry: (entryId: string) => void;
  onCreateNewElement: () => void;
}) {
  const { isDarkMode } = useTheme();
  
  const handleChevronClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle();
  };

  const handleDictionaryClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
  };

  const handleDictionaryDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onOpenTab) {
      const tab: FileTab = {
        id: `dictionary-${dictionary.id}`,
        type: 'dictionary',
        title: dictionary.name,
        datasetName: 'Target Schema',
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
        className={`flex items-center gap-2 p-3 cursor-pointer sidebar-dictionary-item ${selectedClass}`}
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
          <div className="text-xs text-[#808080] shrink-0 mr-2">
            {filteredEntries.length}/{dictionary.entries.length}
          </div>
        )}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCreateNewElement();
                }}
                className="p-1.5 text-[#007fd4] hover:bg-[#3c3c3c] rounded transition-colors shrink-0"
              >
                <Plus className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add new data element</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {isExpanded && (
        <div className="ml-6">
          {filteredEntries.map((entry) => (
            <DictionaryEntryComponent 
              key={entry.id} 
              entry={entry}
              isSelected={selectedEntryId === entry.id}
              onSelect={() => onSelectEntry(entry.id)}
              onUpdate={() => onUpdateEntry(entry.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function RightSidebar({ 
  datasets, 
  dataDictionaries, 
  onAddDataset, 
  onAddDataDictionary, 
  onUpdateDataset,
  onOpenFileTab,
  onTriggerMappings,
  sourceDatasets = []
}: RightSidebarProps) {
  const [expandedDictionaries, setExpandedDictionaries] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [currentSort, setCurrentSort] = useState<SortOption>('name-asc');
  const [selectedTypes, setSelectedTypes] = useState<Set<DataType>>(new Set(['string', 'integer', 'decimal', 'datetime', 'boolean']));
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedItemType, setSelectedItemType] = useState<'dictionary' | 'entry' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if mappings can be triggered (both source and target dictionaries exist)
  const canTriggerMappings = useMemo(() => {
    const hasSourceDictionary = sourceDatasets.some(dataset => dataset.dictionary && dataset.dictionary.entries.length > 0);
    const hasTargetDictionary = datasets.some(dataset => dataset.dictionary && dataset.dictionary.entries.length > 0);
    return hasSourceDictionary && hasTargetDictionary;
  }, [sourceDatasets, datasets]);

  // Get all dictionaries directly from datasets
  const allDictionaries = useMemo(() => {
    return datasets.map(dataset => dataset.dictionary).filter(Boolean) as DataDictionary[];
  }, [datasets]);

  // Auto-expand dictionaries when they are added
  React.useEffect(() => {
    const newExpandedDictionaries = new Set(expandedDictionaries);
    allDictionaries.forEach(dictionary => {
      if (dictionary && dictionary.entries.length > 0) {
        newExpandedDictionaries.add(dictionary.id);
      }
    });
    setExpandedDictionaries(newExpandedDictionaries);
  }, [allDictionaries]);

  // Filtered and sorted entries for each dictionary
  const processedDictionaries = useMemo(() => {
    return allDictionaries.map(dictionary => {
      let filteredEntries = dictionary.entries.filter(entry => {
        const matchesSearch = searchTerm === '' || 
          entry.name.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesType = selectedTypes.has(normalizeDataType(entry));
        
        return matchesSearch && matchesType;
      });

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

      return { dictionary, filteredEntries };
    });
  }, [allDictionaries, searchTerm, selectedTypes, currentSort]);

  // Enhanced CSV parsing (same as left sidebar)
  const parseCsvContent = (csvContent: string): DataDictionaryEntry[] => {
    try {
      const lines = csvContent.split('\n').filter(line => line.trim());
      if (lines.length < 2) return [];
      
      const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
      const entries: DataDictionaryEntry[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const values = [];
        let current = '';
        let inQuotes = false;
        
        for (let j = 0; j < line.length; j++) {
          const char = line[j];
          if (char === '"' || char === "'") {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            values.push(current.trim().replace(/^["']|["']$/g, ''));
            current = '';
          } else {
            current += char;
          }
        }
        values.push(current.trim().replace(/^["']|["']$/g, ''));
        
        const entry: any = {
          id: `row_${i}`,
          name: values[0] || `row_${i}`,
          type: 'string',
          required: false
        };
        
        headers.forEach((header, index) => {
          entry[header] = values[index] || '';
        });
        
        entries.push(entry);
      }
      
      return entries;
    } catch (error) {
      console.error('Error parsing CSV content:', error);
      return [];
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target?.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };

  const parseJsonContent = (jsonContent: string): DataDictionaryEntry[] => {
    try {
      const data = JSON.parse(jsonContent);
      let entries: any[] = [];
      
      if (Array.isArray(data)) {
        entries = data;
      } else if (data.entries && Array.isArray(data.entries)) {
        entries = data.entries;
      } else if (data.dictionary && Array.isArray(data.dictionary)) {
        entries = data.dictionary;
      }
      
      return entries.map((entry, index) => ({
        id: `entry_${index}`,
        name: entry.id || entry.name || `entry_${index}`,
        type: 'string',
        required: false,
        ...entry
      }));
    } catch (error) {
      console.error('Error parsing JSON content:', error);
      return [];
    }
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

  const handleItemSelection = (itemId: string, itemType: 'dictionary' | 'entry') => {
    if (selectedItemId === itemId && selectedItemType === itemType) {
      setSelectedItemId(null);
      setSelectedItemType(null);
    } else {
      setSelectedItemId(itemId);
      setSelectedItemType(itemType);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsProcessing(true);

    try {
      // Process each file as a dictionary directly (no modal)
      for (const file of Array.from(files)) {
        const fileContent = await readFileContent(file);
        let entries: DataDictionaryEntry[] = [];
        
        if (file.name.toLowerCase().endsWith('.csv')) {
          entries = parseCsvContent(fileContent);
        } else if (file.name.toLowerCase().endsWith('.json')) {
          entries = parseJsonContent(fileContent);
        } else {
          entries = parseCsvContent(fileContent);
        }

        if (entries.length === 0) {
          entries = [{
            id: 'no_entries_found',
            name: 'no_entries_found',
            type: 'string',
            description: 'No valid entries found in the uploaded file',
            required: false
          }];
        }

        const newDictionary: DataDictionary = {
          id: Date.now().toString(),
          name: file.name,
          version: '1.0',
          entries: entries,
          uploadedAt: new Date()
        };

        const mockDataset: Dataset = {
          id: Date.now().toString(),
          name: `Target Schema ${datasets.length + 1}`,
          description: 'Target data dictionary',
          files: [],
          dictionary: newDictionary,
          uploadedAt: new Date(),
          isExpanded: true
        };
        
        onAddDataset(mockDataset);
      }
    } catch (error) {
      console.error('Error processing files:', error);
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleConstructDictionary = () => {
    const newDictionary: DataDictionary = {
      id: Date.now().toString(),
      name: 'Constructed Dictionary',
      version: '1.0',
      entries: [
        {
          id: 'id',
          name: 'id',
          type: 'string',
          description: 'Primary identifier',
          required: true
        }
      ],
      uploadedAt: new Date()
    };

    const mockDataset: Dataset = {
      id: Date.now().toString(),
      name: `Target Schema ${datasets.length + 1}`,
      description: 'Manually constructed data dictionary',
      files: [],
      dictionary: newDictionary,
      uploadedAt: new Date(),
      isExpanded: true
    };

    onAddDataset(mockDataset);
  };

  const handleUpdateEntry = (entryId: string) => {
    console.log('Update entry:', entryId);
    // TODO: Implement entry update functionality
  };

  const handleCreateNewElement = (dictionaryId: string) => {
    console.log('Create new element for dictionary:', dictionaryId);
    // TODO: Implement new element creation functionality
  };

  return (
    <div className="w-full h-full bg-[#2d2d30] border-l border-[#3c3c3c] flex flex-col">
      {/* Header */}
      <div className="px-3 py-3 border-b border-[#3c3c3c] shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-[#cccccc] truncate mr-2">Target Data Dictionary</h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1 text-[#007fd4] hover:bg-[#3c3c3c] hover:border-[#007fd4] border border-transparent rounded transition-colors shrink-0"
                  disabled={isProcessing}
                >
                  <Upload className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Upload Target Dictionary</p>
                <p className="text-xs text-muted-foreground">Supports CSV, Excel (.xlsx), JSON</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".csv,.xlsx,.json"
          onChange={handleFileUpload}
          className="hidden"
          disabled={isProcessing}
        />
      </div>

      {/* Mappings Trigger Button */}
      {canTriggerMappings && (
        <div className="px-3 py-2 border-b border-[#3c3c3c] shrink-0">
          <button
            onClick={onTriggerMappings}
            className="w-full bg-[#007fd4] text-white px-2 py-1.5 rounded text-xs hover:bg-[#005fa3] transition-colors flex items-center gap-1.5 justify-center font-medium"
          >
            <ArrowRight className="w-3 h-3" />
            Start Mappings
          </button>
        </div>
      )}

      {/* Search and Controls Section */}
      {allDictionaries.length > 0 && (
        <div>
          <SearchAndControls
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            currentSort={currentSort}
            onSortChange={setCurrentSort}
            selectedTypes={selectedTypes}
            onTypesChange={setSelectedTypes}
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {allDictionaries.length === 0 ? (
          /* Empty State - Fixed width to prevent overflow */
          <div className="text-center py-4 px-3">
            <div className="w-10 h-10 bg-[#3c3c3c] rounded-full flex items-center justify-center mx-auto mb-3">
              <div className="w-5 h-5">
                <DictionaryIcon />
              </div>
            </div>
            <h3 className="text-[#cccccc] font-medium mb-2 text-sm">No Target Dictionary</h3>
            <p className="text-[#808080] text-xs mb-3 leading-relaxed">
              Create or upload target data dictionary
            </p>
            
            <div className="space-y-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-[#4CAF50] text-white px-2 py-1.5 rounded text-xs hover:bg-[#45a049] hover:border-[#4CAF50] border border-transparent transition-colors flex items-center gap-1 justify-center"
                disabled={isProcessing}
              >
                <Upload className="w-3 h-3" />
                Upload
              </button>
              
              <button
                onClick={handleConstructDictionary}
                className="w-full bg-[#007fd4] text-white px-2 py-1.5 rounded text-xs hover:bg-[#005fa3] hover:border-[#007fd4] border border-transparent transition-colors flex items-center gap-1 justify-center"
                disabled={isProcessing}
              >
                <PlusCircle className="w-3 h-3" />
                Construct
              </button>
            </div>
          </div>
        ) : (
          /* Dictionary Content */
          <div className="overflow-x-auto">
            <div className="min-w-max space-y-1 pt-2">
              {processedDictionaries.map(({ dictionary, filteredEntries }) => (
                <DictionaryComponent
                  key={dictionary.id}
                  dictionary={dictionary}
                  isExpanded={expandedDictionaries.has(dictionary.id)}
                  onToggle={() => toggleDictionary(dictionary.id)}
                  isSelected={selectedItemId === dictionary.id && selectedItemType === 'dictionary'}
                  onSelect={() => handleItemSelection(dictionary.id, 'dictionary')}
                  selectedEntryId={selectedItemType === 'entry' ? selectedItemId : null}
                  onSelectEntry={(entryId) => handleItemSelection(entryId, 'entry')}
                  filteredEntries={filteredEntries}
                  onOpenTab={onOpenFileTab}
                  onUpdateEntry={handleUpdateEntry}
                  onCreateNewElement={() => handleCreateNewElement(dictionary.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}