"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db, MEAL_TYPES, MealType, getMealID } from '../../lib/firebase';
import { doc, setDoc, getDoc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { Plus, Trash2, Save, Calendar as CalendarIcon, Utensils, LayoutDashboard, ShieldAlert } from 'lucide-react';
import StatsOverview from '../../components/StatsOverview';
import ItemRatingsList from '../../components/ItemRatingsList';

export default function ManagerPage() {
  const { user, loading: authLoading } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [mealType, setMealType] = useState<MealType>('Lunch');
  const [viewMode, setViewMode] = useState<'daily' | 'range'>('daily');
  const [items, setItems] = useState<string[]>(['']);
  const [isSaving, setIsSaving] = useState(false);
  const [bulkApply, setBulkApply] = useState(false);
  const [isSpecial, setIsSpecial] = useState(false);
  const [message, setMessage] = useState("");

  const dayName = new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' });
  const mealId = getMealID(selectedDate, mealType);

  useEffect(() => {
    const loadMenu = async () => {
      if (user?.role !== 'manager' && user?.role !== 'admin') return; 
      const docSnap = await getDoc(doc(db, "daily_menus", mealId));
      if (docSnap.exists()) {
        const data = docSnap.data();
        setItems(data.items.map((i: any) => i.name));
        setIsSpecial(data.isSpecial || false);
      } else {
        setItems(['']);
        setIsSpecial(false);
      }
    };
    loadMenu();
  }, [mealId, user]);

  const saveMenu = async () => {
    setIsSaving(true);
    const formattedItems = items.filter(n => n.trim() !== '').map((n, i) => ({ id: `item_${i}_${Date.now()}`, name: n }));
    try {
      if (bulkApply) {
        const batch = writeBatch(db);
        let current = new Date(selectedDate);
        for (let i = 0; i < 60; i++) {
          if (current.getDay() === new Date(selectedDate).getDay()) {
            const dStr = current.toISOString().split('T')[0];
            batch.set(doc(db, "daily_menus", getMealID(dStr, mealType)), { id: getMealID(dStr, mealType), date: dStr, mealType, items: formattedItems, isSpecial, updatedAt: serverTimestamp() });
          }
          current.setDate(current.getDate() + 1);
        }
        await batch.commit();
        setMessage("✅ Bulk Apply Success!");
      } else {
        await setDoc(doc(db, "daily_menus", mealId), { id: mealId, date: selectedDate, mealType, items: formattedItems, isSpecial, updatedAt: serverTimestamp() });
        setMessage("✅ Saved!");
      }
    } catch (e) { setMessage("❌ Error."); }
    setIsSaving(false);
  };

  if (authLoading) return <div className="p-20 text-center font-bold text-slate-300">Verifying...</div>;

  // STRICT CHECK
  if (user?.role !== 'manager' && user?.role !== 'admin') {
    return (
        <div className="flex flex-col items-center justify-center h-screen p-10 text-center">
            <ShieldAlert size={48} className="text-red-500 mb-4" />
            <h1 className="text-xl font-black text-slate-900 uppercase">Manager Access Only</h1>
            <p className="text-slate-400 text-sm mt-2">Access restricted to authorized personnel.</p>
        </div>
    );
  }

  return (
    <div className="p-4 bg-slate-50 min-h-screen pb-24 max-w-md mx-auto">
      <header className="mb-6 mt-4 flex items-center justify-between">
        <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2"><LayoutDashboard className="text-orange-600" /> Planner</h1>
        <span className="text-[10px] font-black text-orange-600 bg-orange-50 px-2 py-1 rounded uppercase tracking-widest">{dayName}</span>
      </header>

      <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 mb-6">
        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full p-3 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 outline-none mb-4" />
        <div className="grid grid-cols-2 gap-2">
          {MEAL_TYPES.map(t => (
            <button key={t} onClick={() => setMealType(t)} className={`py-3 rounded-xl text-[9px] font-black uppercase transition-all ${mealType === t ? 'bg-orange-600 text-white shadow-lg shadow-orange-100' : 'bg-slate-50 text-slate-400'}`}>{t}</button>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center mb-4 px-1">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Analysis</h2>
          <div className="flex bg-slate-200 rounded-lg p-1">
                <button onClick={() => setViewMode('daily')} className={`px-3 py-1 rounded-md text-[8px] font-black uppercase transition-all ${viewMode === 'daily' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>Today</button>
                <button onClick={() => setViewMode('range')} className={`px-3 py-1 rounded-md text-[8px] font-black uppercase transition-all ${viewMode === 'range' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>Monthly</button>
          </div>
      </div>

      <StatsOverview mealId={mealId} viewMode={viewMode} type={mealType} />
      <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-8 mb-4 px-1">Dish Satisfaction</h2>
      <ItemRatingsList mealId={mealId} viewMode={viewMode} type={mealType} />

      <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 mt-8">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2"><Utensils size={14} /> Plan Menu</h3>
        {items.map((item, index) => (
          <div key={index} className="flex gap-2 mb-3">
            <input value={item} onChange={(e) => { const n = [...items]; n[index] = e.target.value; setItems(n); }} placeholder="Dish name..." className="flex-1 p-3 bg-slate-50 rounded-2xl border-none font-bold text-slate-700 outline-none" />
            <button onClick={() => setItems(items.filter((_, i) => i !== index))} className="p-3 text-slate-200 hover:text-red-500"><Trash2 size={20}/></button>
          </div>
        ))}
        <button onClick={() => setItems([...items, ''])} className="w-full py-3 border-2 border-dashed border-slate-100 rounded-2xl text-slate-400 text-[10px] font-black hover:bg-slate-50 transition mb-6 uppercase tracking-widest">+ Add Item</button>
        <div className="space-y-3 pt-4 border-t border-slate-50">
            <label className="flex items-center gap-3 p-4 bg-orange-50 rounded-2xl border border-orange-100 cursor-pointer"><input type="checkbox" checked={bulkApply} onChange={(e) => setBulkApply(e.target.checked)} className="w-5 h-5 accent-orange-600" /><div><p className="text-xs font-black text-orange-900">Apply to all {dayName}s</p></div></label>
            <label className="flex items-center gap-3 p-4 bg-indigo-50 rounded-2xl border border-indigo-100 cursor-pointer"><input type="checkbox" checked={isSpecial} onChange={(e) => setIsSpecial(e.target.checked)} className="w-5 h-5 accent-indigo-600" /><div><p className="text-xs font-black text-indigo-900">Special Feast Mode</p></div></label>
        </div>
        <div className="mt-6">
            {message && <p className="text-center text-[10px] font-black mb-4 text-green-600 bg-green-50 py-3 rounded-xl border border-green-100 uppercase tracking-widest">{message}</p>}
            <button onClick={saveMenu} disabled={isSaving} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition">{isSaving ? "Processing..." : bulkApply ? "Apply to Month" : "Save Only Today"}</button>
        </div>
      </div>
    </div>
  );
}