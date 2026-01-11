import { Box, Button, Typography } from "@mui/material";
import { ReactNode } from "react";
import { useStepContext } from "../model/StepContext";
import { STEP_NAMES } from "../model/constants";

interface Props {
  children: ReactNode;
}

export const FunnelLayout = ({ children }: Props) => {
  const { currentStep, isFirstStep, isLastStep, nextStep, prevStep } =
    useStepContext();

  return (
    <Box
      display="flex"
      maxWidth="600px"
      margin="0 auto"
      flexDirection="column"
      height="100vh"
      justifyContent="space-between">
      <Box px={2} py={3} borderBottom="1px solid #ddd">
        <Typography variant="h6">
          📘 책 기록하기 - {STEP_NAMES[currentStep]} (Step {currentStep + 1})
        </Typography>
      </Box>

      <Box flexGrow={1} px={2} py={3}>
        {children}
      </Box>

      <Box
        px={2}
        py={2}
        borderTop="1px solid #ddd"
        display="flex"
        justifyContent="space-between">
        <Button onClick={prevStep} disabled={isFirstStep} variant="contained">
          이전
        </Button>
        <Button onClick={nextStep} disabled={isLastStep} variant="contained">
          다음
        </Button>
      </Box>
    </Box>
  );
};
