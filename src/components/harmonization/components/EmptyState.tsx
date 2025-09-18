import React from 'react';
import { Upload, FileText, Database, ArrowRight } from 'lucide-react';
import { Button } from '../../ui/button';

interface EmptyStateProps {
  onUploadSourceData?: () => void;
  onCreateTargetDictionary?: () => void;
}

export function EmptyState({ 
  onUploadSourceData,
  onCreateTargetDictionary 
}: EmptyStateProps = {}) {
  return (
    <div className="h-full flex items-center justify-center bg-[#252526] p-8">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="mb-6">
          <div className="w-20 h-20 bg-[#3c3c3c] rounded-full flex items-center justify-center mx-auto mb-4">
            <Database className="w-10 h-10 text-[#007fd4]" />
          </div>
        </div>

        {/* Main heading */}
        <h2 className="text-xl font-medium text-[#cccccc] mb-3">
          Get Started with Data Harmonization
        </h2>

        {/* Description */}
        <p className="text-[#a0a0a0] text-base mb-8 leading-relaxed">
          Begin by uploading your source datasets and creating or uploading your target data dictionary to start the harmonization process.
        </p>

        {/* Steps - Now showing as parallel options */}
        <div className="mb-8">
          <h3 className="text-[#cccccc] font-medium mb-4">Choose your starting point:</h3>
          
          <div className="flex flex-col gap-4">
            {/* Source Dataset Option */}
            <button
              onClick={onUploadSourceData}
              className="bg-[#2d2d30] border border-[#3c3c3c] rounded-lg p-4 hover:bg-[#3c3c3c] hover:border-[#007fd4] transition-all duration-200 cursor-pointer w-full disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!onUploadSourceData}
            >
              <div className="flex items-start gap-3 text-left">
                <div className="w-8 h-8 bg-[#007fd4] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Upload className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-[#cccccc] font-medium mb-1">Upload Source Dataset</h4>
                  <p className="text-[#808080] text-sm">
                    Select or drag and drop your source data files and data dictionary
                  </p>
                </div>
              </div>
            </button>

            {/* OR Divider */}
            <div className="flex items-center gap-3 text-[#808080] text-sm">
              <div className="flex-1 h-px bg-[#3c3c3c]"></div>
              <span className="px-2">OR</span>
              <div className="flex-1 h-px bg-[#3c3c3c]"></div>
            </div>

            {/* Target Dictionary Option */}
            <button
              onClick={onCreateTargetDictionary}
              className="bg-[#2d2d30] border border-[#3c3c3c] rounded-lg p-4 hover:bg-[#3c3c3c] hover:border-[#007fd4] transition-all duration-200 cursor-pointer w-full disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!onCreateTargetDictionary}
            >
              <div className="flex items-start gap-3 text-left">
                <div className="w-8 h-8 bg-[#4CAF50] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-[#cccccc] font-medium mb-1">Create Target Data Dictionary</h4>
                  <p className="text-[#808080] text-sm">
                    Upload or create your target schema to define harmonization targets
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* Next Step */}
          <div className="mt-6 flex items-center justify-center gap-2 text-[#808080] text-sm">
            <ArrowRight className="w-4 h-4" />
            <span>Once both are ready, start harmonization mapping</span>
          </div>
        </div>

        {/* Upload hints */}
        <div className="bg-[#2d2d30] border border-[#3c3c3c] rounded-lg p-4">
          <h4 className="text-[#cccccc] font-medium mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Supported File Types
          </h4>
          <div className="text-[#a0a0a0] text-sm space-y-1">
            <div><strong>Data Files:</strong> CSV, Excel (.xlsx)</div>
            <div><strong>Data Dictionaries:</strong> CSV, Excel (.xlsx)</div>
          </div>
        </div>


      </div>
    </div>
  );
}