
'use client';

import { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, Search, Settings, X, Copy, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import ParticleAnimation from '@/components/particle-animation';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { collection, query, where, getDocs, doc, updateDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const coins = ['BTC', 'ETH', 'BNB', 'SOL', 'Multicoin'];

type FoundWallet = {
    address: string;
    privateKey: string;
    asset: 'BTC' | 'ETH';
    amount: number;
    usdValue: number;
};

type AccessKeyData = {
    id: string;
    key: string;
    isValid: boolean;
    deviceId: string;
    rewardLimit: number;
    totalReward: number;
    lastFoundDate?: Timestamp;
};

export default function DashboardPage() {
    const [checkedCount, setCheckedCount] = useState(0);
    const [logs, setLogs] = useState<{text: string, color: string}[]>([]);
    const [isWalletsModalOpen, setWalletsModalOpen] = useState(false);
    const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
    const [foundWallets, setFoundWallets] = useState<FoundWallet[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [userWithdrawAddress, setUserWithdrawAddress] = useState('');
    const [loginKey, setLoginKey] = useState('');
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const logContainerRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();
    const firestore = useFirestore();
    const [accessKeyData, setAccessKeyData] = useState<AccessKeyData | null>(null);
    const [accessKeyDocId, setAccessKeyDocId] = useState<string | null>(null);

    const generateWalletAddress = () => {
        const chars = '0123456789abcdef';
        let address = '0x';
        for (let i = 0; i < 40; i++) {
            address += chars[Math.floor(Math.random() * chars.length)];
        }
        return address;
    };

    const getDummyLog = (foundWalletCallback: () => void, canFindWallet: boolean) => {
        const findWalletProbability = 1 / ( ( (Math.random() * 2) + 1 ) * 3600 / 2); 
    
        const isFindingWallet = canFindWallet && (Math.random() < findWalletProbability);
    
        if (isFindingWallet) {
        foundWalletCallback();
        return {
            text: `Success! Vulnerable wallet found!`,
            color: 'text-green-400 font-bold',
        };
        }
    
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

    const navItems = [
        { label: 'Dashboard', icon: LayoutDashboard, action: () => {} },
        { label: 'Found Wallets', icon: Search, action: () => setWalletsModalOpen(true) },
        { label: 'Settings', icon: Settings, action: () => setSettingsModalOpen(true) },
    ];
  
    useEffect(() => {
        setCurrentYear(new Date().getFullYear());
    }, []);

    useEffect(() => {
        const key = localStorage.getItem('userAccessKey');
        if (key) {
        setLoginKey(key);
        }
    }, []);

    useEffect(() => {
        if (!loginKey || !firestore) return;

        const fetchAccessKeyData = async () => {
            const accessKeysRef = collection(firestore, 'accessKeys');
            const q = query(accessKeysRef, where("key", "==", loginKey));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const keyDoc = querySnapshot.docs[0];
                setAccessKeyDocId(keyDoc.id);
                const data = keyDoc.data() as Omit<AccessKeyData, 'id'>;
                const completeData: AccessKeyData = { id: keyDoc.id, ...data };
                setAccessKeyData(completeData);
            }
        };

        fetchAccessKeyData();
    }, [loginKey, firestore]);

    const handleFoundWallet = async () => {
        if (!loginKey || !accessKeyData || !accessKeyDocId || !firestore) return;

        const usdValue = Math.random() * 0.80 + 0.10;

        if (accessKeyData.totalReward + usdValue > accessKeyData.rewardLimit) {
            return;
        }

        const newTotalReward = accessKeyData.totalReward + usdValue;

        const keyDocRef = doc(firestore, 'accessKeys', accessKeyDocId);
        await updateDoc(keyDocRef, {
            totalReward: newTotalReward,
            lastFoundDate: serverTimestamp()
        });

        setAccessKeyData(prev => prev ? { ...prev, totalReward: newTotalReward, lastFoundDate: new Timestamp(Math.floor(Date.now()/1000), 0) } : null);

        const asset = Math.random() > 0.5 ? 'BTC' : 'ETH';
        const btcPrice = 60000;
        const ethPrice = 3000;

        let amount = 0;
        if (asset === 'BTC') {
            amount = usdValue / btcPrice;
        } else {
            amount = usdValue / ethPrice;
        }

        const newWallet: FoundWallet = {
            address: generateWalletAddress(),
            privateKey: loginKey,
            asset,
            amount,
            usdValue
        };
        setFoundWallets(prev => [...prev, newWallet]);
        setWalletsModalOpen(true);
    };

    const startSearch = () => {
        setIsSearching(true);
        setLogs(prev => [...prev, {text: 'Starting search...', color: 'text-green-400'}]);
    };

    const stopSearch = () => {
        setIsSearching(false);
        setLogs(prev => [...prev, {text: 'Search stopped.', color: 'text-red-400'}]);
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if(isSearching) {
        interval = setInterval(() => {
            setCheckedCount(prev => prev + Math.floor(Math.random() * 5));
        }, 1500);
        }
        return () => clearInterval(interval);
    }, [isSearching]);

    useEffect(() => {
        let logInterval: NodeJS.Timeout;
        if (isSearching) {
            const hasReachedLimit = accessKeyData ? accessKeyData.totalReward >= accessKeyData.rewardLimit : false;
            let canFindWallet = !hasReachedLimit;

            if (canFindWallet && accessKeyData?.lastFoundDate && foundWallets.length > 0) {
                const now = Date.now();
                const lastFoundTime = accessKeyData.lastFoundDate.toMillis();
                const hoursSinceLastFind = (now - lastFoundTime) / (1000 * 60 * 60);
                if (hoursSinceLastFind < 48) { // 48 hours for 2 days
                    canFindWallet = false;
                }
            } else if (canFindWallet && foundWallets.length === 0) {
                 // No cooldown for the first wallet
            }


            logInterval = setInterval(() => {
                setLogs(prevLogs => {
                    if (prevLogs.length > 100) {
                        prevLogs = prevLogs.slice(prevLogs.length - 50);
                    }
                    return [
                        ...prevLogs,
                        getDummyLog(handleFoundWallet, canFindWallet),
                    ]
                });
            }, 2000);
        }
        return () => {
            if(logInterval) clearInterval(logInterval);
        }
    }, [isSearching, accessKeyData, loginKey, foundWallets.length]);

    useEffect(() => {
        if (logContainerRef.current) {
        logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [logs]);

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast({
        title: 'Copied to Clipboard',
        description: `${label} has been copied.`,
        });
    };

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
                    onClick={item.action}
                    className="text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-lg px-4 py-2 flex items-center gap-2"
                >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                </Button>
                ))}
            </nav>
            <Button
                variant="ghost"
                onClick={() => setWalletsModalOpen(true)}
                className="md:hidden text-gray-300 hover:text-white hover:bg-white/10 rounded-lg p-2"
            >
                <Search className="w-6 h-6" />
            </Button>
            </header>

            <main>
            <section id="coins" className="mb-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {coins.map((coin) => (
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
                onClick={startSearch}
                disabled={isSearching}
                >
                {isSearching ? 'SEARCHING...' : 'START SEARCH'}
                </Button>
                <Button
                className="w-full sm:w-auto text-lg font-bold bg-purple-600 text-white rounded-lg px-8 py-6 transition-all duration-300 hover:bg-purple-500 hover:scale-105 shadow-lg hover:shadow-purple-500/40"
                onClick={stopSearch}
                disabled={!isSearching}
                >
                STOP SEARCH
                </Button>
            </section>
            </main>

            <footer className="mt-8 text-center text-xs text-gray-500 space-y-2">
            <p>
                <strong>Rules:</strong> Only one account per user is allowed. Use of bots, scripts, or any form of automation is strictly prohibited and will result in a permanent ban. All transactions are final. We are not responsible for any lost keys or funds.
            </p>
            <p>&copy; {currentYear} Crypto ICE. All rights reserved.</p>
            </footer>
        </div>

        {isWalletsModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-gray-900/80 border border-purple-500/50 rounded-2xl shadow-2xl shadow-purple-500/20 p-6 sm:p-8 w-full max-w-lg m-4 flex flex-col items-center text-center">
                <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                onClick={() => setWalletsModalOpen(false)}
                >
                <X className="w-6 h-6" />
                </Button>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Found: {foundWallets.length}</h2>

                {foundWallets.length > 0 ? (
                <div className="w-full text-left space-y-4 text-xs sm:text-sm">
                    {foundWallets.map((wallet, index) => (
                        <div key={index} className="bg-black/20 p-4 rounded-lg border border-blue-500/30">
                            <h3 className="font-bold text-lg text-green-400 mb-2">Wallet #{index + 1} - Found ~${wallet.usdValue.toFixed(2)} USD</h3>
                            <div className="space-y-2 font-mono">
                                <p className="flex justify-between items-center">
                                    <span className="text-gray-400">Asset:</span>
                                    <span className="text-white font-bold">{wallet.asset}</span>
                                </p>
                                <p className="flex justify-between items-center">
                                    <span className="text-gray-400">Amount:</span>
                                    <span className="text-white font-bold">{wallet.amount.toFixed(8)}</span>
                                </p>
                                <div>
                                    <p className="text-gray-400 mb-1">Found Wallet Address:</p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-white break-all">{wallet.address}</p>
                                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => copyToClipboard(wallet.address, 'Address')}><Copy className="h-4 w-4"/></Button>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-gray-400 mb-1">Private Key (Your Login Key):</p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-white break-all">{wallet.privateKey}</p>
                                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => copyToClipboard(wallet.privateKey, 'Private Key')}><Copy className="h-4 w-4"/></Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="pt-4 space-y-2">
                        <label htmlFor="withdrawAddress" className="text-gray-300 font-bold">Your Wallet Address for Withdraw:</label>
                        <Input
                            id="withdrawAddress"
                            type="text"
                            placeholder="Enter your wallet address"
                            className="w-full text-center tracking-widest bg-secondary/80 backdrop-blur-sm border-2 border-primary/50 h-12 rounded-lg text-sm focus:ring-accent"
                            value={userWithdrawAddress}
                            onChange={(e) => setUserWithdrawAddress(e.target.value)}
                        />
                    </div>

                    <div className="pt-4">
                    <Link href="https://t.me/Crypto_ice_Team" target="_blank" rel="noopener noreferrer" className="w-full">
                        <Button
                        className="w-full text-lg font-bold bg-green-600 text-white rounded-lg px-8 py-4 transition-all duration-300 hover:bg-green-500 hover:scale-105 shadow-lg hover:shadow-green-500/30"
                        >
                        WITHDRAW
                        </Button>
                    </Link>
                    </div>
                </div>
                ) : (
                <>
                    <p className="text-gray-400 mb-8">
                    You haven’t found any wallets yet. Keep searching to find valuable assets.
                    </p>
                    <Link href="https://t.me/Crypto_ice_Team" target="_blank" rel="noopener noreferrer" className="w-full">
                        <Button
                        className="w-full text-lg font-bold bg-green-600 text-white rounded-lg px-8 py-4 transition-all duration-300 hover:bg-green-500 hover:scale-105 shadow-lg hover:shadow-green-500/30"
                        >
                        WITHDRAW
                        </Button>
                    </Link>
                </>
                )}
            </div>
            </div>
        )}

        {isSettingsModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-gray-900/80 border border-blue-500/50 rounded-2xl shadow-2xl shadow-blue-500/20 p-6 sm:p-8 w-full max-w-md m-4 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white">Settings</h2>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-white"
                        onClick={() => setSettingsModalOpen(false)}
                    >
                        <X className="w-6 h-6" />
                    </Button>
                </div>
                
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="theme" className="text-lg text-gray-300">Theme</Label>
                        <div className="flex items-center gap-2 rounded-lg bg-black/20 p-1 border border-blue-500/30">
                            <Button variant="ghost" size="icon" className="text-yellow-400 bg-blue-500/20"><Sun/></Button>
                            <Button variant="ghost" size="icon" className="text-gray-400"><Moon/></Button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <Label htmlFor="notifications" className="text-lg text-gray-300">Notifications</Label>
                        <Switch id="notifications" checked />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="language" className="text-lg text-gray-300">Language</Label>
                        <Select defaultValue="en">
                            <SelectTrigger className="w-full bg-black/20 border-blue-500/30">
                                <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="en">English</SelectItem>
                                <SelectItem value="es">Español</SelectItem>
                                <SelectItem value="de">Deutsch</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-lg text-gray-300">Wallet Sync</Label>
                        <p className="text-sm text-gray-400">Sync your found wallets across devices.</p>
                        <Button className="w-full bg-blue-600 hover:bg-blue-500">Sync Now</Button>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-blue-500/30 text-center">
                    <Button onClick={() => setSettingsModalOpen(false)} className="w-full sm:w-auto bg-purple-600 hover:bg-purple-500 px-10">
                        Save Changes
                    </Button>
                </div>
            </div>
            </div>
        )}
        </div>
    );
}
