import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, ShieldCheck, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Typewriter } from '@/components/Typewriter';
const StatCard = ({ icon, value, label, delay }: { icon: React.ReactNode; value: string; label: string; delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="bg-white/5 border border-white/10 rounded-xl p-6 text-center backdrop-blur-lg"
  >
    <div className="text-indigo mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-indigo/10 mb-4">
      {icon}
    </div>
    <p className="text-4xl font-bold text-white">{value}</p>
    <p className="text-sm text-gray-400 mt-1">{label}</p>
  </motion.div>
);
const FeatureCard = ({ icon, title, description, delay }: { icon: React.ReactNode; title: string; description: string; delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="bg-white/5 border border-white/10 rounded-xl p-8"
  >
    <div className="flex items-center space-x-4 mb-4">
      <div className="text-teal w-10 h-10 flex-shrink-0">{icon}</div>
      <h3 className="text-xl font-semibold text-white">{title}</h3>
    </div>
    <p className="text-gray-400">{description}</p>
  </motion.div>
);
export function HomePage() {
  return (
    <div className="w-full text-white overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="text-center py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-400">
              Find Clarity in the Chaos
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-300">
              A safe, non-judgmental space for neurodivergent minds to untangle thoughts, understand emotions, and communicate with confidence.
            </p>
            <div className="mt-10">
              <Button asChild size="lg" className="bg-indigo hover:bg-indigo/90 text-white font-semibold text-lg px-8 py-6 rounded-full group">
                <Link to="/chat">
                  Start Your Session <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
            <Typewriter text="EXPRESS, REFLECT, CONNECT" className="mt-8 text-lg font-medium tracking-widest text-gray-400 font-mono" />
          </motion.div>
        </section>
        {/* Statistics Section */}
        <section className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatCard icon={<BarChart size={24} />} value="1 in 7" label="People are neurodivergent worldwide" delay={0.2} />
            <StatCard icon={<Zap size={24} />} value="40%" label="Higher creativity reported in adults with ADHD" delay={0.4} />
            <StatCard icon={<ShieldCheck size={24} />} value="100%" label="Private & Secure Conversations" delay={0.6} />
          </div>
        </section>
        {/* Features Section */}
        <section className="py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Your Personal Thought Clarifier</h2>
            <p className="mt-4 max-w-2xl mx-auto text-gray-400">
              Neuro is more than just a chatbot. It's a tool designed to empower you.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Zap size={40} />}
              title="Instant Clarity"
              description="Transform scattered thoughts into clear, concise messages you can share with others."
              delay={0.2}
            />
            <FeatureCard
              icon={<ShieldCheck size={40} />}
              title="Emotion Insight"
              description="Gently identify underlying emotions like anxiety or overstimulation to build self-awareness."
              delay={0.4}
            />
            <FeatureCard
              icon={<BarChart size={40} />}
              title="Judgment-Free Zone"
              description="Express yourself freely without fear of criticism. Our AI is trained to listen with empathy."
              delay={0.6}
            />
          </div>
        </section>
      </div>
      <footer className="text-center py-8 border-t border-white/10 mt-16">
        <p className="text-sm text-gray-500">Built with ❤️ at Cloudflare</p>
      </footer>
    </div>
  );
}