'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy } from 'lucide-react';
import ParticleAnimation from '@/components/particle-animation';

export default function FoundWalletPreviewPage() {
    const exampleWallet = {
        address: '0x1234AbCdE5678fGhIjK90LmNoP1234qRsT5678uVwXyZ',
        privateKey: 'ice-key-social-media-demo-key',
        asset: 'BTC' as 'BTC' | 'ETH',
        amount: 0.00012345,
        usdValue: 7.41
    };

    return (
        <div className="bg-[#0A192F] min-h-screen text-gray-200 font-headline p-4 sm:p-6 lg:p-8 relative overflow-hidden flex items-center justify-center">
            <ParticleAnimation />
            
            {/* This is the modal content, displayed directly on the page */}
            <div className="bg-gray-900/80 border border-purple-500/50 rounded-2xl shadow-2xl shadow-purple-500/20 p-6 sm:p-8 w-full max-w-lg m-4 flex flex-col items-center text-center relative z-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Found: 1</h2>

                <div className="w-full text-left space-y-4 text-xs sm:text-sm">
                    {/* Display one example wallet */}
                    <div className="bg-black/20 p-4 rounded-lg border border-blue-500/30">
                        <h3 className="font-bold text-lg text-green-400 mb-2">Wallet #1 - Found ~${exampleWallet.usdValue.toFixed(2)} USD</h3>
                        <div className="space-y-2 font-mono">
                            <p className="flex justify-between items-center">
                                <span className="text-gray-400">Asset:</span>
                                <span className="text-white font-bold">{exampleWallet.asset}</span>
                            </p>
                            <p className="flex justify-between items-center">
                                <span className="text-gray-400">Amount:</span>
                                <span className="text-white font-bold">{exampleWallet.amount.toFixed(8)}</span>
                            </p>
                            <div>
                                <p className="text-gray-400 mb-1">Found Wallet Address:</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-white break-all">{exampleWallet.address}</p>
                                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => navigator.clipboard.writeText(exampleWallet.address)}><Copy className="h-4 w-4"/></Button>
                                </div>
                            </div>
                            <div>
                                <p className="text-gray-400 mb-1">Private Key (Your Login Key):</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-white break-all">{exampleWallet.privateKey}</p>
                                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => navigator.clipboard.writeText(exampleWallet.privateKey)}><Copy className="h-4 w-4"/></Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 space-y-2">
                        <label htmlFor="withdrawAddress" className="text-gray-300 font-bold">Your Wallet Address for Withdraw:</label>
                        <Input
                            id="withdrawAddress"
                            type="text"
                            placeholder="Enter your wallet address"
                            className="w-full text-center tracking-widest bg-secondary/80 backdrop-blur-sm border-2 border-primary/50 h-12 rounded-lg text-sm focus:ring-accent"
                            defaultValue="Your-BTC-Wallet-Address-Here"
                        />
                    </div>
                    
                    <p className="text-center text-yellow-400 font-semibold pt-2">
                        Note: A minimum of $5.00 USD in found assets is required for withdrawal.
                    </p>

                    <div className="pt-4">
                        <Button
                            className="w-full text-lg font-bold bg-green-600 text-white rounded-lg px-8 py-4 transition-all duration-300 hover:bg-green-500 hover:scale-105 shadow-lg hover:shadow-green-500/30"
                        >
                            WITHDRAW
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}