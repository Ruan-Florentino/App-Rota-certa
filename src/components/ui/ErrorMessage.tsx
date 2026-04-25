import React from 'react';
import { motion } from 'motion/react';
import { ErrorIcon } from '../icons';
import { PremiumButton } from './PremiumButton';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = "Ops! Algo deu errado",
  message,
  onRetry,
  className = ""
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-16 h-16 mb-4 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500"
      >
        <ErrorIcon size={32} />
      </motion.div>

      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-xs text-white/40 mb-6 max-w-[280px] leading-relaxed">
        {message}
      </p>

      {onRetry && (
        <PremiumButton variant="danger" onClick={onRetry} size="sm">
          Tentar Novamente
        </PremiumButton>
      )}
    </div>
  );
};
