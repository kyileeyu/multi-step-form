import { TextareaHTMLAttributes } from "react";
import {
  Controller,
  FieldPath,
  FieldValues,
  useFormContext,
} from "react-hook-form";

interface FormTextareaProps<T extends FieldValues>
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "name"> {
  name: FieldPath<T>;
  errorClassName?: string;
}

/**
 * FormTextarea - textarea 요소를 위한 form 컴포넌트
 *
 * 기능:
 * - Controller 보일러플레이트 제거
 * - 자동 에러 메시지 표시
 * - 모든 textarea HTML 속성 지원
 *
 * @example
 * <FormTextarea name="record" rows={10} placeholder="독서 기록..." />
 * <FormTextarea name="description" className="border p-2 rounded" />
 */
export function FormTextarea<T extends FieldValues>({
  name,
  errorClassName = "text-red-500 text-sm",
  ...textareaProps
}: FormTextareaProps<T>) {
  const { control } = useFormContext<T>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <>
          <textarea {...textareaProps} {...field} />
          {error && <p className={errorClassName}>{error.message}</p>}
        </>
      )}
    />
  );
}
