import styled from "@emotion/styled";
import { ReactNode } from "react";
import { useStepContext } from "../model/StepContext";
import { STEP_NAMES } from "../model/constants";
import { ChevronLeft } from "@/shared/icons/ChevronLeft";

interface Props {
  children: ReactNode;
}

export const FunnelLayout = ({ children }: Props) => {
  const { currentStep, isFirstStep, isLastStep, nextStep, prevStep } =
    useStepContext();

  return (
    <PageWrapper>
      <Header>
        <Title>책 기록</Title>
      </Header>

      <Card>
        <CardHeader>
          {!isFirstStep && (
            <BackButton onClick={prevStep}>
              <ChevronLeft size={20} />
            </BackButton>
          )}
          <StepTitle>{STEP_NAMES[currentStep]}</StepTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>

      <SubmitButton onClick={nextStep} disabled={isLastStep}>
        {isLastStep ? "저장하기" : "다음"}
      </SubmitButton>
    </PageWrapper>
  );
};

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.div`
  width: 100%;
  max-width: 500px;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const Card = styled.div`
  width: 100%;
  max-width: 500px;
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const StepTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: ${({ theme }) => theme.fontSize.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  padding: 0;
  line-height: 1;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const CardContent = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const SubmitButton = styled.button`
  width: 100%;
  max-width: 500px;
  margin-top: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: 500;
  border: none;
  border-radius: ${({ theme }) => theme.radius.lg};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.primaryHover};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.disabled};
    cursor: not-allowed;
  }
`;
