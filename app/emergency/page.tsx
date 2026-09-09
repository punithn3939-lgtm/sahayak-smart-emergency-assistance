import { createClient } from '@/lib/supabase/server'; import { redirect } from 'next/navigation'; import EmergencyClient from './EmergencyClient';
export default async function Page(){const s=await createClient();const {data:{user}}=await s.auth.getUser();return <EmergencyClient userId={user?.id||null}/>}
