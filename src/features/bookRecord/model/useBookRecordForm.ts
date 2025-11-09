import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookRecordSchema, BookRecordFormData } from "./schema";
import { useFormLocalStorage } from "./useFormLocalStorage";

/**
 * BookRecord 전용 폼 훅
 *
 * 다음 기능을 통합 제공:
 * - Form 상태 관리 (useForm)
 * - Zod validation (bookRecordSchema)
 * - LocalStorage 자동 저장/복원 (useFormLocalStorage)
 *
 * @example
 * const methods = useBookRecordForm();
 * return <FormProvider {...methods}>...</FormProvider>
 */
export function useBookRecordForm() {
  const methods = useForm<BookRecordFormData>({
    mode: "onChange",
    resolver: zodResolver(bookRecordSchema),
    defaultValues: {
      title: "",
      author: "",
      pageCount: 0,
      publishDate: "",
      startDate: "",
      endDate: "",
      isRecommended: false,
      rating: 0,
      record: "",
      quotes: [],
      isPublic: false,
    },
  });

  useFormLocalStorage("bookForm", methods);

  return methods;
}
