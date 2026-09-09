import { createClient } from '@/lib/supabase/server'; import { redirect } from 'next/navigation'; import MedicalClient from './MedicalClient';
export default async function Page(){const s=await createClient();const {data:{user}}=await s.auth.getUser();if(!user)redirect('/login');const {data}=await s.from('medical_ids').select('*').maybeSingle();return <MedicalClient initial={data}/>}
