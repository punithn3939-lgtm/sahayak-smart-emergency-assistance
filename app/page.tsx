import Link from 'next/link';
import { ArrowRight, Ambulance, BellRing, BookOpen, CheckCircle2, HeartPulse, Hospital, LocateFixed, MapPin, Phone, PhoneCall, Siren, TriangleAlert, UsersRound } from 'lucide-react';
import { MarketingNav } from '@/components/MarketingNav';
import { FeatureCard } from '@/components/FeatureCard';

const features = [
  ['One-Tap SOS', Siren, 'Start a clear, confirmed emergency flow and share the information responders need.'],
  ['Connected Hospital Network', Hospital, 'Route confirmed SOS cases to an onboarded hospital that is currently online and emergency-ready.'],
  ['Smart Hospital Finder', LocateFixed, 'Find connected hospitals by live status, distance, beds, ambulance, services and rating.'],
  ['Live Location Sharing', MapPin, 'Share your current location through your device using a simple map link.'],
  ['Emergency Contacts', UsersRound, 'Keep trusted people ready so help can reach the right people quickly.'],
  ['Medical ID', HeartPulse, 'Keep blood group, allergies and important conditions ready for an emergency.'],
  ['Live Hospital Capacity', BellRing, 'Connected hospital staff can update beds, ambulance and emergency readiness.'],
  ['First Aid Guides', BookOpen, 'Use simple step-by-step guidance for common emergencies while professional help is being arranged.'],
  ['Cost & Wait Guidance', Phone, 'See hospital-provided indicative cost and wait information with clear uncertainty labels.'],
];

const quickActions = [
  ['Emergency SOS', 'Need help now', '/emergency', Siren, 'btn-danger'],
  ['Find a Hospital', 'See connected hospitals', '/hospitals', Hospital, 'btn-primary'],
  ['First Aid', 'What should I do?', '/guides', BookOpen, 'btn-ghost'],
  ['Emergency Number', 'India: 112', 'tel:112', PhoneCall, 'btn-ghost'],
] as const;

