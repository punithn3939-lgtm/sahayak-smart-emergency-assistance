'use client';
import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { Loader2, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Logo } from './Logo';

export function AdminAuthForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id || '').maybeSingle();
    if (profile?.role === 'admin') {
      router.push('/admin');
    } else {
      await supabase.auth.signOut();
      setError('This account is not an approved Sahayak admin account.');
    }
    setLoading(false);
  };

  return <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(47,128,237,.16),transparent_42%)] px-5 py-10"><div className="mx-auto max-w-lg"><Logo/><div className="card mt-10 p-7 sm:p-9"><div className="mb-7"><div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-blue/10 text-blue"><ShieldCheck/></div><p className="text-xs font-semibold uppercase tracking-[.2em] text-blue">Sahayak administration</p><h1 className="mt-2 text-2xl font-black">Admin login</h1><p className="mt-2 text-sm text-slate-400">Review hospital registrations and control the connected emergency network.</p></div><form onSubmit={submit} className="space-y-4"><div><label className="label">Admin email</label><input className="field" type="email" value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="email"/></div><div><label className="label">Password</label><input className="field" type="password" minLength={6} value={password} onChange={e=>setPassword(e.target.value)} required autoComplete="current-password"/></div><button className="btn-primary w-full" disabled={loading}>{loading?<Loader2 className="animate-spin" size={18}/>:<ShieldCheck size={18}/>} Sign in to admin console</button></form>{error&&<p className="mt-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}<div className="mt-6 flex gap-3 text-sm text-slate-400"><Link className="text-blue hover:underline" href="/login">Normal user login</Link><span>·</span><Link className="text-blue hover:underline" href="/hospital/login">Hospital login</Link></div></div></div></main>;
}
