import { useEffect, useState } from 'react';
import { db } from '../lib/firebase'; // Relative Path
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export function useRealTimeAlerts(mealId: string) {
  const [alert, setAlert] = useState<{ active: boolean; message: string }>({ active: false, message: "" });

  useEffect(() => {
    if (!mealId) return;
    const q = query(collection(db, "ratings"), where("mealId", "==", mealId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ratings = snapshot.docs.map(doc => doc.data());
      if (ratings.length < 3) return; 

      const worthNoCount = ratings.filter(r => r.worth === false).length;
      const total = ratings.length;

      if ((worthNoCount / total) > 0.6) {
        setAlert({ active: true, message: `Alert: 60%+ dissatisfaction for this meal!` });
      } else {
        setAlert({ active: false, message: "" });
      }
    });
    return () => unsubscribe();
  }, [mealId]);

  return alert;
}