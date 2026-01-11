import { FormProvider } from "react-hook-form";
import { StepProvider, useStepContext } from "@/features/bookRecord/model/StepContext";
import { useBookRecordForm } from "@/features/bookRecord/model/useBookRecordForm";
import { FunnelLayout } from "./FunnelLayout";
import { BasicInfo } from "./BasicInfo";
import { Rating } from "./Rating";
import { BookRecord } from "./BookRecord";
import { Quotes } from "./Quotes";
import { PublicOrNot } from "./PublicOrNot";

const STEP_COMPONENTS = [
  BasicInfo,
  Rating,
  BookRecord,
  Quotes,
  PublicOrNot,
] as const;

const BookPage = () => {
  const methods = useBookRecordForm();

  return (
    <StepProvider>
      <FormProvider {...methods}>
        <BookPageContent />
      </FormProvider>
    </StepProvider>
  );
};

const BookPageContent = () => {
  const { currentStep } = useStepContext();
  const StepComponent = STEP_COMPONENTS[currentStep];

  return (
    <FunnelLayout>
      <StepComponent />
    </FunnelLayout>
  );
};

export default BookPage;
