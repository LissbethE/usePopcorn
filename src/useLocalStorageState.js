import { useState, useEffect } from "react";

export function useLocalStorageState(initialState, key) {
  const [value, setValue] = useState(function () {
    // 1) Reeding the movies in localstorage
    const storedValue = localStorage.getItem(key);

    return storedValue ? JSON.parse(storedValue) : initialState;
  });

  /////////////////////////
  useEffect(
    function () {
      // 2) Saving the movies in localstorage
      localStorage.setItem(key, JSON.stringify(value));
    },
    [value, key]
  );

  return [value, setValue];
}
