'use client';

import { useState } from 'react';
import { useFirestore } from '@/firebase';
import { doc, collection, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import keysData from '@/../docs/generated-keys.json';
import { Progress } from '@/components/ui/progress';

export default function SeedPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleSeedDatabase = async () => {
    if (!firestore) {
      toast({
        title: 'Error',
        description: 'Firestore is not initialized.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setProgress(0);

    const keysToAdd = keysData.keys.slice(0, 500);
    const totalKeys = keysToAdd.length;

    try {
      const accessKeysRef = collection(firestore, 'accessKeys');
      for (let i = 0; i < totalKeys; i++) {
        const key = keysToAdd[i];
        const newKeyRef = doc(accessKeysRef);
        await setDoc(newKeyRef, {
          key: key,
          isValid: true,
          purchaseDate: new Date().toISOString(),
          deviceId: null,
          rewardLimit: 0,
          totalReward: 0,
        });
        setProgress(((i + 1) / totalKeys) * 100);
      }

      toast({
        title: 'Success!',
        description: `${keysToAdd.length} keys have been added to the database.`,
      });
      setIsDone(true);
    } catch (error) {
      console.error('Error seeding database:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      toast({
        title: 'Error Seeding Database',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
      <div className="max-w-md text-center p-8 w-full">
        <h1 className="text-2xl font-bold mb-4">Seed Firestore Database</h1>
        <p className="text-muted-foreground mb-6">
          Click the button below to add the 500 generated access keys from{' '}
          <code>docs/generated-keys.json</code> to your Firestore `accessKeys` collection.
        </p>
        <Button
          onClick={handleSeedDatabase}
          disabled={isLoading || isDone}
          className="w-full"
        >
          {isLoading ? 'Seeding...' : isDone ? 'Done!' : 'Seed Database'}
        </Button>
        {isLoading && (
            <div className="mt-4">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-muted-foreground mt-2">{Math.round(progress)}%</p>
            </div>
        )}
        {isDone && (
            <p className="mt-4 text-green-500">
                Database has been seeded successfully. You can now remove the <code>src/app/admin/seed</code> directory.
            </p>
        )}
      </div>
    </div>
  );
}
