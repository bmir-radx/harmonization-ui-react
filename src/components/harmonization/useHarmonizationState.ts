import { useState, useCallback } from 'react';
import { HarmonizationState, TableRow, HarmonizationStep, Parameters, Dataset, DataDictionary, DataDictionaryEntry, FileTab, DataFile } from './types';

const INITIAL_STATE: HarmonizationState = {
  tableData: [],
  selectedRow: null,
  selectedRowIds: new Set(),
  selectedStep: null,
  selectedPrimitive: '',
  parameters: {},
  harmonizationStepsByRow: {},
  targetDropdownOpen: {},
  targetSearchTerms: {},
  activeTab: null,
  openTabs: [],
  sourceDatasets: [],
  targetDatasets: [],
  dataDictionaries: {},
  showMappingsTabs: false,
  showPreviewTab: false
};

// Enhanced mock data generation functions
const generateMockDictionaryEntries = (datasetNumber: number): DataDictionaryEntry[] => {
  const baseEntries = [
    { id: 'nih_record_id', name: 'nih_record_id', type: 'string', description: 'NIH record identifier', required: true },
    { id: 'nih_age', name: 'nih_age', type: 'numeric', description: 'Age in years', required: true },
    { id: 'nih_asthma', name: 'nih_asthma', type: 'string', description: 'Asthma status', required: false },
    { id: 'consent_mdy', name: 'consent_mdy', type: 'date', description: 'Consent date', required: true },
    { id: 'gender', name: 'gender', type: 'string', description: 'Participant gender', required: true },
    { id: 'height', name: 'height', type: 'numeric', description: 'Height measurement', required: false },
    { id: 'weight', name: 'weight', type: 'numeric', description: 'Weight measurement', required: false },
    { id: 'race', name: 'race', type: 'string', description: 'Race/ethnicity', required: false },
    { id: 'smoking_status', name: 'smoking_status', type: 'string', description: 'Smoking status', required: false },
    { id: 'income', name: 'income', type: 'numeric', description: 'Annual income', required: false }
  ];

  if (datasetNumber === 2) {
    baseEntries.push(
      { id: 'nih_existing_condition', name: 'nih_existing_condition', type: 'string', description: 'Existing medical conditions', required: false },
      { id: 'baseline_bmi', name: 'baseline_bmi', type: 'numeric', description: 'Baseline BMI measurement', required: false },
      { id: 'blood_pressure', name: 'blood_pressure', type: 'string', description: 'Blood pressure reading', required: false },
      { id: 'cholesterol', name: 'cholesterol', type: 'numeric', description: 'Cholesterol level', required: false },
      { id: 'medication_list', name: 'medication_list', type: 'string', description: 'Current medications', required: false }
    );
  }

  if (datasetNumber === 3) {
    baseEntries.push(
      { id: 'education_level', name: 'education_level', type: 'string', description: 'Education level', required: false },
      { id: 'diabetes_status', name: 'diabetes_status', type: 'boolean', description: 'Diabetes diagnosis status', required: false },
      { id: 'hypertension_diagnosis', name: 'hypertension_diagnosis', type: 'boolean', description: 'Hypertension diagnosis', required: false },
      { id: 'exercise_frequency', name: 'exercise_frequency', type: 'numeric', description: 'Exercise frequency per week', required: false },
      { id: 'diet_type', name: 'diet_type', type: 'string', description: 'Dietary preferences', required: false },
      { id: 'mental_health_score', name: 'mental_health_score', type: 'numeric', description: 'Mental health assessment score', required: false },
      { id: 'family_history', name: 'family_history', type: 'string', description: 'Family medical history', required: false }
    );
  }

  if (datasetNumber === 4) {
    baseEntries.push(
      { id: 'sleep_duration', name: 'sleep_duration', type: 'numeric', description: 'Average sleep duration in hours', required: false },
      { id: 'stress_level', name: 'stress_level', type: 'string', description: 'Self-reported stress level', required: false },
      { id: 'alcohol_consumption', name: 'alcohol_consumption', type: 'string', description: 'Alcohol consumption frequency', required: false },
      { id: 'social_support', name: 'social_support', type: 'numeric', description: 'Social support score', required: false },
      { id: 'work_status', name: 'work_status', type: 'string', description: 'Employment status', required: false },
      { id: 'insurance_type', name: 'insurance_type', type: 'string', description: 'Health insurance type', required: false }
    );
  }

  if (datasetNumber === 5) {
    baseEntries.push(
      { id: 'marital_status', name: 'marital_status', type: 'string', description: 'Marital status', required: false },
      { id: 'number_of_children', name: 'number_of_children', type: 'numeric', description: 'Number of children', required: false },
      { id: 'geographic_region', name: 'geographic_region', type: 'string', description: 'Geographic region', required: false },
      { id: 'urban_rural', name: 'urban_rural', type: 'string', description: 'Urban or rural setting', required: false },
      { id: 'transportation_access', name: 'transportation_access', type: 'boolean', description: 'Access to transportation', required: false },
      { id: 'language_preference', name: 'language_preference', type: 'string', description: 'Primary language', required: false },
      { id: 'technology_access', name: 'technology_access', type: 'boolean', description: 'Access to technology', required: false }
    );
  }

  return baseEntries;
};

