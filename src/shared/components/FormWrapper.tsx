import styled from "@emotion/styled";

interface FormWrapperProps {
  gap?: "sm" | "md" | "lg";
}

export const FormWrapper = styled.div<FormWrapperProps>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme, gap = "md" }) => theme.spacing[gap]};
`;
