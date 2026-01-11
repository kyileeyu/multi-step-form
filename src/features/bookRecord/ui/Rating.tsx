import styled from "@emotion/styled";
import { Controller, useFormContext } from "react-hook-form";
import { StarRating } from "@/shared/components/StarRating";

export const Rating = () => {
  const { control } = useFormContext();

  return (
    <FormWrapper>
      <FormField>
        <Label>평점</Label>
        <Controller
          name={"rating"}
          control={control}
          render={({ field }) => (
            <StarRating
              precision={0.5}
              value={field.value || 0}
              onChange={field.onChange}
            />
          )}
        />
      </FormField>

      <FormField>
        <Controller
          name={"isRecommended"}
          control={control}
          render={({ field }) => (
            <CheckboxLabel>
              <Checkbox
                type="checkbox"
                checked={field.value || false}
                onChange={field.onChange}
              />
              이 책을 추천합니다
            </CheckboxLabel>
          )}
        />
      </FormField>
    </FormWrapper>
  );
};

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

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
