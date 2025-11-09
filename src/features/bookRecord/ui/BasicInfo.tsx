import { Controller, useFormContext } from "react-hook-form";
import { BOOK_RECORD_STATUS } from "@/features/bookRecord/model/type";
import { BookRecordFormData } from "../model/schema";

export const BasicInfo = () => {
  const { control } = useFormContext<BookRecordFormData>();

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">책 기본 정보</h2>
      <p className="text-sm text-gray-600">기본 정보를 입력해주세요</p>

      <div className="flex flex-col gap-5">
        <Controller
          name="title"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <>
              <input {...field} placeholder="제목" />
              {error && <p className="text-red-500 text-sm">{error.message}</p>}
            </>
          )}
        />

        <Controller
          name="publishDate"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <>
              <input {...field} type="date" placeholder="도서 출판일" />
              {error && <p className="text-red-500 text-sm">{error.message}</p>}
            </>
          )}
        />

        <Controller
          name="author"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <>
              <input {...field} placeholder="저자" />
              {error && <p className="text-red-500 text-sm">{error.message}</p>}
            </>
          )}
        />

        <Controller
          name="pageCount"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <>
              <input
                {...field}
                type="number"
                placeholder="페이지 수"
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
              {error && <p className="text-red-500 text-sm">{error.message}</p>}
            </>
          )}
        />

        <Controller
          name="status"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <>
              <select {...field} id="status">
                <option value="" disabled>
                  상태
                </option>
                {BOOK_RECORD_STATUS.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
              {error && <p className="text-red-500 text-sm">{error.message}</p>}
            </>
          )}
        />

        <Controller
          name="startDate"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <>
              <input {...field} type="date" placeholder="독서 시작일" />
              {error && <p className="text-red-500 text-sm">{error.message}</p>}
            </>
          )}
        />

        <Controller
          name="endDate"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <>
              <input {...field} type="date" placeholder="독서 종료일" />
              {error && <p className="text-red-500 text-sm">{error.message}</p>}
            </>
          )}
        />
      </div>
    </div>
  );
};
