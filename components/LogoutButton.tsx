'use client';
import { LogOut } from 'lucide-react'; import { createClient } from '@/lib/supabase/client'; import { useRouter } from 'next/navigation';
export function LogoutButton(){const router=useRouter(); return <button className="btn-ghost w-full" onClick={async()=>{await createClient().auth.signOut(); router.push('/'); router.refresh();}}><LogOut size={17}/>Logout</button>}
