'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function BackButton({ fallback = '/' }: { fallback?: string }) {
  const router = useRouter();

  const goBack = () => {
    if (window.history.length > 1) router.back();
    else router.push(fallback);
  };

  return (
    <button
      type="button"
      onClick={goBack}
      className="btn-ghost inline-flex items-center gap-2 px-3 py-2 text-sm"
      aria-label="Go back"
    >
      <ArrowLeft size={16} />
      <span>Back</span>
    </button>
  );
}
