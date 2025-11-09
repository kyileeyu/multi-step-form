import { useEffect, useState, useMemo } from "react";

/**
 * 범용 localStorage 훅
 *
 * 기능:
 * - localStorage에서 초기값 자동 로드
 * - 값 변경 시 자동 저장 (debounce 적용)
 * - SSR 환경 안전 처리
 *
 * @param key localStorage 키
 * @param initialValue 기본값 (localStorage에 값이 없을 때)
 * @param debounceMs 저장 지연 시간 (ms)
 * @returns [value, setValue] - useState와 동일한 인터페이스
 *
 * @example
 * const [name, setName] = useLocalStorage('userName', '');
 * const [settings, setSettings] = useLocalStorage('settings', { theme: 'dark' });
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  debounceMs = 500
): [T, (value: T | ((prev: T) => T)) => void] {
  // 초기값 로드 (localStorage에서 또는 기본값)
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;

    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initialValue;
    } catch (error) {
      console.error(`Error loading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // debounce된 저장 함수
  const debouncedSave = useMemo(() => {
    let timer: NodeJS.Timeout | null = null;

    return (valueToSave: T) => {
      if (timer) clearTimeout(timer);

      timer = setTimeout(() => {
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(key, JSON.stringify(valueToSave));
          } catch (error) {
            console.error(`Error saving to localStorage key "${key}":`, error);
          }
        }
      }, debounceMs);
    };
  }, [key, debounceMs]);

  // 값이 변경될 때마다 localStorage에 저장
  useEffect(() => {
    debouncedSave(value);
  }, [value, debouncedSave]);

  return [value, setValue];
}
