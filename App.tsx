import React, { useState, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import SplashScreen from './components/SplashScreen';
import HomeScreen from './components/HomeScreen';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = useCallback(() => {
    setShowSplash(false);
  }, []);

  if (showSplash) {
    return (
      <>
        <StatusBar style="dark" />
        <SplashScreen onFinish={handleSplashFinish} />
      </>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <HomeScreen />
    </>
  );
}
