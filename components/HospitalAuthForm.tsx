'use client';
import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { Building2, Loader2, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Logo } from './Logo';

export function HospitalAuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const router = useRouter();
  const [email,setEmail]=useState(''); const [password,setPassword]=useState('');
  const [name,setName]=useState(''); const [hospitalName,setHospitalName]=useState('');
  const [phone,setPhone]=useState(''); const [registrationNumber,setRegistrationNumber]=useState(''); const [address,setAddress]=useState('');
  const [error,setError]=useState(''); const [message,setMessage]=useState(''); const [loading,setLoading]=useState(false); const [cooldown,setCooldown]=useState(0);

  useEffect(()=>{
    if(cooldown<=0)return;
    const timer=window.setInterval(()=>setCooldown(value=>Math.max(0,value-1)),1000);
    return()=>window.clearInterval(timer);
  },[cooldown]);

  const submit=async(e:FormEvent)=>{
    e.preventDefault();
    if(loading||cooldown>0)return;
    setLoading(true); setError(''); setMessage(''); const supabase=createClient();
    if(mode==='signup'){
      const {data,error}=await supabase.auth.signUp({email,password,options:{data:{account_type:'hospital',full_name:name,hospital_name:hospitalName,phone,registration_number:registrationNumber,address},emailRedirectTo:`${location.origin}/auth/callback?next=/hospital`}});
      if(error){
        const text=error.message||'';
        if(/security purposes|after 10 seconds|rate limit|too many requests/i.test(text)){
          setCooldown(10);
          setError('Please wait 10 seconds before trying hospital registration again. This is Supabase email-signup protection, not a problem with your form.');
        }else setError(text);
      } else {
        setCooldown(10);
        if(data.session) setMessage('Application submitted. Your hospital account is awaiting verification.');
        else setMessage('Application submitted. Confirm your email, then wait for hospital verification before signing in.');
      }
    } else {
      const {error}=await supabase.auth.signInWithPassword({email,password});
      if(error) setError(error.message); else { const user=(await supabase.auth.getUser()).data.user; const {data:profile}=await supabase.from('profiles').select('role,hospital_id').eq('id',user?.id||'').maybeSingle(); if(profile?.role==='hospital_staff'&&profile.hospital_id) router.push('/hospital'); else { await supabase.auth.signOut(); setError('This account is not an approved hospital staff account yet.'); } }
    }
    setLoading(false);
  };

  const buttonDisabled=loading||cooldown>0;
  return <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(47,128,237,.16),transparent_42%)] px-5 py-10"><div className="mx-auto max-w-lg"><Logo/><div className="card mt-10 p-7 sm:p-9"><div className="mb-7"><div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-blue/10 text-blue"><Building2/></div><p className="text-xs font-semibold uppercase tracking-[.2em] text-blue">Hospital network</p><h1 className="mt-2 text-2xl font-black">{mode==='login'?'Hospital staff login':'Hospital registration'}</h1><p className="mt-2 text-sm text-slate-400">Secure access to Sahayak emergency cases, availability and response tools.</p></div><form onSubmit={submit} className="space-y-4">
    {mode==='signup'&&<><div><label className="label">Staff full name</label><input className="field" value={name} onChange={e=>setName(e.target.value)} required/></div><div><label className="label">Hospital name</label><input className="field" value={hospitalName} onChange={e=>setHospitalName(e.target.value)} required/></div><div className="grid gap-4 sm:grid-cols-2"><div><label className="label">Contact phone</label><input className="field" value={phone} onChange={e=>setPhone(e.target.value)}/></div><div><label className="label">Registration / license ID</label><input className="field" value={registrationNumber} onChange={e=>setRegistrationNumber(e.target.value)}/></div></div><div><label className="label">Hospital address</label><textarea className="field min-h-24" value={address} onChange={e=>setAddress(e.target.value)} required/></div></>}
    <div><label className="label">Work email</label><input className="field" type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></div><div><label className="label">Password</label><input className="field" type="password" minLength={6} value={password} onChange={e=>setPassword(e.target.value)} required/></div><button className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60" disabled={buttonDisabled}>{loading?<Loader2 className="animate-spin" size={18}/>:<ShieldCheck size={18}/>} {mode==='login'?'Sign in to hospital portal':cooldown>0?`Please wait ${cooldown}s`:'Submit hospital application'}</button></form>{error&&<p className="mt-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}{message&&<p className="mt-4 rounded-xl bg-emerald-500/10 p-3 text-sm text-emerald-200">{message}</p>}<div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-400">{mode==='login'?<Link className="text-blue hover:underline" href="/hospital/signup">Register a hospital</Link>:<Link className="text-blue hover:underline" href="/hospital/login">Already registered? Hospital login</Link>}<span>·</span><Link className="text-blue hover:underline" href="/login">Normal user login</Link></div></div></div></main>;
}
