import { z } from "zod";

export const bookRecordSchema = z
  .object({
    // 기본 정보
    id: z.string().optional(),
    title: z.string().min(1, "제목은 필수입니다."),
    author: z.string(),
    pageCount: z.number().min(1, "페이지 수는 필수입니다."),
    publishDate: z.string().min(1, "출판일은 필수입니다."),
    status: z.enum(["READ", "READING", "PENDING", "WISHLIST"], {
      message: "상태는 필수입니다.",
    }),

    // 날짜 정보
    startDate: z.string(),
    endDate: z.string(),

    // 평가
    isRecommended: z.boolean(),
    rating: z.number().min(0).max(5),

    // 기록
    record: z.string(),

    // 인용구
    quotes: z.array(z.string()),

    // 공개 설정
    isPublic: z.boolean(),
  })
  // WISHLIST 상태면 startDate 입력 불가
  .refine(
    (data) => {
      if (data.status === "WISHLIST" && data.startDate) {
        return false;
      }
      return true;
    },
    {
      message: "독서 시작일은 입력할 수 없습니다.",
      path: ["startDate"],
    }
  )
  // WISHLIST, PENDING 상태면 endDate 입력 불가
  .refine(
    (data) => {
      if (
        (data.status === "WISHLIST" || data.status === "PENDING") &&
        data.endDate
      ) {
        return false;
      }
      return true;
    },
    {
      message: "독서 종료일은 입력할 수 없습니다.",
      path: ["endDate"],
    }
  )
  // endDate는 startDate 이후여야 함
  .refine(
    (data) => {
      if (
        data.startDate &&
        data.endDate &&
        new Date(data.endDate) < new Date(data.startDate)
      ) {
        return false;
      }
      return true;
    },
    {
      message: "독서 종료일은 시작일 이후여야 합니다.",
      path: ["endDate"],
    }
  )
  // endDate는 publishDate 이후여야 함
  .refine(
    (data) => {
      if (
        data.publishDate &&
        data.endDate &&
        new Date(data.endDate) < new Date(data.publishDate)
      ) {
        return false;
      }
      return true;
    },
    {
      message: "독서 종료일은 출판일 이후여야 합니다.",
      path: ["endDate"],
    }
  )
  // rating이 극단적(1 이하 또는 5)이면 record는 100자 이상
  .refine(
    (data) => {
      if ((data.rating <= 1 || data.rating >= 5) && data.record.length < 100) {
        return false;
      }
      return true;
    },
    {
      message: "100자 이상의 이유를 입력해주세요.",
      path: ["record"],
    }
  );

export type BookRecordFormData = z.infer<typeof bookRecordSchema>;
