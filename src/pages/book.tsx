import { useState } from "react";
import {
  BasicInfo,
  BookRecord,
  FunnelLayout,
  PublicOrNot,
  Quotes,
  Rating,
} from "@/features/bookRecord/ui";
import { FormProvider, useForm } from "react-hook-form";
import { BookRecordType } from "@/features/bookRecord/model/type";

const Book = () => {
  const [funnelStep, setFunnelStep] = useState<number>(1);

  const nextStep = () => setFunnelStep((s) => Math.min(s + 1, 5));
  const prevStep = () => setFunnelStep((s) => Math.max(s - 1, 1));

  const methods = useForm<BookRecordType>({
    mode: "onChange",
    defaultValues: {
      // 초기값
      title: "",
      rating: 0,
      record: "",
      quotes: [],
      isPublic: false,
    },
  });

  const renderStep = () => {
    switch (funnelStep) {
      case 1:
        return <BasicInfo />;
      case 2:
        return <Rating />;
      case 3:
        return <BookRecord />;
      case 4:
        return <Quotes />;
      case 5:
        return <PublicOrNot />;
      default:
        return <BasicInfo />;
    }
  };

  return (
    <FormProvider {...methods}>
      <FunnelLayout step={funnelStep} onNext={nextStep} onPrev={prevStep}>
        {renderStep()}
      </FunnelLayout>
    </FormProvider>
  );
};

export default Book;
