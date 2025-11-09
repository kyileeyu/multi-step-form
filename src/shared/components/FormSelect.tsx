import { SelectHTMLAttributes } from "react";
import {
  Controller,
  FieldPath,
  FieldValues,
  useFormContext,
} from "react-hook-form";

interface SelectOption {
  value: string | number;
  label: string;
}

interface FormSelectProps<T extends FieldValues>
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "name"> {
  name: FieldPath<T>;
  options: readonly SelectOption[] | SelectOption[];
  placeholder?: string;
  errorClassName?: string;
}

/**
 * FormSelect - select 요소를 위한 form 컴포넌트
 *
 * 기능:
 * - Controller 보일러플레이트 제거
 * - 자동 에러 메시지 표시
 * - options 배열을 받아 자동으로 option 요소 생성
 * - placeholder 지원 (빈 disabled option으로 표시)
 * - 모든 select HTML 속성 지원
 *
 * @example
 * <FormSelect
 *   name="status"
 *   options={BOOK_RECORD_STATUS}
 *   placeholder="상태를 선택하세요"
 * />
 */
export function FormSelect<T extends FieldValues>({
  name,
  options,
  placeholder,
  errorClassName = "text-red-500 text-sm",
  ...selectProps
}: FormSelectProps<T>) {
  const { control } = useFormContext<T>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <>
          <select {...selectProps} {...field}>
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {error && <p className={errorClassName}>{error.message}</p>}
        </>
      )}
    />
  );
}
