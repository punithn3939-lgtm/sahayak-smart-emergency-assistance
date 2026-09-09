'use client';
import { X } from 'lucide-react';
export function Toast({message,type='success',onClose}:{message:string;type?:'success'|'error';onClose?:()=>void}){return <div className={`fixed bottom-5 right-5 z-[100] max-w-sm rounded-2xl border px-4 py-3 text-sm shadow-2xl ${type==='error'?'border-red-400/20 bg-red-500/10 text-red-100':'border-blue-400/20 bg-blue-500/10 text-blue-100'}`} role="status"><div className="flex items-center gap-3">{message}<button onClick={onClose} aria-label="Close"><X size={16}/></button></div></div>}
