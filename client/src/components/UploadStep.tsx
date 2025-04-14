import { useRef, useState } from "react";

interface UploadStepProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  onSubmit: () => void;
}

const UploadStep: React.FC<UploadStepProps> = ({ file, onFileChange, onSubmit }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    onFileChange(selectedFile);
  };

  // Handle drag events
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    
    if (e.dataTransfer.files.length) {
      const droppedFile = e.dataTransfer.files[0];
      onFileChange(droppedFile);
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Handle file removal
  const removeFile = () => {
    onFileChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="flex flex-col">
      {/* File Upload Zone */}
      <div 
        className={`upload-zone rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer h-64 ${isDragActive ? 'active' : ''}`}
        onClick={triggerFileInput}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-neutral-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <div className="text-neutral-600 font-medium text-lg mb-1">Drag and drop a PDF file</div>
        <div className="text-neutral-500 text-sm mb-4">or click to browse files</div>
        <input 
          type="file" 
          id="file-input" 
          ref={fileInputRef}
          accept=".pdf" 
          className="hidden"
          onChange={handleFileInputChange}
        />
        <div className="flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-neutral-500 text-xs">Only PDF files are accepted</span>
        </div>
      </div>

      {/* Selected File Preview */}
      {file && (
        <div className="mt-6 p-4 border border-neutral-200 rounded-lg bg-neutral-50">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <div className="flex-1">
              <div className="text-neutral-800 font-medium truncate">{file.name}</div>
              <div className="text-neutral-500 text-sm">{formatFileSize(file.size)}</div>
            </div>
            <button 
              className="text-neutral-500 hover:text-neutral-700"
              onClick={(e) => {
                e.stopPropagation();
                removeFile();
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Redaction Options */}
      <div className="my-6 p-4 border border-neutral-200 rounded-lg">
        <h3 className="text-neutral-700 font-medium mb-3">Information to be redacted:</h3>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center">
            <div className="w-5 h-5 rounded bg-error flex items-center justify-center mr-3"></div>
            <div className="text-neutral-700">Person names</div>
          </div>
          <div className="flex items-center">
            <div className="w-5 h-5 rounded bg-error flex items-center justify-center mr-3"></div>
            <div className="text-neutral-700">Phone numbers</div>
          </div>
        </div>
      </div>

      {/* Upload Button */}
      <div className="mt-4 flex justify-end">
        <button 
          className="disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2 bg-primary hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
          disabled={!file}
          onClick={onSubmit}
        >
          Start Redaction Process
        </button>
      </div>
    </div>
  );
};

export default UploadStep;
