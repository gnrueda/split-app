import { useState, useCallback } from "react";

interface UseConfirmReturn {
  isOpen: boolean;
  message: string;
  confirm: (message: string, onConfirm: () => void) => void;
  handleConfirm: () => void;
  handleCancel: () => void;
}

export function useConfirm(): UseConfirmReturn {
  const [message, setMessage] = useState("");
  const [pendingCallback, setPendingCallback] = useState<(() => void) | null>(
    null,
  );

  const confirm = useCallback((msg: string, onConfirm: () => void) => {
    setMessage(msg);
    // Wrap in a function to avoid useState treating it as a lazy initializer
    setPendingCallback(() => onConfirm);
  }, []);

  const handleConfirm = () => {
    pendingCallback?.();
    setPendingCallback(null);
    setMessage("");
  };

  const handleCancel = () => {
    setPendingCallback(null);
    setMessage("");
  };

  return {
    isOpen: pendingCallback !== null,
    message,
    confirm,
    handleConfirm,
    handleCancel,
  };
}
