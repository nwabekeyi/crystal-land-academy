// useFirestoreCollection.js
import { useEffect, useState } from 'react';
import { onSnapshot } from 'firebase/firestore';

const useOnsnapshot = (reference) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(reference, (snapshot) => {
      setLoading(false);
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setData(docs);
    }, (err) => {
      setLoading(false);
      setError(err);
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [reference]);

  return { data, loading, error };
};

export default useOnsnapshot;
