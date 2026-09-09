import Image from 'next/image';
import Link from 'next/link';
export function Logo({compact=false}:{compact?:boolean}){
 return <Link href="/" className="flex items-center gap-3" aria-label="Sahayak home">
   <Image src="/sahayak-logo.jpeg" alt="Sahayak — Smart Emergency Assistance" width={compact?42:58} height={compact?42:58} className="rounded-xl object-contain" />
   {!compact && <span className="hidden sm:block text-lg font-black tracking-tight">Sahayak</span>}
 </Link>
}
