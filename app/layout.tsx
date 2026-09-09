import './globals.css'; import type { Metadata } from 'next';
export const metadata: Metadata={title:'Sahayak — Smart Emergency Assistance',description:'Fewer decisions. Faster action.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
