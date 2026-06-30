"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { Home, LayoutDashboard, ShieldCheck, LogOut } from 'lucide-react';
import { logout } from '../lib/auth-helpers';

export default function Navbar() {
  const { user } = useAuth();
  const pathname = usePathname();

  if (!user || user.role === 'user') return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-3 flex justify-around items-center z-50 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
      <Link href="/" className={`flex flex-col items-center gap-1 ${pathname === '/' ? 'text-orange-600' : 'text-slate-400'}`}>
        <Home size={20} />
        <span className="text-[10px] font-black uppercase tracking-widest">Home</span>
      </Link>

      {/* ONLY Manager sees Manager Tab */}
      {user.role === 'manager' && (
        <Link href="/manager" className={`flex flex-col items-center gap-1 ${pathname === '/manager' ? 'text-orange-600' : 'text-slate-400'}`}>
          <LayoutDashboard size={20} />
          <span className="text-[10px] font-black uppercase tracking-widest">Manager</span>
        </Link>
      )}

      {/* ONLY Admin sees Admin Tab */}
      {user.role === 'admin' && (
        <Link href="/admin" className={`flex flex-col items-center gap-1 ${pathname === '/admin' ? 'text-orange-600' : 'text-slate-400'}`}>
          <ShieldCheck size={20} />
          <span className="text-[10px] font-black uppercase tracking-widest">Admin</span>
        </Link>
      )}

      <button onClick={() => logout()} className="flex flex-col items-center gap-1 text-slate-300">
        <LogOut size={20} />
        <span className="text-[10px] font-black uppercase tracking-widest">Exit</span>
      </button>
    </nav>
  );
}