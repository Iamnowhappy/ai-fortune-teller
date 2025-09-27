import { useState, useCallback } from 'react';

type AnalysisFunction<T, P extends any[]> = (...args: P) => Promise<T>;

interface UseAnalysisReturn<T, P extends any[]> {
  result: T | null;
  isLoading: boolean;
  error: string | null;
  runAnalysis: (...args: P) => Promise<void>;
  reset: () => void;
}

export function useAnalysis<T, P extends any[]>(analysisFn: AnalysisFunction<T, P>): UseAnalysisReturn<T, P> {
  const [result, setResult] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const runAnalysis = useCallback(async (...args: P) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const analysisResult = await analysisFn(...args);
      setResult(analysisResult);
    } catch (err: any) {
      console.error(err);
      setError(err.message || '알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  }, [analysisFn]);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return { result, isLoading, error, runAnalysis, reset };
}
