import { NavLink } from 'react-router-dom';
import { BrainCircuit } from 'lucide-react';
import { cn } from '@/lib/utils';
export function Header() {
  const activeLinkClass = 'text-white bg-white/10';
  const inactiveLinkClass = 'text-gray-400 hover:text-white hover:bg-white/5';
  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <NavLink to="/" className="flex items-center space-x-2 group">
            <BrainCircuit className="w-8 h-8 text-indigo transition-transform group-hover:scale-110" />
            <span className="text-2xl font-bold text-white font-mono">Neuro</span>
          </NavLink>
          <div className="flex items-center space-x-2 bg-charcoal/50 border border-white/10 rounded-full p-1 backdrop-blur-sm">
            <NavLink
              to="/"
              className={({ isActive }) =>
                cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                  isActive ? activeLinkClass : inactiveLinkClass
                )
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/chat"
              className={({ isActive }) =>
                cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                  isActive ? activeLinkClass : inactiveLinkClass
                )
              }
            >
              Chat
            </NavLink>
          </div>
        </div>
      </nav>
    </header>
  );
}