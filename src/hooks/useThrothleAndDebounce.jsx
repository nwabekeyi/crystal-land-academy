import { useRef, useCallback } from 'react';

const useThrottleAndDebounce = (callback, delay, mode = 'throttle') => {
  const lastCallTime = useRef(0); // For throttling
  const timeout = useRef(null);   // For debouncing

  const throttledFn = useCallback((...args) => {
    const now = Date.now();
    if (now - lastCallTime.current >= delay) {
      callback(...args);
      lastCallTime.current = now;
    }
  }, [callback, delay]);

  const debouncedFn = useCallback((...args) => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    timeout.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);

  return mode === 'throttle' ? throttledFn : debouncedFn;
};

export default useThrottleAndDebounce;
