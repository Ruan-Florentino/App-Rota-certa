import React from 'react';
import { useIntelStore } from '../store';
import { MOCK_ASSETS } from '../../../lib/data/mock-assets';
import { IntelPanelContent } from './IntelPanelContent';

export function IntelPanel() {
  const { isPanelOpen, selectedAssetId, closePanel } = useIntelStore();

  const asset = MOCK_ASSETS.find(a => a.id === selectedAssetId);

  return (
    <div 
      className={`fixed top-0 right-0 w-full sm:w-[420px] h-full bg-[#030612]/95 backdrop-blur-xl border-l border-cyan-400/15 z-40 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] shadow-[-8px_0_32px_rgba(0,0,0,0.5)] ${isPanelOpen && asset ? 'translate-x-0' : 'translate-x-full'}`}
    >
      {asset && (
        <IntelPanelContent asset={asset} onClose={closePanel} />
      )}
    </div>
  );
}
