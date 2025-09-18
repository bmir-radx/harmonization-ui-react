import React, { useState, useEffect } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Plus, FolderOpen, GitBranch, Clock, FileText, Search, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Project } from '../types';

interface ProjectSelectionModalProps {
  isOpen: boolean;
  onProjectSelect: (project: Project) => void;
  onCreateProject: (projectData: Omit<Project, 'id' | 'createdAt' | 'lastModified'>) => void;
  showCreateDialog: boolean;
  setShowCreateDialog: (show: boolean) => void;
  onClose: () => void;
}

export function ProjectSelectionModal({
  isOpen,
  onProjectSelect,
  onCreateProject,
  showCreateDialog,
  setShowCreateDialog,
  onClose
}: ProjectSelectionModalProps) {
  const { isDarkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');

  // Mock recent projects - in real app, this would come from storage/API
  const recentProjects: Project[] = [
    {
      id: '1',
      name: 'Healthcare Data Integration',
      description: 'Harmonizing patient data from multiple hospital systems across different EMR platforms',
      createdAt: new Date(2024, 11, 1),
      lastModified: new Date(2024, 11, 5)
    },
    {
      id: '2',
      name: 'Financial Reports Standardization',
      description: 'Standardizing quarterly financial reports across regional offices and subsidiaries',
      createdAt: new Date(2024, 10, 15),
      lastModified: new Date(2024, 11, 2)
    },
    {
      id: '3',
      name: 'Survey Data Consolidation',
      description: 'Combining survey responses from different platforms and standardizing response formats',
      createdAt: new Date(2024, 9, 20),
      lastModified: new Date(2024, 10, 28)
    },
    {
      id: '4',
      name: 'Customer Data Unification',
      description: 'Merging customer data from CRM, marketing platforms, and support systems',
      createdAt: new Date(2024, 8, 10),
      lastModified: new Date(2024, 9, 15)
    },
    {
      id: '5',
      name: 'Research Dataset Harmonization',
      description: 'Harmonizing research datasets from multiple institutions for meta-analysis',
      createdAt: new Date(2024, 7, 25),
      lastModified: new Date(2024, 8, 30)
    },
    {
      id: '6',
      name: 'IoT Sensor Data Integration',
      description: 'Integrating sensor data from different IoT devices and normalizing timestamps',
      createdAt: new Date(2024, 6, 12),
      lastModified: new Date(2024, 7, 18)
    },
    {
      id: '7',
      name: 'Marketing Analytics Consolidation',
      description: 'Consolidating marketing metrics from various platforms and standardizing KPIs',
      createdAt: new Date(2024, 5, 8),
      lastModified: new Date(2024, 6, 22)
    },
    {
      id: '8',
      name: 'Supply Chain Data Harmonization',
      description: 'Harmonizing supplier data and inventory systems across multiple warehouses',
      createdAt: new Date(2024, 4, 15),
      lastModified: new Date(2024, 5, 10)
    }
  ];

  const filteredProjects = recentProjects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return formatDate(date);
  };

  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      onCreateProject({
        name: newProjectName.trim(),
        description: newProjectDescription.trim()
      });
      setNewProjectName('');
      setNewProjectDescription('');
      setShowCreateDialog(false);
    }
  };

  const handleGetFromVCS = () => {
    // TODO: Implement VCS integration
    console.log('Get project from version control');
  };

  const handleOpenProject = () => {
    // TODO: Implement file picker for opening projects
    console.log('Open project from file system');
  };

  // Debug: Check create dialog state
  console.log('Create dialog state:', { showCreateDialog, isOpen });

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Debug: Log modal state
  console.log('ProjectSelectionModal render:', { 
    isOpen, 
    showCreateDialog, 
    modalShouldShow: !isOpen,
    componentWillRender: isOpen || showCreateDialog
  });

  if (!isOpen && !showCreateDialog) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={(e) => e.preventDefault()}
      />
      
      {/* Modal Content */}
      <div 
        className={`modal-content relative z-[101] w-[80vw] max-w-[1400px] h-[85vh] max-h-[900px] ${isDarkMode ? 'bg-[#1e1e1e] border border-[#3c3c3c]' : 'bg-gray-50 border border-gray-200'} rounded-xl shadow-2xl overflow-hidden`}
      >
        {/* Close Button */}
        <button
          onClick={(e) => e.preventDefault()}
          className={`absolute top-4 right-4 z-10 p-1 rounded-sm opacity-70 hover:opacity-100 transition-opacity ${isDarkMode ? 'text-[#cccccc] hover:bg-[#3c3c3c]' : 'text-gray-500 hover:bg-gray-100'}`}
          disabled
        >
          <X className="w-4 h-4" />
        </button>

        <div className="h-full flex flex-col">
          {/* Header */}
          <div className={`flex-shrink-0 px-8 pt-8 pb-6 border-b ${isDarkMode ? 'border-[#3c3c3c]' : 'border-gray-200'}`}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${isDarkMode ? 'bg-[#007fd4]/10' : 'bg-blue-50'} rounded-xl flex items-center justify-center`}>
                <svg className="w-6 h-6" viewBox="0 0 18 18">
                  <path d="M12 13.5L16.5 9L12 4.5" stroke="#007FD4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  <path d="M6 4.5L1.5 9L6 13.5" stroke="#007FD4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              </div>
              <div>
                <h1 className={`text-2xl font-medium mb-1 ${isDarkMode ? 'text-[#cccccc]' : 'text-gray-900'}`}>
                  Welcome to Harmonizer
                </h1>
                <p className={`${isDarkMode ? 'text-[#a0a0a0]' : 'text-gray-600'}`}>
                  Choose an existing project to open, create a new project, or get a project from version control.
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-h-0 overflow-hidden p-8">
            <div className="h-full grid grid-cols-5 gap-8">
              {/* Left Panel - Quick Actions */}
              <div className="col-span-2">
                <div className={`h-full ${isDarkMode ? 'bg-[#252526] border border-[#3c3c3c]' : 'bg-white border border-gray-200'} rounded-xl p-6`}>
                  <h2 className={`text-xl font-medium mb-6 ${isDarkMode ? 'text-[#cccccc]' : 'text-gray-900'}`}>
                    Quick Actions
                  </h2>
                  
                  <div className="space-y-4">
                    <Button
                      onClick={() => setShowCreateDialog(true)}
                      className="w-full justify-start gap-3 h-14 text-left bg-[#007fd4] hover:bg-[#0066a3] text-white rounded-lg"
                    >
                      <Plus className="w-5 h-5 flex-shrink-0" />
                      <div>
                        <div className="font-medium">New Project</div>
                        <div className="text-sm opacity-90 mt-1">Create a new harmonization project</div>
                      </div>
                    </Button>
                    
                    <Button
                      onClick={handleOpenProject}
                      variant="outline"
                      className={`w-full justify-start gap-3 h-14 text-left rounded-lg ${isDarkMode ? 'border-[#4c4c4c] text-[#cccccc] hover:bg-[#3c3c3c]' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                    >
                      <FolderOpen className="w-5 h-5 flex-shrink-0" />
                      <div>
                        <div className="font-medium">Open Project</div>
                        <div className={`text-sm mt-1 ${isDarkMode ? 'text-[#a0a0a0]' : 'text-gray-500'}`}>Open an existing project file</div>
                      </div>
                    </Button>
                    
                    <Button
                      onClick={handleGetFromVCS}
                      variant="outline"
                      className={`w-full justify-start gap-3 h-14 text-left rounded-lg ${isDarkMode ? 'border-[#4c4c4c] text-[#cccccc] hover:bg-[#3c3c3c]' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                    >
                      <GitBranch className="w-5 h-5 flex-shrink-0" />
                      <div>
                        <div className="font-medium">Get from VCS</div>
                        <div className={`text-sm mt-1 ${isDarkMode ? 'text-[#a0a0a0]' : 'text-gray-500'}`}>Clone from version control</div>
                      </div>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right Panel - Recent Projects */}
              <div className="col-span-3 flex flex-col min-h-0">
                {/* Header with Search */}
                <div className="flex-shrink-0 mb-6">
                  <h2 className={`text-xl font-medium mb-4 ${isDarkMode ? 'text-[#cccccc]' : 'text-gray-900'}`}>
                    Recent Projects
                  </h2>
                  
                  {/* Search */}
                  <div className="relative">
                    <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-[#a0a0a0]' : 'text-gray-400'}`} />
                    <Input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search projects..."
                      className={`pl-10 h-10 rounded-lg ${isDarkMode ? 'bg-[#3c3c3c] border-[#4c4c4c] text-[#cccccc] placeholder:text-[#808080]' : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500'}`}
                    />
                  </div>
                </div>

                {/* Projects List - Single Column with proper scrolling */}
                <div className="flex-1 min-h-0 overflow-y-auto scroll-smooth">
                  <div className="space-y-3 pb-6 pr-2">
                    {filteredProjects.map((project) => (
                      <Card 
                        key={project.id}
                        className={`cursor-pointer transition-all duration-200 rounded-lg ${
                          isDarkMode 
                            ? 'bg-[#2d2d30] border-[#3c3c3c] hover:border-[#007fd4] hover:shadow-lg hover:shadow-[#007fd4]/10' 
                            : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md hover:shadow-blue-100'
                        }`}
                        onClick={() => onProjectSelect(project)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 ${isDarkMode ? 'bg-[#007fd4]/10' : 'bg-blue-50'} rounded-lg flex items-center justify-center flex-shrink-0`}>
                              <FileText className={`w-5 h-5 ${isDarkMode ? 'text-[#007fd4]' : 'text-blue-600'}`} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <CardTitle className={`line-clamp-1 mb-1 ${isDarkMode ? 'text-[#cccccc]' : 'text-gray-900'}`}>
                                {project.name}
                              </CardTitle>
                              <div className="flex items-center gap-2">
                                <Clock className={`w-3 h-3 ${isDarkMode ? 'text-[#808080]' : 'text-gray-400'}`} />
                                <span className={`text-xs ${isDarkMode ? 'text-[#808080]' : 'text-gray-500'}`}>
                                  {formatRelativeTime(project.lastModified)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <CardDescription className={`text-sm line-clamp-2 leading-relaxed ${isDarkMode ? 'text-[#a0a0a0]' : 'text-gray-600'}`}>
                            {project.description}
                          </CardDescription>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  {filteredProjects.length === 0 && (
                    <div className={`text-center py-12 ${isDarkMode ? 'text-[#a0a0a0]' : 'text-gray-500'}`}>
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="font-medium mb-2">No projects found</p>
                      <p className="text-sm">Try adjusting your search or create a new project</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Project Dialog - Overlay on top of main modal */}
      {showCreateDialog && (
        <div className="absolute inset-0 z-[105] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          {/* Create Dialog Content */}
          <div 
            className={`modal-content relative z-[106] w-[500px] max-w-[90vw] ${isDarkMode ? 'bg-[#2d2d30] border border-[#3c3c3c]' : 'bg-white border border-gray-200'} rounded-lg shadow-xl p-6`}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowCreateDialog(false)}
              className={`absolute top-4 right-4 p-1 rounded-sm opacity-70 hover:opacity-100 transition-opacity ${isDarkMode ? 'text-[#cccccc] hover:bg-[#3c3c3c]' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="mb-4">
              <h2 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-[#cccccc]' : 'text-gray-900'}`}>
                Create New Project
              </h2>
              <p className={`text-sm ${isDarkMode ? 'text-[#a0a0a0]' : 'text-gray-600'}`}>
                Create a new data harmonization project. Give it a name and optional description to get started.
              </p>
            </div>
            
            <div className="space-y-4 pt-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-[#cccccc]' : 'text-gray-700'}`}>
                  Project Name
                </label>
                <Input
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="Enter project name"
                  className={`${isDarkMode ? 'bg-[#3c3c3c] border-[#4c4c4c] text-[#cccccc]' : 'bg-white border-gray-300 text-gray-900'}`}
                  autoFocus
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-[#cccccc]' : 'text-gray-700'}`}>
                  Description (Optional)
                </label>
                <Textarea
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                  placeholder="Describe your data harmonization project"
                  className={`${isDarkMode ? 'bg-[#3c3c3c] border-[#4c4c4c] text-[#cccccc]' : 'bg-white border-gray-300 text-gray-900'}`}
                  rows={3}
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => setShowCreateDialog(false)}
                  variant="outline"
                  className={`flex-1 ${isDarkMode ? 'border-[#4c4c4c] text-[#cccccc] hover:bg-[#3c3c3c]' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateProject}
                  disabled={!newProjectName.trim()}
                  className="flex-1 bg-[#007fd4] hover:bg-[#0066a3] text-white"
                >
                  Create Project
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}