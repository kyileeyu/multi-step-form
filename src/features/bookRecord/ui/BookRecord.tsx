import styled from "@emotion/styled";
import { FormTextarea } from "@/shared/components";
import { BookRecordFormData } from "../model/schema";

export const BookRecord = () => {
  return (
    <FormWrapper>
      <Description>책을 읽고 느낀 점을 자유롭게 작성해주세요</Description>
      <FormTextarea<BookRecordFormData>
        name="record"
        rows={10}
        placeholder="독서 기록을 작성해주세요..."
      />
    </FormWrapper>
  );
};

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`;
