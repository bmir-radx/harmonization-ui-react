import React, { useState } from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './components/ui/resizable';
import { HeaderBar } from './components/harmonization/layout/HeaderBar';
import { LeftSidebar } from './components/harmonization/layout/LeftSidebar';
import { RightSidebar } from './components/harmonization/layout/RightSidebar';
import { MainContent } from './components/harmonization/layout/MainContent';
import { ProjectSelectionModal } from './components/harmonization/layout/ProjectSelectionModal';
import { StartupScreen } from './components/harmonization/layout/StartupScreen';
import { useHarmonizationState } from './components/harmonization/useHarmonizationState';
import { ThemeProvider } from './components/harmonization/context/ThemeContext';
import { Project } from './components/harmonization/types';

function AppContent() {
  const { state, actions } = useHarmonizationState();
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showStartup, setShowStartup] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Fullscreen utility function for manual trigger
  const toggleFullscreen = React.useCallback(async () => {
    try {
      if (isFullscreen) {
        // Exit fullscreen
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          await (document as any).mozCancelFullScreen();
        }
      } else {
        // Enter fullscreen
        const docEl = document.documentElement;
        if (docEl.requestFullscreen) {
          await docEl.requestFullscreen();
        } else if ((docEl as any).webkitRequestFullscreen) {
          await (docEl as any).webkitRequestFullscreen();
        } else if ((docEl as any).msRequestFullscreen) {
          await (docEl as any).msRequestFullscreen();
        } else if ((docEl as any).mozRequestFullScreen) {
          await (docEl as any).mozRequestFullScreen();
        }
      }
    } catch (error) {
      console.log('Fullscreen toggle failed:', error);
    }
  }, [isFullscreen]);

  // Fullscreen change detection and keyboard shortcut
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      // F11 or Ctrl+Shift+F to toggle fullscreen
      if (event.key === 'F11' || (event.ctrlKey && event.shiftKey && event.key === 'F')) {
        event.preventDefault();
        toggleFullscreen();
      }
      // ESC to exit fullscreen (browser handles this automatically but we can also handle it)
      if (event.key === 'Escape' && isFullscreen) {
        // Browser will handle ESC automatically, but we can add custom logic here if needed
      }
    };

    // Listen for fullscreen changes
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    
    // Listen for keyboard shortcuts
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen, toggleFullscreen]);

  // Debug: Log state changes
  console.log('AppContent render:', { currentProject, modalShouldShow: !currentProject, showCreateDialog, showStartup, isFullscreen });

  const handleProjectSelect = (project: Project) => {
    setCurrentProject(project);
    // Here you could load project data from storage/API
    // For now, we'll just set the project and continue with empty state
  };

  const handleCreateProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'lastModified'>) => {
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
      createdAt: new Date(),
      lastModified: new Date()
    };
    setCurrentProject(newProject);
    // Here you could save the project to storage/API
  };

  const handleBackToProjects = () => {
    setCurrentProject(null);
    // Optionally clear current state when going back to projects
  };

  // Header menu handlers
  const handleNewProject = () => {
    setShowCreateDialog(true);
  };

  const handleOpenProject = () => {
    // TODO: Implement file picker for opening projects
    console.log('Open project from file system');
  };

  const handleGetFromVCS = () => {
    // TODO: Implement VCS integration
    console.log('Get project from version control');
  };



  // Show startup screen first
  if (showStartup) {
    return <StartupScreen onComplete={() => setShowStartup(false)} />;
  }

  return (
    <div className="h-screen flex flex-col bg-[#1e1e1e]">
      <HeaderBar 
        currentProject={currentProject}
        onBackToProjects={handleBackToProjects}
        onNewProject={handleNewProject}
        onOpenProject={handleOpenProject}
        onGetFromVCS={handleGetFromVCS}
        onSelectProject={handleProjectSelect}
      />
      

      
      <div className="flex-1 overflow-hidden">
        {/* Always show main harmonization interface */}
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Left Sidebar - Starting from minimum width */}
          <ResizablePanel defaultSize={15} minSize={15} maxSize={40}>
            <div className="h-full w-full">
              <LeftSidebar 
                datasets={state.sourceDatasets}
                dataDictionaries={state.dataDictionaries}
                onAddDataset={actions.addSourceDataset}
                onAddDataDictionary={actions.addDataDictionary}
                onUpdateDataset={actions.updateSourceDataset}
                onOpenFileTab={actions.openFileTab}
                onUploadSourceData={(selectedDatasetId) => actions.handleUploadSourceData(selectedDatasetId)}
              />
            </div>
          </ResizablePanel>
          
          {/* Draggable Handle */}
          <ResizableHandle className="w-1 bg-[#3c3c3c] hover:bg-[#007fd4] transition-colors duration-200 cursor-col-resize" />
          
          {/* Main Content - Takes most of the space */}
          <ResizablePanel defaultSize={70} minSize={30}>
            <div className="h-full w-full min-w-0 overflow-hidden">
              <MainContent 
                state={state} 
                actions={{
                  ...actions,
                  handleFileTypeSelection: actions.handleFileTypeSelection,
                  closeFileTypeDialog: actions.closeFileTypeDialog
                }} 
              />
            </div>
          </ResizablePanel>
          
          {/* Draggable Handle */}
          <ResizableHandle className="w-1 bg-[#3c3c3c] hover:bg-[#007fd4] transition-colors duration-200 cursor-col-resize" />
          
          {/* Right Sidebar - Starting from minimum width */}
          <ResizablePanel defaultSize={15} minSize={15} maxSize={40}>
            <div className="h-full w-full">
              <RightSidebar 
                datasets={state.targetDatasets}
                dataDictionaries={state.dataDictionaries}
                onAddDataset={actions.addTargetDataset}
                onAddDataDictionary={actions.addDataDictionary}
                onUpdateDataset={actions.updateTargetDataset}
                onOpenFileTab={actions.openFileTab}
                onTriggerMappings={actions.openMappingsTabs}
                sourceDatasets={state.sourceDatasets}
              />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Project Selection Modal - shows when no project is selected */}
      <ProjectSelectionModal
        isOpen={!currentProject}
        onProjectSelect={handleProjectSelect}
        onCreateProject={handleCreateProject}
        showCreateDialog={showCreateDialog}
        setShowCreateDialog={setShowCreateDialog}
        onClose={() => {}} // Can't close modal without selecting a project
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}