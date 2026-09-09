'use client';
import { FormEvent, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, ShieldCheck, Building2 } from 'lucide-react';
import { Logo } from './Logo';

export function AuthForm({mode}:{mode:'login'|'signup'|'forgot'|'reset'}){
 const router=useRouter();
 const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [name,setName]=useState('');
 const [error,setError]=useState(''); const [loading,setLoading]=useState(false); const [message,setMessage]=useState('');
 const submit=async(e:FormEvent)=>{e.preventDefault();setLoading(true);setError('');setMessage('');const supabase=createClient();
  if(mode==='forgot'){const {error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:`${location.origin}/auth/callback?next=/reset-password`}); if(error)setError(error.message); else setMessage('Password reset instructions sent. Check your email.'); setLoading(false); return;}
  if(mode==='reset'){const {error}=await supabase.auth.updateUser({password}); if(error)setError(error.message); else {setMessage('Password updated. You can now log in.'); setTimeout(()=>router.push('/login'),900);} setLoading(false); return;}
  if(mode==='signup'){const {data,error}=await supabase.auth.signUp({email,password,options:{data:{full_name:name},emailRedirectTo:`${location.origin}/auth/callback?next=/dashboard`}}); if(error)setError(error.message); else {if(data.session) router.push('/dashboard'); else setMessage('Account created. Check your email to confirm your account.');} }
  else {
   const {data,error}=await supabase.auth.signInWithPassword({email,password});
   if(error)setError(error.message);
   else {
    const {data:profile}=await supabase.from('profiles').select('role').eq('id',data.user.id).maybeSingle();
    if(profile?.role==='hospital_staff') router.push('/hospital');
    else router.push('/dashboard');
    router.refresh();
   }
  }
  setLoading(false);
 };
 const title=mode==='login'?'Welcome back':mode==='signup'?'Create your safety account':mode==='forgot'?'Reset your password':'Choose a new password';
 return <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(47,128,237,.14),transparent_40%)] px-5 py-10"><div className="mx-auto max-w-md"><Logo/><div className="card mt-10 p-7 sm:p-9"><div className="mb-7"><div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-blue/10 text-blue"><ShieldCheck/></div><h1 className="text-2xl font-black">{title}</h1><p className="mt-2 text-sm text-slate-400">One secure Sahayak login for users and verified hospital staff.</p></div><form onSubmit={submit} className="space-y-4">{mode==='signup'&&<div><label className="label">Full name</label><input className="field" value={name} onChange={e=>setName(e.target.value)} required /></div>} {mode!=='reset'&&<div><label className="label">Email</label><input className="field" type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></div>} {mode!=='forgot'&&<div><label className="label">{mode==='reset'?'New password':'Password'}</label><input className="field" type="password" minLength={6} value={password} onChange={e=>setPassword(e.target.value)} required /></div>}<button className="btn-primary w-full" disabled={loading}>{loading?<Loader2 className="animate-spin" size={18}/>:null}{mode==='login'?'Login':mode==='signup'?'Create account':mode==='forgot'?'Send reset link':'Update password'}</button></form>{mode==='login'&&<div className="mt-5 flex items-center gap-3 rounded-2xl bg-blue/5 p-4 text-sm text-slate-400"><Building2 size={18} className="text-blue"/><span><b className="text-slate-200">Hospital staff?</b> Use the same login. Verified hospital accounts automatically open the Hospital Command Center.</span></div>}{error&&<p className="mt-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}{message&&<p className="mt-4 rounded-xl bg-blue-500/10 p-3 text-sm text-blue-200">{message}</p>}<div className="mt-6 text-center text-sm text-slate-400">{mode==='login'?<><Link className="text-blue hover:underline" href="/forgot-password">Forgot password?</Link><span className="mx-2">·</span><Link className="text-blue hover:underline" href="/signup">Create account</Link></>:mode==='signup'?<Link className="text-blue hover:underline" href="/login">Already have an account? Login</Link>:<Link className="text-blue hover:underline" href="/login">Back to login</Link>}</div></div></div></main> }
