import { RedactionStats } from "@/types";

interface DownloadStepProps {
  stats: RedactionStats;
  onDownload: () => void;
  onReset: () => void;
}

const DownloadStep: React.FC<DownloadStepProps> = ({ stats, onDownload, onReset }) => {
  return (
    <div className="flex flex-col items-center justify-center py-6">
      <div className="rounded-full bg-success/10 p-4 mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <h3 className="text-neutral-800 font-medium text-lg mb-2">Redaction Complete!</h3>
      <p className="text-neutral-600 text-center max-w-md mb-6">
        Your document has been processed. Sensitive information has been redacted.
      </p>

      {/* Redaction Summary */}
      <div className="w-full max-w-md p-4 border border-neutral-200 rounded-lg bg-neutral-50 mb-6">
        <h4 className="text-neutral-700 font-medium mb-3">Redaction Summary:</h4>
        <div className="flex justify-between mb-1">
          <span className="text-neutral-600">Person names</span>
          <span className="font-medium text-neutral-800">{stats.names} instances</span>
        </div>
        <div className="flex justify-between mb-1">
          <span className="text-neutral-600">Phone numbers</span>
          <span className="font-medium text-neutral-800">{stats.phones} instances</span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-600">Pages processed</span>
          <span className="font-medium text-neutral-800">{stats.pages} pages</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button 
          className="px-6 py-2.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-medium rounded-lg transition-colors flex items-center"
          onClick={onReset}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Start Over
        </button>
        <button 
          className="px-6 py-2.5 bg-primary hover:bg-blue-600 text-white font-medium rounded-lg transition-colors flex items-center"
          onClick={onDownload}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Redacted PDF
        </button>
      </div>
    </div>
  );
};

export default DownloadStep;
