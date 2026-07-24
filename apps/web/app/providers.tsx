"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useDomainStore } from "@/lib/store/domainStore";
import { useEffect, useState } from "react";
import { NavigationProgress } from "@/components/layout/NavigationProgress";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      })
  );

  useEffect(() => {
    void useDomainStore.persist.rehydrate();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationProgress />
      {children}
    </QueryClientProvider>
  );
}
