import { createContext, useContext, ReactNode } from "react";
import { useStepMove } from "./useStepMove";
import { TOTAL_STEPS } from "./constants";

interface StepContextValue {
  currentStep: number;
  totalSteps: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
}

const StepContext = createContext<StepContextValue | null>(null);

interface StepProviderProps {
  children: ReactNode;
}

export const StepProvider = ({ children }: StepProviderProps) => {
  const stepState = useStepMove(TOTAL_STEPS);

  const value: StepContextValue = {
    ...stepState,
    totalSteps: TOTAL_STEPS,
  };

  return <StepContext.Provider value={value}>{children}</StepContext.Provider>;
};

export const useStepContext = () => {
  const context = useContext(StepContext);
  if (!context) {
    throw new Error("useStepContext must be used within StepProvider");
  }
  return context;
};
