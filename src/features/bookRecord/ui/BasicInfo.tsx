import { FormInput, FormSelect } from "@/shared/components";
import { BookRecordFormData } from "../model/schema";
import { BOOK_RECORD_STATUS } from "../model/constants";

export const BasicInfo = () => {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">책 기본 정보</h2>
      <p className="text-sm text-gray-600">기본 정보를 입력해주세요</p>

      <div className="flex flex-col gap-5">
        <FormInput<BookRecordFormData> name="title" placeholder="제목" />

        <FormInput<BookRecordFormData>
          name="publishDate"
          type="date"
          placeholder="도서 출판일"
        />

        <FormInput<BookRecordFormData> name="author" placeholder="저자" />

        <FormInput<BookRecordFormData>
          name="pageCount"
          type="number"
          placeholder="페이지 수"
        />

        <FormSelect<BookRecordFormData>
          name="status"
          options={BOOK_RECORD_STATUS}
          placeholder="상태"
          id="status"
        />

        <FormInput<BookRecordFormData>
          name="startDate"
          type="date"
          placeholder="독서 시작일"
        />

        <FormInput<BookRecordFormData>
          name="endDate"
          type="date"
          placeholder="독서 종료일"
        />
      </div>
    </div>
  );
};
