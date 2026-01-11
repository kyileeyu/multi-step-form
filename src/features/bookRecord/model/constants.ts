import {
  BasicInfo,
  Rating,
  BookRecord,
  Quotes,
  PublicOrNot,
} from "@/features/bookRecord/ui";

// Step 컴포넌트를 배열로 관리 (0-based)
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
