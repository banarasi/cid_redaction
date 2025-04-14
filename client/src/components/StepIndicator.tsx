interface StepIndicatorProps {
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const steps = [
    { number: 1, label: "Upload PDF" },
    { number: 2, label: "Processing" },
    { number: 3, label: "Download" }
  ];

  return (
    <div className="flex justify-between px-6 pt-6">
      {steps.map((step, index) => {
        // Determine the step status
        const isCompleted = index + 1 < currentStep;
        const isCurrent = index + 1 === currentStep;
        
        // Apply styling based on step status
        const circleClasses = [
          "w-10 h-10 rounded-full flex items-center justify-center",
          isCompleted ? "bg-success text-white" : 
          isCurrent ? "bg-primary text-white" : 
          "bg-neutral-300 text-neutral-600"
        ].join(" ");
        
        const textClasses = [
          "text-sm mt-2",
          isCompleted ? "text-success" : 
          isCurrent ? "text-primary" : 
          "text-neutral-500"
        ].join(" ");
        
        return (
          <div key={step.number} className="flex flex-col items-center w-1/3">
            <div className={circleClasses}>
              {isCompleted ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                step.number
              )}
            </div>
            <div className={textClasses}>{step.label}</div>
          </div>
        );
      })}
    </div>
  );
};

export default StepIndicator;
