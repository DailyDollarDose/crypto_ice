
'use client';

import { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, Search, Settings, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import ParticleAnimation from '@/components/particle-animation';
import Link from 'next/link';

const CryptoIcon = ({ coin }: { coin: string }) => {
  const icons: { [key: string]: React.ReactNode } = {
    BTC: (
      <svg
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 text-yellow-400"
        fill="currentColor"
      >
        <title>Bitcoin</title>
        <path d="M11.23 18.445v2.332h1.537v-2.332h1.538V5.556h-1.538V3.222h-1.537v2.334H9.692v12.89h1.538zm0-1.533H9.692v-2.334h1.538v2.334zm0-3.867H9.692V9.178h1.538v3.867zm1.537-5.4h-1.537V5.556h1.537v2.332z" />
      </svg>
    ),
    ETH: (
      <svg
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 text-blue-400"
        fill="currentColor"
      >
        <title>Ethereum</title>
        <path d="M11.944 17.97L4.58 13.62 11.944 24l7.365-10.38-7.365 4.35zM12.056 0L4.69 12.223l7.366 4.35L19.418 12.22 12.056 0z" />
      </svg>
    ),
    BNB: (
      <svg
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 text-yellow-500"
        fill="currentColor"
      >
        <title>BNB</title>
        <path d="M16.11.063l-4.11 4.103-4.11-4.104L0 7.953l4.11 4.102L0 16.157l7.902 7.901 4.11-4.103L16.11 24.06l7.902-7.902-4.11-4.102 4.11-4.104L16.11.062zM12 10.15l1.838 1.838L12 13.828l-1.838-1.84 1.838-1.838zM8.828 7.014l3.172 3.172 3.172-3.172L16.986 8.84l-3.172 3.172 3.172 3.172-1.814 1.814-3.172-3.172-3.172 3.172-1.814-1.814 3.172-3.172-3.172-3.172L8.828 7.014z" />
      </svg>
    ),
    SOL: (
      <svg
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 text-purple-400"
        fill="currentColor"
      >
        <title>Solana</title>
        <path d="M3.38.118a.33.33 0 0 0-.323.09.339.339 0 0 0-.146.294v7.35a.338.338 0 0 0 .146.293.33.33 0 0 0 .323.091l17.21-4.662a.338.338 0 0 0 .227-.294.338.338 0 0 0-.227-.293L3.38.118zm0 8.247a.33.33 0 0 0-.323.09.339.339 0 0 0-.146.294v7.35c0 .13.055.25.146.293a.33.33 0 0 0 .323.091l17.21-4.662a.338.338 0 0 0 .227-.294.338.338 0 0 0-.227-.293L3.38 8.365zm0 8.248a.33.33 0 0 0-.323.09.339.339 0 0 0-.146.294v7.35c0 .13.055.25.146.293a.33.33 0 0 0 .323.091l17.21-4.662a.338.338 0 0 0 .227-.294.338.338 0 0 0-.227-.293L3.38 16.613z" />
      </svg>
    ),
    Multicoin: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 text-blue-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
    ),
  };
  return icons[coin] || null;
};

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


const dummyLogs = [
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
    text: `Found vulnerable wallet: ${generateWalletAddress()}`,
    color: 'text-yellow-400',
  },
  {
    text: `Bypassing security... wallet: ${generateWalletAddress()}`,
    color: 'text-purple-400',
  },
];

export default function DashboardPage() {
  const [checkedCount, setCheckedCount] = useState(0);
  const [logs, setLogs] = useState<(typeof dummyLogs)>([]);
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
        dummyLogs[Math.floor(Math.random() * dummyLogs.length)],
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
            Crypto ICE V2.0
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
                  className="bg-black/20 backdrop-blur-md border border-blue-500/30 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 text-center transition-all duration-300 hover:bg-blue-500/20 hover:border-blue-400/50 cursor-pointer shadow-lg hover:shadow-blue-500/20"
                >
                  <div className="w-16 h-16 rounded-full bg-black/30 flex items-center justify-center shadow-inner-lg">
                    <CryptoIcon coin={coin} />
                  </div>
                  <span className="font-bold tracking-wider">{coin}</span>
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

    