import {
  BasicInfo,
  Rating,
  BookRecord,
  Quotes,
  PublicOrNot,
} from "@/features/bookRecord/ui";

export const STEP_COMPONENTS = [
  BasicInfo,
  Rating,
  BookRecord,
  Quotes,
  PublicOrNot,
] as const;

export const TOTAL_STEPS = STEP_COMPONENTS.length;

export const STEP_NAMES = [
  "기본 정보",
  "평점",
  "독서 기록",
  "인용구",
  "공개 설정",
] as const;

export const BOOK_RECORD_STATUS = [
  { value: "READ", label: "읽음" },
  { value: "READING", label: "읽는 중" },
  { value: "PENDING", label: "읽을 예정" },
  { value: "WISHLIST", label: "위시리스트" },
];