export default function Home() {
  return <div className="min-h-screen overflow-hidden">
    <MarketingNav />
    <main>
      <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(47,128,237,.18),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(239,51,64,.09),transparent_25%)]" />
        <div className="shell grid items-center gap-10 lg:grid-cols-[1.08fr_.92fr]">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue/20 bg-blue/10 px-4 py-2 text-xs font-semibold text-blue-200"><span className="h-2 w-2 rounded-full bg-blue" /> Emergency support, made simple</div>
            <h1 className="max-w-4xl text-5xl font-black tracking-[-.04em] sm:text-7xl">When something goes wrong,<br /><span className="text-blue">know what to do next.</span></h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">Sahayak brings SOS, trusted contacts, Medical ID, location sharing, first aid and a connected hospital network into one calm, easy-to-understand place.</p>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:max-w-3xl">
              {quickActions.map(([title, sub, href, Icon, style]) => <Link key={title} href={href} className={`${style} flex min-h-24 flex-col items-start justify-between p-4 text-left`}><Icon size={20} /><span><span className="block text-sm font-bold">{title}</span><span className="mt-1 block text-[11px] text-white/60">{sub}</span></span></Link>)}
            </div>
            <p className="mt-4 text-xs text-slate-500">For life-threatening emergencies in India, call 112. Sahayak is a support platform and does not replace emergency services.</p>
          </div>
          <div className="card relative overflow-hidden p-6 shadow-sos">
            <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-emergency/10 blur-3xl" />
            <div className="flex items-center justify-between"><div><p className="text-xs uppercase tracking-[.2em] text-slate-500">Sahayak response</p><p className="mt-1 font-bold">One simple path</p></div><div className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">Ready</div></div>
            <div className="my-7 space-y-3">
              {[['1', 'SOS', 'Confirm the emergency'], ['2', 'Location + Medical ID', 'Give responders useful context'], ['3', 'Trusted contacts', 'Keep people informed'], ['4', 'Connected hospital', 'Route only when a connected hospital is available']].map(([n, title, desc]) => <div key={n} className="glass flex items-center gap-4 rounded-2xl p-4"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue/10 text-sm font-black text-blue">{n}</div><div><p className="font-semibold">{title}</p><p className="text-xs text-slate-500">{desc}</p></div></div>)}
            </div>
            <div className="rounded-2xl border border-amber-300/10 bg-amber-300/5 p-4 text-xs leading-5 text-amber-100/70"><TriangleAlert className="mb-2 text-amber-300" size={18} />If the situation is immediately life-threatening, call 112 first. Use Sahayak to organize information and connected-hospital response.</div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20"><div className="shell"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Link href="/guides" className="card p-5 transition hover:border-blue/30"><BookOpen className="text-blue" /><h3 className="mt-4 font-bold">First Aid Guides</h3><p className="mt-1 text-sm text-slate-500">Bleeding, burns, choking, CPR, seizures and more.</p></Link><Link href="/hospitals" className="card p-5 transition hover:border-blue/30"><Hospital className="text-blue" /><h3 className="mt-4 font-bold">Hospital Finder</h3><p className="mt-1 text-sm text-slate-500">See connected hospitals and current capacity.</p></Link><Link href="/login" className="card p-5 transition hover:border-blue/30"><HeartPulse className="text-blue" /><h3 className="mt-4 font-bold">Medical ID</h3><p className="mt-1 text-sm text-slate-500">Prepare critical health information before an emergency.</p></Link><Link href="/login" className="card p-5 transition hover:border-blue/30"><UsersRound className="text-blue" /><h3 className="mt-4 font-bold">Trusted Contacts</h3><p className="mt-1 text-sm text-slate-500">Keep family or friends ready to receive alerts.</p></Link></div></div></section>

      <section id="features" className="py-20"><div className="shell"><div className="max-w-2xl"><p className="text-sm font-semibold text-blue">EVERYTHING IN ONE PLACE</p><h2 className="mt-3 text-3xl font-black sm:text-5xl">Useful when calm.<br />Powerful when urgent.</h2><p className="mt-4 leading-7 text-slate-400">Every major Sahayak feature is visible from the beginning, so users do not have to hunt through menus during stressful moments.</p></div><div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{features.map(([title, Icon, desc]) => <FeatureCard key={title as string} title={title as string} icon={Icon as any} description={desc as string} />)}</div></div></section>

      <section className="py-20"><div className="shell grid gap-6 lg:grid-cols-2"><div className="card p-7 sm:p-9"><p className="text-sm font-semibold text-red-300">IF THIS IS HAPPENING NOW</p><h2 className="mt-3 text-3xl font-black">Do the safest next thing.</h2><div className="mt-6 space-y-4">{['Move away from immediate danger if you can do so safely.','Call 112 for a life-threatening emergency in India.','Ask someone nearby to help while you stay with the person.','Use the First Aid guide for the specific situation.','Share location and medical information when safe to do so.'].map((x,i)=><div key={x} className="flex gap-3"><div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-xs font-bold text-red-300">{i+1}</div><p className="text-sm leading-6 text-slate-300">{x}</p></div>)}</div><Link href="/guides" className="btn-danger mt-7 inline-flex">Open first aid guides <ArrowRight size={18} /></Link></div><div className="card p-7 sm:p-9"><p className="text-sm font-semibold text-blue">PREPARE BEFORE YOU NEED IT</p><h2 className="mt-3 text-3xl font-black">A 2-minute safety setup.</h2><div className="mt-6 space-y-4">{['Create your account','Add two trusted emergency contacts','Complete your Medical ID','Allow location access when needed','Know where the SOS and First Aid buttons are'].map((x,i)=><div key={x} className="flex items-center gap-3 text-sm text-slate-300"><CheckCircle2 className="text-blue" size={20} />{x}</div>)}</div><Link href="/signup" className="btn-primary mt-7 inline-flex">Create safety profile <ArrowRight size={18} /></Link></div></div></section>

      <section id="how" className="py-20"><div className="shell"><div className="text-center"><p className="text-sm font-semibold text-blue">HOW IT WORKS</p><h2 className="mt-3 text-3xl font-black sm:text-5xl">Prepare once. Respond clearly.</h2></div><div className="mt-10 grid gap-4 md:grid-cols-5">{['Create your safety profile','Add trusted contacts','Complete your Medical ID','Use SOS or First Aid','Connected hospital receives the case'].map((x,i)=><div key={x} className="card p-5"><div className="text-2xl font-black text-blue/70">0{i+1}</div><h3 className="mt-4 text-sm font-bold">{x}</h3></div>)}</div></div></section>

      <section id="offline" className="py-20"><div className="shell"><div className="card overflow-hidden p-7 sm:p-10"><div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]"><div><p className="text-sm font-semibold text-blue">OFFLINE-READY INFORMATION</p><h2 className="mt-3 text-3xl font-black">Critical guidance should stay simple.</h2><p className="mt-4 max-w-2xl leading-7 text-slate-400">First-aid and emergency guidance is presented as lightweight content so it remains useful even when connectivity is poor. Live hospital data and SOS routing still require connectivity.</p></div><div className="grid grid-cols-2 gap-3"><div className="rounded-2xl bg-white/[.04] p-4 text-center text-xs font-semibold">First aid</div><div className="rounded-2xl bg-white/[.04] p-4 text-center text-xs font-semibold">112</div><div className="rounded-2xl bg-white/[.04] p-4 text-center text-xs font-semibold">Medical ID</div><div className="rounded-2xl bg-white/[.04] p-4 text-center text-xs font-semibold">Contacts</div></div></div></div></div></section>

      <section className="py-20"><div className="shell"><div className="card bg-gradient-to-r from-blue/10 to-red-500/5 p-8 text-center sm:p-12"><p className="text-sm text-slate-400">PEOPLE + HOSPITALS + RESPONSE</p><h2 className="mt-3 text-3xl font-black">One network, different roles.</h2><p className="mx-auto mt-4 max-w-2xl text-slate-400">Users get emergency tools and preparation. Connected hospital staff get live cases and capacity controls. Admins verify hospital registrations before access.</p><div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/signup" className="btn-primary">Create safety profile <ArrowRight size={18} /></Link><Link href="/hospital/signup" className="btn-ghost">Hospital registration <Hospital size={18} /></Link></div></div></div></section>
    </main>
    <footer className="border-t border-white/5 py-8"><div className="shell flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between"><span>© 2026 Sahayak · Code Nova</span><span>Emergency support prototype · Call 112 for life-threatening emergencies.</span></div></footer>
  </div>;
}
