import React, { useEffect, useState } from "react";
import { Loader } from "../Loader";

// Using a generic string for page navigation to avoid complex type imports
type NavigateFunction = (page: string) => void;

interface PremiumRouteProps {
  children: React.ReactNode;
  navigate: NavigateFunction;
}

// Mock function to simulate checking premium status from a server
const mockCheckPremium = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Simulate a network request delay
    setTimeout(() => {
      // For this demonstration, we'll always return false
      // to trigger the redirect to the checkout page.
      resolve(false); 
    }, 1500);
  });
};

export const PremiumRoute: React.FC<PremiumRouteProps> = ({ children, navigate }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isPremium, setIsPremium] = useState<boolean | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      const premiumStatus = await mockCheckPremium();
      setIsPremium(premiumStatus);
      setIsChecking(false);

      if (!premiumStatus) {
        // If not premium, navigate to the checkout page
        navigate('checkout');
      }
    };

    checkStatus();
  }, [navigate]);

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
