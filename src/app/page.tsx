
'use client';

import ParticleAnimation from "@/components/particle-animation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { accessKeys } from "@/lib/access-keys";

export default function Home() {
  const router = useRouter();
  const [accessKey, setAccessKey] = useState('');
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessKeys.includes(accessKey)) {
      router.push('/dashboard');
    } else {
      toast({
        title: "Access Denied",
        description: "Please enter a valid access key.",
        variant: "destructive",
      })
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 relative overflow-hidden">
      <ParticleAnimation />
      <div className="z-10 flex flex-col items-center justify-center text-center max-w-lg w-full">
        <h1 className="text-4xl md:text-5xl font-bold tracking-[0.2em] uppercase text-foreground font-headline animate-fade-in-down">
          Welcome to the
        </h1>
        <h1 className="text-4xl md:text-5xl font-bold tracking-[0.15em] uppercase text-accent mb-8 font-headline animate-fade-in-up delay-200">
          Crypto Ice!
        </h1>

        <p className="text-lg text-muted-foreground mb-10 tracking-wider">
          Enter your key to continue
        </p>

        <form className="w-full flex flex-col items-center gap-6" onSubmit={handleLogin}>
          <Input
            type="password"
            placeholder="********************"
            className="w-full text-center tracking-widest bg-secondary/80 backdrop-blur-sm border-2 border-primary/50 h-14 rounded-full text-lg focus:ring-accent focus:ring-offset-background focus:ring-offset-2"
            aria-label="Access Key"
            value={accessKey}
            onChange={(e) => setAccessKey(e.target.value)}
          />
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              type="submit"
              size="lg"
              className="w-full rounded-full h-14 text-lg font-bold tracking-widest bg-primary/90 text-primary-foreground transition-all duration-300 hover:bg-primary hover:scale-105 hover:shadow-[0_0_20px_hsl(var(--primary))] shadow-[0_0_10px_hsl(var(--primary))]"
            >
              LOGIN
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full rounded-full h-14 text-lg font-bold tracking-widest bg-secondary/80 backdrop-blur-sm border-accent/50 text-accent transition-all duration-300 hover:scale-105 hover:bg-accent/20 hover:shadow-[0_0_20px_hsl(var(--accent))]"
            >
              Buy access
            </Button>
          </div>
        </form>

        <Link
          href="#"
          className="mt-12 text-muted-foreground hover:text-accent transition-colors tracking-wider"
        >
          Contact Support
        </Link>
      </div>
    </main>
  );
}
