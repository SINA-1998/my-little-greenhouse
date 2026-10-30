import React from 'react';

export const IconLeafLogo: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M12 21C12 21 19 16.5 19 9.5C19 5.35786 15.866 2 12 2C8.13401 2 5 5.35786 5 9.5C5 16.5 12 21 12 21Z" fill="#2E5A44" fillOpacity="0.18" stroke="#2E5A44" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 21V10M12 14L15.5 11M12 11L9 8.5" stroke="#2E5A44" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const IconWaterDrop: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="currentColor" fillOpacity="0.22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const IconMistSpray: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M4 14C4 11.7909 5.79086 10 8 10H15C17.2091 10 19 11.7909 19 14C19 16.2091 17.2091 18 15 18H8C5.79086 18 4 16.2091 4 14Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.75"/>
    <circle cx="20" cy="7" r="1.2" fill="currentColor"/>
    <circle cx="16" cy="5" r="1.2" fill="currentColor"/>
    <circle cx="12" cy="6" r="1.2" fill="currentColor"/>
  </svg>
);

export const IconShieldLock: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="11" r="2" fill="currentColor"/>
  </svg>
);

export const IconRotate90: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 3v5h-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const IconBell: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" fill="#2E5A44" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
  </svg>
);

export const IconSettings: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="3.2" fill="#2E5A44" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.75"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="1.75"/>
  </svg>
);

export const PlantStylizedIllustration: React.FC<{ shape: string; potColor: 'white' | 'black' }> = ({ shape, potColor }) => {
  const potFill = potColor === 'black' ? '#23272A' : '#FFFFFF';
  const potStroke = potColor === 'black' ? '#111315' : '#D5CFC2';

  const renderFoliage = () => {
    switch (shape) {
      case 'ficus':
        return (
          <>
            <path d="M50 58V22" stroke="#5C4033" strokeWidth="3" strokeLinecap="round"/>
            <ellipse cx="36" cy="42" rx="12" ry="7" transform="rotate(-25 36 42)" fill="#1F4D36" stroke="#143323" strokeWidth="1.5"/>
            <ellipse cx="64" cy="38" rx="12" ry="7" transform="rotate(25 64 38)" fill="#2E6F4E" stroke="#1F4D36" strokeWidth="1.5"/>
            <ellipse cx="38" cy="26" rx="11" ry="6.5" transform="rotate(-15 38 26)" fill="#2E6F4E" stroke="#1F4D36" strokeWidth="1.5"/>
            <path d="M50 22C52 14 55 12 54 22" fill="#C84B31" stroke="#C84B31" strokeWidth="2" strokeLinecap="round"/>
          </>
        );
      case 'pine':
        return (
          <>
            <ellipse cx="50" cy="56" rx="14" ry="4" fill="#6B7F46"/>
            <path d="M50 14L30 48H70L50 14Z" fill="#3B6E52" stroke="#284E39" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M50 22L34 52H66L50 22Z" fill="#4D8B68" opacity="0.85"/>
          </>
        );
      case 'cactus':
        return (
          <>
            <circle cx="50" cy="43" r="15" fill="#3D7A4F" stroke="#285435" strokeWidth="1.5"/>
            <path d="M44 29V57M50 28V58M56 29V57" stroke="#A3C68C" strokeWidth="1.2" strokeDasharray="2 2"/>
          </>
        );
      case 'adenium':
        return (
          <path d="M43 56C42 44 46 38 48 34M57 56C58 44 54 38 52 34M46 36L41 28M54 36L59 29M50 35V26" stroke="#8C8275" strokeWidth="3.5" strokeLinecap="round"/>
        );
      case 'hypoestes':
        return (
          <>
            <ellipse cx="40" cy="42" rx="10" ry="6" transform="rotate(-30 40 42)" fill="#D96B8A" stroke="#3B6E52" strokeWidth="1.5"/>
            <ellipse cx="60" cy="42" rx="10" ry="6" transform="rotate(30 60 42)" fill="#E3E8E1" stroke="#3B6E52" strokeWidth="1.5"/>
            <ellipse cx="50" cy="30" rx="9" ry="6" fill="#E07A9B" stroke="#2E5A44" strokeWidth="1.5"/>
          </>
        );
      case 'dracaena':
        return (
          <path d="M50 56V20M50 38L34 26M50 38L66 26M50 46L32 36M50 46L68 36M50 28L38 16M50 28L62 16" stroke="#1E5238" strokeWidth="4" strokeLinecap="round"/>
        );
      default:
        return (
          <>
            <path d="M50 56C50 40 34 30 32 18C44 20 50 32 50 56Z" fill="#468263" stroke="#2E5A44" strokeWidth="1.5"/>
            <path d="M50 56C50 40 66 30 68 18C56 20 50 32 50 56Z" fill="#5FA37F" stroke="#2E5A44" strokeWidth="1.5"/>
            <path d="M50 56V16" stroke="#2E5A44" strokeWidth="2" strokeLinecap="round"/>
          </>
        );
    }
  };

  return (
    <svg className="w-20 h-20 drop-shadow-xs" viewBox="0 0 100 90" fill="none">
      {renderFoliage()}
      <path d="M33 56H67L63 80C62.5 82 60.5 83 58.5 83H41.5C39.5 83 37.5 82 37 80L33 56Z" fill={potFill} stroke={potStroke} strokeWidth="2"/>
      <rect x="31" y="53" width="38" height="4" rx="2" fill={potFill} stroke={potStroke} strokeWidth="1.5"/>
    </svg>
  );
};