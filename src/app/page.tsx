// "use client";
// import { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { db, getMealID, MEAL_TYPES, MealType } from '../lib/firebase';
// import { doc, getDoc, setDoc, serverTimestamp, onSnapshot, collection, query, where } from 'firebase/firestore';
// import RatingCard from '../components/RatingCard';
// import { LogIn, UtensilsCrossed, CheckCircle2, Calendar, PartyPopper, LayoutDashboard } from 'lucide-react';
// import { loginWithGoogle, logout } from '../lib/auth-helpers';

// export default function Home() {
//   const { user, loading: authLoading } = useAuth();
//   const todayStr = new Date().toISOString().split('T')[0];
  
//   const [viewDate, setViewDate] = useState(todayStr);
//   const [attendance, setAttendance] = useState<'eating' | 'skipping' | null>(null);
//   const [mealType, setMealType] = useState<MealType>('Lunch');
//   const [menuItems, setMenuItems] = useState<any[]>([]);
//   const [ratedIds, setRatedIds] = useState<string[]>([]);
//   const [isSpecial, setIsSpecial] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [menuLoading, setMenuLoading] = useState(true);

//   const mealId = getMealID(viewDate, mealType);
//   const isToday = viewDate === todayStr;
//   const dayName = new Date(viewDate).toLocaleDateString('en-US', { weekday: 'long' });

//   useEffect(() => {
//     const hour = new Date().getHours();
//     if (hour < 10) setMealType('Breakfast');
//     else if (hour < 15) setMealType('Lunch');
//     else if (hour < 21) setMealType('Dinner');
//     else setMealType('Night Canteen');
//   }, []);

//   useEffect(() => {
//     if (!user) return;
//     setMenuLoading(true);
//     setShowSuccess(false);

//     getDoc(doc(db, "attendance", `${user.uid}_${mealId}`)).then(snap => {
//       setAttendance(snap.exists() ? snap.data().status : null);
//     });

//     const unsubMenu = onSnapshot(doc(db, "daily_menus", mealId), (doc) => {
//       if (doc.exists()) {
//         setMenuItems(doc.data().items || []);
//         setIsSpecial(doc.data().isSpecial || false);
//       } else {
//         setMenuItems([]);
//         setIsSpecial(false);
//       }
//       setMenuLoading(false);
//     });

//     const q = query(collection(db, "ratings"), where("userId", "==", user.uid), where("mealId", "==", mealId));
//     const unsubRatings = onSnapshot(q, (snap) => {
//       const ids = snap.docs.map(d => d.data().itemId);
//       setRatedIds(ids);
//     });

//     return () => { unsubMenu(); unsubRatings(); };
//   }, [user, mealId]);

//   const validRatedCount = menuItems.filter(item => ratedIds.includes(item.id)).length;

//   useEffect(() => {
//     if (menuItems.length > 0 && validRatedCount === menuItems.length && !showSuccess) {
//         setTimeout(() => setShowSuccess(true), 600);
//     }
//   }, [validRatedCount, menuItems]);

//   const markAttendance = async (status: 'eating' | 'skipping') => {
//     if (!user || !isToday) return;
//     setAttendance(status);
//     await setDoc(doc(db, "attendance", `${user.uid}_${mealId}`), {
//       userId: user.uid, mealId, status, timestamp: serverTimestamp()
//     });
//   };

//   if (authLoading) return <div className="p-20 text-center font-bold text-slate-300 italic">Connecting...</div>;
//   if (!user) return (
//     <div className="flex flex-col items-center justify-center h-screen p-6 text-center">
//       <UtensilsCrossed size={64} className="mb-4 text-orange-500" />
//       <h1 className="text-3xl font-black mb-8 italic text-slate-800">Mess Meter</h1>
//       <button onClick={() => loginWithGoogle()} className="bg-black text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 active:scale-95 transition shadow-xl">
//         <LogIn size={20} /> Sign in with @iiitg.ac.in
//       </button>
//     </div>
//   );

//   if (showSuccess && isToday) {
//     return (
//         <div className="flex flex-col items-center justify-center h-screen p-10 text-center bg-white animate-in zoom-in duration-300">
//             <div className="bg-green-100 p-8 rounded-full mb-6">
//                 <PartyPopper size={64} className="text-green-600" />
//             </div>
//             <h1 className="text-3xl font-black text-slate-900 mb-2">Feedback Received!</h1>
//             <p className="text-slate-500 mb-12 text-sm leading-relaxed">Thank you for helping us improve the food quality at IIITG.</p>
//             <button 
//                 onClick={() => setShowSuccess(false)}
//                 className="flex items-center gap-2 text-slate-400 font-bold hover:text-slate-900 transition uppercase text-[10px] tracking-[0.2em]"
//             >
//                 <LayoutDashboard size={18} /> Back to Dashboard
//             </button>
//         </div>
//     );
//   }

