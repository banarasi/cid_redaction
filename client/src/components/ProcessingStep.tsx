import { ProcessingStage } from "@/types";

interface ProcessingStepProps {
  stage: ProcessingStage;
  percentage: number;
}

const ProcessingStep: React.FC<ProcessingStepProps> = ({ stage, percentage }) => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="relative h-24 w-24 mb-6">
        {/* Spinner */}
        <div className="absolute inset-0 border-4 border-neutral-200 rounded-full"></div>
        <div 
          className="absolute inset-0 border-4 border-primary rounded-full animate-spin" 
          style={{ borderTopColor: 'transparent', animationDuration: '1.5s' }}
        ></div>
        
        {/* PDF Icon in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
      </div>
      
      <h3 className="text-neutral-800 font-medium text-lg mb-2">Processing your PDF</h3>
      <p className="text-neutral-600 text-center max-w-md mb-6">
        Our system is analyzing your document and identifying sensitive information for redaction.
      </p>
      
      <div className="w-full max-w-md">
        <div className="flex justify-between mb-1 text-sm">
          <span className="text-neutral-600">{stage}</span>
          <span className="text-neutral-600">{percentage}%</span>
        </div>
        <div className="w-full bg-neutral-200 rounded-full h-2.5">
          <div 
            className="bg-primary h-2.5 rounded-full" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingStep;
