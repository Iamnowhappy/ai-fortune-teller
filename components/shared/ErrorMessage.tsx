import React from 'react';

interface ErrorMessageProps {
  message: string | null;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="mt-6 w-full max-w-md bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg relative" role="alert">
      <strong className="font-bold">오류:</strong>
      <span className="block sm:inline ml-2">{message}</span>
    </div>
  );
};