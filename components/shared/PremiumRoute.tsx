import React, { useEffect, useState } from "react";

type NavigateFunction = (page: string) => void;

interface PremiumRouteProps {
  children: React.ReactNode;
  navigate: NavigateFunction;
  email: string | null;
  redirectOnFail?: boolean; // New prop to control redirection
  featureName?: string;
}

const checkPremiumStatus = async (email: string): Promise<boolean> => {
    try {
        const response = await fetch(`/api/check-premium?email=${encodeURIComponent(email)}`);
        if (!response.ok) {
            console.error('Failed to check premium status');
            return false;
        }
        const data = await response.json();
        return data.isPremium;
    } catch (error) {
        console.error('Error checking premium status:', error);
        return false;
    }
};

export const PremiumRoute: React.FC<PremiumRouteProps> = ({ children, navigate, email, redirectOnFail = false, featureName }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isPremium, setIsPremium] = useState<boolean | null>(null);

  const navigateToCheckout = () => {
    const featureQuery = featureName ? `?feature=${encodeURIComponent(featureName)}` : '';
    navigate(`checkout${featureQuery}`);
  };

  useEffect(() => {
    const checkStatus = async () => {
      setIsChecking(true);
      if (!email) {
          setIsPremium(false);
          setIsChecking(false);
          if (redirectOnFail) {
            navigateToCheckout();
          }
          return;
      }

      const premiumStatus = await checkPremiumStatus(email);
      setIsPremium(premiumStatus);
      setIsChecking(false);

      if (!premiumStatus && redirectOnFail) {
        navigateToCheckout();
      }
    };

    checkStatus();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, navigate, redirectOnFail, featureName]);

  if (isChecking) {
    // For full-page routes, show a full loader. For inline, show a smaller one.
    if (redirectOnFail) {
      return (
        <main className="flex-grow flex flex-col items-center justify-center text-center py-10">
          <div className="flex flex-col items-center justify-center gap-6 text-center">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-cyan-400"></div>
            <h2 className="text-2xl font-semibold text-white">프리미엄 상태를 확인 중입니다...</h2>
          </div>
        </main>
      );
    }
    return (
       <div className="flex justify-center items-center py-8">
        <div className="flex items-center gap-2 text-slate-400">
          <svg className="animate-spin h-5 w-5 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          프리미엄 상태 확인 중...
        </div>
      </div>
    );
  }

  // If redirectOnFail is true, we should return null while redirecting.
  if (!isPremium && redirectOnFail) {
    return null;
  }
  
  // Render children only if premium. Otherwise, render null (the UpgradeCTA will be visible).
  return isPremium ? <>{children}</> : null;
};