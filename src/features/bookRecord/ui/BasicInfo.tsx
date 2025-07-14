import { Controller, useFormContext } from "react-hook-form";
import {
  BOOK_RECORD_STATUS,
  BookRecordType,
} from "@/features/bookRecord/model/type";

export const BasicInfo = () => {
  const { control } = useFormContext<BookRecordType>();

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">책 기본 정보</h2>
      <p className="text-sm text-gray-600">기본 정보를 입력해주세요</p>
      <div className={"flex flex-col gap-5"}>
        <Controller
          name={"title"}
          control={control}
          rules={{ required: "제목은 필수입니다." }}
          render={(field) => <input {...field} placeholder="제목" />}
        />
        <Controller
          name={"publishDate"}
          control={control}
          rules={{ required: "출판일은 필수입니다." }}
          render={({ field }) => (
            <input {...field} type="date" placeholder="도서 출판일" />
          )}
        />
        <Controller
          name={"status"}
          control={control}
          rules={{ required: "상태는 필수입니다." }}
          render={({ field }) => (
            <select {...field} id="status">
              <option disabled selected>
                상태
              </option>
              {BOOK_RECORD_STATUS.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          )}
        />
        <Controller
          name={"startDate"}
          control={control}
          rules={{
            //그냥 입력을 막아버리면 안될까?
            validate: (value, vals) => {
              const status = vals.status;
              if (status === "WISHLIST" && value) {
                return "독서 시작일은 입력할 수 없습니다.";
              }
              if (!value) {
                return "독서 시작일은 필수입니다.";
              }
              return true;
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <>
              <input {...field} type="date" placeholder="독서 시작일" />
              {error && <p>{error.message}</p>}
            </>
          )}
        />
        <Controller
          name={"endDate"}
          control={control}
          rules={{
            validate: (value, vals) => {
              const status = vals.status;
              if (value && (status === "WISHLIST" || status === "PENDING")) {
                return "독서 종료일은 입력할 수 없습니다.";
              }
              if (!value) {
                return "독서 종료일은 필수입니다.";
              }
              if (
                vals.startDate &&
                new Date(value) < new Date(vals.startDate)
              ) {
                return "독서 종료일은 시작일 이후여야 합니다.";
              }
              if (
                vals.publishDate &&
                new Date(value) < new Date(vals.publishDate)
              ) {
                return "독서 종료일은 출판일 이후여야 합니다.";
              }
              return true;
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <>
              <input {...field} type="date" placeholder="독서 종료일" />
              {error && <p>{error.message}</p>}
            </>
          )}
        />
      </div>
    </div>
  );
};
