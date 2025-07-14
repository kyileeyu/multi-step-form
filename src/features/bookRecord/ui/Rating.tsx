import { Controller, useFormContext } from "react-hook-form";
import { Rating as StarRating } from "@mui/material";

export const Rating = () => {
  const { control } = useFormContext();

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">평점</h2>
      <p className="text-sm text-gray-600">책을 평가해주세요</p>
      <div className={"flex flex-col gap-5"}>
        <Controller
          name={"isRecommended"}
          control={control}
          render={(field) => (
            <label>
              이 책을 추천합니다
              <input {...field} type={"checkbox"} />
            </label>
          )}
        />
        <Controller
          name={"rating"}
          control={control}
          render={({ field }) => <StarRating precision={0.5} {...field} />}
        />
      </div>
    </div>
  );
};
