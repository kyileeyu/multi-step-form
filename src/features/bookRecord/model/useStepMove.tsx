import { useState } from "react";

export const useStepMove = (totalSteps: number) => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const nextStep = () => setCurrentStep((s) => Math.min(s + 1, totalSteps - 1));

  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const goToStep = (step: number) => {
    if (step >= 0 && step < totalSteps) {
      setCurrentStep(step);
    }
  };

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  return {
    currentStep,
    nextStep,
    prevStep,
    goToStep,
    isFirstStep,
    isLastStep,
  };
};
