# BookRecord 리팩토링 - 최종 확정 v2

> 피드백 최종 반영: useBookRecordForm 통합 훅 추가

## 핵심 개선 사항

1. ✅ **Validation을 zod로 통합** - 중복 제거
2. ✅ **Step을 0-based 배열로 관리** - 매직 넘버 제거
3. ✅ **Context 책임 분리** - StepContext + FormProvider
4. ✅ **Form + LocalStorage 통합** - useBookRecordForm 훅 (중복 제거!)

---

## 전체 구조

```
src/features/bookRecord/
├── model/
│   ├── constants.ts            # ✨ NEW: Step 배열, 컴포넌트 매핑
│   ├── schema.ts               # ✨ NEW: zod validation schema
│   ├── type.ts                 # 기존 유지
│   ├── StepContext.tsx         # ✨ NEW: Step 전용 Context
│   ├── useStepMove.ts          # 수정: 0-based로 변경
│   ├── useBookRecordForm.ts    # ✨ NEW: Form + LocalStorage 통합!
│   └── useFormLocalStorage.ts  # 기존 유지 (useBookRecordForm 내부에서 사용)
│
└── ui/
    ├── BookPage.tsx            # 수정: useBookRecordForm 사용
    ├── FunnelLayout.tsx        # 수정: Context 사용
    ├── BasicInfo.tsx           # 수정: Validation 제거
    ├── Rating.tsx              # 기존 유지
    ├── BookRecord.tsx          # 수정: Validation 제거
    ├── Quotes.tsx              # 기존 유지
    └── PublicOrNot.tsx         # 기존 유지
```

---

## 구현 가이드

### Step 1: Dependencies 설치

```bash
npm install zod @hookform/resolvers
```

---

### Step 2: Constants 정의

#### `model/constants.ts`
```typescript
import {
  BasicInfo,
  Rating,
  BookRecord,
  Quotes,
  PublicOrNot,
} from "@/features/bookRecord/ui";

// Step 컴포넌트를 배열로 관리 (0-based)
export const STEP_COMPONENTS = [
  BasicInfo,    // index 0
  Rating,       // index 1
  BookRecord,   // index 2
  Quotes,       // index 3
  PublicOrNot,  // index 4
] as const;

export const TOTAL_STEPS = STEP_COMPONENTS.length;

// Step 이름 (UI 표시용)
export const STEP_NAMES = [
  "기본 정보",
  "평점",
  "독서 기록",
  "인용구",
  "공개 설정",
] as const;
```

---

### Step 3: Zod Schema 정의

#### `model/schema.ts`
```typescript
import { z } from "zod";

export const bookRecordSchema = z
  .object({
    // 기본 정보
    id: z.string().optional(),
    title: z.string().min(1, "제목은 필수입니다."),
    author: z.string(),
    pageCount: z.number().min(1, "페이지 수는 필수입니다."),
    publishDate: z.string().min(1, "출판일은 필수입니다."),
    status: z.enum(["READ", "READING", "PENDING", "WISHLIST"], {
      required_error: "상태는 필수입니다.",
    }),

    // 날짜 정보
    startDate: z.string(),
    endDate: z.string(),

    // 평가
    isRecommended: z.boolean(),
    rating: z.number().min(0).max(5),

    // 기록
    record: z.string(),

    // 인용구
    quotes: z.array(z.string()),

    // 공개 설정
    isPublic: z.boolean(),
  })
  // WISHLIST 상태면 startDate 입력 불가
  .refine(
    (data) => {
      if (data.status === "WISHLIST" && data.startDate) {
        return false;
      }
      return true;
    },
    {
      message: "독서 시작일은 입력할 수 없습니다.",
      path: ["startDate"],
    }
  )
  // WISHLIST, PENDING 상태면 endDate 입력 불가
  .refine(
    (data) => {
      if (
        (data.status === "WISHLIST" || data.status === "PENDING") &&
        data.endDate
      ) {
        return false;
      }
      return true;
    },
    {
      message: "독서 종료일은 입력할 수 없습니다.",
      path: ["endDate"],
    }
  )
  // endDate는 startDate 이후여야 함
  .refine(
    (data) => {
      if (
        data.startDate &&
        data.endDate &&
        new Date(data.endDate) < new Date(data.startDate)
      ) {
        return false;
      }
      return true;
    },
    {
      message: "독서 종료일은 시작일 이후여야 합니다.",
      path: ["endDate"],
    }
  )
  // endDate는 publishDate 이후여야 함
  .refine(
    (data) => {
      if (
        data.publishDate &&
        data.endDate &&
        new Date(data.endDate) < new Date(data.publishDate)
      ) {
        return false;
      }
      return true;
    },
    {
      message: "독서 종료일은 출판일 이후여야 합니다.",
      path: ["endDate"],
    }
  )
  // rating이 극단적(1 이하 또는 5)이면 record는 100자 이상
  .refine(
    (data) => {
      if ((data.rating <= 1 || data.rating >= 5) && data.record.length < 100) {
        return false;
      }
      return true;
    },
    {
      message: "100자 이상의 이유를 입력해주세요.",
      path: ["record"],
    }
  );

export type BookRecordFormData = z.infer<typeof bookRecordSchema>;
```

