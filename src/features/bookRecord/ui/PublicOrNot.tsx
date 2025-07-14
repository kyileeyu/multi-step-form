import { Controller, useFormContext } from "react-hook-form";

export const PublicOrNot = () => {
  const { control } = useFormContext();
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">공개여부</h2>
      <div className={"flex flex-col gap-5"}>
        <Controller
          name={"isPublic"}
          control={control}
          render={(field) => (
            <label>
              공개할까요?
              <input {...field} type={"checkbox"} />
            </label>
          )}
        />
      </div>
    </div>
  );
};
