import { Controller, useFormContext } from "react-hook-form";

export const BookRecord = () => {
  const { control } = useFormContext();

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">평점</h2>
      <p className="text-sm text-gray-600">책을 평가해주세요</p>
      <div className={"flex flex-col gap-5"}>
        <Controller
          name={"record"}
          control={control}
          rules={{
            required: "제목은 필수입니다.",
            validate: (value, vals) => {
              const rating = vals.rating;
              if ((rating <= 1 || rating >= 5) && value.length < 100) {
                return "100자 이상의 이유를 입력해주세요.";
              }
              return true;
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <label>
              <textarea {...field} rows={5} />
              {error && <span className="text-red-500">{error.message}</span>}
            </label>
          )}
        />
      </div>
    </div>
  );
};
