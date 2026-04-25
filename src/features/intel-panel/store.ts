import { create } from 'zustand';

interface IntelStore {
  selectedAssetId: string | null;
  highlightedAssetId: string | null;
  isPanelOpen: boolean;
  setSelectedAsset: (id: string | null) => void;
  setHighlightedAsset: (id: string | null) => void;
  closePanel: () => void;
}

export const useIntelStore = create<IntelStore>((set) => ({
  selectedAssetId: null,
  highlightedAssetId: null,
  isPanelOpen: false,
  setSelectedAsset: (id) => set({ selectedAssetId: id, isPanelOpen: !!id }),
  setHighlightedAsset: (id) => set({ highlightedAssetId: id }),
  closePanel: () => set({ selectedAssetId: null, isPanelOpen: false, highlightedAssetId: null }),
}));
