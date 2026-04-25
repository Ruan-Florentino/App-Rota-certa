import { useRef, useState } from 'react';
import { fileToDataUrl, validateImage } from '@/utils/imageUpload';

interface ImagePickerProps {
  currentUrl?: string;
  onSelect: (dataUrl: string) => void;
  children: (state: {
    preview: string;
    isLoading: boolean;
    error: string | null;
    trigger: () => void;
  }) => React.ReactNode;
  maxWidth?: number;
}

export const ImagePicker = ({ 
  currentUrl = '', 
  onSelect, 
  children,
  maxWidth = 800,
}: ImagePickerProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(currentUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateImage(file);
    if (validationError) {
      setError(validationError);
      setTimeout(() => setError(null), 3000);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const dataUrl = await fileToDataUrl(file, maxWidth);
      setPreview(dataUrl);
      onSelect(dataUrl);
    } catch (err) {
      setError('Erro ao processar imagem');
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsLoading(false);
      // Resetar o input pra permitir selecionar a mesma imagem de novo
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const trigger = () => inputRef.current?.click();

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFile}
        className="hidden"
      />
      {children({ preview, isLoading, error, trigger })}
    </>
  );
};
