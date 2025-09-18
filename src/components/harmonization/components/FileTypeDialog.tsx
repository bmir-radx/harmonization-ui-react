import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { FileText, Table } from 'lucide-react';

interface FileTypeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectType: (type: 'data' | 'dictionary') => void;
  fileName?: string;
}

export function FileTypeDialog({ isOpen, onClose, onSelectType, fileName }: FileTypeDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-[#2d2d30] border border-[#3c3c3c]">
        <DialogHeader>
          <DialogTitle className="text-[#cccccc]">
            Select File Type
          </DialogTitle>
          <DialogDescription className="text-[#a0a0a0]">
            Choose whether this file contains actual data records or describes the data structure.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-[#a0a0a0] text-sm">
            {fileName ? `What type of file is "${fileName}"?` : 'What type of file are you uploading?'}
          </p>
          
          <div className="grid grid-cols-1 gap-3">
            <Button
              onClick={() => onSelectType('dictionary')}
              variant="outline"
              className="h-auto p-4 bg-[#3c3c3c] border-[#4c4c4c] hover:bg-[#4c4c4c] hover:border-[#007fd4] text-left"
            >
              <div className="flex items-start gap-3 w-full">
                <FileText className="w-5 h-5 text-[#4ec9b0] mt-0.5 shrink-0" />
                <div className="text-left">
                  <div className="text-[#cccccc] font-medium mb-1">Data Dictionary</div>
                  <div className="text-[#808080] text-sm">
                    Describes data structure/schema (e.g., column definitions, data types)
                  </div>
                </div>
              </div>
            </Button>
            
            <Button
              onClick={() => onSelectType('data')}
              variant="outline"
              className="h-auto p-4 bg-[#3c3c3c] border-[#4c4c4c] hover:bg-[#4c4c4c] hover:border-[#007fd4] text-left"
            >
              <div className="flex items-start gap-3 w-full">
                <Table className="w-5 h-5 text-[#569cd6] mt-0.5 shrink-0" />
                <div className="text-left">
                  <div className="text-[#cccccc] font-medium mb-1">Data File</div>
                  <div className="text-[#808080] text-sm">
                    Contains actual data records/rows (e.g., participant data, measurements)
                  </div>
                </div>
              </div>
            </Button>
          </div>
          
          <div className="flex justify-end gap-2 pt-4 border-t border-[#3c3c3c]">
            <Button
              onClick={onClose}
              variant="outline"
              className="bg-[#3c3c3c] border-[#4c4c4c] hover:bg-[#4c4c4c] text-[#cccccc]"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}