// Generate target dictionary entries for testing
const generateMockTargetDictionaryEntries = (): DataDictionaryEntry[] => {
  return [
    { id: 'target_id', name: 'participant_id', type: 'string', description: 'Unique participant identifier', required: true },
    { id: 'target_age', name: 'age_years', type: 'integer', description: 'Participant age in years', required: true },
    { id: 'target_height', name: 'height_cm', type: 'numeric', description: 'Height in centimeters', required: false },
    { id: 'target_weight', name: 'weight_kg', type: 'numeric', description: 'Weight in kilograms', required: false },
    { id: 'target_gender', name: 'gender', type: 'string', description: 'Participant gender', required: true },
    { id: 'target_education', name: 'education_level', type: 'string', description: 'Highest education level completed', required: false },
    { id: 'target_consent', name: 'consent_date', type: 'date', description: 'Date of informed consent', required: true },
    { id: 'target_asthma', name: 'asthma_diagnosis', type: 'boolean', description: 'Asthma diagnosis status', required: false },
    { id: 'target_diabetes', name: 'diabetes_status', type: 'boolean', description: 'Diabetes diagnosis', required: false },
    { id: 'target_bmi', name: 'body_mass_index', type: 'numeric', description: 'Calculated BMI value', required: false }
  ];
};

const generateMockDataset = (datasetNumber: number): Dataset => {
  const dataFiles = [
    {
      id: `file_${datasetNumber}_1`,
      name: `cohort_${datasetNumber}_data.csv`,
      type: 'csv' as const,
      size: 1024 * (50 + datasetNumber * 10), // Variable file sizes
      uploadedAt: new Date(),
      columns: ['nih_record_id', 'nih_age', 'nih_asthma', 'consent_mdy'],
      rowCount: 1000 + datasetNumber * 500
    }
  ];

  return {
    id: `dataset_${datasetNumber}`,
    name: `Cohort ${datasetNumber} Study`,
    description: `Research cohort ${datasetNumber} dataset`,
    files: dataFiles,
    dictionary: {
      id: `dict_${datasetNumber}`,
      name: `cohort_${datasetNumber}_dictionary.csv`,
      version: '1.0',
      entries: generateMockDictionaryEntries(datasetNumber),
      uploadedAt: new Date()
    },
    uploadedAt: new Date(),
    isExpanded: false
  };
};

// Generate target dataset for testing
const generateMockTargetDataset = (): Dataset => {
  const dataFiles = [
    {
      id: 'target_file_1',
      name: 'harmonized_data_template.csv',
      type: 'csv' as const,
      size: 1024 * 25,
      uploadedAt: new Date(),
      columns: ['participant_id', 'age_years', 'height_cm', 'weight_kg', 'gender'],
      rowCount: 0 // Empty template
    }
  ];

  return {
    id: 'target_dataset_1',
    name: 'Harmonized Target Schema',
    description: 'Target schema for harmonized data output',
    files: dataFiles,
    dictionary: {
      id: 'target_dict_1',
      name: 'harmonized_dictionary.csv',
      version: '1.0',
      entries: generateMockTargetDictionaryEntries(),
      uploadedAt: new Date()
    },
    uploadedAt: new Date(),
    isExpanded: false
  };
};

