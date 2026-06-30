"use client";
import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { Users, TrendingUp, Trash2, MessageSquare, CalendarRange } from 'lucide-react';

interface StatsProps {
  mealId: string;
  viewMode?: 'daily' | 'range';
  type: string;
}

export default function StatsOverview({ mealId, viewMode = 'daily', type }: StatsProps) {
  const [stats, setStats] = useState({ eating: 0, skipping: 0, satisfaction: 0, totalRatings: 0 });

  useEffect(() => {
    if (!mealId) return;

    let qAtt, qRate;
    
    if (viewMode === 'range') {
        const [datePart] = mealId.split('_');
        const [year, month] = datePart.split('-');
        const startOfMonthId = `${year}-${month}-01_${type.toLowerCase().replace(" ", "_")}`;
        
        qAtt = query(collection(db, "attendance"), 
            where("mealId", ">=", startOfMonthId), 
            where("mealId", "<=", mealId)
        );
        qRate = query(collection(db, "ratings"), 
            where("mealId", ">=", startOfMonthId), 
            where("mealId", "<=", mealId)
        );
    } else {
        qAtt = query(collection(db, "attendance"), where("mealId", "==", mealId));
        qRate = query(collection(db, "ratings"), where("mealId", "==", mealId));
    }

    const unsubAtt = onSnapshot(qAtt, (snap) => {
      const docs = snap.docs.map(d => d.data());
      setStats(prev => ({ ...prev, eating: docs.filter(d => d.status === 'eating').length, skipping: docs.filter(d => d.status === 'skipping').length }));
    });

    const unsubRate = onSnapshot(qRate, (snap) => {
      const docs = snap.docs.map(d => d.data());
      const likes = docs.filter(d => d.liked === true).length;
      setStats(prev => ({ ...prev, totalRatings: docs.length, satisfaction: docs.length > 0 ? Math.round((likes / docs.length) * 100) : 0 }));
    });

    return () => { unsubAtt(); unsubRate(); };
  }, [mealId, viewMode, type]);

  return (
    <div>
      {viewMode === 'range' && (
        <div className="flex items-center gap-2 mb-3 px-1 text-indigo-600">
            <CalendarRange size={12} />
            <span className="text-[9px] font-black uppercase tracking-widest">Showing Monthly Aggregate</span>
        </div>
      )}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard icon={<Users size={16} className="text-indigo-500"/>} val={stats.eating} label="Eating" />
        <StatCard icon={<TrendingUp size={16} className="text-green-500"/>} val={`${stats.satisfaction}%`} label="Satisfaction" />
        <StatCard icon={<Trash2 size={16} className="text-slate-300"/>} val={stats.skipping} label="Skipped" />
        <StatCard icon={<MessageSquare size={16} className="text-orange-400"/>} val={stats.totalRatings} label="Feedbacks" />
      </div>
    </div>
  );
}

function StatCard({ icon, val, label }: any) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
      {icon} <p className="text-xl font-black mt-1">{val}</p> <p className="text-[9px] font-black text-slate-400 uppercase">{label}</p>
    </div>
  );
}