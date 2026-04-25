// src/hooks/useFirestoreQuery.ts
import { useState, useEffect } from 'react';
import { Query, onSnapshot } from 'firebase/firestore';

export function useFirestoreQuery<T>(
    queryFn: () => Query<T>,
    deps: unknown[]
) {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        setLoading(true);
        const unsub = onSnapshot(
            queryFn(),
            (snap) => {
                setData(snap.docs.map(d => ({ id: d.id, ...d.data() })) as T[]);
                setLoading(false);
            },
            (err) => {
                setError(err);
                setLoading(false);
            }
        );
        return () => unsub();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    return { data, loading, error };
}
