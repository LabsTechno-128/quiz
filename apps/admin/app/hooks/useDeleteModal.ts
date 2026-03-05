"use client";

import { useState } from "react";

export function useDeleteModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => {
    if (!loading) setIsOpen(false);
  };

  const confirm = async (callback: () => Promise<void> | void) => {
    try {
      setLoading(true);
      await callback();
      setIsOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return {
    isOpen,
    loading,
    open,
    close,
    confirm,
  };
}