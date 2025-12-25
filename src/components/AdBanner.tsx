'use client';

import React, { useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';

export default function AdBanner() {
  const adContainerRef = useRef<HTMLDivElement>(null);
  const adLoadedRef = useRef(false);

  useEffect(() => {
    if (adLoadedRef.current || !adContainerRef.current) {
      return;
    }

    if (adContainerRef.current.innerHTML === '') {
      const configScript = document.createElement('script');
      configScript.innerHTML = `
        atOptions = {
          'key' : '8f7cc11831a63b8c153c0cbae77866ee',
          'format' : 'iframe',
          'height' : 90,
          'width' : 728,
          'params' : {}
        };
      `;
      adContainerRef.current.appendChild(configScript);

      const adScript = document.createElement('script');
      adScript.src = 'https://www.highperformanceformat.com/8f7cc11831a63b8c153c0cbae77866ee/invoke.js';
      adScript.async = true;
      adContainerRef.current.appendChild(adScript);

      adLoadedRef.current = true;
    }

    return () => {
      // Clean up scripts if component unmounts, though ad scripts often don't need cleanup
      if (adContainerRef.current) {
        adContainerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <Card className="w-full bg-black/20 backdrop-blur-md border border-gray-700/50 flex items-center justify-center my-8 min-h-[90px]">
      <CardContent className="p-0 w-full flex justify-center">
        <div ref={adContainerRef} className="max-w-[728px] w-full flex justify-center"></div>
      </CardContent>
    </Card>
  );
}
