import { FormTextarea } from "@/shared/components";
import { BookRecordFormData } from "../model/schema";

export const BookRecord = () => {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">독서 기록</h2>
      <p className="text-sm text-gray-600">
        책을 읽고 느낀 점을 자유롭게 작성해주세요
      </p>

      <FormTextarea<BookRecordFormData>
        name="record"
        rows={10}
        placeholder="독서 기록을 작성해주세요..."
        className="border p-2 rounded"
      />
    </div>
  );
};
