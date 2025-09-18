import React, { useState } from 'react';
import { ArrowLeft, Sun, Moon, Plus, Minus, ChevronDown, FolderOpen, GitBranch, FileText, Clock, Save, FolderPlus, Upload, Download, RefreshCw, Eye, EyeOff, Grid3X3, Table, Settings, Maximize2, SplitSquareHorizontal, Search, User } from 'lucide-react';
import { Button } from '../../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../../ui/dropdown-menu';
import { useTheme } from '../context/ThemeContext';
import { Project } from '../types';

interface HeaderBarProps {
  currentProject?: Project | null;
  onBackToProjects?: () => void;
  onNewProject?: () => void;
  onOpenProject?: () => void;
  onGetFromVCS?: () => void;
  onSelectProject?: (project: Project) => void;
}

export function HeaderBar({ 
  currentProject, 
  onBackToProjects,
  onNewProject,
  onOpenProject,
  onGetFromVCS,
  onSelectProject
}: HeaderBarProps) {
  const { isDarkMode, setIsDarkMode, fontSize, setFontSize } = useTheme();
  const [showProjectMenu, setShowProjectMenu] = useState(false);
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [showViewMenu, setShowViewMenu] = useState(false);

  // Mock recent projects - in real app, this would come from storage/API
  const recentProjects: Project[] = [
    {
      id: '1',
      name: 'Healthcare Data Integration',
      description: 'Harmonizing patient data from multiple hospital systems',
      createdAt: new Date(2024, 11, 1),
      lastModified: new Date(2024, 11, 5)
    },
    {
      id: '2',
      name: 'Financial Reports Standardization',
      description: 'Standardizing quarterly reports across regional offices',
      createdAt: new Date(2024, 10, 15),
      lastModified: new Date(2024, 11, 2)
    },
    {
      id: '3',
      name: 'Survey Data Consolidation',
      description: 'Combining survey responses from different platforms',
      createdAt: new Date(2024, 9, 20),
      lastModified: new Date(2024, 10, 28)
    },
    {
      id: '4',
      name: 'Customer Data Unification',
      description: 'Merging customer data from CRM and marketing platforms',
      createdAt: new Date(2024, 8, 10),
      lastModified: new Date(2024, 9, 15)
    }
  ];

  const handleFontSizeIncrease = () => {
    if (fontSize < 20) {
      setFontSize(fontSize + 1);
    }
  };

  const handleFontSizeDecrease = () => {
    if (fontSize > 12) {
      setFontSize(fontSize - 1);
    }
  };

  const truncateProjectName = (name: string, maxLength: number = 20) => {
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength - 3) + '...';
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  // File menu handlers
  const handleNewFile = () => console.log('New file');
  const handleOpenFile = () => console.log('Open file');
  const handleSaveProject = () => console.log('Save project');
  const handleSaveAs = () => console.log('Save as');
  const handleImportData = () => console.log('Import data');
  const handleExportData = () => console.log('Export data');
  const handleRecentFiles = () => console.log('Recent files');

  // View menu handlers
  const handleToggleSidebars = () => console.log('Toggle sidebars');
  const handleToggleLeftSidebar = () => console.log('Toggle left sidebar');
  const handleToggleRightSidebar = () => console.log('Toggle right sidebar');
  const handleResetLayout = () => {
    setFontSize(16); // Reset font size to initial value
    console.log('Reset layout - font size reset to 16px');
  };
  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };
  const handleZoomIn = () => {
    if (fontSize < 20) {
      setFontSize(fontSize + 1);
    }
  };
  const handleZoomOut = () => {
    if (fontSize > 12) {
      setFontSize(fontSize - 1);
    }
  };
  const handleZoomReset = () => setFontSize(16);

  return (
    <div 
      className={`h-10 ${isDarkMode ? 'bg-[#252526] border-[#3c3c3c]' : 'bg-white border-gray-200'} border-b flex items-center justify-between px-4 flex-shrink-0`}
      style={{ fontSize: '13px' }}
    >
      {/* Left side - Logo, App Name, Project, and Menus */}
      <div className="flex items-center gap-2">
        {/* Always show Harmonizer logo and name */}
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" viewBox="0 0 18 18">
            <path d="M12 13.5L16.5 9L12 4.5" stroke="#007FD4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <path d="M6 4.5L1.5 9L6 13.5" stroke="#007FD4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
          <span className={`${isDarkMode ? 'text-[#cccccc]' : 'text-gray-700'} font-medium`}>Harmonizer</span>
        </div>

        {/* Project selector when project is selected */}
        {currentProject && (
          <>
            <div className={`h-4 w-px ${isDarkMode ? 'bg-[#3c3c3c]' : 'bg-gray-300'}`} />
            
            <DropdownMenu open={showProjectMenu} onOpenChange={setShowProjectMenu}>
              <DropdownMenuTrigger asChild>
                <button
                  className={`flex items-center gap-1 px-2 py-1 rounded text-sm ${
                    isDarkMode 
                      ? 'text-[#cccccc] hover:bg-[#3c3c3c]' 
                      : 'text-gray-700 hover:bg-gray-100'
                  } transition-colors`}
                >
                  <span className="truncate max-w-[160px]">
                    {truncateProjectName(currentProject.name)}
                  </span>
                  <ChevronDown className="w-3 h-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="start"
                className={`w-80 ${isDarkMode ? 'bg-[#2d2d30] border-[#3c3c3c]' : 'bg-white border-gray-200'}`}
              >
                {/* Project Actions */}
                <DropdownMenuItem
                  onClick={onNewProject}
                  className={`flex items-center gap-3 px-3 py-2 ${
                    isDarkMode ? 'hover:bg-[#3c3c3c] text-[#cccccc]' : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <div>
                    <div className="font-medium text-sm">New Project</div>
                    <div className={`text-xs ${isDarkMode ? 'text-[#a0a0a0]' : 'text-gray-500'}`}>
                      Create a new harmonization project
                    </div>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={onOpenProject}
                  className={`flex items-center gap-3 px-3 py-2 ${
                    isDarkMode ? 'hover:bg-[#3c3c3c] text-[#cccccc]' : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <FolderOpen className="w-4 h-4" />
                  <div>
                    <div className="font-medium text-sm">Open Project</div>
                    <div className={`text-xs ${isDarkMode ? 'text-[#a0a0a0]' : 'text-gray-500'}`}>
                      Open an existing project
                    </div>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={onGetFromVCS}
                  className={`flex items-center gap-3 px-3 py-2 ${
                    isDarkMode ? 'hover:bg-[#3c3c3c] text-[#cccccc]' : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <GitBranch className="w-4 h-4" />
                  <div>
                    <div className="font-medium text-sm">Get from Version Control</div>
                    <div className={`text-xs ${isDarkMode ? 'text-[#a0a0a0]' : 'text-gray-500'}`}>
                      Clone project from repository
                    </div>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuSeparator className={isDarkMode ? 'bg-[#3c3c3c]' : 'bg-gray-200'} />

                {/* Recent Projects */}
                <div className={`px-3 py-2 text-xs font-medium ${isDarkMode ? 'text-[#a0a0a0]' : 'text-gray-500'}`}>
                  Recent Projects
                </div>

                {recentProjects
                  .filter(project => project.id !== currentProject.id)
                  .slice(0, 5)
                  .map((project) => (
                    <DropdownMenuItem
                      key={project.id}
                      onClick={() => onSelectProject?.(project)}
                      className={`flex items-center gap-3 px-3 py-2 ${
                        isDarkMode ? 'hover:bg-[#3c3c3c] text-[#cccccc]' : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className={`w-6 h-6 ${isDarkMode ? 'bg-[#007fd4]/10' : 'bg-blue-50'} rounded flex items-center justify-center flex-shrink-0`}>
                        <FileText className={`w-3 h-3 ${isDarkMode ? 'text-[#007fd4]' : 'text-blue-600'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">
                          {project.name}
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <Clock className={`w-3 h-3 ${isDarkMode ? 'text-[#808080]' : 'text-gray-400'}`} />
                          <span className={`${isDarkMode ? 'text-[#808080]' : 'text-gray-500'}`}>
                            {formatDate(project.lastModified)}
                          </span>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}

                {onBackToProjects && (
                  <>
                    <DropdownMenuSeparator className={isDarkMode ? 'bg-[#3c3c3c]' : 'bg-gray-200'} />
                    <DropdownMenuItem
                      onClick={onBackToProjects}
                      className={`flex items-center gap-3 px-3 py-2 ${
                        isDarkMode ? 'hover:bg-[#3c3c3c] text-[#cccccc]' : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span className="font-medium text-sm">All Projects</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* File Menu */}
            <DropdownMenu open={showFileMenu} onOpenChange={setShowFileMenu}>
              <DropdownMenuTrigger asChild>
                <button
                  className={`px-2 py-1 rounded text-sm ${
                    isDarkMode 
                      ? 'text-[#cccccc] hover:bg-[#3c3c3c]' 
                      : 'text-gray-700 hover:bg-gray-100'
                  } transition-colors`}
                >
                  File
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="start"
                className={`w-64 ${isDarkMode ? 'bg-[#2d2d30] border-[#3c3c3c]' : 'bg-white border-gray-200'}`}
              >
                <DropdownMenuItem
                  onClick={onNewProject}
                  className={`flex items-center gap-3 px-3 py-2 ${
                    isDarkMode ? 'hover:bg-[#3c3c3c] text-[#cccccc]' : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>New Project...</span>
                  <span className={`ml-auto text-xs ${isDarkMode ? 'text-[#808080]' : 'text-gray-400'}`}>
                    Ctrl+Shift+N
                  </span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={onOpenProject}
                  className={`flex items-center gap-3 px-3 py-2 ${
                    isDarkMode ? 'hover:bg-[#3c3c3c] text-[#cccccc]' : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <FolderOpen className="w-4 h-4" />
                  <span>Open Project...</span>
                  <span className={`ml-auto text-xs ${isDarkMode ? 'text-[#808080]' : 'text-gray-400'}`}>
                    Ctrl+O
                  </span>
                </DropdownMenuItem>

                <DropdownMenuSeparator className={isDarkMode ? 'bg-[#3c3c3c]' : 'bg-gray-200'} />

                <DropdownMenuItem
                  onClick={handleNewFile}
                  className={`flex items-center gap-3 px-3 py-2 ${
                    isDarkMode ? 'hover:bg-[#3c3c3c] text-[#cccccc]' : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>New Mapping...</span>
                  <span className={`ml-auto text-xs ${isDarkMode ? 'text-[#808080]' : 'text-gray-400'}`}>
                    Ctrl+N
                  </span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={handleOpenFile}
                  className={`flex items-center gap-3 px-3 py-2 ${
                    isDarkMode ? 'hover:bg-[#3c3c3c] text-[#cccccc]' : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  <span>Import Data...</span>
                  <span className={`ml-auto text-xs ${isDarkMode ? 'text-[#808080]' : 'text-gray-400'}`}>
                    Ctrl+I
                  </span>
                </DropdownMenuItem>

                <DropdownMenuSeparator className={isDarkMode ? 'bg-[#3c3c3c]' : 'bg-gray-200'} />

                <DropdownMenuItem
                  onClick={handleSaveProject}
                  className={`flex items-center gap-3 px-3 py-2 ${
                    isDarkMode ? 'hover:bg-[#3c3c3c] text-[#cccccc]' : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <Save className="w-4 h-4" />
                  <span>Save Project</span>
                  <span className={`ml-auto text-xs ${isDarkMode ? 'text-[#808080]' : 'text-gray-400'}`}>
                    Ctrl+S
                  </span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={handleSaveAs}
                  className={`flex items-center gap-3 px-3 py-2 ${
                    isDarkMode ? 'hover:bg-[#3c3c3c] text-[#cccccc]' : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <FolderPlus className="w-4 h-4" />
                  <span>Save Project As...</span>
                  <span className={`ml-auto text-xs ${isDarkMode ? 'text-[#808080]' : 'text-gray-400'}`}>
                    Ctrl+Shift+S
                  </span>
                </DropdownMenuItem>

                <DropdownMenuSeparator className={isDarkMode ? 'bg-[#3c3c3c]' : 'bg-gray-200'} />

                <DropdownMenuItem
                  onClick={handleExportData}
                  className={`flex items-center gap-3 px-3 py-2 ${
                    isDarkMode ? 'hover:bg-[#3c3c3c] text-[#cccccc]' : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <Download className="w-4 h-4" />
                  <span>Export Results...</span>
                  <span className={`ml-auto text-xs ${isDarkMode ? 'text-[#808080]' : 'text-gray-400'}`}>
                    Ctrl+E
                  </span>
                </DropdownMenuItem>

                <DropdownMenuSeparator className={isDarkMode ? 'bg-[#3c3c3c]' : 'bg-gray-200'} />

                <DropdownMenuItem
                  onClick={handleRecentFiles}
                  className={`flex items-center gap-3 px-3 py-2 ${
                    isDarkMode ? 'hover:bg-[#3c3c3c] text-[#cccccc]' : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span>Recent Projects</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* View Menu */}
            <DropdownMenu open={showViewMenu} onOpenChange={setShowViewMenu}>
              <DropdownMenuTrigger asChild>
                <button
                  className={`px-2 py-1 rounded text-sm ${
                    isDarkMode 
                      ? 'text-[#cccccc] hover:bg-[#3c3c3c]' 
                      : 'text-gray-700 hover:bg-gray-100'
                  } transition-colors`}
                >
                  View
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="start"
                className={`w-64 ${isDarkMode ? 'bg-[#2d2d30] border-[#3c3c3c]' : 'bg-white border-gray-200'}`}
              >
                <DropdownMenuItem
                  onClick={handleToggleLeftSidebar}
                  className={`flex items-center gap-3 px-3 py-2 ${
                    isDarkMode ? 'hover:bg-[#3c3c3c] text-[#cccccc]' : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <SplitSquareHorizontal className="w-4 h-4" />
                  <span>Toggle Left Sidebar</span>
                  <span className={`ml-auto text-xs ${isDarkMode ? 'text-[#808080]' : 'text-gray-400'}`}>
                    Ctrl+Shift+E
                  </span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={handleToggleRightSidebar}
                  className={`flex items-center gap-3 px-3 py-2 ${
                    isDarkMode ? 'hover:bg-[#3c3c3c] text-[#cccccc]' : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <SplitSquareHorizontal className="w-4 h-4 rotate-180" />
                  <span>Toggle Right Sidebar</span>
                  <span className={`ml-auto text-xs ${isDarkMode ? 'text-[#808080]' : 'text-gray-400'}`}>
                    Ctrl+Shift+R
                  </span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={handleToggleSidebars}
                  className={`flex items-center gap-3 px-3 py-2 ${
                    isDarkMode ? 'hover:bg-[#3c3c3c] text-[#cccccc]' : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  <span>Toggle All Sidebars</span>
                  <span className={`ml-auto text-xs ${isDarkMode ? 'text-[#808080]' : 'text-gray-400'}`}>
                    Ctrl+Shift+B
                  </span>
                </DropdownMenuItem>

                <DropdownMenuSeparator className={isDarkMode ? 'bg-[#3c3c3c]' : 'bg-gray-200'} />

                <DropdownMenuItem
                  onClick={handleResetLayout}
                  className={`flex items-center gap-3 px-3 py-2 ${
                    isDarkMode ? 'hover:bg-[#3c3c3c] text-[#cccccc]' : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Reset Layout</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={handleFullscreen}
                  className={`flex items-center gap-3 px-3 py-2 ${
                    isDarkMode ? 'hover:bg-[#3c3c3c] text-[#cccccc]' : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <Maximize2 className="w-4 h-4" />
                  <span>Toggle Fullscreen</span>
                  <span className={`ml-auto text-xs ${isDarkMode ? 'text-[#808080]' : 'text-gray-400'}`}>
                    F11
                  </span>
                </DropdownMenuItem>

                <DropdownMenuSeparator className={isDarkMode ? 'bg-[#3c3c3c]' : 'bg-gray-200'} />

                <DropdownMenuItem
                  onClick={handleZoomIn}
                  className={`flex items-center gap-3 px-3 py-2 ${
                    isDarkMode ? 'hover:bg-[#3c3c3c] text-[#cccccc]' : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Zoom In</span>
                  <span className={`ml-auto text-xs ${isDarkMode ? 'text-[#808080]' : 'text-gray-400'}`}>
                    Ctrl++
                  </span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={handleZoomOut}
                  className={`flex items-center gap-3 px-3 py-2 ${
                    isDarkMode ? 'hover:bg-[#3c3c3c] text-[#cccccc]' : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <Minus className="w-4 h-4" />
                  <span>Zoom Out</span>
                  <span className={`ml-auto text-xs ${isDarkMode ? 'text-[#808080]' : 'text-gray-400'}`}>
                    Ctrl+-
                  </span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={handleZoomReset}
                  className={`flex items-center gap-3 px-3 py-2 ${
                    isDarkMode ? 'hover:bg-[#3c3c3c] text-[#cccccc]' : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span>Reset Zoom</span>
                  <span className={`ml-auto text-xs ${isDarkMode ? 'text-[#808080]' : 'text-gray-400'}`}>
                    Ctrl+0
                  </span>
                </DropdownMenuItem>

                <DropdownMenuSeparator className={isDarkMode ? 'bg-[#3c3c3c]' : 'bg-gray-200'} />

                <DropdownMenuItem
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`flex items-center gap-3 px-3 py-2 ${
                    isDarkMode ? 'hover:bg-[#3c3c3c] text-[#cccccc]' : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  <span>Toggle Theme</span>
                  <span className={`ml-auto text-xs ${isDarkMode ? 'text-[#808080]' : 'text-gray-400'}`}>
                    {isDarkMode ? 'Light' : 'Dark'}
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>

      {/* Right side - User menu, Search, and Settings */}
      <div className="flex items-center gap-1">
        {/* User Menu */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => console.log('User menu clicked')}
          className={`w-7 h-7 p-0 ${
            isDarkMode 
              ? 'text-[#cccccc] hover:bg-[#3c3c3c]' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          title="User menu"
        >
          <User className="w-4 h-4" />
        </Button>

        {/* Search */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => console.log('Search clicked')}
          className={`w-7 h-7 p-0 ${
            isDarkMode 
              ? 'text-[#cccccc] hover:bg-[#3c3c3c]' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          title="Search"
        >
          <Search className="w-4 h-4" />
        </Button>

        {/* Settings */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={`w-7 h-7 p-0 ${
                isDarkMode 
                  ? 'text-[#cccccc] hover:bg-[#3c3c3c]' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end"
            className={`w-64 ${isDarkMode ? 'bg-[#2d2d30] border-[#3c3c3c]' : 'bg-white border-gray-200'}`}
          >
            {/* Theme Toggle */}
            <DropdownMenuItem
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`flex items-center gap-3 px-3 py-2 ${
                isDarkMode ? 'hover:bg-[#3c3c3c] text-[#cccccc]' : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              <span>Toggle Theme</span>
              <span className={`ml-auto text-xs ${isDarkMode ? 'text-[#808080]' : 'text-gray-400'}`}>
                {isDarkMode ? 'Light' : 'Dark'}
              </span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className={isDarkMode ? 'bg-[#3c3c3c]' : 'bg-gray-200'} />

            {/* Font Size Controls */}
            <div className={`px-3 py-2 text-xs font-medium ${isDarkMode ? 'text-[#a0a0a0]' : 'text-gray-500'}`}>
              Font Size
            </div>

            <DropdownMenuItem
              onClick={handleFontSizeIncrease}
              disabled={fontSize >= 20}
              className={`flex items-center gap-3 px-3 py-2 ${
                isDarkMode ? 'hover:bg-[#3c3c3c] text-[#cccccc] disabled:text-[#666]' : 'hover:bg-gray-50 text-gray-700 disabled:text-gray-300'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Increase Font Size</span>
              <span className={`ml-auto text-xs ${isDarkMode ? 'text-[#808080]' : 'text-gray-400'}`}>
                Ctrl++
              </span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={handleFontSizeDecrease}
              disabled={fontSize <= 12}
              className={`flex items-center gap-3 px-3 py-2 ${
                isDarkMode ? 'hover:bg-[#3c3c3c] text-[#cccccc] disabled:text-[#666]' : 'hover:bg-gray-50 text-gray-700 disabled:text-gray-300'
              }`}
            >
              <Minus className="w-4 h-4" />
              <span>Decrease Font Size</span>
              <span className={`ml-auto text-xs ${isDarkMode ? 'text-[#808080]' : 'text-gray-400'}`}>
                Ctrl+-
              </span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => setFontSize(16)}
              className={`flex items-center gap-3 px-3 py-2 ${
                isDarkMode ? 'hover:bg-[#3c3c3c] text-[#cccccc]' : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Reset Font Size</span>
              <span className={`ml-auto text-xs ${isDarkMode ? 'text-[#808080]' : 'text-gray-400'}`}>
                16px
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}