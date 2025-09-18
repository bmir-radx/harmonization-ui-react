import React, { useState } from 'react';
import { FolderOpen, Plus, Search, Calendar, Clock, FileText } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Project } from '../types';
import { useTheme } from '../context/ThemeContext';

interface ProjectScreenProps {
  onProjectSelect: (project: Project) => void;
  onCreateProject: (project: Omit<Project, 'id' | 'createdAt' | 'lastModified'>) => void;
}

export function ProjectScreen({ onProjectSelect, onCreateProject }: ProjectScreenProps) {
  const { isDarkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');

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

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-white'} flex flex-col`}>
      {/* Header */}
      <div className={`border-b ${isDarkMode ? 'border-[#3c3c3c] bg-[#252526]' : 'border-gray-200 bg-gray-50'} px-8 py-6`}>
        <div className="max-w-6xl mx-auto">
          <h1 className={`text-2xl font-semibold ${isDarkMode ? 'text-[#cccccc]' : 'text-gray-900'} mb-2`}>
            Data Harmonization Projects
          </h1>
          <p className={`${isDarkMode ? 'text-[#a0a0a0]' : 'text-gray-600'}`}>
            Select an existing project or create a new one to get started
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Search and Create Section */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-[#808080]' : 'text-gray-400'}`} />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 ${isDarkMode ? 'bg-[#3c3c3c] border-[#4c4c4c] text-[#cccccc]' : 'bg-white border-gray-300'}`}
              />
            </div>
            
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="bg-[#007fd4] text-white hover:bg-[#005fa3] flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  New Project
                </Button>
              </DialogTrigger>
              <DialogContent className={isDarkMode ? 'bg-[#2d2d30] border-[#3c3c3c]' : 'bg-white border-gray-200'}>
                <DialogHeader>
                  <DialogTitle className={isDarkMode ? 'text-[#cccccc]' : 'text-gray-900'}>
                    Create New Project
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <Label htmlFor="project-name" className={isDarkMode ? 'text-[#cccccc]' : 'text-gray-700'}>
                      Project Name
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
                      Description (optional)
                    </Label>
                    <Textarea
                      id="project-description"
                      placeholder="Describe your project..."
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

          {/* Projects Grid */}
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <div className={`w-20 h-20 ${isDarkMode ? 'bg-[#3c3c3c]' : 'bg-gray-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <FolderOpen className={`w-10 h-10 ${isDarkMode ? 'text-[#808080]' : 'text-gray-400'}`} />
              </div>
              <h3 className={`text-lg font-medium ${isDarkMode ? 'text-[#cccccc]' : 'text-gray-900'} mb-2`}>
                {searchTerm ? 'No projects found' : 'No projects yet'}
              </h3>
              <p className={`${isDarkMode ? 'text-[#a0a0a0]' : 'text-gray-600'} mb-6`}>
                {searchTerm 
                  ? 'Try adjusting your search terms'
                  : 'Create your first project to start harmonizing data'
                }
              </p>
              {!searchTerm && (
                <Button 
                  onClick={() => setShowCreateDialog(true)}
                  className="bg-[#007fd4] text-white hover:bg-[#005fa3] flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create Your First Project
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => onProjectSelect(project)}
                  className={`${isDarkMode ? 'bg-[#252526] border-[#3c3c3c] hover:bg-[#2d2d30]' : 'bg-white border-gray-200 hover:bg-gray-50'} 
                    border rounded-lg p-6 cursor-pointer transition-colors duration-200 hover:shadow-lg`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 ${isDarkMode ? 'bg-[#007fd4]/10' : 'bg-blue-50'} rounded-lg flex items-center justify-center`}>
                      <FileText className={`w-6 h-6 ${isDarkMode ? 'text-[#007fd4]' : 'text-blue-600'}`} />
                    </div>
                  </div>
                  
                  <h3 className={`font-semibold ${isDarkMode ? 'text-[#cccccc]' : 'text-gray-900'} mb-2 line-clamp-2`}>
                    {project.name}
                  </h3>
                  
                  <p className={`${isDarkMode ? 'text-[#a0a0a0]' : 'text-gray-600'} text-sm mb-4 line-clamp-3`}>
                    {project.description || 'No description available'}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className={`w-3 h-3 ${isDarkMode ? 'text-[#808080]' : 'text-gray-400'}`} />
                      <span className={`text-xs ${isDarkMode ? 'text-[#808080]' : 'text-gray-500'}`}>
                        Created {formatDate(project.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className={`w-3 h-3 ${isDarkMode ? 'text-[#808080]' : 'text-gray-400'}`} />
                      <span className={`text-xs ${isDarkMode ? 'text-[#808080]' : 'text-gray-500'}`}>
                        Modified {formatDate(project.lastModified)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}