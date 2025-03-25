import { useCallback } from 'react';
import toast from 'react-hot-toast';

type ToastType = 'success' | 'error' | 'loading';

export const useToast = () => {
  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    switch (type) {
      case 'success':
        toast.success(message);
        break;
      case 'error':
        toast.error(message);
        break;
      case 'loading':
        toast.loading(message);
        break;
      default:
        toast(message);
    }
  }, []);

  return { showToast };
};