//   return (
//     <div className="p-4 max-w-md mx-auto pb-20">
//       <header className={`mt-6 mb-8 p-6 rounded-[32px] transition-all border-b-4 ${isSpecial ? 'bg-indigo-950 text-white border-yellow-500 shadow-2xl' : 'bg-white border-slate-100 shadow-sm'}`}>
//         <div className="flex justify-between items-start mb-4">
//           <div>
//             <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isSpecial ? 'text-indigo-300' : 'text-slate-400'}`}>Logged in as</p>
//             <h1 className="text-2xl font-black leading-tight">
//                 {user.displayName.split(' ')[0]}
//                 {user.role !== 'user' && (
//                     <span className="ml-2 text-[9px] bg-indigo-600 text-white px-2 py-0.5 rounded-full align-middle uppercase tracking-tighter shadow-sm">Staff</span>
//                 )}
//             </h1>
//           </div>
//           <div className={`${isSpecial ? 'bg-yellow-500 text-indigo-950' : 'bg-orange-50 text-orange-600'} px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest`}>{dayName}</div>
//         </div>
//         <div className={`flex items-center gap-2 p-2 rounded-2xl border ${isSpecial ? 'bg-white/10 border-white/10' : 'bg-slate-50 border-slate-50'}`}>
//           <Calendar className={isSpecial ? 'text-indigo-300' : 'text-slate-400'} size={18} />
//           <input type="date" value={viewDate} onChange={(e) => setViewDate(e.target.value)} className="flex-1 bg-transparent font-bold outline-none text-sm" />
//         </div>
//       </header>

//       <div className="flex gap-1 bg-slate-100 p-1.5 rounded-2xl mb-8">
//         {MEAL_TYPES.map(t => (
//           <button key={t} onClick={() => setMealType(t)} className={`flex-1 py-2.5 text-[9px] font-black uppercase rounded-xl transition ${mealType === t ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-400'}`}>
//             {t}
//           </button>
//         ))}
//       </div>

//       {isToday && (
//         <section className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 mb-8">
//           {!attendance ? (
//             <div className="flex gap-3">
//               <button onClick={() => markAttendance('eating')} className="flex-1 bg-green-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-green-100 active:scale-95 transition">I'm Eating</button>
//               <button onClick={() => markAttendance('skipping')} className="flex-1 bg-slate-50 text-slate-400 py-4 rounded-2xl font-bold active:scale-95 transition">Skip</button>
//             </div>
//           ) : (
//             <div className="text-center">
//               <p className={`font-black text-lg flex items-center justify-center gap-2 ${attendance === 'eating' ? 'text-green-600' : 'text-slate-400'}`}>
//                 {attendance === 'eating' ? "🍽️ Enjoy your meal!" : "⏩ Meal Skipped"}
//               </p>
//               <button onClick={() => setAttendance(null)} className="text-[10px] font-black uppercase text-slate-300 tracking-widest mt-2 underline">Change status</button>
//             </div>
//           )}
//         </section>
//       )}

//       <section className="pb-10">
//         <div className="flex justify-between items-center mb-5 px-1">
//             <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
//                 Rate Menu Items
//             </h2>
//             {menuItems.length > 0 && (
//                 <span className="text-[9px] font-black text-orange-600 bg-orange-100/50 px-2 py-1 rounded-lg uppercase">
//                     {validRatedCount} / {menuItems.length} Rated
//                 </span>
//             )}
//         </div>
        
//         {menuLoading ? (
//             <p className="text-center py-10 text-slate-200 font-bold uppercase tracking-widest text-[10px]">Updating...</p>
//         ) : menuItems.length > 0 ? (
//           menuItems.map(item => (
//             <RatingCard key={item.id} itemId={item.id} itemName={item.name} mealId={mealId} userId={user.uid} canRate={isToday && attendance === 'eating'} isSpecial={isSpecial} />
//           ))
//         ) : (
//           <div className="p-12 border-2 border-dashed border-slate-100 rounded-[32px] text-center text-slate-300 font-bold uppercase tracking-widest text-[10px]">No menu found</div>
//         )}
//       </section>
      
//       {/* Logout button for regular users who don't have the navbar */}
//       {user.role === 'user' && (
//         <button onClick={() => logout()} className="w-full py-4 text-slate-300 font-black uppercase tracking-[0.2em] text-[10px] hover:text-red-500 transition-colors">
//             Sign Out
//         </button>
//       )}
//     </div>
//   );
// }