---

### Step 4: useStepMove 개선 (0-based)

#### `model/useStepMove.ts`
```typescript
import { useState } from "react";

export const useStepMove = (totalSteps: number) => {
  // 0부터 시작!
  const [currentStep, setCurrentStep] = useState<number>(0);

  const nextStep = () =>
    setCurrentStep((s) => Math.min(s + 1, totalSteps - 1));

  const prevStep = () =>
    setCurrentStep((s) => Math.max(s - 1, 0));

  const goToStep = (step: number) => {
    if (step >= 0 && step < totalSteps) {
      setCurrentStep(step);
    }
  };

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  return {
    currentStep,
    nextStep,
    prevStep,
    goToStep,
    isFirstStep,
    isLastStep,
  };
};
```

---

### Step 5: useBookRecordForm 생성 (핵심! 통합 훅)

#### `model/useBookRecordForm.ts`
```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookRecordSchema, BookRecordFormData } from "./schema";
import { useFormLocalStorage } from "./useFormLocalStorage";

/**
 * BookRecord 전용 폼 훅
 *
 * 다음 기능을 통합 제공:
 * - Form 상태 관리 (useForm)
 * - Zod validation (bookRecordSchema)
 * - LocalStorage 자동 저장/복원 (useFormLocalStorage)
 *
 * @example
 * const methods = useBookRecordForm();
 * return <FormProvider {...methods}>...</FormProvider>
 */
export function useBookRecordForm() {
  const methods = useForm<BookRecordFormData>({
    mode: "onChange",
    resolver: zodResolver(bookRecordSchema),
    defaultValues: {
      title: "",
      author: "",
      pageCount: 0,
      publishDate: "",
      status: undefined,
      startDate: "",
      endDate: "",
      isRecommended: false,
      rating: 0,
      record: "",
      quotes: [],
      isPublic: false,
    },
  });

  // LocalStorage 자동 저장/복원
  useFormLocalStorage("bookForm", methods);

  return methods;
}
```

**핵심 개선**:
- ✅ useForm + useFormLocalStorage 통합!
- ✅ defaultValues를 한 곳에서 관리
- ✅ 사용처에서는 `useBookRecordForm()` 한 줄로 끝!

---

### Step 6: StepContext 생성 (책임 분리!)

#### `model/StepContext.tsx`
```typescript
import { createContext, useContext, ReactNode } from "react";
import { useStepMove } from "./useStepMove";
import { TOTAL_STEPS } from "./constants";

interface StepContextValue {
  currentStep: number;
  totalSteps: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
}

const StepContext = createContext<StepContextValue | null>(null);

interface StepProviderProps {
  children: ReactNode;
}

export const StepProvider = ({ children }: StepProviderProps) => {
  const stepState = useStepMove(TOTAL_STEPS);

  return (
    <StepContext.Provider value={stepState}>
      {children}
    </StepContext.Provider>
  );
};

export const useStepContext = () => {
  const context = useContext(StepContext);
  if (!context) {
    throw new Error("useStepContext must be used within StepProvider");
  }
  return context;
};
```

---

### Step 7: BookPage 수정 (간결해짐!)

