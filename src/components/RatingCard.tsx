"use client";
import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { ThumbsUp, ThumbsDown, Utensils, CheckCircle } from 'lucide-react';

export default function RatingCard({ itemId, itemName, mealId, userId, canRate, isSpecial }: any) {
  const [rating, setRating] = useState<{ liked?: boolean; worth?: boolean }>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getDoc(doc(db, "ratings", `${userId}_${itemId}`)).then(snap => {
        if (snap.exists()) setRating(snap.data());
    });
  }, [userId, itemId]);

  const saveRating = async (update: any) => {
    if (!canRate) return;
    
    // Toggle logic for Worth button
    let finalUpdate = update;
    if (update.worth !== undefined && rating.worth === update.worth) {
        finalUpdate = { worth: false }; // Unselect if clicked again
    }

    const newRating = { ...rating, ...finalUpdate };
    setRating(newRating);
    setIsSaving(true);
    
    await setDoc(doc(db, "ratings", `${userId}_${itemId}`), { 
      userId, itemId, mealId, ...newRating, timestamp: serverTimestamp() 
    }, { merge: true });
    
    setIsSaving(false);
  };

  const isRated = rating.liked !== undefined;

  return (
    <div className={`p-5 rounded-3xl shadow-sm border mb-4 transition-all ${isSpecial ? 'border-yellow-200 bg-gradient-to-br from-white to-yellow-50' : 'bg-white border-slate-100'} ${isRated ? 'ring-2 ring-orange-50' : ''}`}>
      <div className="flex justify-between items-center mb-5">
        <span className="font-bold text-slate-800 text-lg leading-tight">{itemName}</span>
        {isRated && (
             <span className="text-[9px] font-black text-green-600 bg-green-50 px-2 py-1 rounded-lg uppercase flex items-center gap-1">
                <CheckCircle size={10}/> Recorded
             </span>
        )}
      </div>
      
      <div className="flex gap-2">
        <button 
          onClick={() => saveRating({ liked: true })}
          className={`flex-1 py-4 rounded-2xl flex justify-center transition active:scale-95 ${rating.liked === true ? 'bg-green-500 text-white shadow-lg shadow-green-100' : 'bg-slate-50 text-slate-300'}`}
        >
          <ThumbsUp size={22} />
        </button>
        <button 
          onClick={() => saveRating({ liked: false })}
          className={`flex-1 py-4 rounded-2xl flex justify-center transition active:scale-95 ${rating.liked === false ? 'bg-red-500 text-white shadow-lg shadow-red-100' : 'bg-slate-50 text-slate-300'}`}
        >
          <ThumbsDown size={22} />
        </button>
        <button 
          onClick={() => saveRating({ worth: !rating.worth })}
          className={`px-5 py-4 rounded-2xl border flex items-center gap-2 font-black text-[10px] uppercase transition active:scale-95 ${rating.worth ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' : 'bg-white text-slate-300 border-slate-100'}`}
        >
          <Utensils size={18} />
          {rating.worth ? "Worth It" : "Worth?"}
        </button>
      </div>
    </div>
  );
}