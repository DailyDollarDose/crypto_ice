'use client';

import { Card, CardContent } from '@/components/ui/card';

export default function AdBanner() {
  return (
    <Card className="w-full h-24 bg-black/20 backdrop-blur-md border border-gray-700/50 flex items-center justify-center my-8">
      <CardContent className="p-0">
        <p className="text-gray-500 font-mono">Your Ad Banner Here</p>
      </CardContent>
    </Card>
  );
}