#### `ui/BookPage.tsx`
```typescript
import { FormProvider } from "react-hook-form";
import { StepProvider, useStepContext } from "@/features/bookRecord/model/StepContext";
import { useBookRecordForm } from "@/features/bookRecord/model/useBookRecordForm";
import { FunnelLayout } from "@/features/bookRecord/ui";
import { STEP_COMPONENTS } from "@/features/bookRecord/model/constants";

const BookPage = () => {
  // ✨ 이제 한 줄로 끝! (Form + Validation + LocalStorage 모두 포함)
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
```

**개선 포인트**:
- ✨ `useBookRecordForm()` 한 줄로 폼 설정 완료!
- ✨ defaultValues, validation, localStorage 모두 훅 내부에!
- ✨ BookPage가 훨씬 간결해짐!

---

### Step 8: FunnelLayout 수정 (Props 제거)

#### `ui/FunnelLayout.tsx`
```typescript
import { Box, Button, Typography } from "@mui/material";
import { ReactNode } from "react";
import { useStepContext } from "../model/StepContext";
import { STEP_NAMES } from "../model/constants";

interface Props {
  children: ReactNode;
}

export const FunnelLayout = ({ children }: Props) => {
  const { currentStep, isFirstStep, isLastStep, nextStep, prevStep } =
    useStepContext();

  return (
    <Box
      display="flex"
      maxWidth="600px"
      margin="0 auto"
      flexDirection="column"
      height="100vh"
      justifyContent="space-between"
    >
      {/* Header */}
      <Box px={2} py={3} borderBottom="1px solid #ddd">
        <Typography variant="h6">
          📘 책 기록하기 - {STEP_NAMES[currentStep]} (Step {currentStep + 1})
        </Typography>
      </Box>

      {/* Content */}
      <Box flexGrow={1} px={2} py={3}>
        {children}
      </Box>

      {/* Navigation */}
      <Box
        px={2}
        py={2}
        borderTop="1px solid #ddd"
        display="flex"
        justifyContent="space-between"
      >
        <Button onClick={prevStep} disabled={isFirstStep} variant="contained">
          이전
        </Button>
        <Button onClick={nextStep} disabled={isLastStep} variant="contained">
          다음
        </Button>
      </Box>
    </Box>
  );
};
```

---

### Step 9: BasicInfo 수정 (Validation 제거)

#### `ui/BasicInfo.tsx`
```typescript
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
        {/* title */}
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

        {/* publishDate */}
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

        {/* author */}
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

        {/* pageCount */}
        <Controller
          name="pageCount"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <>
              <input {...field} type="number" placeholder="페이지 수" />
              {error && <p className="text-red-500 text-sm">{error.message}</p>}
            </>
          )}
        />

        {/* status */}
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

        {/* startDate - validation은 schema에서! */}
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

        {/* endDate - validation은 schema에서! */}
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
```

---

### Step 10: BookRecord 수정 (Validation 제거)

#### `ui/BookRecord.tsx`
```typescript
import { Controller, useFormContext } from "react-hook-form";
import { BookRecordFormData } from "../model/schema";

export const BookRecord = () => {
  const { control } = useFormContext<BookRecordFormData>();

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">독서 기록</h2>
      <p className="text-sm text-gray-600">
        책을 읽고 느낀 점을 자유롭게 작성해주세요
      </p>

      {/* validation은 schema에서! */}
      <Controller
        name="record"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <>
            <textarea
              {...field}
              rows={10}
              placeholder="독서 기록을 작성해주세요..."
              className="border p-2 rounded"
            />
            {error && <p className="text-red-500 text-sm">{error.message}</p>}
          </>
        )}
      />
    </div>
  );
};
```

---

## 구현 순서

1. **Dependencies 설치**
   ```bash
   npm install zod @hookform/resolvers
   ```

2. **새 파일 생성**
   - `model/constants.ts`
   - `model/schema.ts`
   - `model/StepContext.tsx`
   - `model/useBookRecordForm.ts` ⭐ 핵심!

3. **기존 파일 수정**
   - `model/useStepMove.ts` (0-based로 변경)
   - `ui/BookPage.tsx` (useBookRecordForm 사용)
   - `ui/FunnelLayout.tsx` (Props 제거, Context 사용)
   - `ui/BasicInfo.tsx` (Validation 제거)
   - `ui/BookRecord.tsx` (Validation 제거)

