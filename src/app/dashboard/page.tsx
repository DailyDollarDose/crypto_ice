
'use client';

import { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, Search, Settings, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import ParticleAnimation from '@/components/particle-animation';
import Link from 'next/link';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Search', icon: Search },
  { label: 'Settings', icon: Settings },
];

const coins = ['BTC', 'ETH', 'BNB', 'SOL', 'Multicoin'];

const generateWalletAddress = () => {
    const chars = '0123456789abcdef';
    let address = '0x';
    for (let i = 0; i < 40; i++) {
        address += chars[Math.floor(Math.random() * chars.length)];
    }
    return address;
};


const getDummyLog = () => {
  const dummyLogOptions = [
    {
      text: 'Log: Initializing system check...',
      color: 'text-blue-400',
    },
    {
      text: 'Connecting to wallet node: eu-central-1...',
      color: 'text-gray-400',
    },
    {
      text: 'Success: Connection established.',
      color: 'text-green-400',
    },
    {
      text: 'Log: Running check on wallet...',
      color: 'text-blue-400',
    },
    {
      text: `Balance: 0 | Wallet check: ${generateWalletAddress()}`,
      color: 'text-gray-400',
    },
    {
      text: 'Patience is key. The biggest rewards take time.',
      color: 'text-cyan-400',
    },
    {
      text: 'Error: Timeout while fetching transaction history.',
      color: 'text-red-400',
    },
    {
      text: 'Retrying connection...',
      color: 'text-yellow-400',
    },
    {
      text: `Balance: 0 | Wallet check: ${generateWalletAddress()}`,
      color: 'text-gray-400',
    },
    {
      text: 'Stay focused. Every check brings you closer.',
      color: 'text-cyan-400',
    },
     {
      text: `Found vulnerable wallet: ${generateWalletAddress()}`,
      color: 'text-yellow-400',
    },
    {
      text: `Bypassing security... wallet: ${generateWalletAddress()}`,
      color: 'text-purple-400',
    },
    {
      text: 'The search for treasure requires persistence. Keep going.',
      color: 'text-cyan-400',
    },
    {
      text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.',
      color: 'text-green-400',
    },
  ];
  return dummyLogOptions[Math.floor(Math.random() * dummyLogOptions.length)];
}

export default function DashboardPage() {
  const [checkedCount, setCheckedCount] = useState(0);
  const [logs, setLogs] = useState<{text: string, color: string}[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCheckedCount(prev => prev + Math.floor(Math.random() * 5));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const logInterval = setInterval(() => {
      setLogs(prevLogs => [
        ...prevLogs,
        getDummyLog(),
      ]);
    }, 2000);
    return () => clearInterval(logInterval);
  }, []);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-[#0A192F] min-h-screen text-gray-200 font-headline p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      <ParticleAnimation />
      <div className="relative z-10 max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <Link href="/" className="text-2xl font-bold text-white tracking-wider">
            Crypto ICE
          </Link>
          <nav className="hidden md:flex items-center space-x-2">
            {navItems.map(item => (
              <Button
                key={item.label}
                variant="ghost"
                className="text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-lg px-4 py-2 flex items-center gap-2"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Button>
            ))}
          </nav>
          <Button
            variant="ghost"
            className="md:hidden text-gray-300 hover:text-white hover:bg-white/10 rounded-lg p-2"
          >
            <Search className="w-6 h-6" />
          </Button>
        </header>

        <main>
          <section id="coins" className="mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {coins.map(coin => (
                <div
                  key={coin}
                  className="bg-black/20 backdrop-blur-md border border-blue-500/30 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 text-center transition-all duration-300 hover:bg-blue-500/20 hover:border-blue-400/50 cursor-pointer shadow-lg hover:shadow-blue-500/20 h-28"
                >
                  <span className="font-bold tracking-wider text-lg">{coin}</span>
                </div>
              ))}
            </div>
          </section>

          <section id="stats" className="mb-8 text-center">
            <div className="bg-black/20 backdrop-blur-md border border-purple-500/30 rounded-2xl p-4 inline-block shadow-lg">
              <p className="text-xl font-bold tracking-widest text-purple-300">
                Checked: <span className="text-white">{checkedCount.toLocaleString()}</span>
              </p>
            </div>
          </section>

          <section id="log" className="mb-8">
            <div
              ref={logContainerRef}
              className="h-64 bg-black/30 backdrop-blur-sm border border-gray-700/50 rounded-lg p-4 overflow-y-auto font-mono text-sm leading-relaxed shadow-inner-lg"
            >
              {logs.map((log, index) => (
                <p key={index} className={cn('whitespace-nowrap', log.color)}>
                  {`> ${log.text}`}
                </p>
              ))}
            </div>
          </section>

          <section id="actions" className="mb-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              className="w-full sm:w-auto text-lg font-bold bg-blue-600 text-white rounded-lg px-8 py-6 transition-all duration-300 hover:bg-blue-500 hover:scale-105 shadow-lg hover:shadow-blue-500/40"
              onClick={() => {
                setLogs(prev => [...prev, {text: 'Starting search...', color: 'text-green-400'}]);
              }}
            >
              START SEARCH
            </Button>
            <Button
              className="w-full sm:w-auto text-lg font-bold bg-purple-600 text-white rounded-lg px-8 py-6 transition-all duration-300 hover:bg-purple-500 hover:scale-105 shadow-lg hover:shadow-purple-500/40"
              onClick={() => setModalOpen(true)}
            >
              STOP SEARCH
            </Button>
          </section>
        </main>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-900/80 border border-purple-500/50 rounded-2xl shadow-2xl shadow-purple-500/20 p-8 w-full max-w-md m-4 flex flex-col items-center text-center">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              onClick={() => setModalOpen(false)}
            >
              <X className="w-6 h-6" />
            </Button>
            <h2 className="text-3xl font-bold text-white mb-4">Found: 0</h2>
            <p className="text-gray-400 mb-8">
              You haven’t found any wallets yet. Keep searching to find valuable assets.
            </p>
            <Button
              className="text-lg font-bold bg-green-600 text-white rounded-lg px-8 py-4 transition-all duration-300 hover:bg-green-500 hover:scale-105 shadow-lg hover:shadow-green-500/30"
              disabled
            >
              WITHDRAW
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
