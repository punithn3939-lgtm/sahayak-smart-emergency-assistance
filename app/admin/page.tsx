import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import AdminClient from './AdminClient';

export default async function AdminPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
  if (profile?.role !== 'admin') redirect('/admin/login');
  return <AdminClient adminEmail={user.email || ''} />;
}