"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, getMealID, MEAL_TYPES, MealType } from '../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp, onSnapshot, collection, query, where } from 'firebase/firestore';
import RatingCard from '../components/RatingCard';
import { LogIn, UtensilsCrossed, Calendar, PartyPopper, LayoutDashboard, ShieldAlert, Loader2 } from 'lucide-react';
import { loginWithGoogle, logout } from '../lib/auth-helpers';

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const todayStr = new Date().toISOString().split('T')[0];
  
  const [viewDate, setViewDate] = useState(todayStr);
  const [attendance, setAttendance] = useState<'eating' | 'skipping' | null>(null);
  const [mealType, setMealType] = useState<MealType>('Lunch');
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [ratedIds, setRatedIds] = useState<string[]>([]);
  const [isSpecial, setIsSpecial] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [menuLoading, setMenuLoading] = useState(true);

  const mealId = getMealID(viewDate, mealType);
  const isToday = viewDate === todayStr;
  const dayName = new Date(viewDate).toLocaleDateString('en-US', { weekday: 'long' });

  // Safety check for user and domain
  const userEmail = user?.email || "";
  const isIIITG = userEmail.endsWith('@iiitg.ac.in');
  const userFirstName = user?.displayName ? user.displayName.split(' ')[0] : 'Student';

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 10) setMealType('Breakfast');
    else if (hour < 15) setMealType('Lunch');
    else if (hour < 21) setMealType('Dinner');
    else setMealType('Night Canteen');
  }, []);

  useEffect(() => {
    if (!user || !isIIITG) return;
    setMenuLoading(true);
    setShowSuccess(false);

    // Get Attendance
    getDoc(doc(db, "attendance", `${user.uid}_${mealId}`)).then(snap => {
      setAttendance(snap.exists() ? snap.data().status : null);
    });

    // Listen to Menu
    const unsubMenu = onSnapshot(doc(db, "daily_menus", mealId), (doc) => {
      if (doc.exists()) {
        setMenuItems(doc.data().items || []);
        setIsSpecial(doc.data().isSpecial || false);
      } else {
        setMenuItems([]);
        setIsSpecial(false);
      }
      setMenuLoading(false);
    }, (err) => {
        console.error("Menu fetch error:", err);
        setMenuLoading(false);
    });

    // Listen to Ratings
    const q = query(collection(db, "ratings"), where("userId", "==", user.uid), where("mealId", "==", mealId));
    const unsubRatings = onSnapshot(q, (snap) => {
      const ids = snap.docs.map(d => d.data().itemId);
      setRatedIds(ids);
    });

    return () => { unsubMenu(); unsubRatings(); };
  }, [user, mealId, isIIITG]);

  const validRatedCount = menuItems.filter(item => ratedIds.includes(item.id)).length;

  useEffect(() => {
    if (menuItems.length > 0 && validRatedCount === menuItems.length && !showSuccess) {
        const timer = setTimeout(() => setShowSuccess(true), 600);
        return () => clearTimeout(timer);
    }
  }, [validRatedCount, menuItems, showSuccess]);

  const markAttendance = async (status: 'eating' | 'skipping') => {
    if (!user || !isToday) return;
    setAttendance(status);
    await setDoc(doc(db, "attendance", `${user.uid}_${mealId}`), {
      userId: user.uid, mealId, status, timestamp: serverTimestamp()
    });
  };

  // 1. Loading State
  if (authLoading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
            <Loader2 className="animate-spin text-slate-300" size={32} />
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Connecting...</p>
        </div>
    );
  }

  // 2. Not Logged In
  if (!user) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
          <UtensilsCrossed size={64} className="mb-4 text-orange-500" />
          <h1 className="text-3xl font-black mb-8 italic text-slate-800">Mess Meter</h1>
          <button onClick={() => loginWithGoogle()} className="bg-black text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 active:scale-95 transition shadow-xl">
            <LogIn size={20} /> Sign in with @iiitg.ac.in
          </button>
        </div>
    );
  }

  // 3. Wrong Domain
  if (!isIIITG) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-10 text-center">
        <ShieldAlert size={48} className="text-red-500 mb-4" />
        <h1 className="text-xl font-black text-slate-900 uppercase">Official Email Only</h1>
        <p className="text-slate-400 text-sm mt-2 mb-8 italic">You signed in with {userEmail}. Please use your iiitg.ac.in account.</p>
        <button onClick={() => logout()} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest">Logout</button>
      </div>
    );
  }

  // 4. Success Screen
  if (showSuccess && isToday) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] p-10 text-center animate-in fade-in zoom-in duration-300">
            <div className="bg-green-100 p-8 rounded-full mb-6">
                <PartyPopper size={64} className="text-green-600" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-2">Well Done!</h1>
            <p className="text-slate-500 mb-12 text-sm leading-relaxed">Your feedback for {mealType} has been recorded.</p>
            <button onClick={() => setShowSuccess(false)} className="flex items-center gap-2 text-slate-400 font-bold hover:text-slate-900 transition uppercase text-[10px] tracking-[0.2em]">
                <LayoutDashboard size={18} /> View Dashboard
            </button>
        </div>
    );
  }

  // 5. Main Dashboard
  return (
    <div className="p-4 max-w-md mx-auto">
      <header className={`mt-6 mb-8 p-6 rounded-[32px] transition-all border-b-4 ${isSpecial ? 'bg-indigo-950 text-white border-yellow-500 shadow-2xl' : 'bg-white border-slate-100 shadow-sm'}`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isSpecial ? 'text-indigo-300' : 'text-slate-400'}`}>Welcome back,</p>
            <h1 className="text-2xl font-black leading-tight">
                {userFirstName}
                {user.role && user.role !== 'user' && (
                    <span className="ml-2 text-[9px] bg-indigo-600 text-white px-2 py-0.5 rounded-full align-middle uppercase tracking-tighter shadow-sm">Staff</span>
                )}
            </h1>
          </div>
          <div className={`${isSpecial ? 'bg-yellow-500 text-indigo-950' : 'bg-orange-50 text-orange-600'} px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest`}>{dayName}</div>
        </div>
        <div className={`flex items-center gap-2 p-2 rounded-2xl border ${isSpecial ? 'bg-white/10 border-white/10' : 'bg-slate-50 border-slate-50'}`}>
          <Calendar className={isSpecial ? 'text-indigo-300' : 'text-slate-400'} size={18} />
          <input type="date" value={viewDate} onChange={(e) => setViewDate(e.target.value)} className="flex-1 bg-transparent font-bold outline-none text-sm" />
        </div>
      </header>

      <div className="flex gap-1 bg-slate-100 p-1.5 rounded-2xl mb-8">
        {MEAL_TYPES.map(t => (
          <button key={t} onClick={() => setMealType(t)} className={`flex-1 py-2.5 text-[9px] font-black uppercase rounded-xl transition ${mealType === t ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-400'}`}>
            {t}
          </button>
        ))}
      </div>

      {isToday && (
        <section className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 mb-8">
          {!attendance ? (
            <div className="flex gap-3">
              <button onClick={() => markAttendance('eating')} className="flex-1 bg-green-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-green-100 active:scale-95 transition">I'm Eating</button>
              <button onClick={() => markAttendance('skipping')} className="flex-1 bg-slate-50 text-slate-400 py-4 rounded-2xl font-bold active:scale-95 transition">Skip</button>
            </div>
          ) : (
            <div className="text-center">
              <p className={`font-black text-lg flex items-center justify-center gap-2 ${attendance === 'eating' ? 'text-green-600' : 'text-slate-400'}`}>
                {attendance === 'eating' ? "🍽️ Enjoy your meal!" : "⏩ Meal Skipped"}
              </p>
              <button onClick={() => setAttendance(null)} className="text-[10px] font-black uppercase text-slate-300 tracking-widest mt-2 underline">Change status</button>
            </div>
          )}
        </section>
      )}

      <section className="pb-10">
        <div className="flex justify-between items-center mb-5 px-1">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Rate Menu Items</h2>
            {menuItems.length > 0 && (
                <span className="text-[9px] font-black text-orange-600 bg-orange-100/50 px-2 py-1 rounded-lg uppercase">
                    {validRatedCount} / {menuItems.length} Rated
                </span>
            )}
        </div>
        
        {menuLoading ? (
            <p className="text-center py-10 text-slate-200 font-bold uppercase tracking-widest text-[10px]">Updating...</p>
        ) : menuItems.length > 0 ? (
          menuItems.map(item => (
            <RatingCard key={item.id} itemId={item.id} itemName={item.name} mealId={mealId} userId={user.uid} canRate={isToday && attendance === 'eating'} isSpecial={isSpecial} />
          ))
        ) : (
          <div className="p-12 border-2 border-dashed border-slate-100 rounded-[32px] text-center text-slate-300 font-bold uppercase tracking-widest text-[10px]">No menu found</div>
        )}
      </section>
      
      {user.role === 'user' && (
        <button onClick={() => logout()} className="w-full py-4 text-slate-300 font-black uppercase tracking-[0.2em] text-[10px] hover:text-red-500 transition-colors mb-10">
            Sign Out
        </button>
      )}
    </div>
  );
}