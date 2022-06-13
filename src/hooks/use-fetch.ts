import { useEffect, useState } from "react";

export const useFetch = <T>(...args: Parameters<typeof fetch>) => {
  const [response, setResponse] = useState<T | null>(null);

  useEffect(() => {
    const fetchCars = async () => {
      const response = await fetch(...args);
      setResponse(await response.json());
    };
    fetchCars();
  }, []);

  return response;
};
