import { InputHTMLAttributes } from "react";
import {
  Controller,
  FieldPath,
  FieldValues,
  useFormContext,
} from "react-hook-form";

interface FormInputProps<T extends FieldValues>
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "name"> {
  name: FieldPath<T>;
  errorClassName?: string;
  /** number 타입의 경우 자동으로 Number() 변환 */
  valueAsNumber?: boolean;
}

/**
 * FormInput - input 요소를 위한 form 컴포넌트
 *
 * 기능:
 * - Controller 보일러플레이트 제거
 * - 자동 에러 메시지 표시
 * - type="number"일 때 자동으로 Number() 변환 (valueAsNumber: true)
 * - 모든 input HTML 속성 지원
 *
 * @example
 * <FormInput name="title" placeholder="제목" />
 * <FormInput name="pageCount" type="number" valueAsNumber placeholder="페이지 수" />
 * <FormInput name="publishDate" type="date" />
 */
export function FormInput<T extends FieldValues>({
  name,
  errorClassName = "text-red-500 text-sm",
  valueAsNumber = false,
  type,
  ...inputProps
}: FormInputProps<T>) {
  const { control } = useFormContext<T>();

  // type="number"면 자동으로 valueAsNumber 활성화
  const shouldConvertToNumber = valueAsNumber || type === "number";

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <>
          <input
            {...inputProps}
            {...field}
            type={type}
            onChange={(e) => {
              const value = shouldConvertToNumber
                ? Number(e.target.value)
                : e.target.value;
              field.onChange(value);
            }}
          />
          {error && <p className={errorClassName}>{error.message}</p>}
        </>
      )}
    />
  );
}
