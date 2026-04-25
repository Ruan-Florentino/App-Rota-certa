import React from 'react';
import { COLLECTIONS } from '../../data/collections';
import { CollectionCard } from './CollectionCard';

interface CollectionGridProps {
  collections: any[];
  onSelect?: (collection: any) => void;
}

export const CollectionGrid: React.FC<CollectionGridProps> = ({ collections, onSelect }) => {
  return (
    <section className="space-y-6 px-6 pt-4">
      <div className="flex items-center justify-between">
        <h3 className="section-title flex items-center gap-2">
          ✨ Coleções da Equipe
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {collections.map((col, i) => (
          <CollectionCard
            key={col.id}
            collection={col}
            index={i}
            onClick={() => onSelect?.(col)}
          />
        ))}
      </div>
    </section>
  );
};
