'use client';

import Link from 'next/link';
import { ArrowRight, HeartPulse, Hospital, LayoutGrid, LogIn, Menu, ShieldCheck, Workflow, X } from 'lucide-react';
import { useState } from 'react';
import { Logo } from './Logo';

const links = [
  ['Features', '#features', LayoutGrid],
  ['How it works', '#how', Workflow],
  ['First aid', '/guides', HeartPulse],
] as const;

export function MarketingNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-cyan-300/10 bg-[#070812]/80 shadow-[0_12px_50px_rgba(0,0,0,.28)] backdrop-blur-2xl">
      <div className="shell flex h-[76px] items-center justify-between gap-4">
        <div className="shrink-0">
          <Logo />
        </div>

        <nav className="hidden items-center gap-1 rounded-2xl border border-cyan-300/10 bg-white/[0.035] p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,.05),0_8px_30px_rgba(0,0,0,.16)] lg:flex">
          {links.map(([label, href, Icon]) => href.startsWith('#') ? (
            <a
              key={href}
              href={href}
              className="group flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-semibold text-slate-400 transition-all duration-200 hover:bg-cyan-300/[0.08] hover:text-cyan-100 hover:shadow-[0_0_18px_rgba(92,246,255,.08)]"
            >
              <Icon size={15} className="text-slate-500 transition-colors group-hover:text-cyan-300" />
              {label}
            </a>
          ) : (
            <Link
              key={href}
              href={href}
              className="group flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-semibold text-slate-400 transition-all duration-200 hover:bg-cyan-300/[0.08] hover:text-cyan-100 hover:shadow-[0_0_18px_rgba(92,246,255,.08)]"
            >
              <Icon size={15} className="text-slate-500 transition-colors group-hover:text-cyan-300" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href="/hospital/login"
            className="group flex items-center gap-2 rounded-xl border border-cyan-300/10 bg-white/[0.025] px-3.5 py-2.5 text-[12px] font-bold text-slate-400 transition-all hover:border-cyan-300/25 hover:bg-cyan-300/[0.06] hover:text-cyan-100"
          >
            <Hospital size={15} className="text-cyan-300/70 transition group-hover:text-cyan-300" />
            Hospital
          </Link>
          <Link
            href="/admin/login"
            className="group flex items-center gap-2 rounded-xl border border-violet-300/10 bg-white/[0.025] px-3.5 py-2.5 text-[12px] font-bold text-slate-400 transition-all hover:border-violet-300/25 hover:bg-violet-300/[0.06] hover:text-violet-100"
          >
            <ShieldCheck size={15} className="text-violet-300/70 transition group-hover:text-violet-300" />
            Admin
          </Link>
          <Link
            href="/login"
            className="group flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-[12px] font-bold text-slate-400 transition-all hover:bg-white/[0.05] hover:text-white"
          >
            <LogIn size={15} className="text-slate-500 transition group-hover:text-cyan-300" />
            Login
          </Link>
          <Link
            href="/signup"
            className="group relative ml-1 inline-flex items-center gap-2 overflow-hidden rounded-xl border border-cyan-200/40 bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 px-4 py-2.5 text-[12px] font-black text-white shadow-[0_0_24px_rgba(92,246,255,.18)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_34px_rgba(92,246,255,.32)] active:translate-y-0"
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <span className="relative">Get Started</span>
            <ArrowRight size={15} className="relative transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <button
          className="btn-ghost px-3 py-2 lg:hidden"
          onClick={() => setOpen(value => !value)}
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-cyan-300/10 bg-[#080a14]/98 shadow-[0_20px_50px_rgba(0,0,0,.35)] backdrop-blur-2xl lg:hidden">
          <div className="shell grid gap-2 py-4 sm:grid-cols-2">
            {links.map(([label, href, Icon]) => href.startsWith('#') ? (
              <a key={href} href={href} onClick={() => setOpen(false)} className="group flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.025] px-4 py-3.5 text-sm font-semibold text-slate-300 transition hover:border-cyan-300/20 hover:bg-cyan-300/[0.06] hover:text-cyan-100">
                <Icon size={17} className="text-cyan-300/70" />{label}
              </a>
            ) : (
              <Link key={href} href={href} onClick={() => setOpen(false)} className="group flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.025] px-4 py-3.5 text-sm font-semibold text-slate-300 transition hover:border-cyan-300/20 hover:bg-cyan-300/[0.06] hover:text-cyan-100">
                <Icon size={17} className="text-cyan-300/70" />{label}
              </Link>
            ))}
            <Link href="/hospital/login" className="flex items-center gap-3 rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.04] px-4 py-3.5 text-sm font-semibold text-slate-300 transition hover:border-cyan-300/25 hover:bg-cyan-300/[0.08] hover:text-cyan-100" onClick={() => setOpen(false)}>
              <Hospital size={17} className="text-cyan-300" />Hospital Portal
            </Link>
            <Link href="/admin/login" className="flex items-center gap-3 rounded-2xl border border-violet-300/10 bg-violet-300/[0.04] px-4 py-3.5 text-sm font-semibold text-slate-300 transition hover:border-violet-300/25 hover:bg-violet-300/[0.08] hover:text-violet-100" onClick={() => setOpen(false)}>
              <ShieldCheck size={17} className="text-violet-300" />Admin Console
            </Link>
            <Link href="/login" className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.025] px-4 py-3.5 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.06] hover:text-white" onClick={() => setOpen(false)}>
              <LogIn size={17} className="text-slate-400" />Login
            </Link>
            <Link href="/signup" className="btn-primary sm:col-span-2" onClick={() => setOpen(false)}>
              Get Started <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
