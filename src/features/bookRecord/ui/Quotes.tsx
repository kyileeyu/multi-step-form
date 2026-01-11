import styled from "@emotion/styled";
import { FormTextarea } from "@/shared/components";
import { BookRecordFormData } from "../model/schema";

export const Quotes = () => {
  return (
    <FormWrapper>
      <Description>기억에 남는 문장을 기록해주세요</Description>
      <FormTextarea<BookRecordFormData>
        name="quotes"
        rows={6}
        placeholder="인용구를 입력하세요..."
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
