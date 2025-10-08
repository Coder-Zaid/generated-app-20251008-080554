import { Outlet } from 'react-router-dom';
import { Header } from '@/components/Header';
import { AnimatedBackground } from '@/components/AnimatedBackground';
export default function App() {
  return (
    <div className="h-screen w-screen bg-charcoal text-white flex flex-col overflow-hidden">
      <AnimatedBackground />
      <Header />
      <main className="flex-1 overflow-auto relative z-10 pt-20">
        <Outlet />
      </main>
    </div>
  );
}