import React, { useState } from 'react';
import { FolderOpen, Plus, Search, Calendar, Clock, FileText, Folder, Download, GitBranch, Settings, HelpCircle } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Separator } from '../../ui/separator';
import { Project } from '../types';
import { useTheme } from '../context/ThemeContext';

interface IntegratedProjectSelectorProps {
  onProjectSelect: (project: Project) => void;
  onCreateProject: (project: Omit<Project, 'id' | 'createdAt' | 'lastModified'>) => void;
  showCreateDialog?: boolean;
  setShowCreateDialog?: (show: boolean) => void;
}

export function IntegratedProjectSelector({ 
  onProjectSelect, 
  onCreateProject,
  showCreateDialog: externalShowCreateDialog,
  setShowCreateDialog: externalSetShowCreateDialog
}: IntegratedProjectSelectorProps) {
  const { isDarkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [internalShowCreateDialog, setInternalShowCreateDialog] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');

  // Use external control if provided, otherwise use internal state
  const showCreateDialog = externalShowCreateDialog !== undefined ? externalShowCreateDialog : internalShowCreateDialog;
  const setShowCreateDialog = externalSetShowCreateDialog || setInternalShowCreateDialog;

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

  const filteredProjects = recentProjects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const quickActions = [
    {
      icon: Plus,
      title: 'New Project',
      description: 'Create a new data harmonization project',
      action: () => setShowCreateDialog(true),
      primary: true
    },
    {
      icon: FolderOpen,
      title: 'Open Project',
      description: 'Open an existing project from file system',
      action: () => console.log('Open project'),
      primary: false
    },
    {
      icon: GitBranch,
      title: 'Get from VCS',
      description: 'Check out project from version control',
      action: () => console.log('Get from VCS'),
      primary: false
    }
  ];

  return (
    <div className={`h-full ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-white'} flex`}>
      {/* Left Panel - Welcome & Actions */}
      <div className={`w-80 ${isDarkMode ? 'bg-[#252526] border-[#3c3c3c]' : 'bg-gray-50 border-gray-200'} border-r flex flex-col`}>
        {/* Welcome Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 ${isDarkMode ? 'bg-[#007fd4]/10' : 'bg-blue-50'} rounded-lg flex items-center justify-center`}>
              <svg className="w-6 h-6" viewBox="0 0 18 18">
                <path d="M12 13.5L16.5 9L12 4.5" stroke="#007FD4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <path d="M6 4.5L1.5 9L6 13.5" stroke="#007FD4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </div>
            <div>
              <h1 className={`text-lg font-medium ${isDarkMode ? 'text-[#cccccc]' : 'text-gray-900'}`}>
                Harmonizer
              </h1>
              <p className={`text-sm ${isDarkMode ? 'text-[#a0a0a0]' : 'text-gray-600'}`}>
                Version 1.0.0
              </p>
            </div>
          </div>
          
          <p className={`text-sm ${isDarkMode ? 'text-[#a0a0a0]' : 'text-gray-600'} mb-6`}>
            Create, open, and manage your data harmonization projects
          </p>
        </div>

        {/* Quick Actions */}
        <div className="px-6 pb-4">
          <h2 className={`text-sm font-medium ${isDarkMode ? 'text-[#cccccc]' : 'text-gray-900'} mb-3`}>
            Quick Start
          </h2>
          <div className="space-y-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className={`w-full text-left p-3 rounded-lg transition-colors duration-200 group ${
                  action.primary
                    ? 'bg-[#007fd4] text-white hover:bg-[#005fa3]'
                    : isDarkMode
                    ? 'hover:bg-[#3c3c3c] text-[#cccccc]'
                    : 'hover:bg-white text-gray-700 border border-gray-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <action.icon className={`w-5 h-5 mt-0.5 ${
                    action.primary 
                      ? 'text-white' 
                      : isDarkMode 
                      ? 'text-[#a0a0a0]' 
                      : 'text-gray-500'
                  }`} />
                  <div>
                    <div className={`font-medium text-sm ${
                      action.primary 
                        ? 'text-white' 
                        : isDarkMode 
                        ? 'text-[#cccccc]' 
                        : 'text-gray-900'
                    }`}>
                      {action.title}
                    </div>
                    <div className={`text-xs mt-1 ${
                      action.primary 
                        ? 'text-blue-100' 
                        : isDarkMode 
                        ? 'text-[#a0a0a0]' 
                        : 'text-gray-500'
                    }`}>
                      {action.description}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <Separator className={isDarkMode ? 'bg-[#3c3c3c]' : 'bg-gray-200'} />

        {/* Additional Actions */}
        <div className="px-6 py-4 flex-1">
          <h2 className={`text-sm font-medium ${isDarkMode ? 'text-[#cccccc]' : 'text-gray-900'} mb-3`}>
            Learn & Configure
          </h2>
          <div className="space-y-1">
            <button className={`w-full text-left p-2 rounded text-sm transition-colors duration-200 ${
              isDarkMode ? 'hover:bg-[#3c3c3c] text-[#a0a0a0]' : 'hover:bg-gray-100 text-gray-600'
            }`}>
              <div className="flex items-center gap-3">
                <HelpCircle className="w-4 h-4" />
                Documentation
              </div>
            </button>
            <button className={`w-full text-left p-2 rounded text-sm transition-colors duration-200 ${
              isDarkMode ? 'hover:bg-[#3c3c3c] text-[#a0a0a0]' : 'hover:bg-gray-100 text-gray-600'
            }`}>
              <div className="flex items-center gap-3">
                <Settings className="w-4 h-4" />
                Settings
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel - Recent Projects */}
      <div className="flex-1 flex flex-col">
        {/* Projects Header */}
        <div className={`${isDarkMode ? 'border-[#3c3c3c]' : 'border-gray-200'} border-b px-6 py-4`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-lg font-medium ${isDarkMode ? 'text-[#cccccc]' : 'text-gray-900'}`}>
              Recent Projects
            </h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-[#808080]' : 'text-gray-400'}`} />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-10 w-64 h-8 ${isDarkMode ? 'bg-[#3c3c3c] border-[#4c4c4c] text-[#cccccc]' : 'bg-white border-gray-300'}`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Projects List */}
        <div className="flex-1 overflow-y-auto">
          {filteredProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-6">
              <div className={`w-20 h-20 ${isDarkMode ? 'bg-[#3c3c3c]' : 'bg-gray-100'} rounded-full flex items-center justify-center mb-4`}>
                <FolderOpen className={`w-10 h-10 ${isDarkMode ? 'text-[#808080]' : 'text-gray-400'}`} />
              </div>
              <h3 className={`text-lg font-medium ${isDarkMode ? 'text-[#cccccc]' : 'text-gray-900'} mb-2`}>
                {searchTerm ? 'No projects found' : 'No recent projects'}
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-[#a0a0a0]' : 'text-gray-600'} text-center mb-6 max-w-md`}>
                {searchTerm 
                  ? 'Try adjusting your search terms or create a new project'
                  : 'Create your first project to start harmonizing data across different sources'
                }
              </p>
              <Button 
                onClick={() => setShowCreateDialog(true)}
                className="bg-[#007fd4] text-white hover:bg-[#005fa3] flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Your First Project
              </Button>
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 gap-3">
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => onProjectSelect(project)}
                    className={`${
                      isDarkMode 
                        ? 'hover:bg-[#2d2d30] border-[#3c3c3c]' 
                        : 'hover:bg-gray-50 border-gray-200'
                    } border rounded-lg p-4 cursor-pointer transition-all duration-200 group`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 ${isDarkMode ? 'bg-[#007fd4]/10' : 'bg-blue-50'} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <FileText className={`w-5 h-5 ${isDarkMode ? 'text-[#007fd4]' : 'text-blue-600'}`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={`font-medium ${isDarkMode ? 'text-[#cccccc]' : 'text-gray-900'} truncate`}>
                            {project.name}
                          </h3>
                          <div className="flex items-center gap-4 text-xs flex-shrink-0 ml-4">
                            <div className="flex items-center gap-1">
                              <Clock className={`w-3 h-3 ${isDarkMode ? 'text-[#808080]' : 'text-gray-400'}`} />
                              <span className={`${isDarkMode ? 'text-[#808080]' : 'text-gray-500'}`}>
                                {formatDate(project.lastModified)}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <p className={`${isDarkMode ? 'text-[#a0a0a0]' : 'text-gray-600'} text-sm line-clamp-1`}>
                          {project.description || 'No description available'}
                        </p>
                        
                        <div className="flex items-center gap-1 mt-2 text-xs">
                          <Folder className={`w-3 h-3 ${isDarkMode ? 'text-[#808080]' : 'text-gray-400'}`} />
                          <span className={`${isDarkMode ? 'text-[#808080]' : 'text-gray-500'}`}>
                            ~/projects/{project.name.toLowerCase().replace(/\s+/g, '-')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Project Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className={isDarkMode ? 'bg-[#2d2d30] border-[#3c3c3c]' : 'bg-white border-gray-200'}>
          <DialogHeader>
            <DialogTitle className={isDarkMode ? 'text-[#cccccc]' : 'text-gray-900'}>
              New Harmonizer Project
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <Label htmlFor="project-name" className={isDarkMode ? 'text-[#cccccc]' : 'text-gray-700'}>
                Project Name *
              </Label>
              <Input
                id="project-name"
                placeholder="Enter project name..."
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                className={`mt-1 ${isDarkMode ? 'bg-[#3c3c3c] border-[#4c4c4c] text-[#cccccc]' : 'bg-white border-gray-300'}`}
              />
            </div>
            <div>
              <Label htmlFor="project-description" className={isDarkMode ? 'text-[#cccccc]' : 'text-gray-700'}>
                Description
              </Label>
              <Textarea
                id="project-description"
                placeholder="Describe your data harmonization project..."
                value={newProjectDescription}
                onChange={(e) => setNewProjectDescription(e.target.value)}
                className={`mt-1 ${isDarkMode ? 'bg-[#3c3c3c] border-[#4c4c4c] text-[#cccccc]' : 'bg-white border-gray-300'}`}
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowCreateDialog(false)}
                className={isDarkMode ? 'border-[#4c4c4c] text-[#cccccc] hover:bg-[#3c3c3c]' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateProject}
                disabled={!newProjectName.trim()}
                className="bg-[#007fd4] text-white hover:bg-[#005fa3]"
              >
                Create Project
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}