import React, { useEffect, useState } from "react";
import { Loader } from "../Loader";

// Using a generic string for page navigation to avoid complex type imports
type NavigateFunction = (page: string) => void;

interface PremiumRouteProps {
  children: React.ReactNode;
  navigate: NavigateFunction;
  email: string | null;
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

export const PremiumRoute: React.FC<PremiumRouteProps> = ({ children, navigate, email }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isPremium, setIsPremium] = useState<boolean | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      if (!email) {
          // If no email, user is not logged in, so not premium.
          setIsPremium(false);
          setIsChecking(false);
          navigate('checkout'); // Or a login page if one existed
          return;
      }

      const premiumStatus = await checkPremiumStatus(email);
      setIsPremium(premiumStatus);
      setIsChecking(false);

      if (!premiumStatus) {
        navigate('checkout');
      }
    };

    checkStatus();
  }, [navigate, email]);

  if (isChecking) {
    return (
      <main className="flex-grow flex flex-col items-center justify-center text-center py-10">
        <Loader messages={["프리미엄 상태를 확인 중입니다..."]} />
      </main>
    );
  }

  // If the user is premium, render the protected content.
  // Otherwise, render null while the navigation to the checkout page occurs.
  return isPremium ? <>{children}</> : null;
};
