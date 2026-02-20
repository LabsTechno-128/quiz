// hooks/useDelete.js
import { publicRequest } from "@/app/config/axios.config";
import { useState } from "react";

export const useDelete = () => {
  const [loading, setLoading] = useState(false);

  const remove = async (url: string) => {
    try {
      setLoading(true);
      const res = await publicRequest.delete(url);
      return res.data;
    } catch (err) {
      console.error("Delete failed:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { remove, loading };
};
