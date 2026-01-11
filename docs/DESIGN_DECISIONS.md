# 설계 의사결정 과정 & 개념 정리

## 목차
1. [의사결정 트리](#의사결정-트리)
2. [핵심 개념 설명](#핵심-개념-설명)
3. [패턴 비교](#패턴-비교)
4. [최종 결정 및 근거](#최종-결정-및-근거)

---

## 의사결정 트리

### 1. Step 관리 구조

```
Q: Step을 어떻게 표현할까?
├─ A1: 객체 + 숫자 (예: { BASIC_INFO: 1, RATING: 2 })
│   ├─ 장점: 이름으로 접근 가능
│   └─ 단점: 순서 변경 시 모든 숫자 수정 필요
│   └─ ❌ 선택하지 않음
│
├─ A2: 배열 + 문자열 (예: ['BASIC_INFO', 'RATING', ...])
│   ├─ 장점: 순서 변경 용이, 자바스크립트 배열과 일치
│   ├─ 단점: 1-based vs 0-based 혼란 가능
│   └─ ✅ 선택!
│
└─ 추가 결정: 0-based vs 1-based?
    ├─ 0-based: 자바스크립트 배열과 일치, 직관적
    └─ 1-based: "Step 1, 2, 3" UI 표시에 자연스러움
    └─ ✅ 0-based 선택 (내부는 0-based, 표시만 +1)
```

**결정**: 배열 + 0-based index
**근거**:
- 순서 변경 시 배열만 수정하면 됨
- `STEP_COMPONENTS[currentStep]` 직접 접근 가능
- 자바스크립트 관례와 일치

---

### 2. Context vs 훅

```
Q: Step 상태를 어떻게 공유할까?
├─ A1: Props로 전달
│   ├─ 적합한 경우: depth 1-2, 사용처 1-2곳
│   ├─ 현재 상황: BookPage → FunnelLayout (depth 1)
│   └─ ⚠️ FunnelLayout 외에 다른 곳에서도 쓰면?
│
├─ A2: Context API
│   ├─ 적합한 경우: depth 3+, 여러 곳에서 사용
│   ├─ 현재 상황: FunnelLayout, 각 Step 컴포넌트에서 사용 가능성
│   └─ ✅ 선택 (확장성 고려)
│
└─ A3: 전역 상태 관리 (Zustand, Jotai)
    ├─ 적합한 경우: 앱 전체에서 공유
    ├─ 현재 상황: BookRecord 기능 내부에서만 사용
    └─ ❌ 오버엔지니어링
```

**결정**: Context API
**근거**:
- FunnelLayout 외에 각 Step 컴포넌트에서도 step 정보 필요 가능성
- Props drilling 방지
- BookRecord 기능 범위 내에서만 사용 (전역 상태 불필요)

---

### 3. Context 책임 분리

```
Q: 하나의 Context에 Form + Step을 모두 넣을까?
├─ A1: 하나의 BookRecordContext
│   ├─ 장점: Provider 하나, 사용하기 간편
│   ├─ 단점: SRP 위반, 책임이 혼재
│   └─ ⚠️ Form 변경 시 Step 관련 컴포넌트도 리렌더링
│
├─ A2: StepContext + FormContext 분리
│   ├─ 장점: SRP 준수, 리렌더링 최적화
│   ├─ 단점: Provider 중첩, 복잡도 증가
│   └─ ✅ 선택!
│
└─ A3: Step만 Context, Form은 FormProvider 활용
    ├─ 장점: react-hook-form 기본 기능 활용
    ├─ 단점: 두 개의 Provider
    └─ ✅ 이게 더 나음!
```

**결정**: StepContext + FormProvider(react-hook-form 기본)
**근거**:
- Form 상태 변경 시 Step 관련 UI 리렌더링 방지
- react-hook-form의 FormProvider 기능 활용
- 각 Context가 명확한 책임 하나만 가짐

---

### 4. Validation 위치

```
Q: Validation을 어디서 할까?
├─ A1: 각 컴포넌트의 rules prop
│   ├─ 현재 방식
│   ├─ 단점: 중복, 관리 어려움, 테스트 어려움
│   └─ ❌ 개선 필요
│
├─ A2: zod schema (중앙 집중)
│   ├─ 장점: 한 곳에서 관리, 타입 자동 생성, 재사용 가능
│   ├─ 단점: 학습 비용
│   └─ ✅ 선택!
│
└─ A3: yup schema
    ├─ zod와 유사하지만 타입 추론이 약함
    └─ ❌ zod가 더 나음
```

**결정**: zod schema
**근거**:
- Validation 로직이 여러 컴포넌트에 중복되어 있음
- 교차 필드 validation (예: startDate < endDate) 관리 용이
- TypeScript 타입 자동 생성 (`z.infer<typeof schema>`)
- react-hook-form과 공식 통합 (`@hookform/resolvers`)

---

### 5. FunnelLayout 패턴

```
Q: Funnel UI 구조를 어떻게 만들까?
├─ A1: Layout 컴포넌트로 감싸기 (현재 방식)
│   ├─ <FunnelLayout><StepComponent /></FunnelLayout>
│   ├─ 장점: 간단, 명확, Header/Footer 고정
│   └─ ✅ 선택!
│
├─ A2: useFunnel 훅 (Headless Component)
│   ├─ const { Funnel, Step } = useFunnel(...)
│   ├─ 장점: 유연함, 선언적
│   ├─ 단점: 복잡, 오버엔지니어링
│   └─ ❌ 현재 요구사항에 과도
│
└─ A3: Compound Component
    ├─ <Funnel><Funnel.Header /><Funnel.Content />...
    ├─ 장점: 커스터마이즈 용이
    ├─ 단점: 복잡도 증가
    └─ ❌ 현재는 레이아웃이 고정되어 있음
```

**결정**: Layout 컴포넌트 패턴 유지
**근거**:
- Header + Content + Navigation 구조가 고정됨
- 커스터마이즈 필요성이 낮음
- 단순하고 이해하기 쉬움

---

### 6. Form + LocalStorage 통합

```
Q: useForm과 useFormLocalStorage를 분리할까, 통합할까?
├─ A1: 분리 (별도 호출)
│   ├─ const methods = useForm({...});
│   ├─ useFormLocalStorage("key", methods);
│   ├─ 장점: 유연함, 각각 독립적
│   └─ 단점: 항상 함께 쓰는데 중복 호출
│
├─ A2: 통합 (useBookRecordForm)
│   ├─ const methods = useBookRecordForm();
│   ├─ 장점: 한 번 호출, defaultValues 중복 제거, 재사용 가능
│   └─ ✅ 선택!
│
└─ 판단 기준:
    ├─ 한 곳에서만 사용 → 분리 (inline으로)
    ├─ 여러 곳에서 사용 → 분리 (각각 재사용)
    └─ 항상 함께 사용 → ✅ 통합! (중복 제거)
```

**결정**: useBookRecordForm 통합 훅 생성
**근거**:
- useForm과 useFormLocalStorage를 항상 함께 사용
- defaultValues를 매번 작성하는 중복 제거
- 다른 페이지에서 같은 폼을 쓸 때 재사용 가능
- 한 줄로 Form + Validation + LocalStorage 모두 설정

---

## 핵심 개념 설명

### 1. React Hook Form의 동작 원리

#### useForm이 하는 일
```typescript
const methods = useForm();
// methods = {
//   register,      // input 등록
//   handleSubmit,  // 제출 처리
//   watch,         // 값 감시
//   getValues,     // 현재 값 가져오기
//   setValue,      // 값 설정
//   formState: {   // 폼 상태
//     errors,      // 에러
//     isDirty,     // 수정 여부
//     isValid,     // 유효성
//   }
// }
```

**핵심**: `useForm`은 **폼 상태를 관리하는 훅**일 뿐, Context와는 무관!

#### FormProvider가 하는 일
```typescript
<FormProvider {...methods}>
  <ChildComponent />
</FormProvider>

// ChildComponent 내부
function ChildComponent() {
  const { register, formState } = useFormContext();
  // FormProvider로부터 methods를 받아옴 (Context API)
}
```

**핵심**: `FormProvider`가 Context API를 제공하는 것!

#### 흐름 정리
```
1. useForm() 호출
   └─ 폼 상태 생성 (내부적으로 useState, useRef 사용)

2. FormProvider로 감싸기
   └─ Context에 methods 저장

3. 자식 컴포넌트에서 useFormContext()
   └─ Context에서 methods 꺼내 쓰기
```

---

### 2. Context API vs Props

#### Props의 특징
```typescript
// 명시적 (데이터 흐름이 보임)
<Parent>
  <Child step={step} onNext={onNext} />
</Parent>

// 장점: 추적 쉬움, 디버깅 쉬움
// 단점: Props drilling (depth가 깊으면 번거로움)
```

#### Context API의 특징
```typescript
// 암묵적 (어디서 쓰는지 안 보임)
<Provider value={value}>
  <Child />  {/* step을 안 넘기는데도 */}
</Provider>

function Child() {
  const { step } = useContext();  // 여기서 꺼내 씀
}

// 장점: Props drilling 없음
// 단점: 데이터 흐름 추적 어려움, 성능 이슈 가능
```

#### 성능 차이
```typescript
// Context 변경 시
const StepContext = createContext();

function Provider({ children }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");

  return (
    <StepContext.Provider value={{ step, name, setStep, setName }}>
      {children}
    </StepContext.Provider>
  );
}

// ❌ 문제: name이 바뀌어도 step만 쓰는 컴포넌트도 리렌더링!

// ✅ 해결: Context 분리
<StepContext.Provider value={{ step, setStep }}>
  <NameContext.Provider value={{ name, setName }}>
    {children}
  </NameContext.Provider>
</StepContext.Provider>
```

**핵심**: Context는 값이 바뀌면 **모든 Consumer가 리렌더링**됨!

---

### 3. 0-based vs 1-based Index

#### 컴퓨터 과학 관례
- **대부분의 프로그래밍 언어는 0-based**
  - 배열의 첫 번째 요소: `arr[0]`
  - 이유: 메모리 주소 계산이 효율적 (`base + index * size`)

#### UI/UX 관례
- **사람은 1부터 센다**
  - "Step 1", "Step 2" (Step 0이라고 안 함)
  - 페이지네이션: 1페이지, 2페이지

#### 해결 방법
```typescript
// 내부 로직: 0-based
const [currentStep, setCurrentStep] = useState(0);
const steps = ['BASIC_INFO', 'RATING', ...];
const StepComponent = steps[currentStep];  // 직접 접근

// UI 표시: 1-based
<Typography>Step {currentStep + 1}</Typography>
```

**핵심**: **내부는 0-based, 표시만 +1**

---

### 4. Funnel 패턴

#### Funnel이란?
사용자가 순차적으로 정보를 입력하며 "좁아지는 깔때기(Funnel)" 형태로 진행하는 UI 패턴

```
Step 1: 기본 정보 (100명)
  ↓
Step 2: 평점 (80명)
  ↓
Step 3: 기록 (60명)
  ↓
Step 4: 인용구 (40명)
  ↓
Step 5: 공개 설정 (30명)  ← 완료
```

#### Funnel의 특징
1. **순차 진행**: Step을 건너뛸 수 없음
2. **상태 유지**: 이전 Step 데이터 유지
3. **뒤로 가기 가능**: 수정 가능
4. **진행률 표시**: 사용자에게 위치 알려줌

#### 일반적인 구현 방법
```typescript
// 1. State로 현재 Step 관리
const [currentStep, setCurrentStep] = useState(0);

// 2. Step별 컴포넌트 매핑
const steps = [Step1, Step2, Step3];
const CurrentStepComponent = steps[currentStep];

// 3. 공통 레이아웃
<Layout>
  <Header>Step {currentStep + 1}</Header>
  <Content>
    <CurrentStepComponent />
  </Content>
  <Navigation>
    <Button onClick={prev}>이전</Button>
    <Button onClick={next}>다음</Button>
  </Navigation>
</Layout>
```

---

### 5. localStorage와 Form 상태 동기화

#### 왜 localStorage?
```
SPA의 문제점:
- 새로고침 → 모든 상태 날아감
- 브라우저 뒤로가기 → 데이터 손실

해결책:
- localStorage에 저장 → 영구 보관
- 새로고침해도 복원 가능
```

#### 동기화 전략

**방법 1: onChange마다 저장 (Debounce)**
```typescript
useEffect(() => {
  const subscription = watch((value) => {
    // 500ms마다 저장 (너무 자주 저장하면 성능 문제)
    debounce(() => {
      localStorage.setItem('key', JSON.stringify(value));
    }, 500);
  });
  return () => subscription.unsubscribe();
}, [watch]);
```

**방법 2: onBlur마다 저장**
```typescript
<input
  {...register('name')}
  onBlur={() => {
    localStorage.setItem('name', getValues('name'));
  }}
/>
```

**방법 3: Step 이동 시 저장**
```typescript
const nextStep = () => {
  localStorage.setItem('formData', JSON.stringify(getValues()));
  setCurrentStep(s => s + 1);
};
```

**현재 사용 중**: **방법 1 (Debounce)** → 자동 저장, 사용자 경험 최고

---

### 6. Schema-based Validation

#### 전통적 방식 (Inline Validation)
```typescript
<Controller
  name="title"
  rules={{
    required: "필수입니다",
    minLength: { value: 2, message: "2자 이상" },
    validate: (value) => {
      if (value.includes("bad")) return "금지어";
      return true;
    }
  }}
/>
```

**문제점**:
- 로직이 컴포넌트에 흩어져 있음
- 재사용 불가
- 테스트 어려움
- 교차 필드 validation 복잡

#### Schema 방식 (zod)
```typescript
// schema.ts (한 곳에서 관리)
const schema = z.object({
  title: z.string().min(2, "2자 이상"),
  rating: z.number().min(1).max(5),
}).refine(
  (data) => {
    // 교차 필드 validation
    if (data.rating <= 1 && data.title.length < 10) {
      return false;
    }
    return true;
  },
  { message: "...", path: ["title"] }
);

// 컴포넌트 (깔끔!)
<Controller name="title" />
```

**장점**:
1. **중앙 집중 관리**: 모든 validation이 한 곳에
2. **재사용**: 다른 곳에서도 같은 schema 사용 가능
3. **타입 안전**: `z.infer<typeof schema>`로 타입 자동 생성
4. **테스트 용이**: schema만 따로 테스트 가능
5. **교차 validation**: 여러 필드 간 관계 쉽게 표현

---

### 7. Custom Hook의 목적과 기준

#### Custom Hook이란?
재사용 가능한 로직을 캡슐화한 함수 (use로 시작)

#### 언제 만들까?
```
Q: Custom Hook을 만들어야 할까?
├─ 한 곳에서만 사용
│   ├─ 로직이 간단 (3줄 이하) → ❌ inline으로
│   └─ 로직이 복잡 (10줄 이상) → ⚠️ 추출 고려 (가독성)
│
├─ 여러 곳에서 사용
│   ├─ 완전히 동일한 로직 → ✅ Custom Hook 만들기
│   └─ 약간씩 다른 로직 → ✅ 파라미터로 추상화
│
└─ 항상 함께 쓰는 Hook들
    └─ ✅ 통합 Hook 만들기 (예: useBookRecordForm)
```

#### 좋은 Custom Hook의 조건
1. **단일 책임**: 하나의 명확한 목적
2. **재사용성**: 여러 곳에서 쓸 수 있음
3. **추상화 레벨**: 적절한 추상화 (너무 구체적 X, 너무 일반적 X)
4. **명확한 이름**: 이름만 봐도 무엇을 하는지 알 수 있음

#### 예시
```typescript
// ❌ 나쁜 예: 너무 구체적, 재사용 불가
function useBookPageForm() {
  // BookPage에만 쓰이는 로직
}

// ✅ 좋은 예: 적절한 추상화
function useFormLocalStorage<T>(key: string, form: UseFormReturn<T>) {
  // 어떤 폼이든 localStorage와 동기화
}

// ✅ 좋은 예: 통합 Hook (항상 함께 쓰임)
function useBookRecordForm() {
  // useForm + validation + localStorage 통합
}
```

---

### 8. Composition vs Inheritance (합성 vs 상속)

#### React에서는 Composition을 선호
```typescript
// ❌ 상속 (React에서 권장하지 않음)
class FancyButton extends Button {
  // ...
}

// ✅ 합성 (React 권장)
function FancyButton() {
  return <Button className="fancy">Click me</Button>;
}
```

#### Custom Hook도 Composition
```typescript
// ✅ Hook Composition (작은 Hook들을 조합)
function useBookRecordForm() {
  const methods = useForm({...});           // Hook 1
  useFormLocalStorage("key", methods);      // Hook 2
  return methods;
}

// 사용
function BookPage() {
  const methods = useBookRecordForm();  // 조합된 Hook 사용
}
```

**핵심**: 작은 단위를 조합해서 큰 기능 만들기!

---

### 9. Debounce vs Throttle

#### Debounce (디바운스)
**정의**: 연속된 이벤트를 그룹화하여 마지막 이벤트만 실행

```typescript
// 예: 검색창 자동완성
function SearchInput() {
  const [query, setQuery] = useState("");

  const debouncedSearch = useMemo(
    () => debounce((value: string) => {
      // API 호출
      fetchSearchResults(value);
    }, 500),  // 500ms 대기
    []
  );

  // 타이핑할 때마다 호출되지만, 500ms 동안 입력이 없으면 API 호출
}
```

**사용 시나리오**:
- 검색창 자동완성
- Form 자동 저장 (우리 프로젝트!)
- Window resize 이벤트

#### Throttle (쓰로틀)
**정의**: 일정 시간 간격으로 최대 한 번만 실행

```typescript
// 예: 스크롤 이벤트
function InfiniteScroll() {
  const throttledScroll = useMemo(
    () => throttle(() => {
      // 스크롤 위치 확인
      checkScrollPosition();
    }, 200),  // 200ms마다 최대 1번
    []
  );

  useEffect(() => {
    window.addEventListener('scroll', throttledScroll);
  }, []);
}
```

**사용 시나리오**:
- 스크롤 이벤트
- 마우스 이동 추적
- 게임의 공격 쿨타임

#### Debounce vs Throttle 비교
```
이벤트: ●●●●●●●●●●●●●●●● (연속 16번)

Debounce (500ms):
실행:                  ● (마지막만!)

Throttle (500ms):
실행:     ●     ●     ● (일정 간격)
```

**우리 프로젝트**: Debounce 사용 (폼 저장 - 입력 멈추면 저장)

---

### 10. React의 리렌더링 최적화

#### 리렌더링이 발생하는 경우
1. **State 변경**: `useState`, `useReducer`
2. **Props 변경**: 부모가 리렌더링되어 새 props 전달
3. **Context 변경**: `useContext`로 구독한 값 변경
4. **부모 리렌더링**: 자식도 함께 리렌더링 (기본 동작)

#### 최적화 기법

**1. memo (컴포넌트 메모이제이션)**
```typescript
// ❌ 최적화 전: 부모가 리렌더링되면 항상 리렌더링
function ExpensiveComponent({ data }) {
  // 복잡한 계산...
}

// ✅ 최적화 후: props가 같으면 리렌더링 안 함
const ExpensiveComponent = memo(({ data }) => {
  // 복잡한 계산...
});
```

**2. useMemo (값 메모이제이션)**
```typescript
function Component({ items }) {
  // ❌ 매번 재계산
  const total = items.reduce((sum, item) => sum + item.price, 0);

  // ✅ items가 바뀔 때만 재계산
  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price, 0),
    [items]
  );
}
```

**3. useCallback (함수 메모이제이션)**
```typescript
function Parent() {
  // ❌ 매번 새 함수 생성 → 자식 리렌더링
  const handleClick = () => console.log('clicked');

  // ✅ 함수 재사용 → 자식 리렌더링 방지
  const handleClick = useCallback(
    () => console.log('clicked'),
    []
  );

  return <ChildComponent onClick={handleClick} />;
}
```

**4. Context 분리 (우리가 사용!)**
```typescript
// ❌ 하나의 Context: form 변경 시 step 컴포넌트도 리렌더링
<BookRecordContext value={{ form, step }}>

// ✅ Context 분리: form 변경 시 step 컴포넌트는 안전
<StepContext value={step}>
  <FormProvider value={form}>
```

#### 과도한 최적화 주의!
```
"Premature optimization is the root of all evil"
- Donald Knuth

1. 먼저 동작하게 만들기
2. 성능 문제가 있으면 측정하기 (React DevTools Profiler)
3. 병목 지점만 최적화하기
```

---

## 패턴 비교

### 1. State 관리 패턴 비교

| 패턴 | 적합한 경우 | 장점 | 단점 |
|------|------------|------|------|
| **useState + Props** | 1-2 depth, 간단한 상태 | 명시적, 추적 쉬움 | Props drilling |
| **Context API** | 3+ depth, 여러 곳에서 사용 | Props drilling 없음 | 암묵적, 성능 이슈 |
| **Zustand/Jotai** | 앱 전체 공유, 복잡한 로직 | 강력함, 유연함 | 학습 비용, 오버킬 가능 |
| **Redux** | 매우 큰 앱, 복잡한 상태 | 예측 가능, DevTools | 보일러플레이트 많음 |

**이 프로젝트**: Context API (BookRecord 기능 내에서만 공유)

---

### 2. Funnel 구현 패턴 비교

#### 패턴 A: Layout Component (현재)
```typescript
<FunnelLayout>
  <StepComponent />
</FunnelLayout>
```
- **적합한 경우**: 고정된 레이아웃
- **장점**: 간단, 명확
- **단점**: 커스터마이즈 제한적

#### 패턴 B: useFunnel Hook (Headless)
```typescript
const { Funnel, Step } = useFunnel(['step1', 'step2']);

<Funnel>
  <Step name="step1"><Component1 /></Step>
  <Step name="step2"><Component2 /></Step>
</Funnel>
```
- **적합한 경우**: 여러 곳에서 재사용, 유연한 구조
- **장점**: 선언적, 재사용 가능
- **단점**: 복잡도 증가
- **예시**: [토스 useFunnel](https://github.com/toss/slash/tree/main/packages/react/use-funnel)

#### 패턴 C: Compound Component
```typescript
<Funnel step={step}>
  <Funnel.Header />
  <Funnel.Content>
    <StepComponent />
  </Funnel.Content>
  <Funnel.Navigation />
</Funnel>
```
- **적합한 경우**: 부분적 커스터마이즈 필요
- **장점**: 유연성과 간결성의 균형
- **단점**: 중간 복잡도

**이 프로젝트**: 패턴 A (Layout Component) - 레이아웃 고정, 간단함 우선

---

### 3. Validation 패턴 비교

| 방식 | 장점 | 단점 | 적합한 경우 |
|------|------|------|------------|
| **Inline (rules prop)** | 간단, 즉시 확인 가능 | 중복, 관리 어려움 | 필드 1-2개, 단순 validation |
| **Custom Hook** | 재사용 가능 | 여전히 분산됨 | 반복되는 validation |
| **zod Schema** | 중앙 관리, 타입 생성, 강력함 | 학습 비용 | 복잡한 validation, 여러 필드 |
| **yup Schema** | zod와 유사 | 타입 추론 약함 | zod 대안 |

**이 프로젝트**: zod Schema - 교차 필드 validation 많음, 타입 안전성

---

## 최종 결정 및 근거

### 결정 사항 요약

| 주제 | 결정 | 근거 |
|------|------|------|
| **Step 구조** | 배열 + 0-based | 순서 변경 용이, JS 관례 |
| **Step 관리** | Context API (StepContext) | 여러 곳에서 사용, Props drilling 방지 |
| **Form 관리** | FormProvider (RHF 기본) | 기존 기능 활용, 책임 분리 |
| **Form + LocalStorage** | useBookRecordForm 통합 ⭐ | 중복 제거, 재사용성, 한 줄로 설정 |
| **Validation** | zod Schema | 중앙 관리, 타입 안전, 교차 validation |
| **Funnel 패턴** | Layout Component | 간단, 레이아웃 고정 |
| **LocalStorage** | Debounce 자동 저장 | 사용자 경험, 데이터 손실 방지 |

---

### 개선된 최종 구조

```
src/features/bookRecord/
├── model/
│   ├── constants.ts           # Step 배열, 컴포넌트 매핑
│   ├── schema.ts              # zod validation (중앙 집중)
│   ├── type.ts                # 기존 타입 (유지)
│   ├── StepContext.tsx        # ✨ Step 전용 Context
│   ├── useStepMove.ts         # Step 로직 (0-based)
│   ├── useBookRecordForm.ts   # ✨ Form + LocalStorage 통합!
│   └── useFormLocalStorage.ts # localStorage 동기화 (내부 사용)
│
└── ui/
    ├── BookPage.tsx           # useBookRecordForm 사용
    ├── FunnelLayout.tsx       # Layout (StepContext 사용)
    ├── BasicInfo.tsx          # Validation 제거
    ├── Rating.tsx
    ├── BookRecord.tsx         # Validation 제거
    ├── Quotes.tsx
    └── PublicOrNot.tsx
```

---

### 핵심 개선 포인트

#### 1. Step은 0-based 배열
```typescript
// constants.ts
export const STEP_COMPONENTS = [
  BasicInfo,    // 0
  Rating,       // 1
  BookRecord,   // 2
  Quotes,       // 3
  PublicOrNot,  // 4
];

export const TOTAL_STEPS = STEP_COMPONENTS.length;

// 사용
const StepComponent = STEP_COMPONENTS[currentStep];  // 직접 접근!
```

#### 2. Form + LocalStorage 통합 (중복 제거!)
```typescript
// Before (분리)
const methods = useForm({...});  // 20줄
useFormLocalStorage("bookForm", methods);

// After (통합)
const methods = useBookRecordForm();  // 끝! ✨
```

#### 3. Context 분리 (SRP)
```typescript
// StepContext - Step 관리만
<StepProvider>
  {/* FormProvider - Form 관리만 (RHF 기본) */}
  <FormProvider {...methods}>
    <FunnelLayout>...</FunnelLayout>
  </FormProvider>
</StepProvider>
```

#### 4. Validation 중앙화
```typescript
// schema.ts - 모든 validation이 여기 한 곳에!
export const bookRecordSchema = z.object({...}).refine(...);

// 컴포넌트 - 깔끔!
<Controller name="title" />  {/* rules 없음! */}
```

---

### 왜 이렇게 결정했나?

#### 중복 제거 (가장 중요!)
- ✅ Validation 로직 → schema.ts 한 곳에
- ✅ Step 상수 → constants.ts 한 곳에
- ✅ Form + LocalStorage → useBookRecordForm 한 곳에 ⭐
- ✅ DefaultValues → useBookRecordForm 안에 ⭐
- ✅ Props drilling 제거 → Context 사용

#### 단일 책임 원칙
- ✅ StepContext: Step 관리만
- ✅ FormProvider: Form 관리만
- ✅ useBookRecordForm: Form + LocalStorage 통합 ⭐
- ✅ schema.ts: Validation만
- ✅ FunnelLayout: UI 레이아웃만

#### Hook Composition (합성)
- ✅ useForm + useFormLocalStorage = useBookRecordForm ⭐
- ✅ 작은 Hook들을 조합해서 큰 기능 만들기
- ✅ 항상 함께 쓰는 것들은 통합

#### 확장성
- ✅ Step 추가/삭제: 배열에만 추가
- ✅ Validation 추가: schema에만 추가
- ✅ 새 기능: Context에 추가 가능

---

## 참고 자료

### React 공식 문서
- [Context API](https://react.dev/reference/react/useContext)
- [When to use Context](https://react.dev/learn/passing-data-deeply-with-context)

### React Hook Form
- [공식 문서](https://react-hook-form.com/)
- [FormProvider](https://react-hook-form.com/api/formprovider)
- [Zod Resolver](https://github.com/react-hook-form/resolvers#zod)

### Zod
- [공식 문서](https://zod.dev/)
- [Schema Validation](https://zod.dev/?id=primitives)

### 패턴
- [Compound Components](https://kentcdodds.com/blog/compound-components-with-react-hooks)
- [Headless Components](https://www.merrickchristensen.com/articles/headless-user-interface-components/)
- [토스 useFunnel](https://www.slash.page/ko/libraries/react/use-funnel/README.i18n/)

### 아키텍처
- [단일 책임 원칙 (SRP)](https://en.wikipedia.org/wiki/Single-responsibility_principle)
- [관심사의 분리](https://en.wikipedia.org/wiki/Separation_of_concerns)
