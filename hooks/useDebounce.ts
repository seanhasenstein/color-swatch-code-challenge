import { useEffect, useState } from "react";

// custom hook to debounce a value
// delays updating the debouncedValue until after the delay to prevent excessive API calls while the user is updating the value
export default function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
