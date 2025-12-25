'use client';

import { useEffect, useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ShieldAlert } from 'lucide-react';

export default function AdBlockerDetector() {
  const [adBlockerDetected, setAdBlockerDetected] = useState(false);

  useEffect(() => {
    // Create a bait element
    const bait = document.createElement('div');
    bait.className = 'ad-banner text-ads ad-zone';
    bait.style.position = 'absolute';
    bait.style.height = '1px';
    bait.style.width = '1px';
    bait.style.top = '-1px';
    bait.style.left = '-1px';
    bait.style.pointerEvents = 'none';
    document.body.appendChild(bait);

    // Use a timeout to check if the element was blocked
    const checkTimer = setTimeout(() => {
      if (bait.offsetHeight === 0) {
        setAdBlockerDetected(true);
      }
      // Clean up the bait element
      document.body.removeChild(bait);
    }, 300);

    return () => {
      clearTimeout(checkTimer);
      if (document.body.contains(bait)) {
        document.body.removeChild(bait);
      }
    };
  }, []);

  return (
    <AlertDialog open={adBlockerDetected}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex justify-center mb-4">
            <ShieldAlert className="w-16 h-16 text-destructive" />
          </div>
          <AlertDialogTitle className="text-center text-2xl font-bold">
            Ad Blocker Detected
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-muted-foreground pt-2">
            It looks like you're using an ad blocker. This may prevent some parts of the application from working correctly.
            <br /><br />
            <strong>Please disable your ad blocker for this site to ensure full functionality.</strong>
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}
