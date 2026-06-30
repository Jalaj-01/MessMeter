"use client";
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MEAL_TYPES, MealType, getMealID } from '../../lib/firebase';
import StatsOverview from '../../components/StatsOverview';
import ItemRatingsList from '../../components/ItemRatingsList';
import { ShieldCheck, Calendar, PieChart, Activity, Utensils, Lock } from 'lucide-react';

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<MealType>('Lunch');
  const [viewMode, setViewMode] = useState<'daily' | 'range'>('daily');

  const mealId = getMealID(date, type);
  const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });

  if (authLoading) return <div className="p-20 text-center font-bold text-slate-300">Verifying...</div>;

  // STRICT CHECK: ONLY Admin
  if (user?.role !== 'admin') {
    return (
        <div className="flex flex-col items-center justify-center h-screen p-10 text-center">
            <Lock size={48} className="text-indigo-900 mb-4" />
            <h1 className="text-xl font-black text-indigo-950 uppercase">Admin Portal Locked</h1>
            <p className="text-slate-400 text-sm mt-2">Managers and Students cannot access the Audit dashboard.</p>
        </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen pb-24 max-w-md mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-black flex items-center gap-2 text-indigo-950"><ShieldCheck className="text-indigo-600" /> Admin</h1>
        <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] font-black bg-indigo-100 text-indigo-700 px-2 py-1 rounded uppercase tracking-widest">Audit Mode</span>
            <span className="text-[10px] font-black bg-slate-200 text-slate-600 px-2 py-1 rounded uppercase tracking-widest">{dayName}</span>
        </div>
      </header>

      <div className="bg-indigo-900 p-6 rounded-[32px] text-white mb-8 shadow-xl">
        <div className="flex justify-between items-center mb-4">
            <label className="text-[10px] font-black opacity-50 uppercase block tracking-widest">Audit Target</label>
            <div className="flex bg-indigo-800 rounded-lg p-1">
                <button onClick={() => setViewMode('daily')} className={`px-3 py-1 rounded-md text-[9px] font-black uppercase transition-all ${viewMode === 'daily' ? 'bg-white text-indigo-900' : 'text-indigo-400'}`}>Daily</button>
                <button onClick={() => setViewMode('range')} className={`px-3 py-1 rounded-md text-[9px] font-black uppercase transition-all ${viewMode === 'range' ? 'bg-white text-indigo-900' : 'text-indigo-400'}`}>Monthly</button>
            </div>
        </div>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-indigo-800 border-none rounded-2xl p-3 text-sm font-black outline-none mb-3 text-white" />
        <div className="grid grid-cols-2 gap-2">
            {MEAL_TYPES.map(t => <button key={t} onClick={() => setType(t)} className={`py-2 rounded-xl text-[9px] font-black uppercase transition-all ${type === t ? 'bg-white text-indigo-900' : 'bg-indigo-800 text-indigo-300'}`}>{t}</button>)}
        </div>
      </div>

      <section>
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 px-1 flex items-center gap-2"><Activity size={14} /> Participation Metrics</h2>
        <StatsOverview mealId={mealId} viewMode={viewMode} type={type} />
      </section>

      <section className="mt-8">
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 px-1 flex items-center gap-2"><Utensils size={14} /> Item Breakdown</h2>
        <ItemRatingsList mealId={mealId} viewMode={viewMode} type={type} />
      </section>

      <section className="mt-8 bg-indigo-600 p-6 rounded-[32px] text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3 font-black italic text-sm"><PieChart size={20} /> SMART INSIGHT</div>
          <p className="text-indigo-100 text-xs leading-relaxed font-medium">
            {viewMode === 'range' 
                ? `Auditing ${type} trends from 1st to ${date}.` 
                : `Audit data for ${dayName}'s ${type} is live.`} 
            Use this for vendor quality reports.
          </p>
      </section>
    </div>
  );
}