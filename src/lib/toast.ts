import { toast as sonnerToast } from 'sonner';

export const toast = {
  success: (message: string, description?: string) =>
    sonnerToast.success(message, { description }),
    
  error: (message: string, description?: string) =>
    sonnerToast.error(message, { description }),
    
  info: (message: string, description?: string) =>
    sonnerToast.info(message, { description }),
    
  warning: (message: string, description?: string) =>
    sonnerToast.warning(message, { description }),
    
  loading: (message: string) =>
    sonnerToast.loading(message),
    
  promise: <T,>(
    promise: Promise<T>,
    messages: { loading: string; success: string; error: string }
  ) => sonnerToast.promise(promise, messages),
  
  // Easter egg flavor
  easterEgg: (message: string, emoji: string = '✨') =>
    sonnerToast(message, {
      icon: emoji,
      duration: 4000,
      style: {
        background: 'linear-gradient(135deg, #A855F7 0%, #7DD3FC 100%)',
        color: 'white',
        fontWeight: 'bold',
      },
    }),
};
