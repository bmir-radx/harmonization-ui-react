import React from 'react';
import { ArrowUpDown, SortAsc, SortDesc } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../ui/dropdown-menu';

export type SortOption = 'name-asc' | 'name-desc' | 'type-asc' | 'type-desc';

interface SortingControlsProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export function SortingControls({ currentSort, onSortChange }: SortingControlsProps) {
  const getSortIcon = () => {
    switch (currentSort) {
      case 'name-asc':
      case 'type-asc':
        return <SortAsc className="w-4 h-4" />;
      case 'name-desc':
      case 'type-desc':
        return <SortDesc className="w-4 h-4" />;
      default:
        return <ArrowUpDown className="w-4 h-4" />;
    }
  };

  const getSortLabel = () => {
    switch (currentSort) {
      case 'name-asc':
        return 'Name A-Z';
      case 'name-desc':
        return 'Name Z-A';
      case 'type-asc':
        return 'Type A-Z';
      case 'type-desc':
        return 'Type Z-A';
      default:
        return 'Sort';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="h-8 px-2 text-[#cccccc] hover:bg-[#3c3c3c] hover:text-[#cccccc] border-none bg-transparent rounded cursor-pointer flex items-center justify-center transition-colors"
          title={`Sort: ${getSortLabel()}`}
        >
          {getSortIcon()}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="start" 
        className="bg-[#2d2d30] border-[#3c3c3c] text-[#cccccc] min-w-[160px]"
      >
        <DropdownMenuItem
          className={`cursor-pointer hover:bg-[#3c3c3c] focus:bg-[#3c3c3c] ${
            currentSort === 'name-asc' ? 'bg-[#094771]' : ''
          }`}
          onClick={() => onSortChange('name-asc')}
        >
          <SortAsc className="w-4 h-4 mr-2" />
          Name A-Z
        </DropdownMenuItem>
        <DropdownMenuItem
          className={`cursor-pointer hover:bg-[#3c3c3c] focus:bg-[#3c3c3c] ${
            currentSort === 'name-desc' ? 'bg-[#094771]' : ''
          }`}
          onClick={() => onSortChange('name-desc')}
        >
          <SortDesc className="w-4 h-4 mr-2" />
          Name Z-A
        </DropdownMenuItem>
        <DropdownMenuItem
          className={`cursor-pointer hover:bg-[#3c3c3c] focus:bg-[#3c3c3c] ${
            currentSort === 'type-asc' ? 'bg-[#094771]' : ''
          }`}
          onClick={() => onSortChange('type-asc')}
        >
          <SortAsc className="w-4 h-4 mr-2" />
          Type A-Z
        </DropdownMenuItem>
        <DropdownMenuItem
          className={`cursor-pointer hover:bg-[#3c3c3c] focus:bg-[#3c3c3c] ${
            currentSort === 'type-desc' ? 'bg-[#094771]' : ''
          }`}
          onClick={() => onSortChange('type-desc')}
        >
          <SortDesc className="w-4 h-4 mr-2" />
          Type Z-A
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}