// Helper function to parse CSV line with proper quote handling
const parseCSVLine = (line: string): string[] => {
  const values = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
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
  return values;
};

// CSV parsing function for data files - PRESERVE ALL COLUMNS AND ACTUAL DATA  
const parseCsvDataFile = (csvContent: string): any[] => {
  try {
    const lines = csvContent.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      console.warn('📊 Data CSV has less than 2 lines');
      return [];
    }
    
    // Parse header row - preserve exact column names
    const headers = parseCSVLine(lines[0]);
    console.log('📊 Data CSV Headers found:', headers);
    
    // Parse data rows - create objects with exact column structure
    const data: any[] = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const values = parseCSVLine(line);
      
      // Create data row object with exact CSV structure
      const dataRow: any = {};
      headers.forEach((header, index) => {
        dataRow[header] = values[index] || '';
      });
      
      data.push(dataRow);
    }
    
    console.log('✅ Data file rows parsed:', data.length);
    console.log('📊 Sample data row:', data[0]);
    return data;
  } catch (error) {
    console.error('❌ Error parsing CSV data file:', error);
    return [];
  }
};

// CSV parsing function for dictionary files - PRESERVE ALL ORIGINAL COLUMNS
const parseCsvDictionaryFile = (csvContent: string): DataDictionaryEntry[] => {
  try {
    const lines = csvContent.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      console.warn('📚 Dictionary CSV has less than 2 lines');
      return [];
    }
    
    // Parse header row - PRESERVE ORIGINAL CASE
    const originalHeaders = parseCSVLine(lines[0]);
    console.log('📚 Dictionary CSV Headers found (original case):', originalHeaders);
    
    // Find the name column for basic dictionary structure
    const lowercaseHeaders = originalHeaders.map(h => h.toLowerCase());
    const nameIndex = lowercaseHeaders.findIndex(h => {
      const patterns = [
        'name', 'variable', 'field', 'column', 'var', 'varname', 'variable_name',
        'field_name', 'column_name', 'element', 'element_name', 'identifier'
      ];
      return patterns.some(pattern => h.includes(pattern));
    });
    
    console.log('📚 Name column index:', nameIndex, nameIndex >= 0 ? originalHeaders[nameIndex] : 'NOT FOUND');
    
    // If no name column found, use first column as name
    const actualNameIndex = nameIndex >= 0 ? nameIndex : 0;
    
    if (originalHeaders.length === 0) {
      console.error('❌ No headers found in dictionary CSV');
      return [];
    }
    
    // Parse all dictionary entries preserving ALL columns from CSV
    const entries: DataDictionaryEntry[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const values = parseCSVLine(line);
      const name = values[actualNameIndex];
      if (!name || name.length === 0) continue;
      
      // Create entry with ALL original CSV columns preserved
      const entry: DataDictionaryEntry = {
        id: `entry_${i}`,
        name: name,
        type: 'string', // Default type, will be overridden if type column exists
        description: '', // Default description, will be overridden if description column exists  
        required: false // Default required, will be overridden if required column exists
      } as any; // Use 'as any' to allow adding extra properties
      
      // Add ALL original CSV columns as properties on the entry
      originalHeaders.forEach((header, index) => {
        const value = values[index] || '';
        
        // Map common column names to standard properties
        const lowerHeader = header.toLowerCase();
        if (lowerHeader.includes('type') || lowerHeader.includes('datatype')) {
          entry.type = value || 'string';
        } else if (lowerHeader.includes('description') || lowerHeader.includes('desc') || lowerHeader.includes('label')) {
          entry.description = value;
        } else if (lowerHeader.includes('required') || lowerHeader.includes('mandatory')) {
          entry.required = ['true', 'yes', '1', 'required', 'mandatory'].includes(value.toLowerCase());
        }
        
        // Always preserve the original column with original header name
        (entry as any)[header] = value;
      });
      
      entries.push(entry);
    }
    
    console.log('✅ Dictionary entries parsed with ALL columns preserved:', entries.length);
    if (entries.length > 0) {
      console.log('📊 Sample entry with all columns:', entries[0]);
      console.log('🔍 Available properties on first entry:', Object.keys(entries[0]));
    }
    return entries;
    
  } catch (error) {
    console.error('❌ Error parsing dictionary CSV:', error);
    return [];
  }
};

