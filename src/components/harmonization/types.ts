export interface TableRow {
  id: string;
  dataset: string;
  element: string;
  elementType: string;
  target?: string;
  targetType?: string;
  hasError?: boolean;
  isReady?: boolean;
}

export interface HarmonizationStep {
  id: number;
  primitive: string;
  parameters: Parameters;
}

export interface Parameters {
  sourceUnit?: string;
  targetUnit?: string;
  maxLength?: number;
  sourceType?: string;
  targetType?: string;
  mappingTable?: Array<{ key: string; value: string }>;
  binRows?: Array<{ lower: string; upper: string; label: string }>;
  operation?: string;
  sourceFormat?: string;
  targetFormat?: string;
  precision?: number;
  lowerBound?: number;
  upperBound?: number;
}

export interface DataFile {
  id: string;
  name: string;
  type: 'csv' | 'xlsx';
  size: number;
  uploadedAt?: Date;
  uploadDate?: string;
  columns?: string[];
  rowCount?: number;
  data?: any[];
}

export interface DataDictionaryEntry {
  id: string;
  name: string;
  type: string;
  description?: string;
  required?: boolean;
  constraints?: string[];
  children?: DataDictionaryEntry[];
}

export interface DataDictionary {
  id: string;
  name: string;
  version?: string;
  description?: string;
  entries: DataDictionaryEntry[];
  uploadedAt?: Date;
  createdAt?: string;
}

export interface Dataset {
  id: string;
  name: string;
  description?: string;
  files: DataFile[];
  dictionary?: DataDictionary;
  uploadedAt?: Date;
  createdAt?: string;
  isExpanded?: boolean;
}

export interface FileTab {
  id: string;
  type: 'file' | 'dictionary';
  title: string;
  datasetName: string;
  content: DataFile | DataDictionary;
}

export interface MappingsTab {
  id: string;
  title: string;
  content: any; // Will be defined based on mappings content
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  lastModified: Date;
}

export interface HarmonizationState {
  tableData: TableRow[];
  selectedRow: TableRow | null;
  selectedRowIds: Set<string>;
  selectedStep: HarmonizationStep | null;
  selectedPrimitive: string;
  parameters: Parameters;
  harmonizationStepsByRow: Record<string, HarmonizationStep[]>;
  targetDropdownOpen: Record<string, boolean>;
  targetSearchTerms: Record<string, string>;
  activeTab: string | null;
  openTabs: FileTab[];
  sourceDatasets: Dataset[];
  targetDatasets: Dataset[];
  dataDictionaries: Record<string, DataDictionary>;
  showMappingsTabs: boolean;
  showPreviewTab: boolean;
  pendingFileUpload?: {
    file: File;
    resolve: (type: 'data' | 'dictionary' | null) => void;
    showDialog: boolean;
    selectedDatasetId?: string;
  };
}

// Additional types for better type safety
export type DataType = 'string' | 'numeric' | 'integer' | 'date' | 'boolean' | 'text' | 'varchar' | 'float';

export interface ParsedDictionaryEntry {
  id: string;
  datatype: string;
  description?: string;
  [key: string]: any;
}

export type FileType = 'dictionary' | 'data';

export interface PendingFileUpload {
  file: File;
  type?: FileType;
}

export interface TargetElement {
  id: string;
  name: string;
  type: string;
  description?: string;
}