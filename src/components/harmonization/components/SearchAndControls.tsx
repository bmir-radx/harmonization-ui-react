import React from 'react';
import { SortingControls, type SortOption } from './SortingControls';
import { FilteringControls, type DataType } from './FilteringControls';

interface SearchAndControlsProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
  selectedTypes: Set<DataType>;
  onTypesChange: (types: Set<DataType>) => void;
}

export function SearchAndControls({
  searchTerm,
  onSearchChange,
  currentSort,
  onSortChange,
  selectedTypes,
  onTypesChange
}: SearchAndControlsProps) {
  return (
    <div className="p-3 border-b border-[#3c3c3c] shrink-0 space-y-2">
      {/* Search Box */}
      <div className="bg-[#252526] border border-[#3c3c3c] rounded px-3 py-1.5 flex items-center gap-2">
        <svg className="w-4 h-4 text-[#808080] shrink-0" fill="none" viewBox="0 0 16 16">
          <path
            d="M6.5 12C9.53757 12 12 9.53757 12 6.5C12 3.46243 9.53757 1 6.5 1C3.46243 1 1 3.46243 1 6.5C1 9.53757 3.46243 12 6.5 12Z"
            stroke="currentColor"
            strokeWidth="1.33333"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14 14L11.1 11.1"
            stroke="currentColor"
            strokeWidth="1.33333"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <input
          type="text"
          placeholder="Search source data elements..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="bg-transparent text-[#cccccc] text-sm outline-none flex-1 placeholder-[#808080] min-w-0"
        />
      </div>

      {/* Controls Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <SortingControls 
            currentSort={currentSort}
            onSortChange={onSortChange}
          />
          <FilteringControls
            selectedTypes={selectedTypes}
            onTypesChange={onTypesChange}
          />
        </div>
        
        {/* Results count indicator */}
        <div className="text-xs text-[#808080]">
          {selectedTypes.size < 5 && selectedTypes.size > 0 && (
            <span>{selectedTypes.size} type{selectedTypes.size !== 1 ? 's' : ''}</span>
          )}
        </div>
      </div>
    </div>
  );
}