4. **테스트**
   - [ ] Step 이동 확인 (이전/다음 버튼)
   - [ ] Validation 동작 확인 (각 필드별)
   - [ ] LocalStorage 저장/복원 확인
   - [ ] 새로고침 후 데이터 유지 확인

---

## Before & After 비교

### Before: 분리된 호출
```typescript
// BookPage.tsx (Before)
const methods = useForm<BookRecordFormData>({
  mode: "onChange",
  resolver: zodResolver(bookRecordSchema),
  defaultValues: {
    title: "",
    author: "",
    pageCount: 0,
    publishDate: "",
    status: undefined,
    startDate: "",
    endDate: "",
    isRecommended: false,
    rating: 0,
    record: "",
    quotes: [],
    isPublic: false,
  },
});
useFormLocalStorage("bookForm", methods);  // 별도 호출

return (
  <StepProvider>
    <FormProvider {...methods}>
      {/* ... */}
    </FormProvider>
  </StepProvider>
);
```

### After: 통합 훅
```typescript
// BookPage.tsx (After)
const methods = useBookRecordForm();  // 한 줄로 끝! ✨

return (
  <StepProvider>
    <FormProvider {...methods}>
      {/* ... */}
    </FormProvider>
  </StepProvider>
);
```

---

### Before: Props Drilling
```typescript
// BookPage.tsx (Before)
const { funnelStep, nextStep, prevStep } = useStepMove();
<FunnelLayout step={funnelStep} onNext={nextStep} onPrev={prevStep}>

// FunnelLayout.tsx (Before)
function FunnelLayout({ step, onNext, onPrev }) {
  <Button disabled={step === 1} onClick={onPrev}>
  <Button disabled={step === 5} onClick={onNext}>
}
```

### After: Context
```typescript
// BookPage.tsx (After)
<StepProvider>
  <FunnelLayout>

// FunnelLayout.tsx (After)
function FunnelLayout() {
  const { isFirstStep, isLastStep, nextStep, prevStep } = useStepContext();
  <Button disabled={isFirstStep} onClick={prevStep}>
  <Button disabled={isLastStep} onClick={nextStep}>
}
```

---

### Before: Inline Validation
```typescript
// BasicInfo.tsx (Before)
<Controller
  name="startDate"
  rules={{
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
/>
```

### After: Schema
```typescript
// schema.ts (한 곳에!)
export const bookRecordSchema = z.object({...}).refine(...);

// BasicInfo.tsx (After - 깔끔!)
<Controller name="startDate" />
```

---

## 개선 효과 정리

### 1. 중복 제거 (최우선!)
- ✅ Validation 로직: schema.ts 한 곳에
- ✅ Step 상수: constants.ts 한 곳에
- ✅ Form 설정: useBookRecordForm 한 곳에 ⭐
- ✅ DefaultValues: useBookRecordForm 안에 ⭐
- ✅ Props drilling 제거

### 2. 유지보수성
- ✅ Validation 수정 → schema.ts만
- ✅ Step 추가/삭제 → constants.ts만
- ✅ DefaultValues 수정 → useBookRecordForm만 ⭐
- ✅ 매직 넘버 제거

### 3. 가독성
- ✅ `const methods = useBookRecordForm();` (간결!) ⭐
- ✅ `disabled={isFirstStep}` (명확!)
- ✅ Validation 로직이 컴포넌트에 안 보임

### 4. 재사용성
- ✅ useBookRecordForm을 다른 페이지에서도 사용 가능 ⭐
- ✅ 같은 폼 설정을 여러 곳에서 재사용

### 5. 타입 안전성
- ✅ Zod schema에서 타입 자동 생성
- ✅ Context를 통한 타입 보장

### 6. 책임 분리 (SRP)
- ✅ StepContext: Step 관리만
- ✅ FormProvider: Form 관리만
- ✅ useBookRecordForm: Form + LocalStorage 통합 ⭐
- ✅ schema.ts: Validation만
- ✅ FunnelLayout: UI 레이아웃만

---

## useBookRecordForm의 역할 정리

```
useBookRecordForm = useForm + zod + localStorage

├─ useForm (react-hook-form)
│   └─ Form 상태 관리 (values, errors, submit 등)
│
├─ zodResolver (zod + @hookform/resolvers)
│   └─ Validation 처리
│
└─ useFormLocalStorage (custom hook)
    └─ LocalStorage 자동 저장/복원
```

