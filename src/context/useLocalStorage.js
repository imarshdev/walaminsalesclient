import { useState, useEffect } from 'react';

function useLocalStorageState(key, initialValue) {
    const [state, setState] = useState(() => {
      const storedValue = localStorage.getItem(key);
      // Check if there's any stored value
      if (storedValue === null || storedValue === undefined) {
        return initialValue;
      }
  
      try {
        return JSON.parse(storedValue);
      } catch (error) {
        // If there's an error parsing JSON, fall back to the initial value
        console.error(`Error parsing localStorage key "${key}":`, error);
        return initialValue;
      }
    });
  
    useEffect(() => {
      localStorage.setItem(key, JSON.stringify(state));
    }, [key, state]);
  
    return [state, setState];
  }

export default useLocalStorageState;