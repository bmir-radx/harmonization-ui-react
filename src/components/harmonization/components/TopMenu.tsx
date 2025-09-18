import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Plus, Minus, RotateCcw, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface MenuDropdownProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function MenuDropdown({ title, isOpen, onToggle, children }: MenuDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (isOpen) {
          onToggle();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onToggle]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className={`px-3 py-1.5 text-sm text-[#cccccc] hover:bg-[#3c3c3c] rounded flex items-center gap-1 transition-colors ${
          isOpen ? 'bg-[#3c3c3c]' : ''
        }`}
        onClick={onToggle}
      >
        {title}
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-[#2d2d30] border border-[#4c4c4c] rounded-md shadow-lg min-w-48 z-50">
          {children}
        </div>
      )}
    </div>
  );
}

interface MenuItemProps {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  shortcut?: string;
  disabled?: boolean;
}

function MenuItem({ label, onClick, icon, shortcut, disabled = false }: MenuItemProps) {
  return (
    <button
      className={`w-full px-3 py-2 text-left text-sm hover:bg-[#3c3c3c] flex items-center justify-between transition-colors ${
        disabled ? 'text-[#666] cursor-not-allowed' : 'text-[#cccccc]'
      }`}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      <div className="flex items-center gap-2">
        {icon && <span className="w-4 h-4 flex items-center justify-center">{icon}</span>}
        <span>{label}</span>
      </div>
      {shortcut && <span className="text-[#808080] text-xs">{shortcut}</span>}
    </button>
  );
}

function MenuSeparator() {
  return <div className="h-px bg-[#4c4c4c] my-1" />;
}

export function TopMenu() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const { fontSize, isDarkMode, increaseFontSize, decreaseFontSize, resetFontSize, toggleDarkMode } = useTheme();

  const toggleMenu = (menuName: string) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  const closeMenu = () => {
    setOpenMenu(null);
  };

  const handleMenuAction = (action: () => void) => {
    action();
    closeMenu();
  };

  // Check if font size can be increased/decreased
  const canIncrease = fontSize < 24;
  const canDecrease = fontSize > 10;

  return (
    <div className="flex items-center gap-1">
      {/* File Menu */}
      <MenuDropdown
        title="File"
        isOpen={openMenu === 'file'}
        onToggle={() => toggleMenu('file')}
      >
        <MenuItem
          label="New Project"
          onClick={() => handleMenuAction(() => console.log('New Project'))}
          icon={<Plus className="w-3 h-3" />}
          shortcut="Ctrl+N"
        />
        <MenuItem
          label="Open Project"
          onClick={() => handleMenuAction(() => console.log('Open Project'))}
          shortcut="Ctrl+O"
        />
        <MenuItem
          label="Save Project"
          onClick={() => handleMenuAction(() => console.log('Save Project'))}
          shortcut="Ctrl+S"
        />
        <MenuSeparator />
        <MenuItem
          label="Export Results"
          onClick={() => handleMenuAction(() => console.log('Export Results'))}
          shortcut="Ctrl+E"
        />
        <MenuItem
          label="Import Data"
          onClick={() => handleMenuAction(() => console.log('Import Data'))}
        />
      </MenuDropdown>

      {/* View Menu */}
      <MenuDropdown
        title="View"
        isOpen={openMenu === 'view'}
        onToggle={() => toggleMenu('view')}
      >
        <div className="px-3 py-2 text-xs text-[#808080] border-b border-[#4c4c4c]">
          Font Size ({fontSize}px)
        </div>
        <MenuItem
          label="Increase Font Size"
          onClick={() => handleMenuAction(increaseFontSize)}
          icon={<Plus className="w-3 h-3" />}
          shortcut="Ctrl+="
          disabled={!canIncrease}
        />
        <MenuItem
          label="Decrease Font Size"
          onClick={() => handleMenuAction(decreaseFontSize)}
          icon={<Minus className="w-3 h-3" />}
          shortcut="Ctrl+-"
          disabled={!canDecrease}
        />
        <MenuItem
          label="Reset Font Size"
          onClick={() => handleMenuAction(resetFontSize)}
          icon={<RotateCcw className="w-3 h-3" />}
          shortcut="Ctrl+0"
        />
        <MenuSeparator />
        <div className="px-3 py-2 text-xs text-[#808080] border-b border-[#4c4c4c]">
          Appearance
        </div>
        <MenuItem
          label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          onClick={() => handleMenuAction(toggleDarkMode)}
          icon={isDarkMode ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
          shortcut="Ctrl+Shift+T"
        />
      </MenuDropdown>
    </div>
  );
}