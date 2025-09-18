import React from 'react';
import { Filter, X } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../../ui/dropdown-menu';
import { useTheme } from '../context/ThemeContext';

export type DataType = 'string' | 'integer' | 'decimal' | 'datetime' | 'boolean';

interface FilteringControlsProps {
  selectedTypes: Set<DataType>;
  onTypesChange: (types: Set<DataType>) => void;
}

const DATA_TYPE_OPTIONS: { value: DataType; label: string; color: string; icon: string }[] = [
  { value: 'string', label: 'String', color: '#4ec9b0', icon: 's' },
  { value: 'integer', label: 'Integer', color: '#007fd4', icon: 'n' },
  { value: 'decimal', label: 'Decimal', color: '#ff9500', icon: 'd' },
  { value: 'datetime', label: 'DateTime', color: '#c586c0', icon: 't' },
  { value: 'boolean', label: 'Boolean', color: '#ff6b6b', icon: 'b' },
];

export function FilteringControls({ selectedTypes, onTypesChange }: FilteringControlsProps) {
  const { isDarkMode } = useTheme();
  const hasActiveFilters = selectedTypes.size > 0 && selectedTypes.size < DATA_TYPE_OPTIONS.length;

  const handleTypeToggle = (type: DataType) => {
    const newTypes = new Set(selectedTypes);
    if (newTypes.has(type)) {
      newTypes.delete(type);
    } else {
      newTypes.add(type);
    }
    onTypesChange(newTypes);
  };

  const handleClearFilters = () => {
    onTypesChange(new Set(DATA_TYPE_OPTIONS.map(option => option.value)));
  };

  const handleSelectAll = () => {
    onTypesChange(new Set(DATA_TYPE_OPTIONS.map(option => option.value)));
  };

  const handleSelectNone = () => {
    onTypesChange(new Set());
  };

  // Consistent blue hover colors for both themes
  const filterButtonClass = hasActiveFilters 
    ? 'text-[#007fd4] hover:bg-[#007fd4] hover:bg-opacity-10 hover:text-[#007fd4]'
    : 'text-[#6b7280] hover:bg-[#007fd4] hover:bg-opacity-10 hover:text-[#007fd4]';

  const clearButtonClass = 'text-[#6b7280] hover:bg-[#007fd4] hover:bg-opacity-10 hover:text-[#007fd4]';

  const dropdownContentClass = isDarkMode
    ? 'bg-[#2d2d30] border-[#3c3c3c] text-[#cccccc]'
    : 'bg-white border-[#e5e7eb] text-[#1a1a1a]';

  const headerTextClass = isDarkMode
    ? 'text-[#808080]'
    : 'text-[#6b7280]';

  const buttonHoverClass = 'hover:bg-[#007fd4] hover:bg-opacity-10 hover:text-[#007fd4]';

  const borderClass = isDarkMode
    ? 'border-[#3c3c3c]'
    : 'border-[#e5e7eb]';

  return (
    <div className="flex items-center gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={`h-8 px-2 border-none bg-transparent rounded cursor-pointer flex items-center justify-center transition-colors ${filterButtonClass}`}
            title={hasActiveFilters ? `Filter: ${selectedTypes.size} types` : 'Filter by data type'}
          >
            <Filter className="w-4 h-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="start" 
          side="bottom"
          sideOffset={4}
          className={`${dropdownContentClass} min-w-[180px] z-50`}
        >
          <div className={`px-2 py-1.5 text-xs font-medium ${headerTextClass} border-b ${borderClass}`}>
            Filter by Data Type
          </div>
          
          <div className={`flex gap-1 px-2 py-1.5 border-b ${borderClass}`}>
            <button
              className={`h-6 px-2 text-xs bg-transparent border-none rounded cursor-pointer transition-colors ${buttonHoverClass}`}
              onClick={handleSelectAll}
            >
              All
            </button>
            <button
              className={`h-6 px-2 text-xs bg-transparent border-none rounded cursor-pointer transition-colors ${buttonHoverClass}`}
              onClick={handleSelectNone}
            >
              None
            </button>
          </div>

          <DropdownMenuSeparator />

          {DATA_TYPE_OPTIONS.map((option) => {
            const isChecked = selectedTypes.has(option.value);
            return (
              <DropdownMenuCheckboxItem
                key={option.value}
                checked={isChecked}
                onCheckedChange={() => handleTypeToggle(option.value)}
                className="flex items-center gap-2 px-2 py-1.5 cursor-pointer"
              >
                <div className="flex items-center gap-2 flex-1">
                  <div 
                    className="w-4 h-4 flex items-center justify-center text-xs font-bold"
                    style={{ color: option.color }}
                  >
                    {option.icon}
                  </div>
                  <span className="text-sm">{option.label}</span>
                </div>
              </DropdownMenuCheckboxItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {hasActiveFilters && (
        <button
          className={`h-8 px-1 ${clearButtonClass} border-none bg-transparent rounded cursor-pointer flex items-center justify-center transition-colors`}
          onClick={handleClearFilters}
          title="Clear filters"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}