import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import "./setup-fa";

const queryClient = new QueryClient();

interface AppProvidersProps {
  children: React.ReactNode;
}

function AppProviders({ children }: AppProvidersProps) {
  return (
      <QueryClientProvider client={queryClient}>
        {children}
        {process.env.NODE_ENV !== "test" && <ReactQueryDevtools />}
      </QueryClientProvider>
  );
}

export { AppProviders, queryClient };
