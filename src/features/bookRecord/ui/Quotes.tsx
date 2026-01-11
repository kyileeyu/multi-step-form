import { FormTextarea, FormWrapper, FormDescription } from "@/shared/components";
import { BookRecordFormData } from "../model/schema";

export const Quotes = () => {
  return (
    <FormWrapper>
      <FormDescription>기억에 남는 문장을 기록해주세요</FormDescription>
      <FormTextarea<BookRecordFormData>
        name="quotes"
        rows={6}
        placeholder="인용구를 입력하세요..."
      />
    </FormWrapper>
  );
};
