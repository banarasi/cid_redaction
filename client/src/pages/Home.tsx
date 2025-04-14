import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import StepIndicator from "@/components/StepIndicator";
import UploadStep from "@/components/UploadStep";
import ProcessingStep from "@/components/ProcessingStep";
import DownloadStep from "@/components/DownloadStep";
import { ProcessingStage, RedactionStats } from "@/types";

export default function Home() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>("Ready to upload a PDF file");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [redactedFileId, setRedactedFileId] = useState<string | null>(null);
  const [processingStage, setProcessingStage] = useState<ProcessingStage>("Analyzing text");
  const [processingPercentage, setProcessingPercentage] = useState<number>(0);
  const [redactionStats, setRedactionStats] = useState<RedactionStats>({
    names: 0,
    phones: 0,
    pages: 0
  });
  
  // Progress calculation
  const progressWidth = `${((currentStep - 1) / 2) * 100}%`;

  // Handle file selection
  const handleFileChange = (file: File | null) => {
    if (file) {
      if (file.type !== 'application/pdf') {
        setErrorMessage('Please select a valid PDF file.');
        toast({
          variant: "destructive",
          title: "Invalid File Type",
          description: "Please select a valid PDF file."
        });
        return;
      }
      
      setSelectedFile(file);
      setErrorMessage('');
    } else {
      setSelectedFile(null);
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile) return;
    
    try {
      setCurrentStep(2);
      setStatusMessage("Processing your PDF");
      setErrorMessage('');
      
      // Set up the form data for the upload
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      // Start a polling mechanism to get processing updates
      startProcessingUpdates();
      
      // Make the upload request
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!uploadResponse.ok) {
        const error = await uploadResponse.text();
        throw new Error(error || 'Failed to upload PDF');
      }
      
      const data = await uploadResponse.json();
      
      // Store the redacted file ID for download
      setRedactedFileId(data.redacted_filename);
      
      // Set redaction statistics
      setRedactionStats({
        names: data.stats.names || 0,
        phones: data.stats.phones || 0,
        pages: data.stats.pages || 0
      });
      
      // Move to download step
      setCurrentStep(3);
      setStatusMessage("Redaction complete");
    } catch (error) {
      console.error("Upload error:", error);
      setCurrentStep(1);
      setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred');
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: error instanceof Error ? error.message : 'An unknown error occurred'
      });
    }
  };

  // Simulate processing updates (will be replaced with actual polling)
  const startProcessingUpdates = () => {
    setProcessingPercentage(0);
    
    const stages: ProcessingStage[] = [
      "Analyzing text",
      "Identifying sensitive data",
      "Applying redactions",
      "Finalizing document"
    ];
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      
      if (progress <= 100) {
        setProcessingPercentage(progress);
        
        // Update stage based on progress
        const stageIndex = Math.min(Math.floor(progress / 25), stages.length - 1);
        setProcessingStage(stages[stageIndex]);
      } else {
        clearInterval(interval);
      }
    }, 200);
  };

  // Handle download of redacted file
  const handleDownload = async () => {
    if (!redactedFileId) return;
    
    try {
      window.open(`/api/download/${redactedFileId}`, '_blank');
    } catch (error) {
      console.error("Download error:", error);
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: "Failed to download the redacted file"
      });
    }
  };

  // Reset the application to the initial state
  const handleReset = () => {
    setCurrentStep(1);
    setSelectedFile(null);
    setStatusMessage("Ready to upload a PDF file");
    setErrorMessage('');
    setRedactedFileId(null);
    setRedactionStats({
      names: 0,
      phones: 0,
      pages: 0
    });
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4">
      <main className="w-full max-w-3xl bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <header className="bg-primary px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h1 className="ml-2 text-white text-xl font-semibold">PDF Redaction Tool</h1>
          </div>
          <div className="text-white text-sm">v1.0.0</div>
        </header>

        {/* Progress Steps */}
        <StepIndicator currentStep={currentStep} />

        {/* Progress Bar */}
        <div className="px-6 pt-4">
          <div className="w-full bg-neutral-200 rounded-full h-2">
            <div className="bg-primary h-2 rounded-full" style={{ width: progressWidth }}></div>
          </div>
        </div>

        {/* Status Message */}
        <div className="px-6 pt-3 flex justify-center">
          <div className="text-neutral-600 text-sm font-medium">{statusMessage}</div>
        </div>

        {/* Content Area - Dynamic based on current step */}
        <div className="px-6 py-6">
          {currentStep === 1 && (
            <UploadStep
              file={selectedFile}
              onFileChange={handleFileChange}
              onSubmit={handleUpload}
            />
          )}
          
          {currentStep === 2 && (
            <ProcessingStep
              stage={processingStage}
              percentage={processingPercentage}
            />
          )}
          
          {currentStep === 3 && (
            <DownloadStep
              stats={redactionStats}
              onDownload={handleDownload}
              onReset={handleReset}
            />
          )}
        </div>

        {/* Error Message Area */}
        {errorMessage && (
          <div className="px-6 pb-6">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>{errorMessage}</div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
