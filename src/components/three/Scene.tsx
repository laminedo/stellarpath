import React, { Suspense } from 'react';

interface SceneProps {
  children: React.ReactNode;
  className?: string;
}

/** Wrapper providing a suspense boundary + loading fallback for 3D scenes. */
export function Scene({ children, className }: SceneProps) {
  return (
    <div className={className}>
      <Suspense
        fallback={
          <div className="flex h-full min-h-[16rem] w-full items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-nebula-purple border-t-transparent" />
          </div>
        }
      >
        {children}
      </Suspense>
    </div>
  );
}
