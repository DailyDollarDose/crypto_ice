'use client';

import ParticleAnimation from "@/components/particle-animation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth, useFirestore, errorEmitter, FirestorePermissionError } from "@/firebase";
import { collection, query, where, getDocs, doc, setDoc, updateDoc } from "firebase/firestore";
import { signInAnonymously, onAuthStateChanged, User } from "firebase/auth";

export default function Home() {
  const router = useRouter();
  const [accessKey, setAccessKey] = useState('');
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let storedDeviceId = localStorage.getItem('deviceId');
    if (!storedDeviceId) {
      storedDeviceId = crypto.randomUUID();
      localStorage.setItem('deviceId', storedDeviceId);
    }
    setDeviceId(storedDeviceId);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, [auth]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser || !firestore || !deviceId) {
       toast({
        title: "Services not ready",
        description: "Please wait a moment and try again.",
        variant: "destructive",
      });
      return;
    }

    try {
      const accessKeysRef = collection(firestore, 'accessKeys');
      const q = query(accessKeysRef, where("key", "==", accessKey));
      const querySnapshot = await getDocs(q).catch(error => {
        const contextualError = new FirestorePermissionError({
          path: `accessKeys`,
          operation: 'list',
        });
        errorEmitter.emit('permission-error', contextualError);
        throw contextualError;
      });
      
      if (querySnapshot.empty) {
        toast({
          title: "Access Denied",
          description: "Invalid access key.",
          variant: "destructive",
        });
        return;
      }

      const keyDoc = querySnapshot.docs[0];
      const keyData = keyDoc.data();
      const keyDocRef = doc(firestore, 'accessKeys', keyDoc.id);

      if (keyData.deviceId && keyData.deviceId !== deviceId) {
        toast({
          title: "Access Denied",
          description: "This key is already registered to another device.",
          variant: "destructive",
        });
        return;
      }
      
      const updates: any = {};
      if (!keyData.deviceId) {
          updates.deviceId = deviceId;
      }

      if (keyData.rewardLimit === undefined || keyData.rewardLimit === 0) {
        updates.rewardLimit = Math.random() * 2 + 3; // Random limit between 3 and 5
        updates.totalReward = 0;
      }

      if (Object.keys(updates).length > 0) {
          await updateDoc(keyDocRef, updates).catch(error => {
            const contextualError = new FirestorePermissionError({
                path: keyDocRef.path,
                operation: 'update',
                requestResourceData: updates,
            });
            errorEmitter.emit('permission-error', contextualError);
            throw contextualError;
          });
      }


      localStorage.setItem('userAccessKey', accessKey);
      router.push('/dashboard');

    } catch (error: any) {
      if (error.name !== 'FirebaseError') {
        console.error("Login error:", error);
        toast({
            title: "Login Failed",
            description: "An unexpected error occurred. Please check your key and connection.",
            variant: "destructive",
        });
      }
    }
  };
  
  useEffect(() => {
    if(!isAuthReady) return;
    if(!user) {
        signInAnonymously(auth).catch((error) => {
          console.error("Anonymous sign-in failed:", error);
           toast({
            title: "Authentication Failed",
            description: "Could not connect to the authentication service.",
            variant: "destructive",
          });
        });
    }
  },[isAuthReady, user, auth, toast])

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
              disabled={!isAuthReady || !user}
              className="w-full rounded-full h-14 text-lg font-bold tracking-widest bg-primary/90 text-primary-foreground transition-all duration-300 hover:bg-primary hover:scale-105 hover:shadow-[0_0_20px_hsl(var(--primary))] shadow-[0_0_10px_hsl(var(--primary))]"
            >
              {isAuthReady && user ? 'LOGIN' : 'CONNECTING...'}
            </Button>
            <Link href="https://t.me/Crypto_ice_Team" target="_blank" rel="noopener noreferrer" className="w-full">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full rounded-full h-14 text-lg font-bold tracking-widest bg-secondary/80 backdrop-blur-sm border-accent/50 text-accent transition-all duration-300 hover:scale-105 hover:bg-accent/20 hover:shadow-[0_0_20px_hsl(var(--accent))]"
              >
                Buy access
              </Button>
            </Link>
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
