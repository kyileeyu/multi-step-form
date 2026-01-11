import styled from "@emotion/styled";
import { FormInput, FormSelect } from "@/shared/components";
import { BookRecordFormData } from "../model/schema";
import { BOOK_RECORD_STATUS } from "../model/constants";

export const BasicInfo = () => {
  return (
    <FormWrapper>
      <FormInput<BookRecordFormData> name="title" label="제목" placeholder="제목을 입력하세요" />
      <FormInput<BookRecordFormData> name="author" label="저자" placeholder="저자를 입력하세요" />
      <FormInput<BookRecordFormData>
        name="publishDate"
        type="date"
        label="도서 출판일"
      />
      <FormInput<BookRecordFormData>
        name="pageCount"
        type="number"
        label="페이지 수"
        placeholder="페이지 수를 입력하세요"
      />
      <FormSelect<BookRecordFormData>
        name="status"
        options={BOOK_RECORD_STATUS}
        label="상태"
        placeholder="상태를 선택하세요"
      />
      <FormInput<BookRecordFormData>
        name="startDate"
        type="date"
        label="독서 시작일"
      />
      <FormInput<BookRecordFormData>
        name="endDate"
        type="date"
        label="독서 종료일"
      />
    </FormWrapper>
  );
};

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;
