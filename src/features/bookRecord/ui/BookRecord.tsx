import { FormTextarea, FormWrapper, FormDescription } from "@/shared/components";
import { BookRecordFormData } from "../model/schema";

export const BookRecord = () => {
  return (
    <FormWrapper>
      <FormDescription>책을 읽고 느낀 점을 자유롭게 작성해주세요</FormDescription>
      <FormTextarea<BookRecordFormData>
        name="record"
        rows={10}
        placeholder="독서 기록을 작성해주세요..."
      />
    </FormWrapper>
  );
};
