import { useState, useEffect, useCallback } from "react";
import { publicRequest } from "../config/axios.config";

const useFetch = (url: string, options = {}) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const response = await publicRequest.get(url, {
        ...options, // important!
      });

      setData(response.data);
      setError(null);

      return response.data;
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || "Something went wrong!";

      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [url]); // remove options to avoid infinite loop

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = () => fetchData();

  return { data, loading, error, refetch };
};

export default useFetch;
