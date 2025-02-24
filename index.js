import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';
import { Asset } from 'expo-asset';

// Register assets
Asset.loadAsync(require('expo-router/assets/unmatched.png'));

// Must be exported or Fast Refresh won't update the context
export function App() {
  const ctx = require.context('./app');
  return <ExpoRoot context={ctx} />;
}

registerRootComponent(App);
