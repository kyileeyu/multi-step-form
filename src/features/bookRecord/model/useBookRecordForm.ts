import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookRecordSchema, BookRecordFormData } from "./schema";
import { useLocalStorage } from "@/shared/hooks/useLocalStorage";

/**
 * BookRecord 전용 폼 훅
 *
 * 다음 기능을 통합 제공:
 * - Form 상태 관리 (useForm)
 * - Zod validation (bookRecordSchema)
 * - LocalStorage 자동 저장/복원
 *
 * @example
 * const methods = useBookRecordForm();
 * return <FormProvider {...methods}>...</FormProvider>
 */
export function useBookRecordForm() {
  const defaultValues = {
    title: "",
    author: "",
    pageCount: 0,
    publishDate: "",
    status: undefined as BookRecordFormData["status"] | undefined,
    startDate: "",
    endDate: "",
    isRecommended: false,
    rating: 0,
    record: "",
    quotes: [] as string[],
    isPublic: false,
  };

  const methods = useForm<BookRecordFormData>({
    mode: "onChange",
    resolver: zodResolver(bookRecordSchema),
    defaultValues,
  });

  // localStorage와 form 연동
  const [savedData, setSavedData] = useLocalStorage("bookForm", defaultValues);

  useEffect(() => {
    if (savedData && Object.keys(savedData).length > 0) {
      methods.reset(savedData, { keepDefaultValues: true });
    }
  }, []);

  useEffect(() => {
    const subscription = methods.watch((value) => {
      setSavedData(value as BookRecordFormData);
    });
    return () => subscription.unsubscribe();
  }, [methods, setSavedData]);

  return methods;
}
