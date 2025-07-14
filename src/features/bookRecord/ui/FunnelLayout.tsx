import { Box, Button, Typography } from "@mui/material";
import { ReactNode } from "react";

interface Props {
  step: number;
  children: ReactNode;
  onNext: () => void;
  onPrev: () => void;
}

export const FunnelLayout = ({ step, children, onNext, onPrev }: Props) => {
  return (
    <Box
      display="flex"
      maxWidth="600px"
      margin="0 auto"
      flexDirection="column"
      height="100vh"
      justifyContent="space-between"
    >
      <Box px={2} py={3} borderBottom="1px solid #ddd">
        <Typography variant="h6">📘 책 기록하기 - Step {step}</Typography>
      </Box>

      <Box flexGrow={1} px={2} py={3}>
        {children}
      </Box>

      <Box
        px={2}
        py={2}
        borderTop="1px solid #ddd"
        display="flex"
        justifyContent="space-between"
      >
        <Button onClick={onPrev} disabled={step === 1} variant="contained">
          이전
        </Button>
        <Button onClick={onNext} disabled={step === 5} variant="contained">
          다음
        </Button>
      </Box>
    </Box>
  );
};
