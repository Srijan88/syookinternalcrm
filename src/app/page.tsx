'use client';
/**
 * Client component shell — dynamically imports the entire CRM app with
 * ssr: false so Next.js never server-renders the client tree.
 * This eliminates all hydration mismatches (browser extensions injecting
 * attributes like bis_skin_checked, etc.).
 * Note: ssr:false requires a Client Component in Next.js 15+.
 */
import dynamic from 'next/dynamic';

const App = dynamic(() => import('@/components/App'), { ssr: false });

export default function Page() {
  return <App />;
}