// Helper function for backwards compatibility - no longer filters columns
const parseDictionaryWithFirstColumnAsName = (lines: string[], headers: string[]): DataDictionaryEntry[] => {
  // Use the new comprehensive parser with first column as name
  return parseCsvDictionaryFile(lines.join('\n'));
};

export function useHarmonizationState() {
  const [state, setState] = useState<HarmonizationState>(INITIAL_STATE);

  const updateTableData = useCallback((data: TableRow[]) => {
    setState(prev => ({ ...prev, tableData: data }));
  }, []);

  const setSelectedRow = useCallback((row: TableRow | null) => {
    setState(prev => ({ ...prev, selectedRow: row }));
  }, []);

  const setSelectedRowIds = useCallback((ids: Set<string>) => {
    setState(prev => ({ ...prev, selectedRowIds: ids }));
  }, []);

  const setSelectedStep = useCallback((step: HarmonizationStep | null) => {
    setState(prev => ({ ...prev, selectedStep: step }));
  }, []);

  const updateHarmonizationSteps = useCallback((rowId: string, steps: HarmonizationStep[]) => {
    setState(prev => ({
      ...prev,
      harmonizationStepsByRow: {
        ...prev.harmonizationStepsByRow,
        [rowId]: steps
      }
    }));
  }, []);

  const addHarmonizationStep = useCallback((rowId: string) => {
    setState(prev => {
      const currentSteps = prev.harmonizationStepsByRow[rowId] || [];
      const newStep: HarmonizationStep = {
        id: Date.now(),
        primitive: '',
        parameters: {}
      };
      
      return {
        ...prev,
        harmonizationStepsByRow: {
          ...prev.harmonizationStepsByRow,
          [rowId]: [...currentSteps, newStep]
        },
        selectedStep: newStep
      };
    });
  }, []);

  const removeHarmonizationStep = useCallback((rowId: string, stepId: number) => {
    setState(prev => {
      const currentSteps = prev.harmonizationStepsByRow[rowId] || [];
      const updatedSteps = currentSteps.filter(step => step.id !== stepId);
      
      return {
        ...prev,
        harmonizationStepsByRow: {
          ...prev.harmonizationStepsByRow,
          [rowId]: updatedSteps
        },
        selectedStep: prev.selectedStep?.id === stepId ? null : prev.selectedStep
      };
    });
  }, []);

  const updateStepParameters = useCallback((primitive: string, parameters: Parameters) => {
    setState(prev => {
      if (!prev.selectedStep) return prev;
      
      const updatedStep = { ...prev.selectedStep, primitive, parameters };
      const rowId = prev.selectedRow?.id;
      
      if (!rowId) return { ...prev, selectedStep: updatedStep, selectedPrimitive: primitive, parameters };
      
      const currentSteps = prev.harmonizationStepsByRow[rowId] || [];
      const updatedSteps = currentSteps.map(step => 
        step.id === prev.selectedStep?.id ? updatedStep : step
      );
      
      return {
        ...prev,
        selectedStep: updatedStep,
        selectedPrimitive: primitive,
        parameters,
        harmonizationStepsByRow: {
          ...prev.harmonizationStepsByRow,
          [rowId]: updatedSteps
        }
      };
    });
  }, []);

  const handleTargetSelection = useCallback((rowId: string, targetElement: any) => {
    setState(prev => {
      const updatedTableData = prev.tableData.map(row => 
        row.id === rowId 
          ? { ...row, target: targetElement.name, targetType: targetElement.type, hasError: false }
          : row
      );
      
      return {
        ...prev,
        tableData: updatedTableData,
        targetDropdownOpen: { ...prev.targetDropdownOpen, [rowId]: false }
      };
    });
  }, []);

  const setTargetDropdownOpen = useCallback((dropdownState: Record<string, boolean>) => {
    setState(prev => ({ ...prev, targetDropdownOpen: dropdownState }));
  }, []);

  const setTargetSearchTerms = useCallback((searchTerms: Record<string, string>) => {
    setState(prev => ({ ...prev, targetSearchTerms: searchTerms }));
  }, []);

  const setActiveTab = useCallback((tab: string | null) => {
    setState(prev => ({ ...prev, activeTab: tab }));
  }, []);

  // Tab management functions
  const openFileTab = useCallback((tab: FileTab) => {
    setState(prev => {
      // Check if tab is already open
      const existingTab = prev.openTabs.find(t => t.id === tab.id);
      if (existingTab) {
        // Switch to existing tab
        return { ...prev, activeTab: tab.id };
      }
      
      // Add new tab
      return {
        ...prev,
        openTabs: [...prev.openTabs, tab],
        activeTab: tab.id
      };
    });
  }, []);

  const closeFileTab = useCallback((tabId: string) => {
    setState(prev => {
      const updatedTabs = prev.openTabs.filter(tab => tab.id !== tabId);
      let newActiveTab = prev.activeTab;
      
      // If we're closing the active tab, switch to another tab or default
      if (prev.activeTab === tabId) {
        if (updatedTabs.length > 0) {
          // Switch to the last remaining tab
          newActiveTab = updatedTabs[updatedTabs.length - 1].id;
        } else {
          // No tabs left, default to mappings if available
          newActiveTab = prev.sourceDatasets.length > 0 && prev.targetDatasets.length > 0 ? 'mappings' : null;
        }
      }
      
      return {
        ...prev,
        openTabs: updatedTabs,
        activeTab: newActiveTab
      };
    });
  }, []);

  const handleReadyClick = useCallback(() => {
    console.log('Ready clicked with selected rows:', state.selectedRowIds);
    // Just log the action - do not automatically open preview tab
    // Preview tab will be opened manually when user clicks on the Preview tab
  }, [state.selectedRowIds]);

  const openPreviewTab = useCallback(() => {
    setState(prev => ({
      ...prev,
      showPreviewTab: true,
      activeTab: 'preview'
    }));
  }, []);

  const closeMappingsTab = useCallback((tabType: 'mappings' | 'preview') => {
    setState(prev => {
      // If we're closing mappings tab, close both mappings and preview
      if (tabType === 'mappings') {
        return {
          ...prev,
          showMappingsTabs: false,
          showPreviewTab: false,
          activeTab: prev.openTabs.length > 0 ? prev.openTabs[prev.openTabs.length - 1].id : null
        };
      }
      
      // If we're closing preview tab, hide it and go back to mappings
      if (tabType === 'preview') {
        return {
          ...prev,
          showPreviewTab: false,
          activeTab: 'mappings'
        };
      }
      
      return prev;
    });
  }, []);

  const handleSaveRule = useCallback(() => {
    setState(prev => {
      if (!prev.selectedRow) return prev;
      
      const updatedTableData = prev.tableData.map(row => 
        row.id === prev.selectedRow?.id ? { ...row, isReady: true } : row
      );
      
      return {
        ...prev,
        tableData: updatedTableData,
        selectedRow: null,
        selectedStep: null
      };
    });
  }, []);

  const addSourceDataset = useCallback((dataset: Dataset) => {
    setState(prev => ({
      ...prev,
      sourceDatasets: [...prev.sourceDatasets, dataset]
    }));
  }, []);

  const updateSourceDataset = useCallback((updatedDataset: Dataset) => {
    setState(prev => ({
      ...prev,
      sourceDatasets: prev.sourceDatasets.map(dataset => 
        dataset.id === updatedDataset.id ? updatedDataset : dataset
      )
    }));
  }, []);

  const addTargetDataset = useCallback((dataset: Dataset) => {
    setState(prev => ({
      ...prev,
      targetDatasets: [...prev.targetDatasets, dataset]
    }));
  }, []);

  const updateTargetDataset = useCallback((updatedDataset: Dataset) => {
    setState(prev => ({
      ...prev,
      targetDatasets: prev.targetDatasets.map(dataset => 
        dataset.id === updatedDataset.id ? updatedDataset : dataset
      )
    }));
  }, []);

  const addDataDictionary = useCallback((datasetId: string, dictionary: DataDictionary) => {
    setState(prev => ({
      ...prev,
      dataDictionaries: {
        ...prev.dataDictionaries,
        [datasetId]: dictionary
      }
    }));
  }, []);

  // Function to open mappings tabs
  const openMappingsTabs = useCallback(() => {
    setState(prev => {
      // Generate table data from source dictionaries when opening mappings
      const tableData = generateTableDataFromSourceDictionaries(prev.sourceDatasets);
      
      return {
        ...prev,
        showMappingsTabs: true,
        showPreviewTab: false, // Explicitly don't show preview tab initially
        activeTab: 'mappings', // Only open mappings tab, not preview
        tableData: tableData
      };
    });
  }, []);

  // Function to generate table data from source dictionaries
  const generateTableDataFromSourceDictionaries = (sourceDatasets: Dataset[]) => {
    const tableData: any[] = [];
    let rowIndex = 1;

    sourceDatasets.forEach(dataset => {
      if (dataset.dictionary && dataset.dictionary.entries) {
        dataset.dictionary.entries.forEach(entry => {
          tableData.push({
            id: rowIndex.toString(),
            dataset: dataset.name,
            element: entry.name,
            target: null,
            targetType: null,
            hasError: true, // Initially no target selected
            isReady: false
          });
          rowIndex++;
        });
      }
    });

    return tableData;
  };

  // Function to generate sample data for testing
  const generateSampleData = useCallback(() => {
    const sampleSourceDatasets = [
      generateMockDataset(1),
      generateMockDataset(2),
      generateMockDataset(3),  // Add third dataset for more rows
      generateMockDataset(4),  // Add fourth dataset for even more rows
      generateMockDataset(5)   // Add fifth dataset for testing scrolling
    ];
    
    const sampleTargetDatasets = [
      generateMockTargetDataset()
    ];
    
    setState(prev => ({
      ...prev,
      sourceDatasets: sampleSourceDatasets,
      targetDatasets: sampleTargetDatasets
    }));
  }, []);

  // Handle upload source data action - with file type dialog and "Dataset 1" creation
  const handleUploadSourceData = useCallback((selectedDatasetId?: string) => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.csv,.xlsx';
    fileInput.multiple = true;
    
    fileInput.onchange = async (event) => {
      const files = (event.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        const filesArray = Array.from(files);
        
        // Process files with type selection for each file
        const processFilesWithTypeSelection = async () => {
          try {
            for (const file of filesArray) {
              // Show file type dialog for each file
              const fileType = await new Promise<'data' | 'dictionary' | null>((resolve) => {
                setState(prev => ({
                  ...prev,
                  pendingFileUpload: {
                    file,
                    resolve,
                    showDialog: true,
                    selectedDatasetId
                  }
                }));
              });

              if (!fileType) continue; // User cancelled

              // File processing is now handled in handleFileTypeSelection
              console.log(`✅ User selected "${fileType}" for file: ${file.name}`);
            }
          } catch (error) {
            console.error('Error processing files:', error);
            alert('Error processing files. Please try again.');
          }
        };

        processFilesWithTypeSelection();
      }
    };
    
    fileInput.click();
  }, []);

  // Handle create target dictionary action - same functionality as right sidebar
  const handleCreateTargetDictionary = useCallback(() => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.csv,.xlsx';
    
    fileInput.onchange = async (event) => {
      const files = (event.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        const file = files[0];
        
        try {
          // Mock target dictionary structure
          const mockDictionary: DataDictionary = {
            id: `dict_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: file.name,
            description: 'Target data dictionary for harmonization',
            version: '1.0.0',
            uploadedAt: new Date(),
            entries: [
              { id: '1', name: 'patient_id', type: 'string', required: true, description: 'Unique patient identifier' },
              { id: '2', name: 'age', type: 'integer', required: true, description: 'Patient age in years' },
              { id: '3', name: 'gender', type: 'string', required: false, description: 'Patient gender' },
              { id: '4', name: 'diagnosis', type: 'string', required: true, description: 'Primary diagnosis' },
              { id: '5', name: 'treatment_date', type: 'datetime', required: false, description: 'Date of treatment' }
            ]
          };

          const newDataset: Dataset = {
            id: `target_dataset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: file.name.replace(/\.[^/.]+$/, ""),
            files: [],
            dictionary: mockDictionary,
            uploadedAt: new Date()
          };

          addTargetDataset(newDataset);
        } catch (error) {
          console.error('Error processing dictionary file:', error);
          alert('Error processing dictionary file. Please try again.');
        }
      }
    };
    
    fileInput.click();
  }, [addTargetDataset]);

  // Handle file type selection and process files - COMPLETELY REWRITTEN FOR BETTER RELIABILITY
  const handleFileTypeSelection = useCallback(async (type: 'data' | 'dictionary' | null) => {
    setState(prev => {
      if (!prev.pendingFileUpload || !type) {
        if (prev.pendingFileUpload) {
          prev.pendingFileUpload.resolve(null);
        }
        return {
          ...prev,
          pendingFileUpload: undefined
        };
      }

      const { file, selectedDatasetId } = prev.pendingFileUpload;
      
      // Resolve the promise immediately to close the dialog
      prev.pendingFileUpload.resolve(type);

      // Process file synchronously within setState
      if (type === 'dictionary') {
        console.log('🔄 Processing dictionary file:', file.name);
        
        // Process dictionary file
        file.text().then(fileContent => {
          const parsedEntries = parseCsvDictionaryFile(fileContent);
          
          if (parsedEntries.length > 0) {
            const dictionary: DataDictionary = {
              id: `dict_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              name: file.name,
              version: '1.0',
              entries: parsedEntries,
              uploadedAt: new Date()
            };

            console.log('✅ Dictionary created with', parsedEntries.length, 'entries');

            // Update state with dictionary
            setState(prevState => {
              // If we have a selected dataset, add dictionary to it
              if (selectedDatasetId) {
                const selectedDataset = prevState.sourceDatasets.find(d => d.id === selectedDatasetId);
                if (selectedDataset) {
                  const updatedDatasets = prevState.sourceDatasets.map(dataset =>
                    dataset.id === selectedDatasetId
                      ? { ...dataset, dictionary: dictionary }
                      : dataset
                  );

                  console.log('✅ Added dictionary to selected dataset:', selectedDataset.name);
                  
                  return {
                    ...prevState,
                    sourceDatasets: updatedDatasets
                  };
                }
              }

              if (prevState.sourceDatasets.length === 0) {
                // Create "Dataset 1" with the dictionary
                const newDataset: Dataset = {
                  id: `dataset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                  name: "Dataset 1",
                  description: "Uploaded dataset",
                  files: [],
                  dictionary: dictionary,
                  uploadedAt: new Date()
                };

                console.log('✅ Created "Dataset 1" with dictionary');
                
                return {
                  ...prevState,
                  sourceDatasets: [newDataset]
                };
              } else {
                // Add dictionary to first existing dataset or create new dataset
                const datasetName = file.name.replace(/\.[^/.]+$/, "");
                const existingDataset = prevState.sourceDatasets.find(d => d.name.toLowerCase() === datasetName.toLowerCase());
                
                if (existingDataset) {
                  // Add dictionary to existing dataset
                  const updatedDatasets = prevState.sourceDatasets.map(dataset =>
                    dataset.id === existingDataset.id
                      ? { ...dataset, dictionary: dictionary }
                      : dataset
                  );

                  console.log('✅ Added dictionary to existing dataset:', existingDataset.name);
                  
                  return {
                    ...prevState,
                    sourceDatasets: updatedDatasets
                  };
                } else {
                  // Create new dataset with dictionary
                  const newDataset: Dataset = {
                    id: `dataset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    name: datasetName,
                    description: `Dataset with dictionary from ${file.name}`,
                    files: [],
                    dictionary: dictionary,
                    uploadedAt: new Date()
                  };

                  console.log('✅ Created new dataset with dictionary:', newDataset.name);
                  
                  return {
                    ...prevState,
                    sourceDatasets: [...prevState.sourceDatasets, newDataset]
                  };
                }
              }
            });
          } else {
            console.error('❌ No dictionary entries parsed from file');
            alert('Error: Could not parse dictionary file. Please check the file format.');
          }
        }).catch(error => {
          console.error('❌ Error reading dictionary file:', error);
          alert('Error reading dictionary file. Please try again.');
        });
        
      } else if (type === 'data') {
        console.log('🔄 Processing data file:', file.name);
        
        // Process data file
        file.text().then(fileContent => {
          // Parse actual CSV content - NO MORE MOCK DATA
          const parsedData = parseCsvDataFile(fileContent);
          
          if (parsedData.length === 0) {
            console.error('❌ No data parsed from file');
            alert('Error: Could not parse data file. Please check the file format.');
            return;
          }

          const dataFile: DataFile = {
            id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: file.name,
            type: file.name.toLowerCase().endsWith('.csv') ? 'csv' : 'xlsx',
            size: file.size,
            uploadedAt: new Date(),
            columns: Object.keys(parsedData[0] || {}),
            rowCount: parsedData.length,
            data: parsedData // Store the ACTUAL parsed data
          };

          console.log('✅ Data file processed with actual CSV data:', dataFile.rowCount, 'rows');

          // Add data file to datasets
          setState(prevState => {
            // If we have a selected dataset, add data file to it
            if (selectedDatasetId) {
              const selectedDataset = prevState.sourceDatasets.find(d => d.id === selectedDatasetId);
              if (selectedDataset) {
                const updatedDatasets = prevState.sourceDatasets.map(dataset =>
                  dataset.id === selectedDatasetId
                    ? { ...dataset, files: [...dataset.files, dataFile] }
                    : dataset
                );

                console.log('✅ Added data file to selected dataset:', selectedDataset.name);
                
                return {
                  ...prevState,
                  sourceDatasets: updatedDatasets
                };
              }
            }

            if (prevState.sourceDatasets.length === 0) {
              const newDataset: Dataset = {
                id: `dataset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                name: "Dataset 1",
                description: "Uploaded dataset",
                files: [dataFile],
                uploadedAt: new Date()
              };
              
              console.log('✅ Created "Dataset 1" with data file');
              
              return {
                ...prevState,
                sourceDatasets: [newDataset]
              };
            } else {
              const datasetName = file.name.replace(/\.[^/.]+$/, "");
              const existingDataset = prevState.sourceDatasets.find(d => d.name.toLowerCase() === datasetName.toLowerCase());
              
              if (existingDataset) {
                const updatedDatasets = prevState.sourceDatasets.map(dataset =>
                  dataset.id === existingDataset.id
                    ? { ...dataset, files: [...dataset.files, dataFile] }
                    : dataset
                );
                
                console.log('✅ Added data file to existing dataset:', existingDataset.name);
                
                return {
                  ...prevState,
                  sourceDatasets: updatedDatasets
                };
              } else {
                const newDataset: Dataset = {
                  id: `dataset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                  name: datasetName,
                  description: `Uploaded dataset from ${file.name}`,
                  files: [dataFile],
                  uploadedAt: new Date()
                };
                
                console.log('✅ Created new dataset with data file:', newDataset.name);
                
                return {
                  ...prevState,
                  sourceDatasets: [...prevState.sourceDatasets, newDataset]
                };
              }
            }
          });
          
        }).catch(error => {
          console.error('❌ Error reading data file:', error);
          alert('Error reading data file. Please try again.');
        });
      }

      return {
        ...prev,
        pendingFileUpload: undefined
      };
    });
  }, []);

  // Close file type dialog
  const closeFileTypeDialog = useCallback(() => {
    setState(prev => {
      if (prev.pendingFileUpload) {
        prev.pendingFileUpload.resolve(null);
        return {
          ...prev,
          pendingFileUpload: undefined
        };
      }
      return prev;
    });
  }, []);

  return {
    state,
    actions: {
      updateTableData,
      setSelectedRow,
      setSelectedRowIds,
      setSelectedStep,
      updateHarmonizationSteps,
      addHarmonizationStep,
      removeHarmonizationStep,
      updateStepParameters,
      handleTargetSelection,
      setTargetDropdownOpen,
      setTargetSearchTerms,
      setActiveTab,
      openFileTab,
      closeFileTab,
      handleReadyClick,
      handleSaveRule,
      addSourceDataset,
      updateSourceDataset,
      addTargetDataset,
      updateTargetDataset,
      addDataDictionary,
      generateSampleData,
      openMappingsTabs,
      openPreviewTab,
      closeMappingsTab,
      handleUploadSourceData,
      handleCreateTargetDictionary,
      handleFileTypeSelection,
      closeFileTypeDialog
    }
  };
}