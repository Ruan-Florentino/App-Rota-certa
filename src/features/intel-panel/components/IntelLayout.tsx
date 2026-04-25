import React, { useEffect, useState } from 'react';
import { IntelPanel } from './IntelPanel';
import { IntelBottomSheet } from './IntelBottomSheet';

export function IntelLayout() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile ? <IntelBottomSheet /> : <IntelPanel />;
}
