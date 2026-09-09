import Link from 'next/link';
import { ArrowLeft, BookOpen, Brain, Droplets, Flame, HeartPulse, PhoneCall, Siren, TriangleAlert, Wind, Zap } from 'lucide-react';

const guides = [
  { title: 'Severe bleeding', icon: Droplets, emergency: true, steps: ['Call 112 for severe or uncontrolled bleeding.', 'Apply firm, continuous direct pressure with clean cloth or dressing.', 'If blood soaks through, add more material on top rather than removing the first layer.', 'Keep the person warm and stay with them until help arrives.'] },
  { title: 'Burns', icon: Flame, emergency: true, steps: ['Move away from the heat source if it is safe.', 'Cool the burn under cool running water for about 20 minutes.', 'Remove jewellery or loose clothing near the burn unless stuck to the skin.', 'Do not apply ice, butter, toothpaste or creams to a fresh serious burn. Seek urgent medical help for large, deep or facial burns.'] },
  { title: 'Choking', icon: Wind, emergency: true, steps: ['If the person can cough or speak, encourage them to cough.', 'If they cannot breathe, speak or cough effectively, call 112 and get help.', 'Give up to 5 back blows, then up to 5 abdominal thrusts for a conscious adult or child over 1 year, alternating as needed.', 'If the person becomes unresponsive, begin CPR and follow the emergency operator instructions.'] },
  { title: 'Unresponsive and not breathing normally', icon: HeartPulse, emergency: true, steps: ['Call 112 or ask someone else to call while you start help.', 'Begin CPR if the person is unresponsive and not breathing normally.', 'Push hard and fast in the centre of the chest at about 100–120 compressions per minute.', 'Use an AED if one is available and follow its voice prompts.'] },
  { title: 'Seizure', icon: Brain, emergency: true, steps: ['Protect the person from nearby hazards and cushion their head.', 'Do not restrain them and do not put anything in their mouth.', 'Time the seizure and stay with them until they recover.', 'Call 112 if it lasts more than 5 minutes, repeats without recovery, causes serious injury, happens in water, or the person has breathing difficulty afterwards.'] },
  { title: 'Electric shock', icon: Zap, emergency: true, steps: ['Do not touch the person while they are still connected to the electrical source.', 'Switch off the power at the source if it can be done safely.', 'Call 112 for serious shock, unconsciousness, burns or breathing problems.', 'If they are unresponsive and not breathing normally once the scene is safe, begin CPR.'] },
  { title: 'Possible stroke', icon: Brain, emergency: true, steps: ['Think FAST: Face drooping, Arm weakness, Speech difficulty — Time to call 112.', 'Note the time symptoms started or when the person was last known well.', 'Keep the person safe and do not give food, drink or medicines unless a medical professional tells you to.', 'Treat it as an emergency even if symptoms improve.'] },
];

export default function GuidesPage() {
  return <main className="min-h-screen bg-[#050c16] px-5 py-10 text-white sm:py-14">
    <div className="shell">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"><ArrowLeft size={17} /> Back to Sahayak</Link>
      <div className="mt-10 max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue/20 bg-blue/10 px-4 py-2 text-xs font-semibold text-blue-200"><BookOpen size={15} /> SIMPLE FIRST AID</div>
        <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-6xl">What should I do right now?</h1>
        <p className="mt-5 text-lg leading-8 text-slate-400">Short, practical first-aid reminders for common emergencies. These guides do not replace trained medical care. For a life-threatening emergency in India, call 112.</p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {guides.map(({ title, icon: Icon }) => <a key={title} href={`#${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="card p-5 transition hover:-translate-y-1 hover:border-blue/30"><Icon className="text-blue" size={23} /><h2 className="mt-4 font-bold">{title}</h2><p className="mt-1 text-xs text-slate-500">Open step-by-step guide</p></a>)}
      </div>

      <div className="mt-10 space-y-5">
        {guides.map(({ title, icon: Icon, steps }) => <section id={title.toLowerCase().replace(/[^a-z0-9]+/g, '-')} key={title} className="card scroll-mt-24 p-6 sm:p-8"><div className="flex items-start gap-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue/10 text-blue"><Icon size={22} /></div><div className="min-w-0"><h2 className="text-xl font-black">{title}</h2><ol className="mt-5 space-y-3">{steps.map((step, i) => <li key={step} className="flex gap-3 text-sm leading-6 text-slate-300"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/[.06] text-xs font-bold text-blue">{i + 1}</span><span>{step}</span></li>)}</ol></div></div></section>)}
      </div>

      <section className="mt-8 rounded-3xl border border-amber-300/10 bg-amber-300/5 p-6 sm:p-8"><div className="flex gap-4"><TriangleAlert className="shrink-0 text-amber-300" size={24} /><div><h2 className="font-bold text-amber-100">Emergency reminder</h2><p className="mt-2 text-sm leading-6 text-amber-100/70">Do not delay professional help to follow a guide. Make the scene safe first, call 112 when the situation is life-threatening, and follow the emergency operator's instructions.</p><a href="tel:112" className="btn-danger mt-5 inline-flex"><PhoneCall size={17} /> Call 112</a></div></div></section>

      <p className="mt-8 text-xs leading-5 text-slate-600">General first-aid information based on established emergency-care guidance. Always follow local emergency operator instructions and seek professional medical assessment when needed.</p>
    </div>
  </main>;
}
