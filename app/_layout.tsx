import { SQLiteProvider } from "expo-sqlite";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from "./app";

export default function RootLayout() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView>
        <SQLiteProvider databaseName="data.db" assetSource={{ assetId: require('@/assets/data.db') }}>
          <App />
        </SQLiteProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
