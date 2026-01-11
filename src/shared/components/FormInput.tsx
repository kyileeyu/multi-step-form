import { InputHTMLAttributes } from "react";
import {
  Controller,
  FieldPath,
  FieldValues,
  useFormContext,
} from "react-hook-form";
import styled from "@emotion/styled";

interface FormInputProps<T extends FieldValues>
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "name"> {
  name: FieldPath<T>;
  label?: string;
  /** number 타입의 경우 자동으로 Number() 변환 */
  valueAsNumber?: boolean;
}

export function FormInput<T extends FieldValues>({
  name,
  label,
  valueAsNumber = false,
  type,
  ...inputProps
}: FormInputProps<T>) {
  const { control } = useFormContext<T>();

  const shouldConvertToNumber = valueAsNumber || type === "number";

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormField>
          {label && <Label>{label}</Label>}
          <Input
            {...inputProps}
            {...field}
            type={type}
            $hasError={!!error}
            onChange={(e) => {
              const value = shouldConvertToNumber
                ? Number(e.target.value)
                : e.target.value;
              field.onChange(value);
            }}
          />
          {error && <ErrorMessage>{error.message}</ErrorMessage>}
        </FormField>
      )}
    />
  );
}

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Input = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid
    ${({ theme, $hasError }) =>
      $hasError ? theme.colors.error : theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: ${({ theme }) => theme.fontSize.md};
  background: ${({ theme }) => theme.colors.card};
  color: ${({ theme }) => theme.colors.text};
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme, $hasError }) =>
      $hasError ? theme.colors.error : theme.colors.primary};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const ErrorMessage = styled.p`
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.colors.error};
  margin: 0;
`;
