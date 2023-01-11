

import { useState } from "react";


const useSessionStorage = (key: string, initValue: any) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initValue;
    } catch (error) {
      return initValue;
    }
  });

  const setValue = (value: any) => {
    try {
      setStoredValue(JSON.stringify(value));
      window.sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log("error saving value",error);
    }
  };
  
  return [storedValue, setValue];
}

export default useSessionStorage;