**핵심**: 항상 함께 쓰는 것들을 하나로 묶어서 중복 제거! ⭐

---

## 파일별 역할 정리

| 파일 | 역할 | 왜 필요한가? |
|------|------|------------|
| **constants.ts** | Step 배열, 이름 관리 | 매직 넘버 제거, 순서 변경 용이 |
| **schema.ts** | Validation 중앙 관리 | 중복 제거, 타입 생성 |
| **useStepMove.ts** | Step 이동 로직 | Step 상태 관리 |
| **StepContext.tsx** | Step 공유 | Props drilling 제거 |
| **useBookRecordForm.ts** ⭐ | Form + LocalStorage 통합 | 중복 제거, 재사용성 |
| **useFormLocalStorage.ts** | LocalStorage 동기화 | Form 데이터 영구 보관 |

---

## useFormLocalStorage 이름 유지 이유

### ❌ useLocalStorage로 바꾸면?
```typescript
// 범용적인 이름인데 내용은 Form 전용
export function useLocalStorage<T>(
  key: string,
  form: UseFormReturn<T>,  // Form에 의존!
) {
  const { watch, reset } = form;  // react-hook-form 전용!
  // ...
}
```
**문제**: 이름과 내용이 불일치!

### ✅ useFormLocalStorage 유지
```typescript
// 이름이 정확함: "Form을 LocalStorage에 저장"
export function useFormLocalStorage<T>(
  key: string,
  form: UseFormReturn<T>,  // Form 전용이 명확!
) {
  const { watch, reset } = form;
  // ...
}
```
**장점**: 이름만 봐도 "react-hook-form 전용"임을 알 수 있음!

### 만약 범용 localStorage 훅이 필요하다면?

별도로 만들기:
```typescript
// hooks/useLocalStorage.ts (범용)
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}

// 사용
const [name, setName] = useLocalStorage('name', '');
```

**결론**: `useFormLocalStorage`는 이름 그대로 유지! ✅

---

## 주의사항

### 1. Type 호환성
- 기존 `BookRecordType`과 새로운 `BookRecordFormData`가 호환되는지 확인
- 서버 API 타입과 다를 수 있으니 필요시 변환 로직 추가

### 2. LocalStorage 마이그레이션
- 기존에 저장된 localStorage 데이터 형식 확인
- 필요시 마이그레이션 로직 추가

### 3. Validation 누락 확인
- 기존 컴포넌트의 모든 validation을 schema로 옮겼는지 검토
- 테스트로 검증

### 4. 성능
- zod validation이 onChange 모드에서 느리다면 debounce 고려
- Context 변경 시 불필요한 리렌더링 확인

---

## 다음 단계 (선택)

리팩토링이 완료되면 다음 개선을 고려할 수 있습니다:

1. **진행률 표시**
   ```typescript
   const progress = ((currentStep + 1) / TOTAL_STEPS) * 100;
   <ProgressBar value={progress} />
   ```

2. **Step별 Validation**
   ```typescript
   const isStepValid = () => {
     const fieldsPerStep = {
       0: ['title', 'author', ...],
       1: ['rating'],
       // ...
     };
     return trigger(fieldsPerStep[currentStep]);
   };
   ```

3. **Step 이동 시 확인**
   ```typescript
   const nextStep = async () => {
     const isValid = await isStepValid();
     if (isValid) stepState.nextStep();
   };
   ```

---

## 참고 문서

- [DESIGN_DECISIONS.md](./DESIGN_DECISIONS.md) - 설계 의사결정 과정
- [React Hook Form + Zod](https://react-hook-form.com/get-started#SchemaValidation)
- [Zod 공식 문서](https://zod.dev/)

---

## 최종 체크리스트

구현 시 확인 사항:

- [ ] `useBookRecordForm` 훅 생성 ⭐
- [ ] `BookPage.tsx`에서 `useBookRecordForm()` 사용 ⭐
- [ ] defaultValues 중복 제거 확인 ⭐
- [ ] Step을 0-based로 변경
- [ ] `STEP_COMPONENTS` 배열로 변경
- [ ] StepContext 생성
- [ ] FunnelLayout에서 Props 제거
- [ ] BasicInfo, BookRecord에서 validation 제거
- [ ] 모든 테스트 통과
