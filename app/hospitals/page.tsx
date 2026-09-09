import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import HospitalsClient from './HospitalsClient';
export default async function Page(){
 const supabase=await createClient(); const {data:{user}}=await supabase.auth.getUser(); if(!user) redirect('/login');
 const [{data:hospitals},{data:medical}]=await Promise.all([
  supabase.from('hospitals').select('id,name,address,phone,latitude,longitude,available,emergency_available,ambulance_available,icu_beds_available,general_beds_available,specialties,estimated_charge_low,estimated_charge_high,rating,last_capacity_update,blood_bank_available,pharmacy_24x7,diagnostics_24x7,cashless_insurance,estimated_wait_minutes,online,last_online_at').order('rating',{ascending:false}),
  supabase.from('medical_ids').select('blood_group,allergies,medical_conditions').eq('user_id',user.id).maybeSingle()
 ]);
 return <HospitalsClient hospitals={hospitals||[]} medical={medical||null}/>;
}
