export type BookRecordType = {
  id: string;
  title: string;
  author: string;
  pageCount: number;
  status: "READ" | "READING" | "PENDING" | "WISHLIST";
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
