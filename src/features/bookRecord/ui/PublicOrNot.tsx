import styled from "@emotion/styled";
import { Controller, useFormContext } from "react-hook-form";
import { FormWrapper, FormDescription } from "@/shared/components";

export const PublicOrNot = () => {
  const { control } = useFormContext();
  return (
    <FormWrapper gap="lg">
      <FormDescription>이 독서 기록을 다른 사람들과 공유할까요?</FormDescription>
      <Controller
        name={"isPublic"}
        control={control}
        render={({ field }) => (
          <CheckboxLabel>
            <Checkbox
              type="checkbox"
              checked={field.value || false}
              onChange={field.onChange}
            />
            공개하기
          </CheckboxLabel>
        )}
      />
    </FormWrapper>
  );
};

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSize.md};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: ${({ theme }) => theme.colors.primary};
`;
