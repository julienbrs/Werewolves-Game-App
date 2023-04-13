import { registerRootComponent } from "expo";
import { ExpoRoot } from "expo-router";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const App = () => {
  const ctx = require.context("./src/app");
  return (
    <QueryClientProvider client={queryClient}>
      <ExpoRoot context={ctx}/> 
    </QueryClientProvider>
  );
}


registerRootComponent(App);

