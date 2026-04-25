import React from 'react';
import { Drawer } from 'vaul';
import { useIntelStore } from '../store';
import { MOCK_ASSETS } from '../../../lib/data/mock-assets';
import { IntelPanelContent } from './IntelPanelContent';

export function IntelBottomSheet() {
  const { isPanelOpen, selectedAssetId, closePanel } = useIntelStore();
  const asset = MOCK_ASSETS.find(a => a.id === selectedAssetId);

  return (
    <Drawer.Root open={isPanelOpen && !!asset} onOpenChange={(open) => !open && closePanel()} snapPoints={[0.3, 0.6, 0.92]}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/98 backdrop-blur-xl border-t border-cyan-400/15 rounded-t-2xl max-h-[92vh] flex flex-col">
          <div className="w-12 h-1 bg-white/20 rounded-full mx-auto my-3 shrink-0" />
          <div className="flex-1 overflow-hidden">
            {asset && <IntelPanelContent asset={asset} onClose={closePanel} />}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
