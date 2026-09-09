'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Logo } from './Logo';

const links = [
  ['Features', '#features'],
  ['How It Works', '#how'],
  ['Offline First', '#offline'],
] as const;

export function MarketingNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#050c16]/80 backdrop-blur-xl">
      <div className="shell flex h-20 items-center justify-between">
        <Logo />

        <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          {links.map(([label, href]) => (
            <a key={href} href={href} className="hover:text-white">
              {label}
            </a>
          ))}
          <Link href="/hospital/login" className="hover:text-white">
            Hospital Portal
          </Link>
          <Link href="/login" className="hover:text-white">
            Login
          </Link>
          <Link href="/signup" className="btn-primary px-4 py-2.5">
            Get Started
          </Link>
        </nav>

        <button
          className="btn-ghost px-3 py-2 md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-[#071426] md:hidden">
          <div className="shell flex flex-col gap-2 py-4">
            {links.map(([label, href]) => (
              <a
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-slate-300"
              >
                {label}
              </a>
            ))}
            <Link
              href="/hospital/login"
              className="rounded-xl px-3 py-3"
              onClick={() => setOpen(false)}
            >
              Hospital Portal
            </Link>
            <Link
              href="/login"
              className="rounded-xl px-3 py-3"
              onClick={() => setOpen(false)}
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="btn-primary"
              onClick={() => setOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
