import { FunnelLayout } from "@/features/bookRecord/ui";
import { FormProvider } from "react-hook-form";
import { StepProvider, useStepContext } from "@/features/bookRecord/model/StepContext";
import { useBookRecordForm } from "@/features/bookRecord/model/useBookRecordForm";
import { STEP_COMPONENTS } from "@/features/bookRecord/model/constants";

const BookPage = () => {
  // 한 줄로 Form + Validation + LocalStorage 모두 설정!
  const methods = useBookRecordForm();

  return (
    <StepProvider>
      <FormProvider {...methods}>
        <BookPageContent />
      </FormProvider>
    </StepProvider>
  );
};

// Context 내부에서만 사용 가능하도록 분리
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
