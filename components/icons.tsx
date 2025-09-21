
import React from 'react';

type IconProps = {
  className?: string;
};

export const FaceIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
    <line x1="9" y1="9" x2="9.01" y2="9"></line>
    <line x1="15" y1="9" x2="15.01" y2="9"></line>
  </svg>
);

export const UploadIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
  </svg>
);

export const EyeIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

export const NoseIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22a4 4 0 0 0 4-4V6a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v12a4 4 0 0 0 4 4Z"></path>
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

export const MouthIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13a6 6 0 0 1-12 0h12Z"></path>
    <path d="M6 13C6 7 12 7 12 7s6 0 6 6H6Z"></path>
  </svg>
);

export const ForeheadIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 4c-4.4 0-8 3.6-8 8v.5C4 17.5 7.6 20 12 20s8-2.5 8-7.5V12c0-4.4-3.6-8-8-8z" />
    <path d="M4.3 8.3c1.5-1.5 3.5-2.5 5.7-2.8" />
  </svg>
);

export const ChinIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 14c0 3.3 2.7 6 6 6h4c3.3 0 6-2.7 6-6V9c0-3.3-2.7-6-6-6h-4C6.7 3 4 5.7 4 9v5z" />
    <path d="M8 20c0-2.2 1.8-4 4-4s4 1.8 4 4" />
  </svg>
);

export const EarIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 10a7 7 0 1 1 12 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h2"></path>
    <path d="M12 10V4"></path>
  </svg>
);

export const RefreshIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
    <path d="M21 21v-5h-5" />
  </svg>
);

export const HomeIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

export const PalmIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 15V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v9Z"></path>
    <path d="M18 11a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-3a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2Z"></path>
  </svg>
);

export const ImpressionIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
    <line x1="9" y1="9" x2="9.01" y2="9"></line>
    <line x1="15" y1="9" x2="15.01" y2="9"></line>
    <path d="m17.5 6.5-1.5 4.5 4.5-1.5-4.5-1.5 1.5-4.5-1.5 4.5z"></path>
  </svg>
);

export const HeartLineIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

export const HeadLineIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a10 10 0 0 0-3.91 19.85A10 10 0 0 0 12 2zM2 12h10M12 2v10m0 0h10m-10 0a10 10 0 0 1 10-10"></path>
  </svg>
);

export const LifeLineIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12h16M4 12a8 8 0 0 1 8-8 8 8 0 0 1 8 8M4 12a8 8 0 0 0 8 8 8 8 0 0 0 8-8"></path>
  </svg>
);

export const LineIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12h16"></path>
    </svg>
);

export const BrainCircuitIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5a3 3 0 1 0-5.993.129 3 3 0 0 0 5.993-.13Z" /><path d="M12 5a3 3 0 1 0 5.993.129A3 3 0 0 0 12 5Z" /><path d="M12 12a3 3 0 1 0-5.993.129 3 3 0 0 0 5.993-.13Z" /><path d="M12 12a3 3 0 1 0 5.993.129 3 3 0 0 0 5.993-.13Z" /><path d="M12 19a3 3 0 1 0-5.993.129 3 3 0 0 0 5.993-.13Z" /><path d="M12 19a3 3 0 1 0 5.993.129 3 3 0 0 0 5.993-.13Z" /><path d="M20 12h-4" /><path d="M4 12h4" /><path d="M12 2v1" /><path d="M12 9v1" /><path d="M12 16v1" /><path d="M12 21v1" />
    </svg>
);

export const LightbulbIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 14c.2-1 .7-1.7 1.5-2.5C17.7 10.2 18 9 18 8c0-2.2-1.8-4-4-4-3.5 0-4.5 3-4.5 4 0 1 .3 1.8 1.5 3 .8.8 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>
    </svg>
);

export const AstrologyIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" />
        <path d="m12 2-2.5 5" />
        <path d="m12 22 2.5-5" />
        <path d="m2 12 5-2.5" />
        <path d="m22 12-5 2.5" />
        <path d="m3.5 15.5 4-4" />
        <path d="m16.5 7.5-4 4" />
        <path d="m3.5 8.5 4 4" />
        <path d="m16.5 16.5-4-4" />
    </svg>
);

export const SajuIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" />
        <path d="M12 2a5 5 0 0 0-5 5 5 5 0 0 1 5 5" />
        <path d="M12 22a5 5 0 0 1-5-5 5 5 0 0 0 5-5" />
        <path d="M12 2a5 5 0 0 1 5 5 5 5 0 0 0-5 5" />
        <path d="M12 22a5 5 0 0 0 5-5 5 5 0 0 1-5-5" />
    </svg>
);

export const TarotIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 7V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2" />
        <path d="M8 7h8" />
        <path d="M8 12h8" />
        <path d="M8 17h8" />
        <path d="M17 3v18" />
    </svg>
);

export const JuyeokIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 6h16" />
        <path d="M4 12h16" />
        <path d="M4 18h16" />
        <path d="M10 6h-2" />
        <path d="M16 6h-2" />
        <path d="M8 12h-2" />
        <path d="M14 12h-2" />
        <path d="M18 12h-2" />
        <path d="M6 18h-2" />
        <path d="M12 18h-2" />
    </svg>
);

export const YukhyoIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2v20" />
        <path d="M12 12 6.1 15.1" />
        <path d="M12 12 17.9 15.1" />
        <path d="m12 12-5.9 3.1" />
        <path d="M12 12 17.9 8.9" />
        <path d="m12 12-5.9-3.1" />
    </svg>
);


// Tarot Card Icons
export const TarotCardBackIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" />
        <path d="M12 12 8 8" />
        <path d="m12 12 4 4" />
        <path d="m12 12-4 4" />
        <path d="m12 12 4-4" />
    </svg>
);


export const TarotWandIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="4" y1="20" x2="20" y2="4"></line><path d="m15 4 5 5"></path><path d="m4 9 5 5"></path>
    </svg>
);

export const TarotCupIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 2h8v2H8z"></path><path d="M6 4h12v10a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V4z"></path><path d="M12 18v4"></path><path d="M8 22h8"></path>
    </svg>
);

export const TarotSwordIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21.28 21.28 3.72 3.72"></path><path d="m5.86 5.86 3.53 3.53"></path><path d="M12.73 4.22 17.5 9l-2.47 2.47"></path><path d="M19.78 6.66 12 14.44l-2.44-2.44"></path><path d="m3.72 21.28 1.41-1.41"></path><path d="m14.12 14.12 6.16-6.16"></path>
    </svg>
);

export const TarotPentacleIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle><path d="m12 16.5-5.5 3 2-6.5-5-4.5h6l2-6.5 2 6.5h6l-5 4.5 2 6.5z"></path>
    </svg>
);

export const TarotMajorArcanaIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2 9.5 9h5L12 2Z"></path><path d="M12 22l2.5-7h-5L12 22Z"></path><path d="M2 12l7-2.5v5L2 12Z"></path><path d="M22 12l-7 2.5v-5L22 12Z"></path>
    </svg>
);

export const TheFoolIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4 4 4 0 0 0 4-4V6a4 4 0 0 0-4-4z"></path><path d="M12 18v4"></path><path d="M10 22h4"></path>
    </svg>
);

export const TheLoversIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11.23 4.42a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 20.8l7.49-7.54.9-1a5.5 5.5 0 0 0-7.64-7.9l-.15.14-.1.09Z"></path><path d="m17.5 2.5-3 3"></path>
    </svg>
);

export const TheSunIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path>
    </svg>
);

export const TheMoonIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
    </svg>
);
