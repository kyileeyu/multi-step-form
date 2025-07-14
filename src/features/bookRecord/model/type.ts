export const BOOK_RECORD_STATUS = [
  { value: "READ", label: "읽음" },
  { value: "READING", label: "읽는 중" },
  { value: "PENDING", label: "읽을 예정" },
  { value: "WISHLIST", label: "위시리스트" },
];

export type BookRecordType = {
  id: string;
  title: string;
  author: string;
  pageCount: number;
  publishDate: string;
  status: (typeof BOOK_RECORD_STATUS)[number]["value"];
  startDate: string;
  endDate: string;
  //
  isRecommended: boolean;
  rating: number;
  //
  record: string;
  //
  quotes: string[];
  //
  isPublic: boolean;
};
