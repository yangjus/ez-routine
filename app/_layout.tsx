import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import App from "./app";

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <SQLiteProvider databaseName="data.db" assetSource={{ assetId: require('@/assets/data.db') }}>
        <App />
      </SQLiteProvider>
    </GestureHandlerRootView>
  );
}
