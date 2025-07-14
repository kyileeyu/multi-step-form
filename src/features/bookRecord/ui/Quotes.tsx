import { Controller, useFormContext } from "react-hook-form";

export const Quotes = () => {
  const { control } = useFormContext();
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">인용구</h2>
      <p className="text-sm text-gray-600">인용구를 작성해주세요</p>
      <div className={"flex flex-col gap-5"}>
        <Controller
          name={"quotes"}
          control={control}
          render={(field) => <input {...field} type={""} />}
        />
      </div>
    </div>
  );
};
