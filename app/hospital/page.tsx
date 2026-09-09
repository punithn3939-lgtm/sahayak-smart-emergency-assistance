import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import HospitalClient from './HospitalClient';

export default async function HospitalPage(){
  const s=await createClient();
  const {data:{user}}=await s.auth.getUser();
  if(!user) redirect('/login');
  const {data:profile}=await s.from('profiles').select('role,hospital_id').eq('id',user.id).single();
  return <HospitalClient userId={user.id} role={profile?.role||'user'} hospitalId={profile?.hospital_id||null}/>